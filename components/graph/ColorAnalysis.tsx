'use client';

import { DISEASE_DEPENDENT_PROPERTIES, DiseaseDependentProperties } from '@/lib/data';
import { useStore } from '@/lib/hooks';
import type { EdgeAttributes, NodeAttributes, OtherSection } from '@/lib/interface';
import { useSigma } from '@react-sigma/core';
import { scaleLinear } from 'd3-scale';
import { useEffect, useState } from 'react';

export function ColorAnalysis() {
  const selectedRadioNodeColor = useStore(state => state.selectedRadioNodeColor);
  const selectedNodeColorProperty = useStore(state => state.selectedNodeColorProperty);
  const graph = useSigma<NodeAttributes, EdgeAttributes>().getGraph();
  const universalData = useStore(state => state.universalData);
  const defaultNodeColor = useStore(state => state.defaultNodeColor);
  const diseaseName = useStore(state => state.diseaseName);
  const showEdgeColor = useStore(state => state.showEdgeColor);
  const radioOptions = useStore(state => state.radioOptions);
  const [minScore, setMinScore] = useState(0);
  const edgeOpacity = useStore(state => state.edgeOpacity);

  useEffect(() => {
    setMinScore(Number(JSON.parse(localStorage.getItem('graphConfig') ?? '{}').minScore) ?? 0);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const colorScale = scaleLinear<string>([minScore, 1], ['yellow', 'red']);
    if (showEdgeColor) {
      graph.updateEachEdgeAttributes((_edge, attr) => {
        if (attr.score) attr.color = colorScale(attr.score).replace(/^rgb/, 'rgba').replace(/\)/, `, ${edgeOpacity})`);
        return attr;
      });
    } else {
      graph.updateEachEdgeAttributes((_edge, attr) => {
        attr.color = undefined;
        return attr;
      });
    }
  }, [showEdgeColor, graph, edgeOpacity]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!selectedRadioNodeColor && graph) {
      useStore.setState({ selectedNodeColorProperty: '' });
      graph.updateEachNodeAttributes((_node, attr) => {
        attr.color = undefined;
        return attr;
      });
    }
  }, [selectedRadioNodeColor]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!selectedNodeColorProperty || !graph || !selectedRadioNodeColor) return;
    const isUserProperty = radioOptions.user[selectedRadioNodeColor].includes(selectedNodeColorProperty);
    const userOrDiseaseIdentifier = isUserProperty ? 'user' : diseaseName;
    const userOrCommonIdentifier = isUserProperty ? 'user' : 'common';
    if (selectedRadioNodeColor === 'OpenTargets') {
      const minMax = Object.values(universalData).reduce(
        (acc, cur) => {
          const valString = (cur[userOrDiseaseIdentifier] as OtherSection).OpenTargets?.[selectedNodeColorProperty];
          if (!valString) return acc;
          const value = Number.parseFloat(valString);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [1, 0],
      );
      const colorScale = scaleLinear<string>(minMax, [defaultNodeColor, 'red']);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(
          (universalData[node]?.[userOrDiseaseIdentifier] as OtherSection)?.[selectedRadioNodeColor][
            selectedNodeColorProperty
          ] ?? Number.NaN,
        );
        if (!Number.isNaN(val)) attr.color = colorScale(val);
        else attr.color = undefined;
        return attr;
      });
    } else if (selectedRadioNodeColor === 'DEG') {
      const isPValue = /^P_Val/i.test(selectedNodeColorProperty);

      const [min, max] = Object.values(universalData).reduce(
        (acc, cur) => {
          const val = (cur[userOrDiseaseIdentifier] as OtherSection).DEG?.[selectedNodeColorProperty];
          if (!val) return acc;
          const value = isPValue ? -Math.log10(Number.parseFloat(val)) : Number.parseFloat(val);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
      );

      const colorScale = isPValue
        ? scaleLinear<string>([min, max], [defaultNodeColor, 'red'])
        : scaleLinear<string>([min, 0, max], ['green', '#E2E2E2', 'red']);

      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(
          (universalData[node]?.[userOrDiseaseIdentifier] as OtherSection)?.[selectedRadioNodeColor][
            selectedNodeColorProperty
          ] ?? Number.NaN,
        );
        if (!Number.isNaN(val)) attr.color = colorScale(isPValue ? -Math.log10(val) : val);
        else attr.color = undefined;
        return attr;
      });
    } else if (selectedRadioNodeColor === 'Pathway') {
      graph.updateEachNodeAttributes((node, attr) => {
        attr.color =
          Number.parseInt(universalData[node]?.[userOrCommonIdentifier].Pathway[selectedNodeColorProperty] ?? 0) === 1
            ? 'red'
            : defaultNodeColor;
        return attr;
      });
    } else if (selectedRadioNodeColor === 'Druggability') {
      const minMax = Object.values(universalData).reduce(
        (acc, cur) => {
          const valString = cur[userOrCommonIdentifier].Druggability[selectedNodeColorProperty];
          if (!valString) return acc;
          const value = Number.parseFloat(valString);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [1, 0],
      );
      const colorScale = scaleLinear<string>(minMax, [defaultNodeColor, 'red']);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(
          universalData[node]?.[userOrCommonIdentifier].Druggability[selectedNodeColorProperty] ?? Number.NaN,
        );
        if (!Number.isNaN(val)) attr.color = colorScale(val);
        else attr.color = undefined;
        return attr;
      });
    } else if (selectedRadioNodeColor === 'TE') {
      const minMax = Object.values(universalData).reduce(
        (acc, cur) => {
          const valString = cur?.[userOrCommonIdentifier].TE[selectedNodeColorProperty];
          if (!valString) return acc;
          const value = Number.parseFloat(valString);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [Number.POSITIVE_INFINITY, 0],
      );
      const colorScale = scaleLinear<string>(minMax, [defaultNodeColor, 'red']);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(
          universalData[node]?.[userOrCommonIdentifier].TE[selectedNodeColorProperty] ?? Number.NaN,
        );
        if (!Number.isNaN(val)) attr.color = colorScale(val);
        else attr.color = undefined;
        return attr;
      });
    } else if (selectedRadioNodeColor === 'Custom_Color') {
      graph.updateEachNodeAttributes((node, attr) => {
        attr.color =
          universalData[node]?.[userOrCommonIdentifier].Custom_Color[selectedNodeColorProperty] || defaultNodeColor;
        return attr;
      });
    } else if (selectedRadioNodeColor === 'OT_Prioritization') {
      // TODO: Implement OT_Prioritization
      const colorScale = scaleLinear<string>([-1, 0, 1], ['red', '#F0C584', 'green']);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = Number.parseFloat(
          universalData[node]?.[userOrCommonIdentifier].OT_Prioritization[selectedNodeColorProperty] ?? Number.NaN,
        );
        if (!Number.isNaN(val)) attr.color = colorScale(val);
        else attr.color = undefined;
        return attr;
      });
    }
  }, [selectedNodeColorProperty, graph, universalData]);

  return null;
}
