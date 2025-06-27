import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// 각 테스트 후 cleanup 실행
afterEach(() => {
  cleanup();
  // Portal 요소 정리
  const overlayRoot = document.querySelector('#overlay-root');
  if (overlayRoot) {
    overlayRoot.remove();
  }
  // body 스타일 초기화
  document.body.style.overflow = '';
});
