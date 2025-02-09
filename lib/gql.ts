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

export const GENE_UNIVERSAL_QUERY = (bringMeta = false) => gql`
  query GeneUniversalData($config: [DataRequired!], $geneIDs: [String!]!) {
    genes(geneIDs: $geneIDs, config: $config) {
      ID
      disease
      common
      ${
        bringMeta
          ? `Gene_name
      Description
      Aliases
      hgnc_gene_id`
          : ''
      }
    }
  }
`;

export const GET_HEADERS_QUERY = (bringCommon = true) => gql`
  query GetHeaders($disease: String!) {
    headers(disease: $disease) {
      ${
        bringCommon
          ? `common {
        name
        description
      }`
          : ''
      }
      disease {
        name
        description
      }
    }
  }
`;
