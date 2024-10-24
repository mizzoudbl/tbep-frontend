'use client';

import type { EdgeAttributes, NodeAttributes, SelectionBox } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { useRegisterEvents, useSetSettings, useSigma } from '@react-sigma/core';
import { downloadAsImage } from '@sigma/export-image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { drawSelectionBox, findNodesInSelection } from './canvas-brush';

export function GraphEvents() {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma<NodeAttributes, EdgeAttributes>();
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [_selectedNodes, setSelectedNodes] = useState<string[]>([]);
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
    setIsSelecting(false);
    setSelectionBox(null);

    // Clear the selection rectangle
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.cursor = 'default';
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    handleSelectedNodes(_selectedNodes);
  }, [handleSelectedNodes, _selectedNodes]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!canvasRef.current) canvasRef.current = sigma.getCanvases().mouse;
    const graph = sigma.getGraph();
    registerEvents({
      /* Node Hover Program */
      enterNode: e => setHoveredNode(e.node),
      leaveNode: () => setHoveredNode(null),
      enterEdge: e => {
        graph.setEdgeAttribute(e.edge, 'altColor', graph.getEdgeAttribute(e.edge, 'color'));
        graph.setEdgeAttribute(e.edge, 'color', defaultEdgeColor);
        graph.setEdgeAttribute(e.edge, 'forceLabel', true);
        for (const node of graph.extremities(e.edge)) {
          graph.setNodeAttribute(node, 'type', 'border');
          graph.setNodeAttribute(node, 'highlighted', true);
        }
      },
      leaveEdge: e => {
        graph.setEdgeAttribute(e.edge, 'color', graph.getEdgeAttribute(e.edge, 'altColor'));
        graph.setEdgeAttribute(e.edge, 'forceLabel', false);
        for (const node of graph.extremities(e.edge)) {
          graph.setNodeAttribute(node, 'type', 'circle');
          graph.setNodeAttribute(node, 'highlighted', false);
        }
      },
      /* Drag'n'Drop Program */
      downNode: e => {
        if (isSelecting) return;
        setDraggedNode(e.node);
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
        } else if (isSelecting) {
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
          setSelectedNodes([]);
          handleSelectedNodes([]);
        }
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
    });
  }, [registerEvents, sigma, draggedNode, defaultEdgeColor, handleMouseUp, handleMouseDown, handleMouseMove]);

  const setSettings = useSetSettings<NodeAttributes, EdgeAttributes>();
  const defaultNodeSize = useStore(state => state.defaultNodeSize);
  const defaultNodeColor = useStore(state => state.defaultNodeColor);
  const defaultlabelDensity = useStore(state => state.defaultlabelDensity);
  const showEdgeLabel = useStore(state => state.showEdgeLabel);
  const selectedRadioNodeSize = useStore(state => state.selectedRadioNodeSize);
  const selectedNodeSizeProperty = useStore(state => state.selectedNodeSizeProperty);

  useEffect(() => {
    setSettings({
      labelDensity: defaultlabelDensity,
    });
  }, [defaultlabelDensity, setSettings]);

  useEffect(() => {
    setSettings({
      renderEdgeLabels: showEdgeLabel,
    });
  }, [showEdgeLabel, setSettings]);

  useEffect(() => {
    if (!sigma) return;
    sigma.getGraph().updateEachNodeAttributes((node, attr) => {
      attr.color = defaultNodeColor;
      return attr;
    });
  }, [defaultNodeColor, sigma]);

  const prevNodeSize = useRef(5);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!sigma || !defaultNodeSize) return;
    if (selectedRadioNodeSize !== 'None' && selectedNodeSizeProperty) {
      sigma.getGraph().updateEachNodeAttributes((_, attr) => {
        if (attr.size === 0.5) return attr;
        if (attr.size) attr.size += (defaultNodeSize - prevNodeSize.current) / 5;
        return attr;
      });
    } else {
      sigma.getGraph().updateEachNodeAttributes((_, attr) => {
        attr.size = defaultNodeSize;
        return attr;
      });
    }
    prevNodeSize.current = defaultNodeSize;
  }, [defaultNodeSize, sigma]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const graph = sigma.getGraph();
    setSettings({
      nodeReducer(node, data) {
        if (!data.x) data.x = Math.random() * 1000;
        if (!data.y) data.y = Math.random() * 1000;
        if (!data.size) data.size = defaultNodeSize;
        if (hoveredNode) {
          if (
            node === hoveredNode
            // || graph.neighbors(hoveredNode).includes(node)
          ) {
            data.highlighted = true;
          } else if (!graph.neighbors(hoveredNode).includes(node)) {
            data.color = '#E2E2E2';
            data.highlighted = false;
          }
        }
        return data;
      },
      edgeReducer(edge, data) {
        if (hoveredNode) {
          if (!graph.extremities(edge).includes(hoveredNode)) {
            data.color = '#ccc';
          } else {
            data.color = defaultEdgeColor;
          }
        }
        return {
          color: data.color,
          forceLabel: data.forceLabel,
          hidden: data.hidden,
          label: data.score?.toString(),
          size: data.size,
        };
      },
    });
  }, [defaultEdgeColor, hoveredNode, setSettings, sigma]);

  const exportFormat = useStore(state => state.exportFormat);
  const projectTitle = useStore(state => state.projectTitle);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!exportFormat || !sigma) return;
    if (exportFormat === 'json') {
      const serializedGraph = sigma.getGraph().export();
      const json = JSON.stringify(serializedGraph, null, 2);
      const element = document.createElement('a');
      const file = new Blob([json], { type: 'application/json' });
      element.href = URL.createObjectURL(file);
      element.download = projectTitle;
      document.body.appendChild(element);
      element.click();
      URL.revokeObjectURL(element.href);
      element.remove();
      return;
    }
    downloadAsImage(sigma, {
      format: exportFormat,
      fileName: projectTitle,
      backgroundColor: 'white',
    });
  }, [exportFormat]);

  return null;
}
