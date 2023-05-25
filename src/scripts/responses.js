import { QType, Question, Response } from "./questions";
import { buildCsvString } from "./form";

//Initialize all the questions
const q1 = new Question("Gosh, everything feels so messed up lately. Like my back hurts, my shoulders too. And there's this tension in my throat", QType.NO_ANSWER, []);
const q2 = new Question("How've you been feeling lately?", QType.TEXT_ANSWER, []);
const q3 = new Question("For sure", QType.NO_ANSWER, []);
const q4 = new Question("Actually, do you want to do some stretches together?", QType.MULTIPLE_CHOICE, []);
export const q5 = new Question("Cool!! Let's try this one?", QType.NO_ANSWER, []);
// const q5a = new Question("<a href='https://www.youtube.com/watch?v=4pKly2JojMw' target='_blank' rel='noreferrer noopener'>https://www.youtube.com/watch?v=4pKly2JojMw</a>", QType.NO_ANSWER, []);
const q5b = new Question("Let me know when you're done.", QType.MULTIPLE_CHOICE, []);
const q6 = new Question("Haha, I feel so good. How does your body feel?", QType.MULTIPLE_CHOICE, []);
const q7 = new Question("Oh OK, no worries then.", QType.NO_ANSWER, []);
const q8 = new Question("Yo. Have you been thinking about the Internet lately?", QType.NO_ANSWER, []);
const q9 = new Question("Like, do you remember your first time being online?", QType.MULTIPLE_CHOICE, []);
const q10 = new Question("Oh, fair. What where you ito as a kid?", QType.TEXT_ANSWER, []);
const q11 = new Question("I remember being really into PBS games, like cyberchase. Then then I was into neopets for a bit. When I got a little older though, I started to venture into chatrooms. But now I feel so cringe about it lol.", QType.NO_ANSWER, []);
const q12 = new Question ("The Internet's changed so much. Does it feel different for you too? What kind of things do you do online now?", QType.TEXT_ANSWER, []);
const q13 = new Question("Intereting. Yeah, I get into the social medias a bunch, but lately I've been trying to surf the net like its 1999, u know?", QType.MULTIPLE_CHOICE, [])
const q14 = new Question("OK cool!", QType.NO_ANSWER, []);
const q15 = new Question("That's cool.", QType.NO_ANSWER, []);
const q16 = new Question("I have something for you!! Click on the magic wand!", QType.MULTIPLE_CHOICE, []);
const q17 = new Question("Anywayy. Thanks for hanging out today!!", QType.NO_ANSWER, []);

//Create the decision tree by setting the responses and next properties.
q1.next = q2; //do this for NO_ANSWER or TEXT_ANSWER questions
q2.next = q3;
q3.next = q4;
q4.choices.push(new Response("Ya, let's do it!", q5)); //do this for MULTIPLE_CHOICE questions which may have branching subsequent questions
q4.choices.push(new Response("No, it's cool.", q7));
q5.next = q5b;
// q5a.next = q5b;
q5b.choices.push(new Response("I'm done.", q6));
q6.choices.push(new Response("I feel great!", q8));
q6.choices.push(new Response("The same.", q7));
q6.choices.push(new Response("I feel worse.", q7));
q7.next = q8;
q8.next = q9;
q9.choices.push(new Response("Yes", q11));
q9.choices.push(new Response("No", q10));
q10.next = q11;
q11.next = q12;
q12.next = q13;
q13.choices.push(new Response("I getchu", q14));
q13.choices.push(new Response("Not really", q15));
q14.next = q16;
q15.next = q16;
q16.choices.push(new Response(`<button id='chat-ball' class="border-0 bg-transparent"><i class="fa-solid fa-gift"></i></i></button>`, q17));
q17.next = "end";

export const getBotResponse = (question=null, userResponse="") => {
    if (question === null) {
        return q1;
    }
    else if (question.next == null && question != null) {
        for (let i = 0 ; i < question.choices.length ; i++) {
            if (question.choices[i].text == userResponse) {
                return question.choices[i].nextQuestion;
            }
        }
    }
    else if (question.next == "end") {
        return "end";
    }
    else {
        return question.next;
    }
}

//Email stuff
//Section 3: Email

let sessionId = "";

function uuidv4() {
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
const sendMail = function (sendName, messageBody) {
    return Email.send({
        SecureToken: token,
        To: mainEmail,
        From: mainEmail,
        Subject: `New chat for session ID ${sendName}`,
        Body: buildMailString(sendName, messageBody),
    })
}
const sendEmail = (sendName, messageBody) => {
    sendMail(sendName, messageBody).then(value => {
        if (value === 'OK') {
            console.log("Email sent successfully");
        }
        else {
            console.log("Email error");
        }
    });
}