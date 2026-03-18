"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminAPI } from "@/lib/api";
import { Card, Btn, Field, Badge, PageHdr, Skel, Sel } from "@/components/ui";
import { Plus, Trash2, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

const emptyQ = () => ({ questionText: "", options: ["","","",""], correctAnswer: 0, marks: 1 });

export default function AdminAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [form, setForm] = useState({ title: "", domain: "", level: "beginner", durationMinutes: 30, passingScore: 60, questions: [emptyQ()] });

  useEffect(() => {
    Promise.all([adminAPI.getAssessments(), adminAPI.getDomains()]).then(([a, d]) => {
      setAssessments(a.data?.data?.assessments || []); setDomains(d.data?.data?.domains || []);
    }).finally(() => setLoading(false));
  }, []);

  const updateQ = (i, k, v) => setForm(f => { const qs = [...f.questions]; qs[i] = { ...qs[i], [k]: v }; return { ...f, questions: qs }; });
  const updateOpt = (qi, oi, v) => setForm(f => { const qs = [...f.questions]; const opts = [...qs[qi].options]; opts[oi] = v; qs[qi] = { ...qs[qi], options: opts }; return { ...f, questions: qs }; });

  const create = async () => {
    if (!form.title || !form.domain) return toast.error("Title and domain required");
    if (form.questions.some(q => !q.questionText)) return toast.error("Fill all questions");
    setCreating(true);
    try {
      const { data } = await adminAPI.createAssessment(form);
      setAssessments(a => [...a, data?.data?.assessment || data?.data]);
      setForm({ title: "", domain: "", level: "beginner", durationMinutes: 30, passingScore: 60, questions: [emptyQ()] });
      toast.success("Assessment created 🎉");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setCreating(false); }
  };

  const LV = { beginner: "green", intermediate: "amber", advanced: "red" };
  if (loading) return <div><PageHdr title="Assessments" /><Skel className="h-64" /></div>;

  return (
    <div>
      <PageHdr title="Assessments" sub="Create tests for candidates" />
      <Card className="p-6 mb-6">
        <p className="eyebrow mb-5">Create New Assessment</p>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <Field label="Title" placeholder="React.js Fundamentals" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <Sel label="Domain" value={form.domain} onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}><option value="">Select</option>{domains.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}</Sel>
          <Sel label="Level" value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></Sel>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Duration (min)" type="number" value={form.durationMinutes} onChange={e => setForm(f => ({ ...f, durationMinutes: +e.target.value }))} />
            <Field label="Pass %" type="number" value={form.passingScore} onChange={e => setForm(f => ({ ...f, passingScore: +e.target.value }))} />
          </div>
        </div>
        <div className="space-y-4 mb-5">
          {form.questions.map((q, qi) => (
            <div key={qi} className="p-4 rounded-2xl" style={{ border: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="eyebrow">Question {qi + 1}</span>
                {form.questions.length > 1 && <button onClick={() => setForm(f => ({ ...f, questions: f.questions.filter((_,i) => i !== qi) }))} style={{ color: "#fca5a5" }}><Trash2 size={13} /></button>}
              </div>
              <Field placeholder="Question text..." value={q.questionText} onChange={e => updateQ(qi, "questionText", e.target.value)} className="mb-3" />
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer === oi} onChange={() => updateQ(qi, "correctAnswer", oi)} style={{ accentColor: "var(--amber)" }} />
                    <Field placeholder={`Option ${String.fromCharCode(65+oi)}`} value={opt} onChange={e => updateOpt(qi, oi, e.target.value)} />
                  </div>
                ))}
              </div>
              <p className="text-xs mt-2" style={{ color: "var(--text-3)" }}>🔘 = correct answer</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Btn variant="secondary" onClick={() => setForm(f => ({ ...f, questions: [...f.questions, emptyQ()] }))}><Plus size={13} />Add Question</Btn>
          <Btn onClick={create} loading={creating}>Create Assessment</Btn>
        </div>
      </Card>

      <div className="space-y-3">
        {assessments.map(a => (
          <Card key={a._id} className="overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 cursor-pointer" onClick={() => setExpanded(expanded === a._id ? null : a._id)}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--amber-dim)" }}><BookOpen size={15} style={{ color: "var(--amber)" }} /></div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{a.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>{a.domain?.name} · {a.questions?.length} Qs · {a.durationMinutes}min</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={LV[a.level] || "dim"}>{a.level}</Badge>
                {expanded === a._id ? <ChevronUp size={13} style={{ color: "var(--text-3)" }} /> : <ChevronDown size={13} style={{ color: "var(--text-3)" }} />}
              </div>
            </div>
            {expanded === a._id && a.questions?.length > 0 && (
              <div className="px-5 pb-4 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="space-y-2">
                  {a.questions.map((q, i) => (
                    <div key={i} className="text-sm px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", color: "var(--text-2)" }}>
                      <span className="font-bold mr-2" style={{ color: "var(--amber)" }}>Q{i+1}.</span>{q.questionText}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
