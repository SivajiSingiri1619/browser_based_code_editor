import { useEffect, useRef } from "react";
import useEditorHistory from "../hooks/useEditorHistory";

function Editor() {
  const editorRef = useRef(null);
const { content, updateContent, undo, redo, historySize } = useEditorHistory("");

  useEffect(() => {
    const editor = editorRef.current;

    // function to add logs into dashboard
    function addLog(type, e) {
      const logContainer = document.querySelector(
        '[data-test-id="event-log-list"]'
      );

      if (!logContainer) return;

      const entry = document.createElement("div");
      entry.setAttribute("data-test-id", "event-log-entry");

      entry.textContent = `${type} : ${e.key}`;

      logContainer.appendChild(entry);

      // auto scroll
      logContainer.scrollTop = logContainer.scrollHeight;
    }

    // Event listeners
    const keydownHandler = (e) => {
  addLog("keydown", e);

  const isMac = navigator.platform.toUpperCase().includes("MAC");
  const modifier = isMac ? e.metaKey : e.ctrlKey;

  // SAVE (Ctrl+S / Cmd+S)
  if (modifier && e.key.toLowerCase() === "s") {
    e.preventDefault();   // 🔥 MOST IMPORTANT LINE

    const logContainer = document.querySelector(
      '[data-test-id="event-log-list"]'
    );

    const entry = document.createElement("div");
    entry.setAttribute("data-test-id", "event-log-entry");
    entry.textContent = "Action: Save";

    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;

    return;
  }

  // UNDO
  if (modifier && e.key.toLowerCase() === "z" && !e.shiftKey) {
    e.preventDefault();
    undo();
    return;
  }

  // REDO
  if (modifier && e.key.toLowerCase() === "z" && e.shiftKey) {
    e.preventDefault();
    redo();
    return;
  }
};
    const keyupHandler = (e) => addLog("keyup", e);
    const inputHandler = (e) => addLog("input", e);
    const compStart = (e) => addLog("compositionstart", e);
    const compEnd = (e) => addLog("compositionend", e);

    editor.addEventListener("keydown", keydownHandler);
    editor.addEventListener("keyup", keyupHandler);
    editor.addEventListener("input", inputHandler);
    editor.addEventListener("compositionstart", compStart);
    editor.addEventListener("compositionend", compEnd);

    // cleanup (VERY IMPORTANT in React)
    return () => {
      editor.removeEventListener("keydown", keydownHandler);
      editor.removeEventListener("keyup", keyupHandler);
      editor.removeEventListener("input", inputHandler);
      editor.removeEventListener("compositionstart", compStart);
      editor.removeEventListener("compositionend", compEnd);
    };
  }, []);

  return (
    <div
      data-test-id="editor-container"
      style={{
        width: "70%",
        borderRight: "2px solid gray",
        padding: "10px"
      }}
    >
      <textarea
  ref={editorRef}
  value={content}
  onChange={(e) => updateContent(e.target.value)}
  data-test-id="editor-input"
  style={{
    width: "100%",
    height: "100%",
    fontFamily: "monospace",
    fontSize: "16px",
    outline: "none",
    resize: "none"
  }}
/>

    </div>
  );
}

export default Editor;
