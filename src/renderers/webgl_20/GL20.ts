export class GL20
{
    public static gl: WebGL2RenderingContext

    public static createContext(selector: string): WebGL2RenderingContext
    {
        var canvas = document.getElementById(selector) as HTMLCanvasElement;
        this.gl = canvas.getContext("webgl2") as WebGL2RenderingContext
        if(!this.gl)
        {
            console.warn("Unable to create WebGL context");
        }
        return this.gl
    }
}