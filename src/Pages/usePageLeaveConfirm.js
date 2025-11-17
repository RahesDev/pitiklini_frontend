import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Protect a route and optionally allow navigating to sub-routes without confirm.
 *
 * allowedPaths example:
 * [
 *   "/postad",
 *   "/payments",
 *   "/p2pchat/:id"
 * ]
 *
 */
export function usePageLeaveConfirm(
  message = "Are you sure you want to leave this page?",
  pagePath = "/deposit",
  enable = true,
  allowedPaths = []
) {
  const location = useLocation();
  const navigate = useNavigate();

  const protectedActive = useRef(false);
  const isConfirming = useRef(false);
  const currentPath = useRef(location.pathname);

  // --- Helper: match allowed paths (supports dynamic params) ---
  const isAllowedPath = (dest) => {
    return allowedPaths.some((allowed) => {
      if (allowed === dest) return true;

      // dynamic path match (e.g. /p2pchat/:id)
      if (allowed.includes("/:")) {
        const base = allowed.split("/:")[0];
        if (dest.startsWith(base)) return true;
      }

      return false;
    });
  };

  const askConfirm = () => {
    try {
      return window.confirm(message);
    } catch {
      return true;
    }
  };

  // Track entering the protected page
  useEffect(() => {
    currentPath.current = location.pathname;
    if (!enable) return;

    if (location.pathname === pagePath) {
      protectedActive.current = true;

      // sentinel marker
      try {
        window.history.replaceState(
          { __leave_confirm: true },
          "",
          window.location.href
        );
        window.history.pushState({}, "", window.location.href);
      } catch {}
    }
  }, [location.pathname, pagePath, enable]);

  // Refresh / Close tab
  useEffect(() => {
    if (!enable) return;
    const onBeforeUnload = (e) => {
      if (protectedActive.current && currentPath.current === pagePath) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [pagePath, enable]);

  // Intercept normal link clicks
  useEffect(() => {
    if (!enable) return;

    const onClickCapture = (e) => {
      if (!protectedActive.current) return;
      if (isConfirming.current) return;

      const anchor = e.target.closest("a[href]");
      if (!anchor) return;

      if (anchor.target === "_blank") return;
      if (anchor.hasAttribute("data-no-confirm")) return;

      let href = anchor.getAttribute("href") || anchor.href;
      if (!href) return;

      let dest;
      try {
        dest = new URL(href, window.location.href).pathname;
      } catch {
        return;
      }

      // If destination is allowed → skip confirm
      if (isAllowedPath(dest)) return;

      // If leaving protected page → confirm
      if (dest !== currentPath.current) {
        isConfirming.current = true;
        const ok = askConfirm();

        if (!ok) {
          e.preventDefault();
          e.stopImmediatePropagation();

          // restore sentinel
          try {
            window.history.pushState({}, "", window.location.href);
          } catch {}
        } else {
          protectedActive.current = false;
        }

        setTimeout(() => (isConfirming.current = false), 0);
      }
    };

    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, [message, pagePath, enable]);

  // Intercept programmatic pushState / replaceState
  useEffect(() => {
    if (!enable) return;

    const origPush = window.history.pushState;
    const origReplace = window.history.replaceState;

    const checkLeave = (dest) => {
      if (!protectedActive.current) return false;
      if (!dest) return false;
      if (dest === currentPath.current) return false;

      // Allowed paths do NOT trigger confirm
      if (isAllowedPath(dest)) return false;

      const ok = askConfirm();
      if (!ok) return true;

      protectedActive.current = false;
      return false;
    };

    window.history.pushState = function (...args) {
      try {
        const url = args[2];
        const dest = url ? new URL(url, window.location.href).pathname : null;

        if (checkLeave(dest)) return;
      } catch {}

      return origPush.apply(window.history, args);
    };

    window.history.replaceState = function (...args) {
      try {
        const url = args[2];
        const dest = url ? new URL(url, window.location.href).pathname : null;

        if (checkLeave(dest)) return;
      } catch {}

      return origReplace.apply(window.history, args);
    };

    return () => {
      window.history.pushState = origPush;
      window.history.replaceState = origReplace;
    };
  }, [message, pagePath, enable]);

  // Handle browser Back button (popstate)
  useEffect(() => {
    if (!enable) return;

    const onPop = (event) => {
      if (!protectedActive.current) return;
      if (isConfirming.current) return;

      const state = event.state;
      const newPath = window.location.pathname;
      const sentinelHit = state && state.__leave_confirm === true;

      // Allowed path → no confirm
      if (isAllowedPath(newPath)) return;

      // Leaving pagePath → confirm
      if (
        sentinelHit ||
        (currentPath.current === pagePath && newPath !== pagePath)
      ) {
        isConfirming.current = true;
        const ok = askConfirm();

        if (!ok) {
          try {
            window.history.pushState({}, "", pagePath);
            navigate(pagePath, { replace: true });
          } catch {
            window.location.href = pagePath;
          }
        } else {
          protectedActive.current = false;
        }

        setTimeout(() => (isConfirming.current = false), 0);
      }
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [message, pagePath, navigate, enable]);
}
