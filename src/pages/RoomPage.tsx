import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    useGetTablesQuery,
    useUpdateTableMutation,
    useAddTableMutation,
    useDeleteTableMutation,
    useUpdateTablePositionMutation,
    useCreateBookingMutation
} from '../store/apiSlice';
import { Terem } from '../components/Terem';
import { ReszletesNezet } from '../components/ReszletesNezet';
import { UjAsztalHozzaadasa } from '../components/UjAsztalHozzaadasa';

export default function RoomPage() {
    // 1. Adatok és mutációk az API-ból
    const { data: serverTables = [], isLoading } = useGetTablesQuery(undefined);
    const [updateTable] = useUpdateTableMutation();
    const [createBooking] = useCreateBookingMutation();
    const [addTableMutation] = useAddTableMutation();
    const [deleteTableMutation] = useDeleteTableMutation();
    const [updateTablePosition] = useUpdateTablePositionMutation();

    // Aktuális felhasználó lekérése a Redux-ból
    const user = useSelector((state: any) => state.auth.user);

    // Lokális állapotok
    const roomSize = { width: 800, height: 600 };
    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // Kijelölt asztal megkeresése
    const selectedTable = serverTables.find((t: any) => t.id === selectedTableId);

    const MERETEK: any = {
        snooker: { w: 190, h: 100, p: 50 },
        'air-hockey': { w: 140, h: 70, p: 40 },
        foosball: { w: 120, h: 60, p: 30 }
    };

    // Ütközésvizsgáló logika
    const checkTablePlacement = (newTable: any) => {
        const m = MERETEK[newTable.type];
        if (!m || !newTable.position) return false;

        const falHiba =
            newTable.position.x < m.p ||
            newTable.position.y < m.p ||
            (newTable.position.x + m.w + m.p) > roomSize.width ||
            (newTable.position.y + m.h + m.p) > roomSize.height;

        const asztalHiba = serverTables.some((t: any) => {
            if (t.id === newTable.id) return false;
            const tMeret = MERETEK[t.type];
            if (!tMeret || !t.position) return false;

            return isOverlapping(
                { x: newTable.position.x, y: newTable.position.y, w: m.w, h: m.h },
                { x: t.position.x, y: t.position.y, w: tMeret.w, h: tMeret.h },
                m.p
            );
        });

        return falHiba || asztalHiba;
    };

    // FOGLALÁS LÉTREHOZÁSA 
    const handleCreateBooking = async (bookingData: any) => {
        try {
            await createBooking(bookingData).unwrap();
        } catch (err: any) {
            console.error("Nem sikerült elküldeni a foglalást:", err);
            const msg = err?.data?.error?.message || "Ismeretlen hiba történt.";
            alert(`Hiba a foglalás során: ${msg}`);
            throw err;
        }
    };

    const isOverlapping = (rect1: any, rect2: any, puffer: number = 0) => {
        const r1Pufferelt = {
            x: rect1.x - puffer,
            y: rect1.y - puffer,
            w: rect1.w + (2 * puffer),
            h: rect1.h + (2 * puffer)
        };

        return !(
            r1Pufferelt.x + r1Pufferelt.w <= rect2.x ||
            r1Pufferelt.x >= rect2.x + rect2.w ||
            r1Pufferelt.y + r1Pufferelt.h <= rect2.y ||
            r1Pufferelt.y >= rect2.y + rect2.h
        );
    };

    // KATTINTÁS KEZELÉSE (Szerepkörök szerint szabályozva!)
    const handleTableClick = (id: number) => {
        if (!user) {
            alert("Látogatóként az asztalok nem kattinthatók! Jelentkezz be a foglaláshoz.");
            return;
        }
        setSelectedTableId(id);
    };

    // ASZTAL LÉTREHOZÁSA (Csak admin) 
    const addTable = async (newTable: any) => {
        const tableData = {
            name: newTable.name || `Asztal-${serverTables.length + 1}`,
            type: newTable.type || 'foosball',
            category: newTable.category || 'normal',
            color: newTable.color || 'green',
            direction: 'horizontal',
            status: Number(newTable.status || 10),
            isLocked: newTable.isLocked ?? false,
            'is-locked': newTable.isLocked ?? false,
            // PONTOS JAVÍTÁS: A formból érkező valódi pozíciókat adjuk át a szervernek!
            position: {
                x: Number(newTable.position?.x ?? 100),
                y: Number(newTable.position?.y ?? 100)
            }
        };

        try {
            await addTableMutation(tableData).unwrap();
            setShowAddForm(false);
        } catch (err: any) {
            console.error("Nem sikerült létrehozni az asztalt:", err);
            const detailedError = err?.data ? JSON.stringify(err.data) : "Ismeretlen séma hiba";
            alert(`Hiba történt az asztal mentése során: ${detailedError}`);
        }
    };

    // ASZTAL MOZGATÁSA (Csak admin)
    const moveTable = async (id: number, x: number, y: number) => {
        if (user?.role !== 'ADMIN') return;

        // Nem engedjük ki a teremből (0 és roomSize közé szorítjuk a pixeleket)
        const biztonsagosX = Math.max(0, Math.min(x, roomSize.width - 120));
        const biztonsagosY = Math.max(0, Math.min(y, roomSize.height - 60));

        try {
            await updateTablePosition({
                id,
                x: biztonsagosX,
                y: biztonsagosY
            }).unwrap();
        } catch (err) {
            console.error("Nem sikerült elmenteni a pozíciót a szerverre", err);
        }
    };

    // STÁTUSZ VAGY SZÍN MÓDOSÍTÁSA (Csak admin)
    const updateStatus = async (id: number, payload: any) => {
        if (user?.role !== 'ADMIN') return;

        // Megkeressük az asztal aktuális, szerverről jött adatait
        const currentTable = serverTables.find((t: any) => t.id === id);
        if (!currentTable) return;

        // Ha sima számot kapott, akkor status objektummá alakítjuk
        const newDelta = typeof payload === 'number' ? { status: payload } : payload;

        const fullUpdatedBody = {
            name: currentTable.name,
            type: currentTable.type,
            category: currentTable.category || 'normal',
            color: currentTable.color || 'green',
            direction: currentTable.direction || 'horizontal',
            status: currentTable.status || 5,
            isLocked: currentTable.isLocked ?? false,
            position: currentTable.position,
            ...newDelta
        };

        try {
            await updateTable({
                id,
                ...fullUpdatedBody
            }).unwrap();
        } catch (err) {
            console.error("Nem sikerült módosítani az asztal adatait:", err);
        }
    };

    // ASZTAL TÖRLESE ÉLESBEN 
    const deleteTable = async (id: number) => {
        if (user?.role !== 'ADMIN') return;

        if (window.confirm("Biztosan törölni szeretnéd ezt az asztalt?")) {
            try {
                await deleteTableMutation(id).unwrap();
                setSelectedTableId(null); // Bezárjuk a panelt a törlés után
            } catch (err) {
                console.error("Nem sikerült törölni az asztalt:", err);
                alert("Hiba történt a törlés során.");
            }
        }
    };

    // Statisztikák
    const totalTables = serverTables.length;
    const avgStatus = totalTables > 0
        ? (serverTables.reduce((sum: number, t: any) => sum + (t.status || 0), 0) / totalTables).toFixed(1)
        : 0;

    const tablesToShow = serverTables.map((t: any) => ({
        ...t,
        hasPufferError: checkTablePlacement(t)
    }));

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '20px', fontFamily: 'sans-serif' }}>Asztalok betöltése a szerverről...</div>;
    }

    return (
        <div style={{ display: 'flex', gap: '24px', padding: '20px', fontFamily: 'sans-serif' }}>

            <div style={{ flex: 1 }}>
                <header style={{ marginBottom: '25px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 5px 0', color: 'white' }}>Terem elrendezés</h1>
                    <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
                        Asztalok száma: {totalTables} | Átlagos állapot: {avgStatus}
                    </div>
                </header>

                <Terem
                    tables={tablesToShow}
                    roomSize={roomSize}
                    onTableClick={handleTableClick}
                    selectedTableId={selectedTableId}
                    onTableMove={moveTable}
                    isAdmin={
                        user?.role === 'ADMIN' ||
                        user?.role === 'admin' ||
                        user?.isAdmin === true
                    }
                />
            </div>

            <aside style={{ width: '320px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', height: 'fit-content' }}>

                {/* Az új asztal gomb CSAK ADMINNAK jelenik meg */}
                {user?.role === 'ADMIN' && (
                    <>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginBottom: '15px',
                                backgroundColor: showAddForm ? '#e11d48' : '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}
                        >
                            {showAddForm ? '❌ Mégse' : '➕ Új asztal hozzáadása'}
                        </button>

                        {showAddForm && (
                            <UjAsztalHozzaadasa onAdd={addTable} />
                        )}
                        <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #e2e8f0' }} />
                    </>
                )}

                {/* Részletes nézet panel és Foglalási panel */}
                {user ? (
                    <ReszletesNezet
                        table={selectedTable}
                        onDelete={deleteTable}
                        onStatusChange={updateStatus}
                        isAdmin={user.role === 'ADMIN' || user.role === 'admin'}
                        onCreateBooking={handleCreateBooking} // <-- ÁTADVA AZ ÚJ FOGLALÁS LOGIKA
                    />
                ) : (
                    <div style={{ color: '#64748b', textAlign: 'center', fontSize: '14px', fontStyle: 'italic', padding: '10px 0' }}>
                        Jelentkezz be az asztalok részletes adatainak megtekintéséhez és a foglaláshoz!
                    </div>
                )}
            </aside>
        </div>
    );
}