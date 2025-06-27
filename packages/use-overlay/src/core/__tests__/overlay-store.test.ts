import { beforeEach, describe, expect, it } from 'vitest';
import type { OverlayState } from '../../types';
import {
  $overlayOrder,
  $overlays,
  addOverlay,
  clearAllOverlays,
  getOverlay,
  removeOverlay,
} from '../overlay-store';

describe('overlay-store', () => {
  const createMockOverlay = (id: string): OverlayState => ({
    isOpen: true,
    renderOverlay: () => null,
    onRequestClose: () => {},
  });

  beforeEach(() => {
    clearAllOverlays();
  });

  describe('addOverlay()', () => {
    it('오버레이를 추가하면 store와 순서 목록에 저장된다', () => {
      const overlayId = 'test-overlay';
      const overlay = createMockOverlay(overlayId);

      addOverlay(overlayId, overlay);

      expect($overlays.get()[overlayId]).toBe(overlay);
      expect($overlayOrder.get()).toContain(overlayId);
    });

    it('여러 오버레이를 추가하면 순서대로 저장된다', () => {
      const firstId = 'first';
      const secondId = 'second';

      addOverlay(firstId, createMockOverlay(firstId));
      addOverlay(secondId, createMockOverlay(secondId));

      const order = $overlayOrder.get();
      expect(order[0]).toBe(firstId);
      expect(order[1]).toBe(secondId);
    });
  });

  describe('removeOverlay()', () => {
    it('오버레이를 제거하면 store와 순서 목록에서 삭제된다', () => {
      const overlayId = 'test-overlay';
      addOverlay(overlayId, createMockOverlay(overlayId));

      removeOverlay(overlayId);

      expect($overlays.get()[overlayId]).toBeUndefined();
      expect($overlayOrder.get()).not.toContain(overlayId);
    });
  });

  describe('clearAllOverlays()', () => {
    it('모든 오버레이를 제거하면 store와 순서 목록이 비워진다', () => {
      addOverlay('first', createMockOverlay('first'));
      addOverlay('second', createMockOverlay('second'));

      clearAllOverlays();

      expect(Object.keys($overlays.get())).toHaveLength(0);
      expect($overlayOrder.get()).toHaveLength(0);
    });
  });

  describe('getOverlay()', () => {
    it('존재하는 오버레이 ID로 조회하면 해당 오버레이를 반환한다', () => {
      const overlayId = 'test-overlay';
      const overlay = createMockOverlay(overlayId);
      addOverlay(overlayId, overlay);

      const result = getOverlay(overlayId);

      expect(result).toBe(overlay);
    });

    it('존재하지 않는 오버레이 ID로 조회하면 undefined를 반환한다', () => {
      const result = getOverlay('non-existent');

      expect(result).toBeUndefined();
    });
  });
});
