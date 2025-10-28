'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { getEvents } from '@/lib/mock-data/events';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Search, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('전체');

  const { data: events, total } = getEvents(1, 12, {
    searchTerm: searchTerm || undefined,
    searchType: searchType !== '전체' ? searchType : undefined,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 제목 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">이벤트 관리</h1>
            <p className="text-gray-600 mt-1">총 {total}개의 이벤트</p>
          </div>
          <Link href="/boards/events/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              등록
            </Button>
          </Link>
        </div>

        {/* 검색 필터 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <RadioGroup value={searchType} onValueChange={setSearchType} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="전체" id="all" />
                <Label htmlFor="all" className="cursor-pointer">
                  전체
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="제목" id="title" />
                <Label htmlFor="title" className="cursor-pointer">
                  제목
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="내용" id="content" />
                <Label htmlFor="content" className="cursor-pointer">
                  내용
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="작성자" id="author" />
                <Label htmlFor="author" className="cursor-pointer">
                  작성자
                </Label>
              </div>
            </RadioGroup>
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="검색어를 입력하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                초기화
              </Button>
            </div>
          </div>
        </div>

        {/* 이벤트 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* 이미지 */}
              <div className="relative h-48 w-full">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* 내용 */}
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">{event.content}</p>

                {/* 기간 */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-medium">기간:</span>
                  <span>
                    {event.startDate} ~ {event.endDate}
                  </span>
                </div>

                {/* 정보 */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                  <span>조회수: {event.views}</span>
                  <span>{event.createdAt}</span>
                </div>

                {/* 버튼 */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    수정
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    삭제
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 빈 상태 */}
        {events.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
