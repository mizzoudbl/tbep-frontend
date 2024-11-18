import { gql } from '@apollo/client';

export const GENE_VERIFICATION_QUERY = (getUserID = false) => gql`
  query GeneVerification($geneIDs: [String!]!) {
    getGenes(geneIDs: $geneIDs ) {
      ID
      Gene_name
      Description
      hgnc_gene_id
    }
    ${getUserID ? 'getUserID' : ''}
  }
`;

export const GENE_GRAPH_QUERY = gql`
  query GeneGraph(
    $geneIDs: [String!]!
    $minScore: Float!
    $order: Int!
    $interactionType: String!
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
      }
      graphName
    }
  }
`;

export const GENE_UNIVERSAL_QUERY = gql`
  query GeneUniversalData($config: [DataRequired!], $geneIDs: [String!]!) {
    getGenes(geneIDs: $geneIDs, config: $config) {
      ID
      disease
      common
    }
  }
`;

export const GET_STATS_QUERY = (bringCommon = true) => gql`
  query GetStats($disease: String!) {
    getHeaders(disease: $disease) {
      ${bringCommon ? 'common' : ''}
      disease
    }
  }
`;

export const GET_DISEASES_QUERY = gql`
  query GetDiseases {
    getDiseases
  }
`;
