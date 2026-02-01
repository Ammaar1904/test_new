import { locators } from '../locator/locator';

/**
 * Page object for Booking.com hotel property detail page (room types, prices, reviews, policies).
 */
class HotelDetailPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Extract and print room types and room prices from the property page.
   * Handles multiple selector patterns used by Booking.com.
   */
  async extractAndPrintRoomTypesAndPrices() {
    const roomRows = this.page.locator(locators.roomRow);
    const count = await roomRows.count();

    if (count === 0) {
      // Fallback: try links/headings that look like room names
      const roomLinks = this.page.getByRole('link', { name: /room|suite|apartment|studio/i });
      const linkCount = await roomLinks.count();
      console.log('\n[HOTEL DETAIL] Room types (from links):');
      for (let i = 0; i < Math.min(linkCount, 15); i++) {
        const name = await roomLinks.nth(i).innerText().catch(() => 'N/A');
        console.log(`  Room ${i + 1}: ${name || 'N/A'}`);
      }
      return;
    }

    console.log(`\n[HOTEL DETAIL] Room types and prices (${count} rows):\n`);

    for (let i = 0; i < count; i++) {
      const row = roomRows.nth(i);
      const typeName = await row.locator(locators.roomTypeName).first().innerText().catch(() => null);
      const price = await row.locator(locators.roomPrice).first().innerText().catch(() => null);
      const fallbackName = await row.locator('h3, .bui-list__item-title, [class*="room"]').first().innerText().catch(() => null);
      const fallbackPrice = await row.locator('[class*="price"], [class*="amount"]').first().innerText().catch(() => null);

      console.log(`Room ${i + 1}`);
      console.log(`  Type  : ${typeName || fallbackName || 'N/A'}`);
      console.log(`  Price : ${price || fallbackPrice || 'N/A'}`);
      console.log('-----------------------------');
    }
  }

  /**
   * Scroll to bottom of the page (for long content / reviews and policies sections).
   */
  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Check if "Reviews" or "Policies" (or "House rules") section is visible on the page.
   */
  async isReviewsOrPoliciesVisible() {
    const reviews = this.page.locator(locators.reviewsSection).first();
    const policies = this.page.locator(locators.policiesSection).first();
    const reviewsVisible = await reviews.isVisible().catch(() => false);
    const policiesVisible = await policies.isVisible().catch(() => false);

    if (!reviewsVisible && !policiesVisible) {
      const headingReviews = this.page.getByRole('heading', { name: /review/i });
      const headingPolicies = this.page.getByRole('heading', { name: /polic|house rule/i });
      return (await headingReviews.first().isVisible().catch(() => false)) ||
             (await headingPolicies.first().isVisible().catch(() => false));
    }
    return true;
  }
}

export default HotelDetailPage;
