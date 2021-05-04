import { Buffer } from "./Buffer"
import { BufferUsage } from "./BufferUsage";

export class VertexBuffer extends Buffer
{
    public constructor(numVertices: number, vertexSize: number, usage: BufferUsage = BufferUsage.STATIC)
    {
        super(numVertices, vertexSize, usage)
    }

    public dispose(): void
    {
        // TODO Renderer.unbindAllVertexBuffer(this)
        super.dispose()
    }
}