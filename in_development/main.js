// @ts-check

import './js/types.js'
import { View } from "./js/View.js";

async function onWindowLoad()
{
    let iglo_data_request = await fetch('data/iglo.json');
    /** @type {RawIgloData} */
    let iglo_data = await iglo_data_request.json();

    let elo_data_request = await fetch('data/iglo_elo.json');
    /** @type {RawEloData} */
    let elo_data = await elo_data_request.json();

    let view = new View(elo_data, iglo_data);
}

window.addEventListener('load', onWindowLoad);