import { Dumbbell, Utensils, Scale, History, User, LogOut, X, Timer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { id: 'workout', label: 'İdman', icon: Dumbbell },
  { id: 'nutrition', label: 'Beslenme', icon: Utensils },
  { id: 'weight', label: 'Tartı', icon: Scale },
  { id: 'history', label: 'Geçmiş', icon: History }
];

export default function DrawerMenu({ isOpen, onClose, activeTab, onTabChange, onOpenProfile, onOpenTimer, profileName, onLogout }) {
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="drawer-overlay" onClick={handleClose}>
      <aside className="drawer-menu" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">
            <Dumbbell size={20} color="#3B82F6" /> LeaTracker
          </div>
          <button className="drawer-close" onClick={handleClose} aria-label="Kapat">
            <X size={20} />
          </button>
        </div>

        <div className="drawer-user">
          <div className="drawer-avatar">
            <User size={20} />
          </div>
          <div className="drawer-user-info">
            <span className="drawer-user-name">{profileName || 'Misafir'}</span>
            <span className="drawer-user-mail">
              {user && user.email}
            </span>
          </div>
        </div>

        <nav className="drawer-nav">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`drawer-item ${activeTab === id ? 'active' : ''}`}
              onClick={() => {
                onTabChange(id);
                handleClose();
              }}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>

        <div className="drawer-divider" />

        <button
          className="drawer-item"
          onClick={() => {
            onOpenTimer();
            handleClose();
          }}
        >
          <Timer size={18} /> Dinlenme Zamanlayıcı
        </button>

        <button
          className="drawer-item"
          onClick={() => {
            onOpenProfile();
            handleClose();
          }}
        >
          <User size={18} /> Profil ve Hedefler
        </button>

        <div className="drawer-spacer" />

        <button
          className="drawer-item drawer-logout"
          onClick={async () => {
            try {
              await onLogout();
            } finally {
              handleClose();
            }
          }}
        >
          <LogOut size={18} /> Çıkış Yap
        </button>
      </aside>
    </div>
  );
}