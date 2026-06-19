/*export function timeOptions(selectedHour = null, minHour = 0){
    let options = '';
    for (let i = 1; i <= 12; i++){
        const hour = i.toString().padStart(2, '0') + ":00";
        const disabledHour = (minHour > 0 && i < minHour) ? 'disabled' : '';
        const selected  = selectedHour === hour ? 'selected': '';
        options += `<option value=${hour} ${selected} ${disabledHour}>${hour}</option>`;
    }
    return options;
};
*/

