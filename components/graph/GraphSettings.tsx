'use client';

import { DEFAULT_EDGE_COLOR, FADED_EDGE_COLOR, HIGHLIGHTED_EDGE_COLOR } from '@/lib/data';
import { useStore } from '@/lib/hooks';
import type { EdgeAttributes, NodeAttributes } from '@/lib/interface';
import { useSetSettings, useSigma } from '@react-sigma/core';
import { downloadAsImage } from '@sigma/export-image';
import { useCallback, useEffect, useState } from 'react';

export function GraphSettings({ clickedNodesRef }: { clickedNodesRef?: React.MutableRefObject<Set<string>> }) {
  const sigma = useSigma<NodeAttributes, EdgeAttributes>();
  const [hoveredNode, setHoveredNode] = useState<{ node: string; ctrlKey: boolean } | null>(null);

  const setSettings = useSetSettings<NodeAttributes, EdgeAttributes>();
  const defaultNodeSize = useStore(state => state.defaultNodeSize);
  const defaultNodeColor = useStore(state => state.defaultNodeColor);
  const defaultLabelDensity = useStore(state => state.defaultLabelDensity);
  const defaultLabelSize = useStore(state => state.defaultLabelSize);
  const showEdgeLabel = useStore(state => state.showEdgeLabel);
  const selectedRadioNodeSize = useStore(state => state.selectedRadioNodeSize);
  const selectedNodeSizeProperty = useStore(state => state.selectedNodeSizeProperty);
  const highlightNeighborNodes = useStore(state => state.highlightNeighborNodes);
  const edgeOpacity = useStore(state => state.edgeOpacity);

  useEffect(() => {
    const opacityChangedColor = DEFAULT_EDGE_COLOR.replace(/[\d.]+\)$/, `${edgeOpacity})`);
    setSettings({
      defaultEdgeColor: opacityChangedColor,
    });
  }, [edgeOpacity, setSettings]);

  useEffect(() => {
    sigma.on('enterNode', e => setHoveredNode({ node: e.node, ctrlKey: e.event.original.ctrlKey }));
    sigma.on('leaveNode', () => setHoveredNode(null));
  }, [sigma]);

  useEffect(() => {
    setSettings({
      labelDensity: defaultLabelDensity,
    });
  }, [defaultLabelDensity, setSettings]);

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
    setSettings({
      labelSize: defaultLabelSize,
    });
  }, [defaultLabelSize, setSettings]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!sigma || !defaultNodeSize) return;
    if (selectedRadioNodeSize && selectedNodeSizeProperty) {
      sigma.getGraph().updateEachNodeAttributes((_, attr) => {
        if (attr.size === 0.5) return attr;
        attr.size = defaultNodeSize;
        return attr;
      });
    } else {
      sigma.getGraph().updateEachNodeAttributes((_, attr) => {
        attr.size = defaultNodeSize;
        return attr;
      });
    }
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
          if (node === hoveredNode.node) {
            data.highlighted = true;
            data.type = 'circle';
          } else if (
            clickedNodesRef?.current.has(node) ||
            ((highlightNeighborNodes || hoveredNode.ctrlKey) && graph.neighbors(hoveredNode.node).includes(node))
          ) {
            data.highlighted = true;
            data.type = 'border';
          } else {
            data.color = '#E2E2E2';
            data.highlighted = false;
          }
        }
        return data;
      },
      edgeReducer(edge, data) {
        if (hoveredNode) {
          if (graph.extremities(edge).includes(hoveredNode.node)) {
            data.color = HIGHLIGHTED_EDGE_COLOR;
            data.zIndex = 100;
          } else {
            data.color = FADED_EDGE_COLOR;
          }
        }
        return data;
      },
    });
  }, [hoveredNode, setSettings, sigma]);

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
