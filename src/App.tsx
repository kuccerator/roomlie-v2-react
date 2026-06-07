import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import RoomPage from './pages/RoomPage';
import LoginPage from './pages/LoginPage';
import FoglalasaimPage from './pages/FoglalasaimPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import RegisterPage from './pages/RegisterPage'; // Vagy ahova mentetted

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* A navigációs sáv minden oldalon látható marad */}
        <Navbar />
        
        {/* Az oldalak váltakozó helye */}
        <main className="container mx-auto px-4 py-6">
          <Routes>
            {/* Terem oldal */}
            <Route path="/" element={<RoomPage />} />

            <Route path="/register" element={<RegisterPage />} />
            
            {/* Bejelentkezés oldal */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Regisztráció oldal */}
            <Route path="/register" element={
              <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md border border-gray-200 mt-10 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">🔐 Regisztráció</h3>
                <p className="text-sm text-gray-500 italic">Ez a funkció a védés idejére le van tiltva. Használd a fenti Role Váltót!</p>
              </div>
            } />
            
            {/* VALÓDI Felhasználói foglalások (Összekötve a gombbal!) */}
            <Route path="/my-bookings" element={<FoglalasaimPage />} />
            
            {/* VALÓDI Admin funkciók (Összekötve a gombbal!) */}
            <Route path="/admin-bookings" element={<AdminBookingsPage />} />
            
            {/* Bármi más esetén fallback a főoldalra */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}