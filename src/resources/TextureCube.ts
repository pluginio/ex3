import { Texture } from "./Texture";
import { TextureFormat } from "./TextureFormat";
import { BufferUsage } from "./BufferUsage";
import { TextureType } from "./TextureType";
import { ByteArray } from "../core/ByteArray";
import { MathExt } from "../utils/MathExt";
import { Renderer } from "../renderers/Renderer";

export class TextureCube extends Texture
{
    public constructor(tFormat: TextureFormat, dimension: number, numLevels: number,
        usage: BufferUsage = BufferUsage.TEXTURE)
    {
        super(tFormat, TextureType.CUBE, usage, numLevels)

        console.assert(dimension > 0, "Dimension must be positive")
        this._dimension[0][0] = dimension
        this._dimension[1][0] = dimension

        let logDim: number = MathExt.log2OfPowerOfTwo(dimension)
        let maxLevels: number = logDim + 1

        if (numLevels == 0)
        {
            // The user wants the maximum number of levels.
            this._numLevels = maxLevels;
        }
        else if (numLevels <= maxLevels)
        {
            // The user wants the specified number of levels.
            this._numLevels = numLevels;
        }
        else
        {
            console.assert(false, "Invalid number of levels\n");
        }

        this.computeNumLevelBytes();
        this._data = new ByteArray(this._numTotalBytes);
    }

    public dispose(): void
    {
        Renderer.unbindAllTextureCube(this)
        super.dispose()
    }

    public get width(): number
    {
        return this.getDimension(0, 0)
    }

    public get height(): number
    {
        return this.getDimension(1, 0)
    }

    public generateMipmaps(): void
    {
        // TODO generate next mipmap
        throw new Error("Not implemented")
    }   
    
    public get hasMipmaps(): boolean
    {
        let logDim: number = MathExt.log2OfPowerOfTwo(this._dimension[0][0]);
        let maxLevels: number = logDim + 1;
        return this._numLevels == maxLevels;
    }

    public getData(face: number, level: number): ByteArray
    {
        if (this._data && 0 <= face && face < 6 && 0 <= level && level < this._numLevels)
        {
            let faceOffset = face * this._numTotalBytes/6
            this._data.position = faceOffset + this._levelOffsets[level]
            return this._data
        }
    
        console.assert(false, "Null pointer or invalid level in GetData")
        return null
    }

    protected computeNumLevelBytes(): void
    {
        if (this._format == TextureFormat.R32F
            ||  this._format == TextureFormat.G32R32F
            ||  this._format == TextureFormat.A32B32G32R32F)
            {
                if (this._numLevels > 1)
                {
                    console.assert(false, "No mipmaps for 32-bit float textures")
                    this._numLevels = 1
                }
            }
            else if (this._format == TextureFormat.D24S8)
            {
                if (this._numLevels > 1)
                {
                    console.assert(false, "No mipmaps for 2D depth textures")
                    this._numLevels = 1
                }
            }
        
            let dim0: number = this._dimension[0][0];
            let dim1: number = this._dimension[1][0];
            let level: number = 0
            this._numTotalBytes = 0
        
            if (this._format == TextureFormat.DXT1)
            {
                for (level = 0; level < this._numLevels; ++level)
                {
                    let max0 = dim0/4
                    if (max0 < 1)
                    {
                        max0 = 1
                    }
                    let max1 = dim1/4
                    if (max1 < 1)
                    {
                        max1 = 1
                    }
        
                    this._numLevelBytes[level] = 8 * max0 * max1
                    this._numTotalBytes += this._numLevelBytes[level]
                    this._dimension[0][level] = dim0
                    this._dimension[1][level] = dim1
        
                    if (dim0 > 1)
                    {
                        dim0 >>= 1
                    }
                    if (dim1 > 1)
                    {
                        dim1 >>= 1
                    }
                }
            }
            else if (this._format == TextureFormat.DXT3 || this._format == TextureFormat.DXT5)
            {
                for (level = 0; level < this._numLevels; ++level)
                {
                    let max0 = dim0/4;
                    if (max0 < 1)
                    {
                        max0 = 1
                    }
                    let max1 = dim1/4;
                    if (max1 < 1)
                    {
                        max1 = 1
                    }
        
                    this._numLevelBytes[level] = 16*max0*max1
                    this._numTotalBytes += this._numLevelBytes[level]
                    this._dimension[0][level] = dim0
                    this._dimension[1][level] = dim1
        
                    if (dim0 > 1)
                    {
                        dim0 >>= 1
                    }
                    if (dim1 > 1)
                    {
                        dim1 >>= 1
                    }
                }
            }
            else
            {
                for (level = 0; level < this._numLevels; ++level)
                {
                    this._numLevelBytes[level] = Texture.msPixelSize[this._format]*dim0*dim1
                    this._numTotalBytes += this._numLevelBytes[level]
                    this._dimension[0][level] = dim0
                    this._dimension[1][level] = dim1
        
                    if (dim0 > 1)
                    {
                        dim0 >>= 1
                    }
                    if (dim1 > 1)
                    {
                        dim1 >>= 1
                    }
                }
            }
        
            this._numTotalBytes *= 6;
        
            this._levelOffsets[0] = 0;
            for (level = 0; level < this._numLevels-1; ++level)
            {
                this._levelOffsets[level+1] = this._levelOffsets[level] + this._numLevelBytes[level];
            }
    }

    protected generateNextMipmap(dimension: number, texels: ByteArray, dimensionNext: number,
        texelsNext: ByteArray, rgba: number[])
    {
        // TODO generate next mipmap
        throw new Error("Not implemented")
    }
}