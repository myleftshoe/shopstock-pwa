const to = encodeURIComponent("");
const subject = encodeURIComponent("Shop stock completed");
const body = encodeURIComponent(`

Open app:
[https://squalid-stage.surge.sh] 

Open spreadsheet:
[https://docs.google.com/spreadsheets/d/19e2yItX7uHtERCNbq42yC4BjcUQ3rSQUmyDPwv8Uhlg/edit?usp=sharing]

`);

const mailTo = () =>  `mailto:${to}?subject=${subject}&body=${body}`

export default mailTo;

