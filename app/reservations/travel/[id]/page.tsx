'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { ReservationForm } from '@/components/reservations/ReservationForm';
import { VehicleReservationForm } from '@/components/reservations/VehicleReservationForm';
import { PaymentInfo } from '@/components/reservations/PaymentInfo';
import { VoucherInfo } from '@/components/reservations/VoucherInfo';
import { HistoryLog } from '@/components/reservations/HistoryLog';
import {
  getReservationById,
  updateReservation,
  deleteReservation,
} from '@/lib/services/reservationService';
import { TravelReservation } from '@/types/reservation';

export default function TravelReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reservationId = Number(params.id);

  const [formData, setFormData] = useState<TravelReservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadReservation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationId]);

  async function loadReservation() {
    try {
      setLoading(true);
      setError(null);
      const data = await getReservationById(reservationId);
      setFormData(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!formData) return;

    try {
      setSaving(true);
      await updateReservation(reservationId, formData);
      alert('저장되었습니다.');
    } catch (err) {
      alert('저장 실패: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteReservation(reservationId);
      alert('삭제되었습니다.');
      router.push('/reservations/travel');
    } catch (err) {
      alert('삭제 실패: ' + (err as Error).message);
    }
  }

  // 로딩 처리
  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  // 에러 처리
  if (error || !formData) {
    return (
      <DashboardLayout>
        <ErrorMessage error={error || new Error('예약을 찾을 수 없습니다.')} retry={loadReservation} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">예약 상세</h1>
            <p className="text-sm text-gray-500 mt-1">예약 정보를 확인하고 수정합니다</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/reservations/travel">
                <ArrowLeft className="h-4 w-4 mr-2" />
                리스트
              </Link>
            </Button>
            <Button variant="outline" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? '저장 중...' : '수정'}
            </Button>
            <Button variant="outline" onClick={handleDelete} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              삭제
            </Button>
          </div>
        </div>

        {/* 컴포넌트로 분리된 섹션들 */}
        {formData.productCategory === 'Vehicle' ? (
          <VehicleReservationForm data={formData} onChange={setFormData} />
        ) : (
          <ReservationForm data={formData} onChange={setFormData} />
        )}
        <PaymentInfo data={formData} onChange={setFormData} />
        <VoucherInfo data={formData} onChange={setFormData} />
        <HistoryLog reservationId={reservationId} />

        {/* 하단 액션 버튼 */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/reservations/travel">
              <ArrowLeft className="h-4 w-4 mr-2" />
              리스트
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? '저장 중...' : '수정'}
          </Button>
          <Button variant="outline" onClick={handleDelete} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            삭제
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
