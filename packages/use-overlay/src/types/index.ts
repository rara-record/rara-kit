import { ReactNode } from 'react';

export type OverlayProps = {
  isOpen: boolean;
  onRequestClose: () => void;
};

export type OverlayState = {
  isOpen: boolean;
  renderOverlay: (props: OverlayProps) => ReactNode;
  onRequestClose: () => void;
};

export type AsyncOverlayProps<T> = OverlayProps & {
  resolve: (value: T) => void;
};

export type AsyncOverlayState<T = any> = {
  isOpen: boolean;
  renderOverlay: (props: AsyncOverlayProps<T>) => ReactNode;
  onRequestClose: () => void;
  resolve: (value: T) => void;
};

export type OpenOverlayFn = (
  renderOverlay: OverlayState['renderOverlay']
) => () => void;

export type OpenAsyncOverlayFn = <T>(
  renderOverlay: AsyncOverlayState<T>['renderOverlay']
) => Promise<T>;

/**
 * 오버레이 렌더러 props 타입
 */
export interface OverlayRendererProps {
  overlays: Record<string, OverlayState | AsyncOverlayState>;
}

/**
 * 개별 오버레이 엘리먼트 props 타입
 */
export interface OverlayElementProps {
  overlayId: string;
  overlay: OverlayState | AsyncOverlayState;
}
