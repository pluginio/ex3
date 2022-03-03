import { Renderer } from "../renderers/Renderer";
import {Buffer} from "./Buffer"
import { BufferUsage } from "./BufferUsage";

export class IndexBuffer extends Buffer
{
    protected _offset: number

    public constructor(numIndices: number, elementSize: number, usage: BufferUsage = BufferUsage.STATIC)
    {
        super(numIndices, elementSize, usage)
        this._offset = 0
    }

    public dispose(): void
    {
        Renderer.unbindAllIndexBuffer(this)
        super.dispose()
    }

    public setIndexAt(index: number, value: number): void
    {
        this._data.position = index * this._elementSize
        this._data.writeInt16(value)
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