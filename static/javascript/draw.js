import {deleteChildElements, deleteFirstChildElement, deleteLastTwoChildElements} from "./delete.js";
import {getData} from "./request.js";

const constants = {
    planetTableHeads: {
        0: "Name",
        1: "Diameter",
        2: "Climate",
        3: "Terrain",
        4: "Surface Water Percentage",
        5: "Population",
        6: "Residents",
        7: ""
    },
    residentTableHeads: {
        0: "Name",
        1: "Height",
        2: "Mass",
        3: "Hair color",
        4: "Skin color",
        5: "Eye color",
        6: "Birth year",
        7: "Gender"
    }
}

function drawPagination(next, previous){
    let previousButton = drawButton({className: "previous", content: "Previous"});
    let nextButton = drawButton({className: "next", content: "Next"});
    if(previous === null){
        previousButton.classList.add("disabled");
        previousButton.disabled = true;
    } else {
        previousButton.setAttribute("data-url", previous);
        previousButton.addEventListener("click", () => reBuildPage(previousButton));
    }
    if(next === null){
        nextButton.classList.add("disabled");
        nextButton.disabled = true;
    } else {
        nextButton.setAttribute("data-url", next);
        nextButton.addEventListener("click", () => reBuildPage(nextButton));
    }
    appendElementsToTheirParent({parentElement: document.getElementById("pagination"), childElements: [previousButton, nextButton]})
}

function drawButton({className, content}){
    const button = document.createElement("button");
    button.textContent = `${content}`;
    button.classList.add(className);
    return button;
}

async function reBuildPage(button){
    deleteFirstChildElement({parentElement: document.getElementById("table")});
    deleteChildElements({parentElement: document.getElementById("pagination")});
    const response = await getData(button.getAttribute("data-url"));
    drawPagination(response.next, response.previous);
    drawPlanetTable({className: "planet", results: response.results});
}

function appendElementToItsParent({parentElement, childElement}){
    parentElement.appendChild(childElement);
}

function appendElementsToTheirParent({parentElement, childElements}){
    childElements.forEach(child => parentElement.appendChild(child));
}

function drawPlanetTable({className, results}){
    const {table, tr} = drawTableHead({className: className});
    appendElementToItsParent({parentElement: document.getElementById("table"), childElement: table});
    for(let key in constants.planetTableHeads) {
        const th = document.createElement("th");
        th.textContent = constants.planetTableHeads[key];
        appendElementToItsParent({parentElement: tr, childElement: th});
    }
    const tbody = document.createElement("tbody");
    appendElementToItsParent({parentElement: table, childElement: tbody});
    results.forEach(function (item){
        listPlanetDataInTableRows({item: item, tbody: tbody});
    });
}

function drawTableHead({className}){
    const table = document.createElement("table");
    table.classList.add(className);
    const thead = document.createElement("thead");
    appendElementToItsParent({parentElement: table, childElement: thead});
    const tr = document.createElement("tr");
    appendElementToItsParent({parentElement: thead, childElement: tr});
    return {table: table, tr: tr};
}

function listPlanetDataInTableRows({item, tbody}) {
    const tr = document.createElement("tr");
    appendElementToItsParent({parentElement: tbody, childElement: tr});
    for(let key in constants.planetTableHeads){
        const td = document.createElement("td");
        addPlanetData(key, item, td);
        appendElementToItsParent({parentElement: tr, childElement: td});
    }
}

function listResidentDataInTableRows({item, tbody}) {
    const tr = document.createElement("tr");
    appendElementToItsParent({parentElement: tbody, childElement: tr});
    for(let key in constants.residentTableHeads){
        const td = document.createElement("td");
        addResidentData(key, item, td);
        appendElementToItsParent({parentElement: tr, childElement: td});
    }
}

function addPlanetData(key, item, td){
    switch (key) {
        case "0":
            td.textContent = item.name;
            break;
        case "1":
            td.textContent = (parseFloat(item.diameter)/1000).toFixed(3);
            break;
        case "2":
            td.textContent = item.climate;
            break;
        case "3":
            td.textContent = item.terrain;
            break;
        case "4":
            td.textContent = item.surface_water !== "unknown" ? `${item.surface_water}%` : "unknown";
            break;
        case "5":
            td.textContent = item.population !== "unknown" ? `${parseInt(item.population).toLocaleString()} people` : "unknown";
            break;
        case "6":
            if(item.residents.length !== 0){
                const button = document.createElement("button");
                button.classList.add("residents");
                button.addEventListener("click", () => showResidentsInModal({planetName: item.name, listOfResidents: item.residents}));
                appendElementToItsParent({parentElement: td, childElement: button});
                button.textContent = `${item.residents.length} resident(s)`;
            } else {
                td.textContent = "No known residents";
            }
            break;
        case "7":
            const button = document.createElement("button");
            button.classList.add("vote");
            appendElementToItsParent({parentElement: td, childElement: button});
            button.textContent = "Vote";
            break;
    }
}

function addResidentData(key, item, td){
    switch (key) {
        case "0":
            td.textContent = item.name;
            break;
        case "1":
            td.textContent = item.height;
            break;
        case "2":
            td.textContent = item.mass;
            break;
        case "3":
            td.textContent = item.hair_color;
            break;
        case "4":
            td.textContent = item.skin_color;
            break;
        case "5":
            td.textContent = item.eye_color;
            break;
        case "6":
            td.textContent = item.birth_year;
            break;
        case "7":
            td.textContent = item.gender;
            break;
    }
}

function showResidentsInModal({planetName, listOfResidents}) {
    const overlay = drawOverlay();
    const {modal, modalBody} = drawModalForResidents({planetName: planetName});
    const body = document.querySelector("body");
    appendElementToItsParent({parentElement: body, childElement: overlay});
    appendElementToItsParent({parentElement: body, childElement: modal});
    drawResidentTable({modalBody, listOfResidents});
}

function drawOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    return overlay;
}

function drawModalForResidents({planetName}){
    const modal = document.createElement("div");
    modal.id = "modal";

    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");
    const modalTitle = document.createElement("h1");
    modalTitle.textContent = `Residents of ${planetName}`;
    appendElementToItsParent({parentElement: modalHeader, childElement: modalTitle});
    const modalCloseX = document.createElement("button");
    modalCloseX.textContent = "X";
    modalCloseX.addEventListener("click", () => closeModal());
    appendElementToItsParent({parentElement: modalHeader, childElement: modalCloseX});
    appendElementToItsParent({parentElement: modal, childElement: modalHeader});

    const modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");
    appendElementToItsParent({parentElement: modal, childElement: modalBody});

    const modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");
    const modalCloseText = document.createElement("button");
    modalCloseText.textContent = "Close";
    modalCloseText.addEventListener("click", () => closeModal());
    appendElementToItsParent({parentElement: modalFooter, childElement: modalCloseText});
    appendElementToItsParent({parentElement: modal, childElement: modalFooter});
    return {modal: modal, modalBody: modalBody};
}

function drawResidentTable({modalBody, listOfResidents}){
    const {table, tr} = drawTableHead({className: "resident"});
    appendElementToItsParent({parentElement: modalBody, childElement: table})
    for(let key in constants.residentTableHeads) {
        const th = document.createElement("th");
        th.textContent = constants.residentTableHeads[key];
        appendElementToItsParent({parentElement: tr, childElement: th});
    }
    const tbody = document.createElement("tbody");
    appendElementToItsParent({parentElement: table, childElement: tbody});
    listOfResidents.forEach(async function (resident){
        const response = await getData(resident);
        listResidentDataInTableRows({item: response, tbody: tbody});
    });
}

function closeModal(){
    const body = document.querySelector("body");
    deleteLastTwoChildElements({parentElement: body});
}

export { drawPagination, drawPlanetTable };