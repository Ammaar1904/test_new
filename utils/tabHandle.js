
export async function waitForNewTab(contextPage, clickAction) {
  const POPUP_TIMEOUT = 15000;
  const NAV_TIMEOUT = 25000;

  const [result] = await Promise.all([
    Promise.race([
      contextPage
        .waitForEvent('popup', { timeout: POPUP_TIMEOUT })
        .then((p) => ({ type: 'popup', page: p }))
        .catch(() => null),
      contextPage.waitForURL(/\/hotel\//, { timeout: NAV_TIMEOUT }).then(() => ({ type: 'same', page: contextPage })),
    ]),
    clickAction(),
  ]);

  if (result === null) {
    await contextPage.waitForURL(/\/hotel\//, { timeout: 10000 });
    return contextPage;
  }
  if (result.type === 'popup') {
    await result.page.waitForLoadState('domcontentloaded');
  }
  return result.page;
}
