import { useGetMyBookingsQuery } from '../store/apiSlice';

export default function FoglalasaimPage() {
  const { data: bookings = [], isLoading } = useGetMyBookingsQuery(undefined);

  const statusForditas: any = {
    pending: { szoveg: '⏳ Függőben', szin: '#d97706', bg: '#fef3c7' },
    accepted: { szoveg: '✅ Elfogadva', szin: '#16a34a', bg: '#dcfce7' },
    declined: { szoveg: '❌ Elutasítva', szin: '#dc2626', bg: '#fee2e2' }
  };

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', color: '#64748b' }}>Foglalások betöltése...</div>;
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e293b', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
        📅 Saját foglalásaim
      </h2>

      {bookings.length === 0 ? (
        <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
          Még nem küldtél be egyetlen foglalási igényt sem.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {bookings.map((b: any) => {
            const st = statusForditas[b.status] || { szoveg: b.status, szin: '#475569', bg: '#f1f5f9' };
            return (
              <div key={b.id} style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#0f172a', marginBottom: '4px' }}>Asztal #{b.tableId} {b.tableName && `(${b.tableName})`}</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}><strong>Dátum:</strong> {b.date} | <strong>Idősáv:</strong> {b.startTime} - {b.endTime}</div>
                  <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}><strong>Név:</strong> {b.name} | <strong>Létszám:</strong> {b.headcount} fő</div>
                </div>
                <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', color: st.szin, backgroundColor: st.bg }}>{st.szoveg}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}