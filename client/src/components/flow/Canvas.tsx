import { useCallback } from 'react';
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

const nodeTypes = {
  custom: CustomNode,
};

const Canvas = () => {
  const { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, snapToGrid } = useFlowStore();
  const { screenToFlowPosition, project } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = { ...params, type: 'smoothstep' };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

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
          x: Math.round(position.x / 15) * 15,
          y: Math.round(position.y / 15) * 15,
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
    [screenToFlowPosition, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        snapToGrid={snapToGrid}
        snapGrid={[15, 15]}
        fitView
      >
        <Background gap={15} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default Canvas;
