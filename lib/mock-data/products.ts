export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  status: '판매중' | '품절' | '판매중지';
  displayStatus: '노출' | '비노출';
  region: string;
  duration: string;
  maxPersons: number;
  rating: number;
  reviewCount: number;
  salesCount: number;
  views: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

const categories = ['Tickets', 'Hotels', 'Tour', 'K-Beauty', 'Dining', 'Vehicle', 'K-goods'];
const subCategories: Record<string, string[]> = {
  'Tickets': ['Gangwon', 'Gyeonggi', 'Jeju', 'Busan'],
  'Hotels': ['Seoul', 'Busan', 'Jeju'],
  'Tour': ['Cultural', 'Nature', 'City'],
  'K-Beauty': ['Skincare', 'Makeup', 'Spa'],
  'Dining': ['Korean', 'Western', 'Japanese'],
  'Vehicle': ['Car', 'Bus', 'Bike'],
  'K-goods': ['Fashion', 'Cosmetics', 'Food']
};
const regions = ['Seoul', 'Busan', 'Jeju', 'Gangwon', 'Gyeongju', 'Jeonju', 'Yeosu', 'Sokcho', 'Daegu', 'Incheon'];

// Unsplash 이미지 URL (여행/관광 관련)
const imageUrls = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400',
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400',
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400',
  'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
  'https://images.unsplash.com/photo-1534008757030-27299c4371b6?w=400',
  'https://images.unsplash.com/photo-1476900164809-ff19b8ae5968?w=400',
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400',
];

function generateRandomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
}

function generateProduct(index: number): Product {
  const categoryIndex = Math.floor(Math.random() * categories.length);
  const category = categories[categoryIndex];
  const regionIndex = Math.floor(Math.random() * regions.length);
  const statusIndex = Math.floor(Math.random() * 100);
  const displayStatusIndex = Math.floor(Math.random() * 100);

  const price = Math.floor(Math.random() * 500000 + 50000);
  const hasDiscount = Math.random() > 0.6;
  const discountPrice = hasDiscount ? Math.floor(price * 0.8) : undefined;

  const productNames = [
    `${regions[regionIndex]} 럭셔리 리조트`,
    `${regions[regionIndex]} 프리미엄 패키지`,
    `${regions[regionIndex]} 맛집 투어`,
    `${regions[regionIndex]} 힐링 여행`,
    `${regions[regionIndex]} 가족 여행`,
  ];

  // Randomly select subCategory based on category
  const subCategoryOptions = subCategories[category];
  const subCategory = subCategoryOptions[Math.floor(Math.random() * subCategoryOptions.length)];

  return {
    id: `PROD-${String(index + 1).padStart(5, '0')}`,
    name: productNames[Math.floor(Math.random() * productNames.length)],
    category: category,
    subCategory: subCategory,
    price: price,
    discountPrice: discountPrice,
    stock: statusIndex < 85 ? Math.floor(Math.random() * 50 + 10) : 0,
    status: statusIndex < 85 ? '판매중' : statusIndex < 95 ? '품절' : '판매중지',
    displayStatus: displayStatusIndex < 80 ? '노출' : '비노출',
    region: regions[regionIndex],
    duration: `${Math.floor(Math.random() * 3) + 2}박${Math.floor(Math.random() * 3) + 3}일`,
    maxPersons: Math.floor(Math.random() * 4 + 2),
    rating: Number((Math.random() * 2 + 3).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 200),
    salesCount: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 490 + 10),
    imageUrl: imageUrls[Math.floor(Math.random() * imageUrls.length)],
    createdAt: generateRandomDate(new Date('2023-01-01'), new Date('2024-06-01')),
    updatedAt: generateRandomDate(new Date('2024-06-01'), new Date()),
  };
}

export const mockProducts: Product[] = Array.from({ length: 80 }, (_, i) => generateProduct(i));

export function getProducts(
  page: number = 1,
  limit: number = 20,
  filters?: {
    category?: string;
    status?: string;
    region?: string;
    searchTerm?: string;
  }
): { data: Product[]; total: number; page: number; totalPages: number } {
  let filtered = [...mockProducts];

  if (filters) {
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }
    if (filters.region) {
      filtered = filtered.filter(p => p.region === filters.region);
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(term) || p.region.toLowerCase().includes(term)
      );
    }
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return { data, total, page, totalPages };
}
