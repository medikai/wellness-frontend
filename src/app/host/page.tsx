//  src/app/host/page.tsx
// "use client";
// import dynamic from "next/dynamic";
// const ClientMeeting = dynamic(() => import("@/components/videosdk/ClientMeeting"), { ssr: false });

// export default function HostPage() {
//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-semibold mb-4">Join</h1>
//       <ClientMeeting mode="host" />
//     </div>
//   );
// }


// src/app/host/page.tsx
// "use client";
// import dynamic from "next/dynamic";
// const ClientMeeting = dynamic(() => import("@/components/videosdk/ClientMeeting"), { ssr: false });
// export default function Host() { return <ClientMeeting mode="host" />; }


//  src/app/host/page.tsx
import React from 'react'
// import HelpTemplates from '@/modules/help/templates'
import ClientMeeting from '@/components/videosdk/ClientMeeting'

export default function HelpPage() {
  return <ClientMeeting mode="host" />
}