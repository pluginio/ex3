import { IVertexFormat } from "../../renderers/interfaces/IVertexFormat";
import { Renderer } from "../Renderer";
import { VertexFormat } from "../../resources/VertexFormat";
import { AttributeUsage } from "resources/AttributeUsage";
import { GL20Mapping } from "./GL20Mapping";
import { GL20 } from "./GL20";

export class PdrVertexFormat implements IVertexFormat
{
    private _stride: number
    
    private _hasPosition: boolean
    private _positionChannels: number
    private _positionType: number
    private _positionOffset: number
    private _positionIndex: number

    private _hasNormal: boolean
    private _normalChannels: number
    private _normalType: number
    private _normalOffset: number
    private _normalIndex: number

    private _hasTangent: boolean
    private _tangentChannels: number
    private _tangentType: number
    private _tangentOffset: number
    private _tangentIndex: number

    private _hasBinormal: boolean
    private _binormalChannels: number
    private _binormalType: number
    private _binormalOffset: number
    private _binormalIndex: number

    private _hasTCoord: boolean[]
    private _tCoordChannels: number[]
    private _tCoordType: number[]
    private _tCoordOffset: number[]
    private _tCoordIndex: number[]

    private _hasColor: boolean[]
    private _colorChannels: number[]
    private _colorType: number[]
    private _colorOffset: number[]
    private _colorIndex: number[]

    private _hasBlendIndices: boolean
    private _blendIndicesChannels: number
    private _blendIndicesType: number
    private _blendIndicesOffset: number
    private _blendIndicesIndex: number

    private _hasBlendWeight: boolean
    private _blendWeightChannels: number
    private _blendWeightType: number
    private _blendWeightOffset: number
    private _blendWeightIndex: number

    private _hasFogCoord: boolean
    private _fogCoordChannels: number
    private _fogCoordType: number
    private _fogCoordOffset: number
    private _fogCoordIndex: number

    private _hasPSize: boolean
    private _pSizeChannels: number
    private _pSizeType: number
    private _pSizeOffset: number
    private _pSizeIndex: number

    private _vFormat: VertexFormat

    public constructor(renderer: Renderer, vFormat: VertexFormat)
    {
        console.log("Creating vertex format - WebGL 2.0")

        this._stride = vFormat.stride

        let type: number, i: number, unit: number = 0

        this._hasTCoord = []
        this._tCoordChannels = []
        this._tCoordType = []
        this._tCoordOffset = []
        this._tCoordIndex = []

        this._hasColor = []
        this._colorChannels = []
        this._colorType = []
        this._colorOffset = []
        this._colorIndex = []

        i = vFormat.indexAt(AttributeUsage.POSITION)
        if(i >= 0)
        {
            this._hasPosition = true
            type = vFormat.attributeTypeAt(i)
            this._positionChannels = GL20Mapping.AttributeChannels[type]
            this._positionType = GL20Mapping.AttributeType[type]
            this._positionOffset = vFormat.offsetAt(i)
            this._positionIndex = vFormat.indexAt(AttributeUsage.POSITION, 0)
        }

        i = vFormat.indexAt(AttributeUsage.NORMAL)
        if(i >= 0)
        {
            this._hasNormal = true
            type = vFormat.attributeTypeAt(i)
            this._normalChannels = GL20Mapping.AttributeChannels[type]
            this._normalType = GL20Mapping.AttributeType[type]
            this._normalOffset = vFormat.offsetAt(i)
            this._normalIndex = vFormat.indexAt(AttributeUsage.NORMAL, 0)
        }

        i = vFormat.indexAt(AttributeUsage.BINORMAL)
        if(i >= 0)
        {
            this._hasTangent = true
            type = vFormat.attributeTypeAt(i)
            this._tangentChannels = GL20Mapping.AttributeChannels[type]
            this._tangentType = GL20Mapping.AttributeType[type]
            this._tangentOffset = vFormat.offsetAt(i)
            this._tangentIndex = vFormat.indexAt(AttributeUsage.TANGENT, 0)
        }

        for(unit = 0; unit < VertexFormat.MAX_TCOORD_UNITS; ++ unit)
        {
            i = vFormat.indexAt(AttributeUsage.TEXCOORD, unit)
            if(i >= 0)
            {
                this._hasTCoord[unit] = true
                type = vFormat.attributeTypeAt(i)
                this._tCoordChannels[unit] = GL20Mapping.AttributeChannels[type]
                this._tCoordType[unit] = GL20Mapping.AttributeType[type]
                this._tCoordOffset[unit] = vFormat.offsetAt(i)
                this._tCoordIndex[unit] = vFormat.indexAt(AttributeUsage.TEXCOORD, unit)
            }
        }

        for(unit = 0; unit < VertexFormat.MAX_COLOR_UNITS; ++ unit)
        {
            i = vFormat.indexAt(AttributeUsage.COLOR, unit)
            if(i >= 0)
            {
                this._hasColor[unit] = true
                type = vFormat.attributeTypeAt(i)
                this._colorChannels[unit] = GL20Mapping.AttributeChannels[type]
                this._colorType[unit] = GL20Mapping.AttributeType[type]
                this._colorOffset[unit] = vFormat.offsetAt(i)
                this._colorIndex[unit] = vFormat.indexAt(AttributeUsage.COLOR, unit)
            }
        }

        i = vFormat.indexAt(AttributeUsage.BLENDINDICES)
        if(i >= 0)
        {
            this._hasBlendIndices = true
            type = vFormat.attributeTypeAt(i)
            this._blendIndicesChannels = GL20Mapping.AttributeChannels[type]
            this._blendIndicesType = GL20Mapping.AttributeType[type]
            this._blendIndicesOffset = vFormat.offsetAt(i)
            this._blendIndicesIndex = vFormat.indexAt(AttributeUsage.BLENDINDICES, 0)
        }

        i = vFormat.indexAt(AttributeUsage.BLENDWEIGHT)
        if(i >= 0)
        {
            this._hasBlendWeight = true
            type = vFormat.attributeTypeAt(i)
            this._blendWeightChannels = GL20Mapping.AttributeChannels[type]
            this._blendWeightType = GL20Mapping.AttributeType[type]
            this._blendWeightOffset = vFormat.offsetAt(i)
            this._blendWeightIndex = vFormat.indexAt(AttributeUsage.BLENDWEIGHT, 0)
        }

        i = vFormat.indexAt(AttributeUsage.FOGCOORD)
        if(i >= 0)
        {
            this._hasFogCoord = true
            type = vFormat.attributeTypeAt(i)
            this._fogCoordChannels = GL20Mapping.AttributeChannels[type]
            this._fogCoordType = GL20Mapping.AttributeType[type]
            this._fogCoordOffset = vFormat.offsetAt(i)
            this._fogCoordIndex = vFormat.indexAt(AttributeUsage.FOGCOORD, 0)
        }

        i = vFormat.indexAt(AttributeUsage.PSIZE)
        if(i >= 0)
        {
            this._hasPSize = true
            type = vFormat.attributeTypeAt(i)
            this._pSizeChannels = GL20Mapping.AttributeChannels[type]
            this._pSizeType = GL20Mapping.AttributeType[type]
            this._pSizeOffset = vFormat.offsetAt(i)
            this._pSizeIndex = vFormat.indexAt(AttributeUsage.PSIZE, 0)
        }
    }

    public dispose(): void
    {
        console.log("Disposing vertex format")
    }

    public enable(renderer: Renderer): void
    {
        const gl = GL20.gl

        console.log("TODO: Complete enabling vertex format")

        if(this._hasPosition)
        {
            console.log("_hasPosition Type: ", this._positionType)
            gl.enableVertexAttribArray(0)
            gl.vertexAttribPointer(
                this._positionIndex, 
                this._positionChannels, 
                this._positionType, 
                false, 
                this._stride, 
                0 + this._positionOffset
            )
        }

        if(this._hasNormal)
        {
            console.log("_hasNormal Type: ", this._normalType)
            gl.enableVertexAttribArray(2)
            GL20.gl.vertexAttribPointer(
                this._normalIndex, 
                this._normalChannels, 
                this._normalType, 
                false, 
                this._stride, 
                0 + this._normalOffset
            )
        }

        if(this._hasTangent)
        {
            console.log("_hasTangent Type: ", this._tangentType)
            gl.enableVertexAttribArray(14)
            GL20.gl.vertexAttribPointer(
                this._tangentIndex, 
                this._tangentChannels, 
                this._tangentType, 
                false, 
                this._stride, 
                0 + this._tangentOffset
            )
        }

        if(this._hasBinormal)
        {
            console.log("_hasBinormal Type: ", this._binormalType)
            gl.enableVertexAttribArray(15)
            GL20.gl.vertexAttribPointer(
                this._binormalIndex, 
                this._binormalChannels, 
                this._binormalType, 
                false, 
                this._stride, 
                0 + this._binormalOffset
            )
        }

        for(let unit = 0; unit < VertexFormat.MAX_TCOORD_UNITS; ++unit)
        {
            if(this._hasTCoord[unit])
            {
                gl.activeTexture(gl.TEXTURE0 + unit)
                //gl.enable(WebGL2RenderingContext.TEXTURE_BINDING_2D_ARRAY)

                /*
                gl.enableVertexAttribArray(14)
                GL20.gl.vertexAttribPointer(
                    this._tangentIndex, 
                    this._tangentChannels, 
                    this._tangentType, 
                    false, 
                    this._stride, 
                    0 + this._tangentOffset
                )
                */
            }
        }

        if(this._hasColor[0])
        {
            gl.enableVertexAttribArray(gl.COLOR)
            gl.vertexAttribPointer(
                this._colorIndex[0], 
                this._colorChannels[0], 
                this._colorType[0], 
                false, 
                this._stride, 
                0 + this._colorOffset[0]
            )
        }

        if(this._hasColor[1])
        {
            gl.enableVertexAttribArray(gl.COLOR + 1)
            gl.vertexAttribPointer(
                this._colorIndex[1], 
                this._colorChannels[1], 
                this._colorType[1], 
                false, 
                this._stride, 
                0 + this._colorOffset[1]
            )
        }
    }

    public disable(renderer: Renderer): void
    {
        console.log("Disabling vertex format")

        const gl = GL20.gl

        if(this._hasPosition)
        {
            gl.disableVertexAttribArray(0)
        }

        if(this._hasNormal)
        {
            gl.disableVertexAttribArray(2)
        }

        if(this._hasTangent)
        {
            gl.disableVertexAttribArray(14)
        }

        if(this._hasBinormal)
        {
            gl.disableVertexAttribArray(15)
        }

        for(let unit = 0; unit < VertexFormat.MAX_TCOORD_UNITS; ++unit)
        {
            if(this._hasTCoord[unit])
            {
                gl.disableVertexAttribArray(gl.TEXTURE0 + unit)
            }
        }

        if(this._hasColor[0])
        {
            gl.disableVertexAttribArray(gl.COLOR)
        }

        if(this._hasColor[1])
        {
            gl.disableVertexAttribArray(gl.COLOR + 1)
        }
    }
}
