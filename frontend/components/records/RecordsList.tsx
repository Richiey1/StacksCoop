"use client";

import { useRecordsList } from "@/hooks/useCoopData";
import { Record } from "@/types/coop";

interface RecordsListProps {
  communityId?: number;
}

export function RecordsList({ communityId }: RecordsListProps) {
  const { data: records, isLoading } = useRecordsList(communityId);

  if (isLoading) {
    return <div className="text-white text-center p-8">Loading records...</div>;
  }

  if (!records || records.length === 0) {
    return <div className="text-gray-400 text-center p-8">No records found.</div>;
  }

  return (
    <div className="w-full space-y-4">
      {records.map((record) => (
        <div 
          key={record.id} 
          className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/10 transition-colors"
        >
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-bold tracking-wider
                        ${record.recordType === 'donation' ? 'bg-green-500/20 text-green-400' : 
                          record.recordType === 'spending' ? 'bg-red-500/20 text-red-400' : 
                          'bg-blue-500/20 text-blue-400'}`}
                    >
                        {record.recordType}
                    </span>
                    <span className="text-xs text-gray-500">#{record.id}</span>
                </div>
                <h3 className="text-white font-medium">{record.description}</h3>
                <p className="text-xs text-gray-400 font-mono">
                    By: {record.submitter.slice(0, 6)}...{record.submitter.slice(-4)}
                </p>
            </div>
            
            <div className="flex flex-col items-end gap-1">
                 <span className="text-xl font-bold text-white">
                    {(record.amount / 1_000_000).toLocaleString()} <span className="text-sm font-normal text-gray-400">STX</span>
                 </span>
                 <span className="text-xs text-gray-500">
                    {new Date().toLocaleDateString()} {/* Timestamp conversion would go here */}
                 </span>
            </div>
        </div>
      ))}
    </div>
  );
}
