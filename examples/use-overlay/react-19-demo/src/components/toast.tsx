import { overlay } from '@rara-kit/use-overlay';

/**
 * 유틸리티 함수에서의 사용 예시
 */
export const showErrorToast = (message: string) => {
  overlay.open(({ onRequestClose }) => (
    <div className="fixed top-20 right-20 bg-red-500 text-white p-4 rounded-md flex justify-between items-center">
      <div>{message}</div>
      <button onClick={onRequestClose} className="text-black">
        ✕
      </button>
    </div>
  ));
};
