/**
 * Zustand store for the visual flow builder state
 */
import { create } from 'zustand';
import type { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect } from 'reactflow';
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  flowName: string;
  isDirty: boolean;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  setSelectedNode: (node: Node | null) => void;
  setFlowName: (name: string) => void;
  clearFlow: () => void;
  loadFlow: (nodes: Node[], edges: Edge[], name: string) => void;
  exportFlow: () => { nodes: Node[]; edges: Edge[]; name: string };
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  flowName: 'Untitled Agent Flow',
  isDirty: false,

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
      isDirty: true,
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
      isDirty: true,
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(
        { ...connection, animated: true, style: { stroke: '#e94560' } },
        get().edges,
      ),
      isDirty: true,
    });
  },

  addNode: (node) => {
    set({ nodes: [...get().nodes, node], isDirty: true });
  },

  removeNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNode: get().selectedNode?.id === nodeId ? null : get().selectedNode,
      isDirty: true,
    });
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n,
      ),
      isDirty: true,
    });
  },

  setSelectedNode: (node) => set({ selectedNode: node }),

  setFlowName: (name) => set({ flowName: name, isDirty: true }),

  clearFlow: () =>
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
      flowName: 'Untitled Agent Flow',
      isDirty: false,
    }),

  loadFlow: (nodes, edges, name) =>
    set({ nodes, edges, flowName: name, isDirty: false, selectedNode: null }),

  exportFlow: () => ({
    nodes: get().nodes,
    edges: get().edges,
    name: get().flowName,
  }),
}));
