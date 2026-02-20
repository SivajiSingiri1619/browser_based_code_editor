# Browser-Based Code Editor (VS-Code Style Keyboard Engine)

A containerized web code editor that mimics real developer tools like VS Code, Google Docs, and Notion by handling complex keyboard shortcuts, text input, undo/redo history, and performance-optimized background tasks.

This project demonstrates deep understanding of **JavaScript keyboard events**, **state management**, and **Docker containerization**.

---

## 🚀 Features

### Keyboard Event System

* Real-time logging of `keydown`, `keyup`, `input`, and composition events
* Prevents default browser actions for editor shortcuts
* Cross-platform support (Windows Ctrl / Mac Cmd)

### Editor Behaviors

* Smart indentation with **Tab** and **Shift + Tab**
* Automatic indentation on **Enter**
* Toggle comments using **Ctrl + /**
* Multi-step chord shortcut **Ctrl + K → Ctrl + C**
* Save shortcut **Ctrl + S** (browser dialog disabled)

### State Management

* Undo: `Ctrl + Z`
* Redo: `Ctrl + Shift + Z`
* Persistent history stack

### Performance Optimization

* Debounced background highlighting simulation (150ms)
* Prevents heavy operations during rapid typing

### Debug Dashboard

* Live event debugging panel
* Displays event type and pressed key

---

## 🧠 Supported Shortcuts

| Shortcut           | Action                                    |
| ------------------ | ----------------------------------------- |
| Ctrl + S           | Save action (prevent browser save dialog) |
| Ctrl + Z           | Undo                                      |
| Ctrl + Shift + Z   | Redo                                      |
| Tab                | Indent line (2 spaces)                    |
| Shift + Tab        | Outdent line                              |
| Enter              | Maintain indentation                      |
| Ctrl + /           | Toggle comment                            |
| Ctrl + K, Ctrl + C | Chord success action                      |

---

## 🏗 Project Structure

```
browser_based_code_editor/
│
├── src/
│   ├── components/Editor.jsx
│   ├── hooks/useEditorHistory.js
│   └── utils/debounce.js
│
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json
└── README.md
```

---

## 🐳 Running with Docker (Required)

Make sure **Docker Desktop is installed and running**.

### 1. Clone the repository

```
git clone <your-repo-link>
cd browser_based_code_editor
```

### 2. Build and start container

```
docker-compose up --build
```

### 3. Open in browser

```
http://localhost:3000
```

The editor will start inside a containerized environment.

---

## 🔍 Verification Functions

Open browser console (F12) and run:

### Editor State

```
getEditorState()
```

Returns:

```
{ content: string, historySize: number }
```

### Highlight Call Counter

```
getHighlightCallCount()
```

Used to verify debounce behavior.

---

## ⚙️ Environment Variables

File: `.env.example`

```
APP_PORT=3000
```

---

## 🧪 Health Check

The container includes a health check that verifies the editor server is reachable before marking the container healthy.

---

## 🧩 Technical Concepts Demonstrated

* JavaScript event model
* keydown vs input event handling
* IME composition awareness
* Debouncing for performance
* Undo/Redo history stack
* Caret position management
* Docker container networking
* Cross-platform keyboard modifiers

---

## 📌 Notes

The deprecated `keypress` event is not used.
All input is handled using modern browser standards (`keydown` and `input` events).

--
