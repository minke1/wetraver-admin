/**
 * 로딩 스피너 컴포넌트
 *
 * 사용 예시:
 * if (loading) return <LoadingSpinner />;
 */

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
  );
}

/**
 * 작은 로딩 스피너 (버튼 안 등에 사용)
 */
export function LoadingSpinnerSmall() {
  return (
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
  );
}

/**
 * 텍스트와 함께 표시되는 로딩
 */
export function LoadingWithText({ text = '로딩 중...' }: { text?: string }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}
