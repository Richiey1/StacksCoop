"use client";

import { useMember } from "@/hooks/useCoopData";
import { User, Shield, Info } from "lucide-react";

interface MemberItemProps {
  communityId: number;
  address: string;
}

export function MemberItem({ communityId, address }: MemberItemProps) {
  const { data: member, isLoading } = useMember(communityId, address);

  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10" />
          <div className="space-y-2">
            <div className="h-2 w-20 bg-white/10 rounded" />
            <div className="h-2 w-32 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!member || !member.active) return null;

  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 group hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          member.role === 'admin' ? 'bg-orange-500/10' : 'bg-blue-500/10'
        }`}>
          {member.role === 'admin' ? (
            <Shield className={`w-4 h-4 ${member.role === 'admin' ? 'text-orange-500' : 'text-blue-400'}`} />
          ) : (
            <User className="w-4 h-4 text-blue-400" />
          )}
        </div>
        <div>
          <p className="text-xs font-bold text-white">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
          <p className="text-[9px] text-gray-500 font-mono uppercase tracking-tighter">
            Joined: {new Date(member.joinedAt * 1000).toLocaleDateString()}
          </p>
        </div>
      </div>
      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
        member.role === 'admin' 
          ? 'bg-orange-500/20 text-orange-500' 
          : member.role === 'contributor'
            ? 'bg-blue-500/20 text-blue-400'
            : 'bg-white/10 text-gray-400'
      }`}>
        {member.role}
      </span>
    </div>
  );
}
