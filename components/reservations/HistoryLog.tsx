interface HistoryLogProps {
  reservationId: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function HistoryLog({ reservationId }: HistoryLogProps) {
  // TODO: 향후 히스토리 API 연동 시 데이터 로드
  // reservationId는 향후 히스토리 조회에 사용될 예정

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
  );
}
