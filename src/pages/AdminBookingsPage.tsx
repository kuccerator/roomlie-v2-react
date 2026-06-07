import { useGetBookingsQuery, useUpdateBookingStatusMutation } from '../store/apiSlice';

export default function AdminBookingsPage() {
  const { data: bookings = [], isLoading, refetch } = useGetBookingsQuery(undefined);
  const [updateStatus] = useUpdateBookingStatusMutation();

  const handleStatusChange = async (id: number, status: 'accepted' | 'declined') => {
    try {
      await updateStatus({ id, status }).unwrap();
      alert(`Sikeres státuszmódosítás: ${status === 'accepted' ? 'Elfogadva' : 'Elutasítva'}`);
      refetch();
    } catch (err) {
      console.error(err);
      alert('Nem sikerült módosítani a foglalás állapotát.');
    }
  };

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', color: '#64748b' }}>Beérkezett foglalások betöltése...</div>;
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e293b', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
        📋 Beérkezett foglalások kezelése (Admin felület)
      </h2>

      {bookings.length === 0 ? (
        <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
          Nem található beérkezett foglalás az adatbázisban.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {bookings.map((b: any) => (
            <div key={b.id} style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b', marginBottom: '6px' }}>
                  Asztal #{b.tableId} | Foglaló: {b.name}
                </div>
                <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
                  📅 <strong>Dátum:</strong> {b.date} | ⏱️ <strong>Idősáv:</strong> {b.startTime} - {b.endTime}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  📧 {b.email} | 📞 {b.phone} | 👥 {b.headcount} fő
                </div>
                {b.notes && b.notes !== 'string' && (
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', marginTop: '4px' }}>
                    Megjegyzés: {b.notes}
                  </div>
                )}
              </div>

              {/* Gombok az elbíráláshoz */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {b.status === 'pending' ? (
                  <>
                    <button onClick={() => handleStatusChange(b.id, 'accepted')} style={{ padding: '8px 12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>Elfogad</button>
                    <button onClick={() => handleStatusChange(b.id, 'declined')} style={{ padding: '8px 12px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>Elutasít</button>
                  </>
                ) : (
                  <span style={{ fontSize: '13px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '4px', color: b.status === 'accepted' ? '#16a34a' : '#dc2626', backgroundColor: b.status === 'accepted' ? '#dcfce7' : '#fee2e2' }}>
                    {b.status === 'accepted' ? '✓ Elfogadva' : '✕ Elutasítva'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}