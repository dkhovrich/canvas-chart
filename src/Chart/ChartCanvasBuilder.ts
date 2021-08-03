import { ChartData, isColumnType } from "../data";
import { assert, isDefined, isNumber } from "../utils";
import { BaseCanvasBuilder, Coordinate } from "./BaseCanvasBuilder";

export type ChartBuilderProps = {
    readonly width: number;
    readonly height: number;
    readonly rowsCount: number;
    readonly padding: number;
    readonly data: ChartData;
};

function computeBoundaries({
    columns,
    types
}: ChartData): readonly [min: number, max: number] {
    const yCoordinates = columns
        .filter((column) => {
            const type = column[0]!;
            assert(isColumnType(type));
            return types[type] === "line";
        })
        .flatMap((column) => column.filter(isNumber));

    return [Math.min(...yCoordinates), Math.max(...yCoordinates)];
}

export class ChartCanvasBuilder extends BaseCanvasBuilder {
    private readonly data: ChartData;
    private readonly rowsCount: number;
    private readonly padding: number;
    private readonly viewHeight: number;
    private readonly viewWidth: number;
    private readonly yMin: number;
    private readonly yMax: number;
    private readonly yRatio: number;
    private readonly xRadio: number;

    constructor(canvas: HTMLCanvasElement, props: ChartBuilderProps) {
        super(canvas, props.width, props.height);

        this.data = props.data;
        this.rowsCount = props.rowsCount;
        this.padding = props.padding;
        this.viewHeight = this.dpiHeight - this.padding * 2;
        this.viewWidth = this.dpiWidth;

        const [yMin, yMax] = computeBoundaries(props.data);
        this.yMin = yMin;
        this.yMax = yMax;
        this.yRatio = this.viewHeight / (this.yMax - this.yMin);
        this.xRadio = this.viewWidth / (this.data.columns[0]!.length - 2);
    }

    public buildRows(): ChartCanvasBuilder {
        const step = this.viewHeight / this.rowsCount;
        const textStep = (this.yMax - this.yMin) / this.rowsCount;

        this.ctx.beginPath();
        this.ctx.strokeStyle = "#bbb";
        this.ctx.font = "normal 20px Helvetica,sans-serif";
        this.ctx.fillStyle = "#96a2aa";

        for (let i = 1; i <= this.rowsCount; i++) {
            const y = step * i;
            const text = Math.round(this.yMax - textStep * i);

            this.ctx.fillText(text.toString(), 5, y + this.padding - 10);
            this.ctx.moveTo(0, y + this.padding);
            this.ctx.lineTo(this.dpiWidth, y + this.padding);
        }

        this.ctx.stroke();
        this.ctx.closePath();

        return this;
    }

    public buildChart(): ChartCanvasBuilder {
        for (const column of this.data.columns) {
            const name = column[0];
            assert(isColumnType(name));

            if (this.data.types[name] !== "line") {
                continue;
            }

            const coords = column
                .map((y, i): Coordinate | undefined => {
                    if (typeof y !== "number") {
                        return undefined;
                    }
                    return [
                        this.calculateXCoordinate(i - 1),
                        this.calculateYCoordinate(y)
                    ];
                })
                .filter(isDefined);

            assert(name !== "x");
            const color = this.data.colors[name];

            this.line(coords, { color });
        }

        return this;
    }

    private calculateXCoordinate(x: number): number {
        return Math.floor(x * this.xRadio);
    }

    private calculateYCoordinate(y: number): number {
        return Math.floor(this.dpiHeight - this.padding - y * this.yRatio);
    }
}
