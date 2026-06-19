export const timeOptions = () => {
    let options = []
    for (let i = 1; i <= 12; i++){
        let hour = i < 10 ? "0" + i + ":00" : i + ":00";
        options.push(<option key={i} value={hour}>{hour}</option>);
    }
    return options;

}
export const timeFormat = (time, ampm) => {
    if (!time) return 0;
    
    let [hour, minute] = time.split(':').map(Number);
    if (ampm === 'PM' && hour < 12) {
        hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
        hour = 0;
    } 

    return (hour * 60) + minute;
}