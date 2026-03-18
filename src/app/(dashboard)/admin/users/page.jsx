"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminAPI } from "@/lib/api";
import { Card, Btn, Badge, Avatar, PageHdr, Skel } from "@/components/ui";
import { Search, ShieldCheck, UserX, UserCheck } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    const p = { limit: 50, ...(roleFilter !== "all" && { role: roleFilter }) };
    adminAPI.getAllUsers(p).then(({ data }) => { setUsers(data?.data?.users || []); setLoading(false); });
  }, [roleFilter]);

  const toggle = async (id) => {
    setToggling(id);
    try { await adminAPI.toggleUserActive(id); setUsers(u => u.map(x => x._id === id ? { ...x, isActive: !x.isActive } : x)); toast.success("Updated"); }
    catch { toast.error("Failed"); }
    finally { setToggling(null); }
  };

  const RC = { candidate: "amber", hr: "indigo", mentor: "purple", admin: "red" };
  const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHdr title="Users" sub={`${users.length} total`} />
      <Card className="p-4 mb-5 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-3)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="input input-icon w-full !py-2.5" />
        </div>
        <div className="flex gap-2">
          {["all","candidate","hr","mentor"].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all"
              style={{ background: roleFilter === r ? "var(--amber)" : "rgba(255,255,255,0.05)", color: roleFilter === r ? "#050507" : "var(--text-2)" }}>
              {r}
            </button>
          ))}
        </div>
      </Card>
      {loading ? <div className="space-y-2">{[...Array(6)].map((_, i) => <Skel key={i} className="h-16" />)}</div> : (
        <Card>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {filtered.map(u => (
              <div key={u._id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={u.name || "?"} size="sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{u.name}</p>
                      {u.isVerified && <ShieldCheck size={12} style={{ color: "var(--amber)" }} />}
                    </div>
                    <p className="text-xs truncate" style={{ color: "var(--text-3)" }}>{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <Badge variant={RC[u.role] || "dim"}>{u.role}</Badge>
                  <Badge variant={u.isActive ? "green" : "red"}>{u.isActive ? "Active" : "Inactive"}</Badge>
                  <Btn variant="secondary" size="sm" loading={toggling === u._id} onClick={() => toggle(u._id)}>
                    {u.isActive ? <UserX size={12} /> : <UserCheck size={12} />}
                    {u.isActive ? "Deactivate" : "Activate"}
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
