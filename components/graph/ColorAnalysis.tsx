'use client';

import type { EdgeAttributes, NodeAttributes, OtherSection } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { useSigma } from '@react-sigma/core';
import { scaleLinear } from 'd3-scale';
import { useEffect, useState } from 'react';

export function ColorAnalysis() {
  const selectedRadioNodeColor = useStore(state => state.selectedRadioNodeColor);
  const selectedNodeColorProperty = useStore(state => state.selectedNodeColorProperty);
  const sigma = useSigma<NodeAttributes, EdgeAttributes>();
  const universalData = useStore(state => state.universalData);
  const defaultNodeColor = useStore(state => state.defaultNodeColor);
  const diseaseName = useStore(state => state.diseaseName);
  const showEdgeColor = useStore(state => state.showEdgeColor);
  const radioOptions = useStore(state => state.radioOptions);
  const [minScore, setMinScore] = useState(0);

  useEffect(() => {
    setMinScore(Number(JSON.parse(localStorage.getItem('graphConfig') ?? '{}').minScore) ?? 0);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const graph = sigma.getGraph();
    const colorScale = scaleLinear<string>([minScore, 1], ['yellow', 'red']);
    if (showEdgeColor) {
      graph.updateEachEdgeAttributes((edge, attr) => {
        if (attr.score) attr.color = colorScale(attr.score);
        return attr;
      });
    } else {
      graph.updateEachEdgeAttributes((edge, attr) => {
        attr.color = undefined;
        return attr;
      });
    }
  }, [showEdgeColor, sigma]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const graph = sigma.getGraph();
    if (selectedRadioNodeColor === 'None' && graph) {
      useStore.setState({ selectedNodeColorProperty: '' });
      graph.updateEachNodeAttributes((node, attr) => {
        attr.color = undefined;
        return attr;
      });
    }
  }, [selectedRadioNodeColor]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const graph = sigma.getGraph();
    if (selectedNodeColorProperty === '' || !graph) return;
    const userOrDatabase = radioOptions.user[selectedRadioNodeColor].includes(selectedNodeColorProperty)
      ? 'user'
      : 'database';
    if (selectedRadioNodeColor === 'Pathway') {
      graph.updateEachNodeAttributes((node, attr) => {
        attr.color =
          Number.parseInt(universalData[userOrDatabase][node]?.common.Pathway[selectedNodeColorProperty] ?? 0) === 1
            ? 'red'
            : defaultNodeColor;
        return attr;
      });
    } else if (selectedRadioNodeColor === 'Druggability') {
      const minMax = Object.values(universalData[userOrDatabase]).reduce(
        (acc, cur) => {
          const valString = cur.common.Druggability[selectedNodeColorProperty];
          if (!valString) return acc;
          const value = Number.parseFloat(valString);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [1, 0],
      );
      const colorScale = scaleLinear<string>(minMax, ['#00ff00', '#ff0000']);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(
          universalData[userOrDatabase][node]?.common.Druggability[selectedNodeColorProperty] ?? Number.NaN,
        );
        if (!Number.isNaN(val)) attr.color = colorScale(val);
        else attr.color = undefined;
        return attr;
      });
    } else if (selectedRadioNodeColor === 'TE') {
      const minMax = Object.values(universalData[userOrDatabase]).reduce(
        (acc, cur) => {
          const valString = cur.common.TE[selectedNodeColorProperty];
          if (!valString) return acc;
          const value = Number.parseFloat(valString);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [Number.POSITIVE_INFINITY, 0],
      );
      const colorScale = scaleLinear<string>(minMax, ['#00ff00', '#ff0000']);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(
          universalData[userOrDatabase][node]?.common.TE[selectedNodeColorProperty] ?? Number.NaN,
        );
        if (!Number.isNaN(val)) attr.color = colorScale(val);
        else attr.color = undefined;
        return attr;
      });
    } else if (selectedRadioNodeColor === 'Database') {
      graph.updateEachNodeAttributes((node, attr) => {
        attr.color =
          Number.parseInt(universalData[userOrDatabase][node]?.common.Database[selectedNodeColorProperty] ?? 0) === 1
            ? 'red'
            : defaultNodeColor;
        return attr;
      });
    } else if (selectedRadioNodeColor === 'Custom') {
      graph.updateEachNodeAttributes((node, attr) => {
        attr.color = universalData[userOrDatabase][node]?.common.Custom[selectedNodeColorProperty] || defaultNodeColor;
        return attr;
      });
    } else if (selectedRadioNodeColor === 'GDA') {
      const minMax = Object.values(universalData[userOrDatabase]).reduce(
        (acc, cur) => {
          const valString = (cur[diseaseName] as OtherSection).GDA?.[selectedNodeColorProperty];
          if (!valString) return acc;
          const value = Number.parseFloat(valString);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [1, 0],
      );
      const colorScale = scaleLinear<string>(minMax, ['#00ff00', '#ff0000']);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(
          (universalData[userOrDatabase][node]?.[diseaseName] as OtherSection)?.[selectedRadioNodeColor][
            selectedNodeColorProperty
          ] ?? Number.NaN,
        );
        if (!Number.isNaN(val)) attr.color = colorScale(val);
        else attr.color = undefined;
        return attr;
      });
    } else if (selectedRadioNodeColor === 'Genetics') {
      const [min, max] = Object.values(universalData[userOrDatabase]).reduce(
        (acc, cur) => {
          const valString = (cur[diseaseName] as OtherSection).Genetics?.[selectedNodeColorProperty];
          if (!valString) return acc;
          const value = Number.parseFloat(valString);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [1, -1],
      );
      const colorScale = scaleLinear<string>([min, 0, max], ['#00ff00', defaultNodeColor, '#ff0000']);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(
          (universalData[userOrDatabase][node]?.[diseaseName] as OtherSection)?.[selectedRadioNodeColor][
            selectedNodeColorProperty
          ] ?? 0,
        );
        attr.color = colorScale(val);
        return attr;
      });
    } else if (selectedRadioNodeColor === 'DEG') {
      const minMax = Object.values(universalData[userOrDatabase]).reduce(
        (acc, cur) => {
          const valString = (cur[diseaseName] as OtherSection).DEG?.[selectedNodeColorProperty];
          if (!valString) return acc;
          const value = Number.parseFloat(valString);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
      );
      const colorScale = scaleLinear<string>(minMax, ['#00ff00', '#ff0000']);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(
          (universalData[userOrDatabase][node]?.[diseaseName] as OtherSection)?.[selectedRadioNodeColor][
            selectedNodeColorProperty
          ] ?? Number.NaN,
        );
        if (!Number.isNaN(val)) attr.color = colorScale(val);
        else attr.color = undefined;
        return attr;
      });
    }
  }, [selectedNodeColorProperty, sigma, universalData]);

  return null;
}
