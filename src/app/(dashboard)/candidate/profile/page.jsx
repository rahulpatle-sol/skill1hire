"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { candidateAPI } from "@/lib/api";
import { Card, Btn, Field, TextArea, Badge, PageHdr, Tabs, Skel, Progress } from "@/components/ui";
import { Github, Linkedin, Globe, Plus, X, ShieldCheck, ExternalLink } from "lucide-react";

export default function CandidateProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("basic");
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    candidateAPI.getProfile().then(({ data }) => {
      const p = data?.data?.profile || data?.data;
      setProfile(p);
      reset({ headline: p?.headline, bio: p?.bio, location: p?.location, phone: p?.phone, linkedin: p?.socialLinks?.linkedin, github: p?.socialLinks?.github, portfolio: p?.socialLinks?.portfolio });
      setLoading(false);
    });
  }, []);

  const onSave = async (data) => {
    setSaving(true);
    try {
      const { linkedin, github, portfolio, ...basic } = data;
      await Promise.all([
        candidateAPI.updateProfile(basic),
        candidateAPI.updateSocialLinks({ linkedin, github, portfolio }),
      ]);
      toast.success("Profile saved ✅");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  const onCapstone = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    setSaving(true);
    try {
      await candidateAPI.submitCapstone({ title: fd.get("title"), description: fd.get("description"), repoUrl: fd.get("repoUrl"), liveUrl: fd.get("liveUrl") });
      toast.success("Capstone submitted! 🚀");
      const { data } = await candidateAPI.getProfile();
      setProfile(data?.data?.profile || data?.data);
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  const TABS = [{ id: "basic", label: "Basic Info" }, { id: "social", label: "Social Links" }, { id: "capstone", label: "Capstone" }];

  if (loading) return <div><PageHdr title="My Profile" /><Skel className="h-10 mb-6" /><Skel className="h-72" /></div>;

  return (
    <div>
      <PageHdr title="My Profile" sub="Build your verified public profile"
        action={profile?.publicSlug && <a href={`/candidate/public/${profile.publicSlug}`} target="_blank"><Btn variant="secondary" size="sm"><ExternalLink size={13} /> View Public</Btn></a>}
      />

      {/* Completeness */}
      <Card className="p-4 mb-6 flex items-center gap-5">
        <div className="flex-1">
          <Progress value={profile?.profileCompleteness || 0} label="Profile Completeness" color="amber" />
        </div>
        {profile?.isVerified && <Badge variant="green"><ShieldCheck size={10} /> Verified</Badge>}
      </Card>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "basic" && (
        <Card className="p-6">
          <form onSubmit={handleSubmit(onSave)} className="space-y-5">
            <Field label="Headline" placeholder="e.g. Full Stack Developer | React + Node" {...register("headline")} />
            <TextArea label="Bio" placeholder="Tell employers about yourself..." rows={4} {...register("bio")} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Location" placeholder="Mumbai, India" {...register("location")} />
              <Field label="Phone" placeholder="+91 9876543210" {...register("phone")} />
            </div>
            <div className="flex justify-end"><Btn type="submit" loading={saving}>Save Changes</Btn></div>
          </form>
        </Card>
      )}

      {tab === "social" && (
        <Card className="p-6">
          <form onSubmit={handleSubmit(onSave)} className="space-y-4">
            {[
              { icon: Linkedin, label: "LinkedIn URL", name: "linkedin", placeholder: "https://linkedin.com/in/you" },
              { icon: Github, label: "GitHub URL", name: "github", placeholder: "https://github.com/you" },
              { icon: Globe, label: "Portfolio URL", name: "portfolio", placeholder: "https://yoursite.dev" },
            ].map(({ icon: Icon, label, name, placeholder }) => (
              <div key={name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }}>
                  <Icon size={15} style={{ color: "var(--text-2)" }} />
                </div>
                <Field label={label} placeholder={placeholder} inputClass="!mt-0" {...register(name)} className="flex-1" />
              </div>
            ))}
            <div className="flex justify-end"><Btn type="submit" loading={saving}>Save Links</Btn></div>
          </form>
        </Card>
      )}

      {tab === "capstone" && (
        <Card className="p-6">
          {profile?.capstoneProject?.status && profile.capstoneProject.status !== "not_submitted" ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-base" style={{ color: "var(--text)" }}>{profile.capstoneProject.title}</h3>
                <Badge variant={profile.capstoneProject.status === "approved" ? "green" : "amber"}>
                  {profile.capstoneProject.status.replace("_", " ")}
                </Badge>
              </div>
              <p className="text-sm mb-5" style={{ color: "var(--text-2)" }}>{profile.capstoneProject.description}</p>
              <div className="flex gap-3">
                {profile.capstoneProject.repoUrl && <a href={profile.capstoneProject.repoUrl} target="_blank"><Btn variant="secondary" size="sm"><Github size={13} />Repo</Btn></a>}
                {profile.capstoneProject.liveUrl && <a href={profile.capstoneProject.liveUrl} target="_blank"><Btn variant="secondary" size="sm"><ExternalLink size={13} />Live</Btn></a>}
              </div>
            </div>
          ) : (
            <form onSubmit={onCapstone} className="space-y-4">
              <div className="p-4 rounded-2xl text-sm" style={{ background: "var(--amber-dim)", border: "1px solid rgba(245,158,11,0.2)", color: "var(--amber)" }}>
                🎯 Submit your best project to unlock verification and access the job feed.
              </div>
              <Field label="Project Title" name="title" placeholder="E-Commerce Platform" required />
              <TextArea label="Description" name="description" placeholder="What does it do? Tech stack used?" required />
              <Field label="GitHub / Repo URL" name="repoUrl" placeholder="https://github.com/you/project" required />
              <Field label="Live URL (optional)" name="liveUrl" placeholder="https://project.vercel.app" />
              <div className="flex justify-end"><Btn type="submit" loading={saving}>Submit for Review 🚀</Btn></div>
            </form>
          )}
        </Card>
      )}
    </div>
  );
}
