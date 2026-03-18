"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminAPI } from "@/lib/api";
import { Card, Btn, Field, Badge, PageHdr, Skel, Tabs, Sel } from "@/components/ui";
import { Plus, Layers, ChevronDown, ChevronUp } from "lucide-react";

export default function AdminDomains() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("domains");
  const [expanded, setExpanded] = useState(null);
  const [adding, setAdding] = useState(false);
  const [dForm, setDForm] = useState({ name: "", description: "" });
  const [sForm, setSForm] = useState({ name: "", domain: "" });

  useEffect(() => { adminAPI.getDomains().then(({ data }) => { setDomains(data?.data?.domains || []); setLoading(false); }); }, []);

  const addDomain = async () => {
    if (!dForm.name) return toast.error("Name required");
    setAdding(true);
    try {
      const { data } = await adminAPI.createDomain({ ...dForm, slug: dForm.name.toLowerCase().replace(/\s+/g,"-") });
      setDomains(d => [...d, data?.data?.domain || data?.data]);
      setDForm({ name: "", description: "" }); toast.success("Domain created ✅");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setAdding(false); }
  };

  const addSkill = async () => {
    if (!sForm.name || !sForm.domain) return toast.error("Name and domain required");
    setAdding(true);
    try { await adminAPI.createSkill({ ...sForm, slug: sForm.name.toLowerCase().replace(/\s+/g,"-") }); toast.success("Skill created ✅"); setSForm({ name: "", domain: "" }); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setAdding(false); }
  };

  const TABS = [{ id: "domains", label: "Domains" }, { id: "skills", label: "Add Skill" }];
  if (loading) return <div><PageHdr title="Domains & Skills" /><Skel className="h-64" /></div>;

  return (
    <div>
      <PageHdr title="Domains & Skills" sub="Manage the platform taxonomy" />
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === "domains" && (
        <div className="space-y-4">
          <Card className="p-5">
            <p className="eyebrow mb-4">Create Domain</p>
            <div className="flex gap-3">
              <Field placeholder="e.g. Web Development" value={dForm.name} onChange={e => setDForm(d => ({ ...d, name: e.target.value }))} className="flex-1" />
              <Field placeholder="Description (optional)" value={dForm.description} onChange={e => setDForm(d => ({ ...d, description: e.target.value }))} className="flex-1" />
              <Btn onClick={addDomain} loading={adding} className="shrink-0"><Plus size={14} />Add</Btn>
            </div>
          </Card>
          <div className="space-y-2">
            {domains.map(d => (
              <Card key={d._id} className="overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 cursor-pointer" onClick={() => setExpanded(expanded === d._id ? null : d._id)}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--amber-dim)" }}><Layers size={14} style={{ color: "var(--amber)" }} /></div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{d.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-3)" }}>{d.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={d.isActive ? "green" : "dim"}>{d.isActive ? "Active" : "Inactive"}</Badge>
                    {expanded === d._id ? <ChevronUp size={14} style={{ color: "var(--text-3)" }} /> : <ChevronDown size={14} style={{ color: "var(--text-3)" }} />}
                  </div>
                </div>
                {expanded === d._id && d.skills?.length > 0 && (
                  <div className="px-5 pb-4 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                    <div className="flex flex-wrap gap-2">
                      {d.skills.map(s => <Badge key={s._id} variant="indigo">{s.name}</Badge>)}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
      {tab === "skills" && (
        <Card className="p-5 max-w-md">
          <p className="eyebrow mb-4">Add Skill to Domain</p>
          <div className="space-y-4">
            <Field label="Skill Name" placeholder="e.g. React.js" value={sForm.name} onChange={e => setSForm(s => ({ ...s, name: e.target.value }))} />
            <Sel label="Domain" value={sForm.domain} onChange={e => setSForm(s => ({ ...s, domain: e.target.value }))}>
              <option value="">Select domain</option>
              {domains.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </Sel>
            <Btn onClick={addSkill} loading={adding}><Plus size={14} />Add Skill</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}
