import { TextureFormat } from "./TextureFormat";
import { Texture2D } from "./Texture2D";
import { Disposable } from "../core/Disposable";
import { BufferUsage } from "./BufferUsage";
import { Renderer } from "../renderers/Renderer";

export class RenderTarget implements Disposable
{
    protected _numTargets: number
    protected _colorTextures: Texture2D[] = []
    protected _depthStencilTexture: Texture2D
    protected _hasMipmaps: boolean

    public constructor(numTargets: number, tFormat: TextureFormat, width: number, height: number,
        hasMipmaps: boolean, hasDepthStencil: boolean)
    {
        this._numTargets = numTargets
        this._hasMipmaps = hasMipmaps

        console.assert(this._numTargets > 0, "Number of targets must be at least one")

        let i: number = 0
        for(i = 0; i < this._numTargets; ++i)
        {
            this._colorTextures[i] = new Texture2D(tFormat, width, height, (hasMipmaps ? 0 : 1), BufferUsage.RENDERTARGET)
        }
        
        if(hasDepthStencil)
        {
            this._depthStencilTexture = new Texture2D(TextureFormat.D24S8, width, height, 1, BufferUsage.DEPTHSTENCIL)
        }
    }

    public dispose(): void
    {
        Renderer.unbindAllRenderTarget(this)
        this._colorTextures = null
    }

    public get numTargets(): number
    {
        return this._numTargets
    }

    public get format(): TextureFormat
    {
        return this._colorTextures[0].format
    }

    public get width(): number
    {
        return this._colorTextures[0].width
    }

    public get height(): number
    {
        return this._colorTextures[0].height
    }

    public getColorTexture(i: number): Texture2D
    {
        return this._colorTextures[i]
    }

    public getDepthStencilTexture(): Texture2D
    {
        return this._depthStencilTexture
    }

    public get hasMipmaps(): boolean
    {
        return this.hasMipmaps
    }

    public get hasDepthStencil(): boolean
    {
        return this._depthStencilTexture != null
    }
}