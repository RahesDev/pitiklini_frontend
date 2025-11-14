import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Protect a single SPA route from accidental leave (works with BrowserRouter).
 * - message: confirmation message shown when leaving
 * - pagePath: exact path to protect (e.g. "/deposit")
 * - enable: boolean to toggle protection (optional)
 *
 * Usage:
 *   usePageLeaveConfirm("Are you sure?", "/deposit");
 */
export function usePageLeaveConfirm(
  message = "Are you sure you want to leave this page?",
  pagePath = "/deposit",
  enable = true
) {
  const location = useLocation();
  const navigate = useNavigate();

  // refs
  const protectedActive = useRef(false); // true when user is on protected page
  const isConfirming = useRef(false);
  const currentPath = useRef(location.pathname);

  // Helper to show confirm
  const askConfirm = (msg) => {
    try {
      return window.confirm(msg);
    } catch {
      return true;
    }
  };

  // update currentPath and flag when we arrive on protected page
  useEffect(() => {
    currentPath.current = location.pathname;
    if (!enable) return;

    if (location.pathname === pagePath) {
      protectedActive.current = true;

      // create a sentinel in history so back/forward will produce a popstate with our marker:
      // 1) replace current entry with a marker state
      // 2) push a new blank state on top so that "back" hits the marker
      try {
        window.history.replaceState(
          { __leave_confirm: true },
          "",
          window.location.href
        );
        window.history.pushState({}, "", window.location.href);
      } catch (err) {
        // ignore if browser refuses (shouldn't normally)
      }
    }
  }, [location.pathname, pagePath, enable]);

  // browser refresh / close
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

  // intercept normal clicks on links (capture phase so we run before router)
  useEffect(() => {
    if (!enable) return;
    const onClickCapture = (e) => {
      if (!protectedActive.current) return;
      if (isConfirming.current) return;

      const anchor = e.target.closest("a[href]");
      if (!anchor) return;
      if (anchor.target === "_blank") return; // allow new tab
      if (anchor.hasAttribute("data-no-confirm")) return;

      // resolve destination path
      let href = anchor.getAttribute("href") || anchor.href;
      if (!href) return;
      let dest;
      try {
        dest = new URL(href, window.location.href).pathname;
      } catch {
        return;
      }

      if (dest !== currentPath.current) {
        isConfirming.current = true;
        const ok = askConfirm(message);
        if (!ok) {
          e.preventDefault();
          e.stopImmediatePropagation();
          // restore sentinel (we kept the user on page)
          try {
            window.history.pushState({}, "", window.location.href);
          } catch {}
        } else {
          // user accepts leaving -> cleanup protection (so we don't re-prompt unnecessarily)
          protectedActive.current = false;
          // remove sentinel marker by replacing history state with normal
          try {
            window.history.replaceState({}, "", window.location.href);
          } catch {}
        }
        setTimeout(() => (isConfirming.current = false), 0);
      }
    };

    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, [message, pagePath, enable]);

  // intercept programmatic navigation / pushState & replaceState
  useEffect(() => {
    if (!enable) return;
    const origPush = window.history.pushState;
    const origReplace = window.history.replaceState;

    window.history.pushState = function (...args) {
      try {
        const url = args[2];
        const dest = url ? new URL(url, window.location.href).pathname : null;
        if (protectedActive.current && dest && dest !== currentPath.current) {
          const ok = askConfirm(message);
          if (!ok) {
            return; // blocked
          } else {
            protectedActive.current = false;
          }
        }
      } catch {}
      return origPush.apply(window.history, args);
    };

    window.history.replaceState = function (...args) {
      try {
        const url = args[2];
        const dest = url ? new URL(url, window.location.href).pathname : null;
        if (protectedActive.current && dest && dest !== currentPath.current) {
          const ok = askConfirm(message);
          if (!ok) {
            return; // blocked
          } else {
            protectedActive.current = false;
          }
        }
      } catch {}
      return origReplace.apply(window.history, args);
    };

    return () => {
      window.history.pushState = origPush;
      window.history.replaceState = origReplace;
    };
  }, [message, pagePath, enable]);

  // handle popstate — detect the sentinel marker we placed on entry
  useEffect(() => {
    if (!enable) return;
    const onPop = (event) => {
      // event.state is the state of the new history entry we popped to
      // if it contains our sentinel __leave_confirm and we were on the protected page,
      // that indicates user pressed Back from the duplicate top entry -> confirm.
      const state = event.state;
      if (!protectedActive.current) return;
      if (isConfirming.current) return;

      // If event.state has our marker OR the new pathname is NOT pagePath (leaving),
      // we should show confirm. We check both to be robust across browsers.
      const newPath = window.location.pathname;
      const sentinelHit = state && state.__leave_confirm === true;

      if (
        sentinelHit ||
        (currentPath.current === pagePath && newPath !== pagePath)
      ) {
        isConfirming.current = true;
        const ok = askConfirm(message);
        if (!ok) {
          // user cancelled: push back to protected page and keep app route
          try {
            // push a fresh entry for the deposit page so the user remains
            window.history.pushState({}, "", pagePath);
            navigate(pagePath, { replace: true });
          } catch {
            window.location.href = pagePath;
          }
        } else {
          // user accepted leaving — mark inactive so we don't show again until re-entry
          protectedActive.current = false;
        }
        setTimeout(() => (isConfirming.current = false), 0);
      }
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [message, pagePath, navigate, enable]);
}
