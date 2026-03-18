"use client";
import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";

export default function DashLayout({ children }) {
  const { loading } = useAuth();
  const mainRef = useRef(null);

  useEffect(() => {
    if (!loading && mainRef.current) {
      (async () => {
        const { gsap } = await import("gsap");
        gsap.fromTo(mainRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
      })();
    }
  }, [loading]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="flex flex-col items-center gap-5">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black text-base animate-pulse" style={{ background: "var(--amber)", color: "#050507" }}>S1</div>
        <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "var(--border-2)", borderTopColor: "var(--amber)" }} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar />
      <main ref={mainRef} className="ml-60 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
