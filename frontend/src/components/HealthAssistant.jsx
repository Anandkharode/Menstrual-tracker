import { useEffect, useRef, useState } from "react";
import HealthAssistantMarkup from "./HealthAssistantMarkup";

const INLINE_EVENTS = [
  { attr: "data-onclick", type: "click" },
  { attr: "data-onmouseover", type: "mouseover" },
  { attr: "data-onmouseout", type: "mouseout" },
  { attr: "data-oninput", type: "input" },
  { attr: "data-onchange", type: "change" },
  { attr: "data-onkeydown", type: "keydown" },
  { attr: "data-onkeyup", type: "keyup" },
  { attr: "data-onfocus", type: "focus", capture: true },
  { attr: "data-onblur", type: "blur", capture: true },
  { attr: "data-onsubmit", type: "submit" },
];

function runInlineHandler(el, code, event) {
  try {
    // Mimic inline handler: `this` refers to the element and `event` is provided.
    // eslint-disable-next-line no-new-func
    const fn = new Function("event", code);
    const result = fn.call(el, event);
    if (result === false) {
      event.preventDefault();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Inline handler failed:", err);
  }
}

export default function HealthAssistant() {
  const rootRef = useRef(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const injectedScriptsRef = useRef([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/health_assistant.html")
      .then((res) => res.text())
      .then((text) => {
        if (cancelled) return;
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const scripts = Array.from(doc.querySelectorAll("script"))
          .filter((scriptEl) => !scriptEl.src)
          .map((scriptEl) => scriptEl.textContent || "")
          .filter(Boolean);

        scripts.forEach((code, idx) => {
          try {
            const scriptEl = document.createElement("script");
            scriptEl.type = "text/javascript";
            scriptEl.dataset.haInline = "true";
            scriptEl.textContent = code;
            document.body.appendChild(scriptEl);
            injectedScriptsRef.current.push(scriptEl);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Health Assistant script ${idx + 1} failed`, err);
          }
        });

        setScriptsLoaded(true);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("Failed to load health_assistant.html scripts", err);
      });

    return () => {
      cancelled = true;
      injectedScriptsRef.current.forEach((el) => el.remove());
      injectedScriptsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const listeners = INLINE_EVENTS.map(({ attr, type, capture }) => {
      const handler = (event) => {
        let el = event.target;
        while (el && el !== root.parentElement) {
          if (el.getAttribute && el.hasAttribute(attr)) {
            const code = el.getAttribute(attr);
            if (code) runInlineHandler(el, code, event);
            break;
          }
          el = el.parentElement;
        }
      };

      root.addEventListener(type, handler, !!capture);
      return { type, handler, capture: !!capture };
    });

    return () => {
      listeners.forEach(({ type, handler, capture }) => {
        root.removeEventListener(type, handler, capture);
      });
    };
  }, [scriptsLoaded]);

  useEffect(() => {
    if (scriptsLoaded && window.showScreen) {
      window.showScreen("screen-landing");
    }
  }, [scriptsLoaded]);

  return (
    <div ref={rootRef}>
      <HealthAssistantMarkup />
    </div>
  );
}
