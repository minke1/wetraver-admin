import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TravelReservation } from '@/types/reservation';

interface VoucherInfoProps {
  data: TravelReservation;
  onChange: (data: TravelReservation) => void;
}

export function VoucherInfo({ data, onChange }: VoucherInfoProps) {
  const isVehicle = data.productCategory === 'Vehicle';

  const updateField = <K extends keyof TravelReservation>(
    field: K,
    value: TravelReservation[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {isVehicle ? '영수증' : '바우처/인보이스'}
        </h2>
      </div>
      <div className="p-6">
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-1/6">
                {isVehicle ? '영수증' : '인보이스 발송'}
              </td>
              <td
                className="py-3 px-4 w-5/12"
                colSpan={isVehicle ? 3 : 1}
              >
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Select
                      value={data.invoiceStatus}
                      onValueChange={(value) =>
                        updateField(
                          'invoiceStatus',
                          value as '인보이스 준비' | '인보이스 발송'
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="인보이스 준비">인보이스 준비</SelectItem>
                        <SelectItem value="인보이스 발송">인보이스 발송</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      인보이스 보기
                    </Button>
                    <Button variant="outline" size="sm">
                      수정
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="이메일"
                      value={data.email}
                      onChange={(e) => updateField('email', e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      고객 메일발송
                    </Button>
                    <Input
                      placeholder="휴대전화"
                      value={data.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      고객 문자발송
                    </Button>
                  </div>
                </div>
              </td>
              {!isVehicle && (
                <>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-1/6">
                    바우처 발송
                  </td>
                  <td className="py-3 px-4 w-5/12">
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Select
                          value={data.voucherStatus}
                          onValueChange={(value) =>
                            updateField(
                              'voucherStatus',
                              value as '바우처 준비' | '바우처 발송'
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="바우처 준비">
                              바우처 준비
                            </SelectItem>
                            <SelectItem value="바우처 발송">
                              바우처 발송
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">
                          바우처 보기
                        </Button>
                        <Button variant="outline" size="sm">
                          수정
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="이메일"
                          value={data.email}
                          onChange={(e) => updateField('email', e.target.value)}
                        />
                        <Button variant="outline" size="sm">
                          고객 메일발송
                        </Button>
                        <Input
                          placeholder="휴대전화"
                          value={data.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                        />
                        <Button variant="outline" size="sm">
                          고객 문자발송
                        </Button>
                      </div>
                    </div>
                  </td>
                </>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
