import { useState } from "react";
import {
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  House,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const navigation = [
  {
    label: "Dashboard",
    to: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Ana Sayfa",
    to: "/admin/home",
    icon: House,
  },
  {
    label: "Hakkımda",
    to: "/admin/about",
    icon: UserRound,
  },
  {
    label: "Projeler",
    to: "/admin/projects",
    icon: FolderKanban,
  },
  {
    label: "Hizmetler",
    to: "/admin/services",
    icon: BriefcaseBusiness,
  },
  {
    label: "Mesajlar",
    to: "/admin/messages",
    icon: MessageSquare,
  },
  {
    label: "Medya",
    to: "/admin/media",
    icon: Images,
  },
  {
    label: "Site Ayarları",
    to: "/admin/settings",
    icon: Settings,
  },
  {
  label: "Sayfa Metinleri",
  to: "/admin/sayfa-metinleri",
  icon: FileText,
},
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside
        className={`admin-sidebar ${
          mobileMenuOpen ? "is-open" : ""
        }`}
      >
        <div className="admin-sidebar__brand">
          <span>YÇ</span>

          <div>
            <strong>Portfolio OS</strong>
            <small>Content system</small>
          </div>

          <button
            type="button"
            aria-label="Menüyü kapat"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <nav aria-label="Admin navigasyonu">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                to={item.to}
                end={item.end}
                key={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "is-active" : undefined
                }
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar__profile">
          <div>
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Oturumu kapat"
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-mobile-header">
          <button
            type="button"
            aria-label="Admin menüsünü aç"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={21} />
          </button>

          <strong>Portfolio OS</strong>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default AdminLayout;