import { atom } from 'nanostores';
import type { AsyncOverlayState, OverlayState } from '../types';

export const $overlays = atom<
  Record<string, OverlayState | AsyncOverlayState>
>({});

type OverlayId = string;
export const $overlayOrder = atom<OverlayId[]>([]);

export const addOverlay = (
  overlayId: OverlayId,
  overlay: OverlayState | AsyncOverlayState
) => {
  $overlays.set({
    ...$overlays.get(),
    [overlayId]: overlay,
  });

  $overlayOrder.set([...$overlayOrder.get(), overlayId]);
};

export const removeOverlay = (overlayId: OverlayId) => {
  const overlays = $overlays.get();
  const { [overlayId]: removed, ...remaining } = overlays;
  $overlays.set(remaining);

  $overlayOrder.set(
    $overlayOrder.get().filter((id: OverlayId) => id !== overlayId)
  );
};

export const clearAllOverlays = () => {
  $overlays.set({});
  $overlayOrder.set([]);
};

export const getOverlay = (overlayId: OverlayId) => {
  return $overlays.get()[overlayId];
};
