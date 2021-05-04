import { Visual } from "./Visual";
import { PrimitiveType } from "./PrimitiveType";
import { VertexFormat } from "resources/VertexFormat";
import { VertexBuffer } from "resources/VertexBuffer";
import { IndexBuffer } from "resources/IndexBuffer";
import { Point } from "geom/Point";
import { Transform } from "geom/Transform";
import { VertexBufferAccessor } from "resources/VertexBufferAccessor";
import { Vector } from "geom/Vector";
import { UpdateType } from "./UpdateType";
import { Renderer } from "renderers/Renderer";
import { AttributeUsage } from "resources/AttributeUsage";

export abstract class Triangles extends Visual
{
    constructor(type: PrimitiveType, vformat: VertexFormat, 
        vbuffer: VertexBuffer, ibuffer: IndexBuffer)
    {
        super(type, vformat, vbuffer, ibuffer)
    }

    public dispose(): void
    {
    }

    public abstract get numTriangles(): number

    public abstract getTriangle(index: number, triangle: number[]):boolean
    
    public getModelTriangle(index: number, modelTriangle: Point[]): boolean
    {
        let triangle: number[] = [0, 0, 0]
        if(this.getTriangle(index, triangle))
        {
            let vba: VertexBufferAccessor = new VertexBufferAccessor(this._vFormat, this._vBuffer)
            let pos0: number[] = vba.getPositionAt(triangle[0])
            let pos1: number[] = vba.getPositionAt(triangle[1])
            let pos2: number[] = vba.getPositionAt(triangle[2])

            modelTriangle[0].set(pos0[0], pos0[1], pos0[2])
            modelTriangle[1].set(pos1[0], pos1[1], pos1[2])
            modelTriangle[2].set(pos2[0], pos2[1], pos2[2])

            return true
        }
        return false
    }

    public getWorldTriangle(index: number, worldTriangle: Point[]): boolean
    {
        let triangle: number[] = [0, 0, 0]
        if(this.getTriangle(index, triangle))
        {
            let vba: VertexBufferAccessor = new VertexBufferAccessor(this._vFormat, this._vBuffer)
            let pos0: number[] = vba.getPositionAt(triangle[0])
            let pos1: number[] = vba.getPositionAt(triangle[1])
            let pos2: number[] = vba.getPositionAt(triangle[2])

            worldTriangle[0] = this.worldTransform.multiplyPoint(Point.new(pos0[0], pos0[1], pos0[2]))
            worldTriangle[1] = this.worldTransform.multiplyPoint(Point.new(pos1[0], pos1[1], pos1[2]))
            worldTriangle[2] = this.worldTransform.multiplyPoint(Point.new(pos2[0], pos2[1], pos2[2]))

            return true
        }
        return false
    }

    public get numVertices(): number
    {
        return this._vBuffer.numElements
    }

    /*
    public get worldTransform(): Transform
    {
        return this.worldTransform
    }
    */

    public getPosition(v: number): Point
    {
        let index: number = this._vFormat.indexAt(AttributeUsage.POSITION)
        
        // TODO check if this is different
        if(index >= 0)
        {
            let offset: number = this._vFormat.offsetAt(index)
            let stride: number = this._vFormat.stride

            this._vBuffer.data.position = (offset + v * stride)

            let x: number = this._vBuffer.data.readFloat32()
            let y: number = this._vBuffer.data.readFloat32()
            let z: number = this._vBuffer.data.readFloat32()

            return Point.new(x, y, z)
        }
        console.assert(false, "getPosition failed")
        return Point.new()
    }

    public updateModelSpace(type: UpdateType): void
    {
        this.updateModelBound()
        if(type == UpdateType.MODEL_BOUND_ONLY)
        {
            return
        }

        let vba: VertexBufferAccessor = new VertexBufferAccessor(this._vFormat, this._vBuffer)
        if(vba.hasNormal)
        {
            this.updateModelNormals(vba)
        }

        if(type != UpdateType.NORMALS)
        {
            if(vba.hasTangent || vba.hasBinormal)
            {
                if(type == UpdateType.USE_GEOMETRY)
                {
                    this.updateModelTangentsUseGeometry(vba)
                }
                else
                {
                    this.updateModelTangentsUseTCoords(vba)
                }
            }
        }

        Renderer.updateAllVertexBuffer(this._vBuffer)
    }

    private updateModelNormals(vba: VertexBufferAccessor): void
    {
        throw new Error("Not implemented exception")
    }

    private updateModelTangentsUseGeometry(vba: VertexBufferAccessor): void
    {
        throw new Error("Not implemented exception")
    }

    private updateModelTangentsUseTCoords(vba: VertexBufferAccessor): void
    {
        throw new Error("Not implemented exception")
    }

    private static ComputeTangent(
        position0: Point, tcoord0: number[],
        position1: Point, tcoord1: number[],
        position2: Point, tcoord2: number[]) : Vector
    {
        throw new Error("Not implemented exception")
    }
}