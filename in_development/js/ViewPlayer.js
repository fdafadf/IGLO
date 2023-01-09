// @ts-check

import { PlayerListControlItem } from "./PlayerListControlItem.js";

export class ViewPlayer
{
    /**
     * @param {string} name 
     * @param {PlayerListControlItem} list_item 
     * @param {{ full_width: Series, attended: Series }} series 
     */
    constructor(name, list_item, series)
    {
        this.name = name;
        // this.colors = { path_color: 'white', selected_path_color: 'red' };
        this.list_item = list_item;
        this.series = series;
        this._selected = false;
    }

    set selected(value)
    {
        if (this._selected != value)
        {
            this._selected = value;
            this.updatePathColors();
        }
    }

    selectSeries(series_name)
    {
        for (let [name, series] of Object.entries(this.series))
        {
            if (series_name == name)
            {
                if (series.selected == false)
                {
                    series.selected = true;
                    this._updateSeriesPathColors(series)
                }
            }
            else
            {
                if (series.selected == true)
                {
                    series.selected = false;
                    this._updateSeriesPathColors(series)
                }
            }
        }
    }
    
    updateColors(color, selected_color, hidden_color, selected_label_color)
    {
        for (let [_, series] of Object.entries(this.series))
        {
            series.color = color;
            series.selected_color = selected_color;
            series.hidden_color = hidden_color;
            series.selected_label_color = selected_label_color;
        }
    }

    updatePathColors()
    {
        for (let [_, series] of Object.entries(this.series))
        {
            this._updateSeriesPathColors(series);
        }
    }
    
    /**
     * @param {Series} series 
     */
    _updateSeriesPathColors(series)
    {
        if (series.selected)
        {
            if (this._selected)
            {
                series.path.setAttribute('stroke', series.selected_color);
                series.path.style.filter = `drop-shadow(0px 0px 2px ${series.selected_color}) drop-shadow(black 0px 0px 4px)`;
                series.label.setAttribute('fill', series.selected_label_color);
            }
            else
            {
                series.path.setAttribute('stroke', series.color);
                series.path.style.filter = '';
                series.label.setAttribute('fill', series.hidden_color);
            }
        }
        else
        {
            series.path.setAttribute('stroke', series.hidden_color);
            series.path.style.filter = '';
            series.label.setAttribute('fill', series.hidden_color);
        }
    }
}
