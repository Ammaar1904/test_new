import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/login';
import SearchPage from '../../pages/search';
import ResultsPage from '../../pages/resultpage';
import HotelDetailPage from '../../pages/hoteldetail';
import { locators } from '../../locator/locator';
import { waitForNewTab } from '../../utils/tabHandle';


test.describe('@sanity Booking.com hotel search and booking flow', () => {
  test('Full flow: homepage → search → listings → filters → first hotel detail', {
    timeout: process.env.CI ? 360000 : 180000,
  }, async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page);
    const searchPage = new SearchPage(page);
    const resultsPage = new ResultsPage(page);

    // ─── 1. Launch & Validate Homepage ─────────────────────────────────────
    try {
      console.log('\n[STEP 1] Launching Booking.com and validating homepage...');
      await loginPage.login();
      await expect(page.locator(locators.logo)).toBeVisible();
      await expect(page.locator(locators.searchBox).or(page.locator(locators.destinationInput)).first()).toBeVisible();
      console.log('[STEP 1] Logo and search box visible.\n');
    } catch (err) {
      console.error('[STEP 1] Homepage validation failed:', err.message);
      throw err;
    }

    // ─── 2. Go to Search Results (Goa, India; check-in +10, check-out +13) ─
    try {
      console.log('[STEP 2] Navigating to search results: Goa India, check-in +10 days, check-out +13 days...');
      await searchPage.goToSearchResults('Goa, India', 10, 13);
      await resultsPage.waitForResultsLoaded();
      console.log('[STEP 2] Results page loaded.\n');
    } catch (err) {
      console.error('[STEP 2] Search failed:', err.message);
      throw err;
    }

    // ─── 3. Extract Hotel Listings (First Page) ───────────────────────────
    try {
      console.log('[STEP 3] Extracting hotel listings from first page...');
      await resultsPage.fetchAllListings();
      console.log('[STEP 3] Listings extracted.\n');
    } catch (err) {
      console.error('[STEP 3] Listing extraction failed:', err.message);
      throw err;
    }

    // ─── 4. Apply Filters (4★+, Breakfast, Free cancellation) ───────────
    try {
      console.log('[STEP 4] Applying filters: 4★ and 5★, Breakfast included, Free cancellation...');
      await resultsPage.applyFilters();
      const hotelCount = await resultsPage.getVisibleHotelCount();
      expect(hotelCount).toBeGreaterThanOrEqual(3);
      console.log(`[STEP 4] At least 3 hotels after filters (visible: ${hotelCount}).\n`);
    } catch (err) {
      console.error('[STEP 4] Filters or validation failed:', err.message);
      throw err;
    }

    // ─── 5. Select First Hotel (new tab) & Inspect Detail Page ────────────
    let hotelPage;
    try {
      console.log('[STEP 5] Opening first hotel in new tab...');
      hotelPage = await waitForNewTab(page, () => resultsPage.clickFirstHotel());
      await hotelPage.bringToFront();
      console.log('[STEP 5] Hotel detail page opened.\n');
    } catch (err) {
      console.error('[STEP 5] New tab / first hotel click failed:', err.message);
      throw err;
    }

    const hotelDetailPage = new HotelDetailPage(hotelPage);

    // Extract and print room types and room prices
    try {
      console.log('[STEP 5a] Extracting room types and prices...');
      await hotelDetailPage.extractAndPrintRoomTypesAndPrices();
      console.log('[STEP 5a] Room data extracted.\n');
    } catch (err) {
      console.error('[STEP 5a] Room extraction failed (non-fatal):', err.message);
    }

    // Scroll to bottom, validate Reviews or Policies, and capture screenshot proof
    try {
      console.log('[STEP 5b] Scrolling to bottom and validating Reviews/Policies...');
      await hotelDetailPage.scrollToBottom();
      const hasReviewsOrPolicies = await hotelDetailPage.isReviewsOrPoliciesVisible();
      expect(hasReviewsOrPolicies).toBe(true);
      console.log('[STEP 5b] Reviews or Policies section is visible.\n');

      // Screenshot proof of final step (hotel detail page, bottom with Reviews/Policies)
      const screenshotPath = testInfo.outputPath('booking-final-step.png');
      await hotelPage.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`[STEP 5b] Screenshot saved: ${screenshotPath}\n`);
    } catch (err) {
      console.error('[STEP 5b] Scroll or section validation failed:', err.message);
      throw err;
    }
  });
});
