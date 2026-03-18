"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { mentorAPI } from "@/lib/api";
import { Card, Btn, Badge, Avatar, PageHdr, Skel, Empty, Tabs } from "@/components/ui";
import { Calendar, Clock, CheckCircle, XCircle, Star } from "lucide-react";
import { format } from "date-fns";

const SC = { pending: "amber", confirmed: "indigo", completed: "green", cancelled: "red" };

export default function MentorSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming");
  const [updating, setUpdating] = useState(null);
  const [ratingModal, setRatingModal] = useState(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  useEffect(() => { mentorAPI.getMySessions().then(({ data }) => { setSessions(data?.data?.sessions || []); setLoading(false); }); }, []);

  const update = async (id, status) => {
    setUpdating(id);
    try { await mentorAPI.updateSession(id, { status }); setSessions(s => s.map(x => x._id === id ? { ...x, status } : x)); toast.success(`Session ${status}`); }
    catch { toast.error("Failed"); }
    finally { setUpdating(null); }
  };

  const submitRating = async () => {
    try { await mentorAPI.rateSession(ratingModal, { rating, review }); toast.success("Rated ⭐"); setRatingModal(null); setRating(5); setReview(""); }
    catch { toast.error("Failed"); }
  };

  const TABS = [
    { id: "upcoming", label: "Upcoming", count: sessions.filter(s => ["pending","confirmed"].includes(s.status)).length },
    { id: "completed", label: "Completed", count: sessions.filter(s => s.status === "completed").length },
    { id: "all", label: "All", count: sessions.length },
  ];
  const filtered = tab === "upcoming" ? sessions.filter(s => ["pending","confirmed"].includes(s.status)) : tab === "completed" ? sessions.filter(s => s.status === "completed") : sessions;

  if (loading) return <div><PageHdr title="Sessions" /><div className="space-y-3">{[...Array(4)].map((_, i) => <Skel key={i} className="h-24" />)}</div></div>;

  return (
    <div>
      <PageHdr title="My Sessions" sub="Manage your mentoring schedule" />
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {filtered.length === 0 ? <Empty icon={Calendar} title="No sessions" desc="Sessions booked by candidates appear here." /> : (
        <div className="space-y-3">
          {filtered.map(s => (
            <Card key={s._id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={s.candidate?.user?.name || "?"} size="md" />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{s.candidate?.user?.name}</p>
                    <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--text-3)" }}>
                      <Clock size={10} />{s.scheduledAt ? format(new Date(s.scheduledAt), "MMM d, h:mm a") : "TBD"} · {s.durationMinutes}min
                    </p>
                    {s.topic && <p className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>{s.topic}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <Badge variant={SC[s.status] || "dim"}>{s.status}</Badge>
                  {s.status === "pending" && (
                    <div className="flex gap-1.5">
                      <Btn size="sm" loading={updating === s._id} onClick={() => update(s._id, "confirmed")}><CheckCircle size={11} />Accept</Btn>
                      <Btn variant="danger" size="sm" onClick={() => update(s._id, "cancelled")}><XCircle size={11} />Decline</Btn>
                    </div>
                  )}
                  {s.status === "confirmed" && <Btn size="sm" loading={updating === s._id} onClick={() => update(s._id, "completed")}><CheckCircle size={11} />Complete</Btn>}
                  {s.status === "completed" && !s.mentorRating && <Btn variant="secondary" size="sm" onClick={() => setRatingModal(s._id)}><Star size={11} />Rate</Btn>}
                </div>
              </div>
              {s.amount && <div className="mt-3 pt-3 flex justify-between text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--text-3)" }}><span>Session fee</span><span className="font-bold" style={{ color: "var(--amber)" }}>₹{s.amount}</span></div>}
            </Card>
          ))}
        </div>
      )}
      {ratingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <Card className="w-full max-w-sm p-6">
            <h3 className="font-display font-bold text-lg mb-4" style={{ color: "var(--text)" }}>Rate Session</h3>
            <div className="flex gap-2 mb-4">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setRating(n)} className="text-3xl transition-transform hover:scale-110"
                  style={{ color: n <= rating ? "#fbbf24" : "rgba(255,255,255,0.1)" }}>★</button>
              ))}
            </div>
            <textarea value={review} onChange={e => setReview(e.target.value)} placeholder="Leave a review..." rows={3} className="input w-full mb-4 resize-none" />
            <div className="flex gap-2">
              <Btn className="flex-1" onClick={submitRating}>Submit</Btn>
              <Btn variant="secondary" onClick={() => setRatingModal(null)}>Cancel</Btn>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
