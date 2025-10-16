"use client";

import { useEffect, useRef, useState } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";

interface StableMeetingProviderProps {
  token: string;
  config: {
    meetingId: string;
    name: string;
    micEnabled: boolean;
    webcamEnabled: boolean;
    debugMode: boolean;
  };
  children: React.ReactNode;
}

export default function StableMeetingProvider({ token, config, children }: StableMeetingProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const initRef = useRef(false);
  const tokenRef = useRef<string | null>(null);
  const configRef = useRef(config);

  // Update config ref when config changes
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Initialize only once per token
  useEffect(() => {
    if (token && token !== tokenRef.current && !initRef.current) {
      tokenRef.current = token;
      initRef.current = true;
      setIsInitialized(true);
    }
  }, [token]);

  // Reset initialization when token changes
  useEffect(() => {
    if (token !== tokenRef.current) {
      initRef.current = false;
      setIsInitialized(false);
    }
  }, [token]);

  if (!isInitialized || !token) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing meeting...</p>
        </div>
      </div>
    );
  }

  return (
    <MeetingProvider
      token={token}
      config={configRef.current}
    >
      {children}
    </MeetingProvider>
  );
}