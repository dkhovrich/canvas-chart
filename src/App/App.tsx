import React from "react";
import "./App.css";
import { Chart } from "../Chart/Chart";
import { ChartData } from "../Chart/ChartCanvasBuilder";

const data: ChartData = [
    [0, 0],
    [200, 200],
    [400, 100],
    [600, 300],
    [800, 50]
];

export const App: React.FC = () => {
    return (
        <div className="container">
            <div className="card">
                <Chart width={600} height={200} data={data} />
            </div>
        </div>
    );
};
