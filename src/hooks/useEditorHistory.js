import { useState } from "react";

export default function useEditorHistory(initialValue = "") {

  const [content, setContent] = useState(initialValue);
  const [undoStack, setUndoStack] = useState([initialValue]);
  const [redoStack, setRedoStack] = useState([]);

  // when user types
  const updateContent = (newValue) => {
    setUndoStack(prev => [...prev, newValue]);
    setRedoStack([]); // clear redo on new typing
    setContent(newValue);
  };

  // CTRL + Z
  const undo = () => {
    setUndoStack(prev => {
      if (prev.length <= 1) return prev;

      const newUndo = [...prev];
      const last = newUndo.pop();

      setRedoStack(r => [last, ...r]);

      const previous = newUndo[newUndo.length - 1];
      setContent(previous);

      return newUndo;
    });
  };

  // CTRL + SHIFT + Z
  const redo = () => {
    setRedoStack(prev => {
      if (prev.length === 0) return prev;

      const [next, ...rest] = prev;

      setUndoStack(u => [...u, next]);
      setContent(next);

      return rest;
    });
  };

  return {
    content,
    updateContent,
    undo,
    redo,
    historySize: undoStack.length
  };
}
