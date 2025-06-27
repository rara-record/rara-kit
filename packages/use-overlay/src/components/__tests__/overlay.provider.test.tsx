import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { overlay } from '../../core';
import { OverlayProvider } from '../overlay.provider';

interface TestOverlayProps {
  onRequestClose?: () => void;
  children?: React.ReactNode;
  testId?: string;
}

const OverlayTest = ({
  onRequestClose,
  children,
  testId = 'test-overlay',
}: TestOverlayProps) => (
  <div data-testid={testId} role="dialog">
    {children}
    {onRequestClose && (
      <button onClick={onRequestClose}>Close</button>
    )}
  </div>
);

describe('OverlayProvider', () => {
  afterEach(() => {
    act(() => {
      overlay.closeAll();
    });
  });

  it('Provider로 감싼 자식 요소가 화면에 표시된다', () => {
    // Given
    const childText = '자식 컴포넌트';

    // When
    render(
      <OverlayProvider>
        <div data-testid="test-child">{childText}</div>
      </OverlayProvider>
    );

    // Then
    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  it('닫기 버튼을 클릭하면 해당 오버레이가 화면에서 사라진다', async () => {
    // Given
    render(<OverlayProvider />);

    // When
    act(() => {
      overlay.open(({ onRequestClose }) => (
        <OverlayTest onRequestClose={onRequestClose}>
          오버레이 내용
        </OverlayTest>
      ));
    });

    // Then
    await waitFor(() => {
      expect(screen.getByText('오버레이 내용')).toBeInTheDocument();
    });

    // When
    fireEvent.click(screen.getByText('Close'));

    // Then
    await waitFor(() => {
      expect(
        screen.queryByText('오버레이 내용')
      ).not.toBeInTheDocument();
    });
  });

  it('여러 오버레이가 있을 때 closeAll을 호출하면 모든 오버레이가 화면에서 사라진다', async () => {
    // Given
    render(<OverlayProvider />);
    const overlayContents = ['첫 번째', '두 번째', '세 번째'];

    // When
    act(() => {
      overlayContents.forEach((content) => {
        overlay.open(() => <OverlayTest>{content}</OverlayTest>);
      });
    });

    // Then
    await waitFor(() => {
      overlayContents.forEach((content) => {
        expect(screen.getByText(content)).toBeInTheDocument();
      });
    });

    // When
    act(() => {
      overlay.closeAll();
    });

    // Then
    await waitFor(() => {
      overlayContents.forEach((content) => {
        expect(screen.queryByText(content)).not.toBeInTheDocument();
      });
    });
  });

  it('오버레이를 여러 개 열면 나중에 연 오버레이가 위에 쌓인다', async () => {
    // Given
    render(<OverlayProvider />);
    const overlayContents = ['첫 번째', '두 번째'];

    // When
    act(() => {
      overlayContents.forEach((content) => {
        overlay.open(() => <OverlayTest>{content}</OverlayTest>);
      });
    });

    // Then
    await waitFor(() => {
      const overlays = screen.getAllByRole('dialog');
      expect(overlays).toHaveLength(2);
      expect(overlays[0]).toHaveTextContent(overlayContents[0]);
      expect(overlays[1]).toHaveTextContent(overlayContents[1]);
    });
  });
});
