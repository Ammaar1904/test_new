import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/login';
import SearchPage from '../../pages/search';
import { locators } from '../../locator/locator';
import ResultsPage from '../../pages/resultpage';


test.describe('@sanity', () => {
  test('login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login();

    await expect(page.locator(locators.logo)).toBeVisible();
    await expect(page.locator(locators.searchBox).or(page.locator(locators.destinationInput)).first()).toBeVisible();
  });

  test('Search hotels with dynamic dates', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const searchPage = new SearchPage(page);

    await loginPage.login();

    await searchPage.goToSearchResults('Goa, India', 10, 13);

    await expect(page).toHaveURL(/searchresults/);
  });

  test('Fetch all hotel listings from first page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const searchPage = new SearchPage(page);
    const resultsPage = new ResultsPage(page);

    await loginPage.login();

    await searchPage.goToSearchResults('Goa, India', 10, 13);

    await resultsPage.fetchAllListings();
  });



});
