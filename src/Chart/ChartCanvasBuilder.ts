import { format } from "date-fns";
import { ChartData, ColumnItem, isColumnType } from "../data";
import { assert, isDefined, isNumber, isString } from "../utils";
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
    private readonly xRatio: number;
    private readonly xColumnsCount: number = 6;

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
        this.xRatio = this.viewWidth / (this.data.columns[0]!.length - 2);
    }

    public buildYAxis(): ChartCanvasBuilder {
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

    public buildXAxis(): ChartCanvasBuilder {
        const xData = this.data.columns.filter((column) => {
            const name = column[0];
            assert(isColumnType(name));

            return this.data.types[name] !== "line";
        })[0];
        assert(isDefined(xData));

        const step = Math.round(xData.length / this.xColumnsCount);

        this.ctx.beginPath();
        for (let i = 1; i < xData.length; i += step) {
            const value = xData[i];
            assert(isNumber(value));

            const text = format(new Date(value), "LLL d");
            const x = i * this.xRatio;
            this.ctx.fillText(text.toString(), x, this.dpiHeight - 10);
        }
        this.ctx.closePath();

        return this;
    }

    public buildChart(): ChartCanvasBuilder {
        const yData = this.data.columns.filter((column) => {
            const name = column[0];
            assert(isColumnType(name));

            return this.data.types[name] === "line";
        });

        yData.map(this.toCoords.bind(this)).forEach((coords, index) => {
            const columnName = yData[index]![0]!;
            assert(isColumnType(columnName));
            assert(columnName !== "x");

            this.line(coords, { color: this.data.colors[columnName]! });
        });

        return this;
    }

    private toCoords(column: readonly ColumnItem[]): readonly Coordinate[] {
        return column
            .map((y, i): Coordinate | undefined => {
                if (isString(y)) return undefined;
                return [
                    Math.floor((i - 1) * this.xRatio),
                    Math.floor(this.dpiHeight - this.padding - y * this.yRatio)
                ];
            })
            .filter(isDefined);
    }
}
