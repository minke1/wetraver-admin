'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { getDailyRevenue, getRegionStats, getMemberStats } from '@/lib/mock-data/dashboard';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { TrendingUp, DollarSign, Users, MapPin } from 'lucide-react';

const COLORS = ['#2D7FF9', '#10B981', '#F59E0B', '#EF4444'];

export default function RevenueStatisticsPage() {
  const dailyRevenue = getDailyRevenue();
  const regionStats = getRegionStats();
  const memberStats = getMemberStats();

  const totalRevenue = dailyRevenue.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = dailyRevenue.reduce((sum, day) => sum + day.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 제목 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">매출 통계</h1>
          <p className="text-gray-600 mt-1">최근 30일 매출 현황</p>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-primary-50 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">총 매출</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  ₩{(totalRevenue / 1000000).toFixed(1)}M
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-1 text-success-500">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">12.5%</span>
              <span className="text-sm text-gray-500">전월 대비</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-success-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">총 주문 수</p>
                <h3 className="text-2xl font-bold text-gray-900">{totalOrders}</h3>
              </div>
            </div>
            <div className="flex items-center gap-1 text-success-500">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">8.3%</span>
              <span className="text-sm text-gray-500">전월 대비</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-warning-50 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-warning-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">평균 주문액</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  ₩{Math.floor(avgOrderValue).toLocaleString()}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-1 text-success-500">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">4.1%</span>
              <span className="text-sm text-gray-500">전월 대비</span>
            </div>
          </div>
        </div>

        {/* 일별 매출 및 주문 추이 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">일별 매출 및 주문 추이</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => format(new Date(value), 'MM/dd')}
                fontSize={12}
              />
              <YAxis yAxisId="left" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" fontSize={12} />
              <Tooltip
                labelFormatter={(label) => format(new Date(label), 'yyyy-MM-dd')}
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? `₩${value.toLocaleString()}` : `${value}건`,
                  name === 'revenue' ? '매출' : '주문',
                ]}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#2D7FF9"
                strokeWidth={2}
                name="매출"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#10B981"
                strokeWidth={2}
                name="주문"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 지역별 / 회원등급별 통계 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 지역별 매출 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">지역별 매출 (Top 5)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionStats.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="region" type="category" fontSize={12} width={80} />
                <Tooltip formatter={(value: number) => `₩${value.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#2D7FF9" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 회원등급별 분포 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">회원등급별 분포</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={memberStats as never[]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {memberStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 지역별 상세 통계 테이블 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">지역별 상세 통계</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    지역
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    주문 수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    매출액
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    평균 주문액
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {regionStats.map((stat) => (
                  <tr key={stat.region} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{stat.region}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {stat.orders}건
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₩{stat.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ₩{Math.floor(stat.revenue / stat.orders).toLocaleString()}
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
