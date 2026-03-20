/**
 * MemoraForge Visual Builder — Main App
 */
import React, { useCallback } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Sidebar } from './components/Sidebar';
import { FlowCanvas } from './components/FlowCanvas';
import { PropertiesPanel } from './components/PropertiesPanel';

export default function App() {
  const onDragStart = useCallback(
    (event: React.DragEvent, nodeType: string, label: string) => {
      event.dataTransfer.setData('application/memoraforge-node-type', nodeType);
      event.dataTransfer.setData('application/memoraforge-node-label', label);
      event.dataTransfer.effectAllowed = 'move';
    },
    [],
  );

  return (
    <ReactFlowProvider>
      <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Sidebar onDragStart={onDragStart} />
        <FlowCanvas />
        <PropertiesPanel />
      </div>
    </ReactFlowProvider>
  );
}
