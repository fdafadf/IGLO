// @ts-check

import { PlayerListControl } from "./js/PlayerListControl.js";
import { SelectGroupControl } from "./js/SelectGroupControl.js";
import { Svg } from "./js/Svg.js";
import { SvgPathBuilder } from "./js/SvgPathBuilder.js";

async function onWindowLoad()
{
    let iglo_data_request = await fetch('/in_development/data/iglo.json');
    /** @type {RawIgloData} */
    let iglo_data = await iglo_data_request.json();

    //let season_number_max = Math.max.apply(Math, iglo_data.seasons);
    let select_group_control = new SelectGroupControl(iglo_data);

    let elo_data_request = await fetch('/in_development/data/iglo_elo.json');
    /** @type {RawEloData} */
    let elo_data = await elo_data_request.json();
    let elo_svg = new Svg();

    let margin = 10;
    let width = elo_svg.element.width.baseVal.value;
    let height = elo_svg.element.height.baseVal.value;
    let width_delta = width / 20;
    let elo_min = Math.min.apply(Math, elo_data.elos.map(v => Math.min.apply(Math, v)));
    let elo_max = Math.max.apply(Math, elo_data.elos.map(v => Math.max.apply(Math, v)));
    let elo_range = elo_max - elo_min;

    let player_list_control = new PlayerListControl();
    let player_list_container = document.getElementById('player-list-container');
    let players_chart_element = document.getElementById('players-chart');
    let select_group_container = document.getElementById('select-group-container');

    function createPlayerColors(i)
    {
        let line_color_off = `hsl(${(360 / elo_data.players.length) * i}, 100%, 50%, 10%)`;
        let line_color_on = `hsl(${(360 / elo_data.players.length) * i}, 100%, 50%, 100%)`;
        let color_on = 'black';
        let color_off = line_color_on;
        return { color_on, color_off, line_color_on, line_color_off };
    }

    let calculateY = v => (((height - margin * 2) / elo_range) * (v - elo_min)) + margin;

    for (let i = 0; i < elo_data.players.length; i++)
    {
        let name = elo_data.players[i];
        let colors = createPlayerColors(i);
        let points = elo_data.elos[i].map((v, i) => [i * width_delta, calculateY(v)]);
        let path = elo_svg.addLine(points);
        let text = elo_svg.addText(10, points[0][1], name);

        player_list_control.add(name, colors, path, text);
        //let player = new Player(name, colors, path);
    }

    players_chart_element?.appendChild(elo_svg.element);
    select_group_container?.appendChild(select_group_control.select_season_element);
    select_group_container?.appendChild(select_group_control.select_group_element);
    player_list_container?.appendChild(player_list_control.element);

    select_group_control.groupSelected = group =>
    {
        /**
         * @param {HTMLInputElement} checkbox 
         * @param {boolean} checked 
         */
        function setCheckboxChecked(checkbox, checked)
        {
            checkbox.checked = checked;
            checkbox.dispatchEvent(new Event('change', { bubbles: false, cancelable: true }));
        }

        
        player_list_control.element?.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => setCheckboxChecked(checkbox, false));

        if (group)
        {
            for (let player_name of group.players.values())
            {
                setCheckboxChecked(player_list_control.items.get(player_name).checkbox_element, true);
            }
        }

    }
}

window.addEventListener('load', onWindowLoad);