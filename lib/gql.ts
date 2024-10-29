import { gql } from '@apollo/client';

export const GENE_VERIFICATION_QUERY = gql`
  query GeneVerification($geneIDs: [String!]!) {
    getGenes(geneIDs: $geneIDs ) {
      ID
      Gene_name
      Description
      hgnc_gene_id
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
    }
  }
`;

export const GENE_UNIVERSAL_QUERY = (disease: string, common = true) => gql`
  query GeneUniversalData($geneIDs: [String!]!) {
    getGenes(geneIDs: $geneIDs) {
      ID
      ${common ? 'common' : ''}
      ${disease}
    }
  }
`;
