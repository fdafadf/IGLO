// @ts-check

import { RankingChartCanvas } from "./RankingChartCanvas.js";
import { RankingChartData } from "./RankingChartData.js";
import { RankingChartCanvasSettings } from "./RankingChartCanvasSettings.js";

export class RankingChart
{
    /**
     * @param {RankingChartData} data
     * @param {RankingChartCanvasSettings} settings
     */
    constructor(data, settings)
    {
        this.data = data;
        this._highlighted_x = 0;
        this._highlighted_y = 0;
        this._highlighted_player_name = null;
        this._selected_player_names = new Set();
        this.canvas = new RankingChartCanvas(RankingChartCanvas.createCanvasElement(settings, data.seasons_count, data.max_players_in_season), settings);
        this._players_shapes = this.canvas.createPlayersShapes(data);
        // @ts-ignore
        this.canvas_buffer = new RankingChartCanvas(new OffscreenCanvas(this.canvas.element.width, this.canvas.element.height), settings);
        this.canvas_buffer.drawPlayers(this._players_shapes);
        this.canvas_buffer.drawGroupNames(data.groups);
        this.canvas.element.onmousemove = this._onCanvasMouseMove.bind(this);
        this.canvas.element.onclick = this._onCanvasClick.bind(this);
        this.draw();
    }

    draw()
    {
        this.canvas.context.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);
        this.canvas.context.drawImage(this.canvas_buffer.element, 0, 0);

        if (this._highlighted_player_name)
        {
            let player_shapes = this._players_shapes.get(this._highlighted_player_name);

            if (player_shapes)
            {
                this.canvas.drawHighlightedPlayer(this._highlighted_player_name, player_shapes);   
            }
        }

        for (var player_name of this._selected_player_names.keys())
        {
            let player_shapes = this._players_shapes.get(player_name);

            if (player_shapes)
            {
                this.canvas.drawHighlightedPlayer(player_name, player_shapes);
            }
        }
    }
    
    /**
     * @param {MouseEvent} e
     */
    _onCanvasMouseMove(e)
    {
        if (navigator.maxTouchPoints)
        {
        }
        else
        {
            let current_player_name = null;
    
            if (e.clientY > this.canvas.settings.margin_top)
            {
                let cell = this._getCellCoordinates(e);
    
                if (cell.x != this._highlighted_x || cell.y != this._highlighted_y)
                {
                    current_player_name = this._getCellPlayer(cell);
                    this._highlighted_x = cell.x;
                    this._highlighted_y = cell.y;
                }
                else
                {
                    current_player_name = this._highlighted_player_name;
                }
            }
    
            if (this._highlighted_player_name != current_player_name)
            {
                this._highlighted_player_name = current_player_name;
                this.draw();
            }
        }
    }

    /**
     * @param {MouseEvent} e
     */
    _onCanvasClick(e)
    {
        let selected_player_name;

        if (navigator.maxTouchPoints)
        {
            let cell = this._getCellCoordinates(e);
            selected_player_name = this._getCellPlayer(cell);
        }
        else
        {
            selected_player_name = this._highlighted_player_name;
        }

        if (selected_player_name)
        {
            if (this._selected_player_names.has(selected_player_name))
            {
                this._selected_player_names.delete(selected_player_name);
            }
            else
            {
                this._selected_player_names.add(selected_player_name);
            }

            this.draw();
        }
    }

    /**
     * @param {MouseEvent} e
     */
    _getCellCoordinates(e)
    {
        let bounding_rect = this.canvas.element.getBoundingClientRect();
        let canvas_x = e.clientX - bounding_rect.left;
        let canvas_y = e.clientY - bounding_rect.top - this.canvas.settings.margin_top + this.canvas.settings.line_width;
        return this.canvas.getCellCoordinates(canvas_x, canvas_y);
    }
    
    _getCellPlayer({ x, y })
    {
        for (let [player_name, player_data] of this.data.players)
        {
            if (player_data.has(x) && player_data.get(x) == y)
            {
                return player_name;
            }
        }
    }
}
