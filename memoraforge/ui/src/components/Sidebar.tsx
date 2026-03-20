/**
 * Sidebar — drag-and-drop node palette + flow controls
 */
import React, { useState, useEffect } from 'react';
import { NODE_CATEGORIES } from '../types/agent';
import { api } from '../api/client';
import { useFlowStore } from '../hooks/useFlowStore';

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: string, label: string) => void;
}

export function Sidebar({ onDragStart }: SidebarProps) {
  const [tab, setTab] = useState<'nodes' | 'status' | 'memory'>('nodes');
  const [health, setHealth] = useState<Record<string, unknown>[]>([]);
  const [memoryStats, setMemoryStats] = useState<Record<string, unknown> | null>(null);
  const { flowName, setFlowName, clearFlow, exportFlow, isDirty } = useFlowStore();

  useEffect(() => {
    if (tab === 'status') {
      api.checkHealth().then(setHealth).catch(() => {});
    }
    if (tab === 'memory') {
      api.getMemoryStats().then(setMemoryStats).catch(() => {});
    }
  }, [tab]);

  return (
    <div style={{
      width: '280px', background: '#0d1117', borderRight: '1px solid #21262d',
      display: 'flex', flexDirection: 'column', height: '100vh', color: '#c9d1d9',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid #21262d' }}>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#e94560' }}>
          🦀 MemoraForge
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
          Visual Agent Builder
        </div>
      </div>

      {/* Flow name */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #21262d' }}>
        <input
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
          style={{
            width: '100%', background: '#161b22', border: '1px solid #30363d',
            borderRadius: '6px', padding: '8px 10px', color: '#c9d1d9',
            fontSize: '13px',
          }}
        />
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button
            onClick={() => {
              const flow = exportFlow();
              const blob = new Blob([JSON.stringify(flow, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${flow.name.replace(/\s+/g, '_')}.json`;
              a.click();
            }}
            style={btnStyle}
          >
            Export
          </button>
          <button onClick={clearFlow} style={{ ...btnStyle, borderColor: '#f85149' }}>
            Clear
          </button>
        </div>
        {isDirty && (
          <div style={{ fontSize: '11px', color: '#f0883e', marginTop: '4px' }}>
            Unsaved changes
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #21262d' }}>
        {(['nodes', 'status', 'memory'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '10px', background: 'transparent',
              border: 'none', borderBottom: tab === t ? '2px solid #e94560' : '2px solid transparent',
              color: tab === t ? '#e94560' : '#6b7280', cursor: 'pointer',
              fontSize: '12px', fontWeight: 600, textTransform: 'uppercase',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
        {tab === 'nodes' && (
          <div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '12px' }}>
              Drag nodes onto the canvas to build your agent flow.
            </div>
            {NODE_CATEGORIES.map((category) => (
              <div key={category.label} style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '11px', fontWeight: 600, color: category.color,
                  textTransform: 'uppercase', marginBottom: '8px',
                }}>
                  {category.label}
                </div>
                {category.nodes.map((node) => (
                  <div
                    key={node.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, node.type, node.label)}
                    style={{
                      padding: '10px 12px', background: '#161b22',
                      border: '1px solid #30363d', borderRadius: '8px',
                      marginBottom: '6px', cursor: 'grab', transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = category.color)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#30363d')}
                  >
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{node.label}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                      {node.description}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {tab === 'status' && (
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
              Service Health
            </div>
            {health.map((svc: any) => (
              <div key={svc.service} style={{
                padding: '10px 12px', background: '#161b22',
                border: '1px solid #30363d', borderRadius: '8px',
                marginBottom: '6px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: svc.status === 'healthy' ? '#4ade80' : svc.status === 'degraded' ? '#fbbf24' : '#ef4444',
                  }} />
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{svc.service}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#6b7280' }}>
                    {svc.latencyMs}ms
                  </span>
                </div>
              </div>
            ))}
            <button onClick={() => api.checkHealth().then(setHealth)} style={btnStyle}>
              Refresh
            </button>
          </div>
        )}

        {tab === 'memory' && memoryStats && (
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
              Memory Hub Stats
            </div>
            {Object.entries(memoryStats).map(([key, val]) => (
              <div key={key} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '6px 0', borderBottom: '1px solid #21262d',
                fontSize: '12px',
              }}>
                <span style={{ color: '#6b7280' }}>{key}</span>
                <span>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '6px 12px', background: '#21262d', border: '1px solid #30363d',
  borderRadius: '6px', color: '#c9d1d9', cursor: 'pointer', fontSize: '12px',
  flex: 1,
};
