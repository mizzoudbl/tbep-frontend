'use client';

import { useStore } from '@/lib/hooks';
import type { EdgeAttributes, NodeAttributes, OtherSection } from '@/lib/interface';
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
  const radioOptions = useStore(state => state.radioOptions);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const graph = sigma.getGraph();
    if (!selectedRadioNodeSize && graph) {
      useStore.setState({ selectedNodeSizeProperty: '' });
      graph.updateEachNodeAttributes((_node, attr) => {
        attr.size = defaultNodeSize;
        return attr;
      });
    }
  }, [selectedRadioNodeSize]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const graph = sigma.getGraph();
    if (!selectedNodeSizeProperty || !graph || !selectedRadioNodeSize) return;
    const userOrDatabase = radioOptions.user[selectedRadioNodeSize].includes(selectedNodeSizeProperty)
      ? 'user'
      : 'database';
    if (selectedRadioNodeSize === 'Druggability') {
      const minMax = Object.values(universalData[userOrDatabase]).reduce(
        (acc, cur) => {
          const valString = cur.common.Druggability[selectedNodeSizeProperty];
          if (!valString) return acc;
          const value = Number.parseFloat(valString);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [1, 0],
      );
      const sizeScale = scaleLinear<number, number>(minMax, [3, defaultNodeSize + 10]);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(
          universalData[userOrDatabase][node]?.common.Druggability[selectedNodeSizeProperty] ?? Number.NaN,
        );
        if (!Number.isNaN(val)) attr.size = sizeScale(val);
        else attr.size = 0.5;
        return attr;
      });
    } else if (selectedRadioNodeSize === 'TE') {
      const minMax = Object.values(universalData[userOrDatabase]).reduce(
        (acc, cur) => {
          const valString = cur.common.TE[selectedNodeSizeProperty];
          if (!valString) return acc;
          const value = Number.parseFloat(valString);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [Number.POSITIVE_INFINITY, 0],
      );
      const sizeScale = scaleLinear<number, number>(minMax, [3, defaultNodeSize + 10]);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(
          universalData[userOrDatabase][node]?.common.TE[selectedNodeSizeProperty] ?? Number.NaN,
        );
        if (!Number.isNaN(val)) attr.size = sizeScale(val);
        else attr.size = 0.5;
        return attr;
      });
    } else if (selectedRadioNodeSize === 'DEG') {
      const minMax = Object.values(universalData[userOrDatabase]).reduce(
        (acc, cur) => {
          const valString = (cur[diseaseName] as OtherSection).DEG?.[selectedNodeSizeProperty];
          if (!valString) return acc;
          const value = Number.parseFloat(valString);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
      );
      const sizeScale = scaleLinear<number, number>(minMax, [3, defaultNodeSize + 10]);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(
          (universalData[userOrDatabase][node]?.[diseaseName] as OtherSection)?.[selectedRadioNodeSize][
            selectedNodeSizeProperty
          ] ?? Number.NaN,
        );
        if (!Number.isNaN(val)) attr.size = sizeScale(val);
        else attr.size = 0.5;
        return attr;
      });
    } else if (selectedRadioNodeSize === 'OpenTargets') {
      const minMax = Object.values(universalData[userOrDatabase]).reduce(
        (acc, cur) => {
          const valString = (cur[diseaseName] as OtherSection).OpenTargets?.[selectedNodeSizeProperty];
          if (!valString) return acc;
          const value = Number.parseFloat(valString);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [1, 0],
      );
      const sizeScale = scaleLinear<number, number>(minMax, [3, defaultNodeSize + 10]);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(
          (universalData[userOrDatabase][node]?.[diseaseName] as OtherSection)?.[selectedRadioNodeSize][
            selectedNodeSizeProperty
          ] ?? Number.NaN,
        );
        if (!Number.isNaN(val)) attr.size = sizeScale(val);
        else attr.size = 0.5;
        return attr;
      });
    } else if (selectedRadioNodeSize === 'OT_Prioritization') {
      // TODO: Implement OT_Prioritization
      const sizeScale = scaleLinear<number, number>(
        [-1, 0, 1],
        [defaultNodeSize - 10, defaultNodeSize, defaultNodeSize + 10],
      );
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(
          universalData[userOrDatabase][node]?.common.OT_Prioritization[selectedNodeSizeProperty] ?? Number.NaN,
        );
        if (!Number.isNaN(val)) attr.size = sizeScale(val);
        else attr.size = 0.5;
        return attr;
      });
    }
  }, [selectedNodeSizeProperty, sigma, universalData, defaultNodeSize]);

  return null;
}
