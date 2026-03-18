"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { hrAPI } from "@/lib/api";
import { Card, Btn, Badge, Avatar, PageHdr, Skel, Empty, Tabs } from "@/components/ui";
import { ArrowLeft, ShieldCheck, Github, Linkedin, Globe, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const SC = { applied: "dim", shortlisted: "indigo", interview_scheduled: "amber", offered: "green", hired: "green", rejected: "red" };
const ACTIONS = ["shortlisted", "interview_scheduled", "offered", "hired", "rejected"];

export default function HRApplications() {
  const { jobId } = useParams();
  const router = useRouter();
  const [apps, setApps] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    hrAPI.getJobApplications(jobId).then(({ data }) => {
      setApps(data?.data?.applications || []);
      setJob(data?.data?.job);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [jobId]);

  const update = async (id, status) => {
    setUpdating(id);
    try {
      await hrAPI.updateApplication(id, { status });
      setApps(a => a.map(x => x._id === id ? { ...x, status } : x));
      if (selected?._id === id) setSelected(s => ({ ...s, status }));
      toast.success(`Marked as ${status.replace("_", " ")}`);
    } catch { toast.error("Failed"); }
    finally { setUpdating(null); }
  };

  const TABS = [
    { id: "all", label: "All", count: apps.length },
    { id: "applied", label: "New", count: apps.filter(a => a.status === "applied").length },
    { id: "shortlisted", label: "Shortlisted", count: apps.filter(a => a.status === "shortlisted").length },
  ];
  const filtered = tab === "all" ? apps : apps.filter(a => a.status === tab);

  if (loading) return <div><Skel className="h-12 mb-6" /><div className="space-y-3">{[...Array(4)].map((_, i) => <Skel key={i} className="h-20" />)}</div></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-7">
        <button onClick={() => router.back()} className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors" style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-2)" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="font-display font-bold text-xl" style={{ color: "var(--text)" }}>{job?.title || "Job"}</h1>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>{apps.length} applications</p>
        </div>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className={`grid gap-5 ${selected ? "lg:grid-cols-5" : ""}`}>
        <div className={`space-y-2.5 ${selected ? "lg:col-span-2" : ""}`}>
          {filtered.length === 0 ? <Empty icon={null} title="No applications" /> : filtered.map(app => (
            <Card key={app._id} hover onClick={() => setSelected(app)}
              className={`p-4 cursor-pointer ${selected?._id === app._id ? "!border-amber-500/30" : ""}`}>
              <div className="flex items-center gap-3">
                <Avatar name={app.candidate?.user?.name || "?"} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>{app.candidate?.user?.name}</p>
                    {app.candidate?.isVerified && <ShieldCheck size={12} style={{ color: "var(--amber)" }} />}
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>{formatDistanceToNow(new Date(app.appliedAt || Date.now()), { addSuffix: true })}</p>
                </div>
                <Badge variant={SC[app.status] || "dim"}>{app.status?.replace("_"," ")}</Badge>
              </div>
            </Card>
          ))}
        </div>

        {selected && (
          <div className="lg:col-span-3">
            <Card className="p-6 sticky top-6">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <Avatar name={selected.candidate?.user?.name || "?"} size="lg" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold" style={{ color: "var(--text)" }}>{selected.candidate?.user?.name}</h3>
                      {selected.candidate?.isVerified && <Badge variant="green"><ShieldCheck size={10} />Verified</Badge>}
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: "var(--text-2)" }}>{selected.candidate?.headline || "Candidate"}</p>
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>{selected.candidate?.user?.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} style={{ color: "var(--text-3)" }}><X size={16} /></button>
              </div>

              {selected.candidate?.overallScore && (
                <div className="p-4 rounded-2xl mb-5 flex items-center justify-between" style={{ background: "var(--amber-dim)", border: "1px solid rgba(245,158,11,0.15)" }}>
                  <span className="text-sm font-semibold" style={{ color: "var(--amber)" }}>HireScore™</span>
                  <span className="font-black text-2xl font-display" style={{ color: "var(--amber)" }}>{selected.candidate.overallScore}%</span>
                </div>
              )}

              <div className="flex gap-2 mb-5">
                {selected.candidate?.socialLinks?.github && <a href={selected.candidate.socialLinks.github} target="_blank"><Btn variant="secondary" size="sm"><Github size={12} />GitHub</Btn></a>}
                {selected.candidate?.socialLinks?.linkedin && <a href={selected.candidate.socialLinks.linkedin} target="_blank"><Btn variant="secondary" size="sm"><Linkedin size={12} />LinkedIn</Btn></a>}
              </div>

              {selected.coverLetter && (
                <div className="mb-5">
                  <p className="eyebrow mb-2">Cover Letter</p>
                  <p className="text-sm leading-relaxed p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", color: "var(--text-2)" }}>{selected.coverLetter}</p>
                </div>
              )}

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
                <p className="eyebrow mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {ACTIONS.map(s => (
                    <Btn key={s} size="sm"
                      variant={selected.status === s ? "primary" : "secondary"}
                      loading={updating === selected._id}
                      onClick={() => update(selected._id, s)}>
                      {s.replace("_", " ")}
                    </Btn>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
