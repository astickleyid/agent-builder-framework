/**
 * PropertiesPanel — edit selected node configuration
 */
import React from 'react';
import { useFlowStore } from '../hooks/useFlowStore';

export function PropertiesPanel() {
  const { selectedNode, updateNodeData, removeNode } = useFlowStore();

  if (!selectedNode) {
    return (
      <div style={panelStyle}>
        <div style={{ color: '#6b7280', fontSize: '13px', textAlign: 'center', marginTop: '40px' }}>
          Select a node to edit its properties
        </div>
      </div>
    );
  }

  const { data } = selectedNode;
  const config = (data.config as Record<string, unknown>) || {};

  const updateConfig = (key: string, value: unknown) => {
    updateNodeData(selectedNode.id, {
      config: { ...config, [key]: value },
    });
  };

  return (
    <div style={panelStyle}>
      <div style={{
        fontSize: '14px', fontWeight: 700, color: '#e94560',
        marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <span>{data.label as string}</span>
        <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 400 }}>
          {selectedNode.type}
        </span>
      </div>

      {/* Label */}
      <label style={labelStyle}>Label</label>
      <input
        value={data.label as string}
        onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
        style={inputStyle}
      />

      {/* Config fields */}
      {Object.entries(config).map(([key, value]) => (
        <div key={key}>
          <label style={labelStyle}>{key}</label>
          {typeof value === 'boolean' ? (
            <select
              value={String(value)}
              onChange={(e) => updateConfig(key, e.target.value === 'true')}
              style={inputStyle}
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : typeof value === 'number' ? (
            <input
              type="number"
              value={value}
              onChange={(e) => updateConfig(key, Number(e.target.value))}
              style={inputStyle}
            />
          ) : (
            <input
              value={String(value)}
              onChange={(e) => updateConfig(key, e.target.value)}
              style={inputStyle}
            />
          )}
        </div>
      ))}

      {/* Add config field */}
      <button
        onClick={() => {
          const key = prompt('Config key name:');
          if (key) updateConfig(key, '');
        }}
        style={{ ...btnStyle, marginTop: '12px', width: '100%' }}
      >
        + Add Config Field
      </button>

      {/* Delete node */}
      <button
        onClick={() => removeNode(selectedNode.id)}
        style={{
          ...btnStyle, marginTop: '8px', width: '100%',
          borderColor: '#f85149', color: '#f85149',
        }}
      >
        Delete Node
      </button>

      {/* Node ID */}
      <div style={{ fontSize: '10px', color: '#484f58', marginTop: '16px', wordBreak: 'break-all' }}>
        ID: {selectedNode.id}
      </div>
    </div>
  );
}

const panelStyle: React.CSSProperties = {
  width: '260px', background: '#0d1117', borderLeft: '1px solid #21262d',
  padding: '16px', overflow: 'auto', height: '100vh',
  fontFamily: 'system-ui, sans-serif', color: '#c9d1d9',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '11px', color: '#6b7280',
  marginBottom: '4px', marginTop: '12px', textTransform: 'uppercase',
  fontWeight: 600, letterSpacing: '0.5px',
};

const inputStyle: React.CSSProperties = {
  width: '100%', background: '#161b22', border: '1px solid #30363d',
  borderRadius: '6px', padding: '8px 10px', color: '#c9d1d9',
  fontSize: '13px', boxSizing: 'border-box',
};

const btnStyle: React.CSSProperties = {
  padding: '8px 12px', background: '#21262d', border: '1px solid #30363d',
  borderRadius: '6px', color: '#c9d1d9', cursor: 'pointer', fontSize: '12px',
};
