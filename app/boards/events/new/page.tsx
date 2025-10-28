'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function EventNewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('이벤트가 등록되었습니다.');
    router.push('/boards/events');
  };

  const handleCancel = () => {
    router.push('/boards/events');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 제목 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">이벤트 등록</h1>
          <p className="text-gray-600 mt-1">새로운 이벤트를 등록합니다</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            {/* 제목 */}
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                placeholder="이벤트 제목을 입력하세요"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* 내용 */}
            <div className="space-y-2">
              <Label htmlFor="content">내용 *</Label>
              <Textarea
                id="content"
                placeholder="이벤트 내용을 입력하세요"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                required
              />
            </div>

            {/* 이미지 첨부 */}
            <div className="space-y-2">
              <Label htmlFor="image">이미지첨부</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-2">
                    이미지를 업로드하세요 (JPG, PNG, GIF)
                  </p>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="max-w-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              목록
            </Button>
            <Button type="submit">
              등록
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
