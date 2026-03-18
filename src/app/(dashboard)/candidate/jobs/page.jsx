"use client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { candidateAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card, Btn, Badge, PageHdr, Empty, Skel } from "@/components/ui";
import { Briefcase, MapPin, Search, ShieldCheck, Building2, Send, X } from "lucide-react";
import { clsx } from "clsx";

const MODES = ["all", "remote", "onsite", "hybrid"];
const MODE_COLOR = { remote: "green", onsite: "indigo", hybrid: "purple" };

export default function JobFeed() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("all");
  const [search, setSearch] = useState("");
  const [applying, setApplying] = useState(false);
  const [cover, setCover] = useState("");
  const [showApply, setShowApply] = useState(false);
  const [total, setTotal] = useState(0);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const p = { limit: 12, ...(search && { search }), ...(mode !== "all" && { workMode: mode }) };
      const { data } = await candidateAPI.getJobFeed(p);
      setJobs(data?.data?.jobs || []);
      setTotal(data?.data?.total || 0);
    } catch (err) {
      if (err.response?.status === 403) toast.error("Complete verification to unlock job feed");
    } finally { setLoading(false); }
  }, [search, mode]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  const apply = async () => {
    setApplying(true);
    try {
      const token = document.cookie.split(";").find(c => c.trim().startsWith("accessToken="))?.split("=")[1];
      const res = await window.fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/jobs/${selected._id}/apply`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ coverLetter: cover }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
      toast.success("Application submitted! 🎉");
      setShowApply(false); setCover(""); loadJobs();
    } catch (err) { toast.error(err.message || "Failed to apply"); }
    finally { setApplying(false); }
  };

  if (!user?.isVerified) return (
    <div>
      <PageHdr title="Job Feed" />
      <Card className="p-16 text-center">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ background: "var(--amber-dim)" }}>
          <ShieldCheck size={28} style={{ color: "var(--amber)" }} />
        </div>
        <h3 className="font-display font-bold text-xl mb-2" style={{ color: "var(--text)" }}>Verification Required</h3>
        <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "var(--text-2)" }}>Complete your assessments and submit a capstone to get verified and unlock jobs.</p>
        <div className="flex justify-center gap-3">
          <Btn onClick={() => window.location.href = "/candidate/assessments"}>Take Assessments</Btn>
          <Btn variant="secondary" onClick={() => window.location.href = "/candidate/profile"}>Submit Capstone</Btn>
        </div>
      </Card>
    </div>
  );

  return (
    <div>
      <PageHdr title="Job Feed" sub={`${total} verified opportunities`} />

      {/* Filters */}
      <Card className="p-4 mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-3)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs, skills..."
            className="input input-icon w-full !py-2.5"
            onKeyDown={e => e.key === "Enter" && loadJobs()} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {MODES.map(m => (
            <button key={m} onClick={() => setMode(m)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all"
              style={{ background: mode === m ? "var(--amber)" : "rgba(255,255,255,0.05)", color: mode === m ? "#050507" : "var(--text-2)" }}>
              {m === "all" ? "All" : m}
            </button>
          ))}
        </div>
      </Card>

      <div className={clsx("grid gap-5", selected ? "lg:grid-cols-5" : "lg:grid-cols-1")}>
        {/* List */}
        <div className={clsx("space-y-3", selected ? "lg:col-span-2" : "")}>
          {loading ? [...Array(4)].map((_, i) => <Skel key={i} className="h-28" />) :
           jobs.length === 0 ? <Empty icon={Briefcase} title="No jobs found" desc="Try different filters." /> :
           jobs.map(job => (
            <Card key={job._id} hover onClick={() => setSelected(job)}
              className={clsx("p-5 cursor-pointer", selected?._id === job._id ? "!border-amber-500/30" : "")}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <Building2 size={16} style={{ color: "var(--text-3)" }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{job.title}</p>
                    <p className="text-xs" style={{ color: "var(--text-2)" }}>{job.company || "Company"}</p>
                  </div>
                </div>
                {job.requiresVerification && <ShieldCheck size={14} style={{ color: "var(--amber)" }} />}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant={MODE_COLOR[job.workMode] || "dim"}>{job.workMode}</Badge>
                <Badge variant="dim">{job.jobType}</Badge>
                {job.domain?.name && <Badge variant="indigo">{job.domain.name}</Badge>}
              </div>
              {job.salaryRange?.min && (
                <p className="text-xs mt-2" style={{ color: "var(--amber)" }}>
                  ₹{(job.salaryRange.min / 100000).toFixed(1)}L – ₹{(job.salaryRange.max / 100000).toFixed(1)}L
                </p>
              )}
            </Card>
          ))}
        </div>

        {/* Detail */}
        {selected && (
          <div className="lg:col-span-3">
            <Card className="p-6 sticky top-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="font-display font-bold text-lg" style={{ color: "var(--text)" }}>{selected.title}</h2>
                  <p className="text-sm mt-0.5" style={{ color: "var(--text-2)" }}>{selected.company}</p>
                </div>
                <button onClick={() => setSelected(null)} style={{ color: "var(--text-3)" }}>
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                <Badge variant={MODE_COLOR[selected.workMode] || "dim"}>{selected.workMode}</Badge>
                <Badge variant="dim">{selected.jobType}</Badge>
                {selected.requiresVerification && <Badge variant="amber"><ShieldCheck size={10} /> Verified Only</Badge>}
              </div>
              {selected.location && <p className="text-sm flex items-center gap-2 mb-2" style={{ color: "var(--text-2)" }}><MapPin size={13} />{selected.location}</p>}
              {selected.salaryRange?.min && <p className="text-sm mb-5" style={{ color: "var(--amber)" }}>💰 ₹{(selected.salaryRange.min / 100000).toFixed(1)}L – ₹{(selected.salaryRange.max / 100000).toFixed(1)}L / yr</p>}
              <div className="mb-5 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-2)" }}>Description</p>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-2)" }}>{selected.description}</p>
              </div>
              {!showApply ? (
                <Btn className="w-full" size="lg" onClick={() => setShowApply(true)}><Send size={15} />Apply Now</Btn>
              ) : (
                <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-2)" }}>Cover Letter (optional)</p>
                  <textarea value={cover} onChange={e => setCover(e.target.value)} placeholder="Why are you a great fit?" rows={4} className="input w-full mb-3 resize-none" />
                  <div className="flex gap-2">
                    <Btn className="flex-1" onClick={apply} loading={applying}><Send size={13} />Submit</Btn>
                    <Btn variant="secondary" onClick={() => setShowApply(false)}>Cancel</Btn>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
