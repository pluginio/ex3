import { IIndexBuffer } from "../../renderers/interfaces/IIndexBuffer";
import { BufferLocking } from "../../resources/BufferLocking";
import { Renderer } from "../../renderers/Renderer";
import { IndexBuffer } from "../../resources/IndexBuffer";
import { GL20Mapping } from "./GL20Mapping";
import { GL20 } from "./GL20";

export class PdrIndexBuffer implements IIndexBuffer
{
    private _buffer: WebGLBuffer

    public constructor(renderer: Renderer, iBuffer: IndexBuffer)
    {
        let gl:WebGL2RenderingContext = GL20.gl

        console.log("Creating index buffer - WebGL 2.0")
        this._buffer = gl.createBuffer()

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer)

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 
            iBuffer.data.view,
            GL20Mapping.BufferUsage[iBuffer.usage])

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    }

    public dispose(): void
    {
        console.log("Disposing index buffer")
        GL20.gl.deleteBuffer(this._buffer)
    }
    
    public enable(renderer: Renderer): void
    {
        console.log("Enabling index buffer")
        GL20.gl.bindBuffer(GL20.gl.ELEMENT_ARRAY_BUFFER, this._buffer)
    }
    
    public disable(renderer: Renderer): void
    {
        console.log("Disabling index buffer")
        GL20.gl.bindBuffer(GL20.gl.ELEMENT_ARRAY_BUFFER, null)
    }

    public lock(mode: BufferLocking): void
    {
        console.log("Locking index buffer")
    }
    
    public unlock(): void
    {
        console.log("Unlocking index buffer")
    }
}