export type NodeType = 'default' | 'text' | 'image';

export interface NodeData {
  label: string;
  type: NodeType;
  content: string;
}
