/**
 * Represents a search item with id and label.
 */
export interface SearchItem {
  id: string;
  label: string;
  description?: string;
}

/**
 * Extended search item with additional indexed properties for faster searching.
 */
interface IndexedItem extends SearchItem {
  lowerLabel: string;
  words: string[];
  idType: 'MONDO' | 'EFO' | 'HP' | 'OTHER';
  isGeneral: boolean;
}

/**
 * Internal search result type with score for ranking.
 */
interface SearchResult {
  item: SearchItem;
  score: number;
}

// Cache object for common regular expressions
const REGEX_CACHE = {
  wordSplitter: /[\s\-,()]+/,
  typeDetector: /type\s+\d+/i,
  wordBoundary: /[\s\-,()]/,
};

// Type preference ordering for tie-breaking
const TYPE_ORDER: Record<string, number> = {
  MONDO: 3,
  EFO: 2,
  HP: 1,
  OTHER: 0,
};

/**
 * A high-performance search engine optimized for medical terminology
 * Uses prefix maps and smart scoring for fast, relevant results
 */
export class OptimizedMedicalSearch {
  private indexedItems: IndexedItem[] = [];
  private prefixMap: Map<string, Set<IndexedItem>> = new Map();
  private wordStartMap: Map<string, Set<IndexedItem>> = new Map();
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * Create a new search engine instance with the provided items
   * @param items The items to index for searching
   */
  constructor(items: SearchItem[]) {
    if (items && items.length > 0) {
      this.buildIndex(items);
    }
  }

  /**
   * Add new items to the search index
   * @param items Additional items to index
   */
  public addItems(items: SearchItem[]): void {
    if (!items || items.length === 0) return;
    this.buildIndex(items);
  }

  /**
   * Clear the current search index
   */
  public clearIndex(): void {
    this.indexedItems = [];
    this.prefixMap.clear();
    this.wordStartMap.clear();
  }

  /**
   * Build or extend the search index with given items
   */
  private buildIndex(items: SearchItem[]): void {
    const newIndexedItems = items.map(item => {
      const lowerLabel = item.label.toLowerCase();
      const words = lowerLabel.split(REGEX_CACHE.wordSplitter).filter(w => w.length > 0);

      // Determine item type from ID prefix
      let idType: IndexedItem['idType'] = 'OTHER';
      if (item.id.startsWith('MONDO_')) idType = 'MONDO';
      else if (item.id.startsWith('EFO_')) idType = 'EFO';
      else if (item.id.startsWith('HP_')) idType = 'HP';

      return {
        ...item,
        lowerLabel,
        words,
        idType,
        isGeneral: !REGEX_CACHE.typeDetector.test(item.label),
      };
    });

    // Add to existing indexed items
    this.indexedItems = [...this.indexedItems, ...newIndexedItems];

    // Index new items by prefixes
    for (const item of newIndexedItems) {
      // Index by label prefixes (first 4 characters max)
      for (let i = 1; i <= Math.min(4, item.lowerLabel.length); i++) {
        const prefix = item.lowerLabel.substring(0, i);
        if (!this.prefixMap.has(prefix)) {
          this.prefixMap.set(prefix, new Set());
        }
        this.prefixMap.get(prefix)!.add(item);
      }

      // Index by word start prefixes (first 4 characters of each word)
      for (const word of item.words) {
        for (let i = 1; i <= Math.min(4, word.length); i++) {
          const prefix = word.substring(0, i);
          if (!this.wordStartMap.has(prefix)) {
            this.wordStartMap.set(prefix, new Set());
          }
          this.wordStartMap.get(prefix)!.add(item);
        }
      }
    }
  }

  /**
   * Get candidate items based on search prefix
   * Uses both direct prefix and word prefixes for comprehensive results
   */
  private getCandidates(searchTerm: string): Set<IndexedItem> {
    const lowerSearch = searchTerm.toLowerCase();
    const candidates = new Set<IndexedItem>();
    const maxLength = Math.min(4, lowerSearch.length);
    const searchPrefix = lowerSearch.substring(0, maxLength);

    // Get candidates from prefix map (items starting with search term)
    const prefixCandidates = this.prefixMap.get(searchPrefix);
    if (prefixCandidates) {
      for (const item of prefixCandidates) {
        candidates.add(item);
      }
    }

    // Get candidates from word start map (words starting with search term)
    const wordCandidates = this.wordStartMap.get(searchPrefix);
    if (wordCandidates) {
      for (const item of wordCandidates) {
        candidates.add(item);
      }
    }

    return candidates;
  }

  /**
   * Score an item based on how well it matches the search term
   * Uses multiple scoring factors for high-quality ranking
   */
  private quickScore(item: IndexedItem, searchTerm: string): number {
    const lowerSearch = searchTerm.toLowerCase();
    const { lowerLabel } = item;

    // Quick rejection if term isn't in item label
    if (!lowerLabel.includes(lowerSearch)) return 0;

    // Exact match gets highest score
    if (lowerLabel === lowerSearch) return 1000;

    // Base score + position-based bonuses
    let score = 10;
    const matchIndex = lowerLabel.indexOf(lowerSearch);

    // Boosters for match position quality
    if (matchIndex === 0) {
      // Starts with search term
      score += 500;
    } else if (matchIndex > 0 && REGEX_CACHE.wordBoundary.test(lowerLabel[matchIndex - 1])) {
      // Word boundary match (not first character)
      score += 300;
    }

    // Quality bonuses
    score += (TYPE_ORDER[item.idType] || 0) * 10; // Preferred ID types
    score += item.isGeneral ? 20 : 0; // General terms (without "type X")
    score += Math.max(0, 50 - matchIndex); // Earlier matches are better
    score -= Math.max(0, (lowerLabel.length - searchTerm.length) * 0.1); // Shorter labels preferred

    return score;
  }

  /**
   * Perform a search with the given term
   * @param searchTerm The term to search for
   * @param maxResults Maximum number of results to return
   * @returns Array of matching search items, sorted by relevance
   */
  public search(searchTerm: string, maxResults = 50): SearchItem[] {
    // Early rejection for empty or too-short queries
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm || trimmedTerm.length < 2) {
      return [];
    }

    // Get candidate set (much smaller than full index)
    const candidates = this.getCandidates(trimmedTerm);

    // Score only candidates - preallocate array for performance
    const scored: SearchResult[] = [];
    for (const item of candidates) {
      const score = this.quickScore(item, trimmedTerm);
      if (score > 0) {
        scored.push({ item, score });
      }
    }

    // Sort by score (descending) with type-based tie breaking
    scored.sort((a, b) => {
      // Main score comparison
      if (b.score !== a.score) return b.score - a.score;

      // Tie breakers
      const aItem = a.item as IndexedItem;
      const bItem = b.item as IndexedItem;

      // Compare by type preference
      if (aItem.idType !== bItem.idType) {
        return (TYPE_ORDER[bItem.idType] || 0) - (TYPE_ORDER[aItem.idType] || 0);
      }

      // Default to alphabetical order
      return aItem.label.localeCompare(bItem.label);
    });

    // Return mapped items limited to max results
    return scored.slice(0, maxResults).map(s => s.item);
  }

  /**
   * Perform a search with debounce for better UX during typing
   * @param searchTerm Search term
   * @param callback Callback to receive results
   * @param delay Debounce delay in ms
   */
  public debouncedSearch(searchTerm: string, callback: (results: SearchItem[]) => void, delay = 150): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      const results = this.search(searchTerm);
      callback(results);
    }, delay);
  }
}
