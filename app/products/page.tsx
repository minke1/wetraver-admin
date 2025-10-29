'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { getProducts } from '@/lib/services/productService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { Search, Plus, Filter, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/mock-data/products';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // API 연동을 위한 상태
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // 데이터 로드
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, category, status, searchTerm]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const data = await getProducts(currentPage, itemsPerPage, {
        category: category !== 'all' ? category : undefined,
        status: status !== 'all' ? status : undefined,
        searchTerm: searchTerm || undefined,
      });

      setProducts(data.data);
      setTotal(data.pagination.total);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedProducts.length === 0) {
      toast.error('상품을 선택해주세요.');
      return;
    }
    toast.success(`${selectedProducts.length}개 상품 ${action} 완료`);
    setSelectedProducts([]);
  };

  // 로딩 처리
  if (loading && !products.length) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  // 에러 처리
  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage error={error} retry={loadData} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 제목 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">상품 관리</h1>
            <p className="text-gray-600 mt-1">총 {total}개의 상품</p>
          </div>
          <Link href="/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              상품 등록
            </Button>
          </Link>
        </div>

        {/* 필터 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-900">필터</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="상품명 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="호텔/리조트">호텔/리조트</SelectItem>
                <SelectItem value="패키지">패키지</SelectItem>
                <SelectItem value="액티비티">액티비티</SelectItem>
                <SelectItem value="렌터카">렌터카</SelectItem>
                <SelectItem value="입장권">입장권</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="판매상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="판매중">판매중</SelectItem>
                <SelectItem value="품절">품절</SelectItem>
                <SelectItem value="판매중지">판매중지</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => { setSearchTerm(''); setCategory('all'); setStatus('all'); }}>
              초기화
            </Button>
          </div>
        </div>

        {/* 일괄 작업 */}
        {selectedProducts.length > 0 && (
          <div className="bg-primary-50 rounded-lg p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-primary-900">
              {selectedProducts.length}개 선택됨
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('판매중지')}>
                판매중지
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('삭제')}>
                삭제
              </Button>
            </div>
          </div>
        )}

        {/* 상품 테이블 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <Checkbox
                      checked={selectedProducts.length === products.length && products.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    번호
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이미지
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리/2차분류
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상품명
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    노출/판매
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    판매
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    조회수
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    등록일
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>{product.category}</div>
                      {product.subCategory && (
                        <div className="text-xs text-gray-500">{product.subCategory}</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        <Select defaultValue={product.displayStatus}>
                          <SelectTrigger className="h-8 w-24 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="노출">노출</SelectItem>
                            <SelectItem value="비노출">비노출</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue={product.status}>
                          <SelectTrigger className="h-8 w-24 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="판매중">판매중</SelectItem>
                            <SelectItem value="품절">품절</SelectItem>
                            <SelectItem value="판매중지">판매중지</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Button size="sm" variant="outline" className="h-8">
                        판매
                      </Button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.views}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(product.createdAt).toISOString().split('T')[0]}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8">
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8">
                          <Trash2 className="h-3 w-3" />
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
