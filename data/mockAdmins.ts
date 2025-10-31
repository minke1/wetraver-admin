export interface Admin {
  id: number;
  userId: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  directPhone?: string;
  status: '이용중' | '정지중';
  createdAt: string;
  permissions: string[];
  imageUrl?: string;
}

export const mockAdmins: Admin[] = [
  {
    id: 128,
    userId: 'dudeoddl',
    name: '김영준',
    position: 'DOS',
    email: 'dudeoddl@gmail.com',
    phone: '01071519826',
    status: '이용중',
    createdAt: '2025-05-14 20:36:48',
    permissions: ['여행후기관리', '상품등록 관리', '게시판관리'],
  },
  {
    id: 112,
    userId: 'hihi1920',
    name: '조아영',
    position: '',
    email: 'hihi1920@naver.com',
    phone: '010-7527-8331',
    status: '이용중',
    createdAt: '2025-04-14 15:53:58',
    permissions: ['회원관리', '게시판관리'],
  },
  {
    id: 94,
    userId: 'uwal001',
    name: '김태균',
    position: '팀장',
    email: 'diana001@naver.com',
    phone: '010-7277-1892',
    status: '이용중',
    createdAt: '2025-03-05 12:14:04',
    permissions: ['상품등록 관리', '상품예약', '통계관리'],
  },
  {
    id: 78,
    userId: 'jinyoung',
    name: '박진영',
    position: '',
    email: '',
    phone: '',
    status: '이용중',
    createdAt: '2025-02-27 14:48:39',
    permissions: ['게시판관리'],
  },
  {
    id: 76,
    userId: 'boyoung',
    name: '배보영',
    position: '',
    email: '',
    phone: '',
    status: '이용중',
    createdAt: '2025-02-27 14:45:11',
    permissions: ['회원관리'],
  },
  {
    id: 71,
    userId: 'ttl.joon',
    name: 'JOON',
    position: 'Operation',
    email: 'op.tta25@gmail.com',
    phone: '0985356691',
    status: '이용중',
    createdAt: '2025-02-22 13:55:29',
    permissions: ['상품등록 관리', '상품예약', '정산관리'],
  },
  {
    id: 55,
    userId: 'Kim Young Hwan',
    name: '김영환',
    position: 'CEO',
    email: 'thetourlab@naver.com',
    phone: '070-7010-8256',
    status: '이용중',
    createdAt: '2024-12-13 11:20:32',
    permissions: ['전체'],
  },
  {
    id: 54,
    userId: 'phongpx1',
    name: 'phong',
    position: '싱장',
    email: 'pxp95211@naver.com',
    phone: '010-1111-0000',
    status: '이용중',
    createdAt: '2024-12-12 19:15:38',
    permissions: ['상품등록 관리', '회원관리'],
  },
];
