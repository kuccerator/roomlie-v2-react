import React from 'react';
import { Asztal } from './Asztal';

interface TeremProps {
  tables: any[];
  roomSize: { width: number; height: number };
  selectedTableId: number | null;
  onTableClick: (id: number) => void;
  onTableMove: (id: number, x: number, y: number) => void;
  isAdmin: boolean; 
}

export function Terem({ tables, roomSize, selectedTableId, onTableClick, onTableMove, isAdmin }: TeremProps) {
  
  const teremStilus: React.CSSProperties = {
    width: `${roomSize.width}px`,
    height: `${roomSize.height}px`,
    backgroundColor: '#0f172a',
    position: 'relative',
    border: '4px solid #334155',
    borderRadius: '8px',
    boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)',
    overflow: 'hidden'
  };

  return (
    <div style={teremStilus}>
      {tables.map((table) => (
        <Asztal
          key={table.id}
          table={table}
          isSelected={table.id === selectedTableId}
          onClick={() => onTableClick(table.id)}
          onMove={onTableMove}
          isAdmin={isAdmin} 
        />
      ))}
    </div>
  );
}