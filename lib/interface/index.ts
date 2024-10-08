export * from './Gene';
export * from './PopUpTableProps';
export * from './api/index';
export * from './LeftSideBarProps';
export * from './NodeColorProps';
export * from './NodeSizeProps';
export * from './graph';

export interface Message {
    text: string
    sender: 'user' | 'llm'
}