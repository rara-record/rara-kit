import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { AsyncOverlayState, OverlayState } from '../../types';
import { OverlayElement } from '../overlay.element';

describe('OverlayElement', () => {
  it('일반 오버레이를 렌더링할 때 전달된 컨텐츠가 화면에 표시된다', () => {
    const overlayContent = 'Standard Overlay Content';
    const standardOverlay: OverlayState = {
      isOpen: true,
      renderOverlay: ({ isOpen, onRequestClose }) =>
        isOpen && (
          <div
            data-testid="standard-overlay"
            onClick={onRequestClose}
          >
            {overlayContent}
          </div>
        ),
      onRequestClose: () => {},
    };

    render(
      <OverlayElement
        overlayId="test-standard"
        overlay={standardOverlay}
      />
    );

    expect(screen.getByTestId('standard-overlay')).toHaveTextContent(
      overlayContent
    );
  });

  it('비동기 오버레이를 렌더링할 때 resolve 함수와 함께 컨텐츠가 표시된다', () => {
    const overlayContent = 'Async Overlay Content';
    const asyncOverlay: AsyncOverlayState = {
      isOpen: true,
      renderOverlay: ({ isOpen, resolve, onRequestClose }) =>
        isOpen && (
          <div
            data-testid="async-overlay"
            onClick={() => {
              resolve('result');
              onRequestClose();
            }}
          >
            {overlayContent}
          </div>
        ),
      onRequestClose: () => {},
      resolve: () => {},
    };

    render(
      <OverlayElement overlayId="test-async" overlay={asyncOverlay} />
    );

    expect(screen.getByTestId('async-overlay')).toHaveTextContent(
      overlayContent
    );
  });

  it('오버레이가 닫힌 상태일 때 아무것도 렌더링되지 않는다', () => {
    const standardOverlay: OverlayState = {
      isOpen: false,
      renderOverlay: ({ isOpen }) =>
        isOpen && (
          <div data-testid="closed-overlay">Should not render</div>
        ),
      onRequestClose: () => {},
    };

    render(
      <OverlayElement
        overlayId="test-closed"
        overlay={standardOverlay}
      />
    );

    expect(
      screen.queryByTestId('closed-overlay')
    ).not.toBeInTheDocument();
  });
});
