import { useState } from 'react';
import { useRegisterMutation } from '../store/apiSlice';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [registerApi, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password.length < 6) {
      setErrorMessage('A jelszónak legalább 6 karakterből kell állnia!');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password: password
      };

      console.log("✈️ Regisztrációs adatok küldése:", payload);
      await registerApi(payload).unwrap();

      setSuccessMessage('🎉 Sikeres regisztráció! Mindjárt átirányítunk a bejelentkezéshez...');
      
      // 2 másodperc múlva átvisszük a login oldalra
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      console.error("❌ Regisztrációs hiba:", err);
      const hibaUzenet = err?.data?.message || err?.data?.error?.message || 'A regisztráció sikertelen. Lehet, hogy ez az e-mail már foglalt!';
      setErrorMessage(hibaUzenet);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-lg shadow-md" style={{ fontFamily: 'sans-serif' }}>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Regisztráció</h2>
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded border border-red-200">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 text-sm rounded border border-green-200">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teljes név</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Gipsz Jakab"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail cím</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="jakab@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jelszó (min. 6 karakter)</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:bg-gray-400"
        >
          {isLoading ? 'Feldolgozás...' : 'Fiók létrehozása'}
        </button>
      </form>
    </div>
  );
}