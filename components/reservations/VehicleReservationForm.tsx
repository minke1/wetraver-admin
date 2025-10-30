import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TravelReservation } from '@/types/reservation';

interface VehicleReservationFormProps {
  data: TravelReservation;
  onChange: (data: TravelReservation) => void;
}

export function VehicleReservationForm({
  data,
  onChange,
}: VehicleReservationFormProps) {
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
          ■ 주문정보(차량)
        </h2>
      </div>
      <div className="p-6">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-200">
            {/* 상품명 / 주문번호 */}
            <tr>
              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-1/6">
                상품명
              </td>
              <td className="py-3 px-4 w-1/3">
                <Input
                  value={data.productName}
                  onChange={(e) => updateField('productName', e.target.value)}
                />
              </td>
              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-1/6">
                주문번호
              </td>
              <td className="py-3 px-4 w-1/3">
                <span className="text-gray-900">{data.reservationNumber}</span>
              </td>
            </tr>

            {/* 주문날짜 */}
            <tr>
              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                주문날짜
              </td>
              <td className="py-3 px-4" colSpan={3}>
                <Input
                  type="date"
                  value={data.meetingDate || ''}
                  onChange={(e) => updateField('meetingDate', e.target.value)}
                />
              </td>
            </tr>

            {/* 주문자명 / 주문자이메일 */}
            <tr>
              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                주문자명
              </td>
              <td className="py-3 px-4">
                <Input
                  value={data.customerName}
                  onChange={(e) => updateField('customerName', e.target.value)}
                />
              </td>
              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                주문자이메일
              </td>
              <td className="py-3 px-4">
                <Input
                  type="email"
                  value={data.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </td>
            </tr>

            {/* 영문 이름(First/Last) */}
            <tr>
              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                영문 이름(First/Last)
              </td>
              <td className="py-3 px-4" colSpan={3}>
                <div className="flex gap-2">
                  <Input
                    placeholder="First Name"
                    value={data.firstName || ''}
                    onChange={(e) => updateField('firstName', e.target.value)}
                  />
                  <Input
                    placeholder="Last Name"
                    value={data.lastName || ''}
                    onChange={(e) => updateField('lastName', e.target.value)}
                  />
                </div>
              </td>
            </tr>

            {/* 휴대전화 / 여행시 현지 연락처 */}
            <tr>
              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                휴대전화
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Select
                    value={data.countryCode || 'GB(+44)'}
                    onValueChange={(value) => updateField('countryCode', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US(+1)">US(+1)</SelectItem>
                      <SelectItem value="GB(+44)">GB(+44)</SelectItem>
                      <SelectItem value="FR(+33)">FR(+33)</SelectItem>
                      <SelectItem value="IT(+39)">IT(+39)</SelectItem>
                      <SelectItem value="TH(+66)">TH(+66)</SelectItem>
                      <SelectItem value="JP(+81)">JP(+81)</SelectItem>
                      <SelectItem value="VN(+84)">VN(+84)</SelectItem>
                      <SelectItem value="SG(+65)">SG(+65)</SelectItem>
                      <SelectItem value="KR(+82)">KR(+82)</SelectItem>
                      <SelectItem value="CN(+86)">CN(+86)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={data.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </td>
              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                여행시 현지 연락처
              </td>
              <td className="py-3 px-4">
                <Input
                  value={data.localContact || ''}
                  onChange={(e) => updateField('localContact', e.target.value)}
                />
              </td>
            </tr>

            {/* 관리자 메모 */}
            <tr>
              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                관리자 메모
              </td>
              <td className="py-3 px-4" colSpan={3}>
                <Textarea
                  value={data.adminMemo || ''}
                  onChange={(e) => updateField('adminMemo', e.target.value)}
                  rows={3}
                />
              </td>
            </tr>

            {/* 변경사항 */}
            <tr>
              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                변경사항
              </td>
              <td className="py-3 px-4" colSpan={3}>
                <div className="flex items-center gap-2">
                  <Input
                    value={data.changeNotes || ''}
                    onChange={(e) => updateField('changeNotes', e.target.value)}
                    className="flex-1"
                    placeholder="변경 내용 입력"
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={data.changeApplied || false}
                      onCheckedChange={(checked) =>
                        updateField('changeApplied', checked === true)
                      }
                      id="change-applied"
                    />
                    <label
                      htmlFor="change-applied"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      적용
                    </label>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
