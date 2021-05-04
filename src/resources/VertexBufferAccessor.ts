import { VertexFormat } from "./VertexFormat";
import { VertexBuffer } from "./VertexBuffer";
import { Disposable } from "../core/Disposable";
import { AttributeUsage } from "./AttributeUsage";
import { AttributeType } from "./AttributeType";
import { ByteArray } from '../core/ByteArray'

export class VertexBufferAccessor implements Disposable
{
    private _vFormat: VertexFormat
    private _vBuffer: VertexBuffer
    private _stride: number
    private _data: ByteArray

    private _position: number
    private _normal: number
    private _tangent: number
    private _binormal: number
    private _tCoord: number[] = []
    private _color: number[] = []
    private _blendIndices: number
    private _blendWeight: number

    private _positionChannels: number
    private _normalChannels: number
    private _tangentChannels: number
    private _binormalChannels: number
    private _tCoordChannels: number[] = []
    private _colorChannels: number[] = []

    constructor(vFormat: VertexFormat, vBuffer: VertexBuffer)
    {
        let i: number = 0
        for(i = 0; i < VertexFormat.MAX_TCOORD_UNITS; ++i)
        {
            this._tCoord[i] = 0
            this._tCoordChannels[i] = 0
        }

        for(i = 0; i < VertexFormat.MAX_COLOR_UNITS; ++i)
        {
            this._color[i] = 0
            this._colorChannels[i] = 0
        }
        
        this.applyToData(vFormat, vBuffer)
    }

    public dispose(): void
    {

    }

    public applyToData(vFormat: VertexFormat, vBuffer: VertexBuffer): void
    {
        this._vFormat = vFormat
        this._vBuffer = vBuffer

        this.initialize()
    }

    /*
    public applyToVisual(visual: Visual): void
    {
        this._vFormat = visual.vertexFormat
        this._vBuffer = visual.vertexBuffer

        this.initialize()
    }
    */

    public get data(): ByteArray
    {
        return this._data
    }

    public get numVertices(): number
    {
        return this._vBuffer.numElements
    }

    public get stride(): Number
    {
        return this._stride
    }

    // positions
    public setPositionAt(index: number, data: number[])
    {
        this._data.position = (this._position + index * this._stride)
        for(let i: number = 0; i < this._positionChannels; i++)
        {
            this._data.writeFloat32(data[i])
        }
    }

    public getPositionAt(index: number): number[]
    {
        let data: number[] = []
        this._data.position = (this._position + index * this._stride)
        for(let i: number = 0; i < this._positionChannels; i++)
        {
            data[i] = this._data.readFloat32()
        }
        return data
    }

    public hasPosition(): boolean
    {
        // TODO flag set
        return true
    }

    public getPositionChannels(): number
    {
        return this._positionChannels
    }

    // normals
    public setNormalAt(index: number, data: number[])
    {
        this._data.position = (this._normal + index * this._stride)
        for(let i: number = 0; i < this._normalChannels; i++)
        {
            this._data.writeFloat32(data[i])
        }
    }

    public getNormalAt(index: number): number[]
    {
        let data: number[] = []
        this._data.position = (this._normal + index * this._stride)
        for(let i: number = 0; i < this._normalChannels; i++)
        {
            data[i] = this._data.readFloat32()
        }
        return data
    }

    public hasNormal(): boolean
    {
        return this._normal != 0
    }

    public getNormalChannels(): number
    {
        return this._normalChannels
    }

    // tangents
    public setTangentAt(index: number, data: number[])
    {
        this._data.position = (this._tangent + index * this._stride)
        for(let i: number = 0; i < this._tangentChannels; i++)
        {
            this._data.writeFloat32(data[i])
        }
    }

    public getTangentAt(index: number): number[]
    {
        let data: number[] = []
        this._data.position = (this._tangent + index * this._stride)
        for(let i: number = 0; i < this._tangentChannels; i++)
        {
            data[i] = this._data.readFloat32()
        }
        return data
    }

    public hasTangent(): boolean
    {
        return this._tangent != 0
    }

    public getTangentChannels(): number
    {
        return this._tangentChannels
    }

    // binormal
    public setBinormalAt(index: number, data: number[])
    {
        this._data.position = (this._binormal + index * this._stride)
        for(let i: number = 0; i < this._binormalChannels; i++)
        {
            this._data.writeFloat32(data[i])
        }
    }

    public getBinormalAt(index: number): number[]
    {
        let data: number[] = []
        this._data.position = (this._binormal + index * this._stride)
        for(let i: number = 0; i < this._binormalChannels; i++)
        {
            data[i] = this._data.readFloat32()
        }
        return data
    }

    public hasBinormal(): boolean
    {
        return this._binormal != 0
    }

    public getBinormalChannels(): number
    {
        return this._binormalChannels
    }

    // tcoord
    public setTCoordAt(unit: number, index: number, data: number[])
    {
        this._data.position = (this._tCoord[unit] + index * this._stride)
        for(let i: number = 0; i < this._tCoordChannels[unit]; i++)
        {
            this._data.writeFloat32(data[i])
        }
    }

    public getTCoordAt(unit: number, index: number): number[]
    {
        let data: number[] = []
        this._data.position = (this._tCoord[unit] + index * this._stride)
        for(let i: number = 0; i < this._tCoordChannels[unit]; i++)
        {
            data[i] = this._data.readFloat32()
        }
        return data
    }

    public hasTCoord(unit: number): boolean
    {
        return this._tCoord[unit] != 0
    }

    public getTCoordChannels(unit: number): number
    {
        return this._tCoordChannels[unit]
    }


    // color
    public setColorAt(unit: number, index: number, data: number[])
    {
        this._data.position = (this._color[unit] + index * this._stride)
        for(let i: number = 0; i < this._colorChannels[unit]; i++)
        {
            this._data.writeFloat32(data[i])
        }
    }

    public getColorAt(unit: number, index: number): number[]
    {
        let data: number[] = []
        this._data.position = (this._color[unit] + index * this._stride)
        for(let i: number = 0; i < this._colorChannels[unit]; i++)
        {
            data[i] = this._data.readFloat32()
        }
        return data
    }

    public hasColor(unit: number): boolean
    {
        return this._color[unit] != 0
    }

    public getColorChannels(unit: number): number
    {
        return this._colorChannels[unit]
    }


    // blend indices
    public setBlendIndicesAt(index: number, data: number)
    {
        this._data.position = (this._blendIndices + index * this._stride)
        this._data.writeFloat32(data)
    }

    public getBlendIndicesAt(index: number): number
    {
        this._data.position = (this._blendIndices + index * this._stride)
        return this._data.readFloat32()
    }

    public hasBlendIndices(): boolean
    {
        return this._blendIndices != 0
    }

    // blend weights
    public setBlendWeightAt(index: number, data: number)
    {
        this._data.position = (this._blendWeight + index * this._stride)
        this._data.writeFloat32(data)
    }

    public getBlendWeightAt(index: number): number
    {
        this._data.position = (this._blendWeight + index * this._stride)
        return this._data.readFloat32()
    }

    public hasBlendWeight(): boolean
    {
        return this._blendWeight != 0
    }







    private initialize(): void
    {
        this._stride = this._vFormat.stride
        this._data = this._vBuffer.data

        let baseType: number = AttributeUsage.NONE
        let type: AttributeType
        let index: number

        // position
        index = this._vFormat.indexAt(AttributeUsage.POSITION)
        if(index >= 0)
        {
            this._position = this._vFormat.offsetAt(index)
            type = this._vFormat.attributeTypeAt(index)
            this._positionChannels = type - baseType

            if(this._positionChannels > 4)
            {
                this._positionChannels = 0
            }
        }
        else
        {
            this._position = 0
            this._positionChannels = 0
        }

        // normal
        index = this._vFormat.indexAt(AttributeUsage.NORMAL)
        if(index >= 0)
        {
            this._normal = this._vFormat.offsetAt(index)
            type = this._vFormat.attributeTypeAt(index)
            this._normalChannels = type - baseType

            if(this._normalChannels > 4)
            {
                this._normalChannels = 0
            }
        }
        else
        {
            this._normal = 0
            this._normalChannels = 0
        }

        // tangent
        index = this._vFormat.indexAt(AttributeUsage.TANGENT)
        if(index >= 0)
        {
            this._tangent = this._vFormat.offsetAt(index)
            type = this._vFormat.attributeTypeAt(index)
            this._tangentChannels = type - baseType

            if(this._tangentChannels > 4)
            {
                this._tangentChannels = 0
            }
        }
        else
        {
            this._tangent = 0
            this._tangentChannels = 0
        }

        // binormal
        index = this._vFormat.indexAt(AttributeUsage.BINORMAL)
        if(index >= 0)
        {
            this._binormal = this._vFormat.offsetAt(index)
            type = this._vFormat.attributeTypeAt(index)
            this._binormalChannels = type - baseType

            if(this._binormalChannels > 4)
            {
                this._binormalChannels = 0
            }
        }
        else
        {
            this._binormal = 0
            this._binormalChannels = 0
        }

        // tcoords
        let unit: number = 0
        for(unit = 0; unit < VertexFormat.MAX_TCOORD_UNITS; ++unit)
        {
            index = this._vFormat.indexAt(AttributeUsage.TEXCOORD, unit)
            if(index >= 0)
            {
                this._tCoord[unit] = this._vFormat.offsetAt(index)
                type = this._vFormat.attributeTypeAt(index)
                this._tCoordChannels[unit] = type - baseType
                if(this._tCoordChannels[unit] > 4)
                {
                    this._tCoordChannels[unit] = 0
                }
            }
            else
            {
                this._tCoord[unit] = 0
                this._tCoordChannels[unit] = 0
            }
        }

        // color
        unit = 0
        for(unit = 0; unit < VertexFormat.MAX_COLOR_UNITS; ++unit)
        {
            index = this._vFormat.indexAt(AttributeUsage.COLOR, unit)
            if(index >= 0)
            {
                this._color[unit] = this._vFormat.offsetAt(index)
                type = this._vFormat.attributeTypeAt(index)
                this._colorChannels[unit] = type - baseType
                if(this._colorChannels[unit] > 4)
                {
                    this._colorChannels[unit] = 0
                }
            }
            else
            {
                this._color[unit] = 0
                this._colorChannels[unit] = 0
            }
        }

        // blend indices
        index = this._vFormat.indexAt(AttributeUsage.BLENDINDICES)
        if(index >= 0)
        {
            this._blendIndices = this._vFormat.offsetAt(index)
        }
        else
        {
            this._blendIndices = 0
        }

        // blend weight
        index = this._vFormat.indexAt(AttributeUsage.BLENDWEIGHT)
        if(index >= 0)
        {
            this._blendWeight = this._vFormat.offsetAt(index)
        }
        else
        {
            this._blendWeight = 0
        }
    }
}