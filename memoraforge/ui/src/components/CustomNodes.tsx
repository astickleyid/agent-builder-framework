/**
 * Custom ReactFlow node types for the MemoraForge Visual Builder
 */
import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';

const nodeStyles: Record<string, { bg: string; border: string; icon: string }> = {
  agent:        { bg: '#1a1a2e', border: '#e94560', icon: '🦀' },
  memory:       { bg: '#16213e', border: '#0f3460', icon: '🧠' },
  tool:         { bg: '#2d1b4e', border: '#533483', icon: '🔧' },
  llm:          { bg: '#1b2a1b', border: '#2d6a4f', icon: '⚡' },
  input:        { bg: '#1a2a3e', border: '#4895ef', icon: '📥' },
  output:       { bg: '#3e1a2a', border: '#ef4848', icon: '📤' },
  orchestrator: { bg: '#2e1a1a', border: '#e9a045', icon: '🎯' },
};

interface CustomNodeData {
  label: string;
  nodeType: string;
  config?: Record<string, unknown>;
  status?: 'idle' | 'running' | 'error';
}

const CustomNode = memo(({ data, selected }: NodeProps<CustomNodeData>) => {
  const style = nodeStyles[data.nodeType] || nodeStyles.agent;
  const statusColor = data.status === 'running' ? '#4ade80' : data.status === 'error' ? '#ef4444' : '#6b7280';

  return (
    <div
      style={{
        background: style.bg,
        border: `2px solid ${selected ? '#fff' : style.border}`,
        borderRadius: '12px',
        padding: '12px 16px',
        minWidth: '180px',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
        boxShadow: selected ? '0 0 20px rgba(233,69,96,0.3)' : '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Input handle */}
      {data.nodeType !== 'input' && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: style.border, width: 10, height: 10, border: '2px solid #fff' }}
        />
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px' }}>{style.icon}</span>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>{data.label}</span>
        <div
          style={{
            width: 8, height: 8, borderRadius: '50%',
            background: statusColor, marginLeft: 'auto',
          }}
        />
      </div>

      {/* Config preview */}
      {data.config && Object.keys(data.config).length > 0 && (
        <div style={{ fontSize: '11px', color: '#9ca3af', lineHeight: 1.4 }}>
          {Object.entries(data.config).slice(0, 3).map(([key, val]) => (
            <div key={key}>
              <span style={{ color: '#6b7280' }}>{key}:</span>{' '}
              <span>{String(val)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Output handle */}
      {data.nodeType !== 'output' && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: style.border, width: 10, height: 10, border: '2px solid #fff' }}
        />
      )}
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export const nodeTypes = {
  agent: CustomNode,
  memory: CustomNode,
  tool: CustomNode,
  llm: CustomNode,
  input: CustomNode,
  output: CustomNode,
  orchestrator: CustomNode,
};

export default CustomNode;
