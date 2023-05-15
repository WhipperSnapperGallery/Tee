import { QType } from "./questions.js";
import { getBotResponse } from "./responses.js";
import { captureScreenshot } from "./clipboard.js";
// import { emojiCursor } from "cursor-effects";

window.addEventListener("load", (e) => {
  // Collapsible
  // new emojiCursor({ emoji: ["🔥", "🐬", "🦆"] });

  let coll = $(".collapsible");
  let triggered = false;
  let currentQuestion = null;
  let isIconDragging = false;

  // new cursoreffects.ghostCursor();

  // If there is only one collapsible element (the chatbox) there is no need
  // to iterate over a list

  //Initialize set of possible link destinations
  const iframeSources = [{ 'title': 'Google', 'source': "https://www.google.com" },
  { 'title': 'YouTube', 'source': "https://www.youtube.com" },
  { 'title': 'Amazon', 'source': "https://www.amazon.ca" }];
  const gifSources = [{ 'title': 'TEST 1', 'source': "https://giphy.com/embed/R6gvnAxj2ISzJdbA63" },
  { 'title': 'TEST 2', 'source': "https://giphy.com/embed/3o7aD2vH0w5rMnZ3Bu" }]
  let modalCount = 0;

  function createModal(type) {
    if (modalCount > 7) {
      return;
    }
    modalCount++;
    console.log(`Creating modal ${modalCount}`);
    const itemChoice = type === 'gif' ? gifSources[Math.floor(Math.random() * gifSources.length)]
      : iframeSources[Math.floor(Math.random() * iframeSources.length)];
    const modal = $('<div>', { class: 'custom-modal' }).appendTo('body');
    const modalHeader = $('<div>', { class: 'cmodal-header' }).appendTo(modal);
    $('<span>', { text: itemChoice.title }).appendTo(modalHeader);
    const headerBtns = $('<div>', { class: 'cmodal-btns' }).appendTo(modalHeader);
    const minimizeBtn = $('<button>', { class: 'minimize-btn', text: '-' }).appendTo(headerBtns);
    const closeBtn = $('<button>', { id: 'closeBtn', class: 'minimize-btn', text: 'x' }).appendTo(headerBtns);
    const modalBody = $('<div>', { class: 'modal-body' }).appendTo(modal);
    $('<iframe>', { src: itemChoice.source }).appendTo(modalBody);


    minimizeBtn.on("click", function () {
      modalBody.toggle();
      $(this).text(modalBody.is(":visible") ? '-' : '+');
    });

    closeBtn.on("click", function (e) {
      const target = $(e.target);
      target.parent().parent().parent().remove();
      modalCount--;
    });

    let mouseOffsetX = 0;
    let mouseOffsetY = 0;
    let isDragging = false;

    modalHeader.on("mousedown", function (e) {
      isDragging = true;
      mouseOffsetX = e.clientX - modal.offset().left;
      mouseOffsetY = e.clientY - modal.offset().top;
    });

    $(document).on("mousemove", function (e) {
      if (!isDragging) return;
      modal.css({
        left: e.clientX - mouseOffsetX + "px",
        top: e.clientY - mouseOffsetY + "px"
      });
    });

    $(document).on("mouseup", function () {
      isDragging = false;
    });
  }

  coll.click(() => {
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
    let hours = (today.getHours() % 13) + 1; //display it in 12-hour time
    let minutes = today.getMinutes();

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
    if (document.getElementById("chat-ball") && !document.getElementById("chat-ball").onclick) {
      $('#chat-ball').on('click', () => { createModal('iframe') });
    }
    let userText = $("#textInput").val();
    $("#textInput").val(""); //set the user input to whatever post message before the API call so it appears instantly, mainly for button-based messages
    if (userText || selfCalled) {
      let botResponse = "Sorry, I'm having trouble.";
      let userHtml = '<p class="userText"><span>' + userText + "</span></p>";
      if (!selfCalled) {
        $("#chatbox").append(userHtml);
      }
      $("#chat-bar-bottom")[0].scrollIntoView(true);
      let response = getBotResponse(currentQuestion, userText);
      currentQuestion = response;
      if (response && response !== "end") {
        botResponse = response.text;
      }
      if (response == "end") {
        botResponse = "Bye!";
        createModal('iframe');

      }

      let botHtml = '<p class="botText"><span>' + botResponse + "</span></p>";
      setTimeout(() => {
        $("#chatbox").append(botHtml);
        $("#chat-bar-bottom")[0].scrollIntoView(true);
        let cont = $(".full-chat-block")
        handleQType(response);
        cont.scrollTop(cont.scrollTop() + 1000);
      }, 0);
    }
  }

  function handleQType(response) {
    mcCleanUp();
    switch (response.type) {
      case QType.MULTIPLE_CHOICE:
        mcQuestion(response);
        break;
      case QType.TEXT_ANSWER:
        textQuestion();
        break;
      case QType.NO_ANSWER:
        setTimeout(() => { getResponse(true) }, 0)
        break;
      case "end":
        textQuestion();
        $("#send-icon").off("click");
        $("#textInput").keypress(function (e) {
          if (e.which == 13) {
            return false;
          }
        });
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
      for (let i = 0; i < answers.length; i++) {
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

  function mcCleanUp() {
    for (let i = 0; i < 4; i++) {
      let button = $(`#btnInput${i}`);
      if (!button.hasClass("d-none")) {
        button.addClass("d-none");
      }
    }
  }

  function textQuestion() {
    $("#buttonInput").addClass("d-none");
    $("#buttonInput").removeClass("d-flex");
    $("#userInput").removeClass("d-none");
    $(".chat-bar-icons").removeClass("d-none");
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

  setTimeout(() => { if (!triggered) { coll.click(); } }, 0);

  function setupMainButtons() {
    const copyBtn = $("#copyBtn");
    copyBtn.on("click", captureScreenshot);
    const modalWand = $("#modalWand");
    modalWand.on("click", () => { createModal('iframe') });
    const gifDuck = $("#gifDuck");
    gifDuck.on("click", () => { createModal('gif') });

    let buttons = [copyBtn, modalWand, gifDuck];

    let mouseOffsetX = 0;
    let mouseOffsetY = 0;
    let isIconDragging = false;
    let buttonTarget = null;

    for (let button of buttons) {
      button.on("mousedown", function (e) {
        console.log("drag started");
        buttonTarget = $(e.target);
        console.log(JSON.stringify(buttonTarget));
        isIconDragging = true;
        mouseOffsetX = e.clientX - buttonTarget.offset().left;
        mouseOffsetY = e.clientY - buttonTarget.offset().top;
      });
    }

    $(document).on("mousemove", function (e) {
      if (!isIconDragging) return;
      console.log("dragging");
      buttonTarget.css({
        left: e.clientX - mouseOffsetX + "px",
        top: e.clientY - mouseOffsetY + "px"
      });
    });

    $(document).on("mouseup", function () {
      isIconDragging = false;
      console.log("drag ended");
      buttonTarget = null;
    });
  }

  setupMainButtons();
});
