import {Visual} from './Visual'
import { VertexFormat } from '../resources/VertexFormat';
import { VertexBuffer } from '../resources/VertexBuffer';
import { PrimitiveType } from './PrimitiveType';

export class Polypoint extends Visual
{
    protected _numPoints: number

    public constructor(vFormat: VertexFormat, vBuffer: VertexBuffer)
    {
        super(PrimitiveType.POLYPOINT, vFormat, vBuffer, null)

        this._numPoints = this._vBuffer.numElements
    }

    public dispose(): void
    {
        super.dispose()
    }

    public get maxNumPoints(): number
    {
        return this._vBuffer.numElements
    }

    public set numPoints(numPoints: number)
    {
        let numVertices: number = this._vBuffer.numElements
        if(0 <= numPoints && numPoints <= numVertices)
        {
            this._numPoints = numPoints
        }
        else
        {
            this._numPoints = numVertices
        }
    }
}