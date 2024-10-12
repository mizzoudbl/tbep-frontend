'use client';

import type { EdgeAttributes, NodeAttributes } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { useSigma } from '@react-sigma/core';
import type { SerializedEdge, SerializedNode } from 'graphology-types';
import { useEffect, useRef } from 'react';

export function GraphAnalysis() {
  const graph = useSigma<NodeAttributes, EdgeAttributes>().getGraph();
  const radialAnalysis = useStore(state => state.radialAnalysis);
  const droppedEdge = useRef<Set<SerializedEdge<EdgeAttributes>>>(new Set());

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    graph.forEachEdge((edge, attr, source, target) => {
      if (attr.score && attr.score < radialAnalysis.edgeWeightCutOff) {
        droppedEdge.current.add({
          key: edge,
          source: source,
          target: target,
          attributes: attr,
        });
        graph.dropEdge(edge);
      }
    });
    for (const edge of droppedEdge.current) {
      if (
        graph.hasNode(edge.source) &&
        graph.hasNode(edge.target) &&
        edge.attributes?.score &&
        edge.attributes.score >= radialAnalysis.edgeWeightCutOff
      ) {
        graph.mergeEdgeWithKey(edge.key, edge.source, edge.target, edge.attributes);
        droppedEdge.current.delete(edge);
      }
    }
    useStore.setState({ totalEdges: graph.size });
  }, [radialAnalysis.edgeWeightCutOff]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    let nodeCount = graph.order;
    let edgeCount = graph.size;
    graph.updateEachNodeAttributes((node, attr) => {
      const degree = graph.degree(node);
      if (degree < radialAnalysis.nodeDegreeCutOff) {
        attr.hidden = true;
        nodeCount--;
        edgeCount -= degree;
      } else {
        attr.hidden = false;
      }
      return attr;
    });
    useStore.setState({ totalNodes: nodeCount, totalEdges: edgeCount });
  }, [radialAnalysis.nodeDegreeCutOff]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (radialAnalysis.hubGeneEdgeCount <= 1) return;
    graph.updateEachNodeAttributes((node, attr) => {
      const degree = graph.degree(node);
      if (degree >= radialAnalysis.hubGeneEdgeCount) {
        attr.type = 'border';
      } else {
        attr.type = 'circle';
      }
      return attr;
    });
  }, [radialAnalysis.hubGeneEdgeCount]);

  return null;
}
