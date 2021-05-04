import { IVertexBuffer } from "../../renderers/interfaces/IVertexBuffer";
import { BufferLocking } from "../../resources/BufferLocking";
import { Renderer } from "../../renderers/Renderer";
import { VertexBuffer } from "../../resources/VertexBuffer";

export class PdrVertexBuffer implements IVertexBuffer
{
    public constructor(renderer: Renderer, vBuffer: VertexBuffer)
    {
        console.log("Creating vertex buffer - WebGL 1.0")
    }

    public dispose(): void
    {

    }

    public enable(renderer: Renderer, streamIndex: number, offset: number): void
    {

    }

    public disable(renderer: Renderer, streamIndex: number): void
    {

    }

    public lock(mode: BufferLocking): void
    {

    }

    public unlock(): void
    {
        
    }
}