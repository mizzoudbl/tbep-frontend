'use client';

import type { EdgeAttributes, NodeAttributes } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { type EventMessage, Events, eventEmitter } from '@/lib/utils';
import { useSigma } from '@react-sigma/core';
import { fitViewportToNodes } from '@sigma/utils';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

export function GraphAnalysis() {
  const sigma = useSigma<NodeAttributes, EdgeAttributes>();
  const graph = sigma.getGraph();
  const radialAnalysis = useStore(state => state.radialAnalysis);
  const [communityMap, setCommunityMap] = useState<Record<string, { name: string; genes: string[]; color: string }>>(
    {},
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    let edgeCount = 0;
    graph.updateEachEdgeAttributes((edge, attr) => {
      if (attr.score && attr.score < radialAnalysis.edgeWeightCutOff) {
        attr.hidden = true;
      } else {
        attr.hidden = false;
        edgeCount++;
      }
      return attr;
    });
    useStore.setState({ totalEdges: edgeCount });
  }, [radialAnalysis.edgeWeightCutOff]);

  const nodeDegreeProperty = useStore(state => state.radialAnalysis.nodeDegreeProperty);
  const universalData = useStore(state => state.universalData);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    let nodeCount = 0;
    graph.updateEachNodeAttributes((node, attr) => {
      if (nodeDegreeProperty === 'geneDegree') {
        const degree = graph.degree(node);
        if (degree < radialAnalysis.nodeDegreeCutOff) {
          attr.hidden = true;
        } else {
          nodeCount++;
          attr.hidden = false;
        }
      } else {
        const value = Number.parseFloat(universalData?.[node].common.TE[nodeDegreeProperty] ?? 'NaN');
        if (value >= radialAnalysis.nodeDegreeCutOff) {
          nodeCount++;
          attr.hidden = false;
        } else {
          attr.hidden = true;
        }
      }
      return attr;
    });
    const edgeCount = graph.reduceEdges((count, ____, ___, __, _, srcAttr, tgtAttr) => {
      return count + (srcAttr.hidden || tgtAttr.hidden ? 0 : 1);
    }, 0);
    useStore.setState({ totalNodes: nodeCount, totalEdges: edgeCount });
  }, [radialAnalysis.nodeDegreeCutOff, nodeDegreeProperty]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (radialAnalysis.hubGeneEdgeCount < 1) return;
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

  async function renewSession() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/algorithm/renew-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(useStore.getState().graphConfig!),
    });
    if (res.status === 202 || res.status === 409) return true;
    toast.error('Failed to renew session', {
      cancel: { label: 'Close', onClick() {} },
      position: 'top-center',
      richColors: true,
      description: 'Server not available,Please try again later',
    });
    return false;
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    eventEmitter.on(Events.ALGORITHM, async ({ name, parameters }: EventMessage[Events.ALGORITHM]) => {
      if (name === 'None') {
        setCommunityMap({});
        graph.updateEachNodeAttributes((_, attr) => {
          attr.color = undefined;
          attr.community = undefined;
          return attr;
        });
      } else if (name === 'Leiden') {
        (async function leiden() {
          const { resolution, weighted } = parameters;
          const { graphName } = useStore.getState().graphConfig!;
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/algorithm/leiden?graphName=${encodeURIComponent(graphName)}${resolution ? `&resolution=${resolution}` : ''}&weighted=${encodeURIComponent(!!weighted)}`,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
          );
          if (res.ok) {
            const data: Record<string, { name: string; genes: string[]; color: string }> = await res.json();
            setCommunityMap(data);
            for (const community of Object.values(data)) {
              for (const gene of community.genes) {
                graph.setNodeAttribute(gene, 'color', community.color);
              }
            }
          } else if (res.status === 404) {
            toast.promise(
              new Promise<void>(async (resolve, reject) => {
                const res = await renewSession();
                if (res) {
                  resolve();
                  await leiden();
                } else {
                  reject();
                }
              }),
              {
                success: 'Session renewed',
                loading: 'Session expired, renewing...',
                error: 'Failed to renew session',
                description: 'This may take a while, please be patient',
              },
            );
          } else {
            toast.error('Failed to fetch Leiden data', {
              cancel: { label: 'Close', onClick() {} },
              position: 'top-center',
              richColors: true,
              description: 'Server not available,Please try again later',
            });
          }
        })();
      }
    });
  }, []);

  return (
    <>
      {Object.keys(communityMap).length > 0 && (
        <div className='absolute bottom-2 left-2 space-y-1 no-scrollbar flex flex-col max-h-56 overflow-scroll border shadow rounded-md backdrop-blur p-2'>
          {Object.entries(communityMap).map(([id, val], idx) => (
            <Button
              key={id}
              style={{ backgroundColor: val.color }}
              className='h-5 w-30'
              onClick={() => fitViewportToNodes(sigma, val.genes, { animate: true })}
            >
              Community {idx + 1}
            </Button>
          ))}
        </div>
      )}
    </>
  );
}
