import React, { useState, useEffect } from 'react';
import { useGetTableTimeslotsQuery } from '../store/apiSlice';

interface ReszletesNezetProps {
  table: any;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, payload: any) => void;
  isAdmin: boolean;
  onCreateBooking: (bookingData: any) => Promise<void>;
}

export function ReszletesNezet({ table, onDelete, onStatusChange, isAdmin, onCreateBooking }: ReszletesNezetProps) {
  // Személyes adatok állapota
  const [bookerName, setBookerName] = useState('');
  const [bookerEmail, setBookerEmail] = useState('');
  const [bookerPhone, setBookerPhone] = useState('');
  const [headcount, setHeadcount] = useState(2);
  const [notes, setNotes] = useState('');

  // Naptár és Időpont állapotok
  const MAI_NAP = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(MAI_NAP);
  const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    setSelectedSlot(null);
  }, [table?.id, selectedDate]);

  const { data: slots = [], isLoading: slotsLoading } = useGetTableTimeslotsQuery(
    table ? { tableId: table.id, date: selectedDate } : { tableId: 0, date: '' },
    { skip: !table }
  );

  if (!table) {
    return (
      <div style={{ color: '#64748b', textAlign: 'center', fontSize: '14px', fontStyle: 'italic', padding: '20px 0' }}>
        Kattints egy asztalra a részletek megtekintéséhez!
      </div>
    );
  }

  const tipusNevek: any = {
    snooker: 'Biliárd (Snooker)',
    'air-hockey': 'Léghoki',
    foosball: 'Csocsó'
  };

  const leVanZarva = table.isLocked === true || table['is-locked'] === true;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookerEmail.trim())) {
      alert('Kérlek érvényes e-mail címet adj meg!');
      return;
    }

    if (!bookerName || !bookerPhone || !selectedSlot) {
      alert('Kérlek töltsd ki az összes kötelező mezőt és válassz idősávot!');
      return;
    }

    setBookingLoading(true);
    try {
      const payload: any = {
        tableId: Number(table.id),
        date: selectedDate,
        startTime: String(selectedSlot.startTime),
        endTime: String(selectedSlot.endTime),
        name: String(bookerName).trim(),
        email: String(bookerEmail).trim(),
        phone: String(bookerPhone).trim(),
        headcount: Number(headcount)
      };

      if (notes.trim() !== '') {
        payload.notes = notes.trim();
      }

      console.log("✈️ Küldés a Zod séma szerint:", payload);

      await onCreateBooking(payload);
      alert('🎉 SIKER! A foglalás elmentve az adatbázisba!');
      
      setSelectedSlot(null);
      setNotes('');
      setBookerName('');
      setBookerEmail('');
      setBookerPhone('');
      setHeadcount(2);
    } catch (err: any) {
      console.error("❌ Hiba:", err);
      const szerverUzenet = err?.data?.message || err?.data?.error?.message || "Hiba történt a mentés során.";
      alert(`Sikertelen foglalás: ${szerverUzenet}`);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', color: '#1e293b' }}>
      <h3 style={{ marginTop: 0, borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
        Asztal részletei ({table.name})
      </h3>

      <div style={{ marginBottom: '8px', fontSize: '13px' }}><strong>Típus:</strong> {tipusNevek[table.type] || table.type}</div>
      <div style={{ marginBottom: '8px', fontSize: '13px' }}><strong>Kategória:</strong> {table.category}</div>
      <div style={{ marginBottom: '12px', fontSize: '13px' }}><strong>Pozíció:</strong> X: {table.position?.x}px, Y: {table.position?.y}px</div>

      {/* ADMIN PANEL */}
      {isAdmin && (
        <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '15px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#475569' }}>🛠️ Adminisztráció</h4>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>Szín:</label>
          <select
            value={table.color || 'green'}
            onChange={(e) => onStatusChange(table.id, { color: e.target.value })}
            style={{ width: '100%', padding: '6px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
          >
            <option value="green">Zöld</option>
            <option value="red">Piros</option>
            <option value="blue">Kék</option>
            <option value="yellow">Sárga</option>
            <option value="purple">Lila</option>
          </select>

          <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>Állapot ({table.status || 5}/10):</label>
          <input
            type="range"
            min="1"
            max="10"
            value={table.status || 5}
            onChange={(e) => onStatusChange(table.id, parseInt(e.target.value, 10))}
            style={{ width: '100%', marginBottom: '10px' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '5px' }}>
            <input
              type="checkbox"
              id="lock-check"
              checked={leVanZarva}
              onChange={(e) => onStatusChange(table.id, { isLocked: e.target.checked, 'is-locked': e.target.checked })}
            />
            <label htmlFor="lock-check" style={{ fontSize: '12px', fontWeight: 'bold' }}>🔒 Pozíció zárolása</label>
          </div>
        </div>
      )}

      <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '15px 0' }} />

      {/* ─── NAPTÁR ÉS IDŐPONT VÁLASZTÓ  ─── */}
      <div style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#166534', fontSize: '14px' }}>📅 1. Válassz Napot és Időpontot</h4>

        <input
          type="date"
          min={MAI_NAP}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #86efac', marginBottom: '10px', boxSizing: 'border-box' }}
        />

        {slotsLoading ? (
          <div style={{ fontSize: '12px', color: '#166534', textAlign: 'center', padding: '10px' }}>Idősávok ellenőrzése...</div>
        ) : slots.length === 0 ? (
          <div style={{ fontSize: '12px', color: '#dc2626', textAlign: 'center', padding: '10px', fontStyle: 'italic' }}>Nincsenek elérhető idősávok erre a napra.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
            {slots.map((slot: any, index: number) => {
              const isAvailable = slot.isAvailable;
              const isSelected = selectedSlot?.startTime === slot.startTime;

              return (
                <button
                  key={index}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => setSelectedSlot(slot)}
                  style={{
                    padding: '8px 4px',
                    fontSize: '11px',
                    borderRadius: '4px',
                    border: isAvailable ? '1px solid #86efac' : '1px solid #cbd5e1',
                    fontWeight: 'bold',
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    backgroundColor: isSelected 
                      ? '#16a34a' 
                      : isAvailable ? '#ffffff' : '#e2e8f0',
                    color: isSelected 
                      ? '#ffffff' 
                      : isAvailable ? '#166534' : '#94a3b8',
                    transition: 'all 0.1s'
                  }}
                >
                  {slot.startTime} - {slot.endTime} {!isAvailable && '(Foglalt)'}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── SZEMÉLYES ADATOK ŰRLAP ─── */}
      <form onSubmit={handleBookingSubmit} style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#166534', fontSize: '14px' }}>👤 2. Add meg az adataidat</h4>

        <input
          type="text"
          placeholder="Foglaló neve"
          required
          value={bookerName}
          onChange={(e) => setBookerName(e.target.value)}
          style={{ width: '100%', padding: '6px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #86efac', boxSizing: 'border-box' }}
        />

        <input
          type="email"
          placeholder="E-mail cím"
          required
          value={bookerEmail}
          onChange={(e) => setBookerEmail(e.target.value)}
          style={{ width: '100%', padding: '6px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #86efac', boxSizing: 'border-box' }}
        />

        <input
          type="text"
          placeholder="Telefonszám"
          required
          value={bookerPhone}
          onChange={(e) => setBookerPhone(e.target.value)}
          style={{ width: '100%', padding: '6px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #86efac', boxSizing: 'border-box' }}
        />

        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '11px', color: '#166534', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>Résztvevők száma:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={headcount}
            onChange={(e) => setHeadcount(parseInt(e.target.value, 10) || 1)}
            style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #86efac', boxSizing: 'border-box' }}
          />
        </div>

        <textarea
          placeholder="Megjegyzés (opcionális)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ width: '100%', padding: '6px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #86efac', boxSizing: 'border-box', height: '40px', resize: 'none' }}
        />

        <button
          type="submit"
          disabled={bookingLoading || !selectedSlot}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: !selectedSlot ? '#94a3b8' : '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: !selectedSlot ? 'not-allowed' : 'pointer'
          }}
        >
          {bookingLoading ? 'Mentés...' : 'Asztal lefoglalása'}
        </button>
      </form>

      {/* ADMIN TÖRLES GOMB */}
      {isAdmin && (
        <button
          onClick={() => onDelete(table.id)}
          style={{ width: '100%', padding: '8px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', marginTop: '15px' }}
        >
          🗑️ Asztal végleges törlése
        </button>
      )}
    </div>
  );
}