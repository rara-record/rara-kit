import type { AsyncOverlayState, OverlayState } from '../types';
import { randomId } from '../utils';
import {
  addOverlay,
  clearAllOverlays,
  removeOverlay,
} from './overlay-store';

/**
 * 오버레이 열기 함수
 */
const openOverlay = (
  renderOverlay: OverlayState['renderOverlay']
) => {
  const overlayId = randomId();

  const closeOverlay = () => {
    removeOverlay(overlayId);
  };

  const overlayState: OverlayState = {
    isOpen: true,
    renderOverlay,
    onRequestClose: closeOverlay,
  };

  addOverlay(overlayId, overlayState);

  return closeOverlay;
};

/**
 * 비동기 오버레이 열기 함수
 */
const openAsyncOverlay = async <T>(
  renderOverlay: AsyncOverlayState<T>['renderOverlay']
): Promise<T> => {
  return new Promise<T>((resolve) => {
    const overlayId = randomId();

    const closeOverlay = () => {
      removeOverlay(overlayId);
    };

    // resolve와 onRequestClose를 함께 처리하는 래퍼 함수
    const wrappedResolve = (value: T) => {
      resolve(value);
      closeOverlay();
    };

    const overlayState: AsyncOverlayState<T> = {
      isOpen: true,
      renderOverlay,
      onRequestClose: closeOverlay,
      resolve: wrappedResolve,
    };

    addOverlay(overlayId, overlayState);
  });
};

/**
 * 모든 오버레이 닫기 함수
 */
const closeAllOverlays = () => {
  clearAllOverlays();
};

/**
 * 전역 overlay 객체
 */
export const overlay = {
  open: openOverlay,
  openAsync: openAsyncOverlay,
  closeAll: closeAllOverlays,
} as const;
