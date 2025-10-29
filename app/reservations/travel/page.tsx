'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { getReservations, getReservationStats } from '@/lib/services/reservationService';
import {
  ReservationFilters,
  ProductCategory,
  PaymentMethod,
  ReservationStatus,
  TravelReservation,
  ReservationStats,
} from '@/types/reservation';

const categories: ProductCategory[] = [
  'Hotels',
  'Tour',
  'K-Beauty',
  'Tickets',
  'Dining',
  'Vehicle',
  'K-goods',
  'Guide',
  'Golf',
];

const paymentMethods: PaymentMethod[] = [
  '신용카드',
  '실시간계좌이체',
  '포인트',
];

const statuses: ReservationStatus[] = [
  '예약접수',
  '결제완료',
  '결제대기',
  '예약취소',
  '이용완료',
];

const dateTypes = ['예약일', '선금결제일', '잔금결제일', '취소일'] as const;
const searchTypes = [
  '예약번호',
  '예약자명',
  '담당자명',
  '상품명',
  '예약지휴대폰',
] as const;

const statusColors: Record<ReservationStatus, string> = {
  예약접수: 'bg-blue-100 text-blue-700',
  예약가능: 'bg-green-100 text-green-700',
  결제완료: 'bg-purple-100 text-purple-700',
  예약확정: 'bg-indigo-100 text-indigo-700',
  결제대기: 'bg-yellow-100 text-yellow-700',
  예약취소: 'bg-red-100 text-red-700',
  예약불가: 'bg-gray-100 text-gray-700',
  이용완료: 'bg-teal-100 text-teal-700',
};

export default function TravelReservationsPage() {
  const [filters, setFilters] = useState<ReservationFilters>({
    paymentMethods: [],
    statuses: [],
    dateType: '예약일',
    searchType: '예약번호',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);

  // API 연동을 위한 상태
  const [reservations, setReservations] = useState<TravelReservation[]>([]);
  const [stats, setStats] = useState<ReservationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  // 데이터 로드
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, filters]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [reservationsData, statsData] = await Promise.all([
        getReservations(currentPage, itemsPerPage, filters),
        getReservationStats(),
      ]);

      setReservations(reservationsData.data);
      setTotalPages(reservationsData.pagination.totalPages);
      setStats(statsData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  const totalItems = reservations.length;
  const paginatedReservations = reservations;

  const handlePaymentMethodToggle = (method: PaymentMethod) => {
    setFilters((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods?.includes(method)
        ? prev.paymentMethods.filter((m) => m !== method)
        : [...(prev.paymentMethods || []), method],
    }));
  };

  const handleStatusToggle = (status: ReservationStatus) => {
    setFilters((prev) => ({
      ...prev,
      statuses: prev.statuses?.includes(status)
        ? prev.statuses.filter((s) => s !== status)
        : [...(prev.statuses || []), status],
    }));
  };

  // 로딩 처리
  if (loading && !reservations.length) {
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">여행상품예약</h1>
          <p className="text-sm text-gray-500 mt-1">
            여행 상품 예약 내역을 관리합니다
          </p>
        </div>

      {/* 검색 필터 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 divide-y divide-gray-200">
          {/* 카테고리 */}
          <div className="flex gap-4 items-center pb-4">
            <label className="text-sm font-medium text-gray-700 w-24 flex-shrink-0">
              카테고리
            </label>
            <div className="flex gap-4">
              <Select
                value={filters.category}
                onValueChange={(value) =>
                  setFilters({ ...filters, category: value as ProductCategory })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="1차분류" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="2차분류" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="3차분류" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 결제방법 */}
          <div className="flex gap-4 items-center py-4">
            <label className="text-sm font-medium text-gray-700 w-24 flex-shrink-0">
              결제방법
            </label>
            <div className="flex gap-6">
              {paymentMethods.map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    id={`payment-${method}`}
                    checked={filters.paymentMethods?.includes(method)}
                    onCheckedChange={() => handlePaymentMethodToggle(method)}
                  />
                  <label
                    htmlFor={`payment-${method}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {method}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 예약상품상태 */}
          <div className="flex gap-4 items-center py-4">
            <label className="text-sm font-medium text-gray-700 w-24 flex-shrink-0">
              예약상품상태
            </label>
            <div className="flex gap-6 flex-wrap">
              {statuses.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.statuses?.includes(status)}
                    onCheckedChange={() => handleStatusToggle(status)}
                  />
                  <label
                    htmlFor={`status-${status}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 기간검색 */}
          <div className="flex gap-4 items-center py-4">
            <label className="text-sm font-medium text-gray-700 w-24 flex-shrink-0">
              기간검색
            </label>
            <div className="flex gap-2 items-center flex-wrap">
              <Select
                value={filters.dateType}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    dateType: value as (typeof dateTypes)[number],
                  })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                오늘
              </Button>
              <Button variant="outline" size="sm">
                1주일
              </Button>
              <Button variant="outline" size="sm">
                1개월
              </Button>
              <Button variant="outline" size="sm">
                6개월
              </Button>
              <Button variant="outline" size="sm">
                1년
              </Button>

              <Input type="date" className="w-40" />
              <span className="text-gray-500">~</span>
              <Input type="date" className="w-40" />
            </div>
          </div>

          {/* 검색어 */}
          <div className="flex gap-4 items-center py-4">
            <label className="text-sm font-medium text-gray-700 w-24 flex-shrink-0">
              검색어
            </label>
            <div className="flex gap-2 max-w-2xl">
              <Select
                value={filters.searchType}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    searchType: value as (typeof searchTypes)[number],
                  })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {searchTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="검색어를 입력하세요"
                className="w-96"
                value={filters.searchQuery || ''}
                onChange={(e) =>
                  setFilters({ ...filters, searchQuery: e.target.value })
                }
              />
            </div>
          </div>

          {/* 검색 버튼 */}
          <div className="flex justify-center pt-6">
            <Button className="px-12">
              <Search className="h-4 w-4 mr-2" />
              검색하기
            </Button>
          </div>
        </div>
      </div>

      {/* 통계 요약 */}
      {stats && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            전체 예약내역 통계 <span className="text-gray-500">(최근 1주일 이내)</span>
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(stats)
              .filter(([status]) => !['예약가능', '예약확정', '예약불가'].includes(status))
              .map(([status, amount]) => (
                <div key={status} className="text-center">
                  <div className="text-sm text-gray-600 mb-1">{status}</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {amount.toLocaleString()}원
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 테이블 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-700">
          총 <span className="font-semibold text-primary-600">{totalItems}</span>개의
          예약이 있습니다.
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30개</SelectItem>
              <SelectItem value="50">50개</SelectItem>
              <SelectItem value="100">100개</SelectItem>
              <SelectItem value="200">200개</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            다운로드
          </Button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">번호</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  예약번호
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">상태</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  상품구분
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  상품명
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  예약일시
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  예약자/아이디
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  연락처/이메일
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">
                  상품금액(원)
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  결제방법
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-700">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{reservation.id}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/reservations/travel/${reservation.id}`}
                      className="text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      {reservation.reservationNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[reservation.status]
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    ({reservation.productCategory})
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/reservations/travel/${reservation.id}`}
                      className="text-gray-900 hover:text-primary-600 hover:underline max-w-xs truncate block"
                    >
                      {reservation.productName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {reservation.reservationDate}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-900">{reservation.customerName}</div>
                    <div className="text-gray-500 text-xs">
                      {reservation.customerId}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-700">{reservation.phone}</div>
                    <div className="text-gray-500 text-xs">{reservation.email}</div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {reservation.priceKRW.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {reservation.paymentMethod || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/reservations/travel/${reservation.id}`}>
                          수정
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
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

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          이전
        </Button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = i + 1;
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          다음
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      </div>
    </DashboardLayout>
  );
}
