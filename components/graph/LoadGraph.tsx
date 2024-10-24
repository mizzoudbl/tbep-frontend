'use client';

/******** only for testing with sample graph **************/
// import { data as response } from '@/lib/data/sample-graph.json';
import { GENE_GRAPH_QUERY, GENE_VERIFICATION_QUERY } from '@/lib/gql';
import type {
  EdgeAttributes,
  GeneGraphData,
  GeneGraphVariables,
  GeneVerificationData,
  GeneVerificationVariables,
  NodeAttributes,
} from '@/lib/interface';
import type { Gene } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { openDB } from '@/lib/utils';
import { useLazyQuery } from '@apollo/client';
import { useLoadGraph } from '@react-sigma/core';
import Graph from 'graphology';
import { circlepack } from 'graphology-layout';
import type { SerializedGraph } from 'graphology-types';
import { useSearchParams } from 'next/navigation';
import Papa from 'papaparse';
import React from 'react';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';

export function LoadGraph() {
  const searchParams = useSearchParams();

  const loadGraph = useLoadGraph();
  const variable = JSON.parse(localStorage.getItem('graphConfig') || '{}');
  const [fetchData, { data: response, loading, error }] = useLazyQuery<GeneGraphData, GeneGraphVariables>(
    GENE_GRAPH_QUERY,
    {
      variables: {
        geneIDs: variable.geneIDs as string[],
        interactionType: variable.interactionType as string,
        minScore: Number.parseFloat(variable.minScore),
        order: Number.parseInt(variable.order),
      },
    },
  );

  const [fetchFileData] = useLazyQuery<GeneVerificationData, GeneVerificationVariables>(GENE_VERIFICATION_QUERY);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    const graph = new Graph<NodeAttributes, EdgeAttributes>({
      type: 'directed',
    });
    const fileName = searchParams.get('file');
    (async () => {
      if (fileName) {
        const fileType = fileName.split('.').pop();
        const store = await openDB('network', 'readonly');
        if (!store) {
          toast.error('Error opening IndexedDB!', {
            position: 'top-center',
            richColors: true,
            description: 'Please check your browser settings and try again',
            cancel: {
              label: 'Close',
              onClick: () => window.close(),
            },
          });
          return;
        }
        const req = store.get(fileName);
        req.onsuccess = async () => {
          const fileText = await (req.result as File).text();
          let fileData: Array<Record<string, string | number>>;
          let fields: string[] = [];
          if (fileType === 'json') {
            fileData = JSON.parse(fileText);
            fields = Object.keys(fileData?.[0] as object);
          } else {
            const parsedResult = Papa.parse(fileText, { header: true, skipEmptyLines: true });
            fileData = parsedResult.data as Array<Record<string, string | number>>;
            fields = parsedResult.meta.fields || [];
          }
          if (fields.length < 3) {
            toast.error('There must be atleast 3 fields in csv/json!', {
              position: 'top-center',
              richColors: true,
              description: 'Fields more than 3 are ignored. Please check the file and try again',
              cancel: {
                label: 'Close',
                onClick: () => window.close(),
              },
            });
            return;
          }
          const geneIDs = new Set<string>();
          for (const gene of fileData) {
            geneIDs.add(gene[fields?.[0]] as string);
            geneIDs.add(gene[fields?.[1]] as string);
          }
          const geneIDArray = Array.from(geneIDs);
          const result = await fetchFileData({
            variables: {
              geneIDs: geneIDArray,
            },
          });
          if (result.error) {
            toast.warning("Server can't verify the geneIDs!", {
              position: 'top-center',
              richColors: true,
              description: 'Please try again after some time',
              cancel: {
                label: 'Close',
                onClick: () => window.close(),
              },
            });
            return;
          }
          if (!result) return;
          const geneNameToID = new Map<string, string>();
          for (const gene of result.data?.getGenes as Gene[]) {
            if (gene.Gene_name) geneNameToID.set(gene.Gene_name, gene.ID);
            graph.addNode(gene.ID, {
              label: gene.Gene_name,
              ID: gene.ID,
              description: gene.Description,
            });
          }
          for (const gene of fileData) {
            const source = geneNameToID.get(gene[fields?.[0]] as string);
            const target = geneNameToID.get(gene[fields?.[1]] as string);
            if (!source || !target) continue;
            graph.mergeEdgeWithKey(`${source}-${target}`, source, target, {
              score: gene[fields?.[2]] as number,
              label: gene[fields?.[2]].toString(),
            });
          }
          circlepack.assign(graph);
          loadGraph(graph);
          useStore.setState({ geneIDs: geneIDArray, totalNodes: geneIDs.size, totalEdges: fileData.length });
        };
      } else {
        await fetchData();
        if (error) {
          console.error(error);
          alert('Error loading graph! Check console for errors');
          return;
        }
        if (response) {
          const { genes, links } = response.getGeneInteractions;
          const transformedData: Partial<SerializedGraph<NodeAttributes, EdgeAttributes>> = {
            nodes: genes.map(gene => ({
              key: gene.ID,
              attributes: {
                label: gene.Gene_name || '',
                ID: gene.ID,
                description: gene.Description || '',
              },
            })),
            edges: links.map(link => ({
              key: `${link.gene1.index}-${link.gene2.index}`,
              source: genes[link.gene1.index].ID,
              target: genes[link.gene2.index].ID,
              attributes: {
                score: link.score,
                label: link.score.toString(),
              },
            })),
          };
          if (transformedData) {
            useStore.setState({
              geneIDs: transformedData.nodes?.map(node => node.key) || [],
              totalNodes: transformedData.nodes?.length || 0,
              totalEdges: transformedData.edges?.length || 0,
            });
            graph.import(transformedData);
            circlepack.assign(graph);
            loadGraph(graph);
          }
        }
      }
    })();
  }, [loadGraph, loading, error, fetchData]);

  return (
    <>
      {loading ? (
        <div className=' absolute bottom-0 w-full h-full z-40 grid place-items-center'>
          <div className='flex flex-col items-center' id='test'>
            <Spinner size={'medium'} />
            Loading...
          </div>
        </div>
      ) : null}
    </>
  );
}
