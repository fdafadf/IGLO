// @ts-check

/**
 * @template TValue
 * @type {SelectControl<TValue>}
 */
export class SelectControl
{
    constructor()
    {
        /** @type {(selected_value: TValue) => any} */
        this.onSelectionChanged = selected_value => {};
        this.element = document.createElement('select');
        this.element.onchange = this._onSelectionChanged.bind(this);
    }

    _add(name, value)
    {
        let option_element = document.createElement('option');
        option_element['selected_value'] = value;
        option_element.textContent = name;
        this.element.appendChild(option_element);
    }

    _onSelectionChanged()
    {
        let selected_value = this.element.selectedOptions[0]['selected_value'];
        this.onSelectionChanged(selected_value);
    }
}