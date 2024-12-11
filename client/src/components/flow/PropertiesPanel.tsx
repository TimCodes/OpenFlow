import { useState } from 'react';
import { useFlowStore } from '@/hooks/useFlowStore';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import NodeContentDialog from './NodeContentDialog';

const PropertiesPanel = () => {
  const { selectedNode, updateNode } = useFlowStore();
  const [isEditing, setIsEditing] = useState(false);

  if (!selectedNode) {
    return (
      <div className="w-64 border-l border-border bg-card p-4">
        <p className="text-muted-foreground text-center">
          Select a node to view properties
        </p>
      </div>
    );
  }

  const handleContentChange = (value: string) => {
    updateNode(selectedNode.id, { ...selectedNode.data, content: value });
  };

  

  return (
    <div className="w-64 border-l border-border bg-card">
      <Card className="m-4">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Node Type</Label>
            <Input value={selectedNode.data.type} disabled />
          </div>

          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setIsEditing(true)}
            >
              Edit Content
            </Button>
          </div>
          <NodeContentDialog
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            nodeData={selectedNode.data}
            onSave={handleContentChange}
          />
        </div>
      </Card>
    </div>
  );
};

export default PropertiesPanel;
