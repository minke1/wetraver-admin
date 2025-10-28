'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ProductNewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    name: '',
    price: '',
    displayStatus: '노출',
    status: '판매중',
    shortDescription: '',
    startDate: '',
    endDate: '',
    detailDescription: '',
    terms: '',
    notes: '',
  });

  const categories = ['Tickets', 'Hotels', 'Tour', 'K-Beauty', 'Dining', 'Vehicle', 'K-goods'];
  const subCategories: Record<string, string[]> = {
    'Tickets': ['Gangwon', 'Gyeonggi', 'Jeju', 'Busan'],
    'Hotels': ['Seoul', 'Busan', 'Jeju'],
    'Tour': ['Cultural', 'Nature', 'City'],
    'K-Beauty': ['Skincare', 'Makeup', 'Spa'],
    'Dining': ['Korean', 'Western', 'Japanese'],
    'Vehicle': ['Car', 'Bus', 'Bike'],
    'K-goods': ['Fashion', 'Cosmetics', 'Food']
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('상품이 등록되었습니다.');
    router.push('/products');
  };

  const handleCancel = () => {
    router.push('/products');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 제목 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">상품 등록</h1>
          <p className="text-gray-600 mt-1">새로운 상품을 등록합니다</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 왼쪽 컬럼 */}
              <div className="space-y-6">
                {/* 카테고리 */}
                <div className="space-y-2">
                  <Label htmlFor="category">카테고리 *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => {
                      setFormData({ ...formData, category: value, subCategory: '' });
                    }}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 2차 분류 */}
                {formData.category && (
                  <div className="space-y-2">
                    <Label htmlFor="subCategory">2차 분류 *</Label>
                    <Select
                      value={formData.subCategory}
                      onValueChange={(value) => setFormData({ ...formData, subCategory: value })}
                    >
                      <SelectTrigger id="subCategory">
                        <SelectValue placeholder="선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCategories[formData.category]?.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* 상품명 */}
                <div className="space-y-2">
                  <Label htmlFor="name">상품명 *</Label>
                  <Input
                    id="name"
                    placeholder="상품명을 입력하세요"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* 판매가격 */}
                <div className="space-y-2">
                  <Label htmlFor="price">판매가격 *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="가격을 입력하세요"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                {/* 노출여부 */}
                <div className="space-y-2">
                  <Label htmlFor="displayStatus">노출여부 *</Label>
                  <Select
                    value={formData.displayStatus}
                    onValueChange={(value) => setFormData({ ...formData, displayStatus: value })}
                  >
                    <SelectTrigger id="displayStatus">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="노출">노출</SelectItem>
                      <SelectItem value="비노출">비노출</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 판매여부 */}
                <div className="space-y-2">
                  <Label htmlFor="status">판매여부 *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="판매중">판매중</SelectItem>
                      <SelectItem value="품절">품절</SelectItem>
                      <SelectItem value="판매중지">판매중지</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 오른쪽 컬럼 */}
              <div className="space-y-6">
                {/* 간략설명 */}
                <div className="space-y-2">
                  <Label htmlFor="shortDescription">간략설명</Label>
                  <Textarea
                    id="shortDescription"
                    placeholder="상품의 간략한 설명을 입력하세요"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* 판매기간 */}
                <div className="space-y-2">
                  <Label>판매기간</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                    <span className="text-gray-500">~</span>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 전체 너비 필드 */}
            <div className="mt-8 space-y-6">
              {/* 상세설명 */}
              <div className="space-y-2">
                <Label htmlFor="detailDescription">상세설명</Label>
                <Textarea
                  id="detailDescription"
                  placeholder="상품의 상세한 설명을 입력하세요"
                  value={formData.detailDescription}
                  onChange={(e) => setFormData({ ...formData, detailDescription: e.target.value })}
                  rows={6}
                />
              </div>

              {/* 이용약관 */}
              <div className="space-y-2">
                <Label htmlFor="terms">이용약관</Label>
                <Textarea
                  id="terms"
                  placeholder="이용약관을 입력하세요"
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  rows={4}
                />
              </div>

              {/* 유의사항 */}
              <div className="space-y-2">
                <Label htmlFor="notes">유의사항</Label>
                <Textarea
                  id="notes"
                  placeholder="유의사항을 입력하세요"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </div>

              {/* 이미지 업로드 */}
              <div className="space-y-2">
                <Label htmlFor="image">상품 이미지</Label>
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
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              취소
            </Button>
            <Button type="submit">
              저장
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
