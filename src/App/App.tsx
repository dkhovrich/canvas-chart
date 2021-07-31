import React from "react";
import "./App.css";
import { Chart } from "../Chart/Chart";
import { ChartData } from "../Chart/ChartCanvasBuilder";

const data: ChartData = [
    [0, 0],
    [200, 100],
    [400, 100],
    [600, 200],
    [800, 80],
    [1000, 120],
    [1200, 0]
];

export const App: React.FC = () => {
    return (
        <div className="container">
            <div className="card">
                <Chart
                    width={600}
                    height={200}
                    rowsCount={5}
                    padding={40}
                    data={data}
                />
            </div>
        </div>
    );
};
