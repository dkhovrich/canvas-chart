import React, { useEffect, useRef } from "react";
import { ChartBuilderProps, ChartCanvasBuilder } from "./ChartCanvasBuilder";

type Props = ChartBuilderProps;

export const Chart: React.FC<Props> = ({ width, height, data }) => {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (ref.current !== null) {
            const builder = new ChartCanvasBuilder(ref.current, {
                width,
                height,
                data
            });
            builder.buildChart();
        }
    }, []);

    return <canvas ref={ref} />;
};
