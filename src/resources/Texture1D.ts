import {Texture} from './Texture'
import { TextureFormat } from './TextureFormat'
import { BufferUsage } from './BufferUsage'
import { ByteArray } from '../core/ByteArray'
import { TextureType } from './TextureType'
import { MathExt } from '../utils/MathExt'

export class Texture1D extends Texture
{


    public constructor(tFormat: TextureFormat, dimension0: number, numLevels: number,
        usage: BufferUsage = BufferUsage.TEXTURE)
    {
        super(tFormat, TextureType.TEX_1D, usage, numLevels)
        this._dimension[0][0] = dimension0

        let logDim0: number = MathExt.log2OfPowerOfTwo(dimension0)
        let maxLevels: number = logDim0 + 1

        if(numLevels == 0)
        {
            this._numLevels = maxLevels
        }
        else if(numLevels <= maxLevels)
        {
            this._numLevels = numLevels
        }
        else
        {
            console.assert(false, "Invalid number of levels")
        }

        this.computeNumLevelBytes()
        this._data = new ByteArray(this._numTotalBytes)
    }

    public dispose(): void
    {
        // TODO Renderer.unbindAllTexture1D(this)
        super.dispose()
    }

    public get length(): number
    {
        return this.getDimension(0, 0)
    }

    public generateMipmaps(): void
    {
        // TODO generate mipmaps
        throw new Error("Not implemented")
    }

    public get hasMipmaps(): boolean
    {
        let logDim0: number = MathExt.log2OfPowerOfTwo(this._dimension[0][0])
        let maxLevels: number = logDim0 + 1
        return this._numLevels == maxLevels
    }

    public getData(level: number): ByteArray
    {
        if(this._data && 0 <= level && level < this._numLevels)
        {
            this._data.position = this._levelOffsets[level]
            return this._data
        }
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
                    this._numLevels = 1;
                }
            }
            else if (this._format == TextureFormat.DXT1 
                || this._format == TextureFormat.DXT3 
                || this._format == TextureFormat.DXT5)
            {
                console.assert(false, "No DXT compression for 1D textures")
                this._numLevels = 1;
            }
            else if (this._format == TextureFormat.D24S8)
            {
                console.assert(false, "Depth textures must be 2D");
                this._numLevels = 1;
            }
        
            let level: number = 0
            let dim0: number = this._dimension[0][0];
            this._numTotalBytes = 0;
            for (level = 0; level < this._numLevels; ++level)
            {
                this._numLevelBytes[level] = Texture.msPixelSize[this._format]*dim0;
                this._numTotalBytes += this._numLevelBytes[level];
                this._dimension[0][level] = dim0;
                this._dimension[1][level] = 1;
                this._dimension[2][level] = 1;
        
                if (dim0 > 1)
                {
                    dim0 >>= 1;
                }
            }
        
            this._levelOffsets[0] = 0;
            for (level = 0; level < this._numLevels-1; ++level)
            {
                this._levelOffsets[level+1] = this._levelOffsets[level] + this._numLevelBytes[level];
            }
    }

    protected generateNetxMipmap(length: number, texels: ByteArray, lengthNext: number,
        texelsNext: ByteArray, rgba: number[])
    {
        // TODO generate next mipmaps
        throw new Error("Not implemented")
    }
}