"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, User, Briefcase, BookOpen, Award, LogOut,
  ChevronRight, Users, Layers, Calendar, Star, Building2,
  PlusCircle, FileText, ShieldCheck, BarChart3, GraduationCap,
} from "lucide-react";

const NAV = {
  candidate: [
    { href: "/candidate/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/candidate/profile", icon: User, label: "My Profile" },
    { href: "/candidate/assessments", icon: BookOpen, label: "Assessments" },
    { href: "/candidate/scorecard", icon: Award, label: "Scorecard" },
    { href: "/candidate/jobs", icon: Briefcase, label: "Job Feed" },
    { href: "/candidate/applications", icon: FileText, label: "Applications" },
  ],
  hr: [
    { href: "/hr/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/hr/post-job", icon: PlusCircle, label: "Post a Job" },
    { href: "/hr/jobs", icon: Briefcase, label: "My Jobs" },
  ],
  mentor: [
    { href: "/mentor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/mentor/profile", icon: User, label: "Profile" },
    { href: "/mentor/sessions", icon: Calendar, label: "Sessions" },
  ],
  admin: [
    { href: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/verify", icon: ShieldCheck, label: "Verify" },
    { href: "/admin/domains", icon: Layers, label: "Domains" },
    { href: "/admin/assessments", icon: GraduationCap, label: "Assessments" },
  ],
};

const ROLE_COLOR = { candidate: "#f59e0b", hr: "#6366f1", mentor: "#a855f7", admin: "#ef4444" };

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const links = NAV[user?.role] || [];
  const rc = ROLE_COLOR[user?.role] || "#f59e0b";
  const initials = (user?.name || "?").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const ref = useRef(null);

  useEffect(() => {
    (async () => {
      if (!ref.current) return;
      const { gsap } = await import("gsap");
      gsap.fromTo(ref.current, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
      gsap.fromTo(".nav-link", { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out", delay: 0.2 });
    })();
  }, []);

  return (
    <aside ref={ref} className="fixed left-0 top-0 h-screen w-60 flex flex-col z-30"
      style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}>

      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-black text-sm transition-transform group-hover:scale-105" style={{ background: "var(--amber)", color: "#050507" }}>S1</div>
          <span className="font-display font-bold text-sm tracking-tight" style={{ color: "var(--text)" }}>
            Skill1 <span style={{ color: "var(--amber)" }}>Hire</span>
          </span>
        </Link>
      </div>

      {/* User */}
      <div className="px-4 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black font-display text-sm shrink-0"
            style={{ background: `${rc}18`, color: rc }}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{user?.name}</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mt-0.5"
              style={{ background: `${rc}14`, color: rc }}>
              {user?.role}
            </span>
          </div>
        </div>
        {user?.isVerified && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl"
            style={{ background: "rgba(245,158,11,0.07)", color: "var(--amber)" }}>
            <ShieldCheck size={11} /><span className="font-semibold">Verified Profile</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (pathname.startsWith(href) && href !== `/${user?.role}/dashboard`);
          return (
            <Link key={href} href={href}
              className="nav-link sidebar-link group"
              style={active ? {
                background: `${rc}12`,
                color: rc,
              } : {}}>
              <Icon size={15} style={{ color: active ? rc : "var(--text-3)" }} className="shrink-0 transition-colors" />
              <span>{label}</span>
              {active && <ChevronRight size={11} className="ml-auto" style={{ color: rc }} />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid var(--border)" }}>
        <button onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
          style={{ color: "var(--text-3)" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#fca5a5"; e.currentTarget.style.background = "var(--red-dim)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-3)"; e.currentTarget.style.background = "transparent"; }}>
          <LogOut size={15} /><span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
