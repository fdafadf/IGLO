// @ts-check

import { shuffle } from "./Common.js";

/**
 * @typedef {{ shadow_path: Path2D, fill_paths: Path2D[], name_positions: { x, y }[], hue: number }} PlayerShapes
 */

export class RankingChartData
{
    /**
     * @param {Map<string, Map<number, number>>} players 
     * @param {Array<Array<number>>} groups 
     */
    constructor(players, groups, seasons_count, max_players_in_season)
    {
        this.players = players;
        this.groups = groups;
        this.seasons_count = seasons_count;
        this.max_players_in_season = max_players_in_season;
        this.position_out = max_players_in_season + 2;
    }
}
