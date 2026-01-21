import { useStacks } from '@/contexts/StacksProvider';
import { CONTRACT_ADDRESS, CONTRACT_NAME, NETWORK } from '@/lib/stacksConfig';
import { openContractCall } from '@stacks/connect';
import {
  uintCV,
  principalCV,
  stringAsciiCV,
  stringUtf8CV,
  someCV,
  noneCV,
  PostConditionMode,
} from '@stacks/transactions';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export function useStacksCoop() {
  const { address } = useStacks();

  // ============================================
  // Community Management Functions
  // ============================================

  const createCommunity = useCallback(async (name: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    try {
      await openContractCall({
        network: NETWORK,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'create-community',
        functionArgs: [stringUtf8CV(name)],
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data) => {
          console.log('Transaction:', data.txId);
          toast.success('Community created successfully!');
        },
        onCancel: () => {
          toast.error('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Error creating community:', error);
      toast.error('Failed to create community');
    }
  }, [address]);

  const addMember = useCallback(async (
    communityId: number,
    memberAddress: string,
    role: string
  ) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      await openContractCall({
        network: NETWORK,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'add-member',
        functionArgs: [
          uintCV(communityId),
          principalCV(memberAddress),
          stringAsciiCV(role)
        ],
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data) => {
          console.log('Transaction:', data.txId);
          toast.success('Member added successfully!');
        },
        onCancel: () => {
          toast.error('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('Failed to add member');
    }
  }, [address]);

  const removeMember = useCallback(async (
    communityId: number,
    memberAddress: string
  ) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      await openContractCall({
        network: NETWORK,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'remove-member',
        functionArgs: [
          uintCV(communityId),
          principalCV(memberAddress)
        ],
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data) => {
          console.log('Transaction:', data.txId);
          toast.success('Member removed successfully!');
        },
        onCancel: () => {
          toast.error('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    }
  }, [address]);

  const updateMemberRole = useCallback(async (
    communityId: number,
    memberAddress: string,
    newRole: string
  ) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      await openContractCall({
        network: NETWORK,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'update-member-role',
        functionArgs: [
          uintCV(communityId),
          principalCV(memberAddress),
          stringAsciiCV(newRole)
        ],
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data) => {
          console.log('Transaction:', data.txId);
          toast.success('Member role updated successfully!');
        },
        onCancel: () => {
          toast.error('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Error updating member role:', error);
      toast.error('Failed to update member role');
    }
  }, [address]);

  // ============================================
  // Record Management Functions
  // ============================================

  const submitRecord = useCallback(async (
    communityId: number,
    recordType: string,
    amount: number,
    description: string,
    projectId?: number
  ) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      // Convert amount to micro-units (assuming STX or similar)
      const amountMicro = Math.floor(amount * 1_000_000);

      await openContractCall({
        network: NETWORK,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'submit-record',
        functionArgs: [
          uintCV(communityId),
          stringAsciiCV(recordType),
          uintCV(amountMicro),
          stringUtf8CV(description),
          projectId ? someCV(uintCV(projectId)) : noneCV()
        ],
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data) => {
          console.log('Transaction:', data.txId);
          toast.success('Record submitted successfully!');
        },
        onCancel: () => {
          toast.error('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Error submitting record:', error);
      toast.error('Failed to submit record');
    }
  }, [address]);

  const verifyRecord = useCallback(async (recordId: number) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      await openContractCall({
        network: NETWORK,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'verify-record',
        functionArgs: [uintCV(recordId)],
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data) => {
          console.log('Transaction:', data.txId);
          toast.success('Record verified successfully!');
        },
        onCancel: () => {
          toast.error('Transaction cancelled');
        },
      });
    } catch (error) {
      console.error('Error verifying record:', error);
      toast.error('Failed to verify record');
    }
  }, [address]);

  return {
    // Community management
    createCommunity,
    addMember,
    removeMember,
    updateMemberRole,
    
    // Record management
    submitRecord,
    verifyRecord,
  };
}
