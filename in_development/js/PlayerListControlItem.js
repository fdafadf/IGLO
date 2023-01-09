// @ts-check

export class PlayerListControlItem
{
    /**
     * @param {string} name 
     */
    constructor(name)
    {
        /**
         * @param {PlayerListControlItem} item 
         */
        this.onSelectionChanged = item => {};
        this.name = name;
        this.color = 'white';
        this.color_selected = 'black';
        this.background_color = 'black';
        this.background_color_selected = 'white';
        this.element = document.createElement('span');
        this.element.style.color = this.color;
        this.element.style.backgroundColor = this.background_color;
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
        this.onSelectionChanged(this);
        this._updateColors();
    }

    _updateColors()
    {
        if (this.checkbox_element.checked)
        {
            this.element.style.backgroundColor = this.background_color_selected;
            this.element.style.color = this.color_selected;
        }
        else
        {
            this.element.style.backgroundColor = this.background_color;
            this.element.style.color = this.color;
        }
    }
}
