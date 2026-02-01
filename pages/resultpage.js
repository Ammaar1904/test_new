import { locators } from '../locator/locator';

class ResultsPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for search results to load (URL and first property card visible).
   */
  async waitForResultsLoaded(timeoutMs = 60000) {
    await this.page.waitForURL(/searchresults/, { timeout: timeoutMs });
    await this.page.locator(locators.hotelCard).first().waitFor({ state: 'visible', timeout: timeoutMs });
  }

  /**
   * Extract and print hotel name, price per night, rating, image URL for each listing on first page.
   * Uses locator API only (no ElementHandle) to avoid timeouts.
   */
  async fetchAllListings() {
    const cardLocators = this.page.locator(locators.hotelCard);
    await cardLocators.first().waitFor({ state: 'visible', timeout: 20000 });

    const count = await cardLocators.count();
    console.log(`\n[RESULTS] Total hotels on first page: ${count}\n`);

    for (let i = 0; i < count; i++) {
      const card = cardLocators.nth(i);
      const name = await card.locator(locators.hotelName).first().textContent({ timeout: 5000 }).then((t) => t?.trim() || null).catch(() => null);
      const price = await card.locator(locators.price).first().textContent({ timeout: 5000 }).then((t) => t?.trim() || null).catch(() => null);
      const rating = await card.locator(locators.rating).first().textContent({ timeout: 5000 }).then((t) => t?.trim() || null).catch(() => null);
      const imageUrl = await card.locator(locators.image).first().getAttribute('src', { timeout: 5000 }).catch(() => null);

      console.log(`Hotel ${i + 1}`);
      console.log(`  Name   : ${name || 'N/A'}`);
      console.log(`  Price  : ${price || 'N/A'}`);
      console.log(`  Rating : ${rating || 'N/A'}`);
      console.log(`  Image  : ${imageUrl || 'N/A'}`);
      console.log('-----------------------------');
    }
  }

  /**
   * Apply filters: Property rating 4★ and 5★, Breakfast included, Free cancellation.
   * Uses role/text locators for stability (filter panel IDs are dynamic on Booking.com).
   */
  async applyFilters() {
    // Property rating: 4 star and 5 star (expand "Property rating" if needed)
    const filterStar4 = this.page.getByRole('checkbox', { name: /4 star/i });
    const filterStar5 = this.page.getByRole('checkbox', { name: /5 star/i });
    if (await filterStar4.isVisible({ timeout: 5000 }).catch(() => false)) {
      await filterStar4.click();
    }
    if (await filterStar5.isVisible({ timeout: 3000 }).catch(() => false)) {
      await filterStar5.click();
    }

    // Meal plan: Breakfast included
    const breakfast = this.page.getByRole('checkbox', { name: /breakfast included/i });
    if (await breakfast.isVisible({ timeout: 5000 }).catch(() => false)) {
      await breakfast.click();
    }

    // Free cancellation
    const freeCancellation = this.page.getByRole('checkbox', { name: /free cancellation/i });
    if (await freeCancellation.isVisible({ timeout: 5000 }).catch(() => false)) {
      await freeCancellation.click();
    }

    // Wait for results to update after filters (explicit wait for first card)
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.locator(locators.hotelCard).first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  }

  /**
   * Returns count of visible property cards (after filters).
   */
  async getVisibleHotelCount() {
    return await this.page.locator(locators.hotelCard).count();
  }

  /**
   * Click first hotel's "See availability" / CTA. Uses force: true so overlays (banners, modals)
   * that intercept pointer events don't block the click. Call with waitForNewTab in parallel.
   */
  async clickFirstHotel() {
    const btn = this.page.locator(locators.availabilityCtaButton).first();
    await btn.scrollIntoViewIfNeeded().catch(() => {});
    await btn.click({ force: true });
  }

}

export default ResultsPage;
