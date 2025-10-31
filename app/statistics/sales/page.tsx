'use client';

/**
 * 매출분석 페이지
 *
 * 이 페이지는 4개의 탭으로 구성됩니다:
 * 1. 매출통계 - 년별/월별/일별/요일별 통계 (각각 다른 화면)
 * 2. 결제수단매출통계 - 결제수단별 매출 분석
 * 3. 상품분석 - 상품별 판매 분석
 * 4. 지역별매출통계 - 미구현 (추후 구현)
 */

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  mockYearlyStatistics,
  mockMonthlyStatistics,
  mockDailyStatistics,
  mockWeekdayStatistics,
  mockPaymentTypeStatistics,
  mockProductAnalysisStatistics,
  mockTotalSummary,
} from '@/data/mockSalesStatistics';

// ========================================
// 타입 정의
// ========================================

// 메인 탭 타입
type MainTabType = '매출통계' | '결제수단매출통계' | '상품분석';

// 매출통계의 서브 통계 타입
type StatisticsViewType = '년별통계' | '월별통계' | '일별통계' | '요일별통계';

export default function SalesStatisticsPage() {
  // ========================================
  // State 관리
  // ========================================

  // 현재 선택된 메인 탭
  const [activeTab, setActiveTab] = useState<MainTabType>('매출통계');

  // 매출통계 탭에서 선택된 통계 유형
  const [viewType, setViewType] = useState<StatisticsViewType>('요일별통계');

  // 필터 값들
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('10');
  const [device, setDevice] = useState('통합');

  // 결제수단매출통계, 상품분석에서 사용하는 날짜 범위
  const [startDate, setStartDate] = useState('2025-10-31');
  const [endDate, setEndDate] = useState('2025-10-31');

  // 결제수단매출통계에서 사용하는 통계 유형
  type PaymentStatType = '년간통계' | '월간통계' | '주간통계' | '일간통계' | '특정기간통계';
  const [paymentStatType, setPaymentStatType] = useState<PaymentStatType>('특정기간통계');

  // ========================================
  // 유틸리티 함수
  // ========================================

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  // ========================================
  // 메인 탭 목록
  // ========================================

  const mainTabs: MainTabType[] = ['매출통계', '결제수단매출통계', '상품분석'];

  // ========================================
  // 렌더링 함수들
  // ========================================

  /**
   * 매출통계 탭 렌더링
   * 년별/월별/일별/요일별 통계를 선택할 수 있습니다.
   */
  const renderSalesStatistics = () => {
    return (
      <>
        {/* 필터 섹션 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            {/* 년별/월별 통계에는 년도 선택 */}
            {(viewType === '년별통계' || viewType === '월별통계') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">년도</label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024년</SelectItem>
                    <SelectItem value="2025">2025년</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* 일별 통계에는 년도와 월 선택 */}
            {viewType === '일별통계' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">년도</label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024년</SelectItem>
                      <SelectItem value="2025">2025년</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">월</label>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <SelectItem key={m} value={m.toString()}>
                          {m}월
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* 기기 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">기기</label>
              <Select value={device} onValueChange={setDevice}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="통합">통합</SelectItem>
                  <SelectItem value="PC">PC</SelectItem>
                  <SelectItem value="모바일">모바일</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 통계 유형 선택 버튼 */}
          <div className="flex gap-2">
            <Button
              variant={viewType === '년별통계' ? 'default' : 'outline'}
              onClick={() => setViewType('년별통계')}
            >
              년별통계
            </Button>
            <Button
              variant={viewType === '월별통계' ? 'default' : 'outline'}
              onClick={() => setViewType('월별통계')}
            >
              월별통계
            </Button>
            <Button
              variant={viewType === '일별통계' ? 'default' : 'outline'}
              onClick={() => setViewType('일별통계')}
            >
              일별통계
            </Button>
            <Button
              variant={viewType === '요일별통계' ? 'default' : 'outline'}
              onClick={() => setViewType('요일별통계')}
            >
              요일별통계
            </Button>
          </div>
        </div>

        {/* 요약 통계 카드 */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-6">
            {/* 매출 카드 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  매출
                  <span className="text-xs text-gray-500 ml-2">
                    (매출은 상품 + 배송비 - 적립금 - 쿠폰 - 할인 입니다)
                  </span>
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatCurrency(mockTotalSummary.sales)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <span className="text-blue-600">PC</span>
                    <span>{formatCurrency(mockTotalSummary.salesPc)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-green-600">모바일</span>
                    <span>{formatCurrency(mockTotalSummary.salesMobile)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 상품 카드 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">상품</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-primary-600">
                    {formatNumber(mockTotalSummary.products)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <span className="text-blue-600">PC</span>
                    <span>{formatNumber(mockTotalSummary.productsPc)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-green-600">모바일</span>
                    <span>{formatNumber(mockTotalSummary.productsMobile)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 통계 데이터 테이블 - 선택된 유형에 따라 다른 테이블 표시 */}
        <div className="p-6">
          {/* 년별통계 */}
          {viewType === '년별통계' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500">차트 영역</p>
                <p className="text-sm text-gray-400 mt-2">년별 매출/상품 그래프</p>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">년</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">매출</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">상품</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockYearlyStatistics.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{stat.year}</td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">{formatCurrency(stat.sales)}</td>
                      <td className="px-6 py-4 text-sm text-right text-primary-600 font-medium">{formatNumber(stat.products)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 적립금/쿠폰 요약 카드 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">적립금</h3>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(mockTotalSummary.points)}</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">쿠폰</h3>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(mockTotalSummary.coupons)}</p>
                </div>
              </div>

              {/* 적립금/쿠폰 차트 */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500">차트 영역</p>
                <p className="text-sm text-gray-400 mt-2">년별 적립금/쿠폰 추이 그래프</p>
              </div>

              {/* 년별 적립금/쿠폰 테이블 */}
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">년</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">적립금</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">쿠폰</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockYearlyStatistics.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{stat.year}</td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">{formatCurrency(stat.points)}</td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">{formatCurrency(stat.coupons)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 월별통계 */}
          {viewType === '월별통계' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500">차트 영역</p>
                <p className="text-sm text-gray-400 mt-2">월별 매출 추이 그래프</p>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">월</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">매출</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">상품</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockMonthlyStatistics.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{stat.month}</td>
                      <td className="px-6 py-4 text-sm text-right">
                        <div>{formatCurrency(stat.sales)}</div>
                        <div className="text-xs text-gray-500">{stat.salesPercent}%</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-primary-600 font-medium">
                        <div>{formatNumber(stat.products)}</div>
                        <div className="text-xs text-gray-500">{stat.productsPercent}%</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 적립금/쿠폰 요약 카드 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">적립금</h3>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(mockTotalSummary.points)}</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">쿠폰</h3>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(mockTotalSummary.coupons)}</p>
                </div>
              </div>

              {/* 적립금/쿠폰 차트 */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500">적립금/쿠폰 차트 영역</p>
                <p className="text-sm text-gray-400 mt-2">월별 적립금/쿠폰 사용 추이</p>
              </div>

              {/* 월별 적립금/쿠폰 테이블 */}
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">월</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">적립금</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">쿠폰</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockMonthlyStatistics.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{stat.month}</td>
                      <td className="px-6 py-4 text-sm text-right">
                        <div>{formatCurrency(stat.points)}</div>
                        <div className="text-xs text-gray-500">{stat.salesPercent > 0 ? `${stat.salesPercent}%` : '0%'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <div>{formatCurrency(stat.coupons)}</div>
                        <div className="text-xs text-gray-500">{stat.productsPercent > 0 ? `${stat.productsPercent}%` : '0%'}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 일별통계 */}
          {viewType === '일별통계' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500">차트 영역</p>
                <p className="text-sm text-gray-400 mt-2">일별 PC/Mobile 매출 비교 그래프</p>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">날짜</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">매출</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">상품</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockDailyStatistics.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{stat.date}</td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">{formatCurrency(stat.sales)}</td>
                      <td className="px-6 py-4 text-sm text-right text-primary-600 font-medium">{formatNumber(stat.products)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 적립금/쿠폰 요약 카드 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">적립금</h3>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(mockTotalSummary.points)}</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">쿠폰</h3>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(mockTotalSummary.coupons)}</p>
                </div>
              </div>

              {/* 적립금/쿠폰 차트 */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500">적립금/쿠폰 차트 영역</p>
                <p className="text-sm text-gray-400 mt-2">일별 적립금/쿠폰 사용 추이</p>
              </div>

              {/* 일별 적립금/쿠폰 테이블 */}
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">날짜</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">적립금</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">쿠폰</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockDailyStatistics.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{stat.date}</td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">{formatCurrency(stat.points)}</td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">{formatCurrency(stat.coupons)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 요일별통계 */}
          {viewType === '요일별통계' && (
            <div className="space-y-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">요일</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">매출</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">상품</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockWeekdayStatistics.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{stat.weekday}</td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">{formatCurrency(stat.sales)}</td>
                      <td className="px-6 py-4 text-sm text-right text-primary-600 font-medium">{formatNumber(stat.products)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500">차트 영역</p>
                <p className="text-sm text-gray-400 mt-2">요일별 매출/상품 그래프</p>
              </div>

              {/* 적립금/쿠폰 요약 카드 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">적립금</h3>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(mockTotalSummary.points)}</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">쿠폰</h3>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(mockTotalSummary.coupons)}</p>
                </div>
              </div>

              {/* 적립금/쿠폰 차트 */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500">적립금/쿠폰 차트 영역</p>
                <p className="text-sm text-gray-400 mt-2">요일별 적립금/쿠폰 사용 추이</p>
              </div>

              {/* 요일별 적립금/쿠폰 테이블 */}
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">요일</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">적립금</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">쿠폰</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockWeekdayStatistics.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{stat.weekday}</td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">{formatCurrency(stat.points)}</td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">{formatCurrency(stat.coupons)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
    );
  };

  /**
   * 결제수단매출통계 탭 렌더링
   * 결제수단별 매출 분석과 파이차트를 표시합니다.
   */
  const renderPaymentTypeStatistics = () => {
    const totalSales = mockPaymentTypeStatistics.reduce((sum, stat) => sum + stat.sales, 0);

    return (
      <>
        {/* 필터 섹션 */}
        <div className="p-6 border-b border-gray-200">
          {/* 통계 유형 선택 버튼 */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={paymentStatType === '년간통계' ? 'default' : 'outline'}
              onClick={() => setPaymentStatType('년간통계')}
            >
              년간통계
            </Button>
            <Button
              variant={paymentStatType === '월간통계' ? 'default' : 'outline'}
              onClick={() => setPaymentStatType('월간통계')}
            >
              월간통계
            </Button>
            <Button
              variant={paymentStatType === '주간통계' ? 'default' : 'outline'}
              onClick={() => setPaymentStatType('주간통계')}
            >
              주간통계
            </Button>
            <Button
              variant={paymentStatType === '일간통계' ? 'default' : 'outline'}
              onClick={() => setPaymentStatType('일간통계')}
            >
              일간통계
            </Button>
            <Button
              variant={paymentStatType === '특정기간통계' ? 'default' : 'outline'}
              onClick={() => setPaymentStatType('특정기간통계')}
            >
              특정기간통계
            </Button>
          </div>

          {/* 날짜 범위 선택 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <span className="text-gray-500">~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* 빠른 선택 버튼 */}
            <Button variant="outline" size="sm">오늘</Button>
            <Button variant="outline" size="sm">3일</Button>
            <Button variant="outline" size="sm">7일</Button>
            <Button variant="outline" size="sm">1개월</Button>
            <Button variant="outline" size="sm">6개월</Button>
            <Button variant="outline" size="sm">1년</Button>

            <Select value={device} onValueChange={setDevice}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="통합">통합</SelectItem>
                <SelectItem value="PC">PC</SelectItem>
                <SelectItem value="모바일">모바일</SelectItem>
              </SelectContent>
            </Select>

            <Button>검색</Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* 파이차트 영역 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-gray-500 text-lg font-semibold">결제수단별 매출 파이차트</p>
                  <p className="text-sm text-gray-400 mt-2">차트 라이브러리 연동 시 표시됩니다</p>
                  <div className="mt-4 space-y-2">
                    {mockPaymentTypeStatistics.map((stat) => (
                      <div key={stat.rank} className="flex items-center justify-center gap-2 text-sm">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: `hsl(${stat.rank * 90}, 70%, 60%)` }}></div>
                        <span>{stat.paymentType}: {stat.sharePercent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 결제수단 테이블 */}
            <div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">순위</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">결제수단</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">매출(원)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">점유율(%)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockPaymentTypeStatistics.map((stat) => (
                    <tr key={stat.rank} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{stat.rank}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{stat.paymentType}</td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">{formatCurrency(stat.sales)}</td>
                      <td className="px-6 py-4 text-sm text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${stat.sharePercent}%` }}
                            ></div>
                          </div>
                          <span className="text-primary-600 font-semibold">{stat.sharePercent}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-sm font-bold text-gray-900">합계</td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">{formatCurrency(totalSales)}</td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  };

  /**
   * 상품분석 탭 렌더링
   * 상품별 판매 순위와 통계를 표시합니다.
   */
  const renderProductAnalysis = () => {
    const totalSalesCount = mockProductAnalysisStatistics.reduce((sum, stat) => sum + stat.salesCount, 0);
    const totalSalesAmount = mockProductAnalysisStatistics.reduce((sum, stat) => sum + stat.salesTotal, 0);

    return (
      <>
        {/* 날짜 범위 선택 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <span className="text-gray-500">~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* 빠른 선택 버튼 */}
            <Button variant="outline" size="sm">오늘</Button>
            <Button variant="outline" size="sm">1주일</Button>
            <Button variant="outline" size="sm">1개월</Button>
            <Button variant="outline" size="sm">6개월</Button>
            <Button variant="outline" size="sm">1년</Button>

            <Button>검색</Button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">통계 그래프</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-primary-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">총 판매수량</p>
                <p className="text-2xl font-bold text-primary-600">{formatNumber(totalSalesCount)}개</p>
              </div>
              <div className="bg-success-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">총 판매금액</p>
                <p className="text-2xl font-bold text-success-600">{formatCurrency(totalSalesAmount)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">평균 단가</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(Math.round(totalSalesAmount / totalSalesCount))}
                </p>
              </div>
            </div>
          </div>

          {/* 상품 테이블 */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">상품별 판매 순위</h3>
            <Button variant="outline" size="sm">엑셀 다운로드</Button>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">순위</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상품코드</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상품명</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">판매수량</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">판매합계(원)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockProductAnalysisStatistics.map((stat) => (
                <tr key={stat.rank} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{stat.rank}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{stat.productCode}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{stat.productName}</td>
                  <td className="px-6 py-4 text-sm text-right text-primary-600 font-semibold">
                    {formatNumber(stat.salesCount)}개
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 font-semibold">
                    {formatCurrency(stat.salesTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-sm font-bold text-gray-900">합계</td>
                <td className="px-6 py-4 text-sm text-right font-bold text-primary-600">
                  {formatNumber(totalSalesCount)}개
                </td>
                <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                  {formatCurrency(totalSalesAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </>
    );
  };


  // ========================================
  // 메인 렌더링
  // ========================================

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">매출분석</h1>
          <p className="text-gray-600 mt-1">매출 현황을 분석합니다.</p>
        </div>

        {/* 탭과 컨텐츠 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* 탭 네비게이션 */}
          <div className="flex border-b border-gray-200">
            {mainTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 탭 컨텐츠 */}
          {activeTab === '매출통계' && renderSalesStatistics()}
          {activeTab === '결제수단매출통계' && renderPaymentTypeStatistics()}
          {activeTab === '상품분석' && renderProductAnalysis()}
        </div>
      </div>
    </DashboardLayout>
  );
}
