// example: src/app/join/page.tsx
"use client";
import dynamic from "next/dynamic";
const ClientMeeting = dynamic(() => import("@/components/videosdk/ClientMeeting"), { ssr: false });

export default function JoinPage() {
  return (
    <div className="p-6">
      {/* <h1 className="text-xl font-semibold mb-4">Join</h1> */}
      <ClientMeeting mode="join" />
    </div>
  );
}
