"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { hrAPI } from "@/lib/api";
import { Card, StatCard, Badge, Btn, PageHdr, Skel, Empty } from "@/components/ui";
import { Briefcase, Users, PlusCircle, ArrowRight, ShieldAlert, Eye, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function HRDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hrAPI.getMyJobs({ limit: 5 }).then(({ data }) => { setJobs(data?.data?.jobs || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const totalApps = jobs.reduce((s, j) => s + (j.applicationsCount || 0), 0);
  const active = jobs.filter(j => j.status === "active").length;

  if (!user?.isVerified) return (
    <div><PageHdr title="HR Dashboard" />
      <Card className="p-16 text-center">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(245,158,11,0.1)" }}>
          <ShieldAlert size={28} style={{ color: "var(--amber)" }} />
        </div>
        <h3 className="font-display font-bold text-xl mb-2" style={{ color: "var(--text)" }}>Pending Verification</h3>
        <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--text-2)" }}>Your HR account is under review. You can post jobs once verified by admin.</p>
      </Card>
    </div>
  );

  if (loading) return <div><PageHdr title="Dashboard" /><div className="grid grid-cols-3 gap-4 mb-6">{[...Array(3)].map((_, i) => <Skel key={i} className="h-28" />)}</div><Skel className="h-64" /></div>;

  return (
    <div>
      <PageHdr title={`Hey ${user?.name?.split(" ")[0]} 🏢`} sub="Your hiring pipeline"
        action={<Link href="/hr/post-job"><Btn><PlusCircle size={15} />Post a Job</Btn></Link>}
      />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Jobs Posted" value={jobs.length} icon={Briefcase} color="amber" />
        <StatCard label="Active Listings" value={active} icon={Eye} color="green" />
        <StatCard label="Total Applicants" value={totalApps} icon={Users} color="indigo" />
      </div>
      <Card>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="font-display font-bold text-sm" style={{ color: "var(--text)" }}>Your Jobs</h2>
          <Link href="/hr/jobs"><Btn variant="ghost" size="sm">View all →</Btn></Link>
        </div>
        {jobs.length === 0 ? (
          <Empty icon={Briefcase} title="No jobs yet" cta={<Link href="/hr/post-job"><Btn>Post First Job</Btn></Link>} />
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {jobs.map(job => (
              <div key={job._id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="font-medium text-sm" style={{ color: "var(--text)" }}>{job.title}</p>
                  <p className="text-xs mt-0.5 flex items-center gap-2" style={{ color: "var(--text-3)" }}>
                    <Clock size={10} />{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                    · {job.applicationsCount || 0} applicants
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={job.status === "active" ? "green" : "dim"}>{job.status}</Badge>
                  <Link href={`/hr/jobs/${job._id}/applications`}><Btn variant="secondary" size="sm"><Users size={12} />View</Btn></Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
