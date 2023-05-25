//Section 3: Email
export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function buildMailString(sendName, messageBody) {
    return `Chat record for session ID ${sendName}:
    <br><br>${messageBody}<br><br> End of chat record.`;
}

//Sends email and returns promise object containing info on status of sending
const sendMail = function (sendName, messageBody, mainEmail, token) {
    return Email.send({
        SecureToken: token,
        To: mainEmail,
        From: mainEmail,
        Subject: `New chat for session ID ${sendName}`,
        Body: buildMailString(sendName, messageBody),
    })
}
export const sendEmail = (sendName, messageBody, mainEmail, token) => {
    sendMail(sendName, messageBody, mainEmail, token).then(value => {
        if (value === 'OK') {
            console.log("Email sent successfully");
        }
        else {
            console.log("Email error");
        }
    });
}