class TrieNode<E> {
  children: Map<string, TrieNode<E>>;
  value: E | null;
  isEndOfKey: boolean;

  constructor() {
    this.children = new Map();
    this.value = null;
    this.isEndOfKey = false;
  }
}

export class Trie<E = string> {
  #root: TrieNode<E>;
  size: number;

  constructor() {
    this.#root = new TrieNode<E>();
    this.size = 0;
  }

  static fromArray<E>(array: E[], keyToIndex: string): Trie<E> {
    const trie = new Trie<E>();
    trie.addAll(array, keyToIndex);
    return trie;
  }

  add(input: E, keyToIndex?: string): void {
    if (typeof input === 'string' && keyToIndex === undefined) {
      // Handle direct string input
      this.#addString(input, input);
      this.size++;
    } else if (typeof input === 'object' && keyToIndex) {
      // Handle object input
      const key = this.#getValueByKey(input, keyToIndex);
      if (key) {
        this.#addString(key, input);
      }
      this.size++;
    } else {
      throw new Error('Invalid input parameters');
    }
  }

  #addString(key: string, value: E): void {
    let current = this.#root;

    for (const char of key) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      const temp = current.children.get(char);
      if (temp) current = temp;
    }

    current.isEndOfKey = true;
    current.value = value;
  }

  #getValueByKey(obj: E, key: string): string | null {
    if (!obj) return null;

    // Handle nested keys (e.g., "user.id")
    const keys = key.split('.');
    let value: Record<string, string> | string = obj;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return null;
      }
    }

    return typeof value === 'string' ? value : null;
  }

  addAll(objects: E[], keyToIndex: string): void {
    if (!Array.isArray(objects)) {
      throw new Error('First parameter must be an array');
    }

    for (const obj of objects) {
      this.add(obj, keyToIndex);
    }
  }

  get(searchTerm: string): E | null {
    let current = this.#root;

    for (const char of searchTerm) {
      if (!current.children.has(char)) {
        return null;
      }
      const temp = current.children.get(char);
      if (temp) current = temp;
    }

    return current.isEndOfKey ? current.value : null;
  }

  has(key: string): boolean {
    let current = this.#root;

    for (const char of key) {
      if (!current.children.has(char)) {
        return false;
      }
      const temp = current.children.get(char);
      if (temp) current = temp;
    }

    return current.isEndOfKey;
  }

  delete(key: string): void {
    this.#delete(this.#root, key, 0);
  }

  #delete(node: TrieNode<E>, key: string, depth: number): void {
    if (depth === key.length) {
      if (node.isEndOfKey) {
        node.isEndOfKey = false;
        node.value = null;
      }
      return;
    }

    const char = key.charAt(depth);
    const child = node.children.get(char);
    if (!child) {
      return;
    }

    this.#delete(child, key, depth + 1);

    if (child.children.size === 0 && !child.isEndOfKey) {
      node.children.delete(char);
    }
  }
}
