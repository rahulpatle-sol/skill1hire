"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { candidateAPI } from "@/lib/api";
import { Card, Btn, Badge, PageHdr, Skel, Empty, Progress } from "@/components/ui";
import { BookOpen, CheckCircle, ChevronRight, Trophy, Target, X, Zap } from "lucide-react";
import { clsx } from "clsx";

export default function Assessments() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [t0, setT0] = useState(null);

  useEffect(() => {
    candidateAPI.getAssessments()
      .then(({ data }) => setList(data?.data?.assessments || []))
      .finally(() => setLoading(false));
  }, []);

  const start = async (id) => {
    try {
      const { data } = await candidateAPI.getAssessmentById(id);
      setActive(data?.data?.assessment || data?.data);
      setAnswers({}); setResult(null); setT0(Date.now());
    } catch { toast.error("Failed to load"); }
  };

  const submit = async () => {
    const total = active.questions?.length;
    if (Object.keys(answers).length < total) { toast.error(`Answer all ${total} questions first`); return; }
    setSubmitting(true);
    try {
      const ans = Object.entries(answers).map(([qi, sel]) => ({ questionIndex: +qi, selectedOption: +sel }));
      const { data } = await candidateAPI.submitAssessment(active._id, { answers: ans, timeTakenMinutes: Math.ceil((Date.now() - t0) / 60000) });
      setResult(data?.data?.result || data?.data);
      const updated = await candidateAPI.getAssessments();
      setList(updated.data?.data?.assessments || []);
    } catch { toast.error("Submit failed"); }
    finally { setSubmitting(false); }
  };

  const levelBadge = { beginner: "green", intermediate: "amber", advanced: "red" };

  // Result screen
  if (result) return (
    <div className="max-w-md mx-auto mt-16 text-center">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ background: result.isPassed ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.1)" }}>
        {result.isPassed ? <Trophy size={36} style={{ color: "#34d399" }} /> : <Target size={36} style={{ color: "#fca5a5" }} />}
      </div>
      <h2 className="font-display font-black text-3xl mb-2" style={{ color: "var(--text)" }}>
        {result.isPassed ? "Assessment Passed! 🎉" : "Not Quite"}
      </h2>
      <p className="mb-8" style={{ color: "var(--text-2)" }}>You scored <strong style={{ color: "var(--text)" }}>{result.totalMarksObtained}/{result.totalMarks}</strong> marks</p>
      <Card className="p-6 text-left mb-6">
        <Progress value={result.percentageScore} label="Your Score" color={result.isPassed ? "green" : "amber"} />
        <div className="mt-4 flex items-center justify-between text-sm">
          <span style={{ color: "var(--text-2)" }}>Status</span>
          <Badge variant={result.isPassed ? "green" : "red"}>{result.isPassed ? "PASSED ✓" : "FAILED"}</Badge>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span style={{ color: "var(--text-2)" }}>Attempt</span>
          <span className="font-bold" style={{ color: "var(--text)" }}>#{result.attemptNumber}</span>
        </div>
      </Card>
      <Btn onClick={() => { setActive(null); setResult(null); }} className="w-full">Back to Assessments</Btn>
    </div>
  );

  // Assessment taking screen
  if (active) return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-lg" style={{ color: "var(--text)" }}>{active.title}</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>{active.questions?.length} questions · {active.durationMinutes} mins</p>
        </div>
        <button onClick={() => setActive(null)} className="transition-colors" style={{ color: "var(--text-3)" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}>
          <X size={20} />
        </button>
      </div>
      <Progress value={Object.keys(answers).length} max={active.questions?.length} label="Progress" color="amber" />
      <div className="space-y-4 mt-6">
        {active.questions?.map((q, qi) => (
          <Card key={qi} className="p-5">
            <p className="text-sm font-medium mb-4" style={{ color: "var(--text)" }}>
              <span className="font-black mr-2" style={{ color: "var(--amber)" }}>Q{qi + 1}.</span>{q.questionText}
            </p>
            <div className="space-y-2">
              {q.options?.map((opt, oi) => (
                <button key={oi} onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))}
                  className="w-full text-left px-4 py-3 rounded-2xl text-sm transition-all duration-150"
                  style={{
                    background: answers[qi] === oi ? "var(--amber-dim)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${answers[qi] === oi ? "rgba(245,158,11,0.4)" : "var(--border)"}`,
                    color: answers[qi] === oi ? "var(--amber)" : "var(--text-2)",
                    fontWeight: answers[qi] === oi ? 600 : 400,
                  }}>
                  <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <div className="sticky bottom-4 mt-6">
        <Btn onClick={submit} loading={submitting} className="w-full" size="lg">
          Submit ({Object.keys(answers).length}/{active.questions?.length} answered)
        </Btn>
      </div>
    </div>
  );

  if (loading) return <div><PageHdr title="Assessments" /><div className="grid grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <Skel key={i} className="h-40" />)}</div></div>;

  return (
    <div>
      <PageHdr title="Assessments" sub="Pass skill tests to earn your verified badge" />
      {list.length === 0 ? (
        <Empty icon={BookOpen} title="No assessments yet" desc="Update your profile with skills to unlock domain tests." cta={<Btn onClick={() => window.location.href = "/candidate/profile"}>Update Skills</Btn>} />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {list.map(a => (
            <Card key={a._id} hover className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "var(--amber-dim)" }}>
                  <BookOpen size={18} style={{ color: "var(--amber)" }} />
                </div>
                <div className="flex gap-2">
                  <Badge variant={levelBadge[a.level] || "dim"}>{a.level}</Badge>
                  {a.isCompleted && <Badge variant={a.myResult?.isPassed ? "green" : "red"}>{a.myResult?.isPassed ? "Passed" : "Failed"}</Badge>}
                </div>
              </div>
              <h3 className="font-display font-bold text-base mb-1" style={{ color: "var(--text)" }}>{a.title}</h3>
              <p className="text-xs mb-4" style={{ color: "var(--text-2)" }}>{a.domain?.name} · {a.questions?.length} Qs · {a.durationMinutes} mins</p>
              {a.isCompleted && a.myResult && (
                <div className="mb-4"><Progress value={a.myResult.percentageScore} color={a.myResult.isPassed ? "green" : "amber"} label={`Your score: ${a.myResult.percentageScore}%`} /></div>
              )}
              <Btn onClick={() => start(a._id)} variant={a.isCompleted && a.myResult?.isPassed ? "secondary" : "primary"} size="sm" className="w-full">
                {a.isCompleted ? "Retake Test" : "Start Assessment"} <ChevronRight size={13} />
              </Btn>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
