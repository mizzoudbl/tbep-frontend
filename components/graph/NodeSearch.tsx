'use client';

import { useStore } from '@/lib/store';
import { Trie } from '@/lib/trie';
import { useCamera, useSigma } from '@react-sigma/core';
import { useEffect, useRef } from 'react';

export function NodeSearch() {
  const sigma = useSigma();
  const searchNodeQuery = useStore(state => state.nodeSearchQuery);
  const highlightedNodesRef = useRef(new Set<string>());
  const trieRef = useRef(new Trie<{ key: string; value: string }>());
  const totalNodes = useStore(state => state.totalNodes);
  const defaultNodeColor = useStore(state => state.defaultNodeColor);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const nodeArr = sigma.getGraph().mapNodes((node, attributes) => ({
      key: attributes.label,
      value: node,
    })) as { key: string; value: string }[];
    if (!Array.isArray(nodeArr)) return;
    trieRef.current = Trie.fromArray(nodeArr, 'key');
  }, [totalNodes]);

  const { gotoNode } = useCamera();

  useEffect(() => {
    const graph = sigma.getGraph();
    if (trieRef.current.size === 0) return;
    const geneNames = new Set(
      searchNodeQuery
        .toUpperCase()
        .split(/[\n,]/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => trieRef.current.get(s)?.value || s),
    ) as Set<string>;

    const previousHighlightedNodes = highlightedNodesRef.current;
    for (const node of previousHighlightedNodes) {
      if (geneNames.has(node) || !graph.hasNode(node)) continue;
      graph.removeNodeAttribute(node, 'highlighted');
      graph.setNodeAttribute(node, 'type', 'circle');
      graph.setNodeAttribute(node, 'color', defaultNodeColor);
    }
    let count = 0;
    for (const node of geneNames) {
      if (previousHighlightedNodes.has(node) || !graph.hasNode(node) || graph.getNodeAttribute(node, 'hidden') === true)
        continue;
      graph.setNodeAttribute(node, 'type', 'border');
      graph.setNodeAttribute(node, 'highlighted', true);
      if (++count === geneNames.size) gotoNode(node, { duration: 100 });
    }
    highlightedNodesRef.current = geneNames;
  }, [searchNodeQuery, defaultNodeColor, gotoNode, sigma]);

  useEffect(() => {
    if (trieRef.current.size === 0) return;
    const prefix = searchNodeQuery.split(/[\n,]/).pop()?.trim() || '';
    if (prefix.length === 0) return;
    const suggestions = trieRef.current.search(prefix.toUpperCase()).map(s => s.key);
    useStore.setState({ nodeSuggestions: suggestions });
  }, [searchNodeQuery]);

  return null;
}
