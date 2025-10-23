import type Graph from 'graphology';
import { betweenness, closeness, eigenvector, pagerank } from 'graphology-metrics/centrality';
import { density, diameter } from 'graphology-metrics/graph';
import type { EdgeAttributes, GraphStore, NodeAttributes } from './interface';

export function statisticsGenerator(
  graph: Graph<NodeAttributes, EdgeAttributes>,
): Omit<GraphStore['networkStatistics'], 'totalNodes' | 'totalEdges' | 'averageClusteringCoefficient'> {
  /**  Average Degree  **/
  const avgDegree = graph.order ? (2 * graph.size) / graph.order : 0;

  /**  Degree Distribution Top 10 By Degree */
  const nodeDegreeArr: NonNullable<GraphStore['networkStatistics']['top10ByDegree']> = [];
  const degreeDistribution = Object.entries(
    Array.from(graph.nodes()).reduce<Record<number, number>>((acc, node) => {
      const degree = graph.degree(node);
      nodeDegreeArr.push({
        ID: node,
        geneName: graph.getNodeAttribute(node, 'label')!,
        description: graph.getNodeAttribute(node, 'description')!,
        degree: degree.toString(),
      });
      acc[degree] = (acc[degree] || 0) + 1;
      return acc;
    }, {}),
  ).map(([degree, count]) => ({
    degree: +degree,
    count,
  }));
  const top10ByDegree = nodeDegreeArr.sort((a, b) => +b.degree - +a.degree).slice(0, 10);

  /**  Top 10 By Betweenness */
  const betweennessCentrality = betweenness(graph, { getEdgeWeight: null });
  const top10ByBetweenness = Object.entries(betweennessCentrality)
    .map(([node, value]) => ({
      ID: node,
      geneName: graph.getNodeAttribute(node, 'label')!,
      description: graph.getNodeAttribute(node, 'description')!,
      betweenness: value.toFixed(3),
    }))
    .sort((a, b) => +b.betweenness - +a.betweenness)
    .slice(0, 10);

  /** Top 10 By Closeness */
  const closenessCentrality = closeness(graph);
  const top10ByCloseness = Object.entries(closenessCentrality)
    .map(([node, value]) => ({
      ID: node,
      geneName: graph.getNodeAttribute(node, 'label')!,
      description: graph.getNodeAttribute(node, 'description')!,
      closeness: value.toFixed(3),
    }))
    .sort((a, b) => +b.closeness - +a.closeness)
    .slice(0, 10);

  /** Top 10 By Eigenvector */
  let eigenvectorCentrality: Record<string, number> = {};
  let top10ByEigenvector: Array<{ ID: string; geneName: string; description: string; eigenvector: string }> = [];
  try {
    eigenvectorCentrality = eigenvector(graph, { getEdgeWeight: null, tolerance: 1e-3 });
    top10ByEigenvector = Object.entries(eigenvectorCentrality)
      .map(([node, value]) => ({
        ID: node,
        geneName: graph.getNodeAttribute(node, 'label')!,
        description: graph.getNodeAttribute(node, 'description')!,
        eigenvector: value.toFixed(3),
      }))
      .sort((a, b) => +b.eigenvector - +a.eigenvector)
      .slice(0, 10);
  } catch (error) {
    console.warn('Eigenvector centrality calculation failed:', error);
  }

  /** Top 10 By PageRank */
  let pagerankCentrality: Record<string, number> = {};
  let top10ByPageRank: Array<{ ID: string; geneName: string; description: string; pagerank: string }> = [];
  try {
    pagerankCentrality = pagerank(graph, { getEdgeWeight: 'score', tolerance: 1e-6, maxIterations: 100 });
    top10ByPageRank = Object.entries(pagerankCentrality)
      .map(([node, value]) => ({
        ID: node,
        geneName: graph.getNodeAttribute(node, 'label')!,
        description: graph.getNodeAttribute(node, 'description')!,
        pagerank: value.toFixed(3),
      }))
      .sort((a, b) => +b.pagerank - +a.pagerank)
      .slice(0, 10);
  } catch (error) {
    console.warn('PageRank centrality calculation failed:', error);
  }

  /** Edge Interaction Score Cumulative Distribution */
  // Like score > 0.9, count 10; score > 0.8, count 20; score > 0.7, count 30; ...
  const edgeScoreDistribution = Object.entries(
    Array.from(graph.edges()).reduce<Record<number, number>>((acc, edge) => {
      const score = graph.getEdgeAttribute(edge, 'score')!;
      acc[score] = (acc[score] || 0) + 1;
      return acc;
    }, {}),
  )
    .sort(([a], [b]) => +b - +a)
    .reduce<{ score: number; count: number }[]>((acc, [score, count]) => {
      acc.push({ score: +score, count: count + (acc[acc.length - 1]?.count || 0) });
      return acc;
    }, [])
    .toReversed();

  return {
    avgDegree,
    density: density(graph),
    diameter: diameter(graph),
    degreeDistribution,
    top10ByDegree,
    top10ByBetweenness,
    top10ByCloseness,
    top10ByEigenvector,
    top10ByPageRank,
    edgeScoreDistribution,
  };
}
