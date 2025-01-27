import { create } from 'zustand';
import { initialNodes, initialEdges } from '../lib/mockData';
import {
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import { produce } from 'immer';

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  history: { nodes: Node[]; edges: Edge[] }[];
  currentStep: number;
  snapToGrid: boolean;
  toggleSnapToGrid: () => void;
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  selectNode: (nodeId: string) => void;
  selectEdge: (edgeId: string) => void;
  updateNode: (nodeId: string, newData: any) => void;
  updateEdge: (edgeId: string, newData: any) => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNode: null,
  history: [],
  currentStep: -1,
  snapToGrid: true,
  canUndo: false,
  canRedo: false,

  toggleSnapToGrid: () => {
    set(produce((state) => {
      state.snapToGrid = !state.snapToGrid;
    }));
  },

  setNodes: (nodes) => {
    set(produce((state) => {
      state.nodes = typeof nodes === 'function' ? nodes(state.nodes) : nodes;
      state.history = [...state.history.slice(0, state.currentStep + 1), { nodes: state.nodes, edges: state.edges }];
      state.currentStep += 1;
      state.canUndo = state.currentStep > 0;
      state.canRedo = false;
    }));
  },

  setEdges: (edges) => {
    set(produce((state) => {
      state.edges = typeof edges === 'function' ? edges(state.edges) : edges;
      state.history = [...state.history.slice(0, state.currentStep + 1), { nodes: state.nodes, edges: state.edges }];
      state.currentStep += 1;
      state.canUndo = state.currentStep > 0;
      state.canRedo = false;
    }));
  },

  onNodesChange: (changes) => {
    set(produce((state) => {
      const processedChanges = changes.map(change => {
        if (change.type === 'position' && state.snapToGrid && change.position) {
          return {
            ...change,
            position: {
              x: Math.round(change.position.x / 25) * 25,
              y: Math.round(change.position.y / 25) * 25,
            },
          };
        }
        return change;
      });
      state.nodes = applyNodeChanges(processedChanges, state.nodes);
      state.history = [...state.history.slice(0, state.currentStep + 1), { nodes: state.nodes, edges: state.edges }];
      state.currentStep += 1;
      state.canUndo = state.currentStep > 0;
      state.canRedo = false;
    }));
  },

  onEdgesChange: (changes) => {
    set(produce((state) => {
      state.edges = applyEdgeChanges(changes, state.edges);
      
      // Remove the edge from selected state if it's deleted
      if (changes.some(change => change.type === 'remove')) {
        state.selectedEdge = null;
      }
      
      state.history = [...state.history.slice(0, state.currentStep + 1), { nodes: state.nodes, edges: state.edges }];
      state.currentStep += 1;
      state.canUndo = state.currentStep > 0;
      state.canRedo = false;
    }));
  },

  selectedEdge: null as Edge | null,
  
  selectEdge: (edgeId: string) => {
    set(produce((state) => {
      state.selectedEdge = state.edges.find((edge) => edge.id === edgeId) || null;
      state.selectedNode = null; // Deselect node when selecting edge
    }));
  },

  updateEdge: (edgeId: string, newData: any) => {
    set(produce((state) => {
      const edge = state.edges.find((e) => e.id === edgeId);
      if (edge) {
        Object.assign(edge, newData);
        state.history = [...state.history.slice(0, state.currentStep + 1), { nodes: state.nodes, edges: state.edges }];
        state.currentStep += 1;
        state.canUndo = state.currentStep > 0;
        state.canRedo = false;
      }
    }));
  },

  selectNode: (nodeId: string) => {
    set(produce((state) => {
      state.selectedNode = state.nodes.find((node: Node) => node.id === nodeId) || null;
    }));
  },

  updateNode: (nodeId: string, newData: any) => {
    set(produce((state) => {
      const node = state.nodes.find((n: Node) => n.id === nodeId);
      if (node) {
        node.data = newData;
        state.history = [...state.history.slice(0, state.currentStep + 1), { nodes: state.nodes, edges: state.edges }];
        state.currentStep += 1;
        state.canUndo = state.currentStep > 0;
        state.canRedo = false;
      }
    }));
  },

  saveToLocalStorage: () => {
    const { nodes, edges } = get();
    localStorage.setItem('flow-diagram', JSON.stringify({ nodes, edges }));
  },

  loadFromLocalStorage: () => {
    const data = localStorage.getItem('flow-diagram');
    if (data) {
      const { nodes, edges } = JSON.parse(data);
      set(produce((state) => {
        state.nodes = nodes;
        state.edges = edges;
        state.history = [...state.history, { nodes, edges }];
        state.currentStep += 1;
        state.canUndo = state.currentStep > 0;
        state.canRedo = false;
      }));
    }
  },

  undo: () => {
    set(produce((state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
        const { nodes, edges } = state.history[state.currentStep];
        state.nodes = nodes;
        state.edges = edges;
        state.canUndo = state.currentStep > 0;
        state.canRedo = true;
      }
    }));
  },

  redo: () => {
    set(produce((state) => {
      if (state.currentStep < state.history.length - 1) {
        state.currentStep += 1;
        const { nodes, edges } = state.history[state.currentStep];
        state.nodes = nodes;
        state.edges = edges;
        state.canUndo = true;
        state.canRedo = state.currentStep < state.history.length - 1;
      }
    }));
  },
}));
