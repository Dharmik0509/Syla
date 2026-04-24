/**
 * Returns true only if a product's discount is currently valid:
 *  - discountPercentage > 0
 *  - today is on or after discountStartDate (if set)
 *  - today is before or on discountEndDate (if set)
 */
export function isDiscountActive(product) {
    if (!product || !product.discountPercentage || product.discountPercentage <= 0) return false;

    const now = new Date();

    if (product.discountStartDate && new Date(product.discountStartDate) > now) return false;
    if (product.discountEndDate   && new Date(product.discountEndDate)   < now) return false;

    return true;
}

/**
 * Returns the effective selling price, respecting date boundaries.
 */
export function getEffectivePrice(product) {
    if (!product) return 0;
    if (isDiscountActive(product)) {
        return Math.round(product.price - (product.price * (product.discountPercentage / 100)));
    }
    return product.price;
}
