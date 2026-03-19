"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, ShieldCheck, Zap, Users, Star, Briefcase,
  CheckCircle, ChevronDown, Code, BookOpen, Award,
  TrendingUp, ArrowUpRight, Sparkles, Target,
  Play, Building2, MapPin, Quote
} from "lucide-react";

const IMG = {
  hero: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=85&auto=format&fit=crop",
  team1: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80&auto=format&fit=crop&crop=face",
  team2: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop&crop=face",
  team3: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=face",
  team4: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&auto=format&fit=crop&crop=face",
  office: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop",
  work1: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80&auto=format&fit=crop",
  work2: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&auto=format&fit=crop",
};

export default function Home() {
  const cursorDot = useRef(null);
  const cursorRing = useRef(null);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    let lenis;
    (async () => {
      const { default: Lenis } = await import("lenis");
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({ duration: 1.4, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);

      // Cursor
      const dot = cursorDot.current;
      const ring = cursorRing.current;
      let mx = 0, my = 0, rx = 0, ry = 0;
      if (dot && ring) {
        window.addEventListener("mousemove", e => {
          mx = e.clientX; my = e.clientY;
          gsap.set(dot, { x: mx, y: my });
        });
        const loop = () => {
          rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
          gsap.set(ring, { x: rx, y: ry });
          requestAnimationFrame(loop);
        };
        loop();
        document.querySelectorAll("a,button").forEach(el => {
          el.addEventListener("mouseenter", () => gsap.to(ring, { width: 48, height: 48, borderColor: "rgba(245,158,11,0.7)", duration: 0.2 }));
          el.addEventListener("mouseleave", () => gsap.to(ring, { width: 30, height: 30, borderColor: "rgba(245,158,11,0.3)", duration: 0.2 }));
        });
      }

      // Hero entrance
      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.1 });
      tl.from(".h-eyebrow", { y: 20, opacity: 0, duration: 0.6 })
        .from(".h-line", { y: "105%", duration: 0.85, stagger: 0.06 }, "-=0.3")
        .from(".h-sub", { y: 16, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(".h-ctas > *", { y: 14, opacity: 0, duration: 0.5, stagger: 0.07 }, "-=0.3")
        .from(".h-proof", { y: 12, opacity: 0, duration: 0.5 }, "-=0.3")
        .from(".h-img-wrap", { x: 30, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8")
        .from(".h-card-1", { y: 20, opacity: 0, duration: 0.6 }, "-=0.5")
        .from(".h-card-2", { y: -20, opacity: 0, duration: 0.6 }, "-=0.4");

      // Scroll reveals
      gsap.utils.toArray(".reveal").forEach(el => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 87%", toggleActions: "play none none none" } }
        );
      });
      gsap.utils.toArray(".reveal-stagger").forEach(el => {
        gsap.fromTo(el.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.09, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 83%", toggleActions: "play none none none" } }
        );
      });

      // Marquee
      gsap.to(".marquee-track", { x: "-50%", duration: 20, ease: "none", repeat: -1 });

      // Parallax
      gsap.to(".h-img-wrap", {
        yPercent: -12,
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1.5 }
      });

    })();
    return () => { if (lenis) lenis.destroy(); };
  }, []);

  const features = [
    { icon: BookOpen, title: "Skill Assessments", desc: "Domain MCQ tests. Auto-scored instantly. No room for faking knowledge.", accent: "#f59e0b" },
    { icon: Code, title: "Capstone Projects", desc: "Ship something real. A live project beats a thousand resume bullet points.", accent: "#818cf8" },
    { icon: ShieldCheck, title: "Verified Badge", desc: "Blue tick earned, not given. Pass everything to unlock your hiring profile.", accent: "#34d399" },
    { icon: Users, title: "Mentor Network", desc: "1:1 with senior engineers. Rated after every session. Accountable always.", accent: "#fb7185" },
    { icon: Zap, title: "Smart Job Feed", desc: "Unlocks only when you're verified. Jobs matched to your actual skill scores.", accent: "#38bdf8" },
    { icon: TrendingUp, title: "Live Scorecard", desc: "See your rank, percentile, and skill breakdown update in real-time.", accent: "#fb923c" },
  ];

  const process = [
    { n: "01", icon: BookOpen, title: "Take Assessments", desc: "Curated domain tests. Instant scoring. No second chances on the first attempt." },
    { n: "02", icon: Target, title: "Ship a Capstone", desc: "Build and submit a real, live project. Our admin team reviews every single one." },
    { n: "03", icon: ShieldCheck, title: "Get Verified", desc: "Pass both? You earn the blue tick. Your job feed unlocks immediately." },
    { n: "04", icon: Sparkles, title: "Get Hired", desc: "HRs browse only verified profiles. No spam. Clean pipeline. Fast decisions." },
  ];

  const testimonials = [
    { img: IMG.team1, name: "Rahul Mehta", role: "SDE-2 @ Razorpay", quote: "The capstone forced me to build something actually deployable. That single project is what got me hired — not my resume." },
    { img: IMG.team2, name: "Priya Nair", role: "HR Lead @ Groww", quote: "We reduced screening time by 80%. Every candidate from this platform comes pre-validated. It's a completely different quality of pipeline." },
    { img: IMG.team3, name: "Arjun Singh", role: "Full Stack @ CRED", quote: "The scorecard is addictive. I went from 62% to 91% in three weeks just seeing that number every day." },
    { img: IMG.team4, name: "Sneha Patel", role: "SRE Mentor @ Stripe", quote: "I mentor here because the candidates have already done the work. They ask better questions than anyone I've coached before." },
  ];

  const logos = ["Razorpay","Groww","CRED","Meesho","Zepto","Slice","PhonePe","Jar","Smallcase","Freo",
                  "Razorpay","Groww","CRED","Meesho","Zepto","Slice","PhonePe","Jar","Smallcase","Freo"];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: "var(--text)", background: "var(--bg)" }}>

      {/* Custom cursor */}
      <div ref={cursorDot} className="c-cursor hidden lg:block"><div className="c-cursor-dot" /></div>
      <div ref={cursorRing} className="c-cursor-ring hidden lg:block" />

      {/* ── Navbar ─────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 px-6 lg:px-12 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,7,0.75)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>

        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-black text-sm transition-transform group-hover:scale-105"
            style={{ background: "var(--amber)", color: "#050507" }}>S1</div>
          <span className="font-display font-bold tracking-tight text-[15px]" style={{ color: "var(--text)" }}>
            Skill1 <span style={{ color: "var(--amber)" }}>Hire</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {[
            { label: "Features", id: "features" },
            { label: "How It Works", id: "process" },
            { label: "For HRs", id: "for-hrs" },
            { label: "Mentors", id: "mentors" },
          ].map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="px-4 py-2 text-xs font-medium rounded-lg transition-all duration-150"
              style={{ color: "var(--text-2)" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-2)"}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login"
            className="px-4 py-2 text-sm font-medium rounded-xl transition-all"
            style={{ color: "var(--text-2)" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-2)"}>
            Sign in
          </Link>
          <Link href="/register"
            className="btn-primary btn-sm">
            Get Started <ArrowRight size={13} />
          </Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────── */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20 pb-16 px-6 lg:px-12 overflow-hidden grid-bg">
        {/* Ambient orb */}
        <div className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", filter: "blur(80px)" }} />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-[1fr_1.1fr] gap-12 xl:gap-20 items-center">

          {/* LEFT */}
          <div>
            {/* Eyebrow */}
            <div className="h-eyebrow inline-flex items-center gap-2.5 mb-7 px-3.5 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "var(--amber)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--amber)" }} />
              India's first verified hiring platform
            </div>

            {/* Headline */}
            <h1 className="font-display font-black leading-[1.04] tracking-[-0.02em] mb-6"
              style={{ fontSize: "clamp(3rem, 6.5vw, 5.5rem)" }}>
              {["Hire talent", "that already", "proved it."].map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <span className={`h-line block ${i === 2 ? "text-gradient" : ""}`}>{line}</span>
                </div>
              ))}
            </h1>

            <p className="h-sub text-lg leading-relaxed mb-9 max-w-[480px]" style={{ color: "var(--text-2)", fontWeight: 400 }}>
              Every candidate is assessed, scored, and verified before they can see a single job listing.{" "}
              <span style={{ color: "var(--text)", fontWeight: 500 }}>No spam. Only proof.</span>
            </p>

            {/* CTAs */}
            <div className="h-ctas flex flex-wrap gap-3 mb-10">
              <Link href="/register?role=candidate" className="btn-primary btn-lg">
                I'm a Candidate <ArrowRight size={16} />
              </Link>
              <Link href="/register?role=hr" className="btn-secondary btn-lg">
                Start Hiring
              </Link>
              <button onClick={() => scrollTo("process")}
                className="flex items-center gap-2.5 px-5 py-3 text-sm font-medium rounded-2xl transition-all"
                style={{ color: "var(--text-2)" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-2)"}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.07)" }}>
                  <Play size={10} className="fill-current ml-0.5" />
                </span>
                See how it works
              </button>
            </div>

            {/* Social proof */}
            <div className="h-proof flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {[IMG.team1, IMG.team2, IMG.team3, IMG.team4].map((src, i) => (
                  <img key={i} src={src} alt="" className="w-9 h-9 rounded-full object-cover ring-2"
                    style={{ ringColor: "var(--bg)" }} />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-amber-400 text-amber-400" />)}
                  <span className="text-xs font-bold ml-1" style={{ color: "var(--amber)" }}>4.9</span>
                </div>
                <p className="text-xs" style={{ color: "var(--text-2)" }}>
                  Trusted by <strong style={{ color: "var(--text)" }}>2,400+</strong> professionals
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — Hero visual */}
          <div className="relative h-img-wrap hidden lg:block" style={{ height: "580px" }}>
            {/* Main image */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              <Image src={IMG.hero} alt="Team collaborating" fill className="object-cover"
                style={{ filter: "brightness(0.55) saturate(0.85)" }} />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(160deg, rgba(245,158,11,0.06) 0%, transparent 50%, rgba(5,5,7,0.6) 100%)" }} />

              {/* Bottom stat overlay */}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl p-4"
                style={{ background: "rgba(12,12,16,0.85)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs mb-1" style={{ color: "var(--text-2)" }}>Average time to hire</p>
                    <p className="font-black text-2xl font-display" style={{ color: "var(--amber)" }}>4.2 days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs mb-1" style={{ color: "var(--text-2)" }}>vs. industry average</p>
                    <p className="font-bold text-sm" style={{ color: "#34d399" }}>72% faster ↓</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Float card 1 — verified badge */}
            <div className="h-card-1 absolute -left-10 top-10 rounded-2xl p-4 w-[200px]"
              style={{ background: "var(--surface-2)", border: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(52,211,153,0.12)" }}>
                  <ShieldCheck size={13} style={{ color: "#34d399" }} />
                </div>
                <p className="text-xs font-bold" style={{ color: "var(--text)" }}>Verified ✓</p>
              </div>
              <div className="flex items-center gap-2.5">
                <img src={IMG.team3} alt="" className="w-8 h-8 rounded-xl object-cover shrink-0" />
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>Arjun Singh</p>
                  <p className="text-[10px] font-bold" style={{ color: "var(--amber)" }}>Score 91%</p>
                </div>
              </div>
            </div>

            {/* Float card 2 — new offer */}
            <div className="h-card-2 absolute -right-6 top-[38%] rounded-2xl p-4 w-[185px]"
              style={{ background: "var(--surface-2)", border: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
              <p className="text-[10px] font-semibold mb-2" style={{ color: "var(--text-2)" }}>New offer 🎉</p>
              <p className="text-sm font-bold mb-0.5" style={{ color: "var(--text)" }}>Senior Developer</p>
              <p className="text-xs font-semibold" style={{ color: "var(--amber)" }}>Razorpay · ₹28 LPA</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown size={18} className="animate-bounce" style={{ color: "var(--text-3)" }} />
        </div>
      </section>

      {/* ── Marquee ────────────────────────────────── */}
      <div className="py-5 overflow-hidden"
        style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="marquee-track flex gap-14 whitespace-nowrap" style={{ width: "max-content" }}>
          {logos.map((c, i) => (
            <span key={i} className="text-[11px] font-black uppercase tracking-[0.22em]"
              style={{ color: "var(--text-3)" }}>{c}</span>
          ))}
        </div>
        <p className="text-center text-[10px] uppercase tracking-[0.2em] mt-2.5" style={{ color: "var(--text-3)" }}>
          Companies hiring verified talent from Skill1 Hire
        </p>
      </div>

      {/* ── Stats ──────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: "2,400+", label: "Verified Candidates" },
              { val: "98%", label: "Hire Success Rate" },
              { val: "3×", label: "Faster Than Industry" },
              { val: "Zero", label: "Resume Spam" },
            ].map(({ val, label }) => (
              <div key={label}>
                <p className="font-display font-black mb-2"
                  style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)", color: "var(--amber)", textShadow: "0 0 32px rgba(245,158,11,0.35)" }}>
                  {val}
                </p>
                <p className="text-sm" style={{ color: "var(--text-2)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ────────────────────────────────── */}
      <section id="process" className="py-24 px-6 relative overflow-hidden" style={{ background: "var(--surface)" }}>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="reveal text-center mb-16">
            <p className="eyebrow mb-3">The Process</p>
            <h2 className="font-display font-black leading-[1.1] mb-4"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}>
              Four steps from zero<br />to <span className="text-gradient">hired.</span>
            </h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: "var(--text-2)" }}>
              Every step designed to prove real ability — not coach interview theater.
            </p>
          </div>

          <div className="reveal-stagger grid md:grid-cols-2 gap-4">
            {process.map(({ n, icon: Icon, title, desc }) => (
              <div key={n} className="card-hover p-7 group relative overflow-hidden">
                <div className="absolute -top-2 -right-2 font-black font-display leading-none select-none"
                  style={{ fontSize: "6rem", color: "rgba(245,158,11,0.045)" }}>{n}</div>
                <div className="relative">
                  <p className="eyebrow mb-5">{n}</p>
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105"
                    style={{ background: "var(--amber-dim)" }}>
                    <Icon size={20} style={{ color: "var(--amber)" }} />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2" style={{ color: "var(--text)" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="reveal text-center mb-16">
            <p className="eyebrow mb-3">Features</p>
            <h2 className="font-display font-black leading-[1.1] mb-4"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}>
              Built for serious<br /><span className="text-gradient">hiring teams.</span>
            </h2>
          </div>

          <div className="reveal-stagger grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc, accent }) => (
              <div key={title} className="card-hover p-6 group">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105"
                  style={{ background: `${accent}14` }}>
                  <Icon size={19} style={{ color: accent }} />
                </div>
                <h3 className="font-display font-bold text-[15px] mb-2" style={{ color: "var(--text)" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For HRs — image section ─────────────────── */}
      <section id="for-hrs" className="py-24 px-6" style={{ background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="reveal grid lg:grid-cols-2 gap-16 items-center">

            {/* Image */}
            <div className="relative rounded-3xl overflow-hidden" style={{ height: "500px" }}>
              <Image src={IMG.office} alt="Modern workplace" fill className="object-cover"
                style={{ filter: "brightness(0.5) saturate(0.8)" }} />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, transparent 30%, rgba(12,12,16,0.9) 100%)" }} />
              {/* Overlay card */}
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl p-5"
                style={{ background: "rgba(12,12,16,0.9)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>Active Hiring Rounds</p>
                  <span className="badge-green badge">Live</span>
                </div>
                <p className="font-display font-black text-2xl" style={{ color: "var(--text)" }}>
                  24 <span className="text-base font-normal" style={{ color: "var(--text-2)" }}>open roles</span>
                </p>
              </div>
            </div>

            {/* Copy */}
            <div>
              <p className="eyebrow mb-5">For HRs & Companies</p>
              <h2 className="font-display font-black leading-[1.1] mb-6"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                Stop reviewing<br />
                <span className="text-gradient">200 bad resumes.</span>
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-2)" }}>
                Every candidate on Skill1 Hire has already passed your first three rounds of screening — skill tests, live project review, and admin verification.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Verified skill scores, not just job titles",
                  "Real capstone projects you can actually view",
                  "Faster shortlisting, better quality hires",
                  "Post jobs free — no subscription needed",
                ].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "var(--green-dim)" }}>
                      <CheckCircle size={11} style={{ color: "#34d399" }} />
                    </div>
                    <span className="text-sm" style={{ color: "var(--text-2)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/register?role=hr" className="btn-primary">
                Start Hiring Free <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mentors section ─────────────────────────── */}
      <section id="mentors" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="reveal grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="eyebrow mb-5">Mentor Network</p>
              <h2 className="font-display font-black leading-[1.1] mb-6"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                Learn from people<br />
                <span className="text-gradient">already there.</span>
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-2)" }}>
                Book 1:1 sessions with verified senior engineers from top companies. Every mentor is reviewed after every session — accountability built in.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Verified professionals from Stripe, Google, Razorpay",
                  "Rated and reviewed after every session",
                  "Book 30, 60, or 90 min slots directly",
                  "Affordable rates. Real expertise.",
                ].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "var(--amber-dim)" }}>
                      <CheckCircle size={11} style={{ color: "var(--amber)" }} />
                    </div>
                    <span className="text-sm" style={{ color: "var(--text-2)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/register?role=mentor" className="btn-secondary">
                Become a Mentor <ArrowRight size={15} />
              </Link>
            </div>

            {/* Mentor cards */}
            <div className="space-y-3">
              {[
                { img: IMG.team4, name: "Sneha Patel", role: "SRE @ Stripe", exp: "6 yrs", skills: ["System Design", "K8s", "SRE"], rate: "₹900/60min", rating: 4.9 },
                { img: IMG.team1, name: "Rahul Mehta", role: "SDE-3 @ Razorpay", exp: "5 yrs", skills: ["React", "Node.js", "DSA"], rate: "₹750/60min", rating: 4.8 },
                { img: IMG.team3, name: "Arjun Singh", role: "Full Stack @ CRED", exp: "4 yrs", skills: ["Full Stack", "SQL", "AWS"], rate: "₹600/60min", rating: 4.7 },
              ].map(m => (
                <div key={m.name} className="card-hover p-4 flex items-center gap-4">
                  <img src={m.img} alt={m.name} className="w-12 h-12 rounded-2xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{m.name}</p>
                      <div className="flex items-center gap-1">
                        <Star size={10} className="fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold" style={{ color: "var(--amber)" }}>{m.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs mb-2" style={{ color: "var(--text-2)" }}>{m.role} · {m.exp}</p>
                    <div className="flex flex-wrap gap-1">
                      {m.skills.map(s => (
                        <span key={s} className="badge badge-dim" style={{ padding: "2px 8px", fontSize: "10px" }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold" style={{ color: "var(--amber)" }}>{m.rate}</p>
                    <Link href="/register" className="text-[10px] font-semibold" style={{ color: "var(--text-3)" }}>Book →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "var(--surface)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="reveal text-center mb-16">
            <p className="eyebrow mb-3">What people say</p>
            <h2 className="font-display font-black leading-[1.1]"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}>
              Real people.<br /><span className="text-gradient">Real outcomes.</span>
            </h2>
          </div>

          <div className="reveal-stagger grid md:grid-cols-2 gap-5">
            {testimonials.map(({ img, name, role, quote }) => (
              <div key={name} className="card-hover p-7">
                <Quote size={24} className="mb-5 opacity-20" style={{ color: "var(--amber)" }} />
                <p className="text-base leading-relaxed mb-7" style={{ color: "var(--text-2)", fontStyle: "italic" }}>
                  "{quote}"
                </p>
                <div className="flex items-center gap-3.5">
                  <img src={img} alt={name} className="w-11 h-11 rounded-2xl object-cover" />
                  <div>
                    <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>{role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="reveal relative overflow-hidden rounded-3xl p-14 text-center"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)" }}>
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)", filter: "blur(40px)" }} />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />

            <div className="relative z-10">
              <p className="eyebrow mb-5">Join Today</p>
              <h2 className="font-display font-black leading-[1.1] mb-4"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}>
                Your next hire is<br /><span className="text-gradient">already verified.</span>
              </h2>
              <p className="text-base mb-10 max-w-lg mx-auto" style={{ color: "var(--text-2)" }}>
                Join 2,400+ professionals who've stopped guessing and started hiring with proof.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register?role=candidate" className="btn-primary btn-lg">
                  I'm a Candidate <ArrowRight size={16} />
                </Link>
                <Link href="/register?role=hr" className="btn-secondary btn-lg">
                  Post a Job Free
                </Link>
              </div>
              <p className="text-xs mt-6" style={{ color: "var(--text-3)" }}>
                Free to join · No credit card · Takes 2 minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="px-6 lg:px-12 py-10" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-display font-black text-xs"
              style={{ background: "var(--amber)", color: "#050507" }}>S1</div>
            <span className="font-display font-bold text-sm" style={{ color: "var(--text)" }}>
              Skill1 <span style={{ color: "var(--amber)" }}>Hire</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {[
              { href: "/jobs", label: "Browse Jobs" },
              { href: "/register?role=candidate", label: "For Candidates" },
              { href: "/register?role=hr", label: "For HRs" },
              { href: "/register?role=mentor", label: "Become a Mentor" },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className="text-xs font-medium transition-colors"
                style={{ color: "var(--text-3)" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--amber)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}>
                {label}
              </Link>
            ))}
          </div>

          <p className="text-xs" style={{ color: "var(--text-3)" }}>
            © 2025 Skill1 Hire
          </p>
        </div>
      </footer>

    </div>
  );
}