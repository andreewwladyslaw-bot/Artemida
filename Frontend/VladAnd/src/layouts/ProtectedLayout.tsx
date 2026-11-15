import { NavLink, Outlet } from 'react-router';
import './protectedLayout.css';

export function ProtectedLayout() {
  return (
    <div className="protected-layout">
      <nav aria-label="Main navigation" className="app-nav">
        <strong>EduPlatform</strong>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
        <NavLink to="/chat">Chat</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>
      <div className="protected-content"><Outlet /></div>
    </div>
  );
}
