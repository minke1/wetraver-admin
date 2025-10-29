/**
 * API 엔드포인트 상수
 *
 * 중앙에서 관리하여 변경 시 한 곳만 수정
 */

export const ENDPOINTS = {
  // 예약 관련
  RESERVATIONS: {
    LIST: '/api/reservations',
    DETAIL: (id: number) => `/api/reservations/${id}`,
    CREATE: '/api/reservations',
    UPDATE: (id: number) => `/api/reservations/${id}`,
    DELETE: (id: number) => `/api/reservations/${id}`,
    STATS: '/api/reservations/stats',
  },

  // 상품 관련
  PRODUCTS: {
    LIST: '/api/products',
    DETAIL: (id: string) => `/api/products/${id}`,
    CREATE: '/api/products',
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,
  },

  // 회원 관련
  MEMBERS: {
    LIST: '/api/members',
    DETAIL: (id: string) => `/api/members/${id}`,
    CREATE: '/api/members',
    UPDATE: (id: string) => `/api/members/${id}`,
    DELETE: (id: string) => `/api/members/${id}`,
  },

  // 대시보드 관련
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
    REVENUE: '/api/dashboard/revenue',
    PRODUCT_SALES: '/api/dashboard/product-sales',
    RECENT_RESERVATIONS: '/api/dashboard/recent-reservations',
  },
} as const;
