import { ByteArray } from "../../core/ByteArray";
import { Endian } from "../../core/Endian";
import { Scene3ds } from "./types/Scene3ds";

export class Max3dsParser
{
    protected _scene: Scene3ds
    protected _data: ByteArray

    public constructor(data: ByteArray)
    {
        this._data = data
        this._data.endian = Endian.LITTLE_ENDIAN
    }

    public parse()
    {
        this._scene = new Scene3ds(this._data)
    }

    public get scene(): Scene3ds
    {
        return this._scene
    }
}
