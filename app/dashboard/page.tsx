'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  getDashboardStats,
  getDailyRevenue,
  getProductSales,
  getRecentReservations,
} from '@/lib/services/dashboardService';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { TravelReservation } from '@/types/reservation';
import type { DashboardStats, DailyRevenue, ProductSales } from '@/lib/mock-data/dashboard';

const COLORS = ['#2D7FF9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
}) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="h-12 w-12 bg-primary-50 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary-500" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-success-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-error-500" />
        )}
        <span className={`text-sm font-medium ${isPositive ? 'text-success-500' : 'text-error-500'}`}>
          {Math.abs(change)}%
        </span>
        <span className="text-sm text-gray-500">지난달 대비</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // API 연동을 위한 상태
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
  const [productSales, setProductSales] = useState<ProductSales[]>([]);
  const [recentReservations, setRecentReservations] = useState<TravelReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [statsData, revenueData, salesData, reservationsData] = await Promise.all([
        getDashboardStats(),
        getDailyRevenue(),
        getProductSales(),
        getRecentReservations(),
      ]);

      setStats(statsData);
      setDailyRevenue(revenueData);
      setProductSales(salesData);
      setRecentReservations(reservationsData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  // 로딩 처리
  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  // 에러 처리
  if (error || !stats) {
    return (
      <DashboardLayout>
        <ErrorMessage error={error || new Error('데이터를 불러올 수 없습니다.')} retry={loadData} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 제목 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600 mt-1">전체 시스템 현황을 한눈에 확인하세요</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="총 매출"
            value={`₩${(stats.totalRevenue / 1000000).toFixed(1)}M`}
            change={stats.revenueChange}
            icon={DollarSign}
          />
          <StatCard
            title="총 주문"
            value={stats.totalOrders.toLocaleString()}
            change={stats.ordersChange}
            icon={ShoppingCart}
          />
          <StatCard
            title="총 회원"
            value={stats.totalMembers.toLocaleString()}
            change={stats.membersChange}
            icon={Users}
          />
          <StatCard
            title="활성 상품"
            value={stats.activeProducts.toLocaleString()}
            change={stats.productsChange}
            icon={Package}
          />
        </div>

        {/* 차트 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 일별 매출 추이 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">일별 매출 추이</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), 'MM/dd')}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip
                  formatter={(value: number) => [`₩${value.toLocaleString()}`, '매출']}
                  labelFormatter={(label) => format(new Date(label), 'yyyy-MM-dd')}
                />
                <Bar dataKey="revenue" fill="#2D7FF9" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 상품별 판매 현황 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">상품별 판매 현황 (Top 5)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productSales.slice(0, 5) as never[]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {productSales.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₩${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 최근 예약 목록 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">최근 예약</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    예약번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상품명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    예약자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    여행일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    금액
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reservation.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {reservation.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {reservation.checkIn || reservation.reservationDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          reservation.status === '결제완료' || reservation.status === '이용완료'
                            ? 'bg-success-100 text-success-800'
                            : reservation.status === '결제대기'
                            ? 'bg-warning-100 text-warning-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₩{(reservation.priceKRW || reservation.totalAmountKRW || 0).toLocaleString()}
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
