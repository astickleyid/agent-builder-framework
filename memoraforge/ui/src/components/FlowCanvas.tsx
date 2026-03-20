/**
 * FlowCanvas — main ReactFlow canvas for the visual builder
 */
import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type ReactFlowInstance,
  type Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlowStore } from '../hooks/useFlowStore';
import { nodeTypes } from './CustomNodes';
import { NODE_CATEGORIES } from '../types/agent';

export function FlowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const {
    nodes, edges, onNodesChange, onEdgesChange, onConnect,
    addNode, setSelectedNode,
  } = useFlowStore();

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const nodeType = event.dataTransfer.getData('application/memoraforge-node-type');
    const nodeLabel = event.dataTransfer.getData('application/memoraforge-node-label');

    if (!nodeType || !reactFlowInstance.current || !reactFlowWrapper.current) return;

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.current.screenToFlowPosition({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });

    // Find default config for this node type
    const defaultConfig = NODE_CATEGORIES
      .flatMap((c) => c.nodes)
      .find((n) => n.type === nodeType)?.defaultConfig ?? {};

    const newNode: Node = {
      id: `${nodeType}_${crypto.randomUUID().slice(0, 8)}`,
      type: nodeType,
      position,
      data: {
        label: nodeLabel || nodeType,
        nodeType,
        config: defaultConfig,
        status: 'idle',
      },
    };

    addNode(newNode);
  }, [addNode]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div ref={reactFlowWrapper} style={{ flex: 1, height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        style={{ background: '#0d1117' }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#30363d', strokeWidth: 2 },
        }}
      >
        <Background color="#21262d" gap={20} size={1} />
        <Controls
          style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px' }}
        />
        <MiniMap
          style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px' }}
          maskColor="rgba(0,0,0,0.6)"
          nodeColor={(node) => {
            switch (node.type) {
              case 'agent': return '#e94560';
              case 'memory': return '#0f3460';
              case 'tool': return '#533483';
              case 'llm': return '#2d6a4f';
              case 'input': return '#4895ef';
              case 'output': return '#ef4848';
              case 'orchestrator': return '#e9a045';
              default: return '#6b7280';
            }
          }}
        />
      </ReactFlow>
    </div>
  );
}
