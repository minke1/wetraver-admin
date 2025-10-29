import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TravelReservation, ReservationStatus } from '@/types/reservation';

const statuses: ReservationStatus[] = [
  '예약접수',
  '결제완료',
  '결제대기',
  '예약취소',
  '이용완료',
];

interface PaymentInfoProps {
  data: TravelReservation;
  onChange: (data: TravelReservation) => void;
}

export function PaymentInfo({ data, onChange }: PaymentInfoProps) {
  const updateField = <K extends keyof TravelReservation>(
    field: K,
    value: TravelReservation[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <>
      {/* 상품금액 및 예약설정 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            상품금액 및 예약설정
          </h2>
        </div>
        <div className="p-6">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-1/6">
                  총 결제금액
                </td>
                <td className="py-3 px-4 w-1/3">
                  <span className="text-gray-900">
                    원화계산: {data.totalAmountKRW?.toLocaleString() || 0}원 |{' '}
                    {data.totalAmountUSD || 0} USD
                  </span>
                </td>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-1/6">
                  실 결제금액
                </td>
                <td className="py-3 px-4 w-1/3">
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      value={data.priceKRW}
                      onChange={(e) => updateField('priceKRW', Number(e.target.value))}
                    />
                    <span>원</span>
                    <Input
                      type="number"
                      value={data.priceTHB}
                      onChange={(e) => updateField('priceTHB', Number(e.target.value))}
                    />
                    <span>USD</span>
                    <Button variant="outline" size="sm">
                      금액수정
                    </Button>
                  </div>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                  예약현황
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Select
                      value={data.status}
                      onValueChange={(value: ReservationStatus) =>
                        updateField('status', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      상태저장
                    </Button>
                  </div>
                </td>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                  예약 문자발송(알림톡)
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2 flex-wrap">
                    {statuses.slice(0, 7).map((status) => (
                      <Button key={status} variant="outline" size="sm">
                        {status}
                      </Button>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 무통장 입금정보 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">무통장 입금정보</h2>
        </div>
        <div className="p-6">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-1/6">
                  이름/연락처/이메일
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="결제자명"
                      value={data.customerName}
                      onChange={(e) => updateField('customerName', e.target.value)}
                    />
                    <Input
                      placeholder="휴대전화"
                      value={data.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                    />
                    <Input
                      placeholder="이메일"
                      type="email"
                      value={data.email}
                      onChange={(e) => updateField('email', e.target.value)}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
