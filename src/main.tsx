import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './index.css';
import { StoreProvider } from './data/store';
import { AuthProvider, useAuth } from './data/auth';
import { AuthPage } from './pages/AuthPage';
import { Layout } from './components/Layout';
import { Home } from './pages/home/Home';
import { Cycle, Fuel, Mind, Train } from './pages/Modules';
import { Guide } from './pages/Guide';
import { Settings } from './pages/Settings';

function NotFound() {
  return (
    <div className="card text-center">
      <h1 className="font-display text-2xl font-semibold">Off route</h1>
      <p className="mt-1 text-ink-600">That page doesn’t exist.</p>
      <Link to="/" className="btn-primary mt-4">Back home</Link>
    </div>
  );
}

/** Show the sign-in screen until someone signs in or chooses guest mode. */
function Gate() {
  const { loading, session, guest } = useAuth();
  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <p className="font-poster text-4xl tracking-wide text-ink-900">CRUX</p>
      </div>
    );
  }
  if (!session && !guest) return <AuthPage />;
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="train" element={<Train />} />
            <Route path="fuel" element={<Fuel />} />
            <Route path="cycle" element={<Cycle />} />
            <Route path="mind" element={<Mind />} />
            <Route path="guide" element={<Guide />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Gate />
    </AuthProvider>
  </StrictMode>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
