import { ENV } from '../utils/env';
import { locators } from '../locator/locator';

class LoginPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Launch Booking.com and dismiss the sign-in modal only if it appears.
   */
  async login() {
    await this.page.goto(ENV.baseurl || 'https://www.booking.com');
    await this.page.waitForLoadState('domcontentloaded');

    // If "Dismiss sign-in info" modal is visible, close it; otherwise ignore (e.g. Firefox often doesn't show it)
    const dismissBtn = this.page.getByRole('button', { name: /Dismiss sign-in info\.?/i });
    const isModalVisible = await dismissBtn.isVisible({ timeout: 5000 }).catch(() => false);
    if (isModalVisible) {
      await dismissBtn.click();
      await dismissBtn.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }

    // Ensure main UI is ready: wait for logo OR search area (whichever appears first; site may vary)
    const logoOrSearch = this.page.locator(locators.logo)
      .or(this.page.locator(locators.searchBox))
      .or(this.page.locator(locators.destinationInput));
    await logoOrSearch.first().waitFor({ state: 'visible', timeout: 25000 });
  }
}

export default LoginPage;