'use client';

import type { EdgeAttributes, NodeAttributes } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { Trie } from '@/lib/trie';
import { useRegisterEvents, useSetSettings, useSigma } from '@react-sigma/core';
import React, { useEffect, useRef, useState } from 'react';

export function GraphEvents({ disableHoverEffect }: { disableHoverEffect?: boolean }) {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma<NodeAttributes, EdgeAttributes>();
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [rightClickNode, setRightClickNode] = useState<string | null>(null);
  const hiddenNodes = useRef(new Array<string>());

  const defaultEdgeColor = useStore(state => state.defaultEdgeColor);

  useEffect(() => {
    const event = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        const graph = sigma.getGraph();
        const node = hiddenNodes.current.pop();
        if (node) {
          graph.removeNodeAttribute(node, 'hidden');
        }
      }
    };
    window.addEventListener('keydown', event);
    return () => window.removeEventListener('keydown', event);
  }, [sigma]);

  useEffect(() => {
    registerEvents({
      clickNode: e => {
        if (e.event.original.ctrlKey) {
          hiddenNodes.current.push(e.node);
          sigma.getGraph().setNodeAttribute(e.node, 'hidden', true);
        }
      },
      rightClickNode: e => {
        e.event.original.preventDefault();
        e.preventSigmaDefault();
        if (e.node === rightClickNode) {
          sigma.getGraph().setNodeAttribute(e.node, 'highlighted', false);
          sigma.getGraph().forEachNeighbor(rightClickNode, (_, attributes) => {
            attributes.highlighted = false;
          });
          setRightClickNode(null);
        } else {
          sigma.getGraph().forEachNeighbor(e.node, (_, attributes) => {
            attributes.highlighted = true;
          });
          sigma.getGraph().setNodeAttribute(e.node, 'highlighted', true);
          setRightClickNode(e.node);
        }
      },
      /* Node Hover Program */
      enterNode: e => setHoveredNode(e.node),
      leaveNode: () => setHoveredNode(null),
      enterEdge: e => {
        sigma.getGraph().setEdgeAttribute(e.edge, 'color', defaultEdgeColor);
        sigma.getGraph().setEdgeAttribute(e.edge, 'forceLabel', true);
      },
      leaveEdge: e => {
        sigma.getGraph().removeEdgeAttribute(e.edge, 'color');
        sigma.getGraph().removeEdgeAttribute(e.edge, 'forceLabel');
      },
      /* Drag'n'Drop Program */
      downNode: e => {
        setDraggedNode(e.node);
        sigma.getGraph().setNodeAttribute(e.node, 'highlighted', true);
      },
      // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
      mousemovebody: e => {
        if (!draggedNode) return;
        // Get new position of node
        const pos = sigma.viewportToGraph(e);
        sigma.getGraph().setNodeAttribute(draggedNode, 'x', pos.x);
        sigma.getGraph().setNodeAttribute(draggedNode, 'y', pos.y);

        // Prevent sigma to move camera:
        e.preventSigmaDefault();
        e.original.preventDefault();
        e.original.stopPropagation();
      },
      // On mouse up, we reset the autoscale and the dragging mode
      mouseup: () => {
        if (draggedNode) {
          setDraggedNode(null);
          sigma.getGraph().removeNodeAttribute(draggedNode, 'highlighted');
        }
      },
      // Disable the autoscale at the first down interaction
      mousedown: () => {
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
    });
  }, [registerEvents, rightClickNode, sigma, draggedNode, defaultEdgeColor]);

  const setSettings = useSetSettings();
  const defaultNodeSize = useStore(state => state.defaultNodeSize);
  const defaultNodeColor = useStore(state => state.defaultNodeColor);
  const defaultLabelRenderedSizeThreshold = useStore(state => state.defaultLabelRenderedSizeThreshold);

  useEffect(() => {
    setSettings({
      labelRenderedSizeThreshold: defaultLabelRenderedSizeThreshold,
    });
  }, [defaultLabelRenderedSizeThreshold, setSettings]);

  useEffect(() => {
    setSettings({
      defaultNodeColor,
    });
  }, [defaultNodeColor, setSettings]);

  useEffect(() => {
    setSettings({
      nodeReducer(node, data) {
        const graph = sigma.getGraph();
        const newData: typeof data = {
          ...data,
          size: data.size || defaultNodeSize,
          highlighted: data.highlighted || false,
        };
        if (!disableHoverEffect && hoveredNode) {
          if (
            node === hoveredNode
            // || graph.neighbors(hoveredNode).includes(node)
          ) {
            newData.highlighted = true;
          } else if (!graph.neighbors(hoveredNode).includes(node)) {
            newData.color = '#E2E2E2';
            newData.highlighted = false;
          }
        }
        return newData;
      },
      edgeReducer(edge, data) {
        const graph = sigma.getGraph();
        const newData: Record<string, string | number> = { ...data, size: data.size || 2 };
        if (!disableHoverEffect && hoveredNode) {
          if (!graph.extremities(edge).includes(hoveredNode)) {
            newData.color = '#ccc';
          } else {
            newData.color = defaultEdgeColor;
          }
        }
        return newData;
      },
    });
  }, [defaultNodeSize, defaultEdgeColor, hoveredNode, setSettings, sigma, disableHoverEffect]);

  const searchNodeQuery = useStore(state => state.nodeSearchQuery);
  const highlightedNodesRef = useRef(new Set<string>());
  const trieRef = useRef(new Trie<{ key: string; value: string }>());
  const graph = useStore(state => state.graph);

  useEffect(() => {
    if (!graph) return;
    const nodeArr = graph.nodes?.map(node => ({
      key: node.attributes?.label,
      value: node.key,
    })) as { key: string; value: string }[];
    if (!Array.isArray(nodeArr)) return;
    trieRef.current = Trie.fromArray(nodeArr, 'key');
  }, [graph]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (trieRef.current.size === 0) return;
    const geneNames = new Set(
      searchNodeQuery
        .split(/[\n,]/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => trieRef.current.get(s)?.value || s),
    ) as Set<string>;
    const graph = sigma.getGraph();

    const previousHighlightedNodes = highlightedNodesRef.current;
    for (const node of previousHighlightedNodes) {
      if (geneNames.has(node) || !graph.hasNode(node)) continue;
      graph.removeNodeAttribute(node, 'highlighted');
      graph.setNodeAttribute(node, 'color', defaultNodeColor);
    }
    for (const node of geneNames) {
      if (previousHighlightedNodes.has(node) || !graph.hasNode(node) || graph.getNodeAttribute(node, 'hidden') === true)
        continue;
      graph.setNodeAttribute(node, 'highlighted', true);
      graph.setNodeAttribute(node, 'color', 'blue');
    }
    highlightedNodesRef.current = geneNames;
  }, [searchNodeQuery]);

  return null;
}
