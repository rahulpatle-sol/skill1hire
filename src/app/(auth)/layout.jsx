import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[460px] shrink-0 relative overflow-hidden p-10"
        style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}>
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=70" alt="" fill className="object-cover opacity-10" style={{ filter: "grayscale(1)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, var(--surface) 0%, rgba(12,12,16,0.7) 50%, var(--surface) 100%)" }} />
        </div>
        <div className="relative z-10 flex flex-col h-full">
          <Link href="/" className="flex items-center gap-2.5 mb-auto">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-black text-sm" style={{ background: "var(--amber)", color: "#050507" }}>S1</div>
            <span className="font-display font-bold" style={{ color: "var(--text)" }}>Skill1 <span style={{ color: "var(--amber)" }}>Hire</span></span>
          </Link>
          <div className="mb-16">
            <h2 className="font-display font-black text-4xl leading-[1.1] mb-5" style={{ color: "var(--text)" }}>
              Where Proof<br />Meets<br /><span style={{ color: "var(--amber)" }}>Opportunity.</span>
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-2)" }}>
              Every candidate is assessed and verified before they can apply to a single job.
            </p>
            <div className="space-y-3">
              {["Skill assessments auto-scored", "Capstone project verification", "Blue tick badge on profile", "Curated job feed for verified talent"].map(f => (
                <div key={f} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-2)" }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--amber-dim)" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--amber)" }} />
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[420px]">
          <Link href="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-black text-sm" style={{ background: "var(--amber)", color: "#050507" }}>S1</div>
            <span className="font-display font-bold" style={{ color: "var(--text)" }}>Skill1 <span style={{ color: "var(--amber)" }}>Hire</span></span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
