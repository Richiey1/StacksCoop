"use client";

import { useState, Suspense } from "react";
import { CommunityDashboard } from "@/components/community/CommunityDashboard";
import { useStacks } from "@/contexts/StacksProvider";
import { CONTRACT_ADDRESS } from "@/lib/stacksConfig";

function HomeContent() {
  const { address } = useStacks();
  const [activeCommunityId, setActiveCommunityId] = useState<number>(1); // Default to community 1 for MVP

  return (
    <div 
      className="min-h-screen flex flex-col items-center px-2 sm:px-4 pt-16 sm:pt-20 pb-8 sm:pb-12 md:pt-24 md:pb-20 relative overflow-hidden"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Blur overlay with dark gradient */}
      <div 
        className="absolute inset-0 backdrop-blur-xl"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.85) 100%)',
        }}
      ></div>
      
      {/* Content with proper z-index */}
      <div className="relative z-10 max-w-7xl w-full space-y-6 sm:space-y-8 mt-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Community <span className="text-orange-500">Ledger</span>
            </h1>
            <p className="text-gray-400 max-w-2xl text-lg">
                Transparent, immutable, and verifiable records for your community organization.
                Anchored on Bitcoin via Stacks.
            </p>
        </div>

        <CommunityDashboard communityId={activeCommunityId} />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <HomeContent />
    </Suspense>
  );
}
