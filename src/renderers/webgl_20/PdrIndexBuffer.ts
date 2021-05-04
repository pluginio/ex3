import { IIndexBuffer } from "../../renderers/interfaces/IIndexBuffer";
import { BufferLocking } from "../../resources/BufferLocking";
import { Renderer } from "../../renderers/Renderer";
import { IndexBuffer } from "../../resources/IndexBuffer";

export class PdrIndexBuffer implements IIndexBuffer
{
    public constructor(renderer: Renderer, iBuffer: IndexBuffer)
    {
        console.log("Creating index buffer - WebGL 1.0")
    }

    public dispose(): void
    {

    }
    
    public enable(renderer: Renderer): void
    {

    }
    
    public disable(renderer: Renderer): void
    {

    }

    public lock(mode: BufferLocking): void
    {

    }
    
    public unlock(): void
    {
        
    }
}