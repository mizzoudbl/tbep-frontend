'use client';

import {
  DISEASE_DEPENDENT_PROPERTIES,
  type DiseaseDependentProperties,
  HIGHLIGHTED_EDGE_COLOR,
  type NodeColorType,
  type NodeSizeType,
} from '@/lib/data';
import { useStore } from '@/lib/hooks';
import type { CommonSection, EdgeAttributes, NodeAttributes, OtherSection, SelectionBox } from '@/lib/interface';
import { Trie } from '@/lib/trie';
import { cn } from '@/lib/utils';
import { useCamera, useRegisterEvents, useSigma } from '@react-sigma/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { drawSelectionBox, findNodesInSelection } from './canvas-brush';

export function GraphEvents({
  clickedNodesRef,
  highlightedNodesRef,
}: {
  clickedNodesRef?: React.MutableRefObject<Set<string>>;
  highlightedNodesRef: React.MutableRefObject<Set<string>>;
}) {
  const sigma = useSigma<NodeAttributes, EdgeAttributes>();
  const nodeSearchQuery = useStore(state => state.nodeSearchQuery);
  const trieRef = useRef(new Trie<{ key: string; value: string }>());
  const totalNodes = useStore(state => state.totalNodes);

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const graph = sigma.getGraph();
    if (trieRef.current.size === 0) return;
    const geneNames = new Set(
      nodeSearchQuery
        .toUpperCase()
        .split(/[\n,]/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => trieRef.current.get(s)?.value || s)
        .filter(s => graph.hasNode(s)),
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
      graph.setNodeAttribute(node, 'type', 'highlight');
      graph.setNodeAttribute(node, 'highlighted', true);
      if (++count === geneNames.size) gotoNode(node, { duration: 100 });
    }
    highlightedNodesRef.current = geneNames;
  }, [nodeSearchQuery, gotoNode, sigma]);

  useEffect(() => {
    if (trieRef.current.size === 0) return;
    const prefix = nodeSearchQuery.split(/[\n,]/).pop()?.trim() || '';
    if (prefix.length === 0) return;
    const suggestions = trieRef.current.search(prefix.toUpperCase()).map(s => s.key);
    useStore.setState({ nodeSuggestions: suggestions });
  }, [nodeSearchQuery]);

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
    [sigma, isSelecting, selectionBox, highlightedNodesRef],
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
        graph.updateEdgeAttributes(e.edge, attr => {
          attr.altColor = attr.color;
          attr.color = HIGHLIGHTED_EDGE_COLOR;
          attr.forceLabel = true;

          return attr;
        });
        for (const node of graph.extremities(e.edge)) {
          graph.updateNodeAttributes(node, attr => {
            attr.type = 'border';
            attr.highlighted = true;
            return attr;
          });
        }
      },
      leaveEdge: e => {
        graph.updateEdgeAttributes(e.edge, attr => {
          attr.color = attr.altColor;
          attr.forceLabel = false;
          return attr;
        });
        for (const node of graph.extremities(e.edge)) {
          graph.updateNodeAttributes(node, attr => {
            if (highlightedNodesRef.current.has(node)) {
              attr.type = 'highlight';
            } else {
              attr.type = 'circle';
              attr.highlighted = false;
            }
            return attr;
          });
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
        if (clickedNode) {
          clickedNodesRef?.current.delete(clickedNode);
          graph.forEachNeighbor(clickedNode, (neighbor, attr) => {
            clickedNodesRef?.current.delete(neighbor);
            if (highlightedNodesRef.current.has(neighbor)) return;
            attr.type = 'circle';
            attr.highlighted = false;
          });
          if (highlightedNodesRef.current.has(clickedNode)) {
            graph.setNodeAttribute(clickedNode, 'type', 'highlight');
          } else {
            graph.setNodeAttribute(clickedNode, 'highlighted', false);
            graph.setNodeAttribute(clickedNode, 'type', 'circle');
          }
          setClickedNode(null);
          sigma.refresh();
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
        }
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
      clickNode: e => {
        const graph = sigma.getGraph();
        if (!e.event.original.shiftKey) e.event.original.stopPropagation();
        if (e.event.original.ctrlKey) {
          highlightedNodesRef.current.add(e.node);
          const trimmedQuery = nodeSearchQuery.trim();
          const node = graph.getNodeAttribute(e.node, 'label');
          const appendedQuery = trimmedQuery ? trimmedQuery.replace(/[,\s]*$/, `, ${node},`) : `${node},`;
          useStore.setState({ nodeSearchQuery: appendedQuery });
        }
        setClickedNode(node => {
          if (node) {
            clickedNodesRef?.current.delete(node);
            graph.forEachNeighbor(node, (neighbor, attr) => {
              clickedNodesRef?.current.delete(neighbor);
              if (highlightedNodesRef.current.has(neighbor)) return;
              attr.type = 'circle';
              attr.highlighted = false;
            });
          }
          clickedNodesRef?.current.add(e.node);
          graph.setNodeAttribute(e.node, 'type', 'border');
          graph.setNodeAttribute(e.node, 'highlighted', true);
          if (highlightNeighborNodes) {
            graph.forEachNeighbor(e.node, (neighbor, attr) => {
              clickedNodesRef?.current.add(neighbor);
              attr.type = 'border';
              attr.highlighted = true;
            });
          }
          return e.node;
        });
      },
    });
  }, [registerEvents, sigma, draggedNode, handleMouseUp, handleMouseDown, handleMouseMove]);

  const highlightNeighborNodes = useStore(state => state.highlightNeighborNodes);
  const [clickedNode, setClickedNode] = useState<string | null>(null);
  const universalData = useStore(state => state.universalData);
  const selectedRadioNodeColor = useStore(state => state.selectedRadioNodeColor);
  const selectedNodeSizeProperty = useStore(state => state.selectedNodeSizeProperty);
  const selectedRadioNodeSize = useStore(state => state.selectedRadioNodeSize);
  const selectedNodeColorProperty = useStore(state => state.selectedNodeColorProperty);
  const diseaseName = useStore(state => state.diseaseName);
  const radioOptions = useStore(state => state.radioOptions);

  const propertyResolve = useCallback(
    (node: string, selectedRadio: NodeColorType | NodeSizeType | undefined, selectedProperty: string | Set<string>) => {
      if (!selectedRadio || !selectedProperty) return <></>;
      const diseaseNameOrCommon = DISEASE_DEPENDENT_PROPERTIES?.includes(selectedRadio as DiseaseDependentProperties)
        ? diseaseName
        : 'common';
      const userRadioArr = radioOptions.user[selectedRadio];
      if (typeof selectedProperty === 'string') {
        const value = (
          universalData[node]?.[
            userRadioArr?.includes(selectedProperty) ? 'user' : diseaseNameOrCommon
          ] as OtherSection & CommonSection
        )?.[selectedRadio]?.[selectedProperty];
        return (
          <div>
            <h3 className='font-bold break-words'>{selectedProperty}</h3>
            <p className={cn(value ? 'italic' : '')}>{value || 'N/A'}</p>
          </div>
        );
      }
      const values = selectedProperty.size
        ? Array.from(selectedProperty).map(prop => {
            const value = (
              universalData[node]?.[userRadioArr?.includes(prop) ? 'user' : diseaseNameOrCommon] as OtherSection &
                CommonSection
            )?.[selectedRadio]?.[prop];
            return (
              <div key={prop}>
                <h3 className='font-bold break-words'>{prop}</h3>
                <p className={cn(value ? 'italic' : '')}>{value || 'N/A'}</p>
              </div>
            );
          })
        : null;
      return values;
    },
    [diseaseName, universalData, radioOptions],
  );

  return (
    <>
      {clickedNode && (
        <div className='absolute top-0 right-0 space-y-1 text-xs shadow rounded border backdrop-blur p-1 m-1 w-80 max-h-[80vh] overflow-y-auto'>
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
          {propertyResolve(clickedNode, selectedRadioNodeColor, selectedNodeColorProperty)}
          {propertyResolve(clickedNode, selectedRadioNodeSize, selectedNodeSizeProperty)}
        </div>
      )}
    </>
  );
}
