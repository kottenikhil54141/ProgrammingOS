/**
 * Monkey-patch for Pointer Capture API browser exceptions.
 * 
 * In modern web browsers, pointer capture is automatically released by the browser
 * during mouseup, pointerup, or pointercancel events. If a library (like Radix UI,
 * Framer Motion, or Next.js dev overlay) attempts to call releasePointerCapture manually
 * after it has been automatically released, the browser throws a NotFoundError DOMException.
 * 
 * This patch wraps the native releasePointerCapture and setPointerCapture methods in a
 * try-catch block to gracefully swallow these safe-to-ignore NotFoundError exceptions
 * and prevent the application / console from crashing.
 */

if (typeof window !== "undefined" && typeof Element !== "undefined") {
  if (Element.prototype.releasePointerCapture) {
    const originalReleasePointerCapture = Element.prototype.releasePointerCapture;
    Element.prototype.releasePointerCapture = function (this: Element, pointerId: number) {
      try {
        originalReleasePointerCapture.call(this, pointerId);
      } catch (err) {
        if (
          err instanceof Error &&
          (err.name === "NotFoundError" ||
            err.message.includes("No active pointer") ||
            err.message.includes("releasePointerCapture"))
        ) {
          // Swallow the error as the pointer has already been released or is invalid
          return;
        }
        throw err;
      }
    };
  }

  if (Element.prototype.setPointerCapture) {
    const originalSetPointerCapture = Element.prototype.setPointerCapture;
    Element.prototype.setPointerCapture = function (this: Element, pointerId: number) {
      try {
        originalSetPointerCapture.call(this, pointerId);
      } catch (err) {
        if (
          err instanceof Error &&
          (err.name === "NotFoundError" ||
            err.message.includes("No active pointer") ||
            err.message.includes("setPointerCapture"))
        ) {
          // Swallow the error as the pointer is no longer active
          return;
        }
        throw err;
      }
    };
  }
}
