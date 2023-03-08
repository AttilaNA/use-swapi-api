import { getData } from './request.js'
import { drawPagination, drawPlanetTable } from "./drawer.js";

window.addEventListener("load", init);

async function init(){
    const response = await getData("https://swapi.dev/api/planets")
    drawPagination({urlNext: response.next, urlPrevious: response.previous});
    drawPlanetTable({className: "planet", results: response.results});
}

