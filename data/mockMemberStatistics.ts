export interface MemberStatistic {
  period: string; // 기간 (시간, 일, 월, 년도 등)
  signupCount: number; // 가입자수
  withdrawalCount: number; // 탈퇴자수
  netCount: number; // 순증감 (가입-탈퇴)
}

export interface MemberSummary {
  totalSignupCount: number;
  totalWithdrawalCount: number;
  totalNetCount: number;
}

// 년별 회원 가입/탈퇴 데이터
export const mockMemberYearStatistics: MemberStatistic[] = [
  { period: '2024', signupCount: 2, withdrawalCount: 1, netCount: 1 },
  { period: '2025', signupCount: 35, withdrawalCount: 1, netCount: 34 },
];

// 월별 회원 가입/탈퇴 데이터
export const mockMemberMonthStatistics: MemberStatistic[] = [
  { period: '2025-01', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-02', signupCount: 3, withdrawalCount: 0, netCount: 3 },
  { period: '2025-03', signupCount: 1, withdrawalCount: 0, netCount: 1 },
  { period: '2025-04', signupCount: 1, withdrawalCount: 0, netCount: 1 },
  { period: '2025-05', signupCount: 1, withdrawalCount: 0, netCount: 1 },
  { period: '2025-06', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-07', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-08', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-09', signupCount: 7, withdrawalCount: 0, netCount: 7 },
  { period: '2025-10', signupCount: 22, withdrawalCount: 1, netCount: 21 },
  { period: '2025-11', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-12', signupCount: 0, withdrawalCount: 0, netCount: 0 },
];

// 일별 회원 가입/탈퇴 데이터
export const mockMemberDayStatistics: MemberStatistic[] = [
  { period: '2025-10-01', signupCount: 2, withdrawalCount: 0, netCount: 2 },
  { period: '2025-10-02', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-03', signupCount: 3, withdrawalCount: 0, netCount: 3 },
  { period: '2025-10-04', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-05', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-06', signupCount: 3, withdrawalCount: 0, netCount: 3 },
  { period: '2025-10-07', signupCount: 1, withdrawalCount: 0, netCount: 1 },
  { period: '2025-10-08', signupCount: 2, withdrawalCount: 1, netCount: 1 },
  { period: '2025-10-09', signupCount: 6, withdrawalCount: 0, netCount: 6 },
  { period: '2025-10-10', signupCount: 1, withdrawalCount: 0, netCount: 1 },
  { period: '2025-10-11', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-12', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-13', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-14', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-15', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-16', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-17', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-18', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-19', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-20', signupCount: 1, withdrawalCount: 0, netCount: 1 },
  { period: '2025-10-21', signupCount: 2, withdrawalCount: 0, netCount: 2 },
  { period: '2025-10-22', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-23', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-24', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-25', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-26', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-27', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-28', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-29', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-30', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '2025-10-31', signupCount: 1, withdrawalCount: 0, netCount: 1 },
];

// 요일별 회원 가입/탈퇴 데이터
export const mockMemberWeekdayStatistics: MemberStatistic[] = [
  { period: '일', signupCount: 0, withdrawalCount: 0, netCount: 0 },
  { period: '월', signupCount: 8, withdrawalCount: 0, netCount: 8 },
  { period: '화', signupCount: 3, withdrawalCount: 0, netCount: 3 },
  { period: '수', signupCount: 7, withdrawalCount: 1, netCount: 6 },
  { period: '목', signupCount: 3, withdrawalCount: 0, netCount: 3 },
  { period: '금', signupCount: 1, withdrawalCount: 0, netCount: 1 },
  { period: '토', signupCount: 0, withdrawalCount: 0, netCount: 0 },
];

// 시간별 회원 가입/탈퇴 데이터
export const mockMemberHourStatistics: MemberStatistic[] = [
  { period: '00:00', signupCount: 5, withdrawalCount: 1, netCount: 4 },
  { period: '01:00', signupCount: 3, withdrawalCount: 0, netCount: 3 },
  { period: '02:00', signupCount: 2, withdrawalCount: 0, netCount: 2 },
  { period: '03:00', signupCount: 1, withdrawalCount: 0, netCount: 1 },
  { period: '04:00', signupCount: 2, withdrawalCount: 1, netCount: 1 },
  { period: '05:00', signupCount: 4, withdrawalCount: 0, netCount: 4 },
  { period: '06:00', signupCount: 8, withdrawalCount: 1, netCount: 7 },
  { period: '07:00', signupCount: 12, withdrawalCount: 2, netCount: 10 },
  { period: '08:00', signupCount: 18, withdrawalCount: 1, netCount: 17 },
  { period: '09:00', signupCount: 25, withdrawalCount: 3, netCount: 22 },
  { period: '10:00', signupCount: 32, withdrawalCount: 2, netCount: 30 },
  { period: '11:00', signupCount: 28, withdrawalCount: 4, netCount: 24 },
  { period: '12:00', signupCount: 35, withdrawalCount: 5, netCount: 30 },
  { period: '13:00', signupCount: 30, withdrawalCount: 3, netCount: 27 },
  { period: '14:00', signupCount: 27, withdrawalCount: 2, netCount: 25 },
  { period: '15:00', signupCount: 24, withdrawalCount: 3, netCount: 21 },
  { period: '16:00', signupCount: 22, withdrawalCount: 2, netCount: 20 },
  { period: '17:00', signupCount: 26, withdrawalCount: 4, netCount: 22 },
  { period: '18:00', signupCount: 29, withdrawalCount: 3, netCount: 26 },
  { period: '19:00', signupCount: 33, withdrawalCount: 5, netCount: 28 },
  { period: '20:00', signupCount: 38, withdrawalCount: 4, netCount: 34 },
  { period: '21:00', signupCount: 35, withdrawalCount: 6, netCount: 29 },
  { period: '22:00', signupCount: 28, withdrawalCount: 4, netCount: 24 },
  { period: '23:00', signupCount: 15, withdrawalCount: 2, netCount: 13 },
];

export const mockMemberSummary: MemberSummary = {
  totalSignupCount: 482,
  totalWithdrawalCount: 58,
  totalNetCount: 424,
};

// 방문자 통계 데이터
export interface VisitorStatistic {
  period: string;
  visitorCount: number;
}

// 년별통계 데이터
export const mockVisitorYearStatistics: VisitorStatistic[] = [
  { period: '2024', visitorCount: 218 },
  { period: '2025', visitorCount: 355 },
];

// 월별통계 데이터
export const mockVisitorMonthStatistics: VisitorStatistic[] = [
  { period: '2025-01', visitorCount: 0 },
  { period: '2025-02', visitorCount: 0 },
  { period: '2025-03', visitorCount: 0 },
  { period: '2025-04', visitorCount: 0 },
  { period: '2025-05', visitorCount: 0 },
  { period: '2025-06', visitorCount: 0 },
  { period: '2025-07', visitorCount: 0 },
  { period: '2025-08', visitorCount: 0 },
  { period: '2025-09', visitorCount: 52 },
  { period: '2025-10', visitorCount: 303 },
  { period: '2025-11', visitorCount: 0 },
  { period: '2025-12', visitorCount: 0 },
];

// 일별통계 데이터
export const mockVisitorDayStatistics: VisitorStatistic[] = [
  { period: '2025-10-01', visitorCount: 2 },
  { period: '2025-10-02', visitorCount: 2 },
  { period: '2025-10-03', visitorCount: 0 },
  { period: '2025-10-04', visitorCount: 0 },
  { period: '2025-10-05', visitorCount: 0 },
  { period: '2025-10-06', visitorCount: 7 },
  { period: '2025-10-07', visitorCount: 6 },
  { period: '2025-10-08', visitorCount: 5 },
  { period: '2025-10-09', visitorCount: 19 },
  { period: '2025-10-10', visitorCount: 5 },
  { period: '2025-10-11', visitorCount: 0 },
  { period: '2025-10-12', visitorCount: 0 },
  { period: '2025-10-13', visitorCount: 5 },
  { period: '2025-10-14', visitorCount: 5 },
  { period: '2025-10-15', visitorCount: 1 },
  { period: '2025-10-16', visitorCount: 1 },
  { period: '2025-10-17', visitorCount: 3 },
  { period: '2025-10-18', visitorCount: 0 },
  { period: '2025-10-19', visitorCount: 0 },
  { period: '2025-10-20', visitorCount: 16 },
  { period: '2025-10-21', visitorCount: 2 },
  { period: '2025-10-22', visitorCount: 3 },
  { period: '2025-10-23', visitorCount: 4 },
  { period: '2025-10-24', visitorCount: 1 },
  { period: '2025-10-25', visitorCount: 0 },
  { period: '2025-10-26', visitorCount: 0 },
  { period: '2025-10-27', visitorCount: 5 },
  { period: '2025-10-28', visitorCount: 1 },
  { period: '2025-10-29', visitorCount: 3 },
  { period: '2025-10-30', visitorCount: 5 },
  { period: '2025-10-31', visitorCount: 6 },
];

// 요일별통계 데이터
export const mockVisitorWeekdayStatistics: VisitorStatistic[] = [
  { period: '일', visitorCount: 0 },
  { period: '월', visitorCount: 33 },
  { period: '화', visitorCount: 14 },
  { period: '수', visitorCount: 14 },
  { period: '목', visitorCount: 31 },
  { period: '금', visitorCount: 15 },
  { period: '토', visitorCount: 0 },
];
