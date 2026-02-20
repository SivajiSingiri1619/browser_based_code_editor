import { useEffect, useRef } from "react";
import useEditorHistory from "../hooks/useEditorHistory";
import debounce from "../utils/debounce";
function Editor() {

  const editorRef = useRef(null);
  const stateRef = useRef(null);
  const chordRef = useRef(false);
  const chordTimer = useRef(null);

  const highlightCount = useRef(0);

// create highlight function FIRST
function runHighlight() {
  highlightCount.current += 1;
}

// then debounce it
const debouncedHighlight = useRef(debounce(runHighlight, 150)).current;
  // history hook
  const { content, updateContent, undo, redo, historySize } = useEditorHistory("");

  // keep latest values inside ref (VERY IMPORTANT)
  stateRef.current = { content, updateContent, undo, redo };



  useEffect(() => {

    const editor = editorRef.current;
    window.getHighlightCallCount = () => highlightCount.current;
    // ---------- EVENT LOGGER ----------
    function addLog(type, e) {
      const logContainer = document.querySelector(
        '[data-test-id="event-log-list"]'
      );

      if (!logContainer) return;

      const entry = document.createElement("div");
      entry.setAttribute("data-test-id", "event-log-entry");
      entry.textContent = `${type} : ${e.key}`;

      logContainer.appendChild(entry);
      logContainer.scrollTop = logContainer.scrollHeight;
    }

    // helper to always access latest state
    const getState = () => stateRef.current;

    // ---------- KEYDOWN HANDLER ----------
    const keydownHandler = (e) => {

      addLog("keydown", e);

      const { content, updateContent, undo, redo } = getState();

      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const modifier = isMac ? e.metaKey : e.ctrlKey;
       

      // ================= CHORD STEP 1 (Ctrl+K) =================
if (modifier && e.key.toLowerCase() === "k") {
  e.preventDefault();

  chordRef.current = true;

  // reset previous timer
  if (chordTimer.current) clearTimeout(chordTimer.current);

  // wait 2 seconds
  chordTimer.current = setTimeout(() => {
    chordRef.current = false;
  }, 2000);

  return;
}

// ================= CHORD STEP 2 (Ctrl+C) =================
if (modifier && e.key.toLowerCase() === "c") {

  if (chordRef.current) {
    e.preventDefault();

    const logContainer = document.querySelector('[data-test-id="event-log-list"]');
    const entry = document.createElement("div");
    entry.setAttribute("data-test-id", "event-log-entry");
    entry.textContent = "Action: Chord Success";

    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;

    chordRef.current = false;
    clearTimeout(chordTimer.current);
  }

  return;
}
      // ================= SAVE (Ctrl+S) =================
      if (modifier && e.key.toLowerCase() === "s") {
        e.preventDefault();

        const logContainer = document.querySelector('[data-test-id="event-log-list"]');
        const entry = document.createElement("div");
        entry.setAttribute("data-test-id", "event-log-entry");
        entry.textContent = "Action: Save";

        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight;
        return;
      }

      // ================= UNDO =================
      if (modifier && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // ================= REDO =================
      if (modifier && e.key.toLowerCase() === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
        return;
      }
     

      // ================= TOGGLE COMMENT (Ctrl + /) =================
if (modifier && e.key === "/") {
  e.preventDefault();

  const textarea = editorRef.current;
  const start = textarea.selectionStart;

  // find current line
  const lineStart = content.lastIndexOf("\n", start - 1) + 1;
  let lineEnd = content.indexOf("\n", start);
  if (lineEnd === -1) lineEnd = content.length;

  const line = content.substring(lineStart, lineEnd);

  let newValue;
  let newCursor = start;

  // uncomment
  if (line.startsWith("// ")) {
    newValue =
      content.substring(0, lineStart) +
      line.substring(3) +
      content.substring(lineEnd);

    newCursor = start - 3;
  }
  // comment
  else {
    newValue =
      content.substring(0, lineStart) +
      "// " +
      line +
      content.substring(lineEnd);

    newCursor = start + 3;
  }

  updateContent(newValue);

  setTimeout(() => {
    textarea.selectionStart = textarea.selectionEnd = newCursor;
  }, 0);

  return;
}

      // ================= SMART ENTER =================
if (e.key === "Enter") {
  e.preventDefault();

  const textarea = editorRef.current;
  const start = textarea.selectionStart;

  // find current line start
  const lineStart = content.lastIndexOf("\n", start - 1) + 1;

  // get current line text
  const currentLine = content.substring(lineStart, start);

  // count leading spaces
  let indent = "";
  for (let i = 0; i < currentLine.length; i++) {
    if (currentLine[i] === " ") indent += " ";
    else break;
  }

  // insert newline + indent
  const newValue =
    content.substring(0, start) +
    "\n" +
    indent +
    content.substring(start);

  updateContent(newValue);

  // place cursor after indentation
  setTimeout(() => {
    const newCursor = start + 1 + indent.length;
    textarea.selectionStart = textarea.selectionEnd = newCursor;
  }, 0);

  return;
}

      // ================= TAB INDENT / OUTDENT =================
      if (e.key === "Tab") {

        e.preventDefault();

        const textarea = editorRef.current;
        const start = textarea.selectionStart;

        // find start of current line
        const lineStart = content.lastIndexOf("\n", start - 1) + 1;

        // ---------- SHIFT + TAB (OUTDENT) ----------
        if (e.shiftKey) {

          if (content.substring(lineStart, lineStart + 2) === "  ") {

            const newValue =
              content.substring(0, lineStart) +
              content.substring(lineStart + 2);

            updateContent(newValue);

            // restore cursor
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = Math.max(lineStart, start - 2);
            }, 0);
          }
          return;
        }

        // ---------- NORMAL TAB (INDENT) ----------
        const newValue =
          content.substring(0, lineStart) +
          "  " +
          content.substring(lineStart);

        updateContent(newValue);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);

        return;
      }
    };

    // ---------- OTHER EVENTS ----------

    const inputHandler = (e) => {
  addLog("input", e);
  debouncedHighlight();
   };
    const keyupHandler = (e) => addLog("keyup", e);
    const compStart = (e) => addLog("compositionstart", e);
    const compEnd = (e) => addLog("compositionend", e);

    // attach listeners
    editor.addEventListener("keydown", keydownHandler);
    editor.addEventListener("keyup", keyupHandler);
    editor.addEventListener("input", inputHandler);
    editor.addEventListener("compositionstart", compStart);
    editor.addEventListener("compositionend", compEnd);

    // expose verification function (REQUIRED BY ASSIGNMENT)
    window.getEditorState = () => ({
      content: stateRef.current.content,
      historySize: historySize
    });

    // cleanup
    return () => {
      editor.removeEventListener("keydown", keydownHandler);
      editor.removeEventListener("keyup", keyupHandler);
      editor.removeEventListener("input", inputHandler);
      editor.removeEventListener("compositionstart", compStart);
      editor.removeEventListener("compositionend", compEnd);
    };

  }, [historySize]);

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