export function randomId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `overlay-${timestamp}${random}`;
}
