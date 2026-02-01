/**
 * After click, either a new tab opens or the same tab navigates to /hotel/.
 * Uses context 'page' event (reliable when target=_blank) and fallback poll of context.pages().
 */
export async function waitForNewTab(contextPage, clickAction) {
  const ctx = contextPage.context();
  const NEW_PAGE_TIMEOUT = 30000;
  const SAME_TAB_NAV_TIMEOUT = 45000;

  const [result] = await Promise.all([
    Promise.race([
      ctx
        .waitForEvent('page', { timeout: NEW_PAGE_TIMEOUT })
        .then((p) => ({ type: 'newpage', page: p }))
        .catch(() => null),
      contextPage.waitForURL(/\/hotel\//, { timeout: SAME_TAB_NAV_TIMEOUT }).then(() => ({ type: 'same', page: contextPage })),
    ]),
    clickAction(),
  ]);

  if (result?.type === 'same') {
    return contextPage;
  }

  const hotelPage = result?.type === 'newpage' ? result.page : null;
  let pageToUse = hotelPage;

  if (!pageToUse) {
    const pollMs = 300;
    const pollFor = 15000;
    const deadline = Date.now() + pollFor;
    while (Date.now() < deadline) {
      const other = ctx.pages().find((p) => p !== contextPage);
      if (other) {
        pageToUse = other;
        break;
      }
      await new Promise((r) => setTimeout(r, pollMs));
    }
  }

  if (pageToUse) {
    try {
      await pageToUse.waitForURL(/\/hotel\//, { timeout: 35000, waitUntil: 'commit' });
      await pageToUse.waitForLoadState('domcontentloaded').catch(() => {});
      return pageToUse;
    } catch (e) {
      if (pageToUse !== contextPage) {
        throw new Error(
          `Hotel detail tab opened but URL did not match /hotel/ within 35s. Current URL: ${pageToUse.url()}. ${e.message}`
        );
      }
    }
  }

  try {
    await contextPage.waitForURL(/\/hotel\//, { timeout: 15000, waitUntil: 'commit' });
    return contextPage;
  } catch (e) {
    throw new Error(
      `No hotel detail page detected: no new tab with /hotel/ and current page did not navigate. Current URL: ${contextPage.url()}. ${e.message}`
    );
  }
}
