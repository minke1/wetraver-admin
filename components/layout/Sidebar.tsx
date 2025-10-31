'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  BarChart3,
  Calendar,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  children?: { title: string; href: string }[];
}

const menuItems: MenuItem[] = [
  // ✅ 구현 완료
  {
    title: '대시보드',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: '/dashboard',
  },
  // ✅ 구현 완료
  {
    title: '상품 관리',
    icon: <Package className="h-5 w-5" />,
    children: [
      { title: '상품 목록', href: '/products' },
      // 🚧 미구현: 카테고리 관리
      // { title: '카테고리 관리', href: '/products/categories' },
    ],
  },
  // ✅ 구현 완료
  {
    title: '상품예약',
    icon: <Calendar className="h-5 w-5" />,
    children: [
      { title: '여행상품예약', href: '/reservations/travel' },
      { title: '정산관리', href: '/settlements' },
    ],
  },
  // ✅ 구현 완료 (회원 목록만)
  {
    title: '회원 관리',
    icon: <Users className="h-5 w-5" />,
    children: [
      { title: '회원 목록', href: '/members' },
      // 🚧 미구현: 회원 등급
      // { title: '회원 등급', href: '/members/grades' },
    ],
  },
  // 🚧 미구현: 주문 관리 전체
  // {
  //   title: '주문 관리',
  //   icon: <ShoppingCart className="h-5 w-5" />,
  //   children: [
  //     { title: '주문 목록', href: '/orders' },
  //     { title: '결제 내역', href: '/orders/payments' },
  //   ],
  // },
  // ✅ 구현 완료
  {
    title: '게시판 관리',
    icon: <FileText className="h-5 w-5" />,
    children: [
      { title: '공지사항', href: '/boards/notices' },
      { title: '이벤트 관리', href: '/boards/events' },
      // 🚧 미구현: FAQ
      // { title: 'FAQ', href: '/boards/faq' },
      // 🚧 미구현: 1:1 문의
      // { title: '1:1 문의', href: '/boards/inquiries' },
    ],
  },
  // 🚧 미구현: 리뷰 관리 전체
  // {
  //   title: '리뷰 관리',
  //   icon: <MessageSquare className="h-5 w-5" />,
  //   href: '/reviews',
  // },
  // ✅ 구현 완료
  {
    title: '환경설정',
    icon: <Settings className="h-5 w-5" />,
    children: [
      { title: '약관및정책관리', href: '/settings/policies' },
      { title: '운영자계정관리', href: '/settings/admins' },
    ],
  },
  // ✅ 구현 완료
  {
    title: '통계',
    icon: <BarChart3 className="h-5 w-5" />,
    children: [
      // { title: '매출 통계', href: '/statistics/revenue' },
      { title: '매출분석', href: '/statistics/sales' },
      { title: '회원및 방문분석', href: '/statistics/members' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>([]);

  // Update open items when pathname changes (client-side only)
  useEffect(() => {
    const itemsToOpen = menuItems
      .map((item, index) => {
        if (item.children) {
          const hasActiveChild = item.children.some(child => pathname.startsWith(child.href));
          return hasActiveChild ? `item-${index}` : null;
        }
        return null;
      })
      .filter((item): item is string => item !== null);

    setOpenItems(itemsToOpen);
  }, [pathname]);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-6">
        <Link href="/dashboard">
          <h1 className="text-2xl font-bold text-primary-500">WETRAVER</h1>
          <p className="text-sm text-gray-500">관리자</p>
        </Link>
      </div>

      <nav className="px-4 pb-4">
        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={setOpenItems}
          className="w-full space-y-1"
        >
          {menuItems.map((item, index) => {
            if (item.children) {
              return (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-none"
                >
                  <AccordionTrigger className="hover:no-underline hover:bg-gray-50 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">{item.icon}</span>
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pt-1">
                    <div className="pl-11 space-y-1">
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          href={child.href}
                          className={cn(
                            'block py-2 px-3 rounded-md text-sm transition-colors',
                            pathname === child.href
                              ? 'bg-primary-50 text-primary-600 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          )}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            }

            return (
              <Link
                key={index}
                href={item.href || '#'}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <span className="text-gray-600">{item.icon}</span>
                {item.title}
              </Link>
            );
          })}
        </Accordion>
      </nav>
    </aside>
  );
}
