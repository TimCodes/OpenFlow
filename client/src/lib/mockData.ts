import { Node, Edge } from 'reactflow';
import { NodeData } from './types';

export const initialNodes: Node<NodeData>[] = [
  {
    id: 'default-1',
    type: 'custom',
    position: { x: 250, y: 100 },
    data: { label: 'Default Node 1', type: 'default', content: 'This is a default node' },
  },
  {
    id: 'text-1',
    type: 'custom',
    position: { x: 250, y: 250 },
    data: { label: 'Text Node 1', type: 'text', content: 'This is a text node' },
  },
];

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'default-1',
    target: 'text-1',
  },
];
