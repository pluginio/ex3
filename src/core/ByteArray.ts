import {Disposable} from './Disposable'
import {Endian} from './Endian'

export class ByteArray implements Disposable
{
    private _data: ArrayBuffer;
    private _view: DataView;
    private _littleEndian: boolean = false
    private _position: number

    public constructor(numBytes: number)
    {
        this._data = new ArrayBuffer(numBytes)
        this._view = new DataView(this._data)
    }

    public dispose(): void
    {
        this._view = null
        this._data = null
    }

    public static fromArrayBuffer(buffer: ArrayBuffer): ByteArray
    {
        let byteArray: ByteArray = new ByteArray(0)
        byteArray._data = buffer
        byteArray._view = new DataView(byteArray._data)

        return byteArray
    }

    public set endian(value: Endian)
    {
        if(value == Endian.LITTLE_ENDIAN)
        {
            this._littleEndian = true
        }
        else
        {
            this._littleEndian = false
        }
    }

    public get endian(): Endian
    {
        if(this._littleEndian)
        {
            return Endian.LITTLE_ENDIAN
        }
        return Endian.BIG_ENDIAN
    }

    public get view(): DataView
    {
        return this._view
    }

    public get position(): number
    {
        return this._position
    }

    public set position(value: number)
    {
        if(0 <= value && value < this._data.byteLength)
        {
            this._position = value
        }
        else
        {
            console.assert(false, "Out of bounds at ByteArray::position")
        }
    }

    public get length(): number
    {
        return this._data.byteLength
    }

    public readInt8(): number
    {
        let val: number = this._view.getInt8(this._position);
        this._position++
        return val
    }

    public writeInt8(value: number)
    {
        this._view.setInt8(this._position, value)
        this._position++
    }

    public readUint8(): number
    {
        let val: number = this._view.getUint8(this._position)
        this._position++
        return val
    }

    public writeUint8(value: number)
    {
        this._view.setUint8(this._position, value)
        this._position++
    }

    public readInt16(): number
    {
        let val: number = this._view.getInt16(this._position, this._littleEndian)
        this._position += 2;
        return val
    }

    public writeInt16(value: number)
    {
        this._view.setInt16(this._position, value, this._littleEndian)
        this._position += 2
    }

    public readUint16(): number
    {
        let val: number = this._view.getUint16(this._position, this._littleEndian)
        this._position += 2
        return val
    }

    public writeUint16(value: number)
    {
        this._view.setUint16(this._position, value, this._littleEndian)
        this._position += 2
    }

    public readInt32(): number
    {
        let val: number = this._view.getInt32(this._position, this._littleEndian)
        this._position += 4
        return val
    }

    public writeInt32(value: number)
    {
        this._view.setInt32(this._position, value, this._littleEndian)
        this._position += 4
    }

    public readUint32(): number
    {
        let val: number = this._view.getUint32(this._position, this._littleEndian)
        this._position += 4
        return val
    }

    public writeUint32(value: number)
    {
        this._view.setUint32(this._position, value, this._littleEndian)
        this._position += 4
    }

    public readInt64(): bigint
    {
        let val: bigint = this._view.getBigInt64(this._position, this._littleEndian)
        this._position += 8
        return val
    }

    public writeInt64(value: bigint)
    {
        this._view.setBigInt64(this._position, value, this._littleEndian)
        this._position += 8
    }

    public readUint64(): bigint
    {
        let val: bigint = this._view.getBigUint64(this._position, this._littleEndian)
        this._position += 8
        return val
    }

    public writeUint64(value: bigint)
    {
        this._view.setBigUint64(this._position, value, this._littleEndian)
        this._position += 8
    }

    public readFloat32(): number
    {
        let val: number = this._view.getFloat32(this._position, this._littleEndian)
        this._position += 4
        return val
    }

    public writeFloat32(value: number)
    {
        this._view.setFloat32(this._position, value, this._littleEndian)
        this._position += 4
    }

    public readFloat64(): number
    {
        let val: number = this._view.getFloat64(this._position, this._littleEndian)
        this._position += 8
        return val
    }

    public writeFloat64(value: number)
    {
        this._view.setFloat64(this._position, value, this._littleEndian)
        this._position += 8
    }
}