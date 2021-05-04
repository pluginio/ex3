import {Buffer} from "./Buffer"
import { BufferUsage } from "./BufferUsage";

export class IndexBuffer extends Buffer
{
    protected _offset: number

    public constructor(numIndices: number, indexSize: number, usage: BufferUsage = BufferUsage.STATIC)
    {
        super(numIndices, indexSize, usage)
        this._offset = 0
    }

    public dispose(): void
    {
        // TODO Renderer.UnbindAllIndexBuffer(this)
        super.dispose()
    }

    public get offset(): number
    {
        return this._offset
    }

    public set offset(offset: number)
    {
        if(offset >= 0)
        {
            this._offset = offset
        }
        else
        {
            console.assert(false, "The offset must be nonnegative.")
        }
    }
}