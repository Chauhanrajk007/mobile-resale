"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export default function Nav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Don't show nav on login or home or report pages
  if (pathname === "/" || pathname === "/login" || pathname.startsWith("/report/")) {
    return null;
  }

  const techLinks = [
    { href: "/technician", label: "Dashboard", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" },
    { href: "/", label: "Home", icon: "M3 10.5V21a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1V10.5M21 8.5l-9-6.5-9 6.5" },
  ];

  const customerLinks = [
    { href: "/account", label: "My Bookings", icon: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8" },
    { href: "/", label: "Home", icon: "M3 10.5V21a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1V10.5M21 8.5l-9-6.5-9 6.5" },
  ];

  const links =
    user?.role === "admin" ? [] :
    user?.role === "customer"
      ? customerLinks.filter((l) => !(l.href === "/account" && pathname === "/account"))
      : techLinks.filter((l) => !(l.href === "/technician" && pathname === "/technician"));

  const adminLinks = [
    { href: "/admin", label: "Overview", icon: "M4 6h16M4 12h16M4 18h16" }, // Just a basic layout for now
  ];

  return (
    <>
      <style>{`
        .cmp-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          z-index: 50;
          border-bottom: 1px solid var(--border);
        }
        .cmp-nav-links {
          display: flex;
          gap: 1rem;
        }
        .cmp-nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          color: var(--text2);
          text-decoration: none;
          font-weight: 500;
          border-radius: var(--radius);
          transition: color 0.2s;
        }
        .cmp-nav-link:hover {
          color: var(--text);
        }
        .cmp-nav-link[data-active="true"] {
          color: var(--primary);
        }
        @media (max-width: 767px) {
          .cmp-nav {
            top: auto;
            bottom: 0;
            border-bottom: none;
            border-top: 1px solid var(--border);
            padding: 0 1rem env(safe-area-inset-bottom);
            justify-content: space-around;
            background: var(--surface); /* Ensure solid for mobile */
          }
          .cmp-nav-brand, .cmp-nav-right {
            display: none;
          }
          .cmp-nav-links {
            width: 100%;
            justify-content: space-around;
            gap: 0;
          }
          .cmp-nav-link {
            flex-direction: column;
            gap: 0.25rem;
            padding: 0.5rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
      <nav className="cmp-nav glass">
        <Link href="/" className="cmp-nav-brand" style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)', textDecoration: 'none' }}>
          CMP
        </Link>

        {user && links.length > 0 && (
          <div className="cmp-nav-links">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && link.href !== "/technician" && link.href !== "/admin" && pathname.startsWith(link.href));
              return (
                <Link key={link.href} href={link.href} className="cmp-nav-link" data-active={isActive}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={link.icon.split(' M')[0]} />
                    {link.icon.split(' M')[1] && <path d={'M' + link.icon.split(' M')[1]} />}
                  </svg>
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: 'var(--primary)',
                        borderRadius: '2px 2px 0 0'
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        <div className="cmp-nav-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeToggle />
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 32, height: 32,
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button 
                onClick={() => logout()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text2)',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
