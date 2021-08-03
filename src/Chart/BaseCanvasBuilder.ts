export type Coordinate = readonly [x: number, y: number];

export type LineOptions = {
    readonly color: string;
};

export abstract class BaseCanvasBuilder {
    protected readonly ctx: CanvasRenderingContext2D;
    protected readonly dpiWidth: number;
    protected readonly dpiHeight: number;

    protected constructor(
        protected readonly canvas: HTMLCanvasElement,
        width: number,
        height: number
    ) {
        this.ctx = this.canvas.getContext("2d")!;

        this.dpiWidth = width * 2;
        this.dpiHeight = height * 2;

        this.canvas.style.width = width + "px";
        this.canvas.style.height = height + "px";
        this.canvas.width = this.dpiWidth;
        this.canvas.height = this.dpiHeight;
    }

    protected line(
        coords: readonly Coordinate[],
        { color }: LineOptions
    ): void {
        this.ctx.beginPath();
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = color;

        for (const [x, y] of coords) {
            this.ctx.lineTo(x, y);
        }

        this.ctx.stroke();
        this.ctx.closePath();
    }
}
