/**
 * 회원 관련 API 서비스
 */

import { get, put } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { PaginatedResponse } from '@/types/api';
import type { Member } from '@/lib/mock-data/members';

interface MemberFilters {
  grade?: string;
  status?: string;
  searchTerm?: string;
}

export async function getMembers(
  page: number = 1,
  limit: number = 20,
  filters?: MemberFilters
): Promise<PaginatedResponse<Member>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters) {
    if (filters.grade && filters.grade !== 'all') {
      params.append('grade', filters.grade);
    }
    if (filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters.searchTerm) {
      params.append('q', filters.searchTerm);
    }
  }

  return get<PaginatedResponse<Member>>(
    `${ENDPOINTS.MEMBERS.LIST}?${params.toString()}`
  );
}

export async function getMemberById(id: string): Promise<Member> {
  return get<Member>(ENDPOINTS.MEMBERS.DETAIL(id));
}

export async function updateMember(
  id: string,
  data: Partial<Member>
): Promise<Member> {
  return put<Member>(ENDPOINTS.MEMBERS.UPDATE(id), data);
}
