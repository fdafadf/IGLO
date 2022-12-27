// @ts-check

import { shuffle } from "./Common.js";
import { RankingChartCanvasSettings } from "./RankingChartCanvasSettings.js";
import { RankingChartData } from "./RankingChartData.js";

export class RankingChartCanvas
{
    static createCanvasElement(settings, seasons_count, max_players_in_season)
    {
        let element = document.createElement('canvas');
        element.width = settings.row_width * seasons_count;
        element.height = settings.row_height * (max_players_in_season + 3) + settings.margin_top;
        return element;
    }

    /**
     * @param {HTMLCanvasElement} element
     * @param {RankingChartCanvasSettings} settings 
     */
    constructor(element, settings)
    {
        this.settings = settings
        this.element = element;
        /** @type{CanvasRenderingContext2D} */
        // @ts-ignore
        this.context = element.getContext('2d');
        this.context.font = settings.group_name_font;
        let group_name_font_metrics = this.context.measureText("A");
        this.group_name_font_height = group_name_font_metrics.actualBoundingBoxAscent + group_name_font_metrics.actualBoundingBoxDescent;
        this.first_row_y = this.group_name_font_height + this.settings.line_width + 6;
    }

    drawPlayers(players_shapes)
    {
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, this.element.width, this.element.height);
        this.context.font = this.settings.user_name_font;

        for (let player_shapes of players_shapes)
        {
            this._drawPlayerShapes(this.context, player_shapes, this.settings.line_width);
        }
    }
    
    /**
     * @param {import("./RankingChartData.js").PlayerShapes} player_shapes
     */
    drawHighlightedPlayer(player_name, player_shapes)
    {
        this._drawHighlightedPlayerShapes(this.context, player_name, player_shapes, this.settings.line_width);
    }

    drawGroupNames(groups)
    {   
        let context = this.context;
        let x = 0;
        context.fillStyle = '#ddd';
        context.strokeStyle = '#333';
        context.font = this.settings.group_name_font;
        context.lineWidth = 0.5;
        context.shadowBlur = 0;
        
        for (let season_groups of groups)
        {
            let group_code = 65;

            for (let position of season_groups)
            {
                context.fillText(String.fromCharCode(group_code), x + this.settings.row_width / 4, this.getY(position) + 8);
                //context.strokeText(String.fromCharCode(group_code), x + this.settings.row_width / 4, this.getY(position) + 6);
                group_code++
            }
            
            x += this.settings.row_width;
        }
    }
    
    /**
     * @param {RankingChartData} data
     * @returns {Map<string, import("./RankingChartData.js").PlayerShapes>}
     */
    createPlayersShapes(data)
    {
        let players_shapes = new Map();

        for (let [player_name, player_data] of data.players)
        {
            let shapes = this.createPlayerShapes(data, player_data);
            players_shapes.set(player_name, shapes);
        }
        
        let hue = 0;
        let hue_step = Math.round(360 / (data.max_players_in_season + 1));
        let hues = [];

        for (let i = 0; i < data.players.size; i++)
        {
            hues.push(hue);
            hue += hue_step;
        }

        shuffle(hues);

        let hue_index = 0;

        for (let [_, player_shapes] of players_shapes)
        {
            player_shapes.hue = hues[hue_index++];
        }

        return players_shapes;
    }
    
    /**
     * @param {RankingChartData} data
     * @param {Map<number, number>} player_data
     * @returns {import("./RankingChartData.js").PlayerShapes}
     */
    createPlayerShapes(data, player_data)
    {
        let shadow_path = new Path2D();
        let fill_paths = [];
        let name_positions = [];
        let x = 0;
        let previous_position = -1;
        let row_width_half = this.settings.row_width / 2;
        let row_width_quarter = this.settings.row_width / 4;
        
        for (let season_number = 0; season_number < data.seasons_count; season_number++)
        {
            let position = -1;
            
            if (player_data.has(season_number))
            {
                // @ts-ignore
                position = player_data.get(season_number);
            }
            else
            {
                position = previous_position == -1 ? -1 : data.position_out;
            }
    
            if (position != -1)
            {
                let y = this.getY(position);
                shadow_path.moveTo(x, y);
                shadow_path.lineTo(x + row_width_half, y);
    
                if (position != data.position_out)
                {
                    let fill_path = new Path2D();
                    fill_path.moveTo(x, y);
                    fill_path.lineTo(x + row_width_half, y);
                    fill_paths.push(fill_path);
                }
                
                if (previous_position != -1)
                {
                    let y_0 = this.getY(previous_position);
                    shadow_path.moveTo(x - row_width_half, y_0);
                    shadow_path.bezierCurveTo(x - row_width_quarter, y_0, x - row_width_quarter, y, x, y);
    
                    if (previous_position != data.position_out && position != data.position_out)
                    {
                        let fill_path = new Path2D();
                        fill_path.moveTo(x - row_width_half, y_0);
                        fill_path.bezierCurveTo(x - row_width_quarter, y_0, x - row_width_quarter, y, x, y);
                        fill_paths.push(fill_path);
                    }
                }
    
                if (position != data.position_out)
                {
                    name_positions.push({ x, y });
                }
    
                previous_position = position;
            }
            
            x += this.settings.row_width;
        }
    
        return { shadow_path, fill_paths, name_positions, hue: 0 };
    }
    
    getCellCoordinates(canvas_x, canvas_y)
    {
        let x = Math.floor(canvas_x / this.settings.row_width);
        let y = Math.floor((canvas_y - this.first_row_y) / this.settings.row_height);
        return { x, y };
    }

    getY(position)
    {
        return position * this.settings.row_height + this.settings.margin_top + this.first_row_y;
    }
    
    _drawPlayerShapes(context, [player_name, { shadow_path, fill_paths, name_positions, hue }], line_width)
    {
        context.shadowColor = 'black';
        context.shadowBlur = 3;
        context.lineWidth = line_width;
        context.strokeStyle = `hsl(${hue}, 100%, 95%)`;
        //context.stroke(shadow_path);
        context.shadowBlur = 0;
        context.strokeStyle = `hsl(${hue}, 100%, 90%)`;
        fill_paths.forEach(p => context.stroke(p));
        context.lineWidth = 2.5;
        context.strokeStyle = `hsl(${hue}, 50%, 60%)`;
        name_positions.forEach(({x, y}) => context.strokeText(player_name, x + 3, y + 3));
        context.fillStyle = `hsl(${hue}, 100%, 90%)`;
        name_positions.forEach(({x, y}) => context.fillText(player_name, x + 3, y + 3));
    }
    
    _drawHighlightedPlayerShapes(context, player_name, { shadow_path, fill_paths, name_positions, hue }, line_width)
    {
        context.shadowColor = 'black';
        context.shadowBlur = 3;
        context.lineWidth = line_width;
        context.strokeStyle = `hsl(${hue}, 100%, 95%)`;
        //context.stroke(shadow_path);
        fill_paths.forEach(p => context.stroke(p));
        context.shadowBlur = 0;
        context.strokeStyle = `hsl(${hue}, 100%, 50%)`;
        fill_paths.forEach(p => context.stroke(p));
        context.lineWidth = 2.5;
        context.strokeStyle = `hsl(${hue}, 50%, 50%)`;
        name_positions.forEach(({x, y}) => context.strokeText(player_name, x + 3, y + 3));
        context.fillStyle = `hsl(${hue}, 100%, 90%)`;
        name_positions.forEach(({x, y}) => context.fillText(player_name, x + 3, y + 3));
    }
}