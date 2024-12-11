import { useFlowStore } from '@/hooks/useFlowStore';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ImagePlus } from 'lucide-react';

const PropertiesPanel = () => {
  const { selectedNode, updateNode, nodes } = useFlowStore();

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateNode(selectedNode.id, {
          ...selectedNode.data,
          content: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-64 border-l border-border bg-card">
      <Card className="m-4">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Node Type</Label>
            <Input value={selectedNode.data.type} disabled />
          </div>

          {selectedNode.data.type === 'image' ? (
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="flex flex-col gap-2">
                {selectedNode.data.content && (
                  <img
                    src={selectedNode.data.content}
                    alt="Node content"
                    className="max-w-full h-auto"
                  />
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={selectedNode.data.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Enter content..."
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PropertiesPanel;
