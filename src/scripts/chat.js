import { QType } from "./questions.js";
import { getBotResponse, q5 } from "./responses.js";
import { captureScreenshot } from "./clipboard.js";
import { buildCsvString } from "./form.js";
import { uuidv4, sendEmail } from "./email.js";

const filePath = "/assets/files/statement.txt";
let statementText = "";
const sessionId = uuidv4();
const mainEmail = "condolences.zine@gmail.com";
const token = "";

function getStatement(sourceDict) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    statementText = xhr.responseText;
    sourceDict["Artist Statement"]['source'] = `<span class="fs-6 text-light">${statementText}</span>`;
  };
  xhr.open('GET', filePath, true);
  xhr.responseType = 'text';
  xhr.send();
}

document.addEventListener("DOMContentLoaded", () => {
  let coll = $(".collapsible");
  let triggered = false;
  let currentQuestion = null;

  //Initialize set of possible link destinations
  let iframeSources = {
    "Zine": { 'title': 'Object Permanancy Zine', 'source': '<iframe height="167" frameborder="0" src="https://itch.io/embed/2045348" width="552"><a href="https://bubbletrex.itch.io/object-permanancy-zine-badly-drawn-swamp-dream" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;">Object Permanancy Zine: Badly Drawn Swamp Dream by bubbletrex</a></iframe>' },
    "Stretches": { 'title': 'Stretch', 'source': '<iframe src="https://www.youtube-nocookie.com/embed/4pKly2JojMw?modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0" width="800" height="450" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;" frameborder="0"></iframe>' },
    "Artist Statement": { 'title': 'Statement', 'source': "" },
    "Game": {'title': 'Flower Feast', 'source': '<iframe src="https://flowerfeast-tee.glitch.me/" frameborder=0></iframe>'},
    "Credits": {'title': 'Credits', 'source': ''},
  };

  const gifSources = [
    { 'title': 'TEST 1', 'source': "https://giphy.com/embed/R6gvnAxj2ISzJdbA63" },
    { 'title': 'TEST 2', 'source': "https://giphy.com/embed/3o7aD2vH0w5rMnZ3Bu" }
  ]

  getStatement(iframeSources);

  function getGame() {
    window.open("https://flowerfeast-tee.glitch.me/", "_blank");
  }

  let modalCount = 0;

  function createSpecificModal(sourceID) {
    if (modalCount > 7) {
      return;
    }
    if (sourceID === "Game") {
      getGame();
      return;
    }
    const iframe = iframeSources[sourceID];
    modalCount++;
    console.log(`Creating modal ${modalCount}`);
    const headerStyle = `header-color${Math.floor(Math.random() * 4) + 1}`;
    const modal = $('<div>', { class: 'custom-modal' }).appendTo('body');
    const modalHeader = $('<div>', { class: `cmodal-header ${headerStyle}` }).appendTo(modal);
    $('<span>', { text: iframe['title'] }).appendTo(modalHeader);
    const headerBtns = $('<div>', { class: 'cmodal-btns' }).appendTo(modalHeader);
    const minimizeBtn = $('<button>', { class: 'minimize-btn', text: '-' }).appendTo(headerBtns);
    const closeBtn = $('<button>', { id: 'closeBtn', class: 'minimize-btn', text: 'x' }).appendTo(headerBtns);
    const modalBody = $('<div>', { class: 'modal-body' }).appendTo(modal);
    modalBody.html(iframe['source']);

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

  function createModal(type) {
    if (modalCount > 7) {
      return;
    }
    if (type !== 'gif' && type !== 'iframe') {
      return;
    }

    console.log(`Creating modal ${modalCount}`);
    let itemChoice;
    
    if (type === 'iframe') {
      let keys = Array.from(Object.keys(iframeSources));
      console.log(keys);
      itemChoice = keys[Math.floor(Math.random() * keys.length)];
      console.log(itemChoice);
      createSpecificModal(itemChoice);
      return;
    }

    modalCount++;
    
    itemChoice = gifSources[Math.floor(Math.random() * gifSources.length)];
    const headerStyle = `header-color${Math.floor(Math.random() * 4) + 1}`;
    const modal = $('<div>', { class: 'custom-modal' }).appendTo('body');
    const modalHeader = $('<div>', { class: `cmodal-header ${headerStyle}` }).appendTo(modal);
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
    $("#textInput").val(""); //set the user input to whatever post message before the call so it appears instantly, mainly for button-based messages
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

      if (response == q5) {
        createSpecificModal("Stretches");
      }

      if (response == "end") {
        botResponse = "Bye!";
        createModal('iframe');
        sendEmail(sessionId, buildCsvString(), mainEmail, token);

      }

      let botHtml = '<p class="botText"><span>' + botResponse + "</span></p>";
      setTimeout(() => {
        $("#chatbox").append(botHtml);
        $("#chat-bar-bottom")[0].scrollIntoView(true);
        let cont = $(".full-chat-block")
        handleQType(response);
        cont.scrollTop(cont.scrollTop() + 1000);
      }, 1200);
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
        setTimeout(() => { getResponse(true) }, 1200)
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

  setTimeout(() => { if (!triggered) { coll.click(); } }, 10000);

  function setupMainButtons() {
    $("#cpyBtn").on("click", captureScreenshot);
    $("#modalWand").on("click", () => { createModal('iframe') });
    $("#gifDuck").on("click", () => { createModal('gif') });
    $("#gameBtn").on("click", getGame);
    $("#zineBtn").on("click", () => { createSpecificModal('Zine') });
    $("#statementBtn").on("click", () => { createSpecificModal('Artist Statement') });
    $("#creditsBtn").on("click", () => { createSpecificModal('Credits') });
  }

  setupMainButtons();
});
