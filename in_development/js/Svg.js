// @ts-check

import { SvgPathBuilder } from "./SvgPathBuilder.js";

export class Svg
{
    constructor()
    {
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.element.setAttribute('width', '1600px');
        this.element.setAttribute('height', '800px');
        // this.element.setAttribute('viewBox', `0 0 ${document.documentElement.clientWidth * 0.65} ${document.documentElement.clientHeight * 0.65}`);
        // this.element.setAttribute('viewBox', `0 0 800 600`);
    }

    /**
     * @param {[number, number][]} points 
     */
    addLine(points)
    {
        let path_element = new SvgPathBuilder().buildPath(points);
        path_element.setAttribute('stroke', 'hsl(180, 100%, 50%)');
        path_element.setAttribute('stroke-width', '2px');
        path_element.setAttribute('fill', 'none');
        this.element.appendChild(path_element);
        return path_element;
    }

    addText(x, y, text)
    {
        let text_element = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text_element.setAttribute('x', x);
        text_element.setAttribute('y', y);
        text_element.setAttribute('visibility', 'hidden');
        text_element.textContent = text;
        this.element.appendChild(text_element);
        return text_element;
    }
}
