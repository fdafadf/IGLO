// @ts-check

import { Point } from "./Point.js";

export class SvgPathBuilder
{
    constructor(smoothing)
    {
        this.smoothing = smoothing ?? 0.2;
    }

    /**
     * @param {[number, number][]} points
     * @returns {SVGPathElement}
     */
    buildPath(points)
    {
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', this.buildPathNodes(points).join(' '));
        return path;
    }

    /**
     * @param {[number, number][]} points
     * @returns {string[]}
     */
    buildPathNodes(points)
    {
        /** @type {(point: [number, number], index: number, array: [number, number][]) => string} */
        let smoothFunction = this.smoothing == 0 ? this._line : this._quadratic.bind(this);
        return points.map((point, i, a) => i === 0 ? `M ${point[0]},${point[1]}` : smoothFunction(point, i, a));
    }
    
    /**
     * @param {[number, number]} point 
     * @returns {string}
     */
    _line(point)
    {
        return `L ${point[0]} ${point[1]}`;
    }
    
    /**
     * @param {*} i 
     * @param {[number, number][]} a 
     * @returns {string}
     */
    _quadratic(_, i, a)
    {
        const start = a[i - 1];
        const end = a[i];
        const previous = a[i - 2] || start;
        const next = a[i + 1] || end;
        const [s_x, s_y] = Point.add(start, Point.scale(Point.sub(end, previous), this.smoothing));
        const [e_x, e_y] = Point.add(end, Point.scale(Point.sub(start, next), this.smoothing));
        return `C ${s_x},${s_y} ${e_x},${e_y} ${end[0]},${end[1]}`;
    }
}