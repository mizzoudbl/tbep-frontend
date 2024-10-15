'use client';

import type { EdgeAttributes, NodeAttributes } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { useSigma } from '@react-sigma/core';
import { scaleLinear } from 'd3-scale';
import { useEffect } from 'react';

export function SizeAnalysis() {
  const selectedRadioNodeSize = useStore(state => state.selectedRadioNodeSize);
  const selectedNodeSizeProperty = useStore(state => state.selectedNodeSizeProperty);
  const sigma = useSigma<NodeAttributes, EdgeAttributes>();
  const universalData = useStore(state => state.universalData);
  const defaultNodeSize = useStore(state => state.defaultNodeSize);
  const diseaseName = useStore(state => state.diseaseName);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const graph = sigma.getGraph();
    if (selectedNodeSizeProperty === '' || !graph || !universalData) return;
    if (selectedRadioNodeSize === 'None') {
      graph.updateEachNodeAttributes((node, attr) => {
        attr.size = defaultNodeSize;
        return attr;
      });
    } else if (selectedRadioNodeSize === 'logFC') {
      const minMax = Object.values(universalData).reduce(
        (acc, cur) => {
          const valString = cur[diseaseName]?.logFC?.[selectedNodeSizeProperty];
          if (!valString) return acc;
          const value = Number.parseFloat(valString);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
      );
      const sizeScale = scaleLinear<number, number>(minMax, [1, 10]);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(universalData[node][diseaseName]?.logFC?.[selectedNodeSizeProperty] ?? 'NaN');
        if (!Number.isNaN(val)) attr.size = sizeScale(val);
        return attr;
      });
    } else if (selectedRadioNodeSize === 'Druggability') {
      const minMax = Object.values(universalData).reduce(
        (acc, cur) => {
          const valString = cur.common.Druggability?.[selectedNodeSizeProperty];
          if (!valString) return acc;
          const value = Number.parseFloat(valString);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [1, 0],
      );
      const sizeScale = scaleLinear<number, number>(minMax, [1, 10]);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(universalData[node].common.Druggability?.[selectedNodeSizeProperty] ?? 'NaN');
        if (!Number.isNaN(val)) attr.size = sizeScale(val);
        return attr;
      });
    } else if (selectedRadioNodeSize === 'GDA') {
      const minMax = Object.values(universalData).reduce(
        (acc, cur) => {
          const valString = cur[diseaseName]?.GDA?.[selectedNodeSizeProperty];
          if (!valString) return acc;
          const value = Number.parseFloat(valString);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [1, 0],
      );
      const sizeScale = scaleLinear<number, number>(minMax, [1, 10]);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(universalData[node][diseaseName]?.GDA?.[selectedNodeSizeProperty] ?? 'NaN');
        if (!Number.isNaN(val)) attr.size = sizeScale(val);
        return attr;
      });
    } else if (selectedRadioNodeSize === 'Genetics') {
      const minMax = Object.values(universalData).reduce(
        (acc, cur) => {
          const valString = cur[diseaseName]?.Genetics?.[selectedNodeSizeProperty];
          if (!valString) return acc;
          const value = Number.parseFloat(valString);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [1, -1],
      );
      const sizeScale = scaleLinear<number, number>(minMax, [1, 10]);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(universalData[node][diseaseName]?.Genetics?.[selectedNodeSizeProperty] ?? 'NaN');
        if (!Number.isNaN(val)) attr.size = sizeScale(val);
        return attr;
      });
    } else if (selectedRadioNodeSize === 'TE') {
      const minMax = Object.values(universalData).reduce(
        (acc, cur) => {
          const valString = cur[diseaseName]?.TE?.[selectedNodeSizeProperty];
          if (!valString) return acc;
          const value = Number.parseFloat(valString);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [Number.POSITIVE_INFINITY, 0],
      );
      const sizeScale = scaleLinear<number, number>(minMax, [1, 10]);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(universalData[node][diseaseName]?.TE?.[selectedNodeSizeProperty] ?? 'NaN');
        if (!Number.isNaN(val)) attr.size = sizeScale(val);
        return attr;
      });
    }
  }, [selectedNodeSizeProperty, selectedRadioNodeSize, sigma, universalData, defaultNodeSize]);

  return null;
}
