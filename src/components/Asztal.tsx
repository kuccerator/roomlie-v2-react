import React, { useRef } from 'react';

interface AsztalProps {
  table: any;
  isSelected: boolean;
  onClick: () => void;
  onMove: (id: number, x: number, y: number) => void;
  isAdmin: boolean;
}

export function Asztal({ table, isSelected, onClick, onMove, isAdmin }: AsztalProps) {
  const asztalRef = useRef<HTMLDivElement>(null);

  // Méretek meghatározása a típus alapján
  const MERETEK: any = {
    snooker: { w: 190, h: 100 },
    'air-hockey': { w: 140, h: 70 },
    foosball: { w: 120, h: 60 }
  };

  const m = MERETEK[table.type] || { w: 100, h: 60 };

  const SZIN_MAP: any = {
    green: '#16a34a',
    red: '#dc2626',
    blue: '#2563eb',
    yellow: '#eab308',
    purple: '#a855f7'
  };

  const asztalSzine = SZIN_MAP[table.color] || table.color || '#64748b';
  
  const leVanZarva = table.isLocked === true || table['is-locked'] === true;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAdmin === false) {
      onClick(); 
      return;    
    }

    if (leVanZarva) {
      onClick(); 
      return;    
    }
    
    e.preventDefault();
    onClick();

    const teremElem = asztalRef.current?.parentElement;
    if (!teremElem) return;

    const teremRect = teremElem.getBoundingClientRect();
    
    let finalX = table.position?.x ?? 100;
    let finalY = table.position?.y ?? 100;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newX = moveEvent.clientX - teremRect.left - (m.w / 2);
      const newY = moveEvent.clientY - teremRect.top - (m.h / 2);
      
      finalX = Math.round(Math.max(0, Math.min(newX, teremRect.width - m.w)));
      finalY = Math.round(Math.max(0, Math.min(newY, teremRect.height - m.h)));

      if (asztalRef.current) {
        asztalRef.current.style.left = `${finalX}px`;
        asztalRef.current.style.top = `${finalY}px`;
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      onMove(table.id, finalX, finalY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const asztalStilus: React.CSSProperties = {
    position: 'absolute',
    left: `${table.position?.x ?? 100}px`,
    top: `${table.position?.y ?? 100}px`,
    width: `${m.w}px`,
    height: `${m.h}px`,
    
    backgroundColor: table.hasPufferError ? '#ef4444' : asztalSzine, 
    
    opacity: table.hasPufferError ? 1 : leVanZarva ? 0.6 : Math.max(0.35, (table.status || 5) / 10),
    
    border: isSelected ? '3px solid #ffffff' : leVanZarva ? '2px dashed rgba(0,0,0,0.6)' : '2px solid rgba(0,0,0,0.2)',
    borderRadius: '6px',
    
    cursor: !isAdmin ? 'pointer' : leVanZarva ? 'not-allowed' : 'move',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontFamily: 'sans-serif',
    fontSize: '12px',
    fontWeight: 'bold',
    boxShadow: isSelected ? '0 0 15px #ffffff' : '0 4px 6px rgba(0,0,0,0.3)',
    userSelect: 'none',
    transition: 'background-color 0.2s, opacity 0.2s, border 0.1s, box-shadow 0.1s'
  };

  return (
    <div 
      ref={asztalRef}
      style={asztalStilus}
      onMouseDown={handleMouseDown}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {leVanZarva && <span>🔒</span>}
        <span>{table.name}</span>
      </div>
      <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>
        {leVanZarva ? 'ZÁROLT' : `Státusz: ${table.status}`}
      </div>
    </div>
  );
}