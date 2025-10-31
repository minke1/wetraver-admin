'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit } from 'lucide-react';
import Link from 'next/link';
import { mockAdmins } from '@/data/mockAdmins';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SearchType = 'all' | 'userId' | 'name' | 'phone';

export default function AdminsPage() {
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [admins, setAdmins] = useState(mockAdmins);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filteredAdmins = admins.filter((admin) => {
    if (!searchTerm) return true;

    switch (searchType) {
      case 'userId':
        return admin.userId.toLowerCase().includes(searchTerm.toLowerCase());
      case 'name':
        return admin.name.toLowerCase().includes(searchTerm.toLowerCase());
      case 'phone':
        return admin.phone.includes(searchTerm);
      default:
        return (
          admin.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.phone.includes(searchTerm)
        );
    }
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredAdmins.map((admin) => admin.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      alert('삭제할 항목을 선택하세요.');
      return;
    }

    if (confirm(`선택한 ${selectedIds.length}개 항목을 삭제하시겠습니까?`)) {
      setAdmins(admins.filter((admin) => !selectedIds.includes(admin.id)));
      setSelectedIds([]);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setAdmins(admins.filter((admin) => admin.id !== id));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">운영자 계정관리</h1>
            <p className="text-gray-600 mt-1">총 {filteredAdmins.length}개의 목록이 있습니다.</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSelectAll(selectedIds.length !== filteredAdmins.length)}
            >
              전체선택
            </Button>
            <Button variant="outline" onClick={() => setSelectedIds([])}>
              선택해제
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteSelected}
              className="text-error-600 hover:text-error-700"
            >
              선택삭제
            </Button>
            <Link href="/settings/admins/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                직원 등록
              </Button>
            </Link>
          </div>
        </div>

        {/* 검색 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex gap-2 max-w-2xl">
            <Select value={searchType} onValueChange={(value) => setSearchType(value as SearchType)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="userId">아이디</SelectItem>
                <SelectItem value="name">직원성명</SelectItem>
                <SelectItem value="phone">연락처</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* 관리자 테이블 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    선택
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    현황
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    아이디
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    직원명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    직급
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이메일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    연락처
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가입일시
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(admin.id)}
                        onChange={(e) => handleSelectOne(admin.id, e.target.checked)}
                        className="h-4 w-4 text-primary-600 rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {admin.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          admin.status === '이용중'
                            ? 'bg-success-100 text-success-700'
                            : 'bg-error-100 text-error-700'
                        }`}
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/settings/admins/${admin.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-primary-600"
                      >
                        {admin.userId}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/settings/admins/${admin.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-primary-600"
                      >
                        {admin.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {admin.position || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {admin.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {admin.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {admin.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Link href={`/settings/admins/${admin.id}`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit className="h-3 w-3" />
                            수정
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(admin.id)}
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
