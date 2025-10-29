/**
 * API 클라이언트 - 모든 API 호출의 기본 레이어
 *
 * 사용 예시:
 * const data = await apiClient<User[]>('/api/users');
 */

// 환경 변수에서 API URL 가져오기
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * API 응답 공통 인터페이스
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * 페이지네이션 응답 인터페이스
 */
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

/**
 * API 에러 클래스
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 기본 API 클라이언트 함수
 *
 * @param endpoint - API 엔드포인트 (예: '/api/users')
 * @param options - fetch 옵션
 * @returns API 응답 데이터
 * @throws {ApiError} API 호출 실패 시
 */
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        // 필요시 인증 토큰 추가
        // 'Authorization': `Bearer ${token}`,
        ...options?.headers,
      },
      ...options,
    });

    // HTTP 에러 처리
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.code || 'UNKNOWN_ERROR',
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        errorData.details
      );
    }

    // 응답 파싱
    const data = await response.json();
    return data;
  } catch (error) {
    // 네트워크 에러 처리
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      0,
      'NETWORK_ERROR',
      error instanceof Error ? error.message : '네트워크 연결을 확인해주세요.'
    );
  }
}

/**
 * GET 요청
 */
export async function get<T>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: 'GET' });
}

/**
 * POST 요청
 */
export async function post<T>(endpoint: string, data: any): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT 요청
 */
export async function put<T>(endpoint: string, data: any): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE 요청
 */
export async function del<T>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: 'DELETE' });
}

/**
 * PATCH 요청
 */
export async function patch<T>(endpoint: string, data: any): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
