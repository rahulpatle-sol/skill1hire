"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { candidateAPI } from "@/lib/api";
import { Card, Badge, Btn, PageHdr, Empty, Skel, Tabs } from "@/components/ui";
import { FileText, MapPin, Trash2, Clock, CheckCircle, XCircle, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const S = { applied: { v: "dim", icon: Clock }, shortlisted: { v: "indigo", icon: CheckCircle }, interview_scheduled: { v: "amber", icon: Calendar }, offered: { v: "green", icon: CheckCircle }, hired: { v: "green", icon: CheckCircle }, rejected: { v: "red", icon: XCircle }, withdrawn: { v: "dim", icon: XCircle } };

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [withdrawing, setWithdrawing] = useState(null);

  useEffect(() => {
    candidateAPI.getMyApplications().then(({ data }) => { setApps(data?.data?.applications || []); setLoading(false); });
  }, []);

  const withdraw = async (id) => {
    if (!confirm("Withdraw this application?")) return;
    setWithdrawing(id);
    try {
      await candidateAPI.withdrawApplication(id);
      setApps(a => a.map(x => x._id === id ? { ...x, status: "withdrawn" } : x));
      toast.success("Withdrawn");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setWithdrawing(null); }
  };

  const filtered = apps.filter(a => {
    if (tab === "active") return ["applied","shortlisted","interview_scheduled"].includes(a.status);
    if (tab === "offers") return ["offered","hired"].includes(a.status);
    if (tab === "closed") return ["rejected","withdrawn"].includes(a.status);
    return true;
  });

  const TABS = [
    { id: "all", label: "All", count: apps.length },
    { id: "active", label: "Active", count: apps.filter(a => ["applied","shortlisted","interview_scheduled"].includes(a.status)).length },
    { id: "offers", label: "Offers 🎉", count: apps.filter(a => ["offered","hired"].includes(a.status)).length },
    { id: "closed", label: "Closed", count: apps.filter(a => ["rejected","withdrawn"].includes(a.status)).length },
  ];

  if (loading) return <div><PageHdr title="Applications" /><div className="space-y-3">{[...Array(4)].map((_, i) => <Skel key={i} className="h-20" />)}</div></div>;

  return (
    <div>
      <PageHdr title="My Applications" sub={`${apps.length} total`} />
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {filtered.length === 0 ? (
        <Empty icon={FileText} title="No applications" desc="Jobs you apply to appear here." cta={<Btn onClick={() => window.location.href = "/candidate/jobs"}>Browse Jobs</Btn>} />
      ) : (
        <div className="space-y-3">
          {filtered.map(app => {
            const st = S[app.status] || S.applied;
            const Icon = st.icon;
            return (
              <Card key={app._id} className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "var(--amber-dim)" }}>
                      <FileText size={16} style={{ color: "var(--amber)" }} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>{app.job?.title || "Job"}</p>
                      <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                        {app.job?.location && <span className="flex items-center gap-1"><MapPin size={10} />{app.job.location}</span>}
                        <span>{formatDistanceToNow(new Date(app.appliedAt || Date.now()), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <Badge variant={st.v}><Icon size={10} />{app.status?.replace("_"," ")}</Badge>
                    {["applied","shortlisted"].includes(app.status) && (
                      <Btn variant="danger" size="sm" loading={withdrawing === app._id} onClick={() => withdraw(app._id)}>
                        <Trash2 size={13} />
                      </Btn>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
