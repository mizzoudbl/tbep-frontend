'use client';

import { useSigma } from '@react-sigma/core';
import { scaleLinear } from 'd3-scale';
import { useEffect } from 'react';
import { DEFAULT_EDGE_COLOR } from '@/lib/data';
import { useStore } from '@/lib/hooks';
import type { EdgeAttributes, NodeAttributes, OtherSection } from '@/lib/interface';
import { P_VALUE_REGEX } from '@/lib/utils';

export function ColorAnalysis() {
  const selectedRadioNodeColor = useStore(state => state.selectedRadioNodeColor);
  const selectedNodeColorProperty = useStore(state => state.selectedNodeColorProperty);
  const graph = useSigma<NodeAttributes, EdgeAttributes>().getGraph();
  const universalData = useStore(state => state.universalData);
  const defaultNodeColor = useStore(state => state.defaultNodeColor);
  const diseaseName = useStore(state => state.diseaseName);
  const showEdgeColor = useStore(state => state.showEdgeColor);
  const radioOptions = useStore(state => state.radioOptions);
  const edgeOpacity = useStore(state => state.edgeOpacity);

  const minScore =
    typeof window !== 'undefined' ? (Number(JSON.parse(localStorage.getItem('graphConfig') ?? '{}').minScore) ?? 0) : 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: not required
  useEffect(() => {
    if (!graph) return;
    if (showEdgeColor) {
      const colorScale = scaleLinear<string>([minScore, 1], ['yellow', 'red']);
      graph.updateEachEdgeAttributes((_edge, attr) => {
        if (attr.score) attr.color = colorScale(attr.score).replace(/^rgb/, 'rgba').replace(/\)/, `, ${edgeOpacity})`);
        return attr;
      });
    } else {
      const opacityChangedColor = DEFAULT_EDGE_COLOR.replace(/[\d.]+\)$/, `${edgeOpacity})`);
      graph.updateEachEdgeAttributes((_edge, attr) => {
        attr.color = opacityChangedColor;
        return attr;
      });
    }
  }, [showEdgeColor, edgeOpacity]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: not required
  useEffect(() => {
    if (!selectedRadioNodeColor && graph) {
      useStore.setState({ selectedNodeColorProperty: '' });
      graph.updateEachNodeAttributes((_node, attr) => {
        attr.color = undefined;
        return attr;
      });
    }
  }, [selectedRadioNodeColor]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: not required
  useEffect(() => {
    if (!selectedNodeColorProperty || !graph || !selectedRadioNodeColor) return;
    const isUserProperty =
      typeof selectedNodeColorProperty === 'string' &&
      radioOptions.user[selectedRadioNodeColor].includes(selectedNodeColorProperty);
    const userOrDiseaseIdentifier = isUserProperty ? 'user' : diseaseName;
    const userOrCommonIdentifier = isUserProperty ? 'user' : 'common';
    if (selectedRadioNodeColor === 'OpenTargets' && typeof selectedNodeColorProperty === 'string') {
      const minMax = Object.values(universalData).reduce(
        (acc, cur) => {
          const value = (cur[userOrDiseaseIdentifier] as OtherSection)?.[selectedRadioNodeColor][
            selectedNodeColorProperty
          ];
          if (value === null || value === undefined || Number.isNaN(value)) return acc;
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [1, 0],
      );
      const colorScale = scaleLinear<string>(minMax, [defaultNodeColor, 'red']);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = (universalData[node]?.[userOrDiseaseIdentifier] as OtherSection)?.[selectedRadioNodeColor][
          selectedNodeColorProperty
        ];
        if (val !== null && val !== undefined && !Number.isNaN(val)) attr.color = colorScale(val);
        else attr.color = undefined;
        return attr;
      });
    } else if (selectedRadioNodeColor === 'DEG' && typeof selectedNodeColorProperty === 'string') {
      const isPValue = P_VALUE_REGEX.test(selectedNodeColorProperty);

      const [min, max] = Object.values(universalData).reduce(
        (acc, cur) => {
          const val = (cur[userOrDiseaseIdentifier] as OtherSection)?.[selectedRadioNodeColor][
            selectedNodeColorProperty
          ];
          if (!val) return acc;
          const value = isPValue ? -Math.log10(val) : val;
          if (Number.isNaN(value)) return acc;
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
      );

      const colorScale = isPValue
        ? scaleLinear<string>([min, max], [defaultNodeColor, 'red'])
        : scaleLinear<string>([min, 0, max], ['green', '#E2E2E2', 'red']);

      graph.updateEachNodeAttributes((node, attr) => {
        const val = (universalData[node]?.[userOrDiseaseIdentifier] as OtherSection)?.[selectedRadioNodeColor][
          selectedNodeColorProperty
        ];
        if (val !== null && val !== undefined && !Number.isNaN(val))
          attr.color = colorScale(isPValue ? -Math.log10(val) : val);
        else attr.color = undefined;
        return attr;
      });
    } else if (selectedRadioNodeColor === 'Pathway') {
      const propertyArray = Array.from(selectedNodeColorProperty);
      const userPathwayArray = radioOptions.user.Pathway;
      graph.updateEachNodeAttributes((node, attr) => {
        attr.color = propertyArray.some(
          property => +universalData[node]?.[userPathwayArray.includes(property) ? 'user' : 'common'].Pathway[property],
        )
          ? 'red'
          : defaultNodeColor;
        return attr;
      });
    } else if (selectedRadioNodeColor === 'Druggability' && typeof selectedNodeColorProperty === 'string') {
      const minMax = Object.values(universalData).reduce(
        (acc, cur) => {
          const value = cur[userOrCommonIdentifier]?.[selectedRadioNodeColor][selectedNodeColorProperty];
          if (value === null || value === undefined || Number.isNaN(value)) return acc;
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [1, 0],
      );
      const colorScale = scaleLinear<string>(minMax, [defaultNodeColor, 'red']);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = universalData[node]?.[userOrCommonIdentifier]?.[selectedRadioNodeColor][selectedNodeColorProperty];
        if (val !== null && val !== undefined && !Number.isNaN(val)) attr.color = colorScale(val);
        else attr.color = undefined;
        return attr;
      });
    } else if (selectedRadioNodeColor === 'TE' && typeof selectedNodeColorProperty !== 'string') {
      const propertyArray = Array.from(selectedNodeColorProperty);
      if (propertyArray.length === 0) {
        graph.updateEachNodeAttributes((_node, attr) => {
          attr.color = defaultNodeColor;
          return attr;
        });
        return;
      }
      const userTEArray = radioOptions.user.TE;
      const minMax = Object.values(universalData).reduce(
        (acc, cur) => {
          const value = propertyArray.reduce((acc2, property) => {
            const val = cur[userTEArray.includes(property) ? 'user' : 'common']?.[selectedRadioNodeColor][property];
            if (val == null || val === undefined || Number.isNaN(val)) return acc2;
            return Math.max(acc2, val);
          }, 0);
          return [Math.min(acc[0], value), Math.max(acc[1], value)];
        },
        [Number.POSITIVE_INFINITY, 0],
      );
      const colorScale = scaleLinear<string>(minMax, [defaultNodeColor, 'red']);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = propertyArray.reduce((acc, property) => {
          const value =
            universalData[node]?.[userTEArray.includes(property) ? 'user' : 'common']?.[selectedRadioNodeColor][
              property
            ];
          if (value == null || value === undefined || Number.isNaN(value)) return acc;
          return Math.max(acc, value);
        }, Number.NEGATIVE_INFINITY);
        if (Number.isFinite(val)) attr.color = colorScale(val);
        else attr.color = undefined;
        return attr;
      });
    } else if (selectedRadioNodeColor === 'Custom_Color' && typeof selectedNodeColorProperty === 'string') {
      graph.updateEachNodeAttributes((node, attr) => {
        attr.color =
          universalData[node]?.[userOrCommonIdentifier].Custom_Color[selectedNodeColorProperty] || defaultNodeColor;
        return attr;
      });
    } else if (selectedRadioNodeColor === 'OT_Prioritization' && typeof selectedNodeColorProperty === 'string') {
      const colorScale = scaleLinear<string>([-1, 0, 1], ['red', '#F0C584', 'green']);
      graph.updateEachNodeAttributes((node, attr) => {
        const val = universalData[node]?.[userOrCommonIdentifier].OT_Prioritization[selectedNodeColorProperty];
        if (val !== null && val !== undefined && !Number.isNaN(val)) attr.color = colorScale(val);
        else attr.color = undefined;
        return attr;
      });
    }
  }, [selectedNodeColorProperty, graph, universalData]);

  return null;
}
