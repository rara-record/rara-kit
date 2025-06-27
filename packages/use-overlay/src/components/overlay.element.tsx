import { memo } from 'react';
import type {
  AsyncOverlayState,
  OverlayElementProps,
  OverlayState,
} from '../types';

/**
 * 일반 오버레이 렌더링 컴포넌트
 */
const StandardOverlayElement = memo(function StandardOverlayElement({
  overlay,
}: {
  overlay: OverlayState;
}) {
  const { renderOverlay, ...overlayProps } = overlay;
  return <>{renderOverlay(overlayProps)}</>;
});

/**
 * 비동기 오버레이 렌더링 컴포넌트
 */
const AsyncOverlayElement = memo(function AsyncOverlayElement({
  overlay,
}: {
  overlay: AsyncOverlayState;
}) {
  const { renderOverlay, ...overlayProps } = overlay;
  return <>{renderOverlay(overlayProps)}</>;
});

/**
 * 오버레이 타입을 판별하고 적절한 컴포넌트를 렌더링
 */
export const OverlayElement = memo(function OverlayElement({
  overlayId,
  overlay,
}: OverlayElementProps) {
  // 비동기 오버레이 판별 (resolve 함수가 있으면 비동기)
  const isAsyncOverlay = 'resolve' in overlay;

  if (isAsyncOverlay) {
    return (
      <AsyncOverlayElement
        key={overlayId}
        overlay={overlay as AsyncOverlayState}
      />
    );
  }

  return (
    <StandardOverlayElement
      key={overlayId}
      overlay={overlay as OverlayState}
    />
  );
});
