//src/app/host/page.tsx
"use client";
import dynamic from "next/dynamic";
const ClientMeeting = dynamic(() => import("../meeting/ClientMeeting"), { ssr: false });
export default function HostPage() {
  return <ClientMeeting mode="host" />;
}
