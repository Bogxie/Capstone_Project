export const calculatingTotal = (deliveryFee, rentalFee) => {
    const rental = Number(rentalFee) || 0;
    const tax = rental * 0.12;
    const delivery = Number(deliveryFee) || 0;
    const total = rental + tax + delivery;

    return {
        rentalFee: rental,
        tax: tax,
        deliveryFee: delivery,
        total: total
    }
}