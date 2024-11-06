'use client';

import {
  type DiseaseDependentProperties,
  type DiseaseIndependentProperties,
  diseaseDependentProperties,
} from '@/lib/data';
import type { EdgeAttributes, NodeAttributes, SelectionBox } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { Trie } from '@/lib/trie';
import { cn } from '@/lib/utils';
import { useCamera, useRegisterEvents, useSigma } from '@react-sigma/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { drawSelectionBox, findNodesInSelection } from './canvas-brush';

export function GraphEvents() {
  const sigma = useSigma<NodeAttributes, EdgeAttributes>();
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
  }, [searchNodeQuery, gotoNode, sigma]);

  useEffect(() => {
    if (trieRef.current.size === 0) return;
    const prefix = searchNodeQuery.split(/[\n,]/).pop()?.trim() || '';
    if (prefix.length === 0) return;
    const suggestions = trieRef.current.search(prefix.toUpperCase()).map(s => s.key);
    useStore.setState({ nodeSuggestions: suggestions });
  }, [searchNodeQuery]);

  const registerEvents = useRegisterEvents();
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
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
        const selectedNodes = findNodesInSelection(
          sigma.getGraph(),
          {
            ...selectionBox,
            endX: mousePosition.x,
            endY: mousePosition.y,
          },
          highlightedNodesRef.current,
        );
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
    if (_selectedNodes.length) handleSelectedNodes(_selectedNodes);
  }, [handleSelectedNodes, _selectedNodes]);

  //   biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!canvasRef.current) canvasRef.current = sigma.getCanvases().mouse;
    const graph = sigma.getGraph();
    registerEvents({
      /* Node Hover Program */
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
          if (highlightedNodesRef.current.has(node)) continue;
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
            if (highlightedNodesRef.current.has(node)) continue;
            graph.setNodeAttribute(node, 'type', 'circle');
          }
          setSelectedNodes([]);
          handleSelectedNodes([]);
          if (clickedNode) graph.setNodeAttribute(clickedNode, 'type', 'circle');
          setClickedNode(null);
        }
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
      clickNode: e => {
        setClickedNode(e.node);
      },
    });
  }, [registerEvents, sigma, draggedNode, handleMouseUp, handleMouseDown, handleMouseMove]);

  const [clickedNode, setClickedNode] = useState<string | null>(null);
  const universalData = useStore(state => state.universalData);
  const selectedRadioNodeColor = useStore(state => state.selectedRadioNodeColor);
  const selectedNodeSizeProperty = useStore(state => state.selectedNodeSizeProperty);
  const selectedRadioNodeSize = useStore(state => state.selectedRadioNodeSize);
  const selectedNodeColorProperty = useStore(state => state.selectedNodeColorProperty);
  const diseaseName = useStore(state => state.diseaseName);

  return (
    <>
      {clickedNode && (
        <div className='absolute top-0 right-0 space-y-1 text-xs shadow rounded border backdrop-blur p-1 m-1 w-40'>
          <div>
            <h3 className='font-bold'>Ensembl ID</h3>
            <p>{clickedNode}</p>
          </div>
          <div>
            <h3 className='font-bold'>Gene Name</h3>
            <p>{clickedNode ? sigma.getGraph().getNodeAttribute(clickedNode, 'label') : 'No Node Selected'}</p>
          </div>
          <div>
            <h3 className='font-bold'>Description</h3>
            <p>{clickedNode ? sigma.getGraph().getNodeAttribute(clickedNode, 'description') : 'No Node Selected'}</p>
          </div>
          <div>
            <h3 className={cn('font-bold break-words', selectedNodeColorProperty ? '' : 'italic')}>
              {selectedNodeColorProperty || 'Not Selected'}
            </h3>
            {selectedRadioNodeColor && selectedNodeColorProperty ? (
              <p>
                {diseaseDependentProperties.includes(selectedRadioNodeColor as DiseaseDependentProperties)
                  ? universalData?.[clickedNode][diseaseName]?.[selectedRadioNodeColor as DiseaseDependentProperties][
                      selectedNodeColorProperty
                    ]
                  : universalData?.[clickedNode].common[selectedRadioNodeColor as DiseaseIndependentProperties][
                      selectedNodeColorProperty
                    ]}
              </p>
            ) : (
              <p className='italic'>null</p>
            )}
          </div>
          <div>
            <h3 className={cn('font-bold break-words', selectedNodeSizeProperty ? '' : 'italic')}>
              {selectedNodeSizeProperty || 'Not Selected'}
            </h3>

            {selectedRadioNodeSize && selectedNodeSizeProperty ? (
              <p>
                {diseaseDependentProperties.includes(selectedRadioNodeSize as DiseaseDependentProperties)
                  ? universalData?.[clickedNode][diseaseName]?.[selectedRadioNodeSize as DiseaseDependentProperties][
                      selectedNodeSizeProperty
                    ]
                  : universalData?.[clickedNode].common[selectedRadioNodeSize as DiseaseIndependentProperties][
                      selectedNodeSizeProperty
                    ]}
              </p>
            ) : (
              <p className='italic'>null</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
