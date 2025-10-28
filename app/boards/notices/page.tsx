'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Notice {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  important: boolean;
}

const mockNotices: Notice[] = Array.from({ length: 15 }, (_, i) => ({
  id: `NOTICE-${String(i + 1).padStart(3, '0')}`,
  title: i < 3 ? `[중요] 시스템 점검 안내 ${i + 1}` : `공지사항 제목 ${i + 1}`,
  author: '관리자',
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  views: Math.floor(Math.random() * 500),
  important: i < 3,
}));

export default function NoticesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredNotices = mockNotices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNotice = () => {
    toast.success('공지사항이 등록되었습니다.');
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 제목 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">공지사항</h1>
            <p className="text-gray-600 mt-1">총 {filteredNotices.length}개의 공지사항</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                공지사항 작성
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>공지사항 작성</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">제목</Label>
                  <Input id="title" placeholder="제목을 입력하세요" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">내용</Label>
                  <textarea
                    id="content"
                    className="w-full min-h-[200px] px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="내용을 입력하세요"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="important" />
                  <Label htmlFor="important">중요 공지사항</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleCreateNotice}>등록</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 검색 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="제목 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 공지사항 테이블 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    조회수
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNotices.map((notice) => (
                  <tr key={notice.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {notice.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {notice.important && (
                          <span className="px-2 py-1 text-xs font-semibold text-error-600 bg-error-50 rounded">
                            중요
                          </span>
                        )}
                        <span className="text-sm font-medium text-gray-900">{notice.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {notice.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {notice.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {notice.views}
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
