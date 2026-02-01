export async function handleChromiumPopup(page, browserName) {
    if (browserName !== 'chromium') return;
  
    const dismissBtn = page.getByRole('button', {
      name: 'Dismiss sign-in info.'
    });
  
    if (await dismissBtn.isVisible({ timeout: 3000 })) {
      await dismissBtn.click();
    }
  }
  