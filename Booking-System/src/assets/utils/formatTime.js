export const formatTime = (booking) => {
    const start = booking.timeStart || '';
    const startAmPm = booking.timeStartAmPm || '';
    const end = booking.timeEnd || '';
    const endAmPm = booking.timeEndAmPm || '';

    if (start && end) {
        return `${start} ${startAmPm} - ${end} ${endAmPm}`;
    }
    if (start) {
        return `${start} ${startAmPm}`;
    }
    return 'N/A';
};
