export function toJavascriptDate(date){
    return new Date(date[0] + '-' + date[1] + '-' + date[2]).toISOString().substring(0, 10);
}

export function toJavascriptDateTime(date){
    return date[0] + '-' + (date[1] < 10 ? ('0' + date[1]) : date[1]) + '-' + (date[2] < 10 ? ('0' + date[2]) : date[2]) + ' ' + (date[3] < 10 ? ('0' + date[3]): date[3]) + ':' + (date[4] < 10 ? ('0' + date[4]) : date[4]);
}