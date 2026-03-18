"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { hrAPI } from "@/lib/api";
import { Card, Btn, Badge, PageHdr, Empty, Skel, Tabs } from "@/components/ui";
import { Briefcase, Users, PlusCircle, Clock, ShieldCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function HRJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => { hrAPI.getMyJobs().then(({ data }) => { setJobs(data?.data?.jobs || []); setLoading(false); }); }, []);

  const toggle = async (id, current) => {
    try { await hrAPI.updateJob(id, { status: current === "active" ? "closed" : "active" }); setJobs(j => j.map(x => x._id === id ? { ...x, status: current === "active" ? "closed" : "active" } : x)); toast.success("Updated"); } catch { toast.error("Failed"); }
  };

  const TABS = [
    { id: "all", label: "All", count: jobs.length },
    { id: "active", label: "Active", count: jobs.filter(j => j.status === "active").length },
    { id: "closed", label: "Closed", count: jobs.filter(j => j.status !== "active").length },
  ];
  const filtered = tab === "all" ? jobs : jobs.filter(j => tab === "active" ? j.status === "active" : j.status !== "active");

  if (loading) return <div><PageHdr title="My Jobs" /><div className="space-y-3">{[...Array(4)].map((_, i) => <Skel key={i} className="h-20" />)}</div></div>;

  return (
    <div>
      <PageHdr title="My Jobs" sub={`${jobs.length} total`} action={<Link href="/hr/post-job"><Btn><PlusCircle size={14} />Post a Job</Btn></Link>} />
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {filtered.length === 0 ? <Empty icon={Briefcase} title="No jobs" cta={<Link href="/hr/post-job"><Btn>Post First Job</Btn></Link>} /> : (
        <div className="space-y-3">
          {filtered.map(job => (
            <Card key={job._id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{job.title}</p>
                    {job.requiresVerification && <ShieldCheck size={13} style={{ color: "var(--amber)" }} />}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant={job.status === "active" ? "green" : "dim"}>{job.status}</Badge>
                    <Badge variant="dim">{job.workMode}</Badge>
                  </div>
                  <p className="text-xs flex items-center gap-2" style={{ color: "var(--text-3)" }}>
                    <Clock size={10} />{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                    · {job.applicationsCount || 0} applicants
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <Link href={`/hr/jobs/${job._id}/applications`}><Btn variant="secondary" size="sm"><Users size={12} />Applicants</Btn></Link>
                  <Btn variant="ghost" size="sm" onClick={() => toggle(job._id, job.status)}>{job.status === "active" ? "Close" : "Reopen"}</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
