import {deleteLastTwoChildElements} from "./delete.js";
import {getData} from "./request.js";
import {
    appendElementsToTheirParent,
    appendElementToItsParent,
    getButtonElementWithClassName,
    getTableElementWithClassName,
    reBuildPaginationAndPlanetTable,
    getModalElementWithIdName
} from "./builder.js";

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

function drawPagination({urlNext, urlPrevious}){
    let previousButton = getButtonElementWithClassName({className: "previous", content: "Previous"});
    let nextButton = getButtonElementWithClassName({className: "next", content: "Next"});
    if(urlPrevious === null){
        previousButton.classList.add("disabled");
        previousButton.disabled = true;
    } else {
        previousButton.addEventListener("click", () => reBuildPaginationAndPlanetTable({url: urlPrevious}));
    }
    if(urlNext === null){
        nextButton.classList.add("disabled");
        nextButton.disabled = true;
    } else {
        nextButton.addEventListener("click", () => reBuildPaginationAndPlanetTable({url: urlNext}));
    }
    appendElementsToTheirParent({parentElement: document.getElementById("pagination"), childElements: [previousButton, nextButton]})
}

function drawPlanetTable({className, results}){
    const {table, theadRow, tbody} = getTableElementWithClassName({className: className});
    appendElementToItsParent({parentElement: document.getElementById("table"), childElement: table});
    for(let key in constants.planetTableHeads) {
        const th = document.createElement("th");
        th.textContent = constants.planetTableHeads[key];
        appendElementToItsParent({parentElement: theadRow, childElement: th});
    }
    results.forEach(function (planet){
        fillPlanetDataInTableRows({planet: planet, tbody: tbody});
    });
}

function fillPlanetDataInTableRows({planet, tbody}) {
    const tr = document.createElement("tr");
    appendElementToItsParent({parentElement: tbody, childElement: tr});
    for(let key in constants.planetTableHeads){
        const td = document.createElement("td");
        addPlanetData({key: key, planet: planet, td: td});
        appendElementToItsParent({parentElement: tr, childElement: td});
    }
}

function fillResidentDataInTableRows({resident, tbody}) {
    const tr = document.createElement("tr");
    appendElementToItsParent({parentElement: tbody, childElement: tr});
    for(let key in constants.residentTableHeads){
        const td = document.createElement("td");
        addResidentData({key: key, resident: resident, td: td});
        appendElementToItsParent({parentElement: tr, childElement: td});
    }
}

function addPlanetData({key: key, planet: planet, td: td}){
    switch (key) {
        case "0":
            td.textContent = planet.name;
            break;
        case "1":
            td.textContent = (parseFloat(planet.diameter)/1000).toFixed(3);
            break;
        case "2":
            td.textContent = planet.climate;
            break;
        case "3":
            td.textContent = planet.terrain;
            break;
        case "4":
            td.textContent = planet.surface_water !== "unknown" ? `${planet.surface_water}%` : "unknown";
            break;
        case "5":
            td.textContent = planet.population !== "unknown" ? `${parseInt(planet.population).toLocaleString()} people` : "unknown";
            break;
        case "6":
            if(planet.residents.length !== 0){
                const button = getButtonElementWithClassName({className: "residents", content: `${planet.residents.length} resident(s)`})
                button.addEventListener("click", () => drawModalWithResidents({planetName: planet.name, listOfResidents: planet.residents}));
                appendElementToItsParent({parentElement: td, childElement: button});
            } else {
                td.textContent = "No known residents";
            }
            break;
        case "7":
            const button = getButtonElementWithClassName({className: "vote", content: "Vote"})
            appendElementToItsParent({parentElement: td, childElement: button});
            break;
    }
}

function addResidentData({key, resident, td}){
    switch (key) {
        case "0":
            td.textContent = resident.name;
            break;
        case "1":
            td.textContent = resident.height !== "unknown" ? `${resident.height} m` : resident.height;
            break;
        case "2":
            td.textContent = resident.mass !== "unknown" ? `${resident.mass} Kg` : resident.mass;
            break;
        case "3":
            td.textContent = resident.hair_color;
            break;
        case "4":
            td.textContent = resident.skin_color;
            break;
        case "5":
            td.textContent = resident.eye_color;
            break;
        case "6":
            td.textContent = resident.birth_year;
            break;
        case "7":
            td.textContent = resident.gender;
            break;
    }
}

function drawModalWithResidents({planetName, listOfResidents}) {
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    const {modal, modalBody} = drawModalStructure({planetName: planetName});
    const body = document.querySelector("body");
    appendElementToItsParent({parentElement: body, childElement: overlay});
    appendElementToItsParent({parentElement: body, childElement: modal});
    drawResidentTable({modalBody: modalBody, listOfResidents: listOfResidents});
}

function drawModalStructure({planetName}){
    const {modal, modalBody, modalCloseX, modalCloseText} = getModalElementWithIdName({className: "modal", planetName: planetName});
    modalCloseX.addEventListener("click", () => closeModal());
    modalCloseText.addEventListener("click", () => closeModal());
    return {modal: modal, modalBody: modalBody};
}

function drawResidentTable({modalBody, listOfResidents}){
    const {table, theadRow, tbody} = getTableElementWithClassName({className: "resident"});
    appendElementToItsParent({parentElement: modalBody, childElement: table})
    for(let key in constants.residentTableHeads) {
        const th = document.createElement("th");
        th.textContent = constants.residentTableHeads[key];
        appendElementToItsParent({parentElement: theadRow, childElement: th});
    }
    listOfResidents.forEach(async function (resident){
        const response = await getData(resident);
        fillResidentDataInTableRows({resident: response, tbody: tbody});
    });
}

function closeModal(){
    const body = document.querySelector("body");
    deleteLastTwoChildElements({parentElement: body});
}

export { drawPagination, drawPlanetTable };