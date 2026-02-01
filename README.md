# Booking.com Hotel Search & Booking Flow – Playwright + JavaScript

Automated hotel search and filter flow on **Booking.com** using **Playwright** and **JavaScript**. No login required.

---

## Objective

- Launch Booking.com and validate homepage (logo, search box).
- Enter search: **Goa, India**, check-in **today + 10 days**, check-out **today + 13 days**.
- Wait for results, then fetch all hotel listings on the first page (name, price, rating, image URL).
- Apply filters: **4★ and above**, **Breakfast included**, **Free cancellation**.
- Validate at least **3 hotels** meet the criteria.
- Open the **first hotel** in a new tab; on the detail page fetch **room types and prices**, scroll to bottom, and validate **Reviews** or **Policies** section. Take a **screenshot** of the final step.

---

## Steps to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Install Playwright browsers (one-time)

```bash
npx playwright install
```

### 3. Run the Booking.com flow test

```bash
npx playwright test tests/ui/ --timeout=60000 --project=chromium --headed
```


Console logs are printed to the terminal during the run.

### 4. Run all UI tests (including login and listing tests)

```bash
npx playwright test tests/ui/
```

### 5. Run with headed browser (watch the run)

```bash
npx playwright test tests/ui/ --project=chromium --headed --timeout=120000
```

### 6. View HTML report (after a run)

```bash
npx playwright show-report
```

### 7. Run FakeStore API tests (Product Catalog API)

```bash
npm run test:api
# or
npx playwright test tests/api/ --project=api
```

Covers: GET all products (200, list ≥ 10, schema validation, JsonPath, catalog print), GET by ID (data-driven for IDs 1–3), POST new product, PUT update price, DELETE product. See `tests/api/products.spec.js`, `api/config.js`, `schemas/product.schema.json`.

## Project structure

```
├── api/
│   ├── config.js         # FakeStore API base URL, endpoints, default headers
│   └── productSchema.js  # Product response schema validation (ajv)
├── schemas/
│   └── product.schema.json   # JSON Schema for product response
├── pages/
│   ├── login.js          # Homepage launch, dismiss sign-in, wait for logo
│   ├── search.js         # Destination, dates (today+10 / today+13), search
│   ├── resultpage.js     # Listings extraction, filters, first hotel CTA
│   └── hoteldetail.js    # Room types/prices, scroll, Reviews/Policies check
├── locator/
│   └── locator.js        # Centralized selectors
├── utils/
│   ├── env.js            # Base URL
│   ├── popuphandle.js    # Dismiss sign-in popup
│   └── tabHandle.js      # New-tab handling for first hotel click
├── tests/
│   ├── api/
│   │   └── products.spec.js   # FakeStore API: GET all, GET by ID, POST, PUT, DELETE
│   └── ui/
│       ├── booking-flow.spec.js   # Full Booking.com flow (this automation)
│       └── login.spec.js          # Login/homepage and listing tests
├── playwright.config.js
└── README.md             # This file
```

---

## Key behaviour

- **Dynamic dates**: Check-in/check-out computed as today + 10 and today + 13 in `SearchPage.selectDates()`.
- **New tab**: First hotel opens in a new tab; `utils/tabHandle.js` and `waitForNewTab()` handle it.
- **Filters**: Applied via role-based checkboxes (4★, 5★, Breakfast, Free cancellation).
- **Waits**: Explicit waits for results URL and first property card; no fixed sleeps.
- **Screenshot**: Taken on the hotel detail page after scrolling to bottom and validating Reviews/Policies.

---

## Optional: run only the booking flow and open report

```bash
npx playwright test tests/ui/booking-flow.spec.js --project=chromium --timeout=120000 && npx playwright show-report
```

Then use the report to open the run and download or view the **booking-final-step.png** screenshot.


##CI
```bash
![Playwright CI](https://github.com/<your-username>/<repo-name>/actions/workflows/playwright-ci.yml/badge.svg)

```
