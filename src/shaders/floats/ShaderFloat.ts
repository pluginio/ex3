import { ByteArray } from "../../core/ByteArray";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";
import { Disposable } from "../../core/Disposable";

export class ShaderFloat implements Disposable
{
    protected _numElements: number
    protected _data: ByteArray
    protected _allowUpdater: boolean

    public constructor(numRegisters: number)
    {
        this._allowUpdater = false
        this.numRegisters = numRegisters * 4
    }

    public dispose(): void
    {
        this._data = null
    }

    public set numRegisters(numRegisters: number)
    {
        console.assert(numRegisters > 0, "Number of registers must be positive")
        this._numElements = 4 * numRegisters
        this._data = new ByteArray(this._numElements)
    }

    public get numRegisters(): number
    {
        return this._numElements / 4
    }

    public get data(): ByteArray
    {
        return this._data
    }

    public setRegister(i: number, data: number[]): void
    {
        console.assert(data.length == 4, "Invalid data")
        console.assert(0 <= i && i < this._numElements / 4, "Invalid register")
        
        this._data.position = 4 * i
        for(let i = 0 ; i < 4; ++i)
        {
            this._data.writeFloat32(data[i])
        }
    }

    public setRegisters(data: number[])
    {
        console.assert(data.length == this._numElements, "Invalid data")

        this._data.position = 0
        for(let i = 0; i < data.length; ++i)
        {
            this._data.writeFloat32(data[i])
        }
    }

    public getRegister(i: number): number[]
    {
        console.assert(0 <= i && i < this._numElements/4)
        this._data.position = 4 * i

        let target: number[] = []
        for(let i = 0; i < 4; ++i)
        {
            target[i] = this._data.readFloat32()
        }

        return target
    }

    public getRegisters(): number[]
    {
        this._data.position = 0

        let target: number[] = []
        for(let i: number = 0; i < this._numElements; ++i)
        {
            target[i] = this._data.readFloat32()
        }

        return target
    }

    public getAt(index: number): number
    {
        console.assert(0 <= index && index < this._numElements, "Invalid index");

        this._data.position = index
        return this._data.readFloat32()
    }

    public enableUpdater(): void
    {
        this._allowUpdater = true
    }

    public disableUpdater(): void
    {
        this._allowUpdater = false
    }

    public allowUpdater(): boolean
    {
        return this._allowUpdater
    }

    public update(visual: Visual, camera: Camera): void
    {
        // virtual
    }
}