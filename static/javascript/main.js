import { getData } from './request.js'
import { drawPagination, drawPlanetTable } from "./draw.js";

window.addEventListener("load", init);

async function init(){
    const response = await getData("https://swapi.dev/api/planets")
    drawPagination(response.next, response.previous);
    drawPlanetTable({className: "planet", results: response.results});
}

