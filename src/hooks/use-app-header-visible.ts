import { useEffect, useRef, useState } from "react";

export const APP_HEADER_HEIGHT_PX = 48;

const SCROLL_HIDE_THRESHOLD_PX = 48;
const SCROLL_DIRECTION_DELTA_PX = 4;

export function useAppHeaderVisible() {
  const [visible, setVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;

      if (currentScrollY <= SCROLL_HIDE_THRESHOLD_PX) {
        setVisible(true);
      } else if (delta > SCROLL_DIRECTION_DELTA_PX) {
        setVisible(false);
      } else if (delta < -SCROLL_DIRECTION_DELTA_PX) {
        setVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return visible;
}
