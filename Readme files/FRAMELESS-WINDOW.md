# Frameless Transparent Window in Tauri 2

How to fully remove the OS window border, build a custom header, and add rounded corners — as implemented in this project.

---

## 1. Remove the OS Window Frame

All OS-level window chrome (title bar, border, shadow) is controlled in `src-tauri/tauri.conf.json`.

```json
"app": {
  "windows": [
    {
      "title": "Todo App",
      "width": 900,
      "height": 700,
      "resizable": true,
      "decorations": false,
      "transparent": true,
      "shadow": false
    }
  ]
}
```

| Property | Value | Effect |
|---|---|---|
| `decorations` | `false` | Removes the native OS title bar and window border |
| `transparent` | `true` | Makes the OS window surface transparent (shows desktop behind it) |
| `shadow` | `false` | Removes the Windows DWM drop shadow / glow frame |

> **Windows note:** Without `shadow: false`, Windows still draws a subtle gray border/glow around the window through DWM even when `decorations` is off. Always disable both together.

---

## 2. Make the Background Transparent in CSS

The browser surface must also be transparent so the OS transparency shows through. In `src/index.css`:

```css
@layer base {
  html, body, #root {
    background: transparent !important;
    height: 100%;
  }
}
```

And in `index.html`:

```html
<body class="bg-transparent overflow-hidden">
```

---

## 3. Rounded Corners

Because the window frame is gone, rounded corners must be applied in CSS on the outermost app container. A small padding (`p-[2px]`) is added to the wrapper to let the corner pixels breathe — without it, the corners clip against the screen edge.

In `src/App.tsx`:

```tsx
// Outer wrapper — transparent, small padding so rounded corners are visible
<div className="h-screen bg-transparent p-[2px]">

  // Inner container — this is what the user actually sees
  <div className="h-full flex flex-col rounded-2xl overflow-hidden
                  bg-gray-50 dark:bg-gray-950
                  transition-colors duration-300">
    ...
  </div>

</div>
```

- `rounded-2xl` — gives `16px` border radius (Tailwind). Use `rounded-3xl` for more curve.
- `overflow-hidden` — clips all child content to the rounded shape so nothing bleeds out at the corners.
- `p-[2px]` on the outer wrapper — creates a 2px transparent gap so the rounded corners of the inner div show against the transparent window surface.

---

## 4. Remove Rounded Corners When Maximized

Rounded corners look wrong when the window is maximized — the corners don't reach the screen edges and leave gaps. The fix is to track maximize state and conditionally remove both the padding and the rounding.

### 4.1 Track maximize state in the root component

Lift the state to `App.tsx` so it can control both the wrapper padding and be passed to the Header:

```tsx
import { getCurrentWindow } from "@tauri-apps/api/window";

// inside App()
const [isMaximized, setIsMaximized] = useState(false);

useEffect(() => {
  const win = getCurrentWindow();
  win.isMaximized().then(setIsMaximized);
  let unlisten: (() => void) | undefined;
  win.onResized(() => { win.isMaximized().then(setIsMaximized); }).then(fn => { unlisten = fn; });
  return () => { unlisten?.(); };
}, []);
```

### 4.2 Conditionally apply rounding and padding

```tsx
<div className={`h-screen bg-transparent ${isMaximized ? "p-0" : "p-[2px]"}`}>
  <div className={`h-full flex flex-col overflow-hidden
                  bg-gray-50 dark:bg-gray-950
                  transition-colors duration-300
                  ${isMaximized ? "rounded-none" : "rounded-2xl"}`}>
    ...
  </div>
</div>
```

- When **windowed**: `p-[2px]` + `rounded-2xl` → visible rounded corners floating over the desktop
- When **maximized**: `p-0` + `rounded-none` → sharp edges, fills the full screen perfectly

### 4.3 Pass as a prop to Header

Since `isMaximized` is now owned by `App.tsx`, pass it down to `Header` as a prop — no duplicate state tracking needed:

```tsx
// In App.tsx
<Header darkMode={darkMode} onToggleDarkMode={...} isMaximized={isMaximized} />

// In Header.tsx — receive it instead of tracking it internally
interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isMaximized: boolean;           // ← added
}
export function Header({ darkMode, onToggleDarkMode, isMaximized }: HeaderProps) {
  // No useState / useEffect needed here for maximize tracking
  ...
}
```

---

## 5. Custom Header (Modern Drag-region Title Bar)

Without OS decorations, you need your own title bar. Key rules:

### 4.1 Mark the drag region

The `data-tauri-drag-region` attribute tells Tauri which element the user can drag to move the window:

```tsx
<div data-tauri-drag-region className="flex items-center h-12 px-4 ...">
```

Any interactive element (button) inside it must have `pointer-events-auto` (default). Any purely visual element (logo, title text) should have `pointer-events-none` so drag still works over it.

### 4.2 Wire up window controls

```tsx
import { getCurrentWindow } from "@tauri-apps/api/window";

const handleMinimize = () => getCurrentWindow().minimize();
const handleMaximize = () => getCurrentWindow().toggleMaximize();
const handleClose    = () => getCurrentWindow().close();
```

Track maximized state to swap the maximize/restore icon:

```tsx
const [isMaximized, setIsMaximized] = useState(false);

useEffect(() => {
  const win = getCurrentWindow();
  win.isMaximized().then(setIsMaximized);

  let unlisten: (() => void) | undefined;
  win.onResized(() => {
    win.isMaximized().then(setIsMaximized);
  }).then(fn => { unlisten = fn; });

  return () => { unlisten?.(); };
}, []);
```

### 4.3 Style example (as used in this project)

```tsx
<div
  data-tauri-drag-region
  className="flex items-center justify-between h-12 px-4 flex-shrink-0 select-none
             bg-white dark:bg-gray-900
             border-b border-gray-200 dark:border-gray-800"
>
  {/* Logo + App name — no pointer events so drag works over this */}
  <div className="flex items-center gap-2.5 pointer-events-none">
    <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
      {/* icon svg */}
    </div>
    <span className="text-sm font-semibold tracking-tight">Todo App</span>
  </div>

  {/* Controls */}
  <div className="flex items-center gap-1">
    {/* Dark mode toggle */}
    <button onClick={onToggleDarkMode} className="w-8 h-8 rounded-lg ...">...</button>

    <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" /> {/* divider */}

    {/* Minimize */}
    <button onClick={handleMinimize} className="w-8 h-8 rounded-lg ...">—</button>

    {/* Maximize / Restore */}
    <button onClick={handleMaximize} className="w-8 h-8 rounded-lg ...">
      {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
    </button>

    {/* Close — red on hover */}
    <button onClick={handleClose}
      className="w-8 h-8 rounded-lg hover:bg-red-500 hover:text-white ...">✕</button>
  </div>
</div>
```

**Key styling choices:**
- `select-none` — prevents text selection when clicking/dragging the title bar.
- `flex-shrink-0` — prevents the header from shrinking if content grows.
- Close button gets `hover:bg-red-500` — universal convention users recognize.
- Separator `w-px h-5` between app controls and window controls gives visual grouping.

---

## 6. Optional: Frosted Glass Effect

If you want the desktop to show through the app surface (instead of a solid background), use semi-transparent + `backdrop-blur`:

```tsx
// App container
<div className="h-full flex flex-col rounded-2xl overflow-hidden
                bg-white/60 dark:bg-black/60
                backdrop-blur-2xl">

// Header
<div className="... bg-white/40 dark:bg-black/40 border-b border-white/20">

// Content card
<div className="... bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
```

This requires `transparent: true` in `tauri.conf.json` (already set).

---

## Quick Reference Checklist

- [ ] `decorations: false` — remove OS title bar
- [ ] `transparent: true` — transparent window surface
- [ ] `shadow: false` — remove Windows DWM border glow
- [ ] `background: transparent` on `html, body, #root` in CSS
- [ ] Outer wrapper `bg-transparent p-[2px]` in React
- [ ] Inner container `rounded-2xl overflow-hidden` for rounded corners
- [ ] Track `isMaximized` in root component via `getCurrentWindow().onResized()`
- [ ] Conditionally set `p-0 rounded-none` when maximized, `p-[2px] rounded-2xl` when windowed
- [ ] Pass `isMaximized` as prop to Header — avoid duplicate state tracking
- [ ] `data-tauri-drag-region` on custom header div
- [ ] `pointer-events-none` on non-interactive header content
- [ ] `select-none` on header to prevent text-drag conflicts
- [ ] Wire `minimize`, `toggleMaximize`, `close` from `@tauri-apps/api/window`
