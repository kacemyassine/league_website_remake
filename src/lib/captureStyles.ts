/**
 * Captures all styles from the current document at archive time.
 * Used to freeze the visual appearance of archived league views (Home, Stats).
 * Collects from inline <style> and same-origin <link rel="stylesheet">.
 */
export function captureDocumentStyles(): string {
  const sheets = Array.from(document.styleSheets);
  let css = '';

  for (const sheet of sheets) {
    try {
      const rules = sheet.cssRules || sheet.rules;
      if (!rules) continue;
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (rule instanceof CSSStyleRule || rule instanceof CSSMediaRule) {
          css += rule.cssText;
        } else if (rule instanceof CSSImportRule) {
          // Skip @import - often cross-origin, would need fetch
        } else {
          css += rule.cssText;
        }
      }
    } catch {
      // Cross-origin stylesheet - cannot access cssRules, skip
    }
  }

  // Also collect inline style tags (e.g. from styled components, emotion, etc.)
  document.querySelectorAll('style').forEach((el) => {
    if (el.textContent) css += el.textContent;
  });

  return css;
}
