export type Coordinate = readonly [x: number, y: number];

export type ChartData = readonly Coordinate[];

export type ChartBuilderProps = {
    readonly width: number;
    readonly height: number;
    readonly data: ChartData;
};

export class ChartCanvasBuilder {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly data: ChartData;
    private readonly dpiWidth: number;
    private readonly dpiHeight: number;

    constructor(
        private readonly canvas: HTMLCanvasElement,
        props: ChartBuilderProps
    ) {
        this.ctx = this.canvas.getContext("2d")!;
        this.data = props.data;

        this.dpiWidth = props.width * 2;
        this.dpiHeight = props.height * 2;

        this.canvas.style.width = props.width + "px";
        this.canvas.style.height = props.height + "px";
        this.canvas.width = this.dpiWidth;
        this.canvas.height = this.dpiHeight;
    }

    public buildChart(): ChartCanvasBuilder {
        const { ctx } = this;

        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "green";

        for (const [x, y] of this.data) {
            ctx.lineTo(x, this.dpiHeight - y);
        }
        ctx.stroke();
        ctx.closePath();

        return this;
    }
}
