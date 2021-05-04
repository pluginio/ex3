import { Visual } from "./Visual";
import { VertexFormat } from "../resources/VertexFormat";
import { VertexBuffer } from "../resources/VertexBuffer";
import { PrimitiveType } from "./PrimitiveType";

export class Polysegment extends Visual
{
    protected _numSegments: number
    protected _contiguous: boolean

    public constructor(vFormat: VertexFormat, vBuffer: VertexBuffer, contiguous: boolean)
    {
        super(contiguous ? PrimitiveType.POLYSEGMENTS_CONTIGUOUS : PrimitiveType.POLYSEGMENTS_DISJOINT,
            vFormat, vBuffer, null)
        
        this._contiguous = contiguous

        let numVertices: number = this._vBuffer.numElements
        console.assert(numVertices >= 2, "Polysegments must have at least two points")

        if(contiguous)
        {
            this._numSegments = numVertices - 1
        }
        else
        {
            console.assert((numVertices & 1)  == 0, "Disconnected segments require an even number of vertices")
            this._numSegments = numVertices/2
        }
    }

    public dispose(): void
    {
        super.dispose()
    }

    public get maxNumSegments(): number
    {
        let numVertices: number = this._vBuffer.numElements
        return this._contiguous ? numVertices - 1 : numVertices / 2
    }

    public set numSegments(numSegments: number)
    {
        let numVertices: number = this._vBuffer.numElements
        if(this._contiguous)
        {
            let numVerticesM1: number = numVertices - 1
            if( 0 <- this.numSegments && numSegments <= numVerticesM1)
            {
                this._numSegments = numSegments
            }
            else
            {
                this._numSegments = numVerticesM1
            }
        }
        else
        {
            let numverticesD2 = numVertices / 2
            if(0 <= numSegments && numSegments <= numverticesD2)
            {
                this._numSegments = numSegments
            }
            else
            {
                this._numSegments = numverticesD2
            }
        }
    }

    public get numSegments(): number
    {
        return this._numSegments
    }

    public get contiguous(): boolean
    {
        return this._contiguous
    }
}