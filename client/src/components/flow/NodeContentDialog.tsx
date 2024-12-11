import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus } from "lucide-react";
import { NodeData } from '@/lib/types';

interface NodeContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: NodeData;
  onSave: (newContent: string) => void;
}

const NodeContentDialog = ({
  isOpen,
  onClose,
  nodeData,
  onSave,
}: NodeContentDialogProps) => {
  const [content, setContent] = useState(nodeData.content);

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContent(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Node Content</DialogTitle>
          <DialogDescription>
            {nodeData.type === 'image' 
              ? 'Upload or change the image for this node.'
              : 'Edit the text content of this node.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {nodeData.type === 'image' ? (
            <div className="space-y-4">
              {content && (
                <img
                  src={content}
                  alt="Node content"
                  className="max-w-full h-auto rounded-md"
                />
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('node-image-upload')?.click()}
              >
                <ImagePlus className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              <input
                id="node-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px]"
                placeholder="Enter node content..."
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NodeContentDialog;
