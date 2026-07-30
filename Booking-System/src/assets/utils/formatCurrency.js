export const formatCurrency = (num) => {
    const number = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(number)) return '0.00';
    
    return number.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};