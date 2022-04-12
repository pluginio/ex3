import { IVertexBuffer } from "../../renderers/interfaces/IVertexBuffer";
import { BufferLocking } from "../../resources/BufferLocking";
import { Renderer } from "../../renderers/Renderer";
import { VertexBuffer } from "../../resources/VertexBuffer";
import { GL20 } from "./GL20";
import { GL20Mapping } from "./GL20Mapping";

export class PdrVertexBuffer implements IVertexBuffer
{
    private _buffer: WebGLBuffer

    public constructor(renderer: Renderer, vBuffer: VertexBuffer)
    {
        let gl:WebGL2RenderingContext = GL20.gl

        console.log("Creating vertex buffer - WebGL 2.0")
        this._buffer = gl.createBuffer()

        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer)

        gl.bufferData(gl.ARRAY_BUFFER, 
            vBuffer.data.view,
            GL20Mapping.BufferUsage[vBuffer.usage], 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }

    public dispose(): void
    {
        console.log("Disposing vertex buffer")
        GL20.gl.deleteBuffer(this._buffer)
    }

    public enable(renderer: Renderer, streamIndex: number, offset: number): void
    {
        console.log("Enabling vertex buffer")
        GL20.gl.bindBuffer(GL20.gl.ARRAY_BUFFER, this._buffer)
    }

    public disable(renderer: Renderer, streamIndex: number): void
    {
        console.log("Disabling vertex buffer")
        GL20.gl.bindBuffer(GL20.gl.ARRAY_BUFFER, null)
    }

    public lock(mode: BufferLocking): void
    {
        console.log("Locking vertex buffer")
    }

    public unlock(): void
    {
        console.log("Unlocking vertex buffer")
    }
}
