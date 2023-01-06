// @ts-check

export class SelectGroupControl
{
    /**
     * 
     * @param {RawIgloData} data 
     */
    constructor(data)
    {
        this.groupSelected = group => {};
        this.select_season_element = document.createElement('select');
        this.select_group_element = document.createElement('select');
        this.seasons_by_number = new Map();
        
        for (let i = 0; i < data.p1s.length; i++)
        {
            let season_number = data.seasons[i];
            let group_name = data.groups[i];
            let player_a = data.players[data.p1s[i]];
            let player_b = data.players[data.p2s[i]];
            let season;

            if (this.seasons_by_number.has(season_number))
            {
                season = this.seasons_by_number.get(season_number);
            }
            else
            {
                this.seasons_by_number.set(season_number, season = { number: season_number, group_by_number: new Map() });
            }
            
            let group;

            if (season.group_by_number.has(group_name))
            {
                group = season.group_by_number.get(group_name);
            }
            else
            {
                season.group_by_number.set(group_name, group = { name: group_name, players: new Set() });
            }

            group.players.add(player_a);
            group.players.add(player_b);
        }

        // this.season_numbers = [...this.seasons_by_number.keys()];
        // this.season_numbers.sort();
        // this.select_season_element.appendChild(document.createElement('option'));

        // for (let season_number of this.season_numbers)
        // {
        //     let option_element = document.createElement('option');
        //     option_element['season'] = this.seasons_by_number.get(season_number);
        //     option_element.textContent = season_number;
        //     this.select_season_element.appendChild(option_element);
        // }

        SelectGroupControl._createSelectOptions(this.select_season_element, this.seasons_by_number);
        this.select_season_element.onchange = this._onSeasonChanged.bind(this);
        this.select_group_element.onchange = this._onGroupChanged.bind(this);
    }

    _onSeasonChanged()
    {
        if (this.select_season_element.selectedIndex)
        {
            let season = this.select_season_element.selectedOptions[0]['map_value'];
            SelectGroupControl._createSelectOptions(this.select_group_element, season.group_by_number);
        }
    }

    _onGroupChanged()
    {
        let group = this.select_group_element.selectedIndex ? this.select_group_element.selectedOptions[0]['map_value'] : null;
        this.groupSelected(group);
    }

    /**
     * @param {HTMLSelectElement} select_element 
     * @param {Map} map 
     */
    static _createSelectOptions(select_element, map)
    {
        select_element.replaceChildren();
        select_element.appendChild(document.createElement('option'));
        let keys = [...map.keys()];
        keys.sort();

        for (let key of keys)
        {
            let option_element = document.createElement('option');
            option_element['map_value'] = map.get(key);
            option_element.textContent = key;
            select_element.appendChild(option_element);
        }
    }
}

