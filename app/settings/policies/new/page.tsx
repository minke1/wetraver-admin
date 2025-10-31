"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function PolicyNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [pcContent, setPcContent] = useState("");
  const [mobileContent, setMobileContent] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("약관명을 입력하세요.");
      return;
    }

    console.log("저장 데이터:", {
      title,
      contentPC: pcContent,
      contentMobile: mobileContent,
    });

    toast.success("약관이 등록되었습니다.");
    router.push("/settings/policies");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/settings/policies">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                리스트
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                약관 및 정책 신규등록
              </h1>
            </div>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            등록
          </Button>
        </div>

        {/* 폼 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* 약관명 */}
          <div className="space-y-2">
            <Label htmlFor="title">약관명</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="약관명을 입력하세요"
            />
          </div>

          {/* PC 내용 */}
          <div className="space-y-2">
            <Label htmlFor="pcContent">PC</Label>
            <textarea
              id="pcContent"
              value={pcContent}
              onChange={(e) => setPcContent(e.target.value)}
              placeholder="PC 내용을 입력하세요"
              className="w-full min-h-[500px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* 모바일 내용 */}
          <div className="space-y-2">
            <Label htmlFor="mobileContent">모바일</Label>
            <textarea
              id="mobileContent"
              value={mobileContent}
              onChange={(e) => setMobileContent(e.target.value)}
              placeholder="모바일 내용을 입력하세요"
              className="w-full min-h-[500px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
