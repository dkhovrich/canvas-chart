import React from "react";
import "./App.css";
import { Chart } from "../Chart/Chart";
import { getChartData } from "../data";

const data = getChartData();

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
