import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { type PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { OverlayProvider } from '../../components/overlay.provider';
import type { AsyncOverlayProps } from '../../types';
import { overlay } from '../overlay';
import {
  $overlayOrder,
  $overlays,
  clearAllOverlays,
} from '../overlay-store';

function Wrapper({ children }: PropsWithChildren) {
  return <OverlayProvider>{children}</OverlayProvider>;
}

function renderWithUser<T extends React.JSX.Element>(
  component: T,
  options?: Parameters<typeof render>[1]
) {
  const user = userEvent.setup();
  return {
    ...render(component, { wrapper: Wrapper, ...options }),
    user,
  };
}

describe('overlay', () => {
  beforeEach(() => {
    clearAllOverlays();
  });

  describe('open()', () => {
    it('오버레이를 열면 store에 오버레이가 추가된다', () => {
      const renderFn = () => <div>Test Overlay</div>;

      overlay.open(renderFn);

      const overlays = $overlays.get();
      const order = $overlayOrder.get();

      expect(Object.keys(overlays)).toHaveLength(1);
      expect(order).toHaveLength(1);
      expect(overlays[order[0]].renderOverlay).toBe(renderFn);
    });

    it('오버레이를 닫으면 store에서 오버레이가 제거된다', () => {
      const renderFn = () => <div>Test Overlay</div>;

      const close = overlay.open(renderFn);
      close();

      const overlays = $overlays.get();
      const order = $overlayOrder.get();

      expect(Object.keys(overlays)).toHaveLength(0);
      expect(order).toHaveLength(0);
    });
  });

  describe('openAsync()', () => {
    it('비동기 오버레이를 열면 Promise를 반환한다', () => {
      const renderFn = ({ resolve }: AsyncOverlayProps<string>) => (
        <button onClick={() => resolve('result')}>Resolve</button>
      );

      const promise = overlay.openAsync(renderFn);
      expect(promise).toBeInstanceOf(Promise);
    });

    it('비동기 오버레이에서 resolve 호출하면 전달한 값이 Promise 결과가 된다', async () => {
      const overlayContent = 'overlay-content';
      const expectedResult = 'test result';

      function TestComponent() {
        const [result, setResult] = React.useState<string>();

        return (
          <>
            <button
              onClick={async () => {
                const result = await overlay.openAsync<string>(
                  ({ isOpen, resolve }) =>
                    isOpen && (
                      <button onClick={() => resolve(expectedResult)}>
                        {overlayContent}
                      </button>
                    )
                );
                setResult(result);
              }}
            >
              Open Overlay
            </button>
            {result && <div data-testid="result">{result}</div>}
          </>
        );
      }

      // Given: 컴포넌트를 렌더링하고
      const { user } = renderWithUser(<TestComponent />);

      // When: 오버레이를 열고 닫기 버튼을 클릭하면
      await user.click(screen.getByText('Open Overlay'));
      await user.click(await screen.findByText(overlayContent));

      // Then: Promise가 expectedResult로 resolve된다
      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent(
          expectedResult
        );
      });
    });

    it('비동기 오버레이가 닫히면 DOM에서 제거된다', async () => {
      const overlayContent = 'overlay-content';

      function TestComponent() {
        return (
          <button
            onClick={() => {
              overlay.openAsync<string>(
                ({ isOpen, resolve, onRequestClose }) =>
                  isOpen && (
                    <button
                      onClick={() => {
                        resolve('any');
                        onRequestClose();
                      }}
                    >
                      {overlayContent}
                    </button>
                  )
              );
            }}
          >
            Open Overlay
          </button>
        );
      }

      // Given: 컴포넌트를 렌더링하고
      const { user } = renderWithUser(<TestComponent />);

      // When: 오버레이를 열고
      await user.click(screen.getByText('Open Overlay'));

      // Then: 오버레이가 DOM에 있다
      expect(
        await screen.findByText(overlayContent)
      ).toBeInTheDocument();

      // When: 닫기 버튼을 클릭하면
      await user.click(screen.getByText(overlayContent));

      // Then: 오버레이가 DOM에서 제거된다
      await waitFor(() => {
        expect(
          screen.queryByText(overlayContent)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('closeAll()', () => {
    it('여러 오버레이가 있을 때 모든 오버레이를 닫는다', () => {
      const renderFn = () => <div>Test Overlay</div>;

      overlay.open(renderFn);
      overlay.open(renderFn);
      overlay.open(renderFn);

      expect(Object.keys($overlays.get())).toHaveLength(3);

      overlay.closeAll();

      expect(Object.keys($overlays.get())).toHaveLength(0);
      expect($overlayOrder.get()).toHaveLength(0);
    });
  });
});
