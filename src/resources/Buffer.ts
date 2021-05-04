import {Disposable} from "../core/Disposable"
import {BufferUsage} from "./BufferUsage"
import { ByteArray } from "../core/ByteArray";
import { Endian } from "../core/Endian";

export abstract class Buffer implements Disposable
{
    protected _numElements: number 
    protected _elementSize: number
    protected _usage: BufferUsage
    protected _numBytes: number
    protected _data: ByteArray

    protected constructor(numElements: number, elementSize: number, usage: BufferUsage)
    {
        this._numElements = numElements
        this._elementSize = elementSize
        this._usage = usage
        this._numBytes = numElements * elementSize

        console.assert(this._numElements > 0, "Number of elements must be positive")
        console.assert(this._elementSize > 0, "Element size must be positive")

        this._data = new ByteArray(this._numBytes)
        this._data.endian = Endian.LITTLE_ENDIAN
    }

    public dispose(): void
    {
        this._data = null
    }

    public get numElements(): number
    {
        return this._numElements
    }

    public get elementSize(): number
    {
        return this._elementSize
    }

    public get usage(): BufferUsage
    {
        return this._usage
    }

    public set numElements(numElements: number)
    {
        this._numElements = numElements
    }

    public get numBytes(): number
    {
        return this._numBytes
    }

    public get data(): ByteArray
    {
        return this._data
    }
}