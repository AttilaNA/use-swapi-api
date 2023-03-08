import {deleteChildElements, deleteFirstChildElement} from "./delete.js";
import {getData} from "./request.js";
import {drawPagination, drawPlanetTable} from "./drawer.js";

function getButtonElementWithClassName({className, content}) {
    const button = document.createElement("button");
    button.textContent = `${content}`;
    button.classList.add(className);
    return button;
}

async function reBuildPaginationAndPlanetTable({url}) {
    deleteFirstChildElement({parentElement: document.getElementById("table")});
    deleteChildElements({parentElement: document.getElementById("pagination")});
    const response = await getData(url);
    drawPagination({urlNext: response.next, urlPrevious: response.previous});
    drawPlanetTable({className: "planet", results: response.results});
}

function appendElementToItsParent({parentElement, childElement}) {
    parentElement.appendChild(childElement);
}

function appendElementsToTheirParent({parentElement, childElements}) {
    childElements.forEach(child => parentElement.appendChild(child));
}

function getTableElementWithClassName({className}) {
    const table = document.createElement("table");
    table.classList.add(className);
    const thead = document.createElement("thead");
    appendElementToItsParent({parentElement: table, childElement: thead});
    const tr = document.createElement("tr");
    appendElementToItsParent({parentElement: thead, childElement: tr});
    const tbody = document.createElement("tbody");
    appendElementToItsParent({parentElement: table, childElement: tbody});
    return {table: table, theadRow: tr, tbody: tbody};
}

function getModalElementWithIdName({className, planetName}){
    const modal = document.createElement("div");
    modal.id = className;

    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");
    const modalTitle = document.createElement("h1");
    modalTitle.textContent = `Residents of ${planetName}`;
    appendElementToItsParent({parentElement: modalHeader, childElement: modalTitle});
    const modalCloseX = document.createElement("button");
    modalCloseX.textContent = "X";
    appendElementToItsParent({parentElement: modalHeader, childElement: modalCloseX});
    appendElementToItsParent({parentElement: modal, childElement: modalHeader});

    const modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");
    appendElementToItsParent({parentElement: modal, childElement: modalBody});

    const modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");
    const modalCloseText = document.createElement("button");
    modalCloseText.textContent = "Close";
    appendElementToItsParent({parentElement: modalFooter, childElement: modalCloseText});
    appendElementToItsParent({parentElement: modal, childElement: modalFooter});
    return {modal: modal, modalBody: modalBody, modalCloseX: modalCloseX, modalCloseText: modalCloseText};
}

export {
    getButtonElementWithClassName,
    reBuildPaginationAndPlanetTable,
    appendElementToItsParent,
    appendElementsToTheirParent,
    getTableElementWithClassName,
    getModalElementWithIdName };
