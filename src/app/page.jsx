"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, ShieldCheck, Zap, Users, Star, Briefcase,
  CheckCircle, ChevronDown, Code, BookOpen, Award,
  TrendingUp, ArrowUpRight, Sparkles, Target, Globe,
  Play, Building2, MapPin, Clock
} from "lucide-react";

// ── UNSPLASH images (free, no API) ───────────────
const IMG = {
  hero: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=85&auto=format&fit=crop",
  team1: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80&auto=format&fit=crop&crop=face",
  team2: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop&crop=face",
  team3: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=face",
  team4: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&auto=format&fit=crop&crop=face",
  office: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop",
  code: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80&auto=format&fit=crop",
  meeting: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80&auto=format&fit=crop",
};

// ── CountUp hook ─────────────────────────────────
function useCountUp(to, duration = 1800) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const t0 = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - t0) / duration, 1);
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);
  return [val, ref];
}

function Num({ to, suffix = "" }) {
  const [v, r] = useCountUp(to);
  return <span ref={r}>{v}{suffix}</span>;
}

export default function Home() {
  const cursorDot = useRef(null);
  const cursorRing = useRef(null);

  useEffect(() => {
    let lenis;
    (async () => {
      const { default: Lenis } = await import("lenis");
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // Lenis
      lenis = new Lenis({ duration: 1.5, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);

      // Cursor
      const dot = cursorDot.current;
      const ring = cursorRing.current;
      let mx = 0, my = 0, rx = 0, ry = 0;
      if (dot && ring) {
        window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; gsap.set(dot, { x: mx, y: my }); });
        const loop = () => { rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1; gsap.set(ring, { x: rx, y: ry }); requestAnimationFrame(loop); };
        loop();
        document.querySelectorAll("a,button,[data-cursor]").forEach(el => {
          el.addEventListener("mouseenter", () => gsap.to(ring, { width: 52, height: 52, borderColor: "rgba(245,158,11,0.8)", duration: 0.25 }));
          el.addEventListener("mouseleave", () => gsap.to(ring, { width: 32, height: 32, borderColor: "rgba(245,158,11,0.35)", duration: 0.25 }));
        });
      }

      // Hero animations
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".h-badge", { y: 24, opacity: 0, duration: 0.7 })
        .from(".h-line", { y: "110%", duration: 0.9, stagger: 0.07 }, "-=0.3")
        .from(".h-sub", { y: 20, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(".h-cta", { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.5")
        .from(".h-img", { scale: 0.92, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8")
        .from(".h-float-card", { y: 30, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.6");

      // Scroll-triggered reveals
      gsap.utils.toArray(".reveal").forEach(el => {
        gsap.fromTo(el, { y: 48, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" }
        });
      });
      gsap.utils.toArray(".reveal-stagger").forEach(el => {
        gsap.fromTo(el.children, { y: 36, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 84%", toggleActions: "play none none none" }
        });
      });

      // Parallax hero image
      gsap.to(".h-img", {
        yPercent: -15,
        scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: 1.5 }
      });

      // Horizontal marquee
      gsap.to(".marquee-track", { x: "-50%", duration: 22, ease: "none", repeat: -1 });

      // Section bg gradients
      gsap.utils.toArray(".orb-scroll").forEach((orb, i) => {
        gsap.to(orb, {
          yPercent: i % 2 === 0 ? -40 : 40, xPercent: i % 2 === 0 ? 10 : -10,
          scrollTrigger: { trigger: orb.parentElement, start: "top bottom", end: "bottom top", scrub: 2 }
        });
      });
    })();
    return () => { if (lenis) lenis.destroy(); };
  }, []);

  const features = [
    { icon: BookOpen, title: "Skill Assessments", desc: "Domain MCQ tests auto-scored in real-time. No cheating. Real knowledge.", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
    { icon: Code, title: "Capstone Projects", desc: "Candidates ship a live project — portfolio proof that speaks louder than any resume.", color: "#a5b4fc", bg: "rgba(99,102,241,0.08)" },
    { icon: ShieldCheck, title: "Blue Tick Verified", desc: "Only candidates who pass the full gauntlet get verified. Zero compromise.", color: "#34d399", bg: "rgba(16,185,129,0.08)" },
    { icon: Users, title: "Mentor Network", desc: "1:1 sessions with senior engineers. Rated, reviewed, and accountable.", color: "#f472b6", bg: "rgba(244,114,182,0.08)" },
    { icon: Zap, title: "Smart Job Feed", desc: "Verified candidates unlock curated jobs. Only roles you're actually matched for.", color: "#22d3ee", bg: "rgba(34,211,238,0.08)" },
    { icon: TrendingUp, title: "Live Scorecard", desc: "Track your assessment score, profile rank, and percentile in real-time.", color: "#fb923c", bg: "rgba(249,115,22,0.08)" },
  ];

  const steps = [
    { n: "01", title: "Take Assessments", desc: "Curated MCQ tests for your domain. Auto-graded. Instant feedback.", icon: BookOpen },
    { n: "02", title: "Ship Capstone", desc: "Build and submit a real project. Admin reviews every submission.", icon: Target },
    { n: "03", title: "Get Verified", desc: "Earn the blue tick. Your job feed unlocks with matched listings.", icon: ShieldCheck },
    { n: "04", title: "Get Hired", desc: "HRs see only verified talent. Faster decisions, zero noise.", icon: Sparkles },
  ];

  const testimonials = [
    { img: IMG.team1, name: "Rahul Mehta", role: "SDE-2 @ Razorpay", quote: "Skill1 Hire's capstone process pushed me to build something actually deployable. That project got me hired.", stars: 5 },
    { img: IMG.team2, name: "Priya Nair", role: "Product @ Groww", quote: "As an HR, I cut 80% of my screening time. Every profile from this platform is already validated.", stars: 5 },
    { img: IMG.team3, name: "Arjun Singh", role: "Full Stack @ CRED", quote: "The scorecard gave me a real metric to improve on. I went from 62% to 91% in 3 weeks.", stars: 5 },
    { img: IMG.team4, name: "Sneha Patel", role: "Mentor & SRE @ Stripe", quote: "I mentor here because the candidates are serious. They've already done the work.", stars: 5 },
  ];

  const logos = ["Razorpay", "Groww", "CRED", "Meesho", "Zepto", "Slice", "Jar", "Smallcase", "Freo", "PhonePe", "Razorpay", "Groww", "CRED", "Meesho", "Zepto", "Slice", "Jar", "Smallcase", "Freo", "PhonePe"];

  const jobs = [
    { title: "Senior React Developer", co: "Razorpay", mode: "Remote", lpa: "₹18–28L", domain: "Frontend" },
    { title: "Backend Engineer", co: "Groww", mode: "Hybrid", lpa: "₹24–36L", domain: "Backend" },
    { title: "Full Stack SDE-2", co: "CRED", mode: "Onsite", lpa: "₹20–32L", domain: "Full Stack" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: "var(--text)", background: "var(--bg)" }}>

      {/* Cursor */}
      <div ref={cursorDot} className="c-cursor hidden lg:block"><div className="c-cursor-dot" /></div>
      <div ref={cursorRing} className="c-cursor-ring hidden lg:block" />

      {/* ─── Navbar ──────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 lg:px-10 py-4 card-glass" style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black font-display" style={{ background: "var(--amber)", color: "#050507" }}>S1</div>
          <span className="font-display font-bold tracking-tight" style={{ color: "var(--text)" }}>Skill1 <span style={{ color: "var(--amber)" }}>Hire</span></span>
        </Link>
        <div className="hidden lg:flex items-center gap-1">
          {["Features", "How It Works", "For HRs", "Mentors"].map(l => <button key={l} className="btn-ghost text-xs">{l}</button>)}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost text-sm">Sign in</Link>
          <Link href="/register" className="btn-primary btn-sm">Get Started <ArrowRight size={13} /></Link>
        </div>
      </nav>

      {/* ─── Hero ─────────────────────────────────── */}
      <section className="hero-section relative min-h-screen flex flex-col justify-center pt-24 pb-20 px-6 lg:px-10 overflow-hidden grid-bg">
        {/* Orbs */}
        <div className="orb-scroll absolute w-[700px] h-[700px] rounded-full blur-[120px] pointer-events-none -top-40 -left-40 opacity-[0.12]" style={{ background: "radial-gradient(circle, #f59e0b 0%, #f97316 60%, transparent 100%)" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] pointer-events-none bottom-0 right-[10%] opacity-[0.07]" style={{ background: "radial-gradient(circle, var(--indigo) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="h-badge inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 badge-amber">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--amber)" }} />
              India's #1 verified hiring platform
            </div>

            <div className="overflow-hidden mb-6">
              <h1 className="font-display font-black leading-[1.05] tracking-tight" style={{ fontSize: "clamp(3.2rem, 7vw, 6rem)" }}>
                {["Hire talent", "that already", "proved it."].map((line, i) => (
                  <div key={i} className="overflow-hidden">
                    <span className={`h-line block ${i === 2 ? "text-gradient" : ""}`}>{line}</span>
                  </div>
                ))}
              </h1>
            </div>

            <p className="h-sub text-lg mb-10 max-w-lg leading-relaxed" style={{ color: "var(--text-2)" }}>
              Every candidate is assessed, scored, and verified before they can apply.
              <strong style={{ color: "var(--text)" }}> No resume spam. Only proof.</strong>
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/register?role=candidate" className="h-cta btn-primary btn-lg">I'm a Candidate <ArrowRight size={16} /></Link>
              <Link href="/register?role=hr" className="h-cta btn-secondary btn-lg">I'm Hiring</Link>
              <Link href="/jobs" className="h-cta btn-ghost text-sm">
                <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <Play size={11} className="fill-current ml-0.5" />
                </span>
                Browse Jobs
              </Link>
            </div>

            {/* Social proof */}
            <div className="h-cta flex items-center gap-4">
              <div className="flex -space-x-2">
                {[IMG.team1, IMG.team2, IMG.team3, IMG.team4].map((src, i) => (
                  <img key={i} src={src} alt="" className="w-9 h-9 rounded-full border-2 object-cover" style={{ borderColor: "var(--bg)" }} />
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs" style={{ color: "var(--text-2)" }}>Loved by <strong style={{ color: "var(--text)" }}>2,400+</strong> professionals</p>
              </div>
            </div>
          </div>

          {/* Right — Hero image + floating cards */}
          <div className="relative hidden lg:block">
            <div className="h-img relative rounded-3xl overflow-hidden" style={{ height: "560px" }}>
              <Image src={IMG.hero} alt="Team at work" fill className="object-cover" style={{ filter: "brightness(0.6) saturate(0.9)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, transparent 60%, rgba(99,102,241,0.08) 100%)" }} />
              {/* Overlay stat */}
              <div className="absolute bottom-6 left-6 right-6 card-glass p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs mb-1" style={{ color: "var(--text-2)" }}>Average Hire Time</p>
                    <p className="font-black text-2xl font-display" style={{ color: "var(--amber)" }}>4.2 days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs mb-1" style={{ color: "var(--text-2)" }}>vs industry avg</p>
                    <p className="font-bold text-sm" style={{ color: "#34d399" }}>↓ 72% faster</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="h-float-card absolute -left-8 top-8 card p-4 w-56 glow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--green-dim)" }}>
                  <ShieldCheck size={14} style={{ color: "#34d399" }} />
                </div>
                <p className="text-xs font-bold">Candidate Verified</p>
              </div>
              <div className="flex items-center gap-2">
                <img src={IMG.team3} alt="" className="w-7 h-7 rounded-xl object-cover" />
                <div>
                  <p className="text-xs font-semibold">Arjun Singh</p>
                  <p className="text-[10px]" style={{ color: "var(--amber)" }}>Score: 91%</p>
                </div>
              </div>
            </div>

            <div className="h-float-card absolute -right-4 top-1/3 card p-4 w-52">
              <p className="text-xs mb-2" style={{ color: "var(--text-2)" }}>New offer 🎉</p>
              <p className="font-bold text-sm mb-1">Senior Developer</p>
              <p className="text-xs" style={{ color: "var(--amber)" }}>Razorpay · ₹28 LPA</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <ChevronDown size={18} className="animate-bounce" style={{ color: "var(--text-3)" }} />
        </div>
      </section>

      {/* ─── Marquee ──────────────────────────────── */}
      <div className="py-5 overflow-hidden" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="marquee-track flex gap-12 whitespace-nowrap" style={{ width: "max-content" }}>
          {logos.map((c, i) => (
            <span key={i} className="text-xs font-black uppercase tracking-[0.25em]" style={{ color: "var(--text-3)" }}>{c}</span>
          ))}
        </div>
        <p className="text-center text-[11px] mt-2.5 tracking-wider uppercase" style={{ color: "var(--text-3)" }}>Companies hiring verified talent</p>
      </div>

      {/* ─── Stats ─────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: 2400, s: "+", l: "Verified Candidates" },
              { n: 98, s: "%", l: "Hire Success Rate" },
              { n: 3, s: "x", l: "Faster Than Industry" },
              { n: 0, s: " spam", l: "Resume Noise" },
            ].map(({ n, s, l }) => (
              <div key={l}>
                <p className="font-black font-display mb-2" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--amber)", textShadow: "0 0 40px rgba(245,158,11,0.4)" }}>
                  <Num to={n} suffix={s} />
                </p>
                <p className="text-sm" style={{ color: "var(--text-2)" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it Works ──────────────────────────── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="orb-scroll absolute w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none -bottom-20 -right-20 opacity-[0.07]" style={{ background: "var(--amber)" }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="reveal text-center mb-20">
            <p className="eyebrow mb-4">The Process</p>
            <h2 className="font-display font-black leading-tight mb-4" style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
              4 steps from zero<br />to <span className="text-gradient">hired.</span>
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-2)" }}>
              We designed every step to prove real ability — not interview theater.
            </p>
          </div>

          <div className="reveal-stagger grid md:grid-cols-2 gap-5">
            {steps.map(({ n, title, desc, icon: Icon }) => (
              <div key={n} className="card-hover p-8 group relative overflow-hidden">
                <div className="absolute top-0 right-0 font-black font-display opacity-[0.04] leading-none" style={{ fontSize: "7rem", color: "var(--amber)" }}>{n}</div>
                <div className="relative">
                  <p className="eyebrow mb-4">{n}</p>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110" style={{ background: "var(--amber-dim)" }}>
                    <Icon size={22} style={{ color: "var(--amber)" }} />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────── */}
      <section className="py-28 px-6" style={{ background: "var(--surface)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="reveal text-center mb-20">
            <p className="eyebrow mb-4">Features</p>
            <h2 className="font-display font-black leading-tight mb-4" style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
              Built for serious<br /><span className="text-gradient">hiring teams.</span>
            </h2>
          </div>
          <div className="reveal-stagger grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="card-hover p-6 group">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ background: bg }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="font-display font-bold mb-2 text-base">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Platform Showcase ──────────────────────── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="orb-scroll absolute w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none top-1/4 -left-40 opacity-[0.06]" style={{ background: "var(--indigo)" }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="reveal text-center mb-20">
            <p className="eyebrow mb-4">Platform Preview</p>
            <h2 className="font-display font-black leading-tight" style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
              See it in <span className="text-gradient">action.</span>
            </h2>
          </div>

          {/* 3-column showcase grid */}
          <div className="reveal-stagger grid lg:grid-cols-3 gap-5">
            {/* Scorecard */}
            <div className="card p-6 lg:col-span-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10" style={{ background: "var(--amber)", transform: "translate(30%,-30%)" }} />
              <div className="badge-amber mb-4">👤 Candidate Dashboard</div>
              <h3 className="font-display font-bold text-lg mb-5">Your Verified Scorecard</h3>
              <div className="space-y-4">
                {[
                  { name: "React.js & Ecosystem", score: 92, color: "#f59e0b" },
                  { name: "Node.js & APIs", score: 87, color: "#a5b4fc" },
                  { name: "System Design", score: 78, color: "#34d399" },
                  { name: "Data Structures", score: 81, color: "#f472b6" },
                ].map(item => (
                  <div key={item.name}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: "var(--text-2)" }}>{item.name}</span>
                      <span className="font-bold" style={{ color: item.color }}>{item.score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${item.score}%`, background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
                <span className="text-sm" style={{ color: "var(--text-2)" }}>Overall HireScore™</span>
                <span className="font-black text-3xl font-display" style={{ color: "var(--amber)", textShadow: "0 0 24px rgba(245,158,11,0.4)" }}>85%</span>
              </div>
            </div>

            {/* HR View */}
            <div className="card p-6">
              <div className="badge-dim mb-4">🏢 HR Dashboard</div>
              <h3 className="font-display font-bold text-base mb-4">Top Applicants</h3>
              <div className="space-y-3">
                {[
                  { name: "Arjun S.", score: 91, img: IMG.team3 },
                  { name: "Priya N.", score: 87, img: IMG.team2 },
                  { name: "Rahul M.", score: 84, img: IMG.team1 },
                ].map(a => (
                  <div key={a.name} className="flex items-center justify-between p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="flex items-center gap-2.5">
                      <img src={a.img} alt="" className="w-8 h-8 rounded-xl object-cover" />
                      <span className="text-sm font-medium">{a.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold" style={{ color: "var(--amber)" }}>{a.score}%</span>
                      <ShieldCheck size={13} style={{ color: "var(--amber)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Feed */}
            <div className="card p-6 lg:col-span-2">
              <div className="badge-green mb-4">💼 Verified Job Feed</div>
              <div className="space-y-3">
                {jobs.map(job => (
                  <div key={job.title} className="flex items-center justify-between p-4 rounded-2xl group cursor-pointer transition-all" style={{ background: "rgba(255,255,255,0.03)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(245,158,11,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}>
                    <div>
                      <p className="font-semibold text-sm mb-1">{job.title}</p>
                      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-2)" }}>
                        <Building2 size={11} />{job.co}
                        <span className="badge-dim badge !py-0">{job.mode}</span>
                        <span className="badge-indigo badge !py-0">{job.domain}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm" style={{ color: "var(--amber)" }}>{job.lpa}</span>
                      <ArrowUpRight size={14} className="group-hover:text-amber-400 transition-colors" style={{ color: "var(--text-3)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentor card */}
            <div className="card p-6">
              <div className="badge-purple mb-4">🎓 Mentor Session</div>
              <div className="flex items-center gap-3 mb-4">
                <img src={IMG.team4} alt="" className="w-12 h-12 rounded-2xl object-cover" />
                <div>
                  <p className="font-bold text-sm">Sneha Patel</p>
                  <p className="text-xs" style={{ color: "var(--text-2)" }}>SRE @ Stripe · 6 yrs</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {["System Design", "DSA", "K8s"].map(t => <span key={t} className="badge badge-indigo">{t}</span>)}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}</div>
                <span className="font-bold text-sm" style={{ color: "var(--amber)" }}>₹900/60min</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Image Feature Section ─────────────────── */}
      <section className="py-28 px-6" style={{ background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="reveal grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-3xl overflow-hidden" style={{ height: "480px" }}>
              <Image src={IMG.office} alt="Modern office" fill className="object-cover" style={{ filter: "brightness(0.55) saturate(0.8)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(12,12,16,0.95) 100%)" }} />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>Active Hiring Rounds</span>
                    <span className="badge-green badge">Live</span>
                  </div>
                  <p className="font-black text-2xl font-display" style={{ color: "var(--text)" }}>24 <span className="text-base font-normal" style={{ color: "var(--text-2)" }}>open roles</span></p>
                </div>
              </div>
            </div>
            <div>
              <p className="eyebrow mb-5">For HRs & Companies</p>
              <h2 className="font-display font-black mb-6 leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
                Stop reviewing<br /><span className="text-gradient">200 bad resumes.</span>
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-2)" }}>
                Every candidate on Skill1 Hire has already passed your first 3 rounds of screening. Real assessment scores, verified projects, and live portfolio.
              </p>
              <div className="space-y-4 mb-8">
                {["See verified skill scores, not just keywords", "Real capstone projects — not just bullet points", "Faster decisions, better quality hires", "No subscription. Post and hire."].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--green-dim)" }}>
                      <CheckCircle size={12} style={{ color: "#34d399" }} />
                    </div>
                    <span className="text-sm" style={{ color: "var(--text-2)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/register?role=hr" className="btn-primary">Start Hiring <ArrowRight size={15} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ──────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="reveal text-center mb-16">
            <p className="eyebrow mb-4">Testimonials</p>
            <h2 className="font-display font-black leading-tight" style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
              Real people.<br /><span className="text-gradient">Real results.</span>
            </h2>
          </div>
          <div className="reveal-stagger grid md:grid-cols-2 gap-5">
            {testimonials.map(({ img, name, role, quote, stars }) => (
              <div key={name} className="card-hover p-7">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(stars)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-2)" }}>"{quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={img} alt={name} className="w-11 h-11 rounded-2xl object-cover" />
                  <div>
                    <p className="font-bold text-sm">{name}</p>
                    <p className="text-xs" style={{ color: "var(--text-2)" }}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="reveal relative overflow-hidden rounded-3xl p-14 text-center" style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)" }}>
            <div className="absolute w-80 h-80 rounded-full blur-3xl pointer-events-none -top-20 -left-20 opacity-20" style={{ background: "radial-gradient(circle, var(--amber) 0%, transparent 70%)" }} />
            <div className="absolute w-60 h-60 rounded-full blur-3xl pointer-events-none -bottom-10 -right-10 opacity-10" style={{ background: "radial-gradient(circle, var(--indigo) 0%, transparent 70%)" }} />
            <div className="relative z-10">
              <p className="eyebrow mb-5">Get Started</p>
              <h2 className="font-display font-black leading-tight mb-4" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                Your next hire is<br /><span className="text-gradient">already verified.</span>
              </h2>
              <p className="text-base mb-10 max-w-xl mx-auto" style={{ color: "var(--text-2)" }}>
                Join 2,400+ professionals. Free to join. No credit card. Start today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register?role=candidate" className="btn-primary btn-xl">I'm a Candidate <ArrowRight size={17} /></Link>
                <Link href="/register?role=hr" className="btn-secondary btn-xl">Post a Job</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────── */}
      <footer className="px-6 lg:px-10 py-12" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-black text-sm" style={{ background: "var(--amber)", color: "#050507" }}>S1</div>
            <span className="font-display font-bold" style={{ color: "var(--text)" }}>Skill1 <span style={{ color: "var(--amber)" }}>Hire</span></span>
          </Link>
          <div className="flex items-center gap-8">
            {["/jobs", "/register?role=candidate", "/register?role=hr", "/register?role=mentor"].map((href, i) => (
              <Link key={href} href={href} className="text-xs font-medium transition-colors" style={{ color: "var(--text-3)" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--amber)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}>
                {["Browse Jobs", "For Candidates", "For HRs", "Become Mentor"][i]}
              </Link>
            ))}
          </div>
          <p className="text-xs" style={{ color: "var(--text-3)" }}>© 2025 Skill1 Hire. Built for quality.</p>
        </div>
      </footer>
    </div>
  );
}
