import { getData } from './requests.js'
import { drawPagination, drawSpreadSheet } from "./draw.js";

window.addEventListener("load", init);

async function init(){
    const response = await getData("https://swapi.dev/api/planets")
    drawPagination(response.next, response.previous);
    drawSpreadSheet(response.results);
}

