import React, { useEffect, useRef } from "react";
import { ChartBuilderProps, ChartCanvasBuilder } from "./ChartCanvasBuilder";

type Props = ChartBuilderProps;

export const Chart: React.FC<Props> = (props) => {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (ref.current !== null) {
            const builder = new ChartCanvasBuilder(ref.current, props);
            builder.buildYAxis().buildXAxis().buildChart();
        }
    }, []);

    return <canvas ref={ref} />;
};
