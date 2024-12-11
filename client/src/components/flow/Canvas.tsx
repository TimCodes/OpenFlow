import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  addEdge,
  useReactFlow,
} from 'reactflow';
import { useFlowStore } from '@/hooks/useFlowStore';
import CustomNode from '@/components/flow/CustomNode';
import EdgeLabelDialog from '@/components/flow/EdgeLabelDialog';

const nodeTypes = {
  custom: CustomNode,
};

const Canvas = () => {
  const { 
    nodes, 
    edges, 
    setNodes, 
    setEdges, 
    onNodesChange, 
    onEdgesChange, 
    snapToGrid,
    selectEdge,
    selectedEdge,
    updateEdge
  } = useFlowStore();
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: 'smoothstep',
        label: 'Edge Label',
        animated: false,
        style: { 
          stroke: '#666',
          strokeWidth: 2,
          cursor: 'pointer'
        }
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      selectEdge(edge.id);
    },
    [selectEdge]
  );

  const [editingEdge, setEditingEdge] = useState<Edge | null>(null);

  const onEdgeDoubleClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      setEditingEdge(edge);
    },
    []
  );

  const handleEdgeLabelSave = useCallback((newLabel: string) => {
    if (editingEdge) {
      updateEdge(editingEdge.id, { ...editingEdge, label: newLabel });
    }
  }, [editingEdge, updateEdge]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      let position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      if (snapToGrid) {
        position = {
          x: Math.round(position.x / 25) * 25,
          y: Math.round(position.y / 25) * 25,
        };
      }

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: 'custom',
        position,
        data: { label: `${type} node`, type, content: '' },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes, snapToGrid]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      const selectedNodeId = nodes.find(node => node.selected)?.id;
      const selectedEdgeId = edges.find(edge => edge.selected)?.id;

      if (selectedNodeId) {
        setNodes(nodes.filter(node => node.id !== selectedNodeId));
      }
      if (selectedEdgeId) {
        setEdges(edges.filter(edge => edge.id !== selectedEdgeId));
      }
    }
  }, [nodes, edges, setNodes, setEdges]);

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        snapToGrid={snapToGrid}
        snapGrid={[25, 25]}
        fitView
      >
        <Background gap={25} size={1} color="#30363d" />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <EdgeLabelDialog
        isOpen={!!editingEdge}
        onClose={() => setEditingEdge(null)}
        initialLabel={editingEdge?.label as string || ''}
        onSave={handleEdgeLabelSave}
      />
    </div>
  );
};

export default Canvas;
