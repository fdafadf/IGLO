// @ts-check

import { SvgPathBuilder } from "./SvgPathBuilder.js";

export class Svg
{
    constructor()
    {
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        // this.element.setAttribute('width', '1600px');
        // this.element.setAttribute('height', '800px');
        // this.element.setAttribute('viewBox', `0 0 ${document.documentElement.clientWidth * 0.65} ${document.documentElement.clientHeight * 0.65}`);
        this.element.setAttribute('viewBox', `0 0 1600 800`);
        this.lines_container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.labels_container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.element.appendChild(this.lines_container);
        this.element.appendChild(this.labels_container);
        this.path_builder = new SvgPathBuilder();
    }

    /**
     * @param {[number, number][]} points 
     */
    addLine(points)
    {
        let path_element = this.path_builder.buildPath(points);
        path_element.setAttribute('stroke-width', '2px');
        path_element.setAttribute('fill', 'none');
        this.lines_container.appendChild(path_element);
        return path_element;
    }

    addText(x, y, text)
    {
        let text_element = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text_element.setAttribute('x', x);
        text_element.setAttribute('y', y);
        text_element.textContent = text;
        this.labels_container.appendChild(text_element);
        return text_element;
    }
}
