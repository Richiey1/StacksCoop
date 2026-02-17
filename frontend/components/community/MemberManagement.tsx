"use client";

import { useState } from "react";
import { UserPlus, Shield, User, X, Loader2 } from "lucide-react";
import { useStacksCoop } from "@/hooks/useStacksCoop";

interface MemberManagementProps {
  communityId: number;
}

export function MemberManagement({ communityId }: MemberManagementProps) {
  const { addMember } = useStacksCoop();
  const [isAdding, setIsAdding] = useState(false);
  const [newMemberAddress, setNewMemberAddress] = useState("");
  const [selectedRole, setSelectedRole] = useState("contributor");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberAddress) return;

    try {
      setIsLoading(true);
      await addMember(communityId, newMemberAddress, selectedRole);
      setNewMemberAddress("");
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">Member Management</h3>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 rounded-lg text-xs font-bold transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Member
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddMember} className="bg-black/40 p-4 border border-white/5 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">New Recruitment</span>
            <button type="button" onClick={() => setIsAdding(false)}>
              <X className="w-4 h-4 text-gray-500 hover:text-white" />
            </button>
          </div>
          
          <div className="space-y-3">
            <input 
              type="text"
              placeholder="Stacks Address (SP...)"
              value={newMemberAddress}
              onChange={(e) => setNewMemberAddress(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
              required
            />
            
            <div className="grid grid-cols-3 gap-2">
              {['admin', 'contributor', 'viewer'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                    selectedRole === role 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <button 
              type="submit"
              disabled={isLoading || !newMemberAddress}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserPlus className="w-3 h-3" />}
              {isLoading ? "Broadcasting..." : "Confirm Addition"}
            </button>
          </div>
        </form>
      )}

      {/* Member List Placeholder */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Community Admin</p>
              <p className="text-[10px] text-gray-500 font-mono">Principal Creator</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[8px] font-bold uppercase">Admin</span>
        </div>
      </div>
    </div>
  );
}
