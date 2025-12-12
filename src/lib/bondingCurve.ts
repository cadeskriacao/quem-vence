
export const BASE_PRICE = 10.00;
export const PRICE_INCREMENT = 0.01;
export const MAX_SUPPLY = 10000;

/**
 * Calculates the price of the Nth token.
 * @param soldCount How many tokens have already been sold.
 * @returns The price of the next token (soldCount + 1).
 */
export function getCurrentPrice(soldCount: number): number {
    if (soldCount < 0) return BASE_PRICE;
    return BASE_PRICE + (soldCount * PRICE_INCREMENT);
}

/**
 * Calculates the total cost to buy 'quantity' tokens starting from 'currentSoldCount'.
 * Also returns the new resulting price after the purchase.
 */
export function calculatePurchase(currentSoldCount: number, quantity: number) {
    if (quantity <= 0) {
        return { total: 0, averagePrice: 0, newPrice: getCurrentPrice(currentSoldCount) };
    }

    const startPrice = getCurrentPrice(currentSoldCount);
    const endPrice = getCurrentPrice(currentSoldCount + quantity - 1);

    // Arithmetic sum: (n * (first + last)) / 2
    const total = (quantity * (startPrice + endPrice)) / 2;
    const averagePrice = total / quantity;

    // The price of the NEXT token to be sold after this batch
    const newNextPrice = getCurrentPrice(currentSoldCount + quantity);

    return {
        total,
        averagePrice,
        newNextPrice
    };
}
