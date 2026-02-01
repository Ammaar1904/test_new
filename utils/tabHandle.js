
export async function waitForNewTab(contextPage, clickAction) {
  const [popup] = await Promise.all([
    contextPage.waitForEvent('popup', { timeout: 15000 }),
    clickAction(),
  ]);
  await popup.waitForLoadState('domcontentloaded');
  return popup;
}
