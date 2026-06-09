import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { EstateSovereign } from './pages/EstateSovereign';
import { FreedomMeridian } from './pages/FreedomMeridian';
import './styles/meridian-theme.css';
import './styles/estate-theme.css';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<FreedomMeridian />} />
          <Route path="estate-sovereign" element={<EstateSovereign />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
