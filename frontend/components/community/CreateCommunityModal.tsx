"use client";

import { useState } from "react";
import { X, Loader2, Users, AlertCircle } from "lucide-react";
import { useStacksCoop } from "@/hooks/useStacksCoop";

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (communityId: number) => void;
}

/**
 * CreateCommunityModal Component
 * Modal form for creating a new community
 * 
 * Features:
 * - Community name input with validation
 * - Transaction status feedback
 * - Error handling and display
 * - Wallet connection detection
 */
export function CreateCommunityModal({ isOpen, onClose, onSuccess }: CreateCommunityModalProps) {
  const { createCommunity, isLoading: isWalletLoading } = useStacksCoop();
  const [communityName, setCommunityName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Validate community name
  const validateName = (name: string) => {
    if (name.length === 0) {
      return "Community name is required";
    }
    if (name.length < 3) {
      return "Community name must be at least 3 characters";
    }
    if (name.length > 100) {
      return "Community name must be less than 100 characters";
    }
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
      return "Community name can only contain letters, numbers, spaces, hyphens, and underscores";
    }
    return null;
  };

  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setCommunityName(name);
    setError(null);

    // Real-time validation
    if (name.length > 0) {
      setIsValidating(true);
      const validationError = validateName(name);
      if (validationError) {
        setError(validationError);
      }
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation
    const validationError = validateName(communityName);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const communityId = await createCommunity(communityName);
      
      if (communityId !== null && communityId !== undefined) {
        // Reset form and close
        setCommunityName("");
        setError(null);
        onClose();
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(Number(communityId));
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create community";
      setError(errorMessage);
      console.error("Error creating community:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isDisabled = isSubmitting || isWalletLoading || isValidating || Boolean(error);

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
            <Users className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-white uppercase tracking-widest font-pixel">
              Create Community
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Community Name Input */}
          <div>
            <label className="block text-[10px] font-pixel text-gray-400 uppercase mb-3 tracking-widest">
              Community Name
            </label>
            <input
              type="text"
              value={communityName}
              onChange={handleNameChange}
              placeholder="Enter community name (3-100 characters)"
              disabled={isSubmitting || isWalletLoading}
              className="w-full px-4 py-3 bg-white/5 border-4 border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-pixel text-sm"
            />
            {communityName.length > 0 && (
              <p className="text-[10px] text-gray-400 mt-2 font-pixel">
                {communityName.length}/100 characters
              </p>
            )}
          </div>

          {/* Validation Error Display */}
          {error && (
            <div className="flex items-start gap-3 p-3 bg-red-500/10 border-4 border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400 font-pixel">{error}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="flex items-start gap-3 p-3 bg-blue-500/10 border-4 border-blue-500/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-400 font-pixel space-y-1">
              <p>You will become the admin of this community.</p>
              <p>Community name must be unique.</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isDisabled || communityName.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white border-4 border-blue-600 disabled:border-gray-700 rounded-lg font-bold uppercase tracking-widest transition-all disabled:cursor-not-allowed font-pixel text-sm"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Creating..." : "Create Community"}
          </button>

          {/* Loading Message */}
          {isSubmitting && (
            <p className="text-center text-[10px] text-gray-400 font-pixel animate-pulse">
              Broadcasting transaction...
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateCommunityModal;
