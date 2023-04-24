const { QType, Response } = require("./questions.js");
const getBotResponse = require("./responses.js").default;

window.addEventListener("load", (e) => {
  // Collapsible
  let coll = $(".collapsible");
  let triggered = false;
  let currentQuestion = null;

  // If there is only one collapsible element (the chatbox) there is no need
  // to iterate over a list
  coll.click(() => {
    $(this).toggleClass("active");

    if (!triggered) {
      setTimeout(firstBotMessage, 1000);
      triggered = true;
    }

    let content = coll.next();
    if (content.css("max-height") !== "0px") {
      content.css("max-height", "0px");
    } else {
      content.css("max-height", content[0].scrollHeight + "px");
    }
  });

  function getTime() {
    let today = new Date();
    hours = (today.getHours() % 13) + 1; //display it in 12-hour time
    minutes = today.getMinutes();

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    let time = hours + ":" + minutes;
    return time;
  }

  // Gets the first message
  function firstBotMessage() {
    let firstMessage = "Hi!";
    $("#botStarterMessage").html(
      `<p class="botText"><span> ${firstMessage} </span></p>`
    );

    let time = getTime();

    $("#chat-timestamp").append(time);
    $("#userInput")[0].scrollIntoView(false);
  }

  // Retrieves the response
  function getResponse(selfCalled = false) {
    let userText = $("#textInput").val();
    $("#textInput").val(""); //set the user input to whatever post message before the API call so it appears instantly, mainly for button-based messages
    if (userText || selfCalled) {
      let botResponse = "Sorry, I'm having trouble.";
      let userHtml = '<p class="userText"><span>' + userText + "</span></p>";
      if (!selfCalled) {
        $("#chatbox").append(userHtml);
      }
      $("#chat-bar-bottom")[0].scrollIntoView(true);
      response = getBotResponse(currentQuestion, userText);
      currentQuestion = response;
      if (response) {
        botResponse = response.text;
      }
      let botHtml = '<p class="botText"><span>' + botResponse + "</span></p>";
      $("#chatbox").append(botHtml);
      $("#chat-bar-bottom")[0].scrollIntoView(true);
      handleQType(response);
    }
  }

  function handleQType(response) {
    switch (response.type) {
      case QType.MULTIPLE_CHOICE:
        mcQuestion(response);
        break;
      case QType.TEXT_ANSWER:
        break;
      case QType.NO_ANSWER:
        setTimeout(() => { getResponse(selfCalled = true) }, 2000)
        break;
      default:
        break;
    }
  }

  function mcQuestion(response) {
    if (response.type == QType.MULTIPLE_CHOICE) {
      $("#userInput").addClass("d-none");
      $(".chat-bar-icons").addClass("d-none");
      $("#buttonInput").removeClass("d-none");
      $("#buttonInput").addClass("d-flex");
      let answers = response.choices;
      for (i = 0; i < answers.length; i++) {
        let answer = answers[i].text;
        let button = $(`#btnInput${i}`);
        button.off("click");
        button.click(() => {
          buttonSendText(answer);
          $("#userInput").addClass("d-none");
          $(".chat-bar-icons").addClass("d-none");
          $("#buttonInput").removeClass("d-none");
          $("#buttonInput").addClass("d-flex");
        });
        button.html(answer);
        button.removeClass("d-none");
      }
    }
  }

  // Handles sending text via button clicks
  function buttonSendText(sampleText) {
    $("#textInput").val(sampleText); //sets the user's text input to the sample text
    getResponse(); //gets the response
  }

  const heartButton = () => {
    buttonSendText("&#129505");
  };

  // Press enter to send a message
  $("#textInput").keypress(function (e) {
    if (e.which == 13) {
      getResponse();
    }
  });

  // Press the send button to send a message
  $("#send-icon").click((e) => {
    getResponse("");
  });
  $("#heart-icon").click(heartButton);

  setTimeout(() => { if (!triggered) { coll.click(); } }, 10000);
});
