import React, { useState, useMemo } from 'react';
import { Upload, Plus, Trash2, AlertTriangle, Calculator, FileSpreadsheet } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { ComponentData, CGResult } from '../types';
import { cn } from '../lib/utils';

const INITIAL_COMPONENTS: ComponentData[] = [
  { id: '1', name: 'Main Chassis', weight: 15000, x: 0, y: 0, z: 500, category: 'Structure' },
  { id: '2', name: 'Engine Module', weight: 2000, x: -2000, y: 0, z: 800, category: 'Powertrain' },
  { id: '3', name: 'Turret System', weight: 5000, x: 500, y: 0, z: 1500, category: 'Weapon' },
  { id: '4', name: 'Armor Pack (Front)', weight: 3000, x: 3000, y: 0, z: 1000, category: 'Protection' },
];

export default function WeightSimulator() {
  const [components, setComponents] = useState<ComponentData[]>(INITIAL_COMPONENTS);

  const cg = useMemo((): CGResult => {
    let totalWeight = 0;
    let sumWX = 0;
    let sumWY = 0;
    let sumWZ = 0;

    components.forEach((c) => {
      totalWeight += c.weight;
      sumWX += c.weight * c.x;
      sumWY += c.weight * c.y;
      sumWZ += c.weight * c.z;
    });

    return {
      totalWeight,
      cgX: totalWeight > 0 ? sumWX / totalWeight : 0,
      cgY: totalWeight > 0 ? sumWY / totalWeight : 0,
      cgZ: totalWeight > 0 ? sumWZ / totalWeight : 0,
    };
  }, [components]);

  const addComponent = () => {
    const newComp: ComponentData = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Component',
      weight: 100,
      x: 0,
      y: 0,
      z: 0,
      category: 'General'
    };
    setComponents([...components, newComp]);
  };

  const updateComponent = (id: string, field: keyof ComponentData, value: string | number) => {
    setComponents(components.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
  };

  const chartData = [
    ...components.map(c => ({ x: c.x, y: c.z, weight: c.weight, name: c.name, type: 'component' })),
    { x: cg.cgX, y: cg.cgZ, weight: 500, name: 'Center of Gravity', type: 'cg' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Input Panel */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="bg-white border border-hanwha-border rounded shadow-sm overflow-hidden">
          <div className="bg-hanwha-grey px-4 py-3 border-b border-hanwha-border flex items-center justify-between">
            <h3 className="font-bold text-hanwha-dark flex items-center gap-2 text-xs uppercase tracking-widest">
              <FileSpreadsheet className="w-4 h-4 text-hanwha-orange" />
              Weight Inventory
            </h3>
            <div className="flex gap-2">
              <button className="p-1.5 text-gray-400 hover:bg-white rounded transition-colors border border-transparent hover:border-hanwha-border">
                <Upload className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={addComponent}
                className="p-1.5 bg-hanwha-orange text-white hover:bg-orange-600 rounded transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {components.map((c) => (
              <div key={c.id} className="p-4 border-b border-hanwha-border last:border-0 hover:bg-hanwha-grey/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <input 
                    className="font-bold text-hanwha-dark bg-transparent border-none p-0 focus:ring-0 w-2/3 text-sm uppercase tracking-tight"
                    value={c.name}
                    onChange={(e) => updateComponent(c.id, 'name', e.target.value)}
                  />
                  <button 
                    onClick={() => removeComponent(c.id)}
                    className="text-gray-300 hover:text-hanwha-orange transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 font-mono">W:</span>
                    <input 
                      type="number"
                      className="w-full bg-hanwha-grey border border-hanwha-border rounded px-2 py-1 focus:ring-1 focus:ring-hanwha-orange focus:bg-white transition-all font-mono"
                      value={c.weight}
                      onChange={(e) => updateComponent(c.id, 'weight', Number(e.target.value))}
                    />
                    <span className="text-gray-400">kg</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 font-mono">X:</span>
                    <input 
                      type="number"
                      className="w-full bg-hanwha-grey border border-hanwha-border rounded px-2 py-1 focus:ring-1 focus:ring-hanwha-orange focus:bg-white transition-all font-mono"
                      value={c.x}
                      onChange={(e) => updateComponent(c.id, 'x', Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 font-mono">Y:</span>
                    <input 
                      type="number"
                      className="w-full bg-hanwha-grey border border-hanwha-border rounded px-2 py-1 focus:ring-1 focus:ring-hanwha-orange focus:bg-white transition-all font-mono"
                      value={c.y}
                      onChange={(e) => updateComponent(c.id, 'y', Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 font-mono">Z:</span>
                    <input 
                      type="number"
                      className="w-full bg-hanwha-grey border border-hanwha-border rounded px-2 py-1 focus:ring-1 focus:ring-hanwha-orange focus:bg-white transition-all font-mono"
                      value={c.z}
                      onChange={(e) => updateComponent(c.id, 'z', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-hanwha-dark text-white rounded p-5 shadow-xl border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-hanwha-orange" />
            <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400">System CG Analysis</h4>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end pb-3 border-b border-gray-800">
              <span className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">Gross Weight</span>
              <span className="text-3xl font-bold text-hanwha-orange">{(cg.totalWeight / 1000).toFixed(2)} <span className="text-[10px] font-normal text-gray-500 uppercase">metric tons</span></span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col bg-white/5 p-2 rounded">
                <span className="text-[9px] text-gray-500 font-bold uppercase">CG X-Pos</span>
                <span className="font-mono text-sm text-gray-200">{cg.cgX.toFixed(1)}<span className="text-[9px] ml-0.5 opacity-50">mm</span></span>
              </div>
              <div className="flex flex-col bg-white/5 p-2 rounded">
                <span className="text-[9px] text-gray-500 font-bold uppercase">CG Y-Pos</span>
                <span className="font-mono text-sm text-gray-200">{cg.cgY.toFixed(1)}<span className="text-[9px] ml-0.5 opacity-50">mm</span></span>
              </div>
              <div className="flex flex-col bg-white/5 p-2 rounded">
                <span className="text-[9px] text-gray-500 font-bold uppercase">CG Z-Elev</span>
                <span className="font-mono text-sm text-gray-200">{cg.cgZ.toFixed(1)}<span className="text-[9px] ml-0.5 opacity-50">mm</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Panel */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="bg-white border border-hanwha-border rounded shadow-sm p-8 flex-1 min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-hanwha-dark uppercase tracking-tight">System Spatial Distribution (X-Z)</h3>
              <p className="text-xs text-gray-400 font-mono mt-1">Cross-sectional analysis of component center points</p>
            </div>
            {cg.cgZ > 1200 && (
              <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded flex items-center gap-2 text-[10px] font-bold border border-red-100 uppercase tracking-widest animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                Stability Warning: High CG
              </div>
            )}
          </div>
          
          <div className="h-[500px] w-full bg-hanwha-grey/30 rounded border border-dashed border-hanwha-border p-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="X" 
                  unit="mm" 
                  domain={[-4000, 4000]}
                  tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono' }}
                  label={{ value: 'Lateral Position (X)', position: 'bottom', fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Z" 
                  unit="mm" 
                  domain={[0, 2500]}
                  tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono' }}
                  label={{ value: 'Elevation (Z)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                />
                <ZAxis type="number" dataKey="weight" range={[40, 600]} name="Weight" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3', stroke: '#F37321' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-hanwha-dark text-white p-3 border border-gray-700 rounded shadow-2xl">
                          <p className="font-bold text-xs uppercase tracking-widest text-hanwha-orange mb-1 border-b border-white/10 pb-1">{data.name}</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-mono">
                            <span className="text-gray-500">MASS:</span>
                            <span>{data.weight} kg</span>
                            <span className="text-gray-500">X-POS:</span>
                            <span>{data.x} mm</span>
                            <span className="text-gray-500">Z-ELEV:</span>
                            <span>{data.y} mm</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine x={0} stroke="#cbd5e1" strokeDasharray="5 5" />
                <Scatter data={chartData}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.type === 'cg' ? '#F37321' : '#1A1A1A'} 
                      stroke={entry.type === 'cg' ? '#FFFFFF' : '#333333'}
                      strokeWidth={entry.type === 'cg' ? 3 : 1}
                      fillOpacity={entry.type === 'cg' ? 1 : 0.6}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
