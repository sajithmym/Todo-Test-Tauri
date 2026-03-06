# Todo App — Tauri Desktop Application

## Overview

A production-ready desktop Todo application built with **Tauri v2**, **React 19**, **TypeScript**, and **Tailwind CSS**. Runs natively on Windows, macOS, and Linux. Todos are persisted locally to a JSON file in the OS app data directory — no server required.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript (strict) |
| Styling | Tailwind CSS v3 + PostCSS |
| Build Tool | Vite 6 |
| Desktop Shell | Tauri v2 |
| Backend Language | Rust 1.94 (stable) |
| Persistence | JSON file via `tauri-plugin-fs` |

---

## Features

- **Full CRUD**: Add, edit (double-click), delete, and toggle todos
- **Priority levels**: High / Medium / Low with color-coded indicators
- **Categories**: Personal, Work, Shopping, Health, Learning, Other
- **Filters**: All / Active / Done tabs with live search
- **Progress bar**: Visual completion percentage
- **Clear completed**: Bulk remove finished items
- **Dark / Light mode**: Toggle with OS default detection
- **Local persistence**: Auto-saved to `%APPDATA%\com.todoapp.dev\todos.json`
- **Smart sorting**: Incomplete items first, then by priority, then by creation date

---

## Project Structure

```
Todo Test-Tauri/
├── src/                        # React frontend
│   ├── App.tsx                 # Root component, state management
│   ├── api.ts                  # Tauri invoke() bridge
│   ├── types.ts                # Shared TypeScript types
│   └── components/
│       ├── Header.tsx          # Title + dark mode toggle
│       ├── TodoInput.tsx       # Add new todo form
│       ├── TodoList.tsx        # Renders list of TodoItem
│       ├── TodoItem.tsx        # Single todo card (edit, toggle, delete)
│       ├── FilterBar.tsx       # Search + All/Active/Done filters
│       ├── StatsBar.tsx        # Progress bar + counts
│       └── EmptyState.tsx      # Empty list / no-results states
├── src-tauri/
│   ├── src/
│   │   ├── main.rs             # Entry point — calls lib::run()
│   │   └── lib.rs              # All Tauri commands + app bootstrap
│   ├── capabilities/
│   │   └── default.json        # Tauri v2 permission declarations
│   ├── icons/                  # Generated app icons (all platforms)
│   ├── Cargo.toml              # Rust dependencies
│   ├── build.rs                # Tauri build script
│   └── tauri.conf.json         # Tauri app configuration
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | ≥ 18 | v24.8.0 was used |
| npm | ≥ 9 | v11.6.0 was used |
| Rust | ≥ 1.70 | 1.94.0 stable via rustup |
| WebView2 | Any | Pre-installed on Windows 10/11 |

### Install Rust (if not present)
```powershell
# Download and run rustup (non-interactive)
Invoke-WebRequest -Uri "https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe" -OutFile "$env:TEMP\rustup-init.exe"
& "$env:TEMP\rustup-init.exe" -y --default-toolchain stable
# Re-open terminal to pick up PATH, then verify:
rustc --version
cargo --version
```

---

## Getting Started

```powershell
# Clone / navigate to project
cd "d:\My Projects\Todo Test-Tauri"

# Install Node dependencies
npm install

# Run in development (opens native window + hot reload)
npm run tauri dev
```

> **First run**: Rust compiles ~393 crates — expect 5–10 minutes. Subsequent runs use the cache and take ~5 seconds.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Vite frontend only (browser) |
| `npm run tauri dev` | Full Tauri app (native window) |
| `npm run tauri build` | Production bundle (installer) |
| `npm run build` | TypeScript + Vite build only |

---

## Rust Commands (Backend API)

All commands are registered in `src-tauri/src/lib.rs` and invoked from the frontend via `src/api.ts`:

| Command | Input | Returns |
|---|---|---|
| `get_todos` | — | `Todo[]` |
| `create_todo` | `CreateTodoInput` | `Todo` |
| `update_todo` | `UpdateTodoInput` | `Todo` |
| `delete_todo` | `id: String` | `void` |
| `toggle_todo` | `id: String` | `Todo` |
| `clear_completed` | — | `Todo[]` |
| `reorder_todos` | `ids: String[]` | `Todo[]` |

---

## Data Storage

Todos are persisted at:

```
Windows:  %APPDATA%\com.todoapp.dev\todos.json
macOS:    ~/Library/Application Support/com.todoapp.dev/todos.json
Linux:    ~/.config/com.todoapp.dev/todos.json
```

---

## Key Design Decisions & Trade-offs

| Decision | Rationale | Trade-off |
|---|---|---|
| JSON file persistence (not SQLite) | Zero extra dependencies, simple | Not suitable for thousands of todos |
| Non-pub command functions in lib.rs | Required in Tauri v2 — `pub fn` with `#[tauri::command]` triggers `#[macro_export]` causing duplicate macro names at crate root | Functions are crate-internal only |
| State re-loaded from disk on each command | Prevents stale state if file is modified externally | Slight extra I/O; acceptable for local todo app |
| Tailwind v3 (not v4) | Stable PostCSS plugin ecosystem at project creation date | Not the latest; upgrade when needed |

---

## Known Risks & Next Steps

- **No undo/redo**: Deletions are immediate and irreversible
- **No conflict handling**: If the JSON file is corrupted, all todos are reset to empty
- **Single window**: Multi-window support not implemented
- **No sync**: Local-only; no cloud backup

### Recommended Next Steps

1. Add toast notifications for CRUD feedback
2. Implement due dates and reminders
3. Add drag-and-drop reordering via the `reorder_todos` command (already wired in backend)
4. Consider SQLite via `tauri-plugin-sql` if list size grows
5. Add keyboard shortcuts (Ctrl+N for new, Del for delete)

---

## Verification Steps

After running `npm run tauri dev`:

1. Desktop window opens titled **"Todo App"**
2. Type a task and press Enter (or the + button) → todo appears in list
3. Double-click todo text → edit in place, Enter to save
4. Click checkbox → toggles complete with strikethrough
5. Hover todo → edit/delete buttons appear
6. Close and reopen app → todos persist
7. Click moon/sun icon → dark/light mode switches
