import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useFlowStore } from '@/hooks/useFlowStore';
import { cn } from '@/lib/utils';

const CustomNode = ({ id, data }: NodeProps) => {
  const { selectNode } = useFlowStore();

  return (
    <div
      className={cn(
        "px-4 py-2 shadow-lg rounded-lg border min-w-[150px] bg-background",
        "hover:shadow-xl transition-shadow cursor-pointer"
      )}
      onClick={() => selectNode(id)}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      {data.type === 'image' && data.content ? (
        <img
          src={data.content}
          alt="Node content"
          className="max-w-[200px] max-h-[200px] object-contain my-2"
        />
      ) : (
        <div className="p-2 min-h-[50px]">
          {data.content || data.label}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
};

export default memo(CustomNode);
