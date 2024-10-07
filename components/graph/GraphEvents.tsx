'use client';

import { useRegisterEvents, useSigma } from '@react-sigma/core';
import { useState, useEffect, useRef } from 'react';
import { EdgeTooltip } from './EdgeTooltip';
import { NodeTooltip } from './NodeTooltip';
import type { EdgeAttributes, NodeAttributes } from '@/lib/interface';
import { useStore } from '@/lib/store';
import TrieSearch from 'trie-search';

export function GraphEvents() {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma<NodeAttributes, EdgeAttributes>();
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  // const [hoveredNode, setHoveredNode] = useState<{node: NodeAttributes; x: number; y: number} | null>(null);
  // const [hoveredEdge, setHoveredEdge] = useState<{edge: EdgeAttributes; x: number; y: number} | null>(null);
  // const container = sigma.getContainer();

  useEffect(() => {
    registerEvents({
      // enterNode: (e) => {
      //   const node = sigma.getGraph().getNodeAttributes(e.node);
      //   const graphPos = sigma.graphToViewport({x: node.x, y: node.y});
      //   const x = graphPos.x * container.offsetWidth;
      //   const y = graphPos.y * container.offsetHeight;
      //   setHoveredNode({node, x , y});
      //   setHoveredEdge(null);
      // },
      // leaveNode: () => {
      //   setHoveredNode(null);
      // },
      // enterEdge: (e) => {
      //   const edge = sigma.getGraph().getEdgeAttributes(e.edge);
      //   const edgeExtremities = sigma.getGraph().extremities(e.edge);
      //   const sourceNode = sigma.getGraph().getNodeAttributes(edgeExtremities[0]);
      //   const targetNode = sigma.getGraph().getNodeAttributes(edgeExtremities[1]);
      //   const graphPos = sigma.graphToViewport({
      //     x: (sourceNode.x + targetNode.x) / 2,
      //     y: (sourceNode.y + targetNode.y) / 2,
      //   });
      //   const x = graphPos.x * container.offsetWidth;
      //   const y = graphPos.y * container.offsetHeight;
      //   setHoveredEdge({edge, x, y});
      //   setHoveredNode(null);
      // },
      // leaveEdge: () => {
      //   setHoveredEdge(null);
      // },

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

  const searchNodeQuery = useStore(state => state.nodeSearchQuery);
  const highlightedNodesRef = useRef(new Set<string>());

  useEffect(() => {
    const geneNames = new Set(
      searchNodeQuery
        .split(/[\n,]/)
        .map(s => s.trim())
        .filter(s => s.length > 0 && sigma.getGraph().hasNode(s))
    );
    console.log(geneNames);
    
    
    const previousHighlightedNodes = highlightedNodesRef.current;
    for (const node of previousHighlightedNodes) {
      if (geneNames.has(node)) continue;
      sigma.getGraph().removeNodeAttribute(node, 'highlighted');
    }
    for (const node of geneNames) {
      if (previousHighlightedNodes.has(node)) continue;
      sigma.getGraph().setNodeAttribute(node, 'highlighted', true);
    }
    highlightedNodesRef.current = geneNames;
  }, [searchNodeQuery, sigma]);

  return null;
}
