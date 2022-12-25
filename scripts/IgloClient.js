// @ts-check

/**
 * @typedef {{ number: number, state: string }} Season
 * @typedef {{ name: string, type: string }} Group
 * @typedef {{ id: number, player: string, order: number, final_order: number }} GroupMember
 */

export class IgloClient
{
    host = 'iglo.szalenisamuraje.org';

    /**
     * @returns {Promise<Season[]>}
     */
    async getSeasons()
    {
        return await this._downloadPage(`https://${this.host}/api/seasons?format=json`);
    }

    /**
     * @returns {Promise<Season>}
     */
    async getSeason(number)
    {
        return await this._downloadPage(`https://${this.host}/api/seasons/${number}?format=json`);
    }

    /**
     * @returns {Promise<Group[]>}
     */
    async getGroups(season_number)
    {
        return await this._downloadPage(`https://${this.host}/api/seasons/${season_number}/groups?format=json`);
    }

    /**
     * @returns {Promise<GroupMember[]>}
     */
    async getGroupMembers(season_number, group_name)
    {
        return await this._downloadPage(`https://${this.host}/api/seasons/${season_number}/groups/${group_name}/members?format=json`);
    }

    async _downloadPage(url)
    {
        if (IGLO_CLIENT_STATIC_DATA.hasOwnProperty(url))
        {
            return JSON.parse(IGLO_CLIENT_STATIC_DATA[url]).results;
        }
        
        let response = await fetch('https://api.allorigins.win/raw?url=' + url);
        let page_data = await response.json();
        return page_data.results;
    }
}

const IGLO_CLIENT_STATIC_DATA = {
    'https://iglo.szalenisamuraje.org/api/seasons?format=json': '{"count":19,"next":null,"previous":null,"results":[{"number":19,"start_date":"2022-11-07","end_date":"2022-12-11","promotion_count":2,"players_per_group":6,"state":"finished"},{"number":18,"start_date":"2022-09-19","end_date":"2022-10-23","promotion_count":2,"players_per_group":6,"state":"finished"},{"number":17,"start_date":"2022-05-30","end_date":"2022-07-03","promotion_count":2,"players_per_group":6,"state":"finished"},{"number":16,"start_date":"2022-04-18","end_date":"2022-05-22","promotion_count":2,"players_per_group":6,"state":"finished"},{"number":15,"start_date":"2022-02-21","end_date":"2022-03-27","promotion_count":2,"players_per_group":6,"state":"finished"},{"number":14,"start_date":"2022-01-03","end_date":"2022-02-06","promotion_count":2,"players_per_group":6,"state":"finished"},{"number":13,"start_date":"2021-11-15","end_date":"2021-12-19","promotion_count":2,"players_per_group":6,"state":"finished"},{"number":12,"start_date":"2021-09-19","end_date":"2021-10-23","promotion_count":2,"players_per_group":6,"state":"finished"},{"number":11,"start_date":"2021-08-08","end_date":"2021-09-05","promotion_count":2,"players_per_group":6,"state":"finished"},{"number":10,"start_date":"2021-05-01","end_date":"2021-06-08","promotion_count":2,"players_per_group":6,"state":"finished"},{"number":9,"start_date":"2021-03-06","end_date":"2021-04-24","promotion_count":2,"players_per_group":8,"state":"finished"},{"number":8,"start_date":"2021-01-10","end_date":"2021-03-04","promotion_count":2,"players_per_group":8,"state":"finished"},{"number":7,"start_date":"2020-11-29","end_date":"2020-12-27","promotion_count":2,"players_per_group":6,"state":"finished"},{"number":6,"start_date":"2020-10-25","end_date":"2020-11-22","promotion_count":2,"players_per_group":6,"state":"finished"},{"number":5,"start_date":"2020-09-20","end_date":"2020-10-18","promotion_count":2,"players_per_group":6,"state":"finished"},{"number":4,"start_date":"2020-08-09","end_date":"2020-09-06","promotion_count":2,"players_per_group":6,"state":"finished"},{"number":3,"start_date":"2020-06-14","end_date":"2020-08-02","promotion_count":2,"players_per_group":6,"state":"finished"},{"number":2,"start_date":"2020-05-10","end_date":"2020-06-07","promotion_count":2,"players_per_group":6,"state":"finished"},{"number":1,"start_date":"2020-04-05","end_date":"2020-05-03","promotion_count":2,"players_per_group":6,"state":"finished"}]}',
    'https://iglo.szalenisamuraje.org/api/seasons/19/groups?format=json': '{"count":12,"next":null,"previous":null,"results":[{"name":"A","type":"round_robin","is_egd":false},{"name":"B","type":"round_robin","is_egd":false},{"name":"C","type":"round_robin","is_egd":false},{"name":"D","type":"round_robin","is_egd":false},{"name":"E","type":"round_robin","is_egd":false},{"name":"F","type":"round_robin","is_egd":false},{"name":"G","type":"round_robin","is_egd":false},{"name":"H","type":"round_robin","is_egd":true},{"name":"I","type":"round_robin","is_egd":false},{"name":"J","type":"round_robin","is_egd":false},{"name":"K","type":"round_robin","is_egd":false},{"name":"L","type":"mcmahon","is_egd":false}]}',
    'https://iglo.szalenisamuraje.org/api/seasons/19/groups/A/members?format=json': '{"count":6,"next":null,"previous":null,"results":[{"id":4950,"player":"cezary","rank":2436,"order":1,"final_order":null,"initial_score":0},{"id":4951,"player":"olesia","rank":2105,"order":2,"final_order":null,"initial_score":0},{"id":4952,"player":"Deejay","rank":2383,"order":3,"final_order":null,"initial_score":0},{"id":4953,"player":"Lukasz Lew","rank":2194,"order":4,"final_order":null,"initial_score":0},{"id":4954,"player":"gisel","rank":2284,"order":5,"final_order":null,"initial_score":0},{"id":4955,"player":"janek94","rank":2256,"order":6,"final_order":null,"initial_score":0}]}',
    'https://iglo.szalenisamuraje.org/api/seasons/19/groups/B/members?format=json': '{"count":6,"next":null,"previous":null,"results":[{"id":4956,"player":"ashitaka","rank":2121,"order":1,"final_order":null,"initial_score":0},{"id":4957,"player":"Radziol","rank":2330,"order":2,"final_order":null,"initial_score":0},{"id":4958,"player":"bartosz","rank":2136,"order":3,"final_order":null,"initial_score":0},{"id":4959,"player":"Mbrez","rank":2249,"order":4,"final_order":null,"initial_score":0},{"id":4960,"player":"Sztygrys","rank":2287,"order":5,"final_order":null,"initial_score":0},{"id":4961,"player":"shin0e","rank":2107,"order":6,"final_order":null,"initial_score":0}]}',
    'https://iglo.szalenisamuraje.org/api/seasons/19/groups/C/members?format=json': '{"count":6,"next":null,"previous":null,"results":[{"id":4962,"player":"leszczyn","rank":2160,"order":1,"final_order":null,"initial_score":0},{"id":4963,"player":"senbo","rank":1914,"order":2,"final_order":null,"initial_score":0},{"id":4964,"player":"Aaali","rank":1952,"order":3,"final_order":null,"initial_score":0},{"id":4965,"player":"andy92","rank":2039,"order":4,"final_order":null,"initial_score":0},{"id":4966,"player":"liquescens","rank":2107,"order":5,"final_order":null,"initial_score":0},{"id":4967,"player":"Woj","rank":1822,"order":6,"final_order":null,"initial_score":0}]}',
    'https://iglo.szalenisamuraje.org/api/seasons/19/groups/D/members?format=json': '{"count":6,"next":null,"previous":null,"results":[{"id":4968,"player":"azazil","rank":2200,"order":1,"final_order":null,"initial_score":0},{"id":4969,"player":"johnGalt","rank":1694,"order":2,"final_order":null,"initial_score":0},{"id":4970,"player":"Kira","rank":1678,"order":3,"final_order":null,"initial_score":0},{"id":4971,"player":"Sarielowicz","rank":1852,"order":4,"final_order":null,"initial_score":0},{"id":4972,"player":"Blazej","rank":1866,"order":5,"final_order":null,"initial_score":0},{"id":4973,"player":"PawelD","rank":1546,"order":6,"final_order":null,"initial_score":0}]}',
    'https://iglo.szalenisamuraje.org/api/seasons/19/groups/E/members?format=json': '{"count":6,"next":null,"previous":null,"results":[{"id":4974,"player":"Christoph","rank":1888,"order":1,"final_order":null,"initial_score":0},{"id":4975,"player":"pmilian","rank":1799,"order":2,"final_order":null,"initial_score":0},{"id":4976,"player":"Dokuganryu","rank":1912,"order":3,"final_order":null,"initial_score":0},{"id":4977,"player":"szkielet","rank":1732,"order":4,"final_order":null,"initial_score":0},{"id":4978,"player":"m1nd0nf1r3","rank":1577,"order":5,"final_order":null,"initial_score":0},{"id":4979,"player":"Qoryl","rank":1499,"order":6,"final_order":null,"initial_score":0}]}',
    'https://iglo.szalenisamuraje.org/api/seasons/19/groups/F/members?format=json': '{"count":6,"next":null,"previous":null,"results":[{"id":4980,"player":"Poziom","rank":1806,"order":1,"final_order":null,"initial_score":0},{"id":4981,"player":"Serafym","rank":1775,"order":2,"final_order":null,"initial_score":0},{"id":4982,"player":"zefciu","rank":1519,"order":3,"final_order":null,"initial_score":0},{"id":4983,"player":"Czerminiak","rank":1285,"order":4,"final_order":null,"initial_score":0},{"id":4984,"player":"Samick","rank":1329,"order":5,"final_order":null,"initial_score":0},{"id":4985,"player":"tomms","rank":1500,"order":6,"final_order":null,"initial_score":0}]}',
    'https://iglo.szalenisamuraje.org/api/seasons/19/groups/G/members?format=json': '{"count":6,"next":null,"previous":null,"results":[{"id":4986,"player":"SiroWirdo","rank":1705,"order":1,"final_order":null,"initial_score":0},{"id":4987,"player":"magiczny_michal","rank":1586,"order":2,"final_order":null,"initial_score":0},{"id":4988,"player":"Przemo","rank":1354,"order":3,"final_order":null,"initial_score":0},{"id":4989,"player":"Boriss","rank":1327,"order":4,"final_order":null,"initial_score":0},{"id":4990,"player":"Porebskis","rank":1493,"order":5,"final_order":null,"initial_score":0},{"id":4991,"player":"urtok","rank":1223,"order":6,"final_order":null,"initial_score":0}]}',
    'https://iglo.szalenisamuraje.org/api/seasons/19/groups/H/members?format=json': '{"count":6,"next":null,"previous":null,"results":[{"id":4992,"player":"sigm","rank":1541,"order":1,"final_order":null,"initial_score":0},{"id":4993,"player":"tay","rank":1458,"order":2,"final_order":null,"initial_score":0},{"id":4994,"player":"meduz","rank":1190,"order":3,"final_order":null,"initial_score":0},{"id":4995,"player":"marmez","rank":1392,"order":4,"final_order":null,"initial_score":0},{"id":4996,"player":"zabry","rank":1143,"order":5,"final_order":null,"initial_score":0},{"id":4997,"player":"Bayzoner","rank":919,"order":6,"final_order":null,"initial_score":0}]}',
    'https://iglo.szalenisamuraje.org/api/seasons/19/groups/I/members?format=json': '{"count":6,"next":null,"previous":null,"results":[{"id":4998,"player":"Szymekk","rank":1247,"order":1,"final_order":null,"initial_score":0},{"id":4999,"player":"michalu","rank":1165,"order":2,"final_order":null,"initial_score":0},{"id":5000,"player":"OgrzesiekO","rank":1274,"order":3,"final_order":null,"initial_score":0},{"id":5001,"player":"janusz","rank":700,"order":4,"final_order":null,"initial_score":0},{"id":5002,"player":"picyr","rank":300,"order":5,"final_order":null,"initial_score":0},{"id":5003,"player":"Muff0","rank":1327,"order":6,"final_order":null,"initial_score":0}]}',
    'https://iglo.szalenisamuraje.org/api/seasons/19/groups/J/members?format=json': '{"count":6,"next":null,"previous":null,"results":[{"id":5004,"player":"ojmarcin","rank":1025,"order":1,"final_order":null,"initial_score":0},{"id":5005,"player":"Mar","rank":1174,"order":2,"final_order":null,"initial_score":0},{"id":5006,"player":"KJKZ","rank":583,"order":3,"final_order":null,"initial_score":0},{"id":5007,"player":"Dimka","rank":1006,"order":4,"final_order":null,"initial_score":0},{"id":5008,"player":"Sylwia","rank":504,"order":5,"final_order":null,"initial_score":0},{"id":5009,"player":"jest","rank":931,"order":6,"final_order":null,"initial_score":0}]}',
    'https://iglo.szalenisamuraje.org/api/seasons/19/groups/K/members?format=json': '{"count":6,"next":null,"previous":null,"results":[{"id":5010,"player":"leslaw07","rank":1000,"order":1,"final_order":null,"initial_score":0},{"id":5011,"player":"doc37","rank":946,"order":2,"final_order":null,"initial_score":0},{"id":5012,"player":"Dyoda","rank":340,"order":3,"final_order":null,"initial_score":0},{"id":5013,"player":"Lunakill","rank":676,"order":4,"final_order":null,"initial_score":0},{"id":5014,"player":"NikaZG","rank":900,"order":5,"final_order":null,"initial_score":0},{"id":5015,"player":"est","rank":900,"order":6,"final_order":null,"initial_score":0}]}',
    'https://iglo.szalenisamuraje.org/api/seasons/19/groups/L/members?format=json': '{"count":7,"next":null,"previous":null,"results":[{"id":5016,"player":"Patryk","rank":396,"order":1,"final_order":null,"initial_score":0},{"id":5017,"player":"ric","rank":499,"order":2,"final_order":null,"initial_score":0},{"id":5018,"player":"MareczKa","rank":100,"order":3,"final_order":null,"initial_score":0},{"id":5019,"player":"Arina","rank":100,"order":4,"final_order":null,"initial_score":0},{"id":5020,"player":"sir_husky_potato","rank":400,"order":5,"final_order":null,"initial_score":-1},{"id":5021,"player":"Tomko","rank":100,"order":6,"final_order":null,"initial_score":-1},{"id":5022,"player":"Polymorph","rank":18,"order":7,"final_order":null,"initial_score":-1}]}',
}