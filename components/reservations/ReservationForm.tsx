import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TravelReservation } from '@/types/reservation';

interface ReservationFormProps {
  data: TravelReservation;
  onChange: (data: TravelReservation) => void;
}

export function ReservationForm({ data, onChange }: ReservationFormProps) {
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
          예약정보 ({data.productCategory})
        </h2>
      </div>
      <div className="p-6">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-200">
            {/* 상품명 / 예약번호 */}
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
                예약번호
              </td>
              <td className="py-3 px-4 w-1/3">
                <span className="text-gray-900">{data.reservationNumber}</span>
              </td>
            </tr>

            {/* 주문자명 / 이메일 */}
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
                주문자 이메일
              </td>
              <td className="py-3 px-4">
                <Input
                  type="email"
                  value={data.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </td>
            </tr>

            {/* 영문 이름 / 여권정보 */}
            {data.firstName && (
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                  영문 이름(First/Last)
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="First Name"
                      value={data.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                    />
                    <Input
                      placeholder="Last Name"
                      value={data.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                    />
                  </div>
                </td>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                  여권정보
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Select
                      value={data.gender}
                      onValueChange={(value) =>
                        updateField('gender', value as '남자' | '여자')
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="남자">남자</SelectItem>
                        <SelectItem value="여자">여자</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="여권번호"
                      value={data.passportNumber}
                      onChange={(e) => updateField('passportNumber', e.target.value)}
                    />
                    <Input
                      type="date"
                      placeholder="만료일"
                      value={data.passportExpiry}
                      onChange={(e) => updateField('passportExpiry', e.target.value)}
                    />
                  </div>
                </td>
              </tr>
            )}

            {/* 생년월일 / 휴대전화 */}
            {data.birthDate && (
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                  생년월일
                </td>
                <td className="py-3 px-4">
                  <Input
                    type="date"
                    value={data.birthDate}
                    onChange={(e) => updateField('birthDate', e.target.value)}
                  />
                </td>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                  휴대전화
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Input
                      className="w-32"
                      value={data.countryCode || ''}
                      placeholder="국가코드"
                      onChange={(e) => updateField('countryCode', e.target.value)}
                    />
                    <Input
                      value={data.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                    />
                  </div>
                </td>
              </tr>
            )}

            {/* 예약날짜 */}
            <tr>
              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                예약날짜
              </td>
              <td className="py-3 px-4" colSpan={3}>
                <span className="text-gray-900">{data.reservationDate}</span>
              </td>
            </tr>

            {/* 룸타입/프로모션 / 식사 */}
            {data.roomType && (
              <>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                    룸타입/프로모션
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Input
                        value={data.roomType}
                        onChange={(e) => updateField('roomType', e.target.value)}
                      />
                      <Input
                        value={data.promotion}
                        onChange={(e) => updateField('promotion', e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                    식사
                  </td>
                  <td className="py-3 px-4">
                    <Input
                      value={data.mealPlan}
                      onChange={(e) => updateField('mealPlan', e.target.value)}
                    />
                  </td>
                </tr>

                {/* 체크인/체크아웃 / 객실수 */}
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                    체크인/체크아웃
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 items-center">
                      <Input
                        type="date"
                        value={data.checkIn}
                        onChange={(e) => updateField('checkIn', e.target.value)}
                      />
                      <span>~</span>
                      <Input
                        type="date"
                        value={data.checkOut}
                        onChange={(e) => updateField('checkOut', e.target.value)}
                      />
                      <span>/</span>
                      <Input
                        type="number"
                        className="w-20"
                        value={data.nights}
                        onChange={(e) => updateField('nights', Number(e.target.value))}
                      />
                      <span>일</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                    객실수/총인원
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        className="w-20"
                        value={data.rooms}
                        onChange={(e) => updateField('rooms', Number(e.target.value))}
                      />
                      <span>룸 / 성인</span>
                      <Input
                        type="number"
                        className="w-20"
                        value={data.adults}
                        onChange={(e) => updateField('adults', Number(e.target.value))}
                      />
                      <span>명 아동</span>
                      <Input
                        type="number"
                        className="w-20"
                        value={data.children}
                        onChange={(e) => updateField('children', Number(e.target.value))}
                      />
                      <span>명</span>
                    </div>
                  </td>
                </tr>

                {/* 침대구성 / 상품 담당자 */}
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                    침대구성
                  </td>
                  <td className="py-3 px-4">
                    <Input
                      value={data.bedding}
                      onChange={(e) => updateField('bedding', e.target.value)}
                    />
                  </td>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                    상품 담당자
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="이름"
                        value={data.managerName || ''}
                        onChange={(e) => updateField('managerName', e.target.value)}
                      />
                      <Input
                        placeholder="휴대폰"
                        value={data.managerPhone || ''}
                        onChange={(e) => updateField('managerPhone', e.target.value)}
                      />
                      <Input
                        placeholder="이메일"
                        value={data.managerEmail || ''}
                        onChange={(e) => updateField('managerEmail', e.target.value)}
                      />
                    </div>
                  </td>
                </tr>
              </>
            )}

            {/* 별도 요청 */}
            {data.specialRequests && (
              <>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                    별도 요청
                  </td>
                  <td className="py-3 px-4" colSpan={3}>
                    <Textarea
                      value={data.specialRequests}
                      rows={3}
                      onChange={(e) => updateField('specialRequests', e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                    별도 요청(영문입력)
                  </td>
                  <td className="py-3 px-4" colSpan={3}>
                    <Textarea
                      rows={2}
                      value={data.specialRequestsEn || ''}
                      onChange={(e) => updateField('specialRequestsEn', e.target.value)}
                    />
                  </td>
                </tr>
              </>
            )}

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
          </tbody>
        </table>
      </div>
    </div>
  );
}
