import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function usePageLeaveConfirm(
  message = "Are you sure you want to leave this page?",
  pagePath = "/deposit"
) {
  const location = useLocation();
  const navigate = useNavigate();

  // refs to hold latest values across closures
  const hasVisitedRef = useRef(false); // set true once user visits the pagePath
  const isConfirmingRef = useRef(false); // guard to avoid re-entrancy
  const currentPathRef = useRef(location.pathname);
  const prevPathRef = useRef(location.pathname);

  // update prev/current path refs on every router location change
  useEffect(() => {
    prevPathRef.current = currentPathRef.current;
    currentPathRef.current = location.pathname;

    // mark as visited when we actually arrive on the protected page
    if (location.pathname === pagePath) {
      hasVisitedRef.current = true;
    }
  }, [location.pathname, pagePath]);

  // 1) browser refresh / tab close -> native confirm
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // only prompt if user has visited the protected page
      if (hasVisitedRef.current && currentPathRef.current === pagePath) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [pagePath]);

  // helper to show confirm safely (returns true if OK)
  const askConfirm = (msg) => {
    try {
      return window.confirm(msg);
    } catch (err) {
      return true;
    }
  };

  // 2) intercept anchor clicks (capture phase, so we run BEFORE React Router's handlers)
  useEffect(() => {
    const onClickCapture = (event) => {
      if (!hasVisitedRef.current) return; // not relevant until user visited pagePath
      if (isConfirmingRef.current) return;

      const anchor = event.target.closest("a[href]");
      if (!anchor) return;

      // skip external / new-tab links
      if (anchor.target === "_blank") return;
      const href = anchor.getAttribute("href") || anchor.href;
      if (!href) return;

      // construct absolute url to parse path
      let destPath;
      try {
        destPath = new URL(href, window.location.href).pathname;
      } catch {
        return;
      }

      // if we're on protected page and trying to navigate away -> confirm
      if (
        currentPathRef.current === pagePath &&
        destPath !== currentPathRef.current
      ) {
        if (anchor.hasAttribute("data-no-confirm")) return;

        isConfirmingRef.current = true;
        const ok = askConfirm(message);
        if (!ok) {
          event.preventDefault();
          event.stopImmediatePropagation();
        } else {
          // user accepted: mark as not visited (we left)
          hasVisitedRef.current = false;
        }
        // small timeout to release guard after React/DOM work
        setTimeout(() => (isConfirmingRef.current = false), 0);
      }
    };

    document.addEventListener("click", onClickCapture, true); // capture phase
    return () => document.removeEventListener("click", onClickCapture, true);
  }, [message, pagePath]);

  // 3) monkeypatch history.pushState / replaceState so programmatic navigate() gets intercepted.
  useEffect(() => {
    const origPush = window.history.pushState;
    const origReplace = window.history.replaceState;

    const safeApply = (origFn, args) => origFn.apply(window.history, args);

    window.history.pushState = function (...args) {
      // args: (state, title, url)
      try {
        if (hasVisitedRef.current && currentPathRef.current === pagePath) {
          const url = args[2];
          const dest = url ? new URL(url, window.location.href).pathname : null;
          if (dest && dest !== currentPathRef.current) {
            if (!askConfirm(message)) {
              return; // blocked
            } else {
              hasVisitedRef.current = false;
            }
          }
        }
      } catch (err) {
        /* ignore parsing errors */
      }
      return safeApply(origPush, args);
    };

    window.history.replaceState = function (...args) {
      try {
        if (hasVisitedRef.current && currentPathRef.current === pagePath) {
          const url = args[2];
          const dest = url ? new URL(url, window.location.href).pathname : null;
          if (dest && dest !== currentPathRef.current) {
            if (!askConfirm(message)) {
              return; // blocked
            } else {
              hasVisitedRef.current = false;
            }
          }
        }
      } catch (err) {}
      return safeApply(origReplace, args);
    };

    return () => {
      // restore
      window.history.pushState = origPush;
      window.history.replaceState = origReplace;
    };
  }, [message, pagePath]);

  // 4) handle browser Back/Forward (popstate)
  useEffect(() => {
    const onPop = (event) => {
      if (!hasVisitedRef.current) return;
      if (isConfirmingRef.current) return;

      const prev = prevPathRef.current; // path before the change
      const curr = window.location.pathname; // after pop
      // If we left the protected page (prev was pagePath and curr is different), confirm:
      if (prev === pagePath && curr !== pagePath) {
        isConfirmingRef.current = true;
        const ok = askConfirm(message);
        if (!ok) {
          // revert navigation: push back deposit path
          try {
            window.history.pushState(null, "", prev);
            // update app route too
            navigate(prev, { replace: true });
          } catch (err) {
            // fallback: reload to prev path (rare)
            window.location.href = prev;
          }
        } else {
          hasVisitedRef.current = false;
        }
        setTimeout(() => (isConfirmingRef.current = false), 0);
      }
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [message, pagePath, navigate]);
}
