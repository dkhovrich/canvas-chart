export type Coordinate = readonly [x: number, y: number];

export type ChartData = readonly Coordinate[];

export type ChartBuilderProps = {
    readonly width: number;
    readonly height: number;
    readonly rowsCount: number;
    readonly padding: number;
    readonly data: ChartData;
};

export class ChartCanvasBuilder {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly data: ChartData;
    private readonly dpiWidth: number;
    private readonly dpiHeight: number;
    private readonly rowsCount: number;
    private readonly padding: number;
    private readonly viewHeight: number;
    private readonly yMin: number;
    private readonly yMax: number;
    private readonly yRatio: number;

    constructor(
        private readonly canvas: HTMLCanvasElement,
        props: ChartBuilderProps
    ) {
        this.ctx = this.canvas.getContext("2d")!;

        this.data = props.data;
        this.rowsCount = props.rowsCount;
        this.padding = props.padding;
        this.dpiWidth = props.width * 2;
        this.dpiHeight = props.height * 2;
        this.viewHeight = this.dpiHeight - this.padding * 2;
        this.yMin = Math.min(...props.data.map(([, y]) => y));
        this.yMax = Math.max(...props.data.map(([, y]) => y));
        this.yRatio = this.viewHeight / (this.yMax - this.yMin);

        this.canvas.style.width = props.width + "px";
        this.canvas.style.height = props.height + "px";
        this.canvas.width = this.dpiWidth;
        this.canvas.height = this.dpiHeight;
    }

    public buildRows(): ChartCanvasBuilder {
        const { ctx } = this;

        const step = this.viewHeight / this.rowsCount;
        const textStep = (this.yMax - this.yMin) / this.rowsCount;

        ctx.beginPath();
        ctx.strokeStyle = "#bbb";
        ctx.font = "normal 20px Helvetica,sans-serif";
        ctx.fillStyle = "#96a2aa";

        for (let i = 1; i <= this.rowsCount; i++) {
            const y = step * i;
            const text = this.yMax - textStep * i;

            ctx.fillText(text.toString(), 5, y + this.padding - 10);
            ctx.moveTo(0, y + this.padding);
            ctx.lineTo(this.dpiWidth, y + this.padding);
        }

        ctx.stroke();
        ctx.closePath();

        return this;
    }

    public buildChart(): ChartCanvasBuilder {
        const { ctx } = this;

        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#ff0000";

        for (const [x, y] of this.data) {
            ctx.lineTo(x, this.dpiHeight - this.padding - y * this.yRatio);
        }

        ctx.stroke();
        ctx.closePath();

        return this;
    }
}
