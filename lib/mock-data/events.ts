export interface Event {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  author: string;
  views: number;
  createdAt: string;
}

const eventImageUrls = [
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
  'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
  'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=400',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
  'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400',
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400',
];

function generateRandomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function generateEvent(index: number): Event {
  const startDate = generateRandomDate(new Date('2024-11-01'), new Date('2024-12-31'));
  const endDateObj = new Date(startDate);
  endDateObj.setDate(endDateObj.getDate() + Math.floor(Math.random() * 30) + 7);
  const endDate = endDateObj.toISOString().split('T')[0];

  const eventTitles = [
    '겨울 특가 이벤트 - 최대 50% 할인',
    '크리스마스 특별 프로모션',
    '신규 회원 가입 혜택',
    '제주도 여행 패키지 특가',
    '설 연휴 특별 할인',
    '강원도 스키장 시즌 오픈',
    '봄맞이 벚꽃 투어 예약 이벤트',
    'VIP 회원 전용 할인',
    '가족 여행 패키지 특가',
    '호텔 예약 시 무료 업그레이드',
  ];

  const eventContents = [
    '이번 겨울 시즌을 맞아 특별한 할인 혜택을 제공합니다. 인기 여행 상품을 최대 50% 할인된 가격으로 만나보세요.',
    '크리스마스 시즌을 맞아 특별한 여행 상품을 준비했습니다. 소중한 사람과 함께 특별한 추억을 만들어보세요.',
    '신규 회원 가입 시 즉시 사용 가능한 10% 할인 쿠폰을 드립니다. 지금 바로 가입하고 혜택을 받아보세요.',
    '제주도의 아름다운 풍경을 특가로 만나보세요. 항공권과 숙박이 포함된 패키지 상품입니다.',
    '설 연휴 기간 동안 사용 가능한 특별 할인 쿠폰을 제공합니다. 가족과 함께 즐거운 여행을 떠나보세요.',
    '스키 시즌이 시작되었습니다. 강원도의 주요 스키장 리프트권과 숙박을 포함한 패키지 상품입니다.',
    '봄을 맞아 벚꽃 명소를 여행하는 특별한 투어 상품을 준비했습니다. 사진 작가와 함께하는 프리미엄 투어입니다.',
    'VIP 등급 회원님들께 드리는 특별 혜택입니다. 추가 할인과 무료 업그레이드 서비스를 제공합니다.',
    '온 가족이 함께 즐길 수 있는 여행 패키지 상품입니다. 어린이 동반 시 추가 할인 혜택을 드립니다.',
    '호텔 예약 시 무료로 객실 등급을 업그레이드해드립니다. 더 좋은 시설에서 편안한 휴식을 즐기세요.',
  ];

  return {
    id: `EVENT-${String(index + 1).padStart(4, '0')}`,
    title: eventTitles[index],
    content: eventContents[index],
    imageUrl: eventImageUrls[index],
    startDate: startDate,
    endDate: endDate,
    author: '관리자',
    views: Math.floor(Math.random() * 1000 + 100),
    createdAt: generateRandomDate(new Date('2024-10-01'), new Date('2024-11-01')),
  };
}

export const mockEvents: Event[] = Array.from({ length: 10 }, (_, i) => generateEvent(i));

export function getEvents(
  page: number = 1,
  limit: number = 12,
  filters?: {
    searchTerm?: string;
    searchType?: string;
  }
): { data: Event[]; total: number; page: number; totalPages: number } {
  let filtered = [...mockEvents];

  if (filters?.searchTerm && filters?.searchType) {
    const term = filters.searchTerm.toLowerCase();
    if (filters.searchType === '제목') {
      filtered = filtered.filter((e) => e.title.toLowerCase().includes(term));
    } else if (filters.searchType === '내용') {
      filtered = filtered.filter((e) => e.content.toLowerCase().includes(term));
    } else if (filters.searchType === '작성자') {
      filtered = filtered.filter((e) => e.author.toLowerCase().includes(term));
    }
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return { data, total, page, totalPages };
}
