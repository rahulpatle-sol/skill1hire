"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminAPI } from "@/lib/api";
import { Card, Btn, Badge, Avatar, PageHdr, Skel, Empty, Tabs } from "@/components/ui";
import { ShieldCheck, ShieldX, Github, ExternalLink } from "lucide-react";

export default function AdminVerify() {
  const [data, setData] = useState({ candidates: [], hrs: [], mentors: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("candidates");
  const [verifying, setVerifying] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    Promise.all([adminAPI.getPendingVerifications("candidate"), adminAPI.getPendingVerifications("hr"), adminAPI.getPendingVerifications("mentor")])
      .then(([c, h, m]) => setData({ candidates: c.data?.data?.pending || [], hrs: h.data?.data?.pending || [], mentors: m.data?.data?.pending || [] }))
      .finally(() => setLoading(false));
  }, []);

  const verify = async (userId, approve) => {
    setVerifying(userId);
    try {
      await adminAPI.verifyUser(userId, { isVerified: approve });
      toast.success(approve ? "Approved ✅" : "Rejected");
      const remove = l => l.filter(u => (u.user?._id || u._id) !== userId);
      setData(d => ({ candidates: remove(d.candidates), hrs: remove(d.hrs), mentors: remove(d.mentors) }));
    } catch { toast.error("Failed"); }
    finally { setVerifying(null); }
  };

  const TABS = [
    { id: "candidates", label: "Candidates", count: data.candidates.length },
    { id: "hrs", label: "HR Accounts", count: data.hrs.length },
    { id: "mentors", label: "Mentors", count: data.mentors.length },
  ];

  const list = data[tab] || [];
  if (loading) return <div><PageHdr title="Verifications" /><div className="space-y-3">{[...Array(4)].map((_, i) => <Skel key={i} className="h-20" />)}</div></div>;

  return (
    <div>
      <PageHdr title="Pending Verifications" sub="Review and approve user profiles" />
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {list.length === 0 ? <Empty icon={ShieldCheck} title="All caught up!" desc="No pending verifications." /> : (
        <div className="space-y-3">
          {list.map(u => {
            const id = u.user?._id || u._id;
            const isOpen = expanded === id;
            return (
              <Card key={id} className="overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => setExpanded(isOpen ? null : id)}>
                    <Avatar name={u.user?.name || "?"} size="sm" />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{u.user?.name || "User"}</p>
                      <p className="text-xs" style={{ color: "var(--text-3)" }}>{u.user?.email}{u.companyName ? ` · ${u.companyName}` : ""}</p>
                    </div>
                    <span className="ml-2 text-xs" style={{ color: "var(--text-3)" }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                  <div className="flex gap-2">
                    <Btn size="sm" loading={verifying === id} onClick={() => verify(id, true)}><ShieldCheck size={12} />Approve</Btn>
                    <Btn variant="danger" size="sm" onClick={() => verify(id, false)}><ShieldX size={12} />Reject</Btn>
                  </div>
                </div>
                {isOpen && (
                  <div className="px-5 pb-5 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                    {/* Score */}
                    {u.overallScore !== undefined && (
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="p-3 rounded-2xl text-center" style={{ background: "var(--amber-dim)" }}>
                          <p className="font-black text-xl font-display" style={{ color: "var(--amber)" }}>{u.overallScore || 0}%</p>
                          <p className="text-xs" style={{ color: "var(--text-3)" }}>Score</p>
                        </div>
                        <div className="p-3 rounded-2xl text-center" style={{ background: "var(--green-dim)" }}>
                          <p className="font-black text-xl font-display" style={{ color: "#34d399" }}>{u.totalAssessmentsPassed || 0}</p>
                          <p className="text-xs" style={{ color: "var(--text-3)" }}>Tests</p>
                        </div>
                        <div className="p-3 rounded-2xl text-center" style={{ background: "rgba(99,102,241,0.1)" }}>
                          <p className="font-black text-sm font-display capitalize" style={{ color: "#a5b4fc" }}>{u.capstoneProject?.status || "—"}</p>
                          <p className="text-xs" style={{ color: "var(--text-3)" }}>Capstone</p>
                        </div>
                      </div>
                    )}
                    {/* Capstone links */}
                    {u.capstoneProject?.repoUrl && (
                      <div className="flex gap-2">
                        <a href={u.capstoneProject.repoUrl} target="_blank"><Btn variant="secondary" size="sm"><Github size={12} />Repo</Btn></a>
                        {u.capstoneProject.liveUrl && <a href={u.capstoneProject.liveUrl} target="_blank"><Btn variant="secondary" size="sm"><ExternalLink size={12} />Live</Btn></a>}
                      </div>
                    )}
                    {u.bio && <p className="text-sm mt-3" style={{ color: "var(--text-2)" }}>{u.bio}</p>}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
