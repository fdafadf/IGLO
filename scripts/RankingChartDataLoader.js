// @ts-check

import { IgloClient } from "./IgloClient.js";
import { RankingChartData } from "./RankingChartData.js";

/**
 * 
 * @typedef {SeasonData[]} LeagueData
 * @typedef {GroupData[]} SeasonData
 * @typedef {{ Placements: Placement[] }} GroupData
 * @typedef {{ Player: string, Position: number }} Placement
 */

export class RankingChartDataLoader
{
    /**
     * @returns {Promise<RankingChartData>}
     */
    async load()
    {
        let response = await fetch('data/iglo.json');
        /** @type{LeagueData} */
        let league_data = await response.json();

        /** @type {Map<string, Map<number, number>>} */
        let players = new Map();
        /** @type {Array<Array<number>>} */
        let groups = [];
        let client = new IgloClient();
        let seasons = await client.getSeasons();
        let last_finished_season = Math.max.apply(Math, seasons.filter(s => s.state == "finished").map(s => s.number));

        for (let season_number = 0; season_number < last_finished_season; season_number++)
        {
            /** @type {SeasonData} */
            let season;

            if (season_number < league_data.length)
            {
                season = league_data[season_number];
            }
            else
            {
                season = [];

                for (let group of await client.getGroups(season_number + 1))
                {
                    let members = await client.getGroupMembers(season_number + 1, group.name);
                    members.sort((a, b) => a.final_order - b.final_order);
                    season.push({ Placements: members.map((m, i) => ({ Player: m.player, Position: i })) });
                }
            }

            let position = -1;
            let season_groups = [];
    
            for (let group of season)
            {
                season_groups.push(position);
                position++;
    
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
    
            groups.push(season_groups);
        }

        let seasons_count = last_finished_season;
        let max_players_in_season = Math.max(...league_data.flatMap(s => s.map(g => g.Placements.length).reduce((a, b) => a + b, 0))) + Math.max(...groups.map(s => s.length));
        return new RankingChartData(players, groups, seasons_count, max_players_in_season);
    }
}