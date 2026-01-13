Fix the runtime crash:

Error:
Uncaught TypeError: Cannot read properties of undefined (reading 'title')

This is a React + TypeScript + Vite project using TEXTS/i18n objects and multiple UI sections/cards.
The crash happens in the built bundle, so we must locate the SOURCE file causing `.title` access on undefined.

TASK:
1) Search the entire repo for any usage of `.title` inside render logic:
   - `something.title`
   - destructuring like `{ title } = something`
   - maps like `items.map(x => x.title)`
2) Identify all cases where the parent object can be undefined:
   - `TEXTS[language].something.title`
   - `t.something.title`
   - `sections[i].title`
   - `cards[i].title`
3) For every such case, implement safe guards:
   - Provide default objects if missing
   - Use optional chaining `?.title`
   - Provide fallback strings if the translation key is missing
   - Ensure arrays are filtered to remove undefined items before rendering

IMPORTANT:
- Do NOT change existing UI design or layout.
- Fix must be minimal and surgical.
- Root cause is likely missing translation keys between Arabic and English.

DELIVERABLES:
A) The exact source file(s) causing the crash and the line(s).
B) Add any missing i18n keys in BOTH languages to keep parity.
C) Add a small helper utility `getText(language)` or `safeT(t)` if needed.
D) Ensure the app renders in BOTH Arabic and English without crashing.

EXTRA CHECKS:
- Verify `TEXTS[language]` is always defined; if not, fallback to 'ar' or 'en'.
- Any new sections must exist in both translation files with the same structure.
- If using `section.title`, ensure section exists before render:
  `if (!section) return null;`

After patching, run the app and confirm no error "reading 'title'".
