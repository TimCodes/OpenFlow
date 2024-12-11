import { DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { NodeType } from '@/lib/types';
import { Square, Image, FileText } from 'lucide-react';

const nodeTypes: { type: NodeType; label: string; icon: any }[] = [
  { type: 'default', label: 'Basic Node', icon: Square },
  { type: 'text', label: 'Text Node', icon: FileText },
  { type: 'image', label: 'Image Node', icon: Image },
];

const Sidebar = () => {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 border-r border-border bg-card">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Node Types</h2>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-4 space-y-2">
          {nodeTypes.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
              className="cursor-move"
            >
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <node.icon className="w-4 h-4" />
                {node.label}
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
