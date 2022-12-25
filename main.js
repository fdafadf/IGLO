// @ts-check

import { RankingChart } from "./scripts/RankingChart.js";
import { RankingChartCanvasSettings } from "./scripts/RankingChartCanvasSettings.js";
import { RankingChartDataLoader } from "./scripts/RankingChartDataLoader.js";

async function onWindowLoad()
{
    let chart_data_loader = new RankingChartDataLoader();
    let chart_data = await chart_data_loader.load();
    let chart_settings = new RankingChartCanvasSettings();
    let chart = new RankingChart(chart_data, chart_settings);
    document.body.appendChild(chart.canvas.element);
}

window.addEventListener('load', onWindowLoad);