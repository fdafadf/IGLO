// @ts-check

export class PlayerListControl
{
    constructor()
    {
        this.element = document.createElement('div');
        this.element.style.maxHeight = '90vh'; 
        this.element.style.display = 'flex';
        this.element.style.flexDirection = 'column';
        this.element.style.overflowY = 'scroll';
        this.items = new Map();
    }

    add(name, colors, path, text)
    {
        let player = new PlayerListControlItem(name, colors, path, text);
        this.element.appendChild(player.element);
        this.items.set(name, player);
    }
}

export class PlayerListControlItem
{
    /**
     * @param {string} name 
     * @param {PlayerColors} colors 
     * @param {SVGPathElement} path 
     * @param {SVGPathElement} text 
     */
    constructor(name, colors, path, text)
    {
        this.name = name;
        this.colors = colors;
        this.element = document.createElement('span');
        this.element.style.color = colors.color_off;
        this.text = text;
        this.text.setAttribute('fill', colors.line_color_on);
        this.text.style.filter = `drop-shadow(0px 0px 2px black)`;
        this.path = path;
        this.path.setAttribute('stroke', colors.line_color_off);
        this.path.setAttribute('stroke-width', '3px');
        this.checkbox_element = document.createElement('input');
        this.checkbox_element.setAttribute('type', 'checkbox');
        this.checkbox_element.setAttribute('name', `player-${name}`);
        this.label_element = document.createElement('label');
        this.label_element.setAttribute('for', `player-${name}`);
        this.label_element.textContent = name;
        this.element.appendChild(this.checkbox_element);
        this.element.appendChild(this.label_element);
        this.checkbox_element.onchange = this._onCheckboxChanged.bind(this);
    }

    _onCheckboxChanged()
    {
        if (this.checkbox_element.checked)
        {
            this.path.setAttribute('stroke', this.colors.line_color_on);
            this.element.style.backgroundColor = this.colors.line_color_on;
            this.element.style.color = this.colors.color_on;
            this.path.style.filter = `drop-shadow(0px 0px 2px ${this.colors.line_color_on})`;
            this.text.setAttribute('visibility', 'visible');
            this.path.parentElement?.appendChild(this.text);
            this.text.parentElement?.appendChild(this.text);
        }
        else
        {
            this.path.setAttribute('stroke', this.colors.line_color_off);
            this.element.style.backgroundColor = this.colors.line_color_off;
            this.element.style.color = this.colors.color_off;
            this.path.style.filter = '';
            this.text.setAttribute('visibility', 'hidden');
        }
    }
}
