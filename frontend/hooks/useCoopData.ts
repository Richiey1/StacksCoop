import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCallReadOnlyFunction, cvToValue, standardPrincipalCV, uintCV, stringUtf8CV } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME, NETWORK } from '@/lib/stacksConfig';
import { Community, Member, Record } from '@/types/coop';

// ============================================
// Community Hooks
// ============================================

export function useCommunity(communityId: number) {
  return useQuery({
    queryKey: ['community', communityId],
    queryFn: async (): Promise<Community | null> => {
      try {
        const response = await fetchCallReadOnlyFunction({
          network: NETWORK,
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'get-community',
          functionArgs: [uintCV(communityId)],
          senderAddress: CONTRACT_ADDRESS,
        });

        const data = cvToValue(response);
        if (!data || !data.value) return null;

        const comm = data.value;
        return {
          id: communityId,
          name: comm.name.value,
          admin: comm.admin.value,
          createdAt: Number(comm['created-at'].value),
          status: Number(comm.status.value),
          totalDonations: Number(comm['total-donations'].value),
          totalSpending: Number(comm['total-spending'].value),
          memberCount: Number(comm['member-count'].value),
        };
      } catch (error) {
        console.error(`Error fetching community ${communityId}:`, error);
        return null;
      }
    },
    enabled: communityId > 0,
    staleTime: 10000,
  });
}

export function useCommunityByName(name: string) {
    return useQuery({
      queryKey: ['community-by-name', name],
      queryFn: async (): Promise<number | null> => {
        try {
          const response = await fetchCallReadOnlyFunction({
            network: NETWORK,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'get-community-by-name',
            functionArgs: [stringUtf8CV(name)],
            senderAddress: CONTRACT_ADDRESS,
          });
  
          const data = cvToValue(response);
          if (!data || !data.value) return null;
          return Number(data.value);
        } catch (error) {
          console.error(`Error fetching community by name ${name}:`, error);
          return null;
        }
      },
      enabled: !!name,
      staleTime: 60000,
    });
  }

// ============================================
// Member Hooks
// ============================================

export function useMember(communityId: number, address: string) {
  return useQuery({
    queryKey: ['member', communityId, address],
    queryFn: async (): Promise<Member | null> => {
      try {
        const response = await fetchCallReadOnlyFunction({
          network: NETWORK,
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'get-member',
          functionArgs: [uintCV(communityId), standardPrincipalCV(address)],
          senderAddress: address,
        });

        const data = cvToValue(response);
        if (!data || !data.value) return null;

        const mem = data.value;
        return {
          communityId,
          address,
          role: mem.role.value,
          joinedAt: Number(mem['joined-at'].value),
          active: mem.active.value,
        };
      } catch (error) {
        console.error(`Error fetching member ${address} in ${communityId}:`, error);
        return null;
      }
    },
    enabled: communityId > 0 && !!address,
    staleTime: 10000,
  });
}

// ============================================
// Record Hooks
// ============================================

export function useLatestRecordId() {
  return useQuery({
    queryKey: ['latest-record-id'],
    queryFn: async (): Promise<number> => {
      try {
        const response = await fetchCallReadOnlyFunction({
          network: NETWORK,
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'get-record-counter',
          functionArgs: [],
          senderAddress: CONTRACT_ADDRESS,
        });

        const data = cvToValue(response);
        return Number(data.value || 0);
      } catch (error) {
        console.error('Error fetching latest record ID:', error);
        return 0;
      }
    },
    staleTime: 10000,
  });
}

export function useRecord(recordId: number) {
  return useQuery({
    queryKey: ['record', recordId],
    queryFn: async (): Promise<Record | null> => {
      try {
        const response = await fetchCallReadOnlyFunction({
          network: NETWORK,
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'get-record',
          functionArgs: [uintCV(recordId)],
          senderAddress: CONTRACT_ADDRESS,
        });

        const data = cvToValue(response);
        if (!data || !data.value) return null;

        const rec = data.value;
        return {
          id: recordId,
          communityId: Number(rec['community-id'].value),
          recordType: rec['record-type'].value,
          amount: Number(rec.amount.value),
          description: rec.description.value,
          submitter: rec.submitter.value,
          timestamp: Number(rec.timestamp.value),
          status: Number(rec.status.value),
          verifiedBy: rec['verified-by']?.value || undefined,
          projectId: rec['project-id']?.value ? Number(rec['project-id'].value) : undefined,
        };
      } catch (error) {
        console.error(`Error fetching record ${recordId}:`, error);
        return null;
      }
    },
    enabled: recordId > 0,
    staleTime: 10000,
  });
}

export function useRecordsList(communityId?: number, limit = 20) {
    const { data: latestRecordId } = useLatestRecordId();
  
    return useQuery({
      queryKey: ['records-list', communityId, limit],
      queryFn: async (): Promise<Record[]> => {
        try {
          const maxId = latestRecordId || 0;
          const records: Record[] = [];
          
          // Fetch records in reverse order (newest first)
          // Note: This is inefficient without a proper indexer, but works for MVP
          // In production, we would iterate until we find enough records for the specific community
          const startId = Math.max(1, maxId - 50); // Look back 50 records max for now
          
          for (let i = maxId; i >= startId; i--) {
            const response = await fetchCallReadOnlyFunction({
              network: NETWORK,
              contractAddress: CONTRACT_ADDRESS,
              contractName: CONTRACT_NAME,
              functionName: 'get-record',
              functionArgs: [uintCV(i)],
              senderAddress: CONTRACT_ADDRESS,
            });
            
            const data = cvToValue(response);
            if (data && data.value) {
                const rec = data.value;
                const recCommunityId = Number(rec['community-id'].value);

                if (!communityId || recCommunityId === communityId) {
                     records.push({
                        id: i,
                        communityId: recCommunityId,
                        recordType: rec['record-type'].value,
                        amount: Number(rec.amount.value),
                        description: rec.description.value,
                        submitter: rec.submitter.value,
                        timestamp: Number(rec.timestamp.value),
                        status: Number(rec.status.value),
                        verifiedBy: rec['verified-by']?.value || undefined,
                        projectId: rec['project-id']?.value ? Number(rec['project-id'].value) : undefined,
                      });
                }
            }
            if (records.length >= limit) break;
          }
          
          return records;
        } catch (error) {
          console.error('Error fetching records list:', error);
          return [];
        }
      },
      enabled: latestRecordId !== undefined && latestRecordId > 0,
      staleTime: 10000,
    });
  }

// ============================================
// Query Invalidation
// ============================================

export function useInvalidateCoopQueries() {
  const queryClient = useQueryClient();
  
  return {
    invalidateCommunity: (communityId: number) => {
      queryClient.invalidateQueries({ queryKey: ['community', communityId] });
      queryClient.invalidateQueries({ queryKey: ['records-list', communityId] });
    },
    
    invalidateRecord: (recordId: number) => {
      queryClient.invalidateQueries({ queryKey: ['record', recordId] });
    },
    
    invalidateLatestRecord: () => {
        queryClient.invalidateQueries({ queryKey: ['latest-record-id'] });
        queryClient.invalidateQueries({ queryKey: ['records-list'] });
    },

    invalidateMember: (communityId: number, address: string) => {
        queryClient.invalidateQueries({ queryKey: ['member', communityId, address] });
    },
    
    invalidateAll: () => {
      queryClient.invalidateQueries();
    },
  };
}
