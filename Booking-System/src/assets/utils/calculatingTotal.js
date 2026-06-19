
export const calculatingTotal = (deliveryFee) => {
    const rentalFee = 3500;
    const tax= rentalFee * 0.12;
    const delivery = Number(deliveryFee) || 0;
    const total = rentalFee + tax + delivery;

    return{
        rentalFee: rentalFee,
        tax: tax,
        deliveryFee: delivery,
        total: total

    }
}