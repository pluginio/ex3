import { Application } from "./Application";

export class Application3 extends Application
{
    protected _screenWidth: number
    protected _screenHeight: number

    constructor(windowTitle: string, xPosition: number, yPosition: number,
        width: number, height: number, clearColor: number[])
    {
        super()
    }

    public onInitialize(): void {}
    public onTerminate(): void {}
    public onResize(width: number, height: number): void {}
    public onDisplay(): void {}

    public screenOverlay(): void {}

    public clearScreen(): void {}

}