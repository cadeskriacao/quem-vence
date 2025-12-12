export const BASE_PRICE = 10.00;
export const PRICE_INCREMENT = 0.01;
export const MAX_SUPPLY = 10000;

/**
 * Calculates the price of the Next token based on NET supply difference.
 * Price = 10.00 + (NetDelta * 0.01)
 * @param netDelta (VenceSold - PerdeSold) OR (PerdeSold - VenceSold) depending on perspective
 * @returns The price of the next token to be sold.
 */
export function getCurrentPrice(netDelta: number): number {
    const price = BASE_PRICE + (netDelta * PRICE_INCREMENT);
    // Clamp price to ensure it doesn't go below 0 (though theoretically unlikely with 10k limit and 0.01 inc)
    return Math.max(0.01, price);
}

/**
 * Calculates the total cost to buy 'quantity' tokens.
 * Since price changes by 0.01 for EVERY token sold, this is an arithmetic series.
 * 
 * @param currentNetDelta The current net difference (TokensOfInterest - OpposingTokens)
 * @param quantity Amount to buy
 */
export function calculatePurchase(currentNetDelta: number, quantity: number) {
    if (quantity <= 0) {
        return { total: 0, averagePrice: 0, newNetDelta: currentNetDelta };
    }

    // Price of the 1st token in this batch = Base + (CurrentNet * Inc)
    // Actually, if I have delta 0, the next token is price 10.00.
    // If I have delta 1, the next token is 10.01.
    // Formula: P(n) = BASE + (n * INC)
    // We are buying tokens from index 'currentNetDelta' to 'currentNetDelta + quantity - 1' relative to base.

    // First token price (at index currentNetDelta)
    const startPrice = getCurrentPrice(currentNetDelta);

    // Last token price (at index currentNetDelta + quantity - 1)
    const endPrice = getCurrentPrice(currentNetDelta + quantity - 1);

    // Sum = (n/2) * (first + last)
    const total = (quantity * (startPrice + endPrice)) / 2;
    const averagePrice = total / quantity;

    return {
        total,
        averagePrice,
        newNetDelta: currentNetDelta + quantity
    };
}
