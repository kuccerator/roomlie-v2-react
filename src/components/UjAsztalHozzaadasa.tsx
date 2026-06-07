import { useState } from 'react';

export const UjAsztalHozzaadasa = ({ onAdd }: any) => {
  const [formData, setFormData] = useState({
    type: 'foosball',
    category: 'normal',
    color: 'green', 
    status: 10,
    x: 100,
    y: 100,
    isLocked: false
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const ADATOK: any = {
      snooker: { w: 190, h: 100, p: 50 },
      'air-hockey': { w: 140, h: 70, p: 40 },
      foosball: { w: 120, h: 60, p: 30 }
    };

    const m = ADATOK[formData.type];

    // Ha véletlenül üresen maradt az input, 0-nak vesszük a számoláshoz
    const currentX = formData.x || 0;
    const currentY = formData.y || 0;

    const falHiba =
      currentX < m.p || // bal fal
      currentY < m.p || // felső fal
      (currentX + m.w + m.p) > 800 || // jobb fal
      (currentY + m.h + m.p) > 600;   // alsó fal

    if (falHiba) {
      alert(`Hiba! A(z) ${formData.type} asztalnak legalább ${m.p}px szabad hely kell a falaktól!`);
      return; 
    }

    // Ha minden oké, összeállítjuk a backendnek tetsző tiszta objektumot
    const newTable = {
      id: Date.now(),
      type: formData.type,
      category: formData.category, 
      color: formData.color,
      status: Number(formData.status || 10),
      position: { x: currentX, y: currentY },
      isLocked: formData.isLocked,
      'is-locked': formData.isLocked
    };

    onAdd(newTable);
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      border: '1px solid #ddd',
      marginBottom: '20px',
      fontFamily: 'sans-serif'
    }}>
      <h3 style={{ marginTop: 0, color: '#1e293b' }}>Új asztal hozzáadása</h3>
      <form onSubmit={handleSubmit}>
        
        {/* Típus választó */}
        <div style={{ marginBottom: '10px' }}> {/* ITT VOLT A HIBA, JAVÍTVA! */}
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Típus:</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="snooker">Biliárd (Snooker)</option>
            <option value="air-hockey">Léghoki</option>
            <option value="foosball">Csocsó</option>
          </select>
        </div>

        {/* Kategória választó */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Kategória:</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="normal">Normál</option>
            <option value="competition">Verseny</option>
            <option value="kids">Gyerek</option>
          </select>
        </div>

        {/* Szín választó */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Szín:</label>
          <select
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="green">Zöld (green)</option>
            <option value="red">Piros (red)</option>
            <option value="blue">Kék (blue)</option>
            <option value="yellow">Sárga (yellow)</option>
            <option value="purple">Lila (purple)</option>
          </select>
        </div>

        {/* X és Y pozíció  */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>X pozíció:</label>
            <input
              type="number"
              value={Number.isNaN(formData.x) ? '' : formData.x}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                setFormData({ ...formData, x: val });
              }}
              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Y pozíció:</label>
            <input
              type="number"
              value={Number.isNaN(formData.y) ? '' : formData.y}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                setFormData({ ...formData, y: val });
              }}
              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        {/* Zárolás checkbox */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <input 
            type="checkbox" 
            id="locked" 
            checked={formData.isLocked}
            onChange={(e) => setFormData({ ...formData, isLocked: e.target.checked })} 
          />
          <label htmlFor="locked" style={{ marginLeft: '6px', color: '#64748b', fontSize: '13px', cursor: 'pointer' }}>
            Zárolt (nem mozgatható)
          </label>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '6px',
            cursor: 'pointer',
            width: '100%',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)'
          }}
        >
          Asztal lehelyezése
        </button>
      </form>
    </div>
  );
};