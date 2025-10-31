export interface Policy {
  id: number;
  title: string;
  priority: number;
  contentPC: string;
  contentMobile: string;
  createdAt: string;
  updatedAt: string;
}

export const mockPolicies: Policy[] = [
  {
    id: 49,
    title: '이용약관 (기업)',
    priority: 20,
    contentPC: `<p><strong>TRENVL B2B Partner Terms and Conditions (English Version — Governed by Korean Law)</strong></p>
<p>(Effective Date: October 1, 2025)</p>
<p>This English version is for reference purposes only. In case of any discrepancies, the Korean version shall prevail. The Agreement shall be governed by the laws of the Republic of Korea.</p>
<p><strong>Article 1 (Purpose)</strong></p>
<p>These Terms and Conditions ("Agreement") are made between Minegallery Co., Ltd. (the "Company") and its business partners ("Partner") who register and provide products or services on the inbound travel platform TRENVL, operated by the Company, to define mutual rights, obligations, and liabilities under Korean law.</p>`,
    contentMobile: `<p><strong>TRENVL B2B Partner Terms and Conditions (English Version — Governed by Korean Law)</strong></p>
<p>(Effective Date: October 1, 2025)</p>`,
    createdAt: '2025-10-01',
    updatedAt: '2025-10-31',
  },
  {
    id: 50,
    title: '개인정보처리방침 ( 기업 )',
    priority: 19,
    contentPC: '<p>개인정보처리방침 내용...</p>',
    contentMobile: '<p>개인정보처리방침 내용...</p>',
    createdAt: '2025-10-01',
    updatedAt: '2025-10-31',
  },
  {
    id: 51,
    title: '개인정보 제 3자 제공 및 공유안내 (기업)',
    priority: 18,
    contentPC: '<p>개인정보 제 3자 제공 및 공유안내 내용...</p>',
    contentMobile: '<p>개인정보 제 3자 제공 및 공유안내 내용...</p>',
    createdAt: '2025-10-01',
    updatedAt: '2025-10-31',
  },
  {
    id: 5,
    title: '이용약관',
    priority: 17,
    contentPC: '<p>이용약관 내용...</p>',
    contentMobile: '<p>이용약관 내용...</p>',
    createdAt: '2025-09-01',
    updatedAt: '2025-10-31',
  },
  {
    id: 37,
    title: '예약내역 설명',
    priority: 15,
    contentPC: '<p>예약내역 설명 내용...</p>',
    contentMobile: '<p>예약내역 설명 내용...</p>',
    createdAt: '2025-09-15',
    updatedAt: '2025-10-31',
  },
  {
    id: 21,
    title: '가이드 서비스 비용 및 예약',
    priority: 14,
    contentPC: '<p>가이드 서비스 비용 및 예약 내용...</p>',
    contentMobile: '<p>가이드 서비스 비용 및 예약 내용...</p>',
    createdAt: '2025-09-10',
    updatedAt: '2025-10-31',
  },
  {
    id: 20,
    title: '차량 유의사항 - 공통',
    priority: 13,
    contentPC: '<p>차량 유의사항 내용...</p>',
    contentMobile: '<p>차량 유의사항 내용...</p>',
    createdAt: '2025-09-10',
    updatedAt: '2025-10-31',
  },
  {
    id: 41,
    title: '투어 유의사항 - 공통',
    priority: 12,
    contentPC: '<p>투어 유의사항 내용...</p>',
    contentMobile: '<p>투어 유의사항 내용...</p>',
    createdAt: '2025-09-20',
    updatedAt: '2025-10-31',
  },
  {
    id: 40,
    title: '호텔 유의사항 - 공통',
    priority: 11,
    contentPC: '<p>호텔 유의사항 내용...</p>',
    contentMobile: '<p>호텔 유의사항 내용...</p>',
    createdAt: '2025-09-20',
    updatedAt: '2025-10-31',
  },
  {
    id: 2,
    title: '개인정보처리방침',
    priority: 1,
    contentPC: '<p>개인정보처리방침 내용...</p>',
    contentMobile: '<p>개인정보처리방침 내용...</p>',
    createdAt: '2025-08-01',
    updatedAt: '2025-10-31',
  },
];
