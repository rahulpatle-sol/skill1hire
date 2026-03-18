"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function P() { const r = useRouter(); useEffect(() => r.push("/candidate/dashboard"), []); return null; }
