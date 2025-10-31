"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const permissionGroups = [
  {
    title: "여행후기 관리",
    items: ["여행후기관리"],
  },
  {
    title: "상품등록 관리",
    items: [
      "공통코드",
      "호텔 상품관리",
      "투어 상품관리",
      "K-뷰티 상품관리",
      "입장권 상품관리",
      "레스토랑 상품관리",
      "K-goods 상품관리",
      "차량 상품관리",
      "가이드 상품",
      "차량 정보관리",
      "기사님 소개관리",
      "쿠폰상품등록",
      "추천여행지(정보)",
      "추천여행지(상품)",
      "테마별 인기호텔",
    ],
  },
  {
    title: "랜딩페이지",
    items: ["랜딩페이지 관리"],
  },
  {
    title: "추천상품/배너 관리",
    items: [
      "메인 관리",
      "호텔 관리",
      "투어 관리",
      "K-뷰티 관리",
      "입장권 관리",
      "레스토랑 관리",
      "차량 관리",
      "가이드 관리",
      "커뮤니티 관리",
    ],
  },
  {
    title: "게시판관리",
    items: [
      "공지사항",
      "자주하시는질문",
      "당첨자 발표",
      "이벤트관리",
      "매거진 관리",
      "타임세일 관리",
      "여행정보 관리",
      "인포그래픽 관리",
      "추천여행",
    ],
  },
  {
    title: "상품예약",
    items: [
      "상품결제내역",
      "여행상품예약",
      "정산관리",
      "상품 Q&A",
      "1:1 여행상담",
      "문의하기",
      "쿠폰사용관리",
      "마일리지관리",
    ],
  },
  {
    title: "회원관리",
    items: [
      "일반회원관리",
      "탈퇴회원관리",
      "회원등급관리",
      "이메일 관리",
      "SMS 관리",
    ],
  },
  {
    title: "환경설정",
    items: [
      "팝업관리",
      "약관및정책관리",
      "환경설정",
      "운영자계정관리",
      "추천 검색어",
      "아이피 차단",
    ],
  },
  {
    title: "통계관리",
    items: ["매출분석", "회원및 방문분석"],
  },
];

export default function AdminNewPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [directPhone, setDirectPhone] = useState("");
  const [status, setStatus] = useState<"이용중" | "정지중">("이용중");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isIdChecked, setIsIdChecked] = useState(false);

  const handleIdCheck = () => {
    if (!userId.trim()) {
      toast.error("아이디를 입력하세요.");
      return;
    }
    // 실제로는 서버에 중복 확인 요청
    toast.success("사용 가능한 아이디입니다.");
    setIsIdChecked(true);
  };

  const handleSelectAllPermissions = () => {
    const allPermissions = permissionGroups.flatMap((group) => group.items);
    setPermissions(allPermissions);
  };

  const handleClearAllPermissions = () => {
    setPermissions([]);
  };

  const handlePermissionToggle = (permission: string) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter((p) => p !== permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  };

  const handleSave = () => {
    if (!userId.trim()) {
      toast.error("아이디를 입력하세요.");
      return;
    }
    if (!isIdChecked) {
      toast.error("아이디 중복확인을 해주세요.");
      return;
    }
    if (!password.trim()) {
      toast.error("비밀번호를 입력하세요.");
      return;
    }
    if (!name.trim()) {
      toast.error("이름을 입력하세요.");
      return;
    }

    console.log("저장 데이터:", {
      userId,
      password,
      name,
      position,
      email,
      phone,
      directPhone,
      status,
      permissions,
      imageFile,
    });

    toast.success("직원이 등록되었습니다.");
    router.push("/settings/admins");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/settings/admins">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                리스트
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                직원정보 추가
              </h1>
            </div>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            등록
          </Button>
        </div>

        {/* 폼 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="w-full">
            <tbody>
              {/* 아이디 & 비밀번호 */}
              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 bg-gray-50 font-medium text-sm text-gray-700 w-48">
                  아이디
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 max-w-md">
                    <Input
                      value={userId}
                      onChange={(e) => {
                        setUserId(e.target.value);
                        setIsIdChecked(false);
                      }}
                      placeholder="아이디를 입력하세요"
                      className="flex-1"
                    />
                    <Button onClick={handleIdCheck} variant="outline" size="sm">
                      중복확인
                    </Button>
                  </div>
                </td>
                <td className="px-6 py-4 bg-gray-50 font-medium text-sm text-gray-700 w-48">
                  비밀번호
                </td>
                <td className="px-6 py-4">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    className="max-w-md"
                  />
                </td>
              </tr>

              {/* 이메일 & 직급 */}
              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 bg-gray-50 font-medium text-sm text-gray-700">
                  이메일
                </td>
                <td className="px-6 py-4">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
                    className="max-w-md"
                  />
                </td>
                <td className="px-6 py-4 bg-gray-50 font-medium text-sm text-gray-700">
                  직급
                </td>
                <td className="px-6 py-4">
                  <Input
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="직급을 입력하세요"
                    className="max-w-md"
                  />
                </td>
              </tr>

              {/* 이름 & 휴대폰 */}
              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 bg-gray-50 font-medium text-sm text-gray-700">
                  이름
                </td>
                <td className="px-6 py-4">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력하세요"
                    className="max-w-md"
                  />
                </td>
                <td className="px-6 py-4 bg-gray-50 font-medium text-sm text-gray-700">
                  휴대폰
                </td>
                <td className="px-6 py-4">
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="휴대폰 번호를 입력하세요"
                    className="max-w-md"
                  />
                </td>
              </tr>

              {/* 현황 & 직통번호 */}
              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 bg-gray-50 font-medium text-sm text-gray-700">
                  현황
                </td>
                <td className="px-6 py-4">
                  <Select
                    value={status}
                    onValueChange={(value) =>
                      setStatus(value as "이용중" | "정지중")
                    }
                  >
                    <SelectTrigger className="max-w-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="이용중">이용중</SelectItem>
                      <SelectItem value="정지중">정지중</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-6 py-4 bg-gray-50 font-medium text-sm text-gray-700">
                  직통번호
                </td>
                <td className="px-6 py-4">
                  <Input
                    value={directPhone}
                    onChange={(e) => setDirectPhone(e.target.value)}
                    placeholder="직통번호를 입력하세요"
                    className="max-w-md"
                  />
                </td>
              </tr>

              {/* 권한 */}
              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 bg-gray-50 font-medium text-sm text-gray-700 align-top">
                  권한
                </td>
                <td className="px-6 py-4" colSpan={3}>
                  <div className="space-y-4">
                    <div className="flex gap-2 mb-4">
                      <Button
                        onClick={handleSelectAllPermissions}
                        variant="outline"
                        size="sm"
                      >
                        전체선택
                      </Button>
                      <Button
                        onClick={handleClearAllPermissions}
                        variant="outline"
                        size="sm"
                      >
                        선택취소
                      </Button>
                    </div>
                    <table className="w-full border border-gray-300">
                      <tbody>
                        {permissionGroups.map((group, groupIndex) => (
                          <tr
                            key={groupIndex}
                            className="border-b border-gray-300 last:border-0"
                          >
                            <td className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700 w-48 align-top">
                              {group.title}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-3">
                                {group.items.map((item, itemIndex) => (
                                  <label
                                    key={itemIndex}
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={permissions.includes(item)}
                                      onChange={() =>
                                        handlePermissionToggle(item)
                                      }
                                      className="h-4 w-4 text-primary-600 rounded border-gray-300"
                                    />
                                    <span className="text-sm text-gray-700">
                                      {item}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>

              {/* 이미지첨부 */}
              <tr>
                <td className="px-6 py-4 bg-gray-50 font-medium text-sm text-gray-700">
                  이미지첨부
                </td>
                <td className="px-6 py-4" colSpan={3}>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="max-w-md"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
