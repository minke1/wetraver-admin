/**
 * 상품 관련 API 서비스
 */

import { get, post, put, del } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { PaginatedResponse } from '@/types/api';
import type { Product } from '@/lib/mock-data/products';
import { mockProducts } from '@/lib/mock-data/products';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

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
  if (USE_MOCK) {
    let filtered = [...mockProducts];

    if (filters) {
      if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(p => p.category === filters.category);
      }
      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(p => p.status === filters.status);
      }
      if (filters.searchTerm) {
        const query = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(query)
        );
      }
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = filtered.slice(start, end);
    const totalPages = Math.ceil(filtered.length / limit);

    return Promise.resolve({
      data: paginatedData,
      pagination: {
        total: filtered.length,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  }

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
  if (USE_MOCK) {
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error(`상품을 찾을 수 없습니다. (ID: ${id})`);
    }
    return Promise.resolve(product);
  }
  return get<Product>(ENDPOINTS.PRODUCTS.DETAIL(id));
}

export async function createProduct(
  data: Omit<Product, 'id' | 'createdAt'>
): Promise<Product> {
  if (USE_MOCK) {
    console.warn('Mock 모드에서는 상품 생성이 지원되지 않습니다.');
    return Promise.reject(new Error('Mock 모드에서는 상품 생성이 지원되지 않습니다.'));
  }
  return post<Product>(ENDPOINTS.PRODUCTS.CREATE, data);
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<Product> {
  if (USE_MOCK) {
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error(`상품을 찾을 수 없습니다. (ID: ${id})`);
    }
    return Promise.resolve({ ...product, ...data });
  }
  return put<Product>(ENDPOINTS.PRODUCTS.UPDATE(id), data);
}

export async function deleteProduct(id: string): Promise<void> {
  if (USE_MOCK) {
    console.warn('Mock 모드에서는 상품 삭제가 지원되지 않습니다.');
    return Promise.resolve();
  }
  return del<void>(ENDPOINTS.PRODUCTS.DELETE(id));
}
