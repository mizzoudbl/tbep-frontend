'use client';

import type EventEmitter from 'events';
import type { EdgeAttributes, NodeAttributes } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { useSigma } from '@react-sigma/core';
import {
  type Simulation,
  type SimulationLinkDatum,
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force';
import { useCallback, useEffect, useRef } from 'react';

export function ForceLayout() {
  const sigma = useSigma<NodeAttributes, EdgeAttributes>();
  const nodes = useRef<NodeAttributes[]>([]);
  const edges = useRef<SimulationLinkDatum<NodeAttributes>[]>([]);
  const simulation = useRef<Simulation<NodeAttributes, SimulationLinkDatum<NodeAttributes>>>();
  const graph = sigma.getGraph();
  const settings = useStore(state => state.forceSettings);

  const tick = useCallback(() => {
    if (!graph || !nodes.current.length) return;
    for (const node of nodes.current) {
      graph.setNodeAttribute(node.ID, 'x', node.x);
      graph.setNodeAttribute(node.ID, 'y', node.y);
    }
  }, [graph]);

  useEffect(() => {
    sigma.on('afterRender', () => {
      if (!sigma.getGraph().order) return;
      (sigma as EventEmitter).emit('loaded');
    });
  }, [sigma]);

  useEffect(() => {
    if (!sigma) return;
    (sigma as EventEmitter).once('loaded', () => {
      const graph = sigma.getGraph();
      nodes.current = graph.mapNodes(node => ({
        ID: node,
      }));
      edges.current = graph.mapEdges((__, _, source, target) => ({
        source,
        target,
      }));
      simulation.current = forceSimulation<NodeAttributes, SimulationLinkDatum<NodeAttributes>>(nodes.current)
        .force(
          'link',
          forceLink<NodeAttributes, SimulationLinkDatum<NodeAttributes>>(edges.current)
            .id(d => d.ID!)
            .distance(20),
        )
        .force('charge', forceManyBody().strength(-200))
        .force('center', forceCenter(0, 0))
        .force('collide', forceCollide(10))
        .on('tick', tick);

      useStore.setState({
        forceWorker: {
          start() {
            simulation.current?.alpha(1).restart();
          },
          stop() {
            simulation.current?.stop();
          },
        },
      });
    });
  }, [sigma, tick]);

  useEffect(() => {
    if (!simulation.current || !edges.current) return;
    simulation.current.force(
      'link',
      forceLink<NodeAttributes, SimulationLinkDatum<NodeAttributes>>(edges.current)
        .id(d => d.ID!)
        .distance(settings.linkDistance),
    );
    simulation.current.force('charge', forceManyBody().strength(settings.chargeStrength));
    simulation.current.alpha(0.3).restart();
  }, [settings]);

  return null;
}
