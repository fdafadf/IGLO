// @ts-check

import { setCheckboxChecked, shuffle } from "./functions.js";
import { PlayerListControl } from "./PlayerListControl.js";
import { PlayerListControlItem } from "./PlayerListControlItem.js";
import { SelectControl } from "./SelectControl.js";
import { SelectGroupControl } from "./SelectGroupControl.js";
import { Svg } from "./Svg.js";
import { SvgPathBuilder } from "./SvgPathBuilder.js";
import { ViewPlayer } from "./ViewPlayer.js";

export class View
{
    /**
     * @param {RawEloData} elo_data 
     * @param {RawIgloData} iglo_data 
     */
    constructor(elo_data, iglo_data)
    {
        let player_list_container = document.getElementById('player-list-container');
        let players_chart_element = document.getElementById('players-chart');
        let select_group_container = document.getElementById('select-group-container');
        let color_settings_container = document.getElementById('settings-colors-container');

        this.elo_data = elo_data;
        this.iglo_data = iglo_data;
        this.svg = new Svg();
        /** @type {SelectControl<() => void>} */
        this.color_settings_control = this._createColorSettingsControl();
        /** @type {SelectControl<() => void>} */
        this.width_settings_control = this._createWidthSettingsControl();
        /** @type {SelectGroupControl} */
        this.select_group_control = this._createSelectGroupControl();
        /** @type {PlayerListControl} */
        this.player_list_control = this._createPlayerListControl();

        /** @type {Map<string, ViewPlayer>} */
        this.players = new Map();

        let svg_info = this._getSvgInfo();
        
        for (let i = 0; i < elo_data.players.length; i++)
        {
            this.players.set(elo_data.players[i], this._createViewPlayer(i, svg_info));
        }

        color_settings_container?.appendChild(this.color_settings_control.element);
        color_settings_container?.appendChild(this.width_settings_control.element);
        select_group_container?.appendChild(this.select_group_control.select_season_element);
        select_group_container?.appendChild(this.select_group_control.select_group_element);
        player_list_container?.appendChild(this.player_list_control.element);
        players_chart_element?.appendChild(this.svg.element);
        
        this.color_settings_control._onSelectionChanged();
        this.width_settings_control._onSelectionChanged();

        let selected_players = new URLSearchParams(window.location.search).get('selected-players')

        if (selected_players)
        {
            setTimeout(() =>
            {
                for (let player_name of selected_players.split(','))
                {
                    let checkbox = this.player_list_control.items.get(player_name).checkbox_element;
                    setCheckboxChecked(checkbox, true);
                }
            }, 2100)
        }
    }

    /**
     * @param {number} i 
     * @param {*} svg_info 
     * @returns {ViewPlayer}
     */
    _createViewPlayer(i, svg_info)
    {
        let name = this.elo_data.players[i];
        let list_item = new PlayerListControlItem(name);
        list_item.onSelectionChanged = item => this._applySeriesColorsForPlayer(this.players.get(item.name));
        this.player_list_control.add(list_item);
        /** @type [number, number][] */
        let points = this.elo_data.elos[i].map((v, i) => [i * svg_info.x_delta, svg_info.calculateY(v)]);
        let full_width_path = this.svg.addLine(points.map(p => [p[0], points[0][1]]));

        let to = new SvgPathBuilder().buildPathNodes(points).join(' ');
        let animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('dur', '2s');
        animate.setAttribute('to', to);
        animate.setAttribute('attributeName', 'd');
        animate.setAttribute('fill', 'freeze');
        full_width_path.appendChild(animate);

        let full_width_text = this.svg.addText(points[0][0] + 3, points[0][1] + 5, name);
        let full_width = { path: full_width_path, label: full_width_text, color: 'gray', selected_color: 'white', hidden_color: 'black', selected_label_color: 'yellow', selected: false };
        points = points.slice(this.elo_data.first_season[i] - 1, this.elo_data.last_season[i] + 1);
        let attended_path = this.svg.addLine(points);
        let attended_text = this.svg.addText(points[0][0] + 3, points[0][1] + 5, name);
        let attended = { path: attended_path, label: attended_text, color: 'gray', selected_color: 'white', hidden_color: 'black', selected_label_color: 'yellow', selected: true };
        return new ViewPlayer(name, list_item, { full_width, attended });
    }

    _createColorSettingsControl()
    {
        let control = new SelectControl();
        control._add('Linear', () => this._applyHueColors());
        control._add('Random', () => this._applyHueColors(true));
        control.onSelectionChanged = color_function => color_function();
        return control;
    }

    _createWidthSettingsControl()
    {
        /** @type {SelectControl<() => void>} */
        let control = new SelectControl();
        control._add('Attended', () => this.players.forEach(p => p.selectSeries('attended')));
        control._add('Full', () => this.players.forEach(p => p.selectSeries('full_width')));
        control.onSelectionChanged = width_function => width_function();
        return control;
    }

    _createSelectGroupControl()
    {
        let control = new SelectGroupControl(this.iglo_data);
        control.onSelectionChanged = this._onGroupSelectionChanged.bind(this);
        return control;
    }

    _createPlayerListControl()
    {
        return new PlayerListControl();
    }

    /**
     * @param {ViewPlayer | undefined} player 
     */
    _applySeriesColorsForPlayer(player)
    {
        if (player)
        {
            player.selected = player.list_item.checkbox_element.checked;
        }
    }

    _onGroupSelectionChanged(group)
    {
        // @ts-ignore
        this.player_list_control.element?.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => setCheckboxChecked(checkbox, false));

        if (group)
        {
            for (let player_name of group.players.values())
            {
                let checkbox = this.player_list_control.items.get(player_name).checkbox_element;
                setCheckboxChecked(checkbox, true);
            }
        }
    }

    _getSvgInfo()
    {
        let margin = 10;
        let width = this.svg.element.viewBox.baseVal.width;
        let height = this.svg.element.viewBox.baseVal.height;
        let x_delta = (width - margin * 2) / Math.max.apply(Math, this.elo_data.last_season);
        let elo_min = Math.min.apply(Math, this.elo_data.elos.map(v => Math.min.apply(Math, v)));
        let elo_max = Math.max.apply(Math, this.elo_data.elos.map(v => Math.max.apply(Math, v)));
        let elo_range = elo_max - elo_min;
        let calculateY = v => height - (((height - margin * 2) / elo_range) * (v - elo_min)) - margin;
        return { x_delta, calculateY, height, height_half: height / 2 };
    }

    _applyHueColors(random)
    {
        let n = this.elo_data.players.length;
        let indexes = [...new Array(n).keys()]

        if (random)
        {
            shuffle(indexes);
        }

        for (let i = 0; i < n; i++)
        {
            let player = this.players.get(this.elo_data.players[indexes[i]]);

            if (player)
            {
                let hue = Math.round((360 / n) * i);
                player.list_item.color = `hsl(${hue}, 100%, 50%, 100%)`;
                player.list_item.background_color = `hsl(${hue}, 100%, 50%, 10%)`;
                player.list_item.color_selected = `hsl(${hue}, 100%, 10%, 100%)`;
                player.list_item.background_color_selected = `hsl(${hue}, 100%, 50%, 100%)`;
                player.updateColors(`hsl(${hue}, 100%, 50%, 5%)`, `hsl(${hue}, 100%, 50%, 100%)`, `hsl(${hue}, 100%, 50%, 0%)`, `hsl(${hue}, 100%, 80%, 100%)`);
                player.updatePathColors();
                player.list_item._updateColors();
                this._applySeriesColorsForPlayer(player);
            }
        }
    }
}
