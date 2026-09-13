# Contributing to CV Template

Thank you for your interest in contributing to **CV Template**! We are committed to building a fast, accessible, privacy-respecting, and ATS-optimized document builder.

---

## Code of Conduct

All contributors are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat everyone with respect and empathy.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- Modern web browser (Chrome, Edge, Firefox, or Safari)
- Git

### Local Setup
1. **Fork the repository** on GitHub.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/<your-username>/cv-template.git
   cd cv-template
   ```
3. **Install dev dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## Architectural Principles

Before contributing code, please review [`ARCHITECTURE.md`](ARCHITECTURE.md) to understand the core design philosophies:

1. **Zero Runtime Frameworks**: We rely entirely on modern web platform standards (ES Modules, HTML5, CSS3 Custom Properties). Do not introduce React, Vue, jQuery, or heavy UI libraries.
2. **Strict Privacy & Offline First**: Zero tracking, zero telemetry, and zero server network requests for document data. All state lives exclusively in client `localStorage`.
3. **Print-Fidelity & ATS Optimization**: All template layouts must respect strict A4 print geometry (`210mm × 297mm`) and parse cleanly into standard Applicant Tracking Systems without layout breaks.

---

## Development & Coding Standards

- **Formatting**: Use **2 spaces** for indentation across JS, HTML, and CSS.
- **Quotes**: Use single quotes (`'`) for JavaScript strings and double quotes (`"`) for HTML attributes and JSON.
- **Naming**: Use `camelCase` for functions/variables, `PascalCase` for classes/constructors, and `kebab-case` for CSS classes and filenames.
- **No Global Leakage**: Keep application state managed through [`js/store.js`](js/store.js). Do not create untracked global variables.
- **Touch & Accessibility**: Ensure interactive elements maintain a minimum 44px touch target on touchscreens and follow WCAG AA contrast ratios.

---

## Verification & Testing

Before submitting a pull request, run the following automated quality checks:

```bash
# 1. Check JavaScript syntax across all modules
npm run check

# 2. Verify Vite production build passes with zero bundle errors
npm run build

# 3. Run the automated E2E verification suite
npm test

# 4. (Optional) Run vector PDF export tests
npm run test:pdf
```

---

## Commit Guidelines

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature (e.g., `feat: add export to docx template`)
- `fix:` A bug fix (e.g., `fix: correct overflow on mobile stepper rail`)
- `docs:` Documentation only changes (e.g., `docs: update keyboard shortcuts table`)
- `style:` Formatting or cosmetic changes without code logic updates
- `refactor:` Code refactoring without behavioral alterations
- `test:` Adding or updating tests
- `chore:` Maintenance tasks, dependency updates, or build configuration

---

## Submitting a Pull Request

1. Create a descriptive feature branch from `main`:
   ```bash
   git checkout -b feat/my-new-feature
   ```
2. Commit your changes following the commit guidelines above.
3. Push to your fork and submit a pull request against the `main` branch.
4. Fill out the pull request template completely, including testing details and screenshots for visual changes.

Thank you for helping make CV Template better!
