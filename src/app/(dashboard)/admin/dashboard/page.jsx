"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { adminAPI } from "@/lib/api";
import { Card, StatCard, Btn, Badge, Avatar, PageHdr, Skel, Empty } from "@/components/ui";
import { Users, Briefcase, ShieldCheck, Layers, ArrowRight, CheckCircle, XCircle, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState({ candidates: [], hrs: [] });
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(null);

  useEffect(() => {
    Promise.all([adminAPI.getDashboard(), adminAPI.getPendingVerifications("candidate"), adminAPI.getPendingVerifications("hr")])
      .then(([d, c, h]) => { setStats(d.data?.data?.stats); setPending({ candidates: (c.data?.data?.pending || []).slice(0,5), hrs: (h.data?.data?.pending || []).slice(0,5) }); })
      .finally(() => setLoading(false));
  }, []);

  const verify = async (userId, approve) => {
    setVerifying(userId);
    try {
      await adminAPI.verifyUser(userId, { isVerified: approve });
      toast.success(approve ? "Verified! ✅" : "Rejected");
      setPending(p => ({ candidates: p.candidates.filter(u => (u.user?._id || u._id) !== userId), hrs: p.hrs.filter(u => (u.user?._id || u._id) !== userId) }));
    } catch { toast.error("Failed"); }
    finally { setVerifying(null); }
  };

  if (loading) return <div><PageHdr title="Dashboard" /><div className="grid grid-cols-4 gap-4 mb-6">{[...Array(4)].map((_, i) => <Skel key={i} className="h-28" />)}</div></div>;

  const PendingList = ({ items, title }) => (
    <Card>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <h2 className="font-display font-bold text-sm" style={{ color: "var(--text)" }}>{title}</h2>
        <Badge variant="amber">{items.length}</Badge>
      </div>
      {items.length === 0 ? (
        <div className="py-8 text-center text-sm" style={{ color: "var(--text-3)" }}>All caught up ✅</div>
      ) : (
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {items.map(u => {
            const id = u.user?._id || u._id;
            return (
              <div key={id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <Avatar name={u.user?.name || "?"} size="sm" />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{u.user?.name || "User"}</p>
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>{u.user?.email || u.companyName}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Btn size="sm" loading={verifying === id} onClick={() => verify(id, true)}><CheckCircle size={12} />Approve</Btn>
                  <Btn variant="danger" size="sm" onClick={() => verify(id, false)}><XCircle size={12} />Reject</Btn>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
        <Link href="/admin/verify"><Btn variant="ghost" size="sm" className="w-full">View All <ArrowRight size={12} /></Btn></Link>
      </div>
    </Card>
  );

  return (
    <div>
      <PageHdr title="Admin Dashboard" sub="Platform overview" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Users" value={stats?.totalUsers || 0} icon={Users} color="amber" />
        <StatCard label="Verified Candidates" value={stats?.verifiedCandidates || 0} icon={ShieldCheck} color="green" />
        <StatCard label="Active Jobs" value={stats?.activeJobs || 0} icon={Briefcase} color="indigo" />
        <StatCard label="Domains" value={stats?.totalDomains || 0} icon={Layers} color="purple" />
      </div>
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <PendingList items={pending.candidates} title="Pending Candidates" />
        <PendingList items={pending.hrs} title="Pending HR Accounts" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{ href: "/admin/users", icon: Users, label: "Manage Users", desc: "View, activate, deactivate" }, { href: "/admin/domains", icon: Layers, label: "Domains & Skills", desc: "Manage taxonomy" }, { href: "/admin/assessments", icon: BarChart3, label: "Assessments", desc: "Create tests" }].map(item => (
          <Link key={item.href} href={item.href}>
            <Card hover className="p-5">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" style={{ background: "var(--amber-dim)" }}>
                <item.icon size={18} style={{ color: "var(--amber)" }} />
              </div>
              <h3 className="font-bold text-sm mb-1" style={{ color: "var(--text)" }}>{item.label}</h3>
              <p className="text-xs" style={{ color: "var(--text-3)" }}>{item.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
