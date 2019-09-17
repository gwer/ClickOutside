/**
 * HOC for detect click outside of component.
 * It can be more simple, but will not work with portals.
 * Inspired by https://github.com/adazzle/react-data-grid/blob/26f4dafe68fbebef312ea7c146b44f039d48c1b9/packages/react-data-grid/src/common/editors/ClickOutside.tsx
 * The original component doesn't work well with touch devices.
 */
import React, { useLayoutEffect, useRef, forwardRef } from 'react';

function ClickOutside({ onClickOutside, className, children }, ref) {
  // click is broken on iPhone
  const touchEvent = 'ontouchstart' in window ? 'touchstart' : 'mousedown';
  const touchCaptureProp = 'ontouchstart' in window
    ? 'onTouchStartCapture'
    : 'onMouseDownCapture';

  const isClickedInside = useRef(false);

  useLayoutEffect(() => {
    function handleDocumentClick() {
      if (isClickedInside.current) {
        isClickedInside.current = false;
      } else {
        onClickOutside();
      }
    }

    document.addEventListener(touchEvent, handleDocumentClick);
    return () => {
      document.removeEventListener(touchEvent, handleDocumentClick);
    };
  }, [onClickOutside]);

  return (
    <div
      ref={ref}
      className={className}
      {...{ [touchCaptureProp]: () => isClickedInside.current = true }}
    >
      {children}
    </div>
  );
}

export default forwardRef(ClickOutside);
