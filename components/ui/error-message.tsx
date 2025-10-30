import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

/**
 * 에러 메시지 컴포넌트
 *
 * 사용 예시:
 * if (error) return <ErrorMessage error={error} retry={loadData} />;
 */

interface ErrorMessageProps {
  error: string | Error;
  retry?: () => void;
  title?: string;
}

export function ErrorMessage({ error, retry, title = '오류가 발생했습니다' }: ErrorMessageProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
        <p className="text-red-700 mb-4">{errorMessage}</p>
        {retry && (
          <Button onClick={retry} variant="outline">
            다시 시도
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * 작은 인라인 에러 메시지
 */
export function ErrorMessageInline({ error }: { error: string | Error }) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
      {errorMessage}
    </div>
  );
}
