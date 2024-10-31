'use client';

import type { EdgeAttributes, NodeAttributes } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { useSetSettings, useSigma } from '@react-sigma/core';
import { downloadAsImage } from '@sigma/export-image';
import { useEffect, useRef, useState } from 'react';

export function GraphSettings() {
  const sigma = useSigma<NodeAttributes, EdgeAttributes>();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const setSettings = useSetSettings<NodeAttributes, EdgeAttributes>();
  const defaultNodeSize = useStore(state => state.defaultNodeSize);
  const defaultNodeColor = useStore(state => state.defaultNodeColor);
  const defaultEdgeColor = useStore(state => state.defaultEdgeColor);
  const defaultlabelDensity = useStore(state => state.defaultlabelDensity);
  const showEdgeLabel = useStore(state => state.showEdgeLabel);
  const selectedRadioNodeSize = useStore(state => state.selectedRadioNodeSize);
  const selectedNodeSizeProperty = useStore(state => state.selectedNodeSizeProperty);

  useEffect(() => {
    sigma.on('enterNode', e => setHoveredNode(e.node));
    sigma.on('leaveNode', () => setHoveredNode(null));
  }, [sigma]);

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
    setSettings({
      defaultNodeColor,
    });
  }, [defaultNodeColor, setSettings]);

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
            data.type = 'circle';
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
