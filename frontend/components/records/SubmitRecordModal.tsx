"use client";

import { useState } from "react";
import { X, Loader2, Coins, FileText, AlertCircle } from "lucide-react";
import { useStacksCoop } from "@/hooks/useStacksCoop";

interface SubmitRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityId: number;
}

export function SubmitRecordModal({ isOpen, onClose, communityId }: SubmitRecordModalProps) {
  const { submitRecord } = useStacksCoop();
  const [recordType, setRecordType] = useState<"donation" | "spending">("donation");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    try {
      setIsSubmitting(true);
      await submitRecord(
        communityId,
        recordType,
        parseFloat(amount),
        description
      );
      // Reset form and close
      setAmount("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Error submitting record:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-black border-4 border-white/10 rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-white/5">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-white uppercase tracking-widest font-pixel">
              Submit Record
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Record Type Selector */}
          <div>
            <label className="block text-[10px] font-pixel text-gray-400 uppercase mb-3 tracking-widest">
              Record Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRecordType("donation")}
                className={`flex items-center justify-center gap-2 py-3 border-4 transition-all font-pixel text-[10px] uppercase
                  ${recordType === "donation" 
                    ? "border-green-500 bg-green-500/10 text-green-400" 
                    : "border-white/5 bg-white/5 text-gray-500 hover:border-white/10"}`}
              >
                <Coins className="w-3 h-3" />
                Donation
              </button>
              <button
                type="button"
                onClick={() => setRecordType("spending")}
                className={`flex items-center justify-center gap-2 py-3 border-4 transition-all font-pixel text-[10px] uppercase
                  ${recordType === "spending" 
                    ? "border-red-500 bg-red-500/10 text-red-400" 
                    : "border-white/5 bg-white/5 text-gray-500 hover:border-white/10"}`}
              >
                <Coins className="w-3 h-3" />
                Spending
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-[10px] font-pixel text-gray-400 uppercase mb-3 tracking-widest">
              Amount (STX)
            </label>
            <div className="relative">
              <input
                id="amount"
                type="number"
                step="0.000001"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white/5 border-4 border-white/10 p-4 text-white font-pixel text-sm focus:border-orange-500 outline-none transition-all placeholder:text-gray-700"
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 font-pixel text-[10px] text-gray-500">
                STX
              </div>
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-[10px] font-pixel text-gray-400 uppercase mb-3 tracking-widest">
              Description / Reason
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g. Monthly maintenance fees..."
              rows={3}
              className="w-full bg-white/5 border-4 border-white/10 p-4 text-white font-pixel text-sm focus:border-orange-500 outline-none transition-all placeholder:text-gray-700 resize-none"
              required
            />
          </div>

          {/* Warning Note */}
          <div className="flex gap-3 p-4 bg-orange-500/5 border-2 border-orange-500/20 rounded-xl">
            <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
            <p className="text-[9px] text-gray-400 uppercase leading-relaxed font-pixel">
              Submitted records will be recorded immutably on the Stacks blockchain and may require community admin verification.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 border-4 border-white/10 font-pixel text-[10px] text-gray-400 uppercase hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 border-4 border-orange-500 bg-orange-500 text-white font-pixel text-[10px] uppercase hover:bg-orange-600 transition-all shadow-[4px_4px_0px_0px_rgba(249,115,22,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Record"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
