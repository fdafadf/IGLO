
export class Point
{
    /**
     * @param {[number, number]} a 
     * @param {[number, number]} b 
     * @returns {[number, number]}
     */
    static add(a, b)
    {
        return [ a[0] + b[0], a[1] + b[1] ];
    }

    /**
     * @param {[number, number]} a 
     * @param {number} x
     * @returns {[number, number]}
     */
    static scale(a, x)
    {
        return [ a[0] * x, a[1] * x ];
    }

    /**
     * @param {[number, number]} a 
     * @param {[number, number]} b 
     * @returns {[number, number]}
     */
    static sub(a, b)
    {
        return [ a[0] - b[0], a[1] - b[1] ];
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}