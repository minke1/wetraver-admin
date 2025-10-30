'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
import {
  getSettlements,
  getSettlementStats,
  getSettlementSalesStats,
  getSettlementPeriodStats,
} from '@/lib/services/settlementService';
import type {
  Settlement,
  SettlementFilters,
  SettlementStats,
  SettlementSalesStats,
  SettlementPeriodStats,
  SettlementPaymentMethod,
} from '@/types/settlement';
import { Download } from 'lucide-react';

const paymentMethods: { value: SettlementPaymentMethod; label: string }[] = [
  { value: '신용카드', label: '신용카드' },
  { value: '실시간계좌이체', label: '실시간계좌이체' },
  { value: '포인트', label: '포인트' },
];

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [stats, setStats] = useState<SettlementStats | null>(null);
  const [salesStats, setSalesStats] = useState<SettlementSalesStats | null>(
    null
  );
  const [periodStats, setPeriodStats] = useState<SettlementPeriodStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState<SettlementFilters>({
    category: 'all',
    paymentMethods: [],
    searchType: '예약번호',
    searchQuery: '',
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [settlementsData, statsData, salesStatsData, periodStatsData] = await Promise.all([
        getSettlements(page, limit, filters),
        getSettlementStats(),
        getSettlementSalesStats(),
        getSettlementPeriodStats(),
      ]);

      setSettlements(settlementsData.data);
      setTotal(settlementsData.pagination.total);
      setStats(statsData);
      setSalesStats(salesStatsData);
      setPeriodStats(periodStatsData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = () => {
    setPage(1);
    loadData();
  };

  const togglePaymentMethod = (method: SettlementPaymentMethod) => {
    setFilters((prev) => {
      const methods = prev.paymentMethods || [];
      if (methods.includes(method)) {
        return {
          ...prev,
          paymentMethods: methods.filter((m) => m !== method),
        };
      }
      return { ...prev, paymentMethods: [...methods, method] };
    });
  };

  if (loading && settlements.length === 0) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

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
        {/* 헤더 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">정산관리</h1>
          <p className="text-sm text-gray-500 mt-1">
            상품 정산 내역을 관리합니다
          </p>
        </div>

        {/* 기간별 매출 통계 */}
        {periodStats && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  금일 매출액
                  <span className="text-xs text-gray-500 ml-1">※현재기준</span>
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  {periodStats.todaySales.toLocaleString()}원
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">전일 매출액</p>
                <p className="text-xl font-semibold text-gray-900">
                  {periodStats.yesterdaySales.toLocaleString()}원
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">전주 매출액</p>
                <p className="text-xl font-semibold text-gray-900">
                  {periodStats.lastWeekSales.toLocaleString()}원
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">당월 매출액</p>
                <p className="text-xl font-semibold text-gray-900">
                  {periodStats.thisMonthSales.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 판매상태 통계 */}
        {salesStats && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              판매상태 최근 1주일 이내
            </h3>
            <div className="grid grid-cols-7 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">예약접수</p>
                <p className="text-lg font-semibold text-gray-900">
                  {salesStats.예약접수.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">예약가능</p>
                <p className="text-lg font-semibold text-gray-900">
                  {salesStats.예약가능.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">결제완료</p>
                <p className="text-lg font-semibold text-gray-900">
                  {salesStats.결제완료.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">예약확정</p>
                <p className="text-lg font-semibold text-gray-900">
                  {salesStats.예약확정.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">예약취소</p>
                <p className="text-lg font-semibold text-gray-900">
                  {salesStats.예약취소.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">예약불가</p>
                <p className="text-lg font-semibold text-gray-900">
                  {salesStats.예약불가.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">이용완료</p>
                <p className="text-lg font-semibold text-gray-900">
                  {salesStats.이용완료.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 필터 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="divide-y divide-gray-200">
            {/* 카테고리 */}
            <div className="flex items-center gap-4 py-3">
              <div className="font-medium text-gray-700 w-24">카테고리</div>
              <div className="flex gap-2">
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    setFilters({ ...filters, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="1차분류" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="Hotels">Hotels</SelectItem>
                    <SelectItem value="Tour">Tour</SelectItem>
                    <SelectItem value="K-Beauty">K-Beauty</SelectItem>
                    <SelectItem value="Tickets">Tickets</SelectItem>
                    <SelectItem value="Dining">Dining</SelectItem>
                    <SelectItem value="Vehicle">Vehicle</SelectItem>
                    <SelectItem value="K-goods">K-goods</SelectItem>
                    <SelectItem value="Guide">Guide</SelectItem>
                    <SelectItem value="Golf">Golf</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 결제방법 */}
            <div className="flex items-center gap-4 py-3">
              <div className="font-medium text-gray-700 w-24">결제방법</div>
              <div className="flex gap-4">
                {paymentMethods.map((method) => (
                  <div key={method.value} className="flex items-center gap-2">
                    <Checkbox
                      checked={filters.paymentMethods?.includes(method.value)}
                      onCheckedChange={() => togglePaymentMethod(method.value)}
                      id={`payment-${method.value}`}
                    />
                    <label
                      htmlFor={`payment-${method.value}`}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {method.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 검색어 */}
            <div className="flex items-center gap-4 py-3">
              <div className="font-medium text-gray-700 w-24">검색어</div>
              <div className="flex gap-2">
                <Select
                  value={filters.searchType}
                  onValueChange={(value: '예약번호' | '예약자명' | '담당자명' | '상품명' | '예약지휴대폰') =>
                    setFilters({ ...filters, searchType: value })
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="예약번호">예약번호</SelectItem>
                    <SelectItem value="예약자명">예약자명</SelectItem>
                    <SelectItem value="담당자명">담당자명</SelectItem>
                    <SelectItem value="상품명">상품명</SelectItem>
                    <SelectItem value="예약지휴대폰">예약지휴대폰</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={filters.searchQuery}
                  onChange={(e) =>
                    setFilters({ ...filters, searchQuery: e.target.value })
                  }
                  placeholder="검색어를 입력하세요"
                  className="w-80"
                />
                <Button onClick={handleSearch}>검색하기</Button>
              </div>
            </div>
          </div>
        </div>

        {/* 전체 정산대기 통계 */}
        {stats && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              전체 정산대기 통계
            </h3>
            <div className="grid grid-cols-6 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">판매금액</p>
                <p className="text-lg font-semibold text-blue-600">
                  {stats.salesAmount.toLocaleString()}원
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">수수료</p>
                <p className="text-lg font-semibold text-red-600">
                  {stats.commission.toLocaleString()}원
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">포인트</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats.points.toLocaleString()}원
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">쿠폰</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats.coupon.toLocaleString()}원
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">총수익</p>
                <p className="text-lg font-semibold text-green-600">
                  {stats.totalProfit.toLocaleString()}원
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">판매갯수</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats.salesCount}건
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 테이블 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-700">
                ■ 총 {total}개의 예약이 있습니다.
              </p>
              <Select
                value={limit.toString()}
                onValueChange={(value) => setLimit(Number(value))}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30개</SelectItem>
                  <SelectItem value="50">50개</SelectItem>
                  <SelectItem value="100">100개</SelectItem>
                  <SelectItem value="200">200개</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              다운로드
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    번호
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    예약번호
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    상태
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    상품구분
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    상품명
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    수수료
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    포인트
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    쿠폰
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
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    상품금액(원)
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    결제방법
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    정산상태
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {settlements.map((settlement, index) => (
                  <tr key={settlement.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">
                      {total - (page - 1) * limit - index}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {settlement.reservationNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {settlement.status}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      ({settlement.productCategory})
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/settlements/${settlement.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {settlement.productName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {settlement.commission.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {settlement.points}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {settlement.coupon}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {settlement.reservationDate}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900">
                        {settlement.customerName}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {settlement.customerId}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900">{settlement.phone}</div>
                      <div className="text-gray-500 text-xs">
                        {settlement.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {settlement.priceKRW.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {settlement.paymentMethod}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded ${
                          settlement.settlementStatus === '정산완료'
                            ? 'bg-green-100 text-green-700'
                            : settlement.settlementStatus === '정산보류'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {settlement.settlementStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/settlements/${settlement.id}`}>
                          <Button variant="outline" size="sm">
                            수정
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          삭제
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className="p-4 border-t border-gray-200 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              &lt;&lt; 처음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              &lt; 이전
            </Button>
            <span className="px-4 py-2 text-sm text-gray-700">
              {page} 페이지
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={settlements.length < limit}
            >
              다음 &gt;
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.ceil(total / limit))}
              disabled={settlements.length < limit}
            >
              맨끝 &gt;&gt;
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
