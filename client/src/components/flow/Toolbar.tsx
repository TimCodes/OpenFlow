import { useFlowStore } from '@/hooks/useFlowStore';
import { Button } from '@/components/ui/button';
import {
  Save,
  Upload,
  Undo,
  Redo,
  Grid,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useReactFlow } from 'reactflow';

const Toolbar = () => {
  const { saveToLocalStorage, loadFromLocalStorage, undo, redo, canUndo, canRedo } = useFlowStore();
  const { zoomIn, zoomOut, setViewport } = useReactFlow();

  const handleSave = () => {
    saveToLocalStorage();
  };

  const handleLoad = () => {
    loadFromLocalStorage();
  };

  return (
    <div className="h-12 border-b border-border bg-card flex items-center px-4 gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleSave}
        title="Save"
      >
        <Save className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleLoad}
        title="Load"
      >
        <Upload className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-2" />
      <Button
        variant="outline"
        size="icon"
        onClick={undo}
        disabled={!canUndo}
        title="Undo"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={redo}
        disabled={!canRedo}
        title="Redo"
      >
        <Redo className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-2" />
      <Button
        variant="outline"
        size="icon"
        onClick={() => zoomIn()}
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => zoomOut()}
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Toolbar;
