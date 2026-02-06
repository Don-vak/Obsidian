export const mockPricing = {
    baseNightlyRate: 850,
    cleaningFee: 150,
    serviceFeePercentage: 10,
    taxPercentage: 8,
    minimumNights: 2,
    weeklyDiscountPercentage: 10,
    monthlyDiscountPercentage: 20,
};

export interface PricingBreakdown {
    nights: number;
    nightlyRate: number;
    subtotal: number;
    discount: number;
    cleaningFee: number;
    serviceFee: number;
    taxAmount: number;
    total: number;
}

export function calculateBookingPrice(nights: number): PricingBreakdown {
    const subtotal = mockPricing.baseNightlyRate * nights;

    // Apply discounts
    let discount = 0;
    if (nights >= 28) {
        discount = subtotal * (mockPricing.monthlyDiscountPercentage / 100);
    } else if (nights >= 7) {
        discount = subtotal * (mockPricing.weeklyDiscountPercentage / 100);
    }

    const discountedSubtotal = subtotal - discount;
    const serviceFee = discountedSubtotal * (mockPricing.serviceFeePercentage / 100);
    const taxAmount = (discountedSubtotal + serviceFee + mockPricing.cleaningFee) * (mockPricing.taxPercentage / 100);
    const total = discountedSubtotal + mockPricing.cleaningFee + serviceFee + taxAmount;

    return {
        nights,
        nightlyRate: mockPricing.baseNightlyRate,
        subtotal,
        discount,
        cleaningFee: mockPricing.cleaningFee,
        serviceFee,
        taxAmount,
        total,
    };
}
