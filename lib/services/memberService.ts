/**
 * 회원 관련 API 서비스
 */

import { get, put } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { PaginatedResponse } from '@/types/api';
import type { Member } from '@/lib/mock-data/members';
import { mockMembers } from '@/lib/mock-data/members';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

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
  if (USE_MOCK) {
    let filtered = [...mockMembers];

    if (filters) {
      if (filters.grade && filters.grade !== 'all') {
        filtered = filtered.filter(m => m.grade === filters.grade);
      }
      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(m => m.status === filters.status);
      }
      if (filters.searchTerm) {
        const query = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(m =>
          m.name.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query)
        );
      }
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = filtered.slice(start, end);
    const totalPages = Math.ceil(filtered.length / limit);

    return Promise.resolve({
      data: paginatedData,
      pagination: {
        total: filtered.length,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  }

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
  if (USE_MOCK) {
    const member = mockMembers.find(m => m.id === id);
    if (!member) {
      throw new Error(`회원을 찾을 수 없습니다. (ID: ${id})`);
    }
    return Promise.resolve(member);
  }
  return get<Member>(ENDPOINTS.MEMBERS.DETAIL(id));
}

export async function updateMember(
  id: string,
  data: Partial<Member>
): Promise<Member> {
  if (USE_MOCK) {
    const member = mockMembers.find(m => m.id === id);
    if (!member) {
      throw new Error(`회원을 찾을 수 없습니다. (ID: ${id})`);
    }
    return Promise.resolve({ ...member, ...data });
  }
  return put<Member>(ENDPOINTS.MEMBERS.UPDATE(id), data);
}
