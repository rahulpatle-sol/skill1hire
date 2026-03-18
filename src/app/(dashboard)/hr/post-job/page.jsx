"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { hrAPI, adminAPI } from "@/lib/api";
import { Card, Btn, Field, TextArea, Sel, PageHdr } from "@/components/ui";

export default function PostJob() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => { adminAPI.getDomains().then(({ data }) => setDomains(data?.data?.domains || [])).catch(() => {}); }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await hrAPI.postJob({ ...data, salaryRange: { min: +data.salaryMin * 100000, max: +data.salaryMax * 100000, currency: "INR" }, requiresVerification: data.requiresVerification === "true" });
      toast.success("Job posted! 🚀");
      router.push("/hr/jobs");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageHdr title="Post a Job" sub="Attract verified, pre-assessed candidates" />
      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <p className="eyebrow mb-4">Job Details</p>
            <div className="space-y-4">
              <Field label="Job Title *" placeholder="Senior React Developer" error={errors.title?.message} {...register("title", { required: "Required" })} />
              <TextArea label="Description *" placeholder="Responsibilities, requirements, what success looks like..." rows={5} error={errors.description?.message} {...register("description", { required: "Required" })} />
              <div className="grid grid-cols-2 gap-4">
                <Sel label="Domain" {...register("domain")}><option value="">Select domain</option>{domains.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}</Sel>
                <Field label="Location" placeholder="Mumbai / Remote" {...register("location")} />
              </div>
            </div>
          </div>
          <div>
            <p className="eyebrow mb-4">Job Type</p>
            <div className="grid grid-cols-2 gap-4">
              <Sel label="Work Mode *" error={errors.workMode?.message} {...register("workMode", { required: true })}><option value="">Select</option><option value="remote">Remote</option><option value="onsite">Onsite</option><option value="hybrid">Hybrid</option></Sel>
              <Sel label="Job Type *" error={errors.jobType?.message} {...register("jobType", { required: true })}><option value="">Select</option><option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="contract">Contract</option><option value="internship">Internship</option></Sel>
              <Sel label="Experience Level" {...register("experienceLevel")}><option value="">Select</option><option value="fresher">Fresher</option><option value="junior">Junior</option><option value="mid">Mid-level</option><option value="senior">Senior</option></Sel>
              <Sel label="Requires Verification?" {...register("requiresVerification")}><option value="true">Yes — Verified Only</option><option value="false">No — All Candidates</option></Sel>
            </div>
          </div>
          <div>
            <p className="eyebrow mb-4">Salary (LPA)</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Min (Lakhs)" type="number" placeholder="8" {...register("salaryMin")} />
              <Field label="Max (Lakhs)" type="number" placeholder="18" {...register("salaryMax")} />
            </div>
          </div>
          <Field label="Application Deadline" type="date" {...register("applicationDeadline")} />
          <div className="flex justify-end gap-3">
            <Btn variant="secondary" type="button" onClick={() => router.back()}>Cancel</Btn>
            <Btn type="submit" loading={loading} size="lg">Post Job 🚀</Btn>
          </div>
        </form>
      </Card>
    </div>
  );
}
