'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { TuiEditorHandle } from '@/components/editor/TuiEditor';
import { toast } from 'sonner';

const TuiEditor = dynamic(() => import('@/components/editor/TuiEditor'), {
  ssr: false,
  loading: () => <div className="h-[500px] bg-gray-50 animate-pulse rounded-md" />,
});

export default function PolicyNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');

  const pcEditorRef = useRef<TuiEditorHandle>(null);
  const mobileEditorRef = useRef<TuiEditorHandle>(null);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('약관명을 입력하세요.');
      return;
    }

    const pcContent = pcEditorRef.current?.getHTML() || '';
    const mobileContent = mobileEditorRef.current?.getHTML() || '';

    console.log('저장 데이터:', {
      title,
      contentPC: pcContent,
      contentMobile: mobileContent,
    });

    toast.success('약관이 등록되었습니다.');
    router.push('/settings/policies');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/settings/policies">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                리스트
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">약관 및 정책 신규등록</h1>
            </div>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            등록
          </Button>
        </div>

        {/* 폼 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* 약관명 */}
          <div className="space-y-2">
            <Label htmlFor="title">약관명</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="약관명을 입력하세요"
            />
          </div>

          {/* PC 에디터 */}
          <div className="space-y-2">
            <Label>PC</Label>
            <div className="border rounded-md overflow-hidden">
              <TuiEditor ref={pcEditorRef} height="500px" placeholder="PC 내용을 입력하세요" />
            </div>
          </div>

          {/* 모바일 에디터 */}
          <div className="space-y-2">
            <Label>모바일</Label>
            <div className="border rounded-md overflow-hidden">
              <TuiEditor
                ref={mobileEditorRef}
                height="500px"
                placeholder="모바일 내용을 입력하세요"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
