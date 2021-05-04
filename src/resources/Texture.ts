import { TextureFormat } from "./TextureFormat";
import { TextureType } from "./TextureType";
import { BufferUsage } from "./BufferUsage";
import { ByteArray } from "../core/ByteArray";
import { Disposable } from "../core/Disposable";

export abstract class Texture implements Disposable
{
    public static MAX_MIPMAP_LEVELS: number = 16
    public static MAX_USER_FIELDS: number = 8

    protected _format: TextureFormat
    protected _type: TextureType
    protected _usage: BufferUsage
    protected _numLevels: number

    protected _numDimensions: number
    protected _dimension: number[][] = []
    protected _numLevelBytes: number[] = []
    protected _numTotalBytes: number
    protected _levelOffsets: number[] = []

    protected _userField: number[] = []

    protected _data: ByteArray

    protected static msNumDimensions: number[] = [
        1,  // TEX_1D
        2,  // TEX_2D
        3,  // TEX_3D
        2   // TEX_CUBE
    ]

    protected static msPixelSize: number[] = [
        0,   // NONE
        2,   // R5G6B5
        2,   // A1R5G5B5
        2,   // A4R4G4B4
        1,   // A8
        1,   // L8
        2,   // A8L8
        3,   // R8G8B8
        4,   // A8R8G8B8
        4,   // A8B8G8R8
        2,   // L16
        4,   // G16R16
        8,   // A16B16G16R16
        2,   // R16F
        4,   // G16R16F
        8,   // A16B16G16R16F
        4,   // R32F
        8,   // G32R32F
        16,  // A32B32G32R32F,
        0,   // DXT1 (special handling)
        0,   // DXT3 (special handling)
        0,   // DXT5 (special handling)
        4    // D24S8
    ]

    protected static msMipmapable: boolean[] = [
        false,  // NONE
        true,   // R5G6B5
        true,   // A1R5G5B5
        true,   // A4R4G4B4
        true,   // A8
        true,   // L8
        true,   // A8L8
        true,   // R8G8B8
        true,   // A8R8G8B8
        true,   // A8B8G8R8
        true,   // L16
        true,   // G16R16
        true,   // A16B16G16R16
        true,   // R16F
        true,   // G16R16F
        true,   // A16B16G16R16F
        false,  // R32F
        false,  // G32R32F
        false,  // A32B32G32R32F,
        true,   // DXT1 (special handling)
        true,   // DXT3 (special handling)
        true,   // DXT5 (special handling)
        false   // D24S8
    ]

    // TODO conversions

    protected constructor(tFormat: TextureFormat, type: TextureType, usage: BufferUsage, numLevels: number)
    {
        this._format = tFormat
        this._type = type
        this._usage = usage
        this._numLevels = numLevels
        this._numDimensions = Texture.msNumDimensions[type]
        this._numTotalBytes = 0
        this._data = null

        this._dimension[0] = []
        this._dimension[1] = []
        this._dimension[2] = []

        for(let level: number = 0; level < Texture.MAX_MIPMAP_LEVELS; ++level)
        {
            this._dimension[0][level] = 0
            this._dimension[1][level] = 0
            this._dimension[2][level] = 0
            this._numLevelBytes[level] = 0
            this._levelOffsets[level] = 0
        }

        for(let i: number = 0; i < Texture.MAX_USER_FIELDS; ++i)
        {
            this._userField[i] = 0
        }
    }

    public dispose(): void
    {
        this._data = null
    }

    public get format(): TextureFormat
    {
        return this._format
    }

    public get textureType(): TextureType
    {
        return this._type
    }

    public get usage(): BufferUsage
    {
        return this._usage
    }

    public get numLevels(): number
    {
        return this._numLevels
    }

    public getDimension(i: number, level: number): number
    {
        return this._dimension[i][level]
    }

    public getNumLevelBytes(level: number): number
    {
        return this._numLevelBytes[level]
    }

    public get numTotalBytes(): number
    {
        return this._numTotalBytes
    }

    public levelOffset(level: number): number
    {
        return this._levelOffsets[level]
    }

    public get pixelSize(): number
    {
        return Texture.msPixelSize[this._format]
    }

    public get isCompressed(): boolean
    {
        return this._format == TextureFormat.DXT1 || this._format == TextureFormat.DXT3 || this._format == TextureFormat.DXT5
    }

    public get isMipmapable(): boolean
    {
        return Texture.msMipmapable[this._format]
    }

    public get data(): ByteArray
    {
        return this._data
    }

    public setUserField(i: number, userField: number): void
    {
        this._userField[i] = userField
    }

    public getUserField(i: number): number
    {
        return this._userField[i]
    }
}