import { gql } from '@apollo/client';

export const GENE_VERIFICATION_QUERY = gql`
  query GeneVerification($geneIDs: [String!]!) {
    genes(geneIDs: $geneIDs ) {
      ID
      Gene_name
      Description
      hgnc_gene_id
      Aliases
      Input
    }
  }
`;

export const GENE_GRAPH_QUERY = gql`
  query GeneGraph(
    $geneIDs: [String!]!
    $minScore: Float!
    $order: Int!
    $interactionType: [String!]!
  ) {
    getGeneInteractions(
      input: {
        geneIDs: $geneIDs
        minScore: $minScore
        interactionType: $interactionType
      }
      order: $order
    ) {
      genes {
        ID
        Description
        Gene_name
      }
      links {
        gene1
        gene2
        score
        typeScores
      }
      graphName
      averageClusteringCoefficient
    }
  }
`;

export const GENE_PROPERTIES_QUERY = gql`
  query GenePropertiesData($config: [DataRequired!]!, $geneIds: [String!]!) {
    geneProperties(geneIds: $geneIds, config: $config) {
      ID
      data {
        diseaseId
        category
        key
        score
      }
    }
  }
`;

export const GET_HEADERS_QUERY = gql`
  query GetHeaders($diseaseId: String!, $skipCommon: Boolean!) {
    headers(diseaseId: $diseaseId) {
      differentialExpression {
        name
        description
      }
      openTargets @skip(if: $skipCommon) {
        name
        description
      }
      targetPrioritization @skip(if: $skipCommon) {
        name
        description
      }
      druggability @skip(if: $skipCommon) {
        name
        description
      }
      pathway @skip(if: $skipCommon) {
        name
        description
      }
      tissueSpecificity @skip(if: $skipCommon) {
        name
        description
      }
    }
  }
`;

export const TOP_GENES_QUERY = gql`
  query TopGenesByDisease($diseaseId: String!, $page: Pagination!) {
    topGenesByDisease(diseaseId: $diseaseId, page: $page) {
      gene_name
    }
  }
`;

export const OPENTARGET_HEATMAP_QUERY = gql`
  query OpenTargetsTable($diseaseId: String!, $geneIds: [String!]!, $orderBy: OrderByEnum!, $page: Pagination!) {
    targetDiseaseAssociationTable(
      diseaseId: $diseaseId,
      geneIds: $geneIds,
      orderBy: $orderBy,
      page: $page
    ) {
      rows {
        target {
        name
        prioritization {
            key
            score
          }
        }
        datasourceScores {
          key
          score
        }
        overall_score
      }
      totalCount
    }
  }
`;
