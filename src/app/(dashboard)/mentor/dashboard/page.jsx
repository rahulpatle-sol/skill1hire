"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { mentorAPI } from "@/lib/api";
import { Card, StatCard, Badge, Btn, PageHdr, Skel, Avatar, Empty } from "@/components/ui";
import { Calendar, Star, CheckCircle, ShieldAlert, Clock, ArrowRight } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default function MentorDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([mentorAPI.getProfile(), mentorAPI.getMySessions({ limit: 5 })])
      .then(([p, s]) => { setProfile(p.data?.data?.profile || p.data?.data); setSessions(s.data?.data?.sessions || []); })
      .finally(() => setLoading(false));
  }, []);

  if (!user?.isVerified) return (
    <div><PageHdr title="Mentor Dashboard" />
      <Card className="p-16 text-center">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(245,158,11,0.1)" }}>
          <ShieldAlert size={28} style={{ color: "var(--amber)" }} />
        </div>
        <h3 className="font-display font-bold text-xl mb-2" style={{ color: "var(--text)" }}>Pending Verification</h3>
        <p className="text-sm" style={{ color: "var(--text-2)" }}>Your mentor profile is under review.</p>
      </Card>
    </div>
  );

  if (loading) return <div><PageHdr title="Dashboard" /><div className="grid grid-cols-3 gap-4 mb-6">{[...Array(3)].map((_, i) => <Skel key={i} className="h-28" />)}</div></div>;

  const upcoming = sessions.filter(s => ["pending","confirmed"].includes(s.status));
  const completed = sessions.filter(s => s.status === "completed").length;

  return (
    <div>
      <PageHdr title={`Hey ${user?.name?.split(" ")[0]} 🎓`} sub="Your mentoring overview"
        action={<Link href="/mentor/sessions"><Btn variant="secondary" size="sm">Sessions <ArrowRight size={13} /></Btn></Link>}
      />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Sessions" value={sessions.length} icon={Calendar} color="amber" />
        <StatCard label="Completed" value={completed} icon={CheckCircle} color="green" />
        <StatCard label="Rating" value={profile?.avgRating ? `${profile.avgRating.toFixed(1)}⭐` : "—"} icon={Star} color="purple" />
      </div>

      <Card>
        <div className="p-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="font-display font-bold text-sm" style={{ color: "var(--text)" }}>Upcoming Sessions</h2>
        </div>
        {upcoming.length === 0 ? (
          <Empty icon={Calendar} title="No upcoming sessions" desc="Sessions booked by candidates appear here." />
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {upcoming.map(s => (
              <div key={s._id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <Avatar name={s.candidate?.user?.name || "?"} size="sm" />
                  <div>
                    <p className="font-medium text-sm" style={{ color: "var(--text)" }}>{s.candidate?.user?.name}</p>
                    <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-3)" }}>
                      <Clock size={10} />
                      {s.scheduledAt ? format(new Date(s.scheduledAt), "MMM d, h:mm a") : "TBD"} · {s.durationMinutes}min
                    </p>
                  </div>
                </div>
                <Badge variant={s.status === "confirmed" ? "green" : "amber"}>{s.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
