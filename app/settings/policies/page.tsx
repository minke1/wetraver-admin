'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit } from 'lucide-react';
import Link from 'next/link';
import { mockPolicies } from '@/data/mockPolicies';

export default function PoliciesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [policies, setPolicies] = useState(mockPolicies);

  const filteredPolicies = policies
    .filter((policy) => policy.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.priority - a.priority);

  const handleDelete = (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setPolicies(policies.filter((p) => p.id !== id));
    }
  };

  const handlePriorityChange = (id: number, newPriority: string) => {
    const priority = parseInt(newPriority);
    if (!isNaN(priority)) {
      setPolicies(
        policies.map((p) => (p.id === id ? { ...p, priority } : p))
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 제목 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">약관 및 정책</h1>
            <p className="text-gray-600 mt-1">총 {filteredPolicies.length}개의 목록이 있습니다.</p>
          </div>
          <Link href="/settings/policies/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              신규등록
            </Button>
          </Link>
        </div>

        {/* 검색 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="약관명 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 약관 테이블 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    약관명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    우선순위
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPolicies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {policy.id}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/settings/policies/${policy.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-primary-600"
                      >
                        {policy.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        type="number"
                        value={policy.priority}
                        onChange={(e) => handlePriorityChange(policy.id, e.target.value)}
                        className="w-20 text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Link href={`/settings/policies/${policy.id}`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit className="h-3 w-3" />
                            수정
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(policy.id)}
                          className="text-error-600 hover:text-error-700 hover:bg-error-50"
                        >
                          삭제
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
