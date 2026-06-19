
export const timeRestriction = (bookingDetails, timeFormat) => {
    const startMins = timeFormat(bookingDetails.timeStart, bookingDetails.timeStartAmPm);
    const endMins = timeFormat(bookingDetails.timeEnd, bookingDetails.timeEndAmPm);
    const durationTime = endMins - startMins;

    if (endMins <= startMins) {
        return 'End time must be later than start time';
    } else if (durationTime < 300) {
        return 'Minimum booking time duration is 5 hours';
    } else if (durationTime > 480) {
        return 'Maximum booking time duration is 8 hours';
    }
    return null;
}