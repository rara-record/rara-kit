import { overlay } from '@rara-kit/use-overlay';
import { useState } from 'react';
import { ConfirmDialog } from './components/modal';

const BasicModalButton = () => (
  <button
    onClick={() => {
      overlay.open(({ isOpen, onRequestClose }) => (
        <ConfirmDialog
          isOpen={isOpen}
          onClose={onRequestClose}
          title="기본 모달"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              이것은 기본 모달의 예시입니다. 모달 내부에 다양한
              컨텐츠를 넣을 수 있습니다.
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-800 mb-2">
                샘플 컨텐츠
              </h3>
              <p className="text-sm text-gray-600">
                모달 내부에 다양한 컴포넌트와 스타일을 적용할 수
                있습니다.
              </p>
            </div>
          </div>
        </ConfirmDialog>
      ));
    }}
    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
  >
    기본 모달 열기
  </button>
);

const AsyncConfirmButton = () => (
  <button
    onClick={async () => {
      const result = await overlay.openAsync<boolean>(
        ({ isOpen, resolve }) => (
          <ConfirmDialog
            isOpen={isOpen}
            onClose={() => {
              resolve(false);
            }}
            onSubmit={() => {
              resolve(true);
            }}
            title="확인이 필요합니다"
          >
            <div className="space-y-4">
              <p className="text-gray-600">계속 진행하시겠습니까?</p>
            </div>
          </ConfirmDialog>
        )
      );

      alert(result ? '확인됨' : '취소됨');
    }}
    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
  >
    확인 모달 열기 (비동기)
  </button>
);

const SequentialModalButton = () => (
  <button
    onClick={async () => {
      const firstResult = await overlay.openAsync<boolean>(
        ({ isOpen, resolve }) => (
          <ConfirmDialog
            isOpen={isOpen}
            onClose={() => {
              resolve(false);
            }}
            onSubmit={() => {
              resolve(true);
            }}
            title="첫 번째 모달"
          >
            <p className="text-gray-600">첫 번째 모달입니다.</p>
          </ConfirmDialog>
        )
      );

      if (firstResult) {
        const secondResult = await overlay.openAsync<boolean>(
          ({ isOpen, resolve }) => (
            <ConfirmDialog
              isOpen={isOpen}
              onClose={() => {
                resolve(false);
              }}
              onSubmit={() => {
                resolve(true);
              }}
              title="두 번째 모달"
            >
              <p className="text-gray-600">두 번째 모달입니다.</p>
            </ConfirmDialog>
          )
        );

        if (secondResult) {
          const thirdResult = await overlay.openAsync<boolean>(
            ({ isOpen, resolve }) => (
              <ConfirmDialog
                isOpen={isOpen}
                onClose={() => {
                  resolve(false);
                }}
                onSubmit={() => {
                  resolve(true);
                }}
                title="세 번째 모달"
              >
                <p className="text-gray-600 w-full">
                  세 번째 모달입니다.
                </p>
              </ConfirmDialog>
            )
          );

          if (thirdResult) {
            alert('모든 모달이 완료되었습니다!');
          }
        }
      }
    }}
    className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
  >
    순차적 모달 열기
  </button>
);

const ErrorTestButton = ({
  setShowError,
}: {
  setShowError: (show: boolean) => void;
}) => (
  <button
    onClick={() => {
      setShowError(true);
    }}
    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
  >
    에러 테스트
  </button>
);

export const OverlayExamples = () => {
  const [showError, setShowError] = useState(false);

  if (showError) {
    throw new Error('의도적으로 발생시킨 에러입니다!');
  }

  return (
    <div className="p-8">
      <h3 className="text-2xl font-bold mb-6">Overlay 사용 예시</h3>
      <div className="flex gap-4 flex-wrap">
        <BasicModalButton />
        <AsyncConfirmButton />
        <SequentialModalButton />
        <ErrorTestButton setShowError={setShowError} />
      </div>
    </div>
  );
};

/**
 * 메인 앱 컴포넌트
 */
export const Demo = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Use-Overlay 라이브러리
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          전역 overlay 객체로 어디서든 모달을 열 수 있습니다!
        </p>
        <OverlayExamples />
      </div>
    </div>
  );
};
