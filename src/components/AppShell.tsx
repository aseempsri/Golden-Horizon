import { NavLink, Outlet, useLocation } from 'react-router-dom';
import '../styles/shared.css';

export function AppShell() {
  const { pathname } = useLocation();
  const themeClass = pathname.includes('estate-sovereign')
    ? 'gh-app--estate'
    : 'gh-app--meridian';

  return (
    <div className={`gh-app ${themeClass}`}>
      <nav className="gh-nav">
        <div className="gh-nav-inner">
          <NavLink to="/" className="gh-brand">
            <img
              src={`${import.meta.env.BASE_URL}golden-horizon-main-logo.png`}
              alt="Golden Horizon — Premium retirement planning"
              className="gh-brand-logo gh-brand-logo--main"
            />
          </NavLink>
          <div className="gh-nav-tabs">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `gh-nav-tab${isActive ? ' active' : ''}`}
            >
              Freedom Meridian
            </NavLink>
            <NavLink
              to="/estate-sovereign"
              className={({ isActive }) => `gh-nav-tab${isActive ? ' active' : ''}`}
            >
              Estate Sovereign
            </NavLink>
            <NavLink
              to="/guide"
              className={({ isActive }) => `gh-nav-tab${isActive ? ' active' : ''}`}
            >
              Guide
            </NavLink>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
