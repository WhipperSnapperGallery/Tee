export function buildCsvString() {
    let headerString = "";
    let bodyString = "";

    for (let elem of document.querySelectorAll(".botText")) {
        console.log(document.querySelectorAll(".botText"));
        headerString += elem.innerText + ",";
    }

    for (let elem of document.querySelectorAll(".userText")) {
        headerString += elem.innerText + ",";
    }

    console.log(headerString);
    console.log(bodyString);
};