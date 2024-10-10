'use client';

import type { EdgeAttributes, NodeAttributes, SelectionBox } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { Trie } from '@/lib/trie';
import { useCamera, useRegisterEvents, useSetSettings, useSigma } from '@react-sigma/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { drawSelectionBox, findNodesInSelection } from './canvas-brush';

export function GraphEvents() {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma<NodeAttributes, EdgeAttributes>();
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [rightClickNode, setRightClickNode] = useState<string | null>(null);
  const [_selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const hiddenNodes = useRef(new Array<string>());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleSelectedNodes = useCallback(
    (_selectedNodes: string[]) => {
      const graph = sigma.getGraph();
      const temp = _selectedNodes.map(node => ({
        Gene_Name: graph.getNodeAttribute(node, 'label') as string,
        ID: node,
        Description: graph.getNodeAttribute(node, 'description') as string,
      }));
      useStore.setState({ selectedNodes: temp });
    },
    [sigma],
  );

  const defaultEdgeColor = useStore(state => state.defaultEdgeColor);

  useEffect(() => {
    const event = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        const node = hiddenNodes.current.pop();
        if (node) {
          sigma.getGraph().removeNodeAttribute(node, 'hidden');
        }
      }
    };
    window.addEventListener('keydown', event);
    return () => window.removeEventListener('keydown', event);
  }, [sigma]);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (canvasRef.current) canvasRef.current.style.cursor = 'crosshair';
      setIsSelecting(true);
      const mousePosition = sigma.viewportToGraph({
        x: e.offsetX,
        y: e.offsetY,
      });

      setSelectionBox({
        startX: mousePosition.x,
        startY: mousePosition.y,
        endX: mousePosition.x,
        endY: mousePosition.y,
      });
    },
    [sigma],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isSelecting && selectionBox) {
        const mousePosition = sigma.viewportToGraph({
          x: e.offsetX,
          y: e.offsetY,
        });
        setSelectionBox({
          ...selectionBox,
          endX: mousePosition.x,
          endY: mousePosition.y,
        });

        // Draw selection rectangle
        if (!canvasRef.current) return;
        drawSelectionBox(sigma, canvasRef.current, {
          ...selectionBox,
          endX: mousePosition.x,
          endY: mousePosition.y,
        });

        // Find nodes within selection
        const selectedNodes = findNodesInSelection(sigma.getGraph(), {
          ...selectionBox,
          endX: mousePosition.x,
          endY: mousePosition.y,
        });
        setSelectedNodes(selectedNodes);
      }
    },
    [sigma, isSelecting, selectionBox],
  );

  const handleMouseUp = useCallback(() => {
    if (isSelecting) {
      setIsSelecting(false);
      setSelectionBox(null);

      // Clear the selection rectangle
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.style.cursor = 'default';
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      sigma.refresh();
      handleSelectedNodes(_selectedNodes);
    }
  }, [sigma, handleSelectedNodes, isSelecting, _selectedNodes]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!canvasRef.current) canvasRef.current = sigma.getCanvases().mouse;
    const graph = sigma.getGraph();
    registerEvents({
      /* Hide Node Program on Ctrl + Click */
      clickNode: e => {
        if (e.event.original.ctrlKey) {
          hiddenNodes.current.push(e.node);
          graph.setNodeAttribute(e.node, 'hidden', true);
        }
      },
      /* Highlight Neighbour program */
      rightClickNode: e => {
        e.event.original.preventDefault();
        e.preventSigmaDefault();
        if (e.node === rightClickNode) {
          graph.setNodeAttribute(e.node, 'highlighted', false);
          graph.forEachNeighbor(rightClickNode, (_, attributes) => {
            attributes.highlighted = false;
          });
          setRightClickNode(null);
        } else {
          graph.forEachNeighbor(e.node, (_, attributes) => {
            attributes.highlighted = true;
          });
          graph.setNodeAttribute(e.node, 'highlighted', true);
          setRightClickNode(e.node);
        }
      },

      /* Node Hover Program */
      enterNode: e => setHoveredNode(e.node),
      leaveNode: () => setHoveredNode(null),
      enterEdge: e => {
        graph.setEdgeAttribute(e.edge, 'color', defaultEdgeColor);
        graph.setEdgeAttribute(e.edge, 'forceLabel', true);
      },
      leaveEdge: e => {
        graph.removeEdgeAttribute(e.edge, 'color');
        graph.removeEdgeAttribute(e.edge, 'forceLabel');
      },
      /* Drag'n'Drop Program */
      downNode: e => {
        if (isSelecting) return;
        setDraggedNode(e.node);
        graph.setNodeAttribute(e.node, 'highlighted', true);
      },

      /* Node Selection Program also starts */
      // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
      mousemovebody: e => {
        if (!isSelecting && !draggedNode) return;
        if (isSelecting) {
          handleMouseMove(e.original);
        } else if (draggedNode) {
          const pos = sigma.viewportToGraph(e);
          // Get new position of node
          graph.setNodeAttribute(draggedNode, 'x', pos.x);
          graph.setNodeAttribute(draggedNode, 'y', pos.y);
        }
        // Prevent sigma to move camera:
        e.preventSigmaDefault();
        e.original.preventDefault();
        e.original.stopPropagation();
      },
      // On mouse up, we reset the autoscale and the dragging mode
      mouseup: () => {
        if (draggedNode) {
          setDraggedNode(null);
          graph.removeNodeAttribute(draggedNode, 'highlighted');
        } else {
          handleMouseUp();
        }
      },
      // Disable the autoscale at the first down interaction
      mousedown: e => {
        if (e.original.shiftKey) handleMouseDown(e.original);
        else {
          for (const node of _selectedNodes) {
            graph.setNodeAttribute(node, 'type', 'circle');
          }
          handleSelectedNodes([]);
        }
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
    });
  }, [
    registerEvents,
    rightClickNode,
    sigma,
    draggedNode,
    defaultEdgeColor,
    handleMouseUp,
    handleMouseDown,
    handleMouseMove,
  ]);

  const setSettings = useSetSettings();
  const defaultNodeSize = useStore(state => state.defaultNodeSize);
  const defaultNodeColor = useStore(state => state.defaultNodeColor);
  const defaultLabelRenderedSizeThreshold = useStore(state => state.defaultLabelRenderedSizeThreshold);
  const showEdgeLabel = useStore(state => state.showEdgeLabel);

  useEffect(() => {
    setSettings({
      labelRenderedSizeThreshold: defaultLabelRenderedSizeThreshold,
    });
  }, [defaultLabelRenderedSizeThreshold, setSettings]);

  useEffect(() => {
    setSettings({
      renderEdgeLabels: showEdgeLabel,
    });
  }, [showEdgeLabel, setSettings]);

  useEffect(() => {
    setSettings({
      defaultNodeColor,
    });
  }, [defaultNodeColor, setSettings]);

  useEffect(() => {
    const graph = sigma.getGraph();
    setSettings({
      nodeReducer(node, data) {
        const newData: typeof data = {
          ...data,
          size: data.size || defaultNodeSize,
        };
        if (hoveredNode) {
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
        const newData: Record<string, string | number> = { ...data, size: data.size || 2 };
        if (hoveredNode) {
          if (!graph.extremities(edge).includes(hoveredNode)) {
            newData.color = '#ccc';
          } else {
            newData.color = defaultEdgeColor;
          }
        }
        return newData;
      },
    });
  }, [defaultNodeSize, defaultEdgeColor, hoveredNode, setSettings, sigma]);

  const searchNodeQuery = useStore(state => state.nodeSearchQuery);
  const highlightedNodesRef = useRef(new Set<string>());
  const trieRef = useRef(new Trie<{ key: string; value: string }>());

  useEffect(() => {
    setTimeout(() => {
      const nodeArr = sigma.getGraph().mapNodes((node, attributes) => ({
        key: attributes.label,
        value: node,
      })) as { key: string; value: string }[];
      if (!Array.isArray(nodeArr)) return;
      trieRef.current = Trie.fromArray(nodeArr, 'key');
    }, 5000);
  }, [sigma]);

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
      graph.setNodeAttribute(node, 'color', defaultNodeColor);
    }
    let count = 0;
    for (const node of geneNames) {
      if (previousHighlightedNodes.has(node) || !graph.hasNode(node) || graph.getNodeAttribute(node, 'hidden') === true)
        continue;
      graph.setNodeAttribute(node, 'highlighted', true);
      graph.setNodeAttribute(node, 'color', 'blue');
      if (++count === geneNames.size) gotoNode(node, { duration: 100 });
    }
    highlightedNodesRef.current = geneNames;
  }, [searchNodeQuery, defaultNodeColor, gotoNode, sigma]);

  return null;
}
