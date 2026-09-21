/**
 * Utility functions for pricing and dates in the NEÏROUA e-commerce ecosystem.
 */

/**
 * Formats a numeric price into localized FCFA currency with thousands space separator
 * Example: 8500 -> "8 500 FCFA"
 */
export const formatPrice = (amount: number, currency: string = 'FCFA'): string => {
  if (typeof amount !== 'number' || isNaN(amount)) return `0 ${currency}`;
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} ${currency}`;
};

/**
 * Generates an exclusive order reference code
 * Example: "NR-8493"
 */
export const generateOrderNumber = (): string => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `NR-${randomDigits}`;
};

/**
 * Formats a date into French long/medium format
 */
export const formatFrenchDate = (date: Date = new Date()): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

/**
 * Calculates delivery estimated date (Date du jour + 3 jours)
 */
export const getEstimatedDeliveryDate = (daysAhead: number = 3): string => {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + daysAhead);
  return formatFrenchDate(deliveryDate);
};
