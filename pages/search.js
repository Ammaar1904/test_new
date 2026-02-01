import { locators } from '../locator/locator';  

class SearchPage {
  constructor(page) {
    this.page = page;
  }

  formatDate(date) {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  /**
   * Enter destination and select suggestion 
   */
  async enterDestination(destination) {
    await this.page.locator(locators.destinationInput).fill(destination);
    const suggestion = this.page.getByRole('button', { name: destination.replace(/,/g, '').trim(), exact: true });
    if (await suggestion.isVisible({ timeout: 5000 }).catch(() => false)) {
      await suggestion.click();
    }
  }

  /**
   * Dismiss sign-in modal if it is visible
   */
  async dismissSignInModalIfVisible() {
    const dismissBtn = this.page.getByRole('button', { name: /Dismiss sign-in info\.?/i });
    if (await dismissBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await dismissBtn.click({ force: true });
      await dismissBtn.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
  }

  async selectDates(checkInOffset, checkOutOffset) {
    await this.dismissSignInModalIfVisible();
    await this.page.locator(locators.datesContainer).click({ force: true });

    const today = new Date();

    const checkInDate = new Date(today);
    checkInDate.setDate(today.getDate() + checkInOffset);

    const checkOutDate = new Date(today);
    checkOutDate.setDate(today.getDate() + checkOutOffset);

    const checkIn = this.formatDate(checkInDate);
    const checkOut = this.formatDate(checkOutDate);

    await this.page.locator(locators.dateCell(checkIn)).click();
    await this.page.locator(locators.dateCell(checkOut)).click();
  }

  async clickSearch() {
    await this.dismissSignInModalIfVisible();
    const searchBtn = this.page.locator(locators.searchButton);
    await Promise.all([
      this.page.waitForURL(/searchresults/, { timeout: 20000, waitUntil: 'domcontentloaded' }),
      searchBtn.click(),
    ]);
  }

  /**
   * Navigate directly to search results URL. Use when form submit is blocked (e.g. challenge/redirect).
   * Same destination/dates as enterDestination + selectDates + clickSearch but avoids the Search button.
   */
  async goToSearchResults(destination, checkInOffset, checkOutOffset) {
    const today = new Date();
    const checkInDate = new Date(today);
    checkInDate.setDate(today.getDate() + checkInOffset);
    const checkOutDate = new Date(today);
    checkOutDate.setDate(today.getDate() + checkOutOffset);
    const checkIn = this.formatDate(checkInDate);
    const checkOut = this.formatDate(checkOutDate);

    const params = new URLSearchParams({
      ss: destination,
      checkin: checkIn,
      checkout: checkOut,
      group_adults: '2',
      no_rooms: '1',
      group_children: '0',
      lang: 'en-gb',
    });
    const url = `https://www.booking.com/searchresults.en-gb.html?${params.toString()}`;
    const gotoTimeout = process.env.CI ? 60000 : 45000;
    await this.page.goto(url, { waitUntil: 'commit', timeout: gotoTimeout });
  }
}

export default SearchPage;
