"use client";

import { useState } from "react";
import { useCommunity, useIsCommunityAdmin } from "@/hooks/useCoopData";
import { RecordsList } from "@/components/records/RecordsList";
import { SubmitRecordModal } from "@/components/records/SubmitRecordModal";
import { MemberManagement } from "@/components/community/MemberManagement";
import { useStacks } from "@/contexts/StacksProvider";

interface CommunityDashboardProps {
  communityId: number;
}

export function CommunityDashboard({ communityId }: CommunityDashboardProps) {
  const { address } = useStacks();
  const { data: community, isLoading } = useCommunity(communityId);
  const { data: isAdmin } = useIsCommunityAdmin(communityId, address || "");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  if (isLoading) {
    return <div className="text-white text-center p-8">Loading community...</div>;
  }

  if (!community) {
    return <div className="text-red-400 text-center p-8">Community not found.</div>;
  }

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto px-4 pb-20">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
            <h3 className="text-orange-200 text-sm uppercase tracking-wide mb-1">Total Donations</h3>
            <p className="text-3xl font-bold text-white">
                {(community.totalDonations / 1_000_000).toLocaleString()} <span className="text-lg text-orange-500/60">STX</span>
            </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
            <h3 className="text-blue-200 text-sm uppercase tracking-wide mb-1">Total Spending</h3>
            <p className="text-3xl font-bold text-white">
                {(community.totalSpending / 1_000_000).toLocaleString()} <span className="text-lg text-blue-500/60">STX</span>
            </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-1">Members</h3>
            <p className="text-3xl font-bold text-white">{community.memberCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Records */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Recent Records</h2>
              <button 
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Submit Record
              </button>
          </div>
          
          <RecordsList communityId={communityId} />
        </div>

        {/* Sidebar - Management */}
        <div className="space-y-6">
          {isAdmin && <MemberManagement communityId={communityId} />}
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">About Community</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              This ledger is secured by Bitcoin via the Stacks blockchain. All records submitted are immutable and verifiable by any member of the community.
            </p>
          </div>
        </div>
      </div>

      <SubmitRecordModal 
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        communityId={communityId}
      />
    </div>
  );
}
