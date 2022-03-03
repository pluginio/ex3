import { Texture } from "./Texture";
import { TextureFormat } from "./TextureFormat";
import { BufferUsage } from "./BufferUsage";
import { TextureType } from "./TextureType";
import { MathExt } from "../utils/MathExt";
import { ByteArray } from "../core/ByteArray";
import { Renderer } from "../renderers/Renderer";

export class Texture3D extends Texture
{
    public constructor(tFormat: TextureFormat, dimension0: number, dimension1: number,
        dimension2: number, numLevels: number, usage: BufferUsage)
    {
        super(tFormat, TextureType.TEX_3D, usage, numLevels)

        console.assert(dimension0 > 0, "Dimension0 must be positive")
        console.assert(dimension1 > 0, "Dimension1 must be positive")
        console.assert(dimension2 > 0, "Dimension2 must be positive")

        this._dimension[0][0] = dimension0
        this._dimension[1][0] = dimension1
        this._dimension[2][0] = dimension2

        let logDim0: number = MathExt.log2OfPowerOfTwo(dimension0)
        let logDim1: number = MathExt.log2OfPowerOfTwo(dimension1)
        let logDim2: number = MathExt.log2OfPowerOfTwo(dimension2)

        let maxLevels: number = logDim0
        if(logDim1 > maxLevels)
        {
            maxLevels = logDim1
        }
        if(logDim2 > maxLevels)
        {
            maxLevels = logDim2
        }
        ++maxLevels

        if(numLevels == 0)
        {
            this._numLevels = maxLevels
        }
        else if(numLevels <= maxLevels)
        {
            this._numLevels = numLevels
        }

        this.computeNumLevelBytes()
        this._data = new ByteArray(this._numTotalBytes)
    }

    public dispose(): void
    {
        Renderer.unbindAllTexture3D(this)
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

    public get thickness(): number
    {
        return this.getDimension(2, 0)
    }

    public generateMipmaps(): void
    {
        // TODO generate mipmaps
        throw new Error("Not implemented")
    }

    public get hasMipmaps(): boolean
    {
        let logDim0: number = MathExt.log2OfPowerOfTwo(this._dimension[0][0]);
        let logDim1: number = MathExt.log2OfPowerOfTwo(this._dimension[1][0]);
        let logDim2: number = MathExt.log2OfPowerOfTwo(this._dimension[2][0]);
        let maxLevels: number = logDim0
        if(logDim1 > maxLevels)
        {
            maxLevels = logDim1;
        }
        if(logDim2 > maxLevels)
        {
            maxLevels = logDim2;
        }
        ++maxLevels;
        return this._numLevels == maxLevels;
    }

    public getData(level: number): ByteArray
    {
        if (this._data && 0 <= level && level < this._numLevels)
        {
            this._data.position = this._levelOffsets[level];
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
                console.assert(false, "No mipmaps for 32-bit float textures");
                this._numLevels = 1;
            }
        }
        else if (this._format == TextureFormat.DXT1 || this._format == TextureFormat.DXT3 || this._format == TextureFormat.DXT5)
        {
            console.assert(false, "No DXT compression for 1D textures");
            this._numLevels = 1;
        }
        else if (this._format == TextureFormat.D24S8)
        {
            console.assert(false, "Depth textures must be 2D");
            this._numLevels = 1;
        }
    
        let level: number = 0
        let dim0: number = this._dimension[0][0];
        let dim1: number = this._dimension[1][0];
        let dim2: number = this._dimension[2][0];
        this._numTotalBytes = 0;
        for (level = 0; level < this._numLevels; ++level)
        {
            this._numLevelBytes[level] = Texture.msPixelSize[this._format]*dim0*dim1*dim2;
            this._numTotalBytes += this._numLevelBytes[level];
            this._dimension[0][level] = dim0;
            this._dimension[1][level] = dim1;
            this._dimension[2][level] = dim2;
    
            if (dim0 > 1)
            {
                dim0 >>= 1;
            }
            if (dim1 > 1)
            {
                dim1 >>= 1;
            }
            if (dim2 > 1)
            {
                dim2 >>= 1;
            }
        }
    
        this._levelOffsets[0] = 0;
        for (level = 0; level < this._numLevels-1; ++level)
        {
            this._levelOffsets[level+1] = this._levelOffsets[level] + this._numLevelBytes[level];
        }
    }

    protected generateNextMipmap(width: number, height: number, thickness: number,
        texels: ByteArray, widthNext: number, heightNext: number, thicknessNext: number,
        texlesNext: ByteArray, rgba: number[])
    {
        // TODO generate next mipmap
        throw new Error("Not implemented")
    }
}