'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockReservations } from '@/data/mockReservations';
import { ReservationStatus } from '@/types/reservation';

const statuses: ReservationStatus[] = [
  '예약접수',
  '결제완료',
  '결제대기',
  '예약취소',
  '이용완료',
];

export default function TravelReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reservationId = Number(params.id);

  const reservation = mockReservations.find((r) => r.id === reservationId);

  const [formData, setFormData] = useState(reservation);

  if (!formData) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">예약을 찾을 수 없습니다.</p>
          <Button className="mt-4" asChild>
            <Link href="/reservations/travel">목록으로 돌아가기</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSave = () => {
    // TODO: API 연동 시 저장 로직 구현
    alert('저장되었습니다.');
  };

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      // TODO: API 연동 시 삭제 로직 구현
      router.push('/reservations/travel');
    }
  };

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
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              수정
            </Button>
            <Button variant="outline" onClick={handleDelete} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              삭제
            </Button>
          </div>
        </div>

      {/* 예약 정보 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            예약정보 ({formData.productCategory})
          </h2>
        </div>
        <div className="p-6">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-1/6">
                  상품명
                </td>
                <td className="py-3 px-4 w-1/3">
                  <Input
                    value={formData.productName}
                    onChange={(e) =>
                      setFormData({ ...formData, productName: e.target.value })
                    }
                  />
                </td>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-1/6">
                  예약번호
                </td>
                <td className="py-3 px-4 w-1/3">
                  <span className="text-gray-900">{formData.reservationNumber}</span>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                  주문자명
                </td>
                <td className="py-3 px-4">
                  <Input
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                  />
                </td>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                  주문자 이메일
                </td>
                <td className="py-3 px-4">
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </td>
              </tr>

              {formData.firstName && (
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                    영문 이름(First/Last)
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                    여권정보
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          setFormData({ ...formData, gender: value as '남자' | '여자' })
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
                        value={formData.passportNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            passportNumber: e.target.value,
                          })
                        }
                      />
                      <Input
                        type="date"
                        placeholder="만료일"
                        value={formData.passportExpiry}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            passportExpiry: e.target.value,
                          })
                        }
                      />
                    </div>
                  </td>
                </tr>
              )}

              {formData.birthDate && (
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                    생년월일
                  </td>
                  <td className="py-3 px-4">
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) =>
                        setFormData({ ...formData, birthDate: e.target.value })
                      }
                    />
                  </td>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                    휴대전화
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Input
                        className="w-32"
                        value={formData.countryCode || ''}
                        placeholder="국가코드"
                        onChange={(e) =>
                          setFormData({ ...formData, countryCode: e.target.value })
                        }
                      />
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </td>
                </tr>
              )}

              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                  예약날짜
                </td>
                <td className="py-3 px-4" colSpan={3}>
                  <span className="text-gray-900">{formData.reservationDate}</span>
                </td>
              </tr>

              {formData.roomType && (
                <>
                  <tr>
                    <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                      룸타입/프로모션
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Input
                          value={formData.roomType}
                          onChange={(e) =>
                            setFormData({ ...formData, roomType: e.target.value })
                          }
                        />
                        <Input
                          value={formData.promotion}
                          onChange={(e) =>
                            setFormData({ ...formData, promotion: e.target.value })
                          }
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                      식사
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        value={formData.mealPlan}
                        onChange={(e) =>
                          setFormData({ ...formData, mealPlan: e.target.value })
                        }
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                      체크인/체크아웃
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 items-center">
                        <Input
                          type="date"
                          value={formData.checkIn}
                          onChange={(e) =>
                            setFormData({ ...formData, checkIn: e.target.value })
                          }
                        />
                        <span>~</span>
                        <Input
                          type="date"
                          value={formData.checkOut}
                          onChange={(e) =>
                            setFormData({ ...formData, checkOut: e.target.value })
                          }
                        />
                        <span>/</span>
                        <Input
                          type="number"
                          className="w-20"
                          value={formData.nights}
                          onChange={(e) =>
                            setFormData({ ...formData, nights: Number(e.target.value) })
                          }
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
                          value={formData.rooms}
                          onChange={(e) =>
                            setFormData({ ...formData, rooms: Number(e.target.value) })
                          }
                        />
                        <span>룸 / 성인</span>
                        <Input
                          type="number"
                          className="w-20"
                          value={formData.adults}
                          onChange={(e) =>
                            setFormData({ ...formData, adults: Number(e.target.value) })
                          }
                        />
                        <span>명 아동</span>
                        <Input
                          type="number"
                          className="w-20"
                          value={formData.children}
                          onChange={(e) =>
                            setFormData({ ...formData, children: Number(e.target.value) })
                          }
                        />
                        <span>명</span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                      침대구성
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        value={formData.bedding}
                        onChange={(e) =>
                          setFormData({ ...formData, bedding: e.target.value })
                        }
                      />
                    </td>
                    <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                      상품 담당자
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="이름"
                          value={formData.managerName || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, managerName: e.target.value })
                          }
                        />
                        <Input
                          placeholder="휴대폰"
                          value={formData.managerPhone || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, managerPhone: e.target.value })
                          }
                        />
                        <Input
                          placeholder="이메일"
                          value={formData.managerEmail || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, managerEmail: e.target.value })
                          }
                        />
                      </div>
                    </td>
                  </tr>
                </>
              )}

              {formData.specialRequests && (
                <>
                  <tr>
                    <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                      별도 요청
                    </td>
                    <td className="py-3 px-4" colSpan={3}>
                      <Textarea
                        value={formData.specialRequests}
                        rows={3}
                        onChange={(e) =>
                          setFormData({ ...formData, specialRequests: e.target.value })
                        }
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                      별도 요청(입력)
                    </td>
                    <td className="py-3 px-4" colSpan={3}>
                      <Textarea
                        rows={2}
                        value=""
                        onChange={() => {}}
                        placeholder="별도 요청사항을 입력하세요"
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
                        value={formData.specialRequestsEn || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, specialRequestsEn: e.target.value })
                        }
                      />
                    </td>
                  </tr>
                </>
              )}

              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">
                  관리자 메모
                </td>
                <td className="py-3 px-4" colSpan={3}>
                  <Textarea
                    value={formData.adminMemo || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, adminMemo: e.target.value })
                    }
                    rows={3}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 상품금액 및 예약설정 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
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
                    원화계산: {formData.totalAmountKRW?.toLocaleString() || 0}원 |{' '}
                    {formData.totalAmountUSD || 0} USD
                  </span>
                </td>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-1/6">
                  실 결제금액
                </td>
                <td className="py-3 px-4 w-1/3">
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      value={formData.priceKRW}
                      onChange={(e) =>
                        setFormData({ ...formData, priceKRW: Number(e.target.value) })
                      }
                    />
                    <span>원</span>
                    <Input
                      type="number"
                      value={formData.priceTHB}
                      onChange={(e) =>
                        setFormData({ ...formData, priceTHB: Number(e.target.value) })
                      }
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
                      value={formData.status}
                      onValueChange={(value: ReservationStatus) =>
                        setFormData({ ...formData, status: value })
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
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
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({ ...formData, customerName: e.target.value })
                      }
                    />
                    <Input
                      placeholder="휴대전화"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                    <Input
                      placeholder="이메일"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 바우처/인보이스 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">바우처/인보이스</h2>
        </div>
        <div className="p-6">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-1/6">
                  인보이스 발송
                </td>
                <td className="py-3 px-4 w-5/12">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Select
                        value={formData.invoiceStatus}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            invoiceStatus: value as '인보이스 준비' | '인보이스 발송',
                          })
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
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                      <Button variant="outline" size="sm">
                        고객 메일발송
                      </Button>
                      <Input
                        placeholder="휴대전화"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                      <Button variant="outline" size="sm">
                        고객 문자발송
                      </Button>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-1/6">
                  바우처 발송
                </td>
                <td className="py-3 px-4 w-5/12">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Select
                        value={formData.voucherStatus}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            voucherStatus: value as '바우처 준비' | '바우처 발송',
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="바우처 준비">바우처 준비</SelectItem>
                          <SelectItem value="바우처 발송">바우처 발송</SelectItem>
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
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                      <Button variant="outline" size="sm">
                        고객 메일발송
                      </Button>
                      <Input
                        placeholder="휴대전화"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                      <Button variant="outline" size="sm">
                        고객 문자발송
                      </Button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 관리 히스토리 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">관리 히스토리</h2>
        </div>
        <div className="p-6">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 w-1/6">
                  수정일자
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-500">수정 내역이 없습니다.</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 하단 액션 버튼 */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" asChild>
          <Link href="/reservations/travel">
            <ArrowLeft className="h-4 w-4 mr-2" />
            리스트
          </Link>
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          수정
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
