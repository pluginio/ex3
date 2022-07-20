export class GL20
{
    public static gl: WebGL2RenderingContext

    public static createContext(selector: string): WebGL2RenderingContext
    {
        var canvas = document?.getElementById(selector) as HTMLCanvasElement;
        this.gl = canvas?.getContext("webgl2")
        if(!this.gl)
        {
            console.warn("Unable to create WebGL 2.0 context");
        }

        /*
        var ext = this.gl.getExtension("OES_vertex_array_object");
        if (!ext) {
            console.warn("Required extension OES_vertex_array_object is unsupported");
        }
        */
       
        return this.gl
    }
}
