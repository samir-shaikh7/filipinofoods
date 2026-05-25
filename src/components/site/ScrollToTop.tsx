import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export function ScrollToTop() {
  const location = useLocation();
  const navType = useNavigationType();
  const scrollTimeout = useRef<number>();

  // Continuously save the scroll position for the current location key
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(`scroll-${location.key}`, window.scrollY.toString());
    };

    // Save immediately in case we don't scroll
    handleScroll();
    
    // Use passive event listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.key]);

  useLayoutEffect(() => {
    if (navType === "POP") {
      const savedPosition = sessionStorage.getItem(`scroll-${location.key}`);
      if (savedPosition !== null) {
        const y = parseInt(savedPosition, 10);
        // Try restoring immediately and also after a short delay to account for rendering
        window.scrollTo(0, y);
        
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = window.setTimeout(() => {
          window.scrollTo(0, y);
        }, 50);
        return;
      }
    }
    
    // For PUSH or REPLACE navigation, we scroll to top.
    // However, if there's a hash, let useHashScroll handle it.
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.key, navType, location.hash]);

  return null;
}
