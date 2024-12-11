import { create } from 'zustand';
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
  history: { nodes: Node[]; edges: Edge[] }[];
  currentStep: number;
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  selectNode: (nodeId: string) => void;
  updateNode: (nodeId: string, newData: any) => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  history: [],
  currentStep: -1,
  canUndo: false,
  canRedo: false,

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
      state.nodes = applyNodeChanges(changes, state.nodes);
      state.history = [...state.history.slice(0, state.currentStep + 1), { nodes: state.nodes, edges: state.edges }];
      state.currentStep += 1;
      state.canUndo = state.currentStep > 0;
      state.canRedo = false;
    }));
  },

  onEdgesChange: (changes) => {
    set(produce((state) => {
      state.edges = applyEdgeChanges(changes, state.edges);
      state.history = [...state.history.slice(0, state.currentStep + 1), { nodes: state.nodes, edges: state.edges }];
      state.currentStep += 1;
      state.canUndo = state.currentStep > 0;
      state.canRedo = false;
    }));
  },

  selectNode: (nodeId) => {
    set(produce((state) => {
      state.selectedNode = state.nodes.find((node) => node.id === nodeId) || null;
    }));
  },

  updateNode: (nodeId, newData) => {
    set(produce((state) => {
      const node = state.nodes.find((n) => n.id === nodeId);
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
