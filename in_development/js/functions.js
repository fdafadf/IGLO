// @ts-check

/**
 * @param {Array} array 
 * @returns 
 */
export function shuffle(array)
{
    let index = array.length,  random_index;
  
    while (index != 0)
    {
        random_index = Math.floor(Math.random() * index);
        index--;
        [array[index], array[random_index]] = [array[random_index], array[index]];
    }
  
    return array;
}

/**
 * @param {HTMLInputElement} checkbox 
 * @param {boolean} checked 
 */
export function setCheckboxChecked(checkbox, checked)
{
    checkbox.checked = checked;
    checkbox.dispatchEvent(new Event('change', { bubbles: false, cancelable: true }));
}
