/**
 * 상품 관련 API 서비스
 */

import { get, post, put, del } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { PaginatedResponse } from '@/types/api';

// Product 타입 임시 정의 (types/product.ts에 실제 정의되어 있어야 함)
interface Product {
  id: string;
  name: string;
  category: string;
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

interface ProductFilters {
  category?: string;
  status?: string;
  searchTerm?: string;
}

export async function getProducts(
  page: number = 1,
  limit: number = 20,
  filters?: ProductFilters
): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters) {
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    if (filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters.searchTerm) {
      params.append('q', filters.searchTerm);
    }
  }

  return get<PaginatedResponse<Product>>(
    `${ENDPOINTS.PRODUCTS.LIST}?${params.toString()}`
  );
}

export async function getProductById(id: string): Promise<Product> {
  return get<Product>(ENDPOINTS.PRODUCTS.DETAIL(id));
}

export async function createProduct(
  data: Omit<Product, 'id' | 'createdAt'>
): Promise<Product> {
  return post<Product>(ENDPOINTS.PRODUCTS.CREATE, data);
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<Product> {
  return put<Product>(ENDPOINTS.PRODUCTS.UPDATE(id), data);
}

export async function deleteProduct(id: string): Promise<void> {
  return del<void>(ENDPOINTS.PRODUCTS.DELETE(id));
}
