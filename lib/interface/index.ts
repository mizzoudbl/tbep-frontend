export * from './api/index';
export * from './graph';
export * from './PopUpTableProps';
export * from './PopUpDataTableProps';
export * from './RadialAnalysisProps';
export * from './SelectedNodeProperty';

/**
 * Chat Window Message format
 * @interface Message
 */
export interface Message {
  /**
   * Message text
   */
  text: string;

  /**
   * Message sender
   */
  sender: 'user' | 'llm';
}
