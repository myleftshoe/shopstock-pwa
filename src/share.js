const defaultFooter = encodeURIComponent(`

Open app:
https://wild-queen.surge.sh 

Open spreadsheet:
https://docs.google.com/spreadsheets/d/19e2yItX7uHtERCNbq42yC4BjcUQ3rSQUmyDPwv8Uhlg/edit?usp=sharing

`);


function sendEmail({to = "", subject = "", body = "", footer = defaultFooter} = {}) {
    const _to = encodeURIComponent(to)
    const _subject = encodeURIComponent(subject)
    const _body = encodeURIComponent(`${body}${footer}`)
    const link = `mailto:${_to}?subject=${_subject}&body=${_body}`
    window.open(link, '_self');
}

function sendSMS({to = "", subject = "", body = "", footer = defaultFooter} = {}) {
    const _to = encodeURIComponent(to);
    const _subject = subject && subject + "\r\n\r\n";
    const _body = encodeURIComponent(`${_subject}${body}${footer}`);
    const link = `sms:${_to}?&body=${_body}`
    window.open(link, '_self');
//    window.open(`sms:?&body=${encodeURIComponent(body)}`, '_self');
}



export { sendEmail, sendSMS }





