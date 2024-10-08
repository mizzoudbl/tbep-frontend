'use client';

import type { EdgeAttributes, NodeAttributes, TrieElement } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { useRegisterEvents, useSetSettings, useSigma } from '@react-sigma/core';
import { useEffect, useRef, useState } from 'react';
import { EdgeDisplayData } from 'sigma/types';

export function GraphEvents({ disableHoverEffect }: { disableHoverEffect?: boolean }) {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma<NodeAttributes, EdgeAttributes>();
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    registerEvents({
      /* Node Hover Program */
      enterNode: event => setHoveredNode(event.node),
      leaveNode: () => setHoveredNode(null),

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
  }, [registerEvents, sigma, draggedNode]);

  const setSettings = useSetSettings();
  const defaultNodeSize = useStore(state => state.defaultNodeSize);
  const defaultNodeColor = useStore(state => state.defaultNodeColor);

  useEffect(() => {
    setSettings({
      nodeReducer(node, data) {
        const graph = sigma.getGraph();
        const newData: typeof data = {
          ...data,
          color: data.color || defaultNodeColor,
          size: data.size || defaultNodeSize,
          highlighted: data.highlighted || false,
        };
        if (!disableHoverEffect && hoveredNode) {
          if (node === hoveredNode || graph.neighbors(hoveredNode).includes(node)) {
            newData.highlighted = true;
          } else {
            newData.color = '#E2E2E2';
            newData.highlighted = false;
          }
        }
        return newData;
      },
      edgeReducer(edge, data) {
        const graph = sigma.getGraph();
        const newData = { ...data };
        if (!disableHoverEffect && hoveredNode) {
          if (!graph.extremities(edge).includes(hoveredNode)) {
            newData.color = '#ccc';
          } else {
            newData.color = 'blue';
          }
        }
        return newData;
      },
    });
  }, [defaultNodeColor, defaultNodeSize, hoveredNode, setSettings, sigma, disableHoverEffect]);

  const searchNodeQuery = useStore(state => state.nodeSearchQuery);
  const highlightedNodesRef = useRef(new Set<string>());

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const geneNames = new Set(
      searchNodeQuery
        .split(/[\n,]/)
        .map(s => s.trim())
        .filter(s => s.length > 0 && sigma.getGraph().hasNode(s)),
    );
    const previousHighlightedNodes = highlightedNodesRef.current;
    for (const node of previousHighlightedNodes) {
      if (geneNames.has(node)) continue;
      sigma.getGraph().removeNodeAttribute(node, 'highlighted');
      sigma.getGraph().setNodeAttribute(node, 'color', defaultNodeColor);
    }
    for (const node of geneNames) {
      if (previousHighlightedNodes.has(node)) continue;
      sigma.getGraph().setNodeAttribute(node, 'highlighted', true);
      sigma.getGraph().setNodeAttribute(node, 'color', 'blue');
    }
    highlightedNodesRef.current = geneNames;
  }, [searchNodeQuery]);

  return null;
}
