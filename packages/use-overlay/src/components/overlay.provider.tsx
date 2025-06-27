import { useStore } from '@nanostores/react';
import { type PropsWithChildren } from 'react';
import { $overlayOrder, $overlays } from '../core';
import { OverlayElement } from './overlay.element';

/**
 * 오버레이 렌더링 컨테이너
 */
const OverlayContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div id="overlay-root" data-testid="overlay-container">
      {children}
    </div>
  );
};

/**
 * 모든 오버레이를 렌더링하는 메인 컴포넌트
 */
export const OverlayRenderer = () => {
  const overlays = useStore($overlays);
  const overlayOrder = useStore($overlayOrder);

  if (overlayOrder.length === 0) {
    return null;
  }

  return (
    <OverlayContainer>
      {overlayOrder.map((overlayId) => {
        const overlay = overlays[overlayId];

        // 오버레이가 존재하지 않으면 스킵
        if (!overlay) {
          return null;
        }

        return (
          <OverlayElement
            key={overlayId}
            overlayId={overlayId}
            overlay={overlay}
          />
        );
      })}
    </OverlayContainer>
  );
};

export const OverlayProvider = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <OverlayRenderer />
    </>
  );
};
