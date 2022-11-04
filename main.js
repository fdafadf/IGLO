// @ts-check

/**
 * @typedef {SeasonData[]} Data
 * @typedef {GroupData[]} SeasonData
 * @typedef {{ Placements: Placement[] }} GroupData
 * @typedef {{ Player: string, Position: number }} Placement
 */

/**
 * @returns {Promise<Data>}
 */
async function fetchData()
{
    let response = await fetch('data.json');
    let data = await response.json();
    return data;
}

/**
 * 
 * @param {Data} data 
 * @returns 
 */
function processData(data)
{
    /** @type {Map<string, Map<number, number>>} */
    let players = new Map();
    let season_number = 0;
    
    for (let season of data)
    {
        let position = 0;

        for (let group of season)
        {
            for (let placement of group.Placements)
            {
                /** @type {Map<number, number>} */
                let player_data;

                if (players.has(placement.Player))
                {
                    // @ts-ignore
                    player_data = players.get(placement.Player);
                }
                else
                {
                    players.set(placement.Player, player_data = new Map());
                }

                player_data.set(season_number, position);
                position++;
            }
        }

        season_number++;
    }

    return { players };
}

/**
 * @param {Map<number, number>} player_data
 * @param {number} seasons_count
 * @param {number} row_height
 * @param {number} row_width
 * @returns 
 */
function createPlayerShapes(player_data, seasons_count, row_height, row_width, margin_top, position_out)
{
    let shadow_path = new Path2D();
    let fill_paths = [];
    let name_positions = [];
    let x = 0;
    let previous_position = -1;
    let row_width_half = row_width / 2;
    let row_width_quarter = row_width / 4;
    
    for (let season_number = 0; season_number < seasons_count; season_number++)
    {
        let position = -1;
        
        if (player_data.has(season_number))
        {
            // @ts-ignore
            position = player_data.get(season_number);
        }
        else
        {
            position = previous_position == -1 ? -1 : position_out;
        }

        if (position != -1)
        {
            let y = position * row_height + margin_top;
            shadow_path.moveTo(x, y);
            shadow_path.lineTo(x + row_width_half, y);

            if (position != position_out)
            {
                let fill_path = new Path2D();
                fill_path.moveTo(x, y);
                fill_path.lineTo(x + row_width_half, y);
                fill_paths.push(fill_path);
            }
            
            if (previous_position != -1)
            {
                let y_0 = previous_position * row_height + margin_top;
                shadow_path.moveTo(x - row_width_half, y_0);
                shadow_path.bezierCurveTo(x - row_width_quarter, y_0, x - row_width_quarter, y, x, y);

                if (previous_position != position_out && position != position_out)
                {
                    let fill_path = new Path2D();
                    fill_path.moveTo(x - row_width_half, y_0);
                    fill_path.bezierCurveTo(x - row_width_quarter, y_0, x - row_width_quarter, y, x, y);
                    fill_paths.push(fill_path);
                }
            }

            if (position != position_out)
            {
                name_positions.push({ x, y });
            }

            previous_position = position;
        }
        
        x += row_width;
    }

    return { shadow_path, fill_paths, name_positions };
}

function drawPlayerShapes(context, [player_name, { shadow_path, fill_paths, name_positions, hue }], line_width)
{
    context.shadowColor = 'black';
    context.shadowBlur = 3;
    context.lineWidth = line_width;
    context.strokeStyle = `hsl(${hue}, 100%, 95%)`;
    context.stroke(shadow_path);
    context.shadowBlur = 0;
    context.strokeStyle = `hsl(${hue}, 100%, 85%)`;
    fill_paths.forEach(p => context.stroke(p));
    context.lineWidth = 2.5;
    context.strokeStyle = `hsl(${hue}, 50%, 50%)`;
    name_positions.forEach(({x, y}) => context.strokeText(player_name, x + 3, y + 3));
    context.fillStyle = `hsl(${hue}, 100%, 90%)`;
    name_positions.forEach(({x, y}) => context.fillText(player_name, x + 3, y + 3));
}

function drawSelectedPlayerShapes(context, [player_name, { shadow_path, fill_paths, name_positions, hue }], line_width)
{
    context.shadowColor = 'black';
    context.shadowBlur = 3;
    context.lineWidth = line_width;
    context.strokeStyle = `hsl(${hue}, 100%, 95%)`;
    context.stroke(shadow_path);
    context.shadowBlur = 0;
    context.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    fill_paths.forEach(p => context.stroke(p));
    context.lineWidth = 2.5;
    context.strokeStyle = `hsl(${hue}, 50%, 50%)`;
    name_positions.forEach(({x, y}) => context.strokeText(player_name, x + 3, y + 3));
    context.fillStyle = `hsl(${hue}, 100%, 90%)`;
    name_positions.forEach(({x, y}) => context.fillText(player_name, x + 3, y + 3));
}

async function onWindowLoad()
{
    let data = await fetchData();
    let { players } = processData(data);
    let seasons_count = data.length;
    //let players_count = players.size;
    let players_count = Math.max(...data.flatMap(s => s.map(g => g.Placements.length).reduce((a, b) => a + b, 0)))
    let margin_top = 50;
    let line_width = 10;
    let row_width = 200;
    let row_height = line_width + 10;
    let players_shapes = new Map();
    let hue = 0;
    let hue_step = Math.round(360 / (players_count + 1));
    let position_out = players_count + 2;

    for (let [player_name, player_data] of players)
    {
        let shapes = createPlayerShapes(player_data, seasons_count, row_height, row_width, margin_top, position_out);
        shapes.hue = hue;
        players_shapes.set(player_name, shapes);
        hue += hue_step;
    }

    let canvas = document.createElement('canvas');
    canvas.width = row_width * seasons_count;
    canvas.height = row_height * (players_count + 3) + margin_top;
    let context = canvas.getContext('2d');
    document.body.appendChild(canvas);
    let highlighted_x = 0;
    let highlighted_y = 0;
    let highlighted_player_name = null; //players_shapes.keys().next().value;
    let selected_player_names = new Set();
    // @ts-ignore
    let buffer_canvas = new OffscreenCanvas(canvas.width, canvas.height);
    /** @type {CanvasRenderingContext2D} */
    let buffer_context = buffer_canvas.getContext('2d');

    function drawCanvas()
    {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(buffer_canvas, 0, 0);

        if (highlighted_player_name)
        {
            drawSelectedPlayerShapes(context, [highlighted_player_name, players_shapes.get(highlighted_player_name)], line_width);
        }

        for (var player_name of selected_player_names.keys())
        {
            drawSelectedPlayerShapes(context, [player_name, players_shapes.get(player_name)], line_width);
        }
    }
    
    if (buffer_context)
    {
        for (let player_shapes of players_shapes)
        {
            drawPlayerShapes(buffer_context, player_shapes, line_width);
        }

        drawCanvas();
    }

    /**
     * @param {MouseEvent} e
     */
    function onCanvasMouseMove(e)
    {
        let current_player_name = null;

        if (e.clientY > margin_top)
        {
            let bounding_rect = canvas.getBoundingClientRect();
            let canvas_x = e.clientX - bounding_rect.left;
            let canvas_y = e.clientY - bounding_rect.top - margin_top + line_width;
            let current_x = Math.floor(canvas_x / row_width);
            let current_y = Math.floor(canvas_y / row_height);

            if (current_x != highlighted_x || current_y != highlighted_y)
            {
                for (let [player_name, player_data] of players)
                {
                    if (player_data.has(current_x) && player_data.get(current_x) == current_y)
                    {
                        current_player_name = player_name;
                        break;
                    }
                }
            }
        }

        if (highlighted_player_name != current_player_name)
        {
            highlighted_player_name = current_player_name;
            drawCanvas();
        }
    }
    
    function onCanvasClick(e)
    {
        if (highlighted_player_name)
        {
            if (selected_player_names.has(highlighted_player_name))
            {
                selected_player_names.delete(highlighted_player_name);
            }
            else
            {
                selected_player_names.add(highlighted_player_name);
            }

            drawCanvas();
        }
    }
    
    canvas.onmousemove = onCanvasMouseMove;
    canvas.onclick = onCanvasClick;
}

window.addEventListener('load', onWindowLoad);