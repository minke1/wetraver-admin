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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">상품 등록</h1>
            <p className="text-gray-600 mt-1">새로운 상품을 등록합니다</p>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              취소
            </Button>
            <Button type="submit" form="product-form">
              저장
            </Button>
          </div>
        </div>

        {/* 폼 */}
        <form id="product-form" onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">■ 기본정보</h3>
            <table className="w-full table-fixed mb-8">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">카테고리 *</td>
                  <td className="py-3 px-4 w-[calc(50%-10rem)]">
                    <Select
                      value={formData.category}
                      onValueChange={(value) => {
                        setFormData({ ...formData, category: value, subCategory: '' });
                      }}
                    >
                      <SelectTrigger>
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
                  </td>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">2차 분류 *</td>
                  <td className="py-3 px-4 w-[calc(50%-10rem)]">
                    <Select
                      value={formData.subCategory}
                      onValueChange={(value) => setFormData({ ...formData, subCategory: value })}
                      disabled={!formData.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.category && subCategories[formData.category]?.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">상품명 *</td>
                  <td className="py-3 px-4" colSpan={3}>
                    <Input
                      placeholder="상품명을 입력하세요"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">판매가격 *</td>
                  <td className="py-3 px-4 w-[calc(50%-10rem)]">
                    <Input
                      type="number"
                      placeholder="가격을 입력하세요"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </td>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">판매기간</td>
                  <td className="py-3 px-4 w-[calc(50%-10rem)]">
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
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">노출여부 *</td>
                  <td className="py-3 px-4 w-[calc(50%-10rem)]">
                    <Select
                      value={formData.displayStatus}
                      onValueChange={(value) => setFormData({ ...formData, displayStatus: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="노출">노출</SelectItem>
                        <SelectItem value="비노출">비노출</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">판매여부 *</td>
                  <td className="py-3 px-4 w-[calc(50%-10rem)]">
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="판매중">판매중</SelectItem>
                        <SelectItem value="품절">품절</SelectItem>
                        <SelectItem value="판매중지">판매중지</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">간략설명</td>
                  <td className="py-3 px-4" colSpan={3}>
                    <Textarea
                      placeholder="상품의 간략한 설명을 입력하세요"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      rows={3}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 상세정보 */}
            <h3 className="text-base font-semibold text-gray-900 mb-4">■ 상세정보</h3>
            <table className="w-full table-fixed">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">상세설명</td>
                  <td className="py-3 px-4" colSpan={3}>
                    <Textarea
                      placeholder="상품의 상세한 설명을 입력하세요"
                      value={formData.detailDescription}
                      onChange={(e) => setFormData({ ...formData, detailDescription: e.target.value })}
                      rows={6}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">이용약관</td>
                  <td className="py-3 px-4" colSpan={3}>
                    <Textarea
                      placeholder="이용약관을 입력하세요"
                      value={formData.terms}
                      onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                      rows={4}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">유의사항</td>
                  <td className="py-3 px-4" colSpan={3}>
                    <Textarea
                      placeholder="유의사항을 입력하세요"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={4}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">상품 이미지</td>
                  <td className="py-3 px-4" colSpan={3}>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="flex flex-col items-center">
                        <p className="text-sm text-gray-600 mb-2">
                          이미지를 업로드하세요 (JPG, PNG, GIF)
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          className="max-w-xs"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
