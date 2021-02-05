export function toJavascriptDate(date){
    return new Date(date[0] + '-' + date[1] + '-' + date[2]).toISOString().substring(0, 10);
}

export function toJavascriptDateTime(date){
    return date[0] + '-' + (date[1] < 10 ? ('0' + date[1]) : date[1]) + '-' + (date[2] < 10 ? ('0' + date[2]) : date[2]) + ' ' + (date[3] < 10 ? ('0' + date[3]): date[3]) + ':' + (date[4] < 10 ? ('0' + date[4]) : date[4]);
}


//Use these 2 following functions only for view NOT for serialization!!!
export function toAppointmentDateTime(dateFrom, dateTo){
    return dateFrom[3]+":"+(dateFrom[4] < 10? ('0'+ dateFrom[4]):dateFrom[4])+' - '+dateTo[3]+":"+(dateTo[4] < 10 ? ('0'+dateTo[4]) : dateTo[4]);
}

export function toAppointmentDate(date){
    return (date[2]<10 ? ('0'+date[2]): date[2])+'.'+(date[1]<10? ('0'+date[1]):date[1])+'.'+date[0]+'.';
}