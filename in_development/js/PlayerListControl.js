// @ts-check

import { PlayerListControlItem } from './PlayerListControlItem.js';
import './types.js'

export class PlayerListControl
{
    constructor()
    {
        this.element = document.createElement('div');
        this.element.style.display = 'flex';
        this.element.style.flexDirection = 'column';
        this.items = new Map();
    }

    /**
     * @param {PlayerListControlItem} item 
     * @returns 
     */
    add(item)
    {
        this.element.appendChild(item.element);
        this.items.set(item.name, item);
        return item;
    }
}
