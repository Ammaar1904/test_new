export const locators = {
  logo: '[data-testid="header-booking-logo"]',
  searchBox: '[data-testid="stays-search-box"]',
  
  destinationInput: 'input[placeholder="Where are you going?"]',
  datesContainer: '[data-testid="searchbox-dates-container"]',
  
  searchButton: '[data-testid="searchbox-layout-wide"]',
  dateCell: (date) => `[data-date="${date}"]`,
  hotelCard: '[data-testid="property-card"]',
  hotelName: '[data-testid="title"]',
  price: '[data-testid="price-and-discounted-price"]',
  rating: '[data-testid="review-score"]',
  image: 'img[data-testid="image"]',

  // Results page – filters (applied via getByRole/getByText in page for stability)
  availabilityCtaButton: '[data-testid="availability-cta-btn"]',

  // Hotel detail page – room and footer sections
  roomRow: '[data-testid="property-page-room-type"], .room-type-row, [class*="RoomGrid"], table.roomtype',
  roomTypeName: '[data-testid="room-type-name"], .room-name, h3 a, .bui-list__item-title',
  roomPrice: '[data-testid="room-price"], .room-price, .prco-valign-middle-helper',
  reviewsSection: '#review_list_score_container, [data-section-id="reviews"], .review_list, h2:has-text("Reviews")',
  policiesSection: '#policies, [data-section-id="policies"], .policies, h2:has-text("Policies"), h2:has-text("House rules")',
};
  