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

    // Ensure main UI is ready: logo and search area (so overlay is gone)
    await this.page.getByTestId('header-booking-logo').waitFor({ state: 'visible', timeout: 15000 });
    // Wait for search form to be visible (search box or destination input)
    await this.page.locator(locators.searchBox).or(this.page.locator(locators.destinationInput))
      .first().waitFor({ state: 'visible', timeout: 10000 });
  }
}

export default LoginPage;