import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import Canvas from '@/components/flow/Canvas';
import Sidebar from '@/components/flow/Sidebar';
import PropertiesPanel from '@/components/flow/PropertiesPanel';
import Toolbar from '@/components/flow/Toolbar';

const FlowEditor = () => {
  return (
    <ReactFlowProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Toolbar />
          <div className="flex-1 relative">
            <Canvas />
          </div>
        </div>
        <PropertiesPanel />
      </div>
    </ReactFlowProvider>
  );
};

export default FlowEditor;
