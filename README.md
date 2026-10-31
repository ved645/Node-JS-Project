# Node.js Server-Side Validation Demo

An ultra-clean, minimal web application demonstrating robust server-side request validation, sanitization, and security using **Node.js** and **`express-validator`**. Built with a **Minimalist Brutalism / Neo-Paper** visual aesthetic, micro-interactions, subtle CSS animations, and interactive SVG doodles.

---

## 🎨 Visual & UI Design

- **Theme**: Minimalist Brutalism / Neo-Paper style
  - Crisp paper background (`#FAFAFA`) with subtle dot-grid blueprint pattern
  - Sharp borders (`1.5px solid #1E1E1E`), tactile neo-brutalist drop shadows (`4px 4px 0px #1E1E1E`)
  - Electric Blue (`#2563EB`) & Emerald Green (`#059669`) primary accents
  - Soft Coral Red (`#DC2626`) for error indicators
- **Typography**:
  - **Plus Jakarta Sans**: Clean, high-legibility sans-serif for UI labels, inputs, and layout
  - **Caveat**: Organic hand-drawn font for annotations, badge callouts, and doodle captions
  - **JetBrains Mono**: Precise monospace typography for JSON payload inspection and code previews

---

## ✏️ Interactive SVG Doodles & Micro-Interactions

1. **Header Annotation**:
   - Hand-drawn curved arrow with animated CSS stroke drawing (`stroke-dasharray` / `stroke-dashoffset`)
   - Badge stamp: *"100% Backend Enforced"* with written overlay: *"No bypassed forms here!"*
2. **Form Field Doodles**:
   - **Username**: Hand-drawn user avatar doodle that wiggles on input focus (`@keyframes doodleWiggle`).
   - **Email**: Hand-drawn envelope doodle that bounces gently (`@keyframes doodleBounce`) when a valid email format is recognized.
   - **Password**: Hand-drawn padlock doodle with dynamic shackle that snaps shut (`@keyframes lockSnap`) with a green glow when all password requirements are met, and unlocks when invalid.
3. **Success State Doodle**:
   - Celebratory sparkle/star SVG explosion with staggered pop-in animation on successful registration.
4. **Error State Doodle**:
   - Hand-drawn scribble/exclamation mark that shakes (`@keyframes errorScribbleShake`) beside invalid fields upon validation failure.
5. **CSS Animations**:
   - `@keyframes fieldShake` applied to invalid input containers on submission failure.
   - Smooth slide-down & fade-in transitions for field error messages.

---

## 🛡️ Server-Side Validation & Security Architecture

Built according to realistic `express-validator` security rules:

| Field | Validation & Sanitization Rules | Security Purpose |
|---|---|---|
| `username` | `.trim()`, `.notEmpty()`, `.isLength({ min: 3, max: 20 })`, `.matches(/^[a-zA-Z0-9_]+$/)`, `.escape()` | Prevents empty names, length overflow, illegal characters, and disarms Cross-Site Scripting (XSS) attacks by converting `<script>` tags to `&lt;script&gt;`. |
| `email` | `.trim()`, `.notEmpty()`, `.isEmail()`, `.normalizeEmail()` | Enforces valid RFC email structure, lowercases domains, and strips Gmail aliases/dots to prevent duplicate account abuse. |
| `password` | `.notEmpty()`, `.isLength({ min: 8 })`, `.matches(/[A-Z]/)`, `.matches(/[0-9]/)` | Enforces password complexity (length, uppercase character, and numerical digit) before passing to the Argon2/bcrypt hash pipeline. |

---

## ⚡ Key Features & Layout

### 1. Dual-Panel Inspector
- **Left Panel (Interactive Form)**:
  - Username, Email, and Password inputs with real-time feedback
  - Password strength meter and dynamic 3-point checklist
  - Debounced real-time validation toggle switch (300ms)
  - Interactive Submit button with loading state
- **Right Panel (Live Inspector & Server Payload Monitor)**:
  - **Tab 1: Request Payload**: Real-time formatted JSON sent to `/api/register` with latency metrics.
  - **Tab 2: Server Response**: Status badges (`200 OK` / `400 Bad Request`), response headers, and **Sanitization Audit Diff Table** comparing raw client input vs sanitized backend values.
  - **Tab 3: Server Code Preview**: Clean syntax-highlighted snippet of the actual Express.js middleware rule chains.
  - **Tab 4: Security Audit**: Explains the 4-stage pipeline (Client -> Middleware -> Sanitization -> Schema Assertion) and why client-side validation alone can never protect an API.

### 2. Predefined Interactive Scenarios
- **"Load Valid Payload"**: Fills compliant registration data to demonstrate successful `200 OK` flow.
- **"Load Invalid Payload"**: Fills data violating multiple schema constraints to demonstrate `400 Bad Request` with field-level error arrays and shake animations.
- **"Test XSS Injection"**: Fills `<script>alert("XSS_PWNED")</script>` into the username to showcase how backend `.escape()` neutralizes the script into safe HTML entities.
- **"Clear Form"**: Resets all inputs and inspector panes.

---

## 🚀 How to Run

### Method 1: Node.js Express Server (Recommended)
```bash
# 1. Install dependencies
npm install

# 2. Start the Express server
npm start
```
Open your browser at: **`http://localhost:3000`**

### Method 2: Standalone Static File
The application is 100% self-contained in `index.html`. You can open `index.html` directly in any modern web browser. If the Node.js backend is offline or opened via `file://`, the client seamlessly activates its built-in simulated Express-Validator engine with zero interruption!

---

## 📁 File Structure
```
├── index.html        # Complete single-page application (HTML5, CSS3, SVG doodles, Vanilla JS)
├── server.js         # Node.js Express backend with express-validator middleware & static hosting
├── package.json      # Dependencies (express, express-validator, cors)
└── README.md         # Documentation and architectural guide
```
