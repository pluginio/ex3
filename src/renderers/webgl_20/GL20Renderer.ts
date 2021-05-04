import { RendererInput } from "./RendererInput";
import { TextureFormat } from "resources/TextureFormat";
import { Renderer } from "renderers/Renderer";
import { RendererData } from "./RendererData";
import { VertexShader } from "shaders/VertexShader";
import { VertexShaderProfile } from "shaders/VertexShaderProfile";
import { PixelShader } from "shaders/PixelShader";
import { PixelShaderProfile } from "shaders/PixelShaderProfile";
import { GL20 } from "./GL20";
import { AlphaState } from "shaders/states/AlphaState";
import { GL20Mapping } from "./GL20Mapping";
import { CullState } from "shaders/states/CullState";
import { Visual } from "display/Visual";
import { PrimitiveType } from "display/PrimitiveType";
import { VertexBuffer } from "resources/VertexBuffer";
import { IndexBuffer } from "resources/IndexBuffer";
import { Polysegment } from "display/Polysegment";
import { Polypoint } from "display/Polypoint";
import { DepthState } from "shaders/states/DepthState";
import { OffsetState } from "shaders/states/OffsetState";
import { StencilState } from "shaders/states/StencilState";
import { WireState } from "shaders/states/WireState";

export class GL20Renderer extends Renderer
{
    constructor(input: RendererInput, width: number, height: number,
        colorFormat: TextureFormat, depthStencilFormat: TextureFormat,
        numMultisamples: number)
    {
        //super(input, width, height, colorFormat, depthStencilFormat, numMultisamples)
        super()

        this.initialize(width, height, colorFormat, depthStencilFormat, numMultisamples)

        let data: RendererData = new RendererData()
        this._data = data
        data.mWindowID = input.mWindowID

        VertexShader.profile = VertexShaderProfile.ARBVP1
        PixelShader.profile = PixelShaderProfile.ARBFP1

        data.mMaxVShaderImages = 0
        data.mMaxPShaderImages = 0
        data.mMaxCombinedImages = 0
        
        data.mMaxVShaderImages = GL20.gl.getParameter(GL20.gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)
        data.mMaxPShaderImages = GL20.gl.getParameter(GL20.gl.MAX_TEXTURE_IMAGE_UNITS)
        data.mMaxCombinedImages = GL20.gl.getParameter(GL20.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)

        data.mCurrentRS.Initialize(this._defaultAlphaState, this._defaultCullState,
            this._defaultDepthState, this._defaultOffsetState, this._defaultStencilState,
            this._defaultWireState)
    }

    public dispose(): void
    {
        this._data = null
        this.terminate()
    }
    
    protected drawPrimitive(visual: Visual): void
    {
        let gl: WebGL2RenderingContext = GL20.gl

        let type: PrimitiveType = visual.primitiveType
        let vbuffer: VertexBuffer = visual.vertexBuffer
        let ibuffer: IndexBuffer = visual.indexBuffer

        let numPixelsDrawn: number

        if(type == PrimitiveType.TRIMESH
            || type == PrimitiveType.TRISTRIP
            || type == PrimitiveType.TRIFAN)
        {
            let numVertices: number = vbuffer.numElements
            let numIndices: number = ibuffer.numElements

            if(numVertices > 0 && numIndices > 0)
            {
                let indexType: number

                if(ibuffer.elementSize == 2)
                {
                    indexType = gl.UNSIGNED_SHORT
                }
                else
                {
                    indexType = gl.UNSIGNED_INT
                }

                gl.drawRangeElements(GL20Mapping.PrimitiveType[type], 0, numVertices - 1,
                    numIndices, indexType, ibuffer.offset)
            }
        }
        else if(type == PrimitiveType.POLYSEGMENTS_CONTIGUOUS)
        {
            let numSegments = (visual as Polysegment).numSegments
            if(numSegments > 0)
            {
                gl.drawArrays(gl.LINE_STRIP, 0, numSegments + 1)
            }
        }
        else if(type == PrimitiveType.POLYSEGMENTS_DISJOINT)
        {
            let numSegments: number = (visual as Polysegment).numSegments
            if( numSegments > 0)
            {
                gl.drawArrays(gl.LINES, 0, 2*numSegments)
            }
        }
        else if(type == PrimitiveType.POLYPOINT)
        {
            let numPoints: number = (visual as Polypoint).numPoints
            gl.drawArrays(gl.POINTS, 0, numPoints)
        }
        else
        {
            console.assert(false, "Invalid type")
        }
    }

    /*
    public displayColorBuffer(): void
    {
        let data: RendererData = this._data
        GL20.gl.clear(WebGL2RenderingContext.COLOR_BUFFER_BIT)
    }
    */





    // TODO abstract to base class?
    public set alphaState(alphaState: AlphaState)
    {
        let gl: WebGL2RenderingContext = GL20.gl

        if(!this._overrideAlphaState)
        {
            this._alphaState = alphaState
        }
        else
        {
            this._alphaState = this._overrideAlphaState
        }

        if(this._alphaState.blendEnabled)
        {
            if(!this._data.mCurrentRS.mAlphaBlendEnabled)
            {
                this._data.mCurrentRS.mAlphaBlendEnabled = true
                gl.enable(gl.BLEND)
            }

            let srcBlend: number = GL20Mapping.AlphaSrcBlend[this._alphaState.srcBlend]
            let dstBlend: number = GL20Mapping.AlphaDstBlend[this._alphaState.dstBlend]
            if(srcBlend != this._data.mCurrentRS.mAlphaSrcBlend
                || dstBlend != this._data.mCurrentRS.mAlphaDstBlend)
            {
                this._data.mCurrentRS.mAlphaSrcBlend = srcBlend
                this._data.mCurrentRS.mAlphaDstBlend = dstBlend
                gl.blendFunc(srcBlend, dstBlend)
            }

            if(alphaState.constantColor != this._data.mCurrentRS.mBlendColor)
            {
                this._data.mCurrentRS.mBlendColor = alphaState.constantColor
                gl.blendColor(
                    this._data.mCurrentRS.mBlendColor[0],
                    this._data.mCurrentRS.mBlendColor[1],
                    this._data.mCurrentRS.mBlendColor[2],
                    this._data.mCurrentRS.mBlendColor[3]
                )
            }
        }
        else
        {
            if(this._data.mCurrentRS.mAlphaBlendEnabled)
            {
                this._data.mCurrentRS.mAlphaBlendEnabled = false
                gl.disable(gl.BLEND)
            }
        }

        /**
         * TODO Replace this entire thing with somthing like:
         * 
         * if(gl_FragColor.a < 0.5)
         * discard;
         */
        /*
        if(this._alphaState.compareEnabled)
        {
            if(!this._data.mCurrentRS.mAlphaCompareEnabled)
            {
                this._data.mCurrentRS.mAlphaCompareEnabled = true
                gl.enable(WebGL2RenderingContext.ALPHA_TEST)
            }

            let compare: number = GL20Mapping.AlphaCompare[this._alphaState.compare]
            let reference: number = this._alphaState.reference
            if(compare != this._data.mCurrentRS.mCompareFunction
                || reference != this._data.mCurrentRS.mAlphaReference)
            {
                this._data.mCurrentRS.mCompareFunction = compare
                this._data.mCurrentRS.mAlphaReference = reference
                gl.alphaFunc(compare, reference)
            }
        }
        else
        {
            if(this._data.mCurrentRS.mAlphaCompareEnabled)
            {
                this._data.mCurrentRS.mAlphaBlendEnabled = false
                gl.disable(WebGL2RenderingContext.ALPHA_TEST)
            }
        }
        */
    }

    public set cullState(cullState: CullState)
    {
        let gl: WebGL2RenderingContext = GL20.gl

        if(!this._overrideCullState)
        {
            this._cullState = cullState
        }
        else
        {
            this._cullState = this._overrideCullState
        }

        if(this._cullState.enabled)
        {
            if(!this._data.mCurrentRS.mCullEnabled)
            {
                this._data.mCurrentRS.mCullEnabled = true
                gl.enable(gl.CULL_FACE)
                gl.frontFace(gl.CCW)
            }

            let order: boolean = this._cullState.ccwOrder
            if(this._reverseCullOrder)
            {
                order = !order
            }

            if(order != this._data.mCurrentRS.mCCWOrder)
            {
                this._data.mCurrentRS.mCCWOrder = order
                if(this._data.mCurrentRS.mCCWOrder)
                {
                    gl.cullFace(gl.BACK)
                }
                else
                {
                    gl.cullFace(gl.FRONT)
                }
            }
        }
        else
        {
            if(this._data.mCurrentRS.mCullEnabled)
            {
                this._data.mCurrentRS.mCullEnabled = false
                gl.disable(gl.CULL_FACE)
            }
        }
    }

    public set depthState(depthState: DepthState)
    {
        let gl: WebGL2RenderingContext = GL20.gl

        if(!this._overrideDepthState)
        {
            this._depthState = depthState
        }
        else
        {
            this._depthState = this._overrideDepthState
        }

        if(this._depthState.enabled)
        {
            if(!this._data.mCurrentRS.mDepthEnabled)
            {
                this._data.mCurrentRS.mDepthEnabled = true
                gl.enable(gl.DEPTH_TEST)
            }

            let compare: number = GL20Mapping.DepthCompare[this._depthState.compare]
            if(compare != this._data.mCurrentRS.mDepthCompareFunction)
            {
                this._data.mCurrentRS.mDepthCompareFunction = compare
                gl.depthFunc(compare)
            }
        }
        else
        {
            if(this._data.mCurrentRS.mDepthEnabled)
            {
                this._data.mCurrentRS.mDepthEnabled = false
                gl.disable(gl.DEPTH_TEST)
            }
        }

        if(this._depthState.writable)
        {
            if(!this._data.mCurrentRS.mDepthWriteEnabled)
            {
                this._data.mCurrentRS.mDepthWriteEnabled = true
                gl.depthMask(true)
            }
        }
        else
        {
            if(this._data.mCurrentRS.mDepthWriteEnabled)
            {
                this._data.mCurrentRS.mDepthWriteEnabled = false
                gl.depthMask(false)
            }
        }
    }

    public set offsetState(offsetState: OffsetState)
    {
        let gl: WebGL2RenderingContext = GL20.gl

        if(!this._overrideOffsetState)
        {
            this._offsetState = offsetState
        }
        else
        {
            this._offsetState = this._overrideOffsetState
        }

        if(this._offsetState.fillEnabled)
        {
            if(!this._data.mCurrentRS.mFillEnabled)
            {
                this._data.mCurrentRS.mFillEnabled = true
                gl.enable(gl.POLYGON_OFFSET_FILL)
            }
        }
        else
        {
            if(this._data.mCurrentRS.mFillEnabled)
            {
                this._data.mCurrentRS.mFillEnabled = false
                gl.disable(gl.POLYGON_OFFSET_FILL)
            }
        }

        // LINE & POINT not available in ES 2.0
        /*
        if(this._offsetState.lineEnabled)
        {
            if(!this._data.mCurrentRS.mLineEnabled)
            {
                this._data.mCurrentRS.mLineEnabled = true
                gl.enable(gl.POLYGON_OFFSET_LINE)
            }
        }
        */

        if(this._offsetState.scale != this._data.mCurrentRS.mOffsetScale
        || this._offsetState.bias != this._data.mCurrentRS.mOffsetBias)
        {
            this._data.mCurrentRS.mOffsetScale = this._offsetState.scale
            this._data.mCurrentRS.mOffsetBias = this._offsetState.bias
            gl.polygonOffset(this._offsetState.scale, this._offsetState.bias)
        }
    }

    public set stencilState(stencilState: StencilState)
    {
        let gl: WebGL2RenderingContext = GL20.gl

        if(!this._overrideStencilState)
        {
            this._stencilState = stencilState
        }
        else
        {
            this._stencilState = this._overrideStencilState
        }

        if(this._stencilState.enabled)
        {
            if(!this._data.mCurrentRS.mStencilEnabled)
            {
                this._data.mCurrentRS.mStencilEnabled = true
                gl.enable(gl.STENCIL_TEST)
            }

            let compare: number = GL20Mapping.StencilCompare[this._stencilState.compare]
            if(compare != this._data.mCurrentRS.mStencilCompareFunction
            || this._stencilState.reference != this._data.mCurrentRS.mStencilReference
            || this._stencilState.mask != this._data.mCurrentRS.mStencilMask)
            {
                this._data.mCurrentRS.mStencilCompareFunction = compare
                this._data.mCurrentRS.mStencilReference = this._stencilState.reference
                this._data.mCurrentRS.mStencilMask = this._stencilState.mask
                gl.stencilFunc(compare, this._stencilState.reference, this._stencilState.mask)
            }

            if(this._stencilState.writeMask != this._data.mCurrentRS.mStencilWriteMask)
            {
                this._data.mCurrentRS.mStencilWriteMask = this._stencilState.writeMask
                gl.stencilMask(this._stencilState.writeMask)
            }

            let onFail: number = GL20Mapping.StencilOperation[this._stencilState.onFail]
            let onZFail: number = GL20Mapping.StencilOperation[this._stencilState.onZFail]
            let onZPass: number = GL20Mapping.StencilOperation[this._stencilState.onZPass]
            if(onFail != this._data.mCurrentRS.mStencilOnFail
            || onZFail != this._data.mCurrentRS.mStencilOnZFail
            || onZPass != this._data.mCurrentRS.mStencilOnZPass)
            {
                this._data.mCurrentRS.mStencilOnFail = onFail
                this._data.mCurrentRS.mStencilOnZFail = onZFail
                this._data.mCurrentRS.mStencilOnZPass = onZPass
                gl.stencilOp(onFail, onZFail, onZPass)
            }
        }
        else
        {
            if(this._data.mCurrentRS.mStencilEnabled)
            {
                this._data.mCurrentRS.mStencilEnabled = false
                gl.disable(gl.STENCIL_TEST)
            }
        }
    }

    // TODO move to shader
    public set wireState(wireState: WireState)
    {
        console.warn("Not implemented")
        /*
        let gl: WebGL2RenderingContext = GL20.gl

        if(!this._overrideWireState)
        {
            this._wireState = wireState
        }
        else
        {
            this._wireState = this._overrideWireState
        }

        if(this._wireState.enabled)
        {
            if(!this._data.mCurrentRS.mWireEnabled)
            {
                this._data.mCurrentRS.mWireEnabled = true
                gl.polygonMode(gl.FRONT_AND_BACK, gl.LINE)
            }
        }
        else
        {
            if(this._data.mCurrentRS.mWireEnabled)
            {
                this._data.mCurrentRS.mWireEnabled = false
                gl.polygonMode(gl.FRONT_AND_BACK, gl.FILL)
            }
        }
        */
    }

    public setViewport(xPosition: number, yPosition: number, width: number, height: number): void
    {
        GL20.gl.viewport(xPosition, yPosition, width, height)
    }

    public get viewport(): number[]
    {
        return GL20.gl.getParameter(WebGL2RenderingContext.VIEWPORT)
    }

    public setDepthRange(zMin: number, zMax: number): void
    {
        GL20.gl.depthRange(zMin, zMax)
    }

    public get depthRange(): number[]
    {
        return GL20.gl.getParameter(WebGL2RenderingContext.DEPTH_RANGE)
    }

    public resize(width: number, height: number): void
    {
        let gl: WebGL2RenderingContext = GL20.gl

        this._width = width
        this._height = height

        let param: number[] = gl.getParameter(gl.VIEWPORT)
        GL20.gl.viewport(param[0], param[1], width, height)
    }

    public clearDepthBuffer(): void
    {
        let gl: WebGL2RenderingContext = GL20.gl

        gl.clearDepth(this._clearDepth)
        gl.clear(gl.DEPTH_BUFFER_BIT)
    }

    public clearStencilBuffer(): void
    {
        let gl: WebGL2RenderingContext = GL20.gl

        gl.clearStencil(this._clearStencil)
        gl.clear(gl.STENCIL_BUFFER_BIT)
    }

    public clearBuffers(): void
    {
        let gl: WebGL2RenderingContext = GL20.gl

        gl.clearColor(this._clearColor[0], this._clearColor[1],
            this._clearColor[2], this._clearColor[3])
            
        gl.clearDepth(this._clearDepth)

        gl.clear(
            gl.COLOR_BUFFER_BIT |
            gl.DEPTH_BUFFER_BIT |
            gl.STENCIL_BUFFER_BIT)
    }

    public clearColorBufferRect(x: number, y: number, w: number, h: number): void
    {
        let gl: WebGL2RenderingContext = GL20.gl

        gl.clearColor(this._clearColor[0], this._clearColor[1],
            this._clearColor[2], this._clearColor[3])
        gl.enable(gl.SCISSOR_TEST)
        gl.scissor(x, y, w, h)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.disable(gl.SCISSOR_TEST)
    }

    public clearDepthBufferRect(x: number, y: number, w: number, h: number): void
    {
        let gl: WebGL2RenderingContext = GL20.gl

        gl.clearDepth(this._clearDepth)

        gl.enable(gl.SCISSOR_TEST)
        gl.scissor(x, y, w, h)
        gl.clear(gl.DEPTH_BUFFER_BIT)
        gl.disable(gl.SCISSOR_TEST)
    }

    public clearStencilBufferRect(x: number, y: number, w: number, h: number): void
    {
        let gl: WebGL2RenderingContext = GL20.gl

        gl.clearStencil(this._clearStencil)

        gl.enable(gl.SCISSOR_TEST)
        gl.scissor(x, y, w, h)
        gl.clear(gl.STENCIL_BUFFER_BIT)
        gl.disable(gl.SCISSOR_TEST)
    }

    public clearBuffersRect(x: number, y: number, w: number, h: number): void
    {
        let gl: WebGL2RenderingContext = GL20.gl

        gl.clearColor(this._clearColor[0], this._clearColor[1],
            this._clearColor[2], this._clearColor[3])
        
        gl.clearDepth(this._clearDepth)

        gl.clearStencil(this._clearStencil)

        gl.enable(gl.SCISSOR_TEST)
        gl.scissor(x, y, w, h)
        gl.clear(
            gl.COLOR_BUFFER_BIT |
            gl.DEPTH_BUFFER_BIT |
            gl.STENCIL_BUFFER_BIT
        )
        gl.disable(gl.SCISSOR_TEST)
    }

    public setColorMask(allowRed: boolean, allowGreen: boolean,
        allowBlue: boolean, allowAlpha: boolean): void
    {
        this._allowRed = allowRed
        this._allowGreen = allowGreen
        this._allowBlue = allowBlue
        this._allowAlpha = allowAlpha

        GL20.gl.colorMask(this._allowRed, this._allowBlue, this._allowGreen, this._allowAlpha)
    }

    public preDraw(): boolean
    {
        return true
    }

    public postDraw(): void
    {

    }

    public drawVisual(visual: Visual): void
    {
        let gl: WebGL2RenderingContext = GL20.gl

        let type: PrimitiveType = visual.primitiveType
        let vbuffer: VertexBuffer = visual.vertexBuffer
        let ibuffer: IndexBuffer = visual.indexBuffer

        // count pixels draw, possible??
        if(type == PrimitiveType.TRIMESH ||
            type == PrimitiveType.TRISTRIP ||
            type == PrimitiveType.TRIFAN)
        {
            let numVertices: number = vbuffer.numElements
            let numIndices: number = ibuffer.numElements
            if(numVertices > 0 && numIndices > 0)
            {
                let indexType: number;
                let offset = ibuffer.offset
                // TODO

                if(ibuffer.elementSize == 2)
                {
                    indexType = gl.UNSIGNED_SHORT
                }
                else // size is 4
                {
                    indexType = gl.UNSIGNED_INT
                }

                gl.drawRangeElements(GL20Mapping.PrimitiveType[type], 0, numVertices-1,
                    numIndices, indexType, offset)
            }
        }
        else if(type == PrimitiveType.POLYSEGMENTS_CONTIGUOUS)
        {
            let numSegments: number = (visual as Polysegment).numSegments
            if(numSegments > 0)
            {
                gl.drawArrays(gl.LINE_STRIP, 0, numSegments + 1)
            }
        }
        else if(type == PrimitiveType.POLYSEGMENTS_DISJOINT)
        {
            let numSegments: number = (visual as Polysegment).numSegments
            if(numSegments > 0)
            {
                gl.drawArrays(gl.LINES, 0, 2 * numSegments)
            }
        }
        else if(type == PrimitiveType.POLYPOINT)
        {
            let numPoints: number = (visual as Polypoint).numPoints
            if(numPoints > 0)
            {
                gl.drawArrays(gl.POINTS, 0, numPoints)
            }
        }
        else
        {
            console.assert(false, "Invalid type")
        }
    }
}