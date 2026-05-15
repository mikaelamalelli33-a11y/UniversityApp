# 24 — Remove Console Logs from React

> **Backlog ref:** nouncheck — cleanup debug output in frontend
> **Priority:** P3 — nice-to-have, no dependencies
> **Effort:** ~1h
> **Stack:** React 18, no new dependencies
> **Branch:** `<yourname>/remove-console-logs-fe` (example: `ornela/remove-console-logs-fe`)
> **Before you start:** This is a cleanup task. No code dependencies — can start immediately.

---

## Goal

Remove all debug output statements from the React codebase:

- Remove all `console.log()` statements
- Remove all `console.error()` used for debugging (keep legitimate error logging)
- Remove all `console.warn()` debug statements
- Remove all `debugger` statements
- Remove all `alert()` used for debugging

When this task is done, the frontend codebase is production-ready with no leaking debug output.

**Note:** Keep legitimate error handling and logging (e.g., `console.error()` that logs actual errors, or logging libraries used for analytics).

---

## Workflow

1. `git checkout main && git pull`
2. `git checkout -b <yourname>/remove-console-logs-fe`
3. Search for debug statements in `src/`
4. Remove each one
5. Commit with a clear message
6. `npm run build` to verify no build errors
7. Test in browser briefly to ensure nothing broke
8. Open PR against `main`

---

## Step 1 — Search for debug statements

Use grep to find all debug output in the React codebase:

```bash
# Find all console.log() statements
grep -r "console\.log" src/ --include="*.jsx" --include="*.js" --include="*.tsx" --include="*.ts"

# Find all console.error() statements (examine for debugging vs legitimate)
grep -r "console\.error" src/ --include="*.jsx" --include="*.js" --include="*.tsx" --include="*.ts"

# Find all console.warn() statements
grep -r "console\.warn" src/ --include="*.jsx" --include="*.js" --include="*.tsx" --include="*.ts"

# Find all debugger statements
grep -r "debugger" src/ --include="*.jsx" --include="*.js" --include="*.tsx" --include="*.ts"

# Find all alert() statements (likely for debugging)
grep -r "alert(" src/ --include="*.jsx" --include="*.js" --include="*.tsx" --include="*.ts"
```

Record the file paths and line numbers for each occurrence.

---

## Step 2 — Remove each debug statement

For each debug statement found:

1. Open the file
2. Examine the context — is it truly debug output, or is it legitimate error logging?
3. If it's debug output:
   - **If it's the only statement on a line:** Delete the entire line
   - **If it's part of a line:** Remove just the statement
   - **If it's in a try/catch:** Consider whether the catch block is still needed after removal
4. Save the file

**Example:**

Before:
```jsx
const handleSubmit = async (data) => {
  try {
    const response = await api.post('/data', data);
    console.log('Response:', response); // ← remove this
    setData(response.data);
  } catch (error) {
    console.error('Failed:', error); // ← might be legitimate logging
    message.error('Gabim');
  }
};
```

After:
```jsx
const handleSubmit = async (data) => {
  try {
    const response = await api.post('/data', data);
    setData(response.data);
  } catch (error) {
    message.error('Gabim');
  }
};
```

---

## Step 3 — Distinguish between debug and legitimate logging

**Remove these** (debug output):
```jsx
console.log('Testing:', variable);
console.error('Debug:', error);
console.warn('This should not happen');
debugger;
alert('Debug: variable = ' + variable);
```

**Keep these** (legitimate error handling/logging):
```jsx
// If you have a logging service:
logger.info('User logged in');
logger.error('API call failed', error);

// Sentry or similar error tracking:
Sentry.captureException(error);

// Analytics:
analytics.track('page_viewed');
```

---

## Step 4 — Commit

After removing all debug statements:

```bash
git add -A
git commit -m "Remove debug console statements from React"
```

---

## Manual smoke test

After removing debug statements, build and test briefly:

```bash
npm run build
```

No build errors should occur. If any component breaks:
1. Check browser console for errors
2. Identify which statement's removal caused the issue
3. Restore if necessary (it may have been serving a purpose)

---

## Acceptance criteria

- [ ] All `console.log()` statements removed from `src/`
- [ ] All debug `console.error()` statements removed
- [ ] All `console.warn()` debug statements removed
- [ ] All `debugger` statements removed
- [ ] All `alert()` debugging statements removed
- [ ] Legitimate error logging (if any) is preserved
- [ ] `npm run build` succeeds with no errors
- [ ] App loads and works in browser (smoke test)
- [ ] No regression in functionality

---

## Optional: ESLint rule to prevent future console statements

Add to `.eslintrc.js` or `.eslintrc.json` to catch future debug statements:

```javascript
{
  "rules": {
    "no-console": [
      "warn",
      { "allow": ["warn", "error"] } // Allow console.warn() and console.error() only
    ]
  }
}
```

This will warn developers if they accidentally commit `console.log()` or `console.info()`. Adjust the `allow` array as needed for your project's logging strategy.
