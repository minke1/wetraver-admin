/**
 * API 관련 공용 타입 정의
 */

// 기본 API 응답
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: ApiError;
}

// API 에러
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// 페이지네이션 응답
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 페이지네이션 파라미터
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// 정렬 파라미터
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 검색 파라미터
export interface SearchParams {
  query?: string;
  searchType?: string;
}
