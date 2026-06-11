import { useEffect, useState } from "react";

const UNLOCK_CODE = "idkfa";
const STORAGE_KEY = "inspector-unlocked";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

export function useInspectorUnlock() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === "true",
  );

  useEffect(() => {
    let buffer = "";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) {
        return;
      }

      buffer = (buffer + event.key.toLowerCase()).slice(-UNLOCK_CODE.length);

      if (buffer === UNLOCK_CODE) {
        buffer = "";
        setUnlocked((current) => {
          const next = !current;

          if (next) {
            sessionStorage.setItem(STORAGE_KEY, "true");
          } else {
            sessionStorage.removeItem(STORAGE_KEY);
          }

          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return unlocked;
}
