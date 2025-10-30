'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { getSettlementById, updateSettlement, deleteSettlement } from '@/lib/services/settlementService';
import type { Settlement } from '@/types/settlement';

export default function SettlementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const settlementId = Number(params.id);

  const [settlement, setSettlement] = useState<Settlement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Form state
  const [requestNotes, setRequestNotes] = useState('');
  const [adminMemo, setAdminMemo] = useState('');
  const [priceKRW, setPriceKRW] = useState(0);
  const [priceTHB, setPriceTHB] = useState(0);
  const [settlementStatus, setSettlementStatus] = useState('');

  useEffect(() => {
    loadSettlement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settlementId]);

  async function loadSettlement() {
    try {
      setLoading(true);
      setError(null);

      const data = await getSettlementById(settlementId);
      setSettlement(data);
      setPriceKRW(data.priceKRW);
      setPriceTHB(data.priceTHB);
      setSettlementStatus(data.settlementStatus || '정산대기');
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!settlement) return;

    try {
      await updateSettlement(settlementId, {
        priceKRW,
        priceTHB,
        settlementStatus: settlementStatus as any,
      });
      alert('수정되었습니다.');
      router.push('/settlements');
    } catch (err) {
      alert('수정 중 오류가 발생했습니다.');
    }
  }

  async function handleDelete() {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteSettlement(settlementId);
      alert('삭제되었습니다.');
      router.push('/settlements');
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (error || !settlement) {
    return (
      <DashboardLayout>
        <ErrorMessage error={error || new Error('정산 정보를 찾을 수 없습니다.')} retry={loadSettlement} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">정산관리</h1>
          <div className="flex gap-2">
            <Link href="/settlements">
              <Button variant="outline">리스트</Button>
            </Link>
            <Button onClick={handleSave}>수정</Button>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
            <Link href={`/products/${settlement.productCategory}`} target="_blank">
              <Button variant="outline">상품 상세보기</Button>
            </Link>
          </div>
        </div>

        {/* 주문정보 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">■ 주문정보</h3>
          <table className="w-full table-fixed">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">상품명</td>
                <td className="py-3 px-4 w-[calc(50%-10rem)]">{settlement.productName}</td>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">예약번호</td>
                <td className="py-3 px-4 w-[calc(50%-10rem)]">{settlement.reservationNumber}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">주문자명</td>
                <td className="py-3 px-4 w-[calc(50%-10rem)]">{settlement.customerName}</td>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">주문자이메일</td>
                <td className="py-3 px-4 w-[calc(50%-10rem)]">{settlement.email}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">영문 이름(First/Last)</td>
                <td className="py-3 px-4 w-[calc(50%-10rem)]">{settlement.customerName}</td>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">예약일시</td>
                <td className="py-3 px-4 w-[calc(50%-10rem)]">{settlement.reservationDate.split(' ')[0]}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">휴대전화</td>
                <td className="py-3 px-4 w-[calc(50%-10rem)]">{settlement.phone}</td>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">등록일</td>
                <td className="py-3 px-4 w-[calc(50%-10rem)]">{settlement.createdAt}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40">요청사항</td>
                <td className="py-3 px-4" colSpan={3}>
                  <textarea
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 min-h-[80px]"
                    placeholder="요청사항을 입력하세요"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40">관리자 메모</td>
                <td className="py-3 px-4" colSpan={3}>
                  <textarea
                    value={adminMemo}
                    onChange={(e) => setAdminMemo(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 min-h-[80px]"
                    placeholder="관리자 메모를 입력하세요"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 결제정보 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">■ 결제정보</h3>
          <table className="w-full table-fixed">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">상품금액</td>
                <td className="py-3 px-4 w-[calc(50%-10rem)]">
                  원화계산 : {settlement.priceKRW.toLocaleString()}원 | {settlement.priceTHB} USD
                </td>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">실 결제금액</td>
                <td className="py-3 px-4 w-[calc(50%-10rem)]">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={priceKRW}
                      onChange={(e) => setPriceKRW(Number(e.target.value))}
                      className="w-32"
                    />
                    <span>원</span>
                    <Input
                      type="number"
                      value={priceTHB}
                      onChange={(e) => setPriceTHB(Number(e.target.value))}
                      className="w-32"
                      step="0.1"
                    />
                    <span>USD</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">예약현황</td>
                <td className="py-3 px-4 w-[calc(50%-10rem)]">{settlement.status}</td>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-40 whitespace-nowrap">정산현황</td>
                <td className="py-3 px-4 w-[calc(50%-10rem)]">
                  <div className="flex items-center gap-2">
                    <Select value={settlementStatus} onValueChange={setSettlementStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="정산대기">정산대기</SelectItem>
                        <SelectItem value="정산완료">정산완료</SelectItem>
                        <SelectItem value="정산보류">정산보류</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm">상태수정</Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center gap-2">
          <Link href="/settlements">
            <Button variant="outline">리스트</Button>
          </Link>
          <Button onClick={handleSave}>수정</Button>
          <Button variant="destructive" onClick={handleDelete}>
            삭제
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
