"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search, Briefcase, MapPin, Building2, ShieldCheck,
  ArrowRight, Filter, X, ChevronDown, ArrowUpRight,
  Zap, Clock
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const WORK_MODES = ["All", "Remote", "Onsite", "Hybrid"];
const JOB_TYPES = ["All", "Full-time", "Part-time", "Contract", "Internship"];

const MODE_STYLE = {
  remote:   { bg: "rgba(52,211,153,0.1)",  color: "#34d399" },
  onsite:   { bg: "rgba(99,102,241,0.1)",  color: "#a5b4fc" },
  hybrid:   { bg: "rgba(168,85,247,0.1)",  color: "#d8b4fe" },
};
const TYPE_STYLE = {
  "full-time":  { bg: "rgba(245,158,11,0.1)",  color: "#fbbf24" },
  "part-time":  { bg: "rgba(251,146,60,0.1)",  color: "#fb923c" },
  contract:     { bg: "rgba(99,102,241,0.1)",  color: "#a5b4fc" },
  internship:   { bg: "rgba(236,72,153,0.1)",  color: "#f472b6" },
};

function Pill({ children, style }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full text-[11px] font-semibold px-2.5 py-1"
      style={style}>
      {children}
    </span>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("All");
  const [type, setType] = useState("All");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(search && { search }),
        ...(mode !== "All" && { workMode: mode.toLowerCase() }),
        ...(type !== "All" && { jobType: type.toLowerCase().replace(" ", "-") }),
      });
      const res = await window.fetch(`${API}/jobs?${params}`);
      const data = await res.json();
      setJobs(data?.data?.jobs || []);
      setTotal(data?.data?.total || 0);
      setPages(data?.data?.pages || 1);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [search, mode, type, page]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [search, mode, type]);

  const activeFilters = (mode !== "All" ? 1 : 0) + (type !== "All" ? 1 : 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", fontFamily: "'DM Sans', system-ui, sans-serif", color: "var(--text)" }}>

      {/* ── Navbar ───────────────────────────── */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,7,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-black text-sm"
            style={{ background: "var(--amber)", color: "#050507" }}>S1</div>
          <span className="font-display font-bold text-sm tracking-tight" style={{ color: "var(--text)" }}>
            Skill1 <span style={{ color: "var(--amber)" }}>Hire</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login"
            className="px-4 py-2 text-sm font-medium rounded-xl transition-all"
            style={{ color: "var(--text-2)" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-2)"}>
            Sign in
          </Link>
          <Link href="/register" className="btn-primary btn-sm">
            Get Started <ArrowRight size={13} />
          </Link>
        </div>
      </nav>

      {/* ── Hero header ──────────────────────── */}
      <div className="px-6 py-14 text-center relative overflow-hidden"
        style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(245,158,11,0.07) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{ background: "var(--amber-dim)", border: "1px solid rgba(245,158,11,0.2)", color: "var(--amber)" }}>
            <ShieldCheck size={11} />
            Only verified candidates can apply
          </div>
          <h1 className="font-display font-black leading-[1.1] mb-3"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>
            {total > 0
              ? <><span style={{ color: "var(--amber)" }}>{total}</span> verified jobs</>
              : "Verified jobs"
            }
          </h1>
          <p className="text-base" style={{ color: "var(--text-2)" }}>
            Every listing requires a verified Skill1 Hire candidate. No spam applications.
          </p>
        </div>
      </div>

      {/* ── Search + Filters ─────────────────── */}
      <div className="px-6 py-5 sticky top-[65px] z-40"
        style={{ background: "rgba(5,5,7,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-3">

          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-3)" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && loadJobs()}
              placeholder="Search job title, skills, company..."
              className="input input-icon w-full !py-2.5"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                style={{ color: "var(--text-3)" }}>
                <X size={13} />
              </button>
            )}
          </div>

          {/* Work mode pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {WORK_MODES.map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150"
                style={{
                  background: mode === m ? "var(--amber)" : "rgba(255,255,255,0.05)",
                  color: mode === m ? "#050507" : "var(--text-2)",
                  border: mode === m ? "none" : "1px solid var(--border)",
                }}>
                {m}
              </button>
            ))}
          </div>

          {/* Type filter toggle */}
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: activeFilters > 0 ? "var(--amber-dim)" : "rgba(255,255,255,0.05)",
              color: activeFilters > 0 ? "var(--amber)" : "var(--text-2)",
              border: `1px solid ${activeFilters > 0 ? "rgba(245,158,11,0.3)" : "var(--border)"}`,
            }}>
            <Filter size={12} />
            Filters
            {activeFilters > 0 && (
              <span className="w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black"
                style={{ background: "var(--amber)", color: "#050507" }}>
                {activeFilters}
              </span>
            )}
            <ChevronDown size={12} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>

          {/* Clear all */}
          {(search || mode !== "All" || type !== "All") && (
            <button onClick={() => { setSearch(""); setMode("All"); setType("All"); }}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={{ color: "var(--text-3)", border: "1px solid var(--border)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fca5a5"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-3)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
              Clear all
            </button>
          )}
        </div>

        {/* Expanded type filter */}
        {showFilters && (
          <div className="max-w-5xl mx-auto mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold" style={{ color: "var(--text-3)" }}>Job type:</span>
            {JOB_TYPES.map(t => (
              <button key={t} onClick={() => setType(t)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150"
                style={{
                  background: type === t ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                  color: type === t ? "#a5b4fc" : "var(--text-2)",
                  border: `1px solid ${type === t ? "rgba(99,102,241,0.3)" : "var(--border)"}`,
                }}>
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Job list + Detail ─────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className={`grid gap-5 ${selected ? "lg:grid-cols-5" : "lg:grid-cols-1"}`}>

          {/* List */}
          <div className={selected ? "lg:col-span-2 space-y-3" : "space-y-3"}>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: "110px" }} />
              ))
            ) : jobs.length === 0 ? (
              <div className="card py-20 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "var(--amber-dim)" }}>
                  <Briefcase size={22} style={{ color: "var(--amber)" }} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2" style={{ color: "var(--text)" }}>
                  No jobs found
                </h3>
                <p className="text-sm max-w-xs mx-auto" style={{ color: "var(--text-2)" }}>
                  Try different keywords or clear the filters above.
                </p>
              </div>
            ) : jobs.map(job => (
              <button key={job._id} onClick={() => setSelected(job)} className="w-full text-left">
                <div className={`card-hover p-5 transition-all ${selected?._id === job._id ? "!border-amber-500/40 !bg-surface-2" : ""}`}>
                  <div className="flex items-start gap-4">
                    {/* Company logo placeholder */}
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }}>
                      <Building2 size={17} style={{ color: "var(--text-3)" }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-sm leading-snug" style={{ color: "var(--text)" }}>
                          {job.title}
                        </h3>
                        {job.requiresVerification && (
                          <ShieldCheck size={13} className="shrink-0 mt-0.5" style={{ color: "var(--amber)" }} />
                        )}
                      </div>

                      <p className="text-xs mb-2.5" style={{ color: "var(--text-2)" }}>
                        {job.company || "Company"}{job.location ? ` · ${job.location}` : ""}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {job.workMode && (
                          <Pill style={MODE_STYLE[job.workMode] || { bg: "rgba(255,255,255,0.06)", color: "var(--text-2)" }}>
                            {job.workMode}
                          </Pill>
                        )}
                        {job.jobType && (
                          <Pill style={TYPE_STYLE[job.jobType] || { bg: "rgba(255,255,255,0.06)", color: "var(--text-2)" }}>
                            {job.jobType}
                          </Pill>
                        )}
                        {job.domain?.name && (
                          <Pill style={{ bg: "var(--indigo-dim)", color: "#a5b4fc", background: "var(--indigo-dim)" }}>
                            {job.domain.name}
                          </Pill>
                        )}
                      </div>

                      {job.salaryRange?.min && (
                        <p className="text-xs font-semibold" style={{ color: "var(--amber)" }}>
                          ₹{(job.salaryRange.min / 100000).toFixed(1)}L – ₹{(job.salaryRange.max / 100000).toFixed(1)}L / yr
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {/* Pagination */}
            {!loading && pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
                  style={{ border: "1px solid var(--border)", color: "var(--text-2)", background: "transparent" }}>
                  ← Prev
                </button>
                <span className="text-sm px-3" style={{ color: "var(--text-3)" }}>
                  {page} / {pages}
                </span>
                <button
                  disabled={page >= pages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
                  style={{ border: "1px solid var(--border)", color: "var(--text-2)", background: "transparent" }}>
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* ── Job Detail Panel ──────────────── */}
          {selected && (
            <div className="lg:col-span-3">
              <div className="card p-7 sticky top-[130px]">

                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)" }}>
                      <Building2 size={20} style={{ color: "var(--text-3)" }} />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-xl leading-snug" style={{ color: "var(--text)" }}>
                        {selected.title}
                      </h2>
                      <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>
                        {selected.company || "Company"}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)}
                    className="p-1.5 rounded-xl transition-all"
                    style={{ color: "var(--text-3)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}>
                    <X size={17} />
                  </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {selected.workMode && (
                    <Pill style={MODE_STYLE[selected.workMode] || {}}>
                      {selected.workMode}
                    </Pill>
                  )}
                  {selected.jobType && (
                    <Pill style={TYPE_STYLE[selected.jobType] || {}}>
                      {selected.jobType}
                    </Pill>
                  )}
                  {selected.experienceLevel && (
                    <Pill style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-2)" }}>
                      {selected.experienceLevel}
                    </Pill>
                  )}
                  {selected.requiresVerification && (
                    <Pill style={{ background: "var(--amber-dim)", color: "var(--amber)" }}>
                      <ShieldCheck size={10} /> Verified candidates only
                    </Pill>
                  )}
                </div>

                {/* Meta info */}
                <div className="space-y-2 mb-6">
                  {selected.location && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-2)" }}>
                      <MapPin size={13} style={{ color: "var(--text-3)" }} />
                      {selected.location}
                    </div>
                  )}
                  {selected.salaryRange?.min && (
                    <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--amber)" }}>
                      <span>💰</span>
                      ₹{(selected.salaryRange.min / 100000).toFixed(1)}L – ₹{(selected.salaryRange.max / 100000).toFixed(1)}L / yr
                    </div>
                  )}
                  {selected.applicationDeadline && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-2)" }}>
                      <Clock size={13} style={{ color: "var(--text-3)" }} />
                      Apply by {new Date(selected.applicationDeadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  )}
                </div>

                {/* Description */}
                {selected.description && (
                  <div className="mb-6 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)" }}>
                      About this role
                    </h4>
                    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-2)" }}>
                      {selected.description}
                    </p>
                  </div>
                )}

                {/* Required skills */}
                {selected.requiredSkills?.length > 0 && (
                  <div className="mb-6 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)" }}>
                      Required skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.requiredSkills.map(s => (
                        <Pill key={s._id || s} style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-2)" }}>
                          {s.name || s}
                        </Pill>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="space-y-3">
                  <Link href={`/register?role=candidate`} className="btn-primary w-full justify-center" style={{ display: "flex" }}>
                    Apply Now — Create Account First <ArrowRight size={15} />
                  </Link>
                  <p className="text-xs text-center" style={{ color: "var(--text-3)" }}>
                    You need a verified Skill1 Hire profile to apply.{" "}
                    <Link href="/login" style={{ color: "var(--amber)" }}>
                      Already have one? Sign in →
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Empty CTA for non-verified ─────── */}
        {!loading && jobs.length > 0 && !selected && (
          <div className="mt-12 rounded-3xl p-10 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <ShieldCheck size={28} className="mx-auto mb-4" style={{ color: "var(--amber)" }} />
            <h3 className="font-display font-bold text-xl mb-2" style={{ color: "var(--text)" }}>
              Want to apply to these roles?
            </h3>
            <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "var(--text-2)" }}>
              Create a free account, pass skill assessments, and get verified to unlock applications.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/register?role=candidate" className="btn-primary btn-sm">
                Get Verified <Zap size={13} />
              </Link>
              <Link href="/login" className="btn-secondary btn-sm">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}