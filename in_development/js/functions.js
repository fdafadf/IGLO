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