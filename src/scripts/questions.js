export const QType = {
    MULTIPLE_CHOICE: "multiple_choice",
    TRUE_FALSE: "true_false",
    TEXT_ANSWER: "text_answer",
    NO_ANSWER: "no_answer",
}

export class Question {
    constructor(text, type, choices, next=null) {
        this.text = text;
        this.type = type;
        this.choices = choices;
        this.next = next;
    }
}

export class Response {
    constructor(text, nextQuestion) {
        this.text = text;
        this.nextQuestion = nextQuestion;
    }
}