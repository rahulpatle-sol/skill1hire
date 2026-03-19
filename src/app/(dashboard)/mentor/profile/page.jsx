"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mentorAPI, adminAPI } from "@/lib/api";
import { Card, Btn, Field, TextArea, PageHdr, Badge, Tabs, Skel } from "@/components/ui";
import { Plus, X, Star, Linkedin, Github, Globe } from "lucide-react";

export default function MentorProfile() {
  const [profile, setProfile] = useState(null);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("basic");
  const [expertise, setExpertise] = useState([]);
  const [newExp, setNewExp] = useState("");
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    Promise.all([mentorAPI.getProfile(), adminAPI.getDomains()])
      .then(([p, d]) => {
        const prof = p.data?.data?.profile || p.data?.data;
        setProfile(prof);
        setExpertise(prof?.expertise || []);
        setDomains(d.data?.data?.domains || []);
        reset({
          bio: prof?.bio,
          yearsOfExperience: prof?.yearsOfExperience,
          currentRole: prof?.currentRole,
          currentCompany: prof?.currentCompany,
          linkedin: prof?.socialLinks?.linkedin,
          github: prof?.socialLinks?.github,
          thirtyMin: prof?.sessionRates?.thirtyMin,
          sixtyMin: prof?.sessionRates?.sixtyMin,
          ninetyMin: prof?.sessionRates?.ninetyMin,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const onSave = async (data) => {
    setSaving(true);
    try {
      await mentorAPI.updateProfile({
        bio: data.bio,
        yearsOfExperience: Number(data.yearsOfExperience) || 0,
        currentRole: data.currentRole,
        currentCompany: data.currentCompany,
        expertise,
        socialLinks: { linkedin: data.linkedin, github: data.github },
        sessionRates: {
          thirtyMin: Number(data.thirtyMin) || 0,
          sixtyMin: Number(data.sixtyMin) || 0,
          ninetyMin: Number(data.ninetyMin) || 0,
        },
      });
      toast.success("Profile updated! ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const addExpertise = () => {
    const t = newExp.trim();
    if (t && !expertise.includes(t)) {
      setExpertise(prev => [...prev, t]);
      setNewExp("");
    }
  };

  const TABS = [
    { id: "basic", label: "About Me" },
    { id: "expertise", label: "Expertise" },
    { id: "rates", label: "Session Rates" },
  ];

  if (loading) return (
    <div>
      <PageHdr title="My Profile" />
      <Skel className="h-10 mb-6" />
      <Skel className="h-80" />
    </div>
  );

  return (
    <div>
      <PageHdr
        title="My Mentor Profile"
        sub="This is what candidates see when booking sessions"
        action={
          profile?.avgRating > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
              style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <Star size={14} className="fill-amber-400" style={{ color: "var(--amber)" }} />
              <span className="text-sm font-bold" style={{ color: "var(--amber)" }}>
                {profile.avgRating.toFixed(1)}
              </span>
              {profile.totalReviews > 0 && (
                <span className="text-xs" style={{ color: "var(--text-2)" }}>
                  ({profile.totalReviews} reviews)
                </span>
              )}
            </div>
          )
        }
      />

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <form onSubmit={handleSubmit(onSave)}>

        {/* ── Basic Info ── */}
        {tab === "basic" && (
          <Card className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Current Role"
                placeholder="Senior Engineer"
                {...register("currentRole")}
              />
              <Field
                label="Company"
                placeholder="Google, Razorpay..."
                {...register("currentCompany")}
              />
            </div>
            <Field
              label="Years of Experience"
              type="number"
              placeholder="5"
              {...register("yearsOfExperience")}
            />
            <TextArea
              label="Bio"
              placeholder="Tell candidates about yourself — your journey, what you can help with, your teaching style..."
              rows={5}
              {...register("bio")}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Linkedin size={16} style={{ color: "var(--text-3)" }} className="shrink-0" />
                <Field
                  label="LinkedIn URL"
                  placeholder="https://linkedin.com/in/you"
                  {...register("linkedin")}
                />
              </div>
              <div className="flex items-center gap-3">
                <Github size={16} style={{ color: "var(--text-3)" }} className="shrink-0" />
                <Field
                  label="GitHub URL"
                  placeholder="https://github.com/you"
                  {...register("github")}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Btn type="submit" loading={saving}>Save Profile</Btn>
            </div>
          </Card>
        )}

        {/* ── Expertise ── */}
        {tab === "expertise" && (
          <Card className="p-6">
            <p className="text-sm mb-5" style={{ color: "var(--text-2)" }}>
              Add your areas of expertise — candidates use this to find the right mentor.
            </p>

            <div className="flex gap-3 mb-5">
              <Field
                placeholder="e.g. React.js, System Design, DSA..."
                value={newExp}
                onChange={e => setNewExp(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addExpertise())}
              />
              <Btn type="button" onClick={addExpertise} className="shrink-0">
                <Plus size={14} /> Add
              </Btn>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[60px]">
              {expertise.length === 0 && (
                <p className="text-sm" style={{ color: "var(--text-3)" }}>
                  No expertise added yet. Add some above!
                </p>
              )}
              {expertise.map(e => (
                <span key={e}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium"
                  style={{ background: "var(--amber-dim)", border: "1px solid rgba(245,158,11,0.2)", color: "var(--amber)" }}>
                  {e}
                  <button
                    type="button"
                    onClick={() => setExpertise(prev => prev.filter(x => x !== e))}
                    className="transition-opacity hover:opacity-60">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Btn type="submit" loading={saving}>Save Expertise</Btn>
            </div>
          </Card>
        )}

        {/* ── Session Rates ── */}
        {tab === "rates" && (
          <Card className="p-6">
            <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>
              Set your session rates in INR (₹). Candidates see these before booking.
            </p>

            <div className="space-y-4 max-w-sm">
              {[
                { label: "30 minutes", field: "thirtyMin", placeholder: "500" },
                { label: "60 minutes", field: "sixtyMin", placeholder: "900" },
                { label: "90 minutes", field: "ninetyMin", placeholder: "1200" },
              ].map(({ label, field, placeholder }) => (
                <div key={field} className="flex items-center gap-4">
                  <div className="w-28 shrink-0">
                    <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{label}</p>
                  </div>
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm"
                      style={{ color: "var(--text-3)" }}>₹</span>
                    <input
                      type="number"
                      placeholder={placeholder}
                      className="input w-full"
                      style={{ paddingLeft: "28px" }}
                      {...register(field)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Preview card */}
            <div className="mt-6 p-4 rounded-2xl max-w-sm"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "var(--text-3)" }}>Preview</p>
              <div className="space-y-2">
                {[
                  { label: "30 min session", key: "thirtyMin" },
                  { label: "60 min session", key: "sixtyMin" },
                  { label: "90 min session", key: "ninetyMin" },
                ].map(({ label, key }) => (
                  <div key={key} className="flex justify-between items-center text-sm">
                    <span style={{ color: "var(--text-2)" }}>{label}</span>
                    <span className="font-bold" style={{ color: "var(--amber)" }}>
                      ₹{profile?.sessionRates?.[key] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Btn type="submit" loading={saving}>Save Rates</Btn>
            </div>
          </Card>
        )}
      </form>
    </div>
  );
}