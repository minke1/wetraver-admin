"use client";

/**
 * 회원및 방문분석 페이지
 *
 * 이 페이지는 3개의 탭으로 구성됩니다:
 * 1. 회원가입통계 - 회원 가입/탈퇴 분석
 * 2. 방문자수통계 - 방문자 추이 분석
 * 3. 검색어통계 - 검색어 사용 분석
 */

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  mockMemberYearStatistics,
  mockMemberMonthStatistics,
  mockMemberDayStatistics,
  mockMemberWeekdayStatistics,
  mockMemberHourStatistics,
  mockMemberSummary,
  mockVisitorYearStatistics,
  mockVisitorMonthStatistics,
  mockVisitorDayStatistics,
  mockVisitorWeekdayStatistics,
} from "@/data/mockMemberStatistics";

// ========================================
// 타입 정의
// ========================================

// 메인 탭 타입
type TabType = "회원가입통계" | "방문자수통계" | "검색어통계";

// 회원가입통계 통계 유형
type MemberStatType =
  | "년별통계"
  | "월별통계"
  | "일별통계"
  | "요일별통계"
  | "시간별통계";

// 방문자수통계 통계 유형
type VisitorStatType = "년별통계" | "월별통계" | "일별통계" | "요일별통계";

// 검색어통계 통계 유형
type SearchStatType =
  | "년간통계"
  | "월간통계"
  | "주간통계"
  | "일간통계"
  | "특정기간통계";

export default function MemberStatisticsPage() {
  // ========================================
  // State 관리
  // ========================================

  // 현재 선택된 탭
  const [activeTab, setActiveTab] = useState<TabType>("회원가입통계");

  // 회원가입통계 통계 유형
  const [memberStatType, setMemberStatType] =
    useState<MemberStatType>("시간별통계");

  // 방문자수통계 통계 유형
  const [visitorStatType, setVisitorStatType] =
    useState<VisitorStatType>("요일별통계");

  // 검색어통계 통계 유형
  const [searchStatType, setSearchStatType] =
    useState<SearchStatType>("특정기간통계");

  // 필터 값들
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("10");
  const [day, setDay] = useState("31");
  const [week, setWeek] = useState("전체");
  const [device, setDevice] = useState("통합");

  // 검색어통계 날짜 범위
  const [startDate, setStartDate] = useState("2025-10-31");
  const [endDate, setEndDate] = useState("2025-10-31");

  // ========================================
  // 유틸리티 함수
  // ========================================

  // const formatNumber = (num: number) => {
  //   return num.toLocaleString('ko-KR');
  // };

  // ========================================
  // 탭 목록
  // ========================================

  const tabs: TabType[] = ["회원가입통계", "방문자수통계", "검색어통계"];

  // ========================================
  // 렌더링 함수들
  // ========================================

  /**
   * 회원가입통계 탭 렌더링
   */
  const renderMemberStatistics = () => {
    // 각 통계 유형별로 컬럼 헤더 결정
    const getMemberPeriodLabel = () => {
      switch (memberStatType) {
        case "년별통계":
          return "년";
        case "월별통계":
          return "월";
        case "일별통계":
          return "날짜";
        case "요일별통계":
          return "요일";
        case "시간별통계":
          return "시간대";
        default:
          return "기간";
      }
    };

    // 각 통계 유형별로 표시할 데이터 결정
    const getMemberData = () => {
      switch (memberStatType) {
        case "년별통계":
          return mockMemberYearStatistics;
        case "월별통계":
          return mockMemberMonthStatistics;
        case "일별통계":
          return mockMemberDayStatistics;
        case "요일별통계":
          return mockMemberWeekdayStatistics;
        case "시간별통계":
          return mockMemberHourStatistics;
        default:
          return mockMemberHourStatistics;
      }
    };

    const memberData = getMemberData();

    return (
      <>
        {/* 필터 섹션 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                년도
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                월
              </label>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                일
              </label>
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <SelectItem key={d} value={d.toString()}>
                      {d}일
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 통계 유형 선택 버튼 */}
          <div className="flex gap-2">
            <Button
              variant={memberStatType === "년별통계" ? "default" : "outline"}
              onClick={() => setMemberStatType("년별통계")}
            >
              년별통계
            </Button>
            <Button
              variant={memberStatType === "월별통계" ? "default" : "outline"}
              onClick={() => setMemberStatType("월별통계")}
            >
              월별통계
            </Button>
            <Button
              variant={memberStatType === "일별통계" ? "default" : "outline"}
              onClick={() => setMemberStatType("일별통계")}
            >
              일별통계
            </Button>
            <Button
              variant={memberStatType === "요일별통계" ? "default" : "outline"}
              onClick={() => setMemberStatType("요일별통계")}
            >
              요일별통계
            </Button>
            <Button
              variant={memberStatType === "시간별통계" ? "default" : "outline"}
              onClick={() => setMemberStatType("시간별통계")}
            >
              시간별통계
            </Button>
          </div>
        </div>

        {/* 요약 통계 */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">회원가입자수</p>
              <p className="text-2xl font-bold text-primary-600">
                {mockMemberSummary.totalSignupCount.toLocaleString()}명
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-1">
                  <span className="text-blue-600">PC</span>
                  <span>0</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-600">모바일</span>
                  <span>1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 데이터 테이블 */}
        <div className="p-6">
          {/* 차트 영역 */}
          <div className="mb-6 p-8 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-500">차트 영역</p>
            <p className="text-sm text-gray-400 mt-2">
              시간별 회원 가입 추이 그래프가 표시됩니다.
            </p>
          </div>

          {/* 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {getMemberPeriodLabel()}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    회원가입자수
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    회원탈퇴자수
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {memberData.map((stat, index) => {
                  const totalSignupCount = memberData.reduce(
                    (sum, s) => sum + s.signupCount,
                    0
                  );
                  const totalWithdrawalCount = memberData.reduce(
                    (sum, s) => sum + s.withdrawalCount,
                    0
                  );
                  const signupPercentage =
                    totalSignupCount > 0
                      ? ((stat.signupCount / totalSignupCount) * 100).toFixed(1)
                      : "0";
                  const withdrawalPercentage =
                    totalWithdrawalCount > 0
                      ? ((stat.withdrawalCount / totalWithdrawalCount) * 100).toFixed(1)
                      : "0";

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stat.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-gray-900">
                            {stat.signupCount.toLocaleString()}
                          </span>
                          <div className="text-xs text-gray-500">
                            {signupPercentage}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-gray-900">
                            {stat.withdrawalCount.toLocaleString()}
                          </span>
                          <div className="text-xs text-gray-500">
                            {withdrawalPercentage}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    합계
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-900">
                    {memberData
                      .reduce((sum, s) => sum + s.signupCount, 0)
                      .toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-900">
                    {memberData
                      .reduce((sum, s) => sum + s.withdrawalCount, 0)
                      .toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </>
    );
  };

  /**
   * 방문자수통계 탭 렌더링
   */
  const renderVisitorStatistics = () => {
    // 각 통계 유형별로 컬럼 헤더 결정
    const getPeriodLabel = () => {
      switch (visitorStatType) {
        case "년별통계":
          return "년";
        case "월별통계":
          return "월";
        case "일별통계":
          return "날짜";
        case "요일별통계":
          return "요일";
        default:
          return "기간";
      }
    };

    // 각 통계 유형별로 표시할 데이터 결정
    const getVisitorData = () => {
      switch (visitorStatType) {
        case "년별통계":
          return mockVisitorYearStatistics;
        case "월별통계":
          return mockVisitorMonthStatistics;
        case "일별통계":
          return mockVisitorDayStatistics;
        case "요일별통계":
          return mockVisitorWeekdayStatistics;
        default:
          return mockVisitorWeekdayStatistics;
      }
    };

    const visitorData = getVisitorData();

    return (
      <>
        {/* 필터 섹션 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            {/* 년별통계: 기기만 표시 */}
            {visitorStatType === "년별통계" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기기
                </label>
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
            )}

            {/* 월별통계: 년도 + 기기 */}
            {visitorStatType === "월별통계" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    년도
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    기기
                  </label>
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
              </>
            )}

            {/* 일별통계: 년도 + 월 + 기기 */}
            {visitorStatType === "일별통계" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    년도
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    월
                  </label>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    기기
                  </label>
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
              </>
            )}

            {/* 요일별통계: 년도 + 월 + 주 + 기기 */}
            {visitorStatType === "요일별통계" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    년도
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    월
                  </label>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    주
                  </label>
                  <Select value={week} onValueChange={setWeek}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="전체">전체</SelectItem>
                      <SelectItem value="1주">
                        1주 (2025-09-28~2025-10-04)
                      </SelectItem>
                      <SelectItem value="2주">
                        2주 (2025-10-05~2025-10-11)
                      </SelectItem>
                      <SelectItem value="3주">
                        3주 (2025-10-12~2025-10-18)
                      </SelectItem>
                      <SelectItem value="4주">
                        4주 (2025-10-19~2025-10-25)
                      </SelectItem>
                      <SelectItem value="5주">
                        5주 (2025-10-26~2025-11-01)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    기기
                  </label>
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
              </>
            )}
          </div>

          {/* 통계 유형 선택 버튼 */}
          <div className="flex gap-2">
            <Button
              variant={visitorStatType === "년별통계" ? "default" : "outline"}
              onClick={() => setVisitorStatType("년별통계")}
            >
              년별통계
            </Button>
            <Button
              variant={visitorStatType === "월별통계" ? "default" : "outline"}
              onClick={() => setVisitorStatType("월별통계")}
            >
              월별통계
            </Button>
            <Button
              variant={visitorStatType === "일별통계" ? "default" : "outline"}
              onClick={() => setVisitorStatType("일별통계")}
            >
              일별통계
            </Button>
            <Button
              variant={visitorStatType === "요일별통계" ? "default" : "outline"}
              onClick={() => setVisitorStatType("요일별통계")}
            >
              요일별통계
            </Button>
          </div>
        </div>

        {/* 데이터 테이블 */}
        <div className="p-6">
          {/* 차트 영역 */}
          <div className="mb-6 p-8 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-500">차트 영역</p>
            <p className="text-sm text-gray-400 mt-2">
              방문자수 추이 그래프가 표시됩니다.
            </p>
          </div>

          {/* 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {getPeriodLabel()}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    방문자수
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visitorData.map((stat, index) => {
                  const totalVisitors = visitorData.reduce(
                    (sum, s) => sum + s.visitorCount,
                    0
                  );
                  const percentage =
                    totalVisitors > 0
                      ? ((stat.visitorCount / totalVisitors) * 100).toFixed(1)
                      : "0";

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stat.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-gray-900">
                            {stat.visitorCount.toLocaleString()}
                          </span>
                          <div className="text-xs text-gray-500">
                            {percentage}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  /**
   * 검색어통계 탭 렌더링
   */
  const renderSearchStatistics = () => {
    return (
      <>
        {/* 필터 섹션 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-4">
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
            <Button variant="outline" size="sm">
              검색
            </Button>
            <Button variant="outline" size="sm">
              오늘
            </Button>
            <Button variant="outline" size="sm">
              3일
            </Button>
            <Button variant="outline" size="sm">
              7일
            </Button>
            <Button variant="outline" size="sm">
              1개월
            </Button>
          </div>

          {/* 통계 유형 선택 버튼 */}
          <div className="flex gap-2">
            <Button
              variant={searchStatType === "년간통계" ? "default" : "outline"}
              onClick={() => setSearchStatType("년간통계")}
            >
              년간통계
            </Button>
            <Button
              variant={searchStatType === "월간통계" ? "default" : "outline"}
              onClick={() => setSearchStatType("월간통계")}
            >
              월간통계
            </Button>
            <Button
              variant={searchStatType === "주간통계" ? "default" : "outline"}
              onClick={() => setSearchStatType("주간통계")}
            >
              주간통계
            </Button>
            <Button
              variant={searchStatType === "일간통계" ? "default" : "outline"}
              onClick={() => setSearchStatType("일간통계")}
            >
              일간통계
            </Button>
            <Button
              variant={
                searchStatType === "특정기간통계" ? "default" : "outline"
              }
              onClick={() => setSearchStatType("특정기간통계")}
            >
              특정기간통계
            </Button>
          </div>
        </div>

        {/* 데이터 테이블 */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    순위
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    검색어
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    검색수
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    점유률
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* 데이터가 없는 경우 */}
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    검색어 데이터가 없습니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
          <h1 className="text-2xl font-bold text-gray-900">회원및 방문분석</h1>
          <p className="text-gray-600 mt-1">
            회원 가입 및 방문 현황을 분석합니다.
          </p>
        </div>

        {/* 탭과 컨텐츠 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* 탭 네비게이션 */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 탭 컨텐츠 */}
          {activeTab === "회원가입통계" && renderMemberStatistics()}
          {activeTab === "방문자수통계" && renderVisitorStatistics()}
          {activeTab === "검색어통계" && renderSearchStatistics()}
        </div>
      </div>
    </DashboardLayout>
  );
}
