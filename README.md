# React Calculator

A responsive calculator built with React 18, Vite 6, and Tailwind CSS 4.

**Live demo:** [calculator-lab1-nfqq.vercel.app](https://calculator-lab1-nfqq.vercel.app)

## Features

- Four operations: addition, subtraction, multiplication, division
- Divide-by-zero guard with a clear error message
- `AC` clear, `±` sign toggle, and `%` percent
- `Backspace` to remove the last digit
- Full keyboard support
- Live expression readout (for example `12 + 5 =`)
- Floating-point results trimmed to 12 significant digits
- Responsive two-column layout, usable down to mobile widths
- Accessible labels and live-region announcements

## Getting started

```bash
npm install       # install dependencies
npm run dev       # start the dev server on http://localhost:5173
npm run build     # produce a production build in dist/
npm run preview   # preview the production build locally
```

## Keyboard shortcuts

| Key            | Action           |
| -------------- | ---------------- |
| `0`–`9`        | Enter a digit    |
| `.`            | Decimal point    |
| `+` `-` `*` `/` | Operators       |
| `Enter` or `=` | Calculate result |
| `Backspace`    | Delete last digit |
| `Esc` or `C`   | Clear all        |

## Tech stack

| Tool            | Version |
| --------------- | ------- |
| React           | 18.x    |
| React DOM       | 18.x    |
| Vite            | 6.x     |
| Tailwind CSS    | 4.x     |
| @vitejs/plugin-react | 4.x |

## Project structure

```
├── index.html            # HTML entry point
├── vite.config.js        # Vite + Tailwind + React plugin config
└── src/
    ├── main.jsx          # React root mount
    ├── App.jsx           # Page shell and layout
    ├── index.css         # Tailwind entry stylesheet
    └── components/
        ├── Calculator.jsx  # State machine and logic
        ├── Display.jsx     # Result and expression readout
        ├── Button.jsx      # Reusable keypad button
        └── UserGuide.jsx   # On-page instructions
```

## Deployment

Push to GitHub, then import the repository on Vercel or Netlify:

- **Build command:** `npm run build`
- **Output directory:** `dist`

Vercel detects the Vite framework automatically, so no extra configuration is required.

---

DCIT 26 – Laboratory 1
