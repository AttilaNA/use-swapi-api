import {deleteChildElements, deleteFirstChildElement} from "./delete.js";
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
        previousButton.addEventListener("click", function (){
            reBuildPage(previousButton);
        });
    }
    if(next === null){
        nextButton.classList.add("disabled");
        nextButton.disabled = true;
    } else {
        nextButton.setAttribute("data-url", next);
        nextButton.addEventListener("click", function (){
            reBuildPage(nextButton);
        });
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
    const table = document.createElement("table");
    table.classList.add(className);
    appendElementToItsParent({parentElement: document.getElementById("table"), childElement: table});
    const thead = document.createElement("thead");
    appendElementToItsParent({parentElement: table, childElement: thead});
    const tr = document.createElement("tr");
    appendElementToItsParent({parentElement: thead, childElement: tr});
    for(let key in constants.planetTableHeads) {
        const th = document.createElement("th");
        th.textContent = constants.planetTableHeads[key];
        appendElementToItsParent({parentElement: tr, childElement: th});
    }
    const tbody = document.createElement("tbody");
    appendElementToItsParent({parentElement: table, childElement: tbody});
    results.forEach(function (item){
        listItemsInTableRows(item, tbody);
    });
}

function listItemsInTableRows(item, tbody) {
    const tr = document.createElement("tr");
    appendElementToItsParent({parentElement: tbody, childElement: tr});
    for(let key in constants.planetTableHeads){
        const td = document.createElement("td");
        addData(key, item, td);
        appendElementToItsParent({parentElement: tr, childElement: td});
    }
}

function addData(key, item, td){
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

export { drawPagination, drawPlanetTable };