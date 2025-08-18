export * from './api/index';
export * from './graph';
export * from './PopUpDataTableProps';
export * from './PopUpTableProps';
export * from './SelectedNodeProperty';

/**
 * Chat Window Message format
 * @interface Message
 */
export interface Message {
  /**
   * Message text
   */
  content: string;

  /**
   * Message sender
   */
  role: 'user' | 'assistant';
}

/**
 * GSEA data format
 * @interface Gsea
 */
export interface Gsea {
  Pathway: string;
  Overlap: string;
  'P-value': string;
  'Adjusted P-value': string;
  'Odds Ratio': string;
  'Combined Score': string;
  Genes: string;
}
