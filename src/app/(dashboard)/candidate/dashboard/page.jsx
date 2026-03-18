"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { candidateAPI } from "@/lib/api";
import { Card, StatCard, Badge, Btn, Progress, Skel, PageHdr, Empty, Avatar } from "@/components/ui";
import { Briefcase, BookOpen, Award, ShieldCheck, ArrowRight, CheckCircle, Clock, AlertCircle, TrendingUp, Star, Zap } from "lucide-react";

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [sc, setSc] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const cardsRef = useRef(null);

  useEffect(() => {
    Promise.all([candidateAPI.getScorecard(), candidateAPI.getMyApplications({ limit: 4 })])
      .then(([s, a]) => { setSc(s.data?.data?.scorecard); setApps(a.data?.data?.applications || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      (async () => {
        const { gsap } = await import("gsap");
        gsap.fromTo(".dash-card", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" });
      })();
    }
  }, [loading]);

  const steps = [
    { label: "Account Created", done: true },
    { label: "Profile Complete", done: (sc?.profileCompleteness || 0) >= 70 },
    { label: "Assessment Passed", done: (sc?.totalAssessmentsPassed || 0) > 0 },
    { label: "Capstone Submitted", done: sc?.capstoneStatus !== "not_submitted" && !!sc?.capstoneStatus },
    { label: "Admin Verified", done: !!user?.isVerified },
  ];
  const doneCount = steps.filter(s => s.done).length;

  const statusColor = { applied: "dim", shortlisted: "indigo", interview_scheduled: "amber", offered: "green", hired: "green", rejected: "red", withdrawn: "dim" };

  if (loading) return (
    <div>
      <PageHdr title="Dashboard" sub="Loading your data..." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">{[...Array(4)].map((_, i) => <Skel key={i} className="h-28" />)}</div>
      <div className="grid grid-cols-3 gap-5"><Skel className="h-72 col-span-2" /><Skel className="h-72" /></div>
    </div>
  );

  return (
    <div>
      <PageHdr
        title={`Hey ${user?.name?.split(" ")[0]} 👋`}
        sub="Here's your Skill1 Hire snapshot"
        action={user?.isVerified ? <Link href="/candidate/jobs"><Btn size="sm">Browse Jobs <ArrowRight size={13} /></Btn></Link> : null}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="dash-card"><StatCard label="HireScore™" value={`${sc?.overallScore || 0}%`} icon={TrendingUp} color="amber" /></div>
        <div className="dash-card"><StatCard label="Tests Passed" value={sc?.totalAssessmentsPassed || 0} icon={CheckCircle} color="green" /></div>
        <div className="dash-card"><StatCard label="Applications" value={apps.length} icon={Briefcase} color="indigo" /></div>
        <div className="dash-card"><StatCard label="Profile Done" value={`${sc?.profileCompleteness || 0}%`} icon={Star} color="purple" /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Verification Journey */}
        <div className="dash-card lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-base" style={{ color: "var(--text)" }}>Verification Journey</h2>
              {user?.isVerified
                ? <Badge variant="green"><ShieldCheck size={10} /> Verified</Badge>
                : <Badge variant="amber"><Clock size={10} /> {doneCount}/5 done</Badge>}
            </div>
            <Progress value={doneCount} max={5} color="amber" label="Progress" />
            <div className="mt-5 space-y-3">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: s.done ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.04)" }}>
                    {s.done
                      ? <CheckCircle size={14} style={{ color: "var(--amber)" }} />
                      : <AlertCircle size={14} style={{ color: "var(--text-3)" }} />}
                  </div>
                  <span className="text-sm font-medium" style={{ color: s.done ? "var(--text)" : "var(--text-3)" }}>{s.label}</span>
                  {s.done && <Badge variant="green" className="ml-auto !py-0 !text-[10px]">✓</Badge>}
                </div>
              ))}
            </div>
            {!user?.isVerified && (
              <div className="mt-5 pt-5 flex gap-2.5" style={{ borderTop: "1px solid var(--border)" }}>
                <Link href="/candidate/assessments" className="flex-1"><Btn className="w-full" size="sm">Take Assessments</Btn></Link>
                <Link href="/candidate/profile" className="flex-1"><Btn variant="secondary" className="w-full" size="sm">Update Profile</Btn></Link>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="dash-card space-y-3">
          <Card className="p-5">
            <h3 className="font-display font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Quick Actions</h3>
            <div className="space-y-1.5">
              {[
                { href: "/candidate/profile", icon: "👤", label: "Update Profile" },
                { href: "/candidate/assessments", icon: "📝", label: "Take Assessment" },
                { href: "/candidate/scorecard", icon: "🏆", label: "View Scorecard" },
                ...(user?.isVerified ? [{ href: "/candidate/jobs", icon: "💼", label: "Browse Jobs" }] : []),
              ].map(a => (
                <Link key={a.href} href={a.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
                  style={{ color: "var(--text-2)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span className="text-base">{a.icon}</span>
                  <span className="text-sm flex-1 group-hover:text-amber-300 transition-colors">{a.label}</span>
                  <ArrowRight size={12} style={{ color: "var(--text-3)" }} />
                </Link>
              ))}
            </div>
          </Card>

          {/* Capstone */}
          <Card className="p-5">
            <h3 className="font-display font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Capstone</h3>
            {!sc?.capstoneStatus || sc.capstoneStatus === "not_submitted" ? (
              <div>
                <p className="text-xs mb-3" style={{ color: "var(--text-2)" }}>Submit a project to complete your verification.</p>
                <Link href="/candidate/profile"><Btn variant="secondary" size="sm" className="w-full">Submit Project</Btn></Link>
              </div>
            ) : (
              <Badge variant={sc.capstoneStatus === "approved" ? "green" : "amber"}>
                {sc.capstoneStatus.replace("_", " ")}
              </Badge>
            )}
          </Card>
        </div>
      </div>

      {/* Recent Applications */}
      {apps.length > 0 && (
        <div className="dash-card">
          <Card>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <h2 className="font-display font-bold text-sm" style={{ color: "var(--text)" }}>Recent Applications</h2>
              <Link href="/candidate/applications"><Btn variant="ghost" size="sm">View all →</Btn></Link>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {apps.map(app => (
                <div key={app._id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{app.job?.title || "Job"}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{app.job?.location || "Remote"}</p>
                  </div>
                  <Badge variant={statusColor[app.status] || "dim"}>{app.status?.replace("_", " ")}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
