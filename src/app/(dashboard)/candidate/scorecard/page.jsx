"use client";
import { useEffect, useState } from "react";
import { candidateAPI } from "@/lib/api";
import { Card, Badge, PageHdr, Skel, Progress } from "@/components/ui";
import { TrendingUp, BookOpen, Award, Code, ShieldCheck, Star } from "lucide-react";

export default function Scorecard() {
  const [sc, setSc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    candidateAPI.getScorecard().then(({ data }) => { setSc(data?.data?.scorecard || data?.data); setLoading(false); });
  }, []);

  if (loading) return <div><PageHdr title="Scorecard" /><div className="grid grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <Skel key={i} className="h-32" />)}</div></div>;

  const metrics = [
    { label: "Overall HireScore™", value: sc?.overallScore || 0, icon: TrendingUp, color: "amber" },
    { label: "Assessment Score", value: sc?.assessmentScore || 0, icon: BookOpen, color: "green", sub: `${sc?.totalAssessmentsPassed || 0} passed` },
    { label: "Profile Complete", value: sc?.profileCompleteness || 0, icon: Award, color: "indigo" },
    { label: "Skills Added", value: Math.min((sc?.totalSkills || 0) * 10, 100), icon: Code, color: "purple", sub: `${sc?.totalSkills || 0} skills` },
  ];

  const iconColors = { amber: "var(--amber)", green: "#34d399", indigo: "#a5b4fc", purple: "#d8b4fe" };
  const iconBgs = { amber: "var(--amber-dim)", green: "var(--green-dim)", indigo: "var(--indigo-dim)", purple: "var(--purple-dim)" };

  return (
    <div>
      <PageHdr title="Scorecard" sub="Your verified performance overview" />

      {/* Hero score */}
      <Card className="p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(245,158,11,0.06) 0%, transparent 70%)" }} />
        <div className="relative flex items-center gap-8">
          <div className="relative w-28 h-28 shrink-0">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--amber)" strokeWidth="2"
                strokeDasharray={`${sc?.overallScore || 0} 100`} strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 6px rgba(245,158,11,0.6))" }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-black font-display text-2xl" style={{ color: "var(--amber)" }}>{sc?.overallScore || 0}</span>
            </div>
          </div>
          <div>
            <h2 className="font-display font-black text-2xl mb-1" style={{ color: "var(--text)" }}>HireScore™</h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>Based on assessments, profile, and capstone</p>
            {sc?.isVerified
              ? <div className="flex items-center gap-2 badge badge-green w-fit"><ShieldCheck size={11} /> Verified Candidate</div>
              : <div className="badge badge-amber w-fit"><Star size={10} /> Verification Pending</div>
            }
          </div>
        </div>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {metrics.map(m => (
          <Card key={m.label} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: iconBgs[m.color] }}>
                <m.icon size={18} style={{ color: iconColors[m.color] }} />
              </div>
              <span className="font-black text-2xl font-display" style={{ color: "var(--text)" }}>{m.value}%</span>
            </div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text)" }}>{m.label}</p>
            {m.sub && <p className="text-xs" style={{ color: "var(--text-2)" }}>{m.sub}</p>}
            <div className="mt-3"><Progress value={m.value} color={m.color} /></div>
          </Card>
        ))}
      </div>

      {/* Assessment breakdown */}
      {sc?.assessmentBreakdown?.length > 0 && (
        <Card className="p-6 mb-4">
          <h3 className="font-display font-bold text-base mb-5" style={{ color: "var(--text)" }}>Assessment Breakdown</h3>
          <div className="space-y-4">
            {sc.assessmentBreakdown.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-1">
                  <Progress value={item.score} label={item.domain} color={item.passed ? "green" : "amber"} />
                </div>
                <Badge variant={item.passed ? "green" : "amber"}>{item.passed ? "✓" : "✗"}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Capstone */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "var(--amber-dim)" }}>
              <Star size={18} style={{ color: "var(--amber)" }} />
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>Capstone Project</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>{sc?.capstoneTitle || "Not submitted yet"}</p>
            </div>
          </div>
          <Badge variant={sc?.capstoneStatus === "approved" ? "green" : sc?.capstoneStatus === "under_review" ? "amber" : "dim"}>
            {sc?.capstoneStatus?.replace("_", " ") || "Not submitted"}
          </Badge>
        </div>
      </Card>
    </div>
  );
}
