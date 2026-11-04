import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './index.css';
import { StoreProvider } from './data/store';
import { Layout } from './components/Layout';
import { Home } from './pages/home/Home';
import { Cycle, Fuel, Mind, Train } from './pages/Modules';
import { Guide } from './pages/Guide';
import { Settings } from './pages/Settings';

function NotFound() {
  return (
    <div className="card text-center">
      <h1 className="font-display text-2xl font-semibold">Off route</h1>
      <p className="mt-1 text-charcoal-600">That page doesn’t exist.</p>
      <Link to="/" className="btn-primary mt-4">Back home</Link>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
  </StrictMode>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
