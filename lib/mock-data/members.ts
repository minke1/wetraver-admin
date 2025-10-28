export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  grade: 'VIP' | 'GOLD' | 'SILVER' | 'BRONZE';
  status: '정상' | '휴면' | '탈퇴';
  totalOrders: number;
  totalAmount: number;
  points: number;
  joinDate: string;
  lastLoginDate: string;
  birthDate?: string;
  gender?: '남' | '여';
}

const genders: ('남' | '여')[] = ['남', '여'];

function generateRandomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function generateMember(index: number): Member {
  const gradeIndex = Math.floor(Math.random() * 100);
  const statusIndex = Math.floor(Math.random() * 100);
  const hasGender = Math.random() > 0.2;
  const hasBirthDate = Math.random() > 0.3;

  const joinDate = generateRandomDate(new Date('2020-01-01'), new Date('2024-11-01'));
  const lastLoginDate = generateRandomDate(new Date('2024-01-01'), new Date());

  let grade: Member['grade'];
  if (gradeIndex < 5) grade = 'VIP';
  else if (gradeIndex < 20) grade = 'GOLD';
  else if (gradeIndex < 50) grade = 'SILVER';
  else grade = 'BRONZE';

  const status: Member['status'] = statusIndex < 85 ? '정상' : statusIndex < 95 ? '휴면' : '탈퇴';

  const totalOrders = grade === 'VIP'
    ? Math.floor(Math.random() * 50 + 30)
    : grade === 'GOLD'
    ? Math.floor(Math.random() * 30 + 15)
    : grade === 'SILVER'
    ? Math.floor(Math.random() * 15 + 5)
    : Math.floor(Math.random() * 5);

  const totalAmount = totalOrders * (Math.floor(Math.random() * 300000) + 100000);

  return {
    id: `MEM-${String(index + 1).padStart(6, '0')}`,
    name: `회원${index + 1}`,
    email: `member${index + 1}@example.com`,
    phone: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    grade: grade,
    status: status,
    totalOrders: totalOrders,
    totalAmount: totalAmount,
    points: Math.floor(totalAmount * 0.01),
    joinDate: joinDate,
    lastLoginDate: lastLoginDate,
    birthDate: hasBirthDate ? generateRandomDate(new Date('1960-01-01'), new Date('2005-12-31')) : undefined,
    gender: hasGender ? genders[Math.floor(Math.random() * 2)] : undefined,
  };
}

export const mockMembers: Member[] = Array.from({ length: 250 }, (_, i) => generateMember(i));

export function getMembers(
  page: number = 1,
  limit: number = 20,
  filters?: {
    grade?: string;
    status?: string;
    searchTerm?: string;
  }
): { data: Member[]; total: number; page: number; totalPages: number } {
  let filtered = [...mockMembers];

  if (filters) {
    if (filters.grade) {
      filtered = filtered.filter(m => m.grade === filters.grade);
    }
    if (filters.status) {
      filtered = filtered.filter(m => m.status === filters.status);
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        m =>
          m.name.toLowerCase().includes(term) ||
          m.email.toLowerCase().includes(term) ||
          m.phone.includes(term)
      );
    }
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return { data, total, page, totalPages };
}
