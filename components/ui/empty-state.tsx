import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * 빈 상태 컴포넌트
 *
 * 사용 예시:
 * if (data.length === 0) return <EmptyState message="데이터가 없습니다" />;
 */

interface EmptyStateProps {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col justify-center items-center min-h-[400px] text-center">
      <FileQuestion className="h-16 w-16 text-gray-400 mb-4" />
      <p className="text-gray-600 mb-4">{message}</p>
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}
