import { Resources as WebGL_10 } from 'renderers/webgl_10/Resources';
import { Resources as WebGL_20 } from 'renderers/webgl_20/Resources';
import { IndexBuffer } from "resources/IndexBuffer";
import { Texture1D } from "resources/Texture1D";
import { Texture2D } from "resources/Texture2D";
import { Texture3D } from "resources/Texture3D";
import { VertexBuffer } from "resources/VertexBuffer";
import { VertexFormat } from "resources/VertexFormat";
import { IIndexBuffer } from "./interfaces/IIndexBuffer";
import { ITexture1D } from "./interfaces/ITexture1D";
import { ITexture2D } from "./interfaces/ITexture2D";
import { ITexture3D } from "./interfaces/ITexture3D";
import { IVertexBuffer } from "./interfaces/IVertexBuffer";
import { IVertexFormat } from "./interfaces/IVertexFormat";
import { IVertexShader } from "./interfaces/IVertexShader";
import { IPixelShader } from "./interfaces/IPixelShader";
import { RendererType } from "./RendererType";
import { TextureCube } from 'resources/TextureCube';
import { ITextureCube } from './interfaces/ITextureCube';
import { RenderTarget } from 'resources/RenderTarget';
import { IRenderTarget } from './interfaces/IRenderTarget';
import { VertexShader } from 'shaders/VertexShader';
import { PixelShader } from 'shaders/PixelShader';
import { BufferLocking } from "../resources/BufferLocking"
import { TextureFormat } from 'resources/TextureFormat';
import { AlphaState } from 'shaders/states/AlphaState';
import { CullState } from 'shaders/states/CullState';
import { DepthState } from 'shaders/states/DepthState';
import { OffsetState } from 'shaders/states/OffsetState';
import { StencilState } from 'shaders/states/StencilState';
import { WireState } from 'shaders/states/WireState';
import { Camera } from 'display/Camera';
import { RendererInput } from './webgl_20/RendererInput';
import { ByteArray } from 'core/ByteArray';
import { Visual } from 'display/Visual';
import { RendererData } from './webgl_20/RendererData';
import { Matrix } from 'geom/Matrix';
import { Vector } from 'geom/Vector';
import { Point } from 'geom/Point';
import { VisibleSet } from 'display/VisibleSet';
import { GlobalEffect } from 'effects/global/GlobalEffect';
import { VisualEffectInstance } from 'shaders/VisualEffectInstance';
import { VisualPass } from 'shaders/VisualPass';
import { ShaderParameters } from 'shaders/ShaderParameters';

export abstract class Renderer
{
    protected static RESET_STATE_AFTER_DRAW: boolean = false

    protected _width: number
    protected _height: number
    protected _colorFormat: TextureFormat
    protected _depthStencilFormat: TextureFormat
    protected _numMultisamples: number

    protected _defaultAlphaState: AlphaState
    protected _defaultCullState: CullState
    protected _defaultDepthState: DepthState
    protected _defaultOffsetState: OffsetState
    protected _defaultStencilState: StencilState
    protected _defaultWireState: WireState

    protected _alphaState: AlphaState
    protected _cullState: CullState
    protected _depthState: DepthState
    protected _offsetState: OffsetState
    protected _stencilState: StencilState
    protected _wireState: WireState
    protected _reverseCullOrder: boolean

    protected _overrideAlphaState: AlphaState
    protected _overrideCullState: CullState
    protected _overrideDepthState: DepthState
    protected _overrideOffsetState: OffsetState
    protected _overrideStencilState: StencilState
    protected _overrideWireState: WireState

    protected _camera: Camera

    protected _clearColor: number[] = []
    protected _clearDepth: number
    protected _clearStencil: number

    protected _allowRed: boolean
    protected _allowGreen: boolean
    protected _allowBlue: boolean
    protected _allowAlpha: boolean

    protected _vertexFormats: Map<VertexFormat, IVertexFormat> = new Map<VertexFormat, IVertexFormat>()
    protected _vertexBuffers: Map<VertexBuffer, IVertexBuffer> = new Map<VertexBuffer, IVertexBuffer>()
    protected _indexBuffers: Map<IndexBuffer, IIndexBuffer> = new Map<IndexBuffer, IIndexBuffer>()
    protected _texture1Ds: Map<Texture1D, ITexture1D> = new Map<Texture1D, ITexture1D>()
    protected _texture2Ds: Map<Texture2D, ITexture2D> = new Map<Texture2D, ITexture2D>()
    protected _texture3Ds: Map<Texture3D, ITexture3D> = new Map<Texture3D, ITexture3D>()
    protected _textureCubes: Map<TextureCube, ITextureCube> = new Map<TextureCube, ITextureCube>()
    protected _renderTargets: Map<RenderTarget, IRenderTarget> = new Map<RenderTarget, IRenderTarget>()
    protected _vertexShaders: Map<VertexShader, IVertexShader> = new Map<VertexShader, IVertexShader>()
    protected _pixelShaders: Map<PixelShader, IPixelShader> = new Map<PixelShader, IPixelShader>()



    protected static msRendererType: RendererType = RendererType.WEBGL_20

    public _indexBuffer: IIndexBuffer

    private static msRenderers: Renderer[] = []


    public initialize(width: number, height: number, colorFormat: TextureFormat,
        depthStencilFormat: TextureFormat, numMultisamples: number): void
    {
        console.assert(width > 0, "Width must be positive")
        console.assert(height > 0, "Height must be positive")
        console.assert(depthStencilFormat == TextureFormat.D24S8, "Only 24-bit depth and 8-bit stencil are currently supported")
        console.assert(numMultisamples == 0 || numMultisamples == 2 || numMultisamples == 4, "The number of multisamples can be only 0, 2, or 4")
        
        this._width = width
        this._height = height
        this._colorFormat = colorFormat
        this._depthStencilFormat = depthStencilFormat
        this._numMultisamples = numMultisamples

        this._defaultAlphaState = new AlphaState()
        this._defaultCullState = new CullState()
        this._defaultDepthState = new DepthState()
        this._defaultOffsetState = new OffsetState()
        this._defaultStencilState = new StencilState()
        this._defaultWireState = new WireState()

        this._alphaState = this._defaultAlphaState
        this._cullState = this._defaultCullState
        this._depthState = this._defaultDepthState
        this._offsetState = this._defaultOffsetState
        this._stencilState = this._defaultStencilState
        this._wireState = this._defaultWireState

        this._reverseCullOrder = false
        
        this._clearColor = [1, 1, 1, 1]
        this._clearDepth = 1
        this._clearStencil  = 0

        this._allowRed = true
        this._allowGreen = true
        this._allowBlue = true
        this._allowAlpha = true

        Renderer.msRenderers.push(this)
    }

    public terminate(): void
    {
        this._defaultAlphaState = null
        this._defaultCullState = null
        this._defaultDepthState = null
        this._defaultOffsetState = null
        this._defaultStencilState = null
        this._defaultWireState = null

        this.destroyAllVertexFormats();
        this.destroyAllVertexBuffers();
        this.destroyAllIndexBuffers();
        this.destroyAllTexture1Ds();
        this.destroyAllTexture2Ds();
        this.destroyAllTexture3Ds();
        this.destroyAllTextureCubes();
        this.destroyAllRenderTargets();
        this.destroyAllVertexShaders();
        this.destroyAllPixelShaders();

        let index: number = Renderer.msRenderers.indexOf(this)
        Renderer.msRenderers[index] = null
    }

    public get width(): number
    {
        return this._width
    }

    public get height(): number
    {
        return this._height
    }

    public get colorFormat(): TextureFormat
    {
        return this._colorFormat
    }

    public get depthStencilFormat(): TextureFormat
    {
        return this._depthStencilFormat
    }

    public get numMultisamples(): number
    {
        return this._numMultisamples
    }

    private get Resource()
    {
        switch(Renderer.msRendererType)
        {
            case RendererType.WEBGL_10:
                return WebGL_10
            case  RendererType.WEBGL_20:
                return WebGL_20
            default:
                return WebGL_20
        }
    }

    ////////////////////////////////////////////////////
    // vertex format
    ////////////////////////////////////////////////////
    public bindVertexFormat(vFormat: VertexFormat): void
    {
        if(!this._vertexFormats.has(vFormat))
        {
            this._vertexFormats.set(vFormat, new this.Resource.vertexFormat(this, vFormat))
        }
    }

    public static bindAllVertexFormat(vFormat: VertexFormat): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.bindVertexFormat(vFormat)
        });
    }

    public unbindVertexFormat(vFormat: VertexFormat): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.unbindVertexFormat(vFormat)
        });
    }

    public static unbindAllVertexFormat(vFormat: VertexFormat): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.unbindVertexFormat(vFormat)
        });
    }

    public enableVertexFormat(vFormat: VertexFormat): void
    {
        let pdrVertexFormat: IVertexFormat

        if(this._vertexFormats.has(vFormat))
        {
            pdrVertexFormat = this._vertexFormats.get(vFormat)
        }
        else
        {
            pdrVertexFormat = new this.Resource.vertexFormat(this, vFormat)
        }

        pdrVertexFormat.enable(this)
    }

    public disableVertexFormat(vFormat: VertexFormat): void
    {
        if(this._vertexFormats.has(vFormat))
        {
            this._vertexFormats.get(vFormat).disable(this)
        }
    }

    ////////////////////////////////////////////////////
    // vertex buffer
    ////////////////////////////////////////////////////
    public bindVertexBuffer(vBuffer: VertexBuffer): void
    {
        if(!this._vertexBuffers.has(vBuffer))
        {
            this._vertexBuffers.set(vBuffer, new this.Resource.vertexBuffer(this, vBuffer))
        }
    }

    public static bindAllVertexBuffer(vBuffer: VertexBuffer): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.bindVertexBuffer(vBuffer)
        });
    }

    public unbindVertexBuffer(vBuffer: VertexBuffer): void
    {
        if(this._vertexBuffers.has(vBuffer))
        {
            this._vertexBuffers.delete(vBuffer)
        }
    }

    public static unbindAllVertexBuffer(vBuffer: VertexBuffer): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.unbindVertexBuffer(vBuffer)
        });
    }

    public enableVertexBuffer(vBuffer: VertexBuffer, streamIndex: number = 0, offset: number = 0): void
    {
        let pdrVertexBuffer: IVertexBuffer

        if(this._vertexBuffers.has(vBuffer))
        {
            pdrVertexBuffer = this._vertexBuffers.get(vBuffer)
        }
        else
        {
            pdrVertexBuffer = new this.Resource.vertexBuffer(this, vBuffer)
        }

        pdrVertexBuffer.enable(this, streamIndex, offset)
    }

    public disableVertexBuffer(vBuffer: VertexBuffer, streamIndex: number = 0): void
    {
        if(this._vertexBuffers.has(vBuffer))
        {
            this._vertexBuffers.get(vBuffer).disable(this, streamIndex)
        }
    }

    public lockVertexBuffer(vBuffer: VertexBuffer, mode: BufferLocking): void
    {
        let pdrVertexBuffer: IVertexBuffer

        if(this._vertexBuffers.has(vBuffer))
        {
            pdrVertexBuffer = this._vertexBuffers.get(vBuffer)
        }
        else
        {
            pdrVertexBuffer = new this.Resource.vertexBuffer(this, vBuffer)
        }

        pdrVertexBuffer.lock(mode)
    }

    public unlockVertexBuffer(vBuffer: VertexBuffer): void
    {
        if(this._vertexBuffers.has(vBuffer))
        {
            this._vertexBuffers.get(vBuffer).unlock()
        }
    }

    public updateVertexBuffer(vBuffer: VertexBuffer): void
    {
        // no need to lock or unlock memory here as we are using JS - consider workers later
        console.log("TODO Updating vBuffer")
    }

    public static updateAllVertexBuffer(vBuffer: VertexBuffer): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.updateVertexBuffer(vBuffer)
        });
    }


    ////////////////////////////////////////////////////
    // index buffer
    ////////////////////////////////////////////////////
    public bindIndexBuffer(iBuffer: IndexBuffer): void
    {
        if(!this._indexBuffers.has(iBuffer))
        {
            this._indexBuffers.set(iBuffer, new this.Resource.indexBuffer(this, iBuffer))
        }
    }

    public static bindAllIndexBuffer(iBuffer: IndexBuffer): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.bindIndexBuffer(iBuffer)
        });
    }

    public unbindIndexBuffer(iBuffer: IndexBuffer): void
    {
        if(this._indexBuffers.has(iBuffer))
        {
            this._indexBuffers.delete(iBuffer)
        }
    }

    public static unbindAllIndexBuffer(iBuffer: IndexBuffer): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.unbindIndexBuffer(iBuffer)
        });
    }

    public enableIndexBuffer(iBuffer: IndexBuffer): void
    {
        let pdrIndexBuffer: IIndexBuffer

        if(this._indexBuffers.has(iBuffer))
        {
            pdrIndexBuffer = this._indexBuffers.get(iBuffer)
        }
        else
        {
            pdrIndexBuffer = new this.Resource.indexBuffer(this, iBuffer)
        }

        pdrIndexBuffer.enable(this)
    }

    public disableIndexBuffer(iBuffer: IndexBuffer): void
    {
        if(this._indexBuffers.has(iBuffer))
        {
            this._indexBuffers.get(iBuffer).disable(this)
        }
    }

    public lockIndexBuffer(iBuffer: IndexBuffer, mode: BufferLocking): void
    {
        let pdrIndexBuffer: IIndexBuffer

        if(this._indexBuffers.has(iBuffer))
        {
            pdrIndexBuffer = this._indexBuffers.get(iBuffer)
        }
        else
        {
            pdrIndexBuffer = new this.Resource.indexBuffer(this, iBuffer)
        }

        pdrIndexBuffer.lock(mode)
    }

    public unlockIndexBuffer(iBuffer: IndexBuffer): void
    {
        if(this._indexBuffers.has(iBuffer))
        {
            this._indexBuffers.get(iBuffer).unlock()
        }
    }

    public updateIndexBuffer(iBuffer: IndexBuffer): void
    {
        // no need to lock or unlock memory here as we are using JS - consider workers later
        console.log("TODO Updating iBuffer")
    }

    public static updateAllIndexBuffer(iBuffer: IndexBuffer): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.updateIndexBuffer(iBuffer)
        });
    }


    ////////////////////////////////////////////////////
    // texture 1D
    ////////////////////////////////////////////////////
    public bindTexture1D(texture: Texture1D): void
    {
        if(!this._texture1Ds.has(texture))
        {
            this._texture1Ds.set(texture, new this.Resource.texture1D(this, texture))
        }
    }

    public static bindAllTexture1D(texture: Texture1D): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.bindTexture1D(texture)
        });
    }

    public unbindTexture1D(texture: Texture1D): void
    {
        if(this._texture1Ds.has(texture))
        {
            this._texture1Ds.delete(texture)
        }
    }

    public static unbindAllTexture1D(texture: Texture1D): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.unbindTexture1D(texture)
        });
    }

    public enableTexture1D(texture: Texture1D, textureUnit: number): void
    {
        let pdrTexture1D: ITexture1D

        if(this._texture1Ds.has(texture))
        {
            pdrTexture1D = this._texture1Ds.get(texture)
        }
        else
        {
            pdrTexture1D = new this.Resource.texture1D(this, texture)
        }

        pdrTexture1D.enable(this, textureUnit)
    }

    public disableTexture1D(texture: Texture1D, textureUnit: number): void
    {
        if(this._texture1Ds.has(texture))
        {
            this._texture1Ds.get(texture).disable(this, textureUnit)
        }
    }

    public lockTexture1D(texture: Texture1D, level: number, mode: BufferLocking): void
    {
        let pdrTexture1D: ITexture1D

        if(this._texture1Ds.has(texture))
        {
            pdrTexture1D = this._texture1Ds.get(texture)
        }
        else
        {
            pdrTexture1D = new this.Resource.texture1D(this, texture)
        }

        pdrTexture1D.lock(level, mode)
    }

    public unlockTexture1D(texture: Texture1D, level: number): void
    {
        if(this._texture1Ds.has(texture))
        {
            this._texture1Ds.get(texture).unlock(level)
        }
    }

    public updateTexture1D(texture: Texture1D, level: number): void
    {
        // no need to lock or unlock memory here as we are using JS - consider workers later
        console.log("TODO Updating Texture1D")
    }

    public static updateAllTexture1D(texture: Texture1D, level: number): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.updateTexture1D(texture, level)
        });
    }


    ////////////////////////////////////////////////////
    // texture 2D
    ////////////////////////////////////////////////////
    public bindTexture2D(texture: Texture2D): void
    {
        if(!this._texture2Ds.has(texture))
        {
            this._texture2Ds.set(texture, new this.Resource.texture2D(this, texture))
        }
    }

    public static bindAllTexture2D(texture: Texture2D): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.bindTexture2D(texture)
        });
    }

    public unbindTexture2D(texture: Texture2D): void
    {
        if(this._texture2Ds.has(texture))
        {
            this._texture2Ds.delete(texture)
        }
    }

    public static unbindAllTexture2D(texture: Texture2D): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.unbindTexture2D(texture)
        });
    }

    public enableTexture2D(texture: Texture2D, textureUnit: number): void
    {
        let pdrTexture2D: ITexture2D

        if(this._texture2Ds.has(texture))
        {
            pdrTexture2D = this._texture2Ds.get(texture)
        }
        else
        {
            pdrTexture2D = new this.Resource.texture2D(this, texture)
        }

        pdrTexture2D.enable(this, textureUnit)
    }

    public disableTexture2D(texture: Texture2D, textureUnit: number): void
    {
        if(this._texture2Ds.has(texture))
        {
            this._texture2Ds.get(texture).disable(this, textureUnit)
        }
    }

    public lockTexture2D(texture: Texture2D, level: number, mode: BufferLocking): void
    {
        let pdrTexture2D: ITexture2D

        if(this._texture2Ds.has(texture))
        {
            pdrTexture2D = this._texture2Ds.get(texture)
        }
        else
        {
            pdrTexture2D = new this.Resource.texture2D(this, texture)
        }

        pdrTexture2D.lock(level, mode)
    }

    public unlockTexture2D(texture: Texture2D, level: number): void
    {
        if(this._texture2Ds.has(texture))
        {
            this._texture2Ds.get(texture).unlock(level)
        }
    }

    public updateTexture2D(texture: Texture2D, level: number): void
    {
        // no need to lock or unlock memory here as we are using JS - consider workers later
        console.log("TODO Updating Texture2D")
    }

    public static updateAllTexture2D(texture: Texture2D, level: number): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.updateTexture2D(texture, level)
        });
    }

    ////////////////////////////////////////////////////
    // texture 3D
    ////////////////////////////////////////////////////
    public bindTexture3D(texture: Texture3D): void
    {
        if(!this._texture3Ds.has(texture))
        {
            this._texture3Ds.set(texture, new this.Resource.texture3D(this, texture))
        }
    }

    public static bindAllTexture3D(texture: Texture3D): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.bindTexture3D(texture)
        });
    }

    public unbindTexture3D(texture: Texture3D): void
    {
        if(this._texture3Ds.has(texture))
        {
            this._texture3Ds.delete(texture)
        }
    }

    public static unbindAllTexture3D(texture: Texture3D): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.unbindTexture3D(texture)
        });
    }

    public enableTexture3D(texture: Texture3D, textureUnit: number): void
    {
        let pdrTexture3D: ITexture3D

        if(this._texture3Ds.has(texture))
        {
            pdrTexture3D = this._texture3Ds.get(texture)
        }
        else
        {
            pdrTexture3D = new this.Resource.texture3D(this, texture)
        }

        pdrTexture3D.enable(this, textureUnit)
    }

    public disableTexture3D(texture: Texture3D, textureUnit: number): void
    {
        if(this._texture3Ds.has(texture))
        {
            this._texture3Ds.get(texture).disable(this, textureUnit)
        }
    }

    public lockTexture3D(texture: Texture3D, level: number, mode: BufferLocking): void
    {
        let pdrTexture3D: ITexture3D

        if(this._texture3Ds.has(texture))
        {
            pdrTexture3D = this._texture3Ds.get(texture)
        }
        else
        {
            pdrTexture3D = new this.Resource.texture3D(this, texture)
        }

        pdrTexture3D.lock(level, mode)
    }

    public unlockTexture3D(texture: Texture3D, level: number): void
    {
        if(this._texture3Ds.has(texture))
        {
            this._texture3Ds.get(texture).unlock(level)
        }
    }

    public updateTexture3D(texture: Texture3D, level: number): void
    {
        // no need to lock or unlock memory here as we are using JS - consider workers later
        console.log("TODO Updating Texture3D")
    }

    public static updateAllTexture3D(texture: Texture3D, level: number): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.updateTexture3D(texture, level)
        });
    }


    ////////////////////////////////////////////////////
    // texture cube
    ////////////////////////////////////////////////////
    public bindTextureCube(texture: TextureCube): void
    {
        if(!this._textureCubes.has(texture))
        {
            this._textureCubes.set(texture, new this.Resource.textureCube(this, texture))
        }
    }

    public static bindAllTextureCube(texture: TextureCube): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.bindTextureCube(texture)
        });
    }

    public unbindTextureCube(texture: TextureCube): void
    {
        if(this._textureCubes.has(texture))
        {
            this._textureCubes.delete(texture)
        }
    }

    public static unbindAllTextureCube(texture: TextureCube): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.unbindTextureCube(texture)
        });
    }

    public enableTextureCube(texture: TextureCube, textureUnit: number): void
    {
        let pdrTextureCube: ITextureCube

        if(this._textureCubes.has(texture))
        {
            pdrTextureCube = this._textureCubes.get(texture)
        }
        else
        {
            pdrTextureCube = new this.Resource.textureCube(this, texture)
        }

        pdrTextureCube.enable(this, textureUnit)
    }

    public disableTextureCube(texture: TextureCube, textureUnit: number): void
    {
        if(this._textureCubes.has(texture))
        {
            this._textureCubes.get(texture).disable(this, textureUnit)
        }
    }

    public lockTextureCube(texture: TextureCube, face: number, level: number, mode: BufferLocking): void
    {
        let pdrTextureCube: ITextureCube

        if(this._textureCubes.has(texture))
        {
            pdrTextureCube = this._textureCubes.get(texture)
        }
        else
        {
            pdrTextureCube = new this.Resource.textureCube(this, texture)
        }

        pdrTextureCube.lock(face, level, mode)
    }

    public unlockTextureCube(texture: TextureCube, face: number, level: number): void
    {
        if(this._textureCubes.has(texture))
        {
            this._textureCubes.get(texture).unlock(face, level)
        }
    }

    public updateTextureCube(texture: TextureCube, level: number): void
    {
        // no need to lock or unlock memory here as we are using JS - consider workers later
        console.log("TODO Updating TextureCube")
    }

    public static updateAllTextureCube(texture: TextureCube, level: number): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.updateTextureCube(texture, level)
        });
    }


    ////////////////////////////////////////////////////
    // render target
    ////////////////////////////////////////////////////
    public bindRenderTarget(renderTarget: RenderTarget): void
    {
        if(!this._renderTargets.has(renderTarget))
        {
            this._renderTargets.set(renderTarget, new this.Resource.renderTarget(this, renderTarget))
        }
    }

    public static bindAllRenderTarget(renderTarget: RenderTarget): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.bindRenderTarget(renderTarget)
        });
    }

    public unbindRenderTarget(renderTarget: RenderTarget): void
    {
        if(this._renderTargets.has(renderTarget))
        {
            this._renderTargets.delete(renderTarget)
        }
    }

    public static unbindAllRenderTarget(renderTarget: RenderTarget): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.unbindRenderTarget(renderTarget)
        });
    }

    public enableRenderTarget(renderTarget: RenderTarget): void
    {
        let pdrRenderTarget: IRenderTarget

        if(this._renderTargets.has(renderTarget))
        {
            pdrRenderTarget = this._renderTargets.get(renderTarget)
        }
        else
        {
            pdrRenderTarget = new this.Resource.renderTarget(this, renderTarget)
        }

        pdrRenderTarget.enable(this)
    }

    public disableRenderTarget(renderTarget: RenderTarget): void
    {
        if(this._renderTargets.has(renderTarget))
        {
            this._renderTargets.get(renderTarget).disable(this)
        }
    }

    public readColorRenderTarget(i: number, renderTarget: RenderTarget, texture: Texture2D): void
    {
        if(this._renderTargets.has(renderTarget))
        {
            this._renderTargets.get(renderTarget).readColor(i, this, texture)
        }
    }


    ////////////////////////////////////////////////////
    // vertex shader
    ////////////////////////////////////////////////////
    public bindVertexShader(vShader: VertexShader): void
    {
        if(!this._vertexShaders.has(vShader))
        {
            this._vertexShaders.set(vShader, new this.Resource.vertexShader(this, vShader))
        }
    }

    public static bindAllVertexShader(vShader: VertexShader): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.bindVertexShader(vShader)
        });
    }

    public unbindVertexShader(vShader: VertexShader): void
    {
        if(this._vertexShaders.has(vShader))
        {
            this._vertexShaders.delete(vShader)
        }
    }

    public static unbindAllVertexShader(vShader: VertexShader): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.unbindVertexShader(vShader)
        });
    }

    public enableVertexShader(vShader: VertexShader, parameters: ShaderParameters): void
    {
        let pdrvertexShader: IVertexShader

        if(this._vertexShaders.has(vShader))
        {
            pdrvertexShader = this._vertexShaders.get(vShader)
        }
        else
        {
            pdrvertexShader = new this.Resource.vertexShader(this, vShader)
        }

        pdrvertexShader.enable(this, vShader, parameters)
    }

    public disableVertexShader(vShader: VertexShader, parameters: ShaderParameters): void
    {
        if(this._vertexShaders.has(vShader))
        {
            this._vertexShaders.get(vShader).disable(this, vShader, parameters)
        }
    }


    ////////////////////////////////////////////////////
    // pixel shader
    ////////////////////////////////////////////////////
    public bindPixelShader(pShader: PixelShader): void
    {
        if(!this._pixelShaders.has(pShader))
        {
            this._pixelShaders.set(pShader, new this.Resource.pixelShader(this, pShader))
        }
    }

    public static bindAllPixelShader(pShader: PixelShader): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.bindPixelShader(pShader)
        });
    }

    public unbindPixelShader(pShader: PixelShader): void
    {
        if(this._pixelShaders.has(pShader))
        {
            this._pixelShaders.delete(pShader)
        }
    }

    public static unbindAllPixelShader(pShader: PixelShader): void
    {
        Renderer.msRenderers.forEach(renderer => {
            renderer.unbindPixelShader(pShader)
        });
    }

    public enablePixelShader(pShader: PixelShader, parameters: ShaderParameters): void
    {
        let pdrPixelShader: IPixelShader

        if(this._pixelShaders.has(pShader))
        {
            pdrPixelShader = this._pixelShaders.get(pShader)
        }
        else
        {
            pdrPixelShader = new this.Resource.pixelShader(this, pShader)
        }

        pdrPixelShader.enable(this, pShader, parameters)
    }

    public disablePixelShader(pShader: PixelShader, parameters: ShaderParameters): void
    {
        if(this._pixelShaders.has(pShader))
        {
            this._pixelShaders.get(pShader).disable(this, pShader, parameters)
        }
    }




    //
    public get alphaState(): AlphaState
    {
        return this._alphaState
    }

    public get cullState(): CullState
    {
        return this._cullState
    }

    public get depthState(): DepthState
    {
        return this._depthState
    }

    public get offsetState(): OffsetState
    {
        return this._offsetState
    }

    public get stencilState(): StencilState
    {
        return this._stencilState
    }

    public get wireState(): WireState
    {
        return this._wireState
    }


    public set camera(camera: Camera)
    {
        this._camera = camera
    }

    public get camera(): Camera
    {
        return this._camera
    }

    public get viewMatrix(): Matrix
    {
        return this._camera.viewMatrix
    }

    public get projectionMatrix(): Matrix
    {
        return this._camera.projectionMatrix
    }

    public get postProjectionMatrix(): Matrix
    {
        return this._camera.postProjectionMatrix
    }

    public getPickRay(x: number, y: number, origin: Point, direction: Vector): boolean
    {
        if(!this._camera)
        {
            return false
        }

        let viewport: number[] = this.viewport

        let viewX: number = viewport[0]
        let viewY: number  = viewport[1]
        let viewWidth: number = viewport[2]
        let viewHeight: number = viewport[3]

        if(x < viewX || x > viewX + viewWidth || y < viewY || y > viewY + viewHeight)
        {
            return false
        }

        let r: number = (x - viewX) / viewWidth
        let u: number = (y - viewY) / viewHeight

        let rBlend: number = (1 - r) * this._camera.rMin + r * this._camera.rMax
        let uBlend: number = (1 - u) * this._camera.uMin + u * this._camera.uMax

        let cameraPos: Point = this._camera.position
        if(this._camera.isPerspective)
        {
            origin.set(cameraPos.x, cameraPos.y, cameraPos.z)

            let dVector: Vector = this._camera.dVector.scale(this._camera.dMin)
            let rVector: Vector = this._camera.rVector.scale(rBlend)
            let uVector: Vector = this._camera.uVector.scale(uBlend)

            let durVector: Vector = dVector.add(rVector).add(uVector)

            direction.set(durVector.x, durVector.y, durVector.z)
        }
        else
        {
            let rVector: Vector = this._camera.rVector.scale(rBlend)
            let uVector: Vector = this._camera.uVector.scale(uBlend)

            let durVector: Point = cameraPos.add(rVector).add(uVector)
            direction.set(durVector.x, durVector.y, durVector.z)
        }

        return true
    }

    public set clearColor(clearColor: number[])
    {
        this._clearColor = clearColor
    }

    public get clearColor(): number[]
    {
        return this._clearColor
    }

    public set clearDepth(clearDepth: number)
    {
        this._clearDepth = clearDepth
    }

    public get clearDepth(): number
    {
        return this._clearDepth
    }

    public set clearStencil(clearStencil: number)
    {
        this._clearStencil = clearStencil
    }

    public get clearStencil(): number
    {
        return this._clearStencil
    }

    public get colorMask(): boolean[]
    {
        return [
            this._allowRed,
            this._allowGreen,
            this._allowBlue,
            this._allowAlpha
        ]
    }

    public set overrideAlphaState(alphaState: AlphaState)
    {
        this._overrideAlphaState = alphaState
        if(alphaState)
        {
            this.alphaState = alphaState
        }
        else
        {
            this.alphaState = this._defaultAlphaState
        }
    }

    public set overrideCullState(cullState: CullState)
    {
        this._overrideCullState = cullState
        if(cullState)
        {
            this.cullState = cullState
        }
        else
        {
            this.cullState = this._defaultCullState
        }
    }

    public set overrideDepthState(depthState: DepthState)
    {
        this._defaultDepthState = depthState
        if(depthState)
        {
            this.depthState = depthState
        }
        else
        {
            this.depthState = this._defaultDepthState
        }
    }

    public set overrideOffsetState(offsetState: OffsetState)
    {
        this._defaultOffsetState = offsetState
        if(offsetState)
        {
            this.offsetState = offsetState
        }
        else
        {
            this.offsetState = this._defaultOffsetState
        }
    }

    public set overrideStencilState(stencilState: StencilState)
    {
        this._defaultStencilState = stencilState
        if(stencilState)
        {
            this.stencilState = stencilState
        }
        else
        {
            this.stencilState = this._defaultStencilState
        }
    }

    public set overrideWireState(wireState: WireState)
    {
        this._defaultWireState = wireState
        if(wireState)
        {
            this.wireState = wireState
        }
        else
        {
            this.wireState = this._defaultWireState
        }
    }

    public get overrideAlphaState(): AlphaState
    {
        return this._overrideAlphaState
    }
    public get overrideCullState(): CullState
    {
        return this._overrideCullState
    }

    public get overrideDepthState(): DepthState
    {
        return this._overrideDepthState
    }

    public get overrideOffsetState(): OffsetState
    {
        return this._overrideOffsetState
    }

    public get overrideStencilState(): StencilState
    {
        return this._overrideStencilState
    }

    public get overrideWireState(): WireState
    {
        return this._overrideWireState
    }

    public set reverseCullOrder(reverseCullOrder: boolean)
    {
        this._reverseCullOrder = reverseCullOrder
    }

    public get reverseCullOrder(): boolean
    {
        return this._reverseCullOrder
    }


    public drawVisibleSet(visibleSet: VisibleSet, globalEffect: GlobalEffect = null): void
    {
        if(!globalEffect)
        {
            let numVisible: number = visibleSet.numVisible
            for(let i: number = 0; i < numVisible; ++i)
            {
                let visual: Visual = visibleSet.getVisibleAt(i) as Visual
                let instance: VisualEffectInstance = visual.effectInstance
                this.draw(visual, instance)
            }
        }
    }

    public drawVisual(visual: Visual): void
    {
        let instance: VisualEffectInstance = visual.effectInstance
        this.draw(visual, instance)
    }

    public draw(visual: Visual, instance: VisualEffectInstance): void
    {
        if(!visual)
        {
            console.assert(false, "The visual object must exist")
            return
        }

        if(!instance)
        {
            console.assert(false, "The visual object must have an effect instance")
            return
        }

        let vFormat: VertexFormat = visual.vertexFormat
        let vBuffer: VertexBuffer = visual.vertexBuffer
        let iBuffer: IndexBuffer = visual.indexBuffer

        this.enableVertexBuffer(vBuffer)
        this.enableVertexFormat(vFormat)
        if(iBuffer)
        {
            this.enableIndexBuffer(iBuffer)
        }

        let numPasses: number = instance.numPasses
        for(let i: number = 0; i < numPasses; ++i)
        {
            let pass: VisualPass = instance.getPass(i)
            let vParams: ShaderParameters = instance.getVertexParameters(i)
            let pParams: ShaderParameters = instance.getPixelParameters(i)
            let vShader: VertexShader = pass.vertexShader
            let pShader: PixelShader = pass.pixelShader

            vParams.updateConstants(visual, this._camera)
            pParams.updateConstants(visual, this._camera)

            this.alphaState = pass.alphaState
            this.cullState = pass.cullState
            this.depthState = pass.depthState
            this.offsetState = pass.offsetState
            this.stencilState = pass.stencilState
            this.wireState = pass.wireState

            this.enableVertexShader(vShader, vParams)
            this.enablePixelShader(pShader, pParams)

            this.drawPrimitive(visual)

            this.disableVertexShader(vShader, vParams)
            this.disablePixelShader(pShader, pParams)

            // reset state 
            if(Renderer.RESET_STATE_AFTER_DRAW)
            {
                this.alphaState = this._defaultAlphaState
                this.cullState = this._defaultCullState
                this.depthState = this._defaultDepthState
                this.offsetState = this._defaultOffsetState
                this.stencilState = this._defaultStencilState
                this.wireState = this._defaultWireState
            }

            if(iBuffer)
            {
                this.disableIndexBuffer(iBuffer)
            }

            this.disableVertexFormat(vFormat)
            this.disableVertexBuffer(vBuffer)
        }
    }


    private destroyAllVertexFormats(): void
    {
        this._vertexFormats.clear()
    }

    public destroyAllVertexBuffers(): void
    {
        this._vertexBuffers.clear()
    }

    public destroyAllIndexBuffers(): void
    {
        this._indexBuffers.clear()
    }

    public destroyAllTexture1Ds(): void
    {
        this._texture1Ds.clear()
    }

    public destroyAllTexture2Ds(): void
    {
        this._texture2Ds.clear()
    }

    public destroyAllTexture3Ds(): void
    {
        this._texture3Ds.clear()
    }

    public destroyAllTextureCubes(): void
    {
        this._textureCubes.clear()
    }

    public destroyAllRenderTargets(): void
    {
        this._renderTargets.clear()
    }

    public destroyAllVertexShaders(): void
    {
        this._vertexShaders.clear()
    }

    public destroyAllPixelShaders(): void
    {
        this._pixelShaders.clear()
    }

    /*
    /// platform dependent
    public constructor(input: RendererInput, width: number, height: number,
        colorFormat: TextureFormat, depthStencilFormat: TextureFormat, numMultisamples: number)
    {
        throw new Error("virtual method must be overridden")
    }

    public dispose(): void
    {
        throw new Error("virtual method must be overridden")
    }
    */

    public set alphaState(alphaState: AlphaState)
    {
        throw new Error("virtual method must be overridden")
    }

    public set cullState(cullState: CullState)
    {
        throw new Error("virtual method must be overridden")
    }

    public set depthState(depthState: DepthState)
    {
        throw new Error("virtual method must be overridden")
    }

    public set offsetState(offsetState: OffsetState)
    {
        throw new Error("virtual method must be overridden")
    }

    public set stencilState(stencilState: StencilState)
    {
        throw new Error("virtual method must be overridden")
    }

    public set wireState(wireState: WireState)
    {
        throw new Error("virtual method must be overridden")
    }


    public setViewport(xPosition: number, yPosition: number, width: number, height: number)
    {
        throw new Error("virtual method must be overridden")
    }

    public get viewport(): number[]
    {
        throw new Error("virtual method must be overridden")
    }

    public setDepthRange(zMin: number, zMax: number): void
    {
        throw new Error("virtual method must be overridden")
    }

    public get depthRange(): number[]
    {
        throw new Error("virtual method must be overridden")
    }

    public resize(width: number, height: number): void
    {
        throw new Error("virtual method must be overridden")
    }


    public clearColorBuffer(): void
    {
        throw new Error("virtual method must be overridden")
    }

    public clearDepthBuffer(): void
    {
        throw new Error("virtual method must be overridden")
    }

    public clearStencilBuffer(): void
    {
        throw new Error("virtual method must be overridden")
    }

    public clearBuffers(): void
    {
        throw new Error("virtual method must be overridden")
    }

    public clearColorBufferRect(x: number, y: number, width: number, height: number): void
    {
        throw new Error("virtual method must be overridden")
    }

    public clearDepthBufferRect(x: number, y: number, width: number, height: number): void
    {
        throw new Error("virtual method must be overridden")
    }

    public clearStencilBufferRect(x: number, y: number, width: number, height: number): void
    {
        throw new Error("virtual method must be overridden")
    }

    public clearBuffersRect(x: number, y: number, width: number, height: number): void
    {
        throw new Error("virtual method must be overridden")
    }

    public displayColorBuffer(): void
    {
        throw new Error("virtual method must be overridden")
    }

    public setColorMask(allowRed: boolean, allowGreen: boolean, allowBlue: boolean, allowAlpha: boolean): void
    {
        throw new Error("virtual method must be overridden")
    }

    public preDraw(): boolean
    {
        throw new Error("virtual method must be overridden")
    }

    public postDraw(): void
    {
        throw new Error("virtual method must be overridden")
    }

    public drawBuffer(screenBuffer: ByteArray, reflectY: boolean = false): void
    {
        throw new Error("virtual method must be overridden")
    }

    public drawText(x: number, y: number, color: number[], message: string): void
    {
        throw new Error("virtual method must be overridden")
    }

    protected drawPrimitive(visual: Visual): void
    {
        throw new Error("virtual method must be overridden")
    }

    // internal
    public _data: RendererData

    // internal
    public _getResourceVertexFormat(vFormat: VertexFormat): IVertexFormat
    {
        return this._vertexFormats.get(vFormat)
    }

    // internal
    public _getResourceVertexBuffer(vBuffer: VertexBuffer): IVertexBuffer
    {
        return this._vertexBuffers.get(vBuffer)
    }

    // internal
    public _getResourceIndexBuffer(iBuffer: IndexBuffer): IIndexBuffer
    {
        return this._indexBuffers.get(iBuffer)
    }

    // internal
    public _getResourceTexture1D(texture1D: Texture1D): ITexture1D
    {
        return this._texture1Ds.get(texture1D)
    }

    // internal
    public _getResourceTexture2D(texture2D: Texture2D): ITexture2D
    {
        return this._texture2Ds.get(texture2D)
    }

    // internal
    public _getResourceTexture3D(texture3D: Texture3D): ITexture3D
    {
        return this._texture3Ds.get(texture3D)
    }

    // internal
    public _getResourceTextureCube(textureCube: TextureCube): ITextureCube
    {
        return this._textureCubes.get(textureCube)
    }

    // internal
    public _getResourceRenderTarget(renderTarget: RenderTarget): IRenderTarget
    {
        return this._renderTargets.get(renderTarget)
    }

    // internal
    public _getResourceVertexShader(vertexShader: VertexShader): IVertexShader
    {
        return this._vertexShaders.get(vertexShader)
    }

    // internal
    public _getResourcePixelShader(pixelShader: PixelShader): IPixelShader
    {
        return this._pixelShaders.get(pixelShader)
    }

    // internal
    public _inTexture2DMap(texture: Texture2D): boolean
    {
        return this._texture2Ds.has(texture)
    }

    public _insertInTexture2DMap(texture: Texture2D, platformTexture: ITexture2D)
    {
        this._texture2Ds.set(texture, platformTexture)
    }
}
