import { Triangles } from "./Triangles";
import { PrimitiveType } from "./PrimitiveType";
import { VertexFormat } from "resources/VertexFormat";
import { VertexBuffer } from "resources/VertexBuffer";
import { IndexBuffer } from "resources/IndexBuffer";
import { ByteArray } from "core/ByteArray";

export class TriMesh extends Triangles
{
    constructor(vformat: VertexFormat, vbuffer: VertexBuffer, ibuffer: IndexBuffer)
    {
        super(PrimitiveType.TRIMESH, vformat, vbuffer, ibuffer)
    }

    public dispose(): void
    {
        super.dispose()
    }

    public get numTriangles(): number
    {
        return this._iBuffer.numElements / 3
    }

    public getTriangle(index: number, triangle: number[]):boolean
    {
        if(0 <= index && index < this.numTriangles)
        {
            let data: ByteArray = this._iBuffer.data
            data.position = 3 * index
            switch(this._iBuffer.elementSize)
            {
                case 2:
                    triangle[0] = data.readInt16()
                    triangle[1] = data.readInt16()
                    triangle[2] = data.readInt16()
                break
                case 4:
                    triangle[0] = data.readInt32()
                    triangle[1] = data.readInt32()
                    triangle[2] = data.readInt32()
                break
                default:
                    throw new Error("Invalid index element size")
            }
            return true
        }
        return false
    }
}