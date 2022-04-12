import { AlphaState } from "../../shaders/states/AlphaState";
import { CullState } from "../../shaders/states/CullState";
import { DepthState } from "../../shaders/states/DepthState";
import { OffsetState } from "../../shaders/states/OffsetState";
import { WireState } from "../../shaders/states/WireState";
import { GL20 } from "./GL20";
import { GL20Mapping } from "./GL20Mapping";
import { StencilState } from "../../shaders/states/StencilState";

export class RendererData
{
    public mCurrentRS: RendererState = new RendererState()
    public mCurrentSS: SamplerState[]

    public mMaxVShaderImages: number
    public mMaxPShaderImages: number
    public mMaxCombinedImages: number

    public mWindowID: number
}

export class RendererState
{
    // TODO Why are these public?
    public mAlphaBlendEnabled: boolean
    public mAlphaSrcBlend: number
    public mAlphaDstBlend: number
    public mAlphaCompareEnabled: boolean
    public mCompareFunction: number
    public mAlphaReference: number
    public mBlendColor: number[]
    
    public mCullEnabled: boolean
    public mCCWOrder: boolean

    public mDepthEnabled: boolean
    public mDepthWriteEnabled: boolean
    public mDepthCompareFunction: number

    public mFillEnabled: boolean
    public mLineEnabled: boolean
    public mPointEnabled: boolean
    public mOffsetScale: number
    public mOffsetBias: number

    public mStencilEnabled: boolean
    public mStencilCompareFunction: number
    public mStencilReference: number
    public mStencilMask: number
    public mStencilWriteMask: number
    public mStencilOnFail: number
    public mStencilOnZFail: number
    public mStencilOnZPass: number

    public mWireEnabled: boolean

    public construction()
    {
        // Initialization must be deferred until an OpenGL context has been
        // created.
    }

    public Initialize(astate: AlphaState,
        cstate: CullState, dstate: DepthState,
        ostate: OffsetState, sstate: StencilState,
        wstate: WireState): void
    {
        const gl: WebGL2RenderingContext = GL20.gl

        this.mAlphaBlendEnabled = astate.blendEnabled
        this.mAlphaSrcBlend = GL20Mapping.AlphaSrcBlend[astate.srcBlend]
        this.mAlphaDstBlend = GL20Mapping.AlphaDstBlend[astate.dstBlend]
        this.mAlphaCompareEnabled = astate.compareEnabled
        this.mCompareFunction = GL20Mapping.AlphaCompare[astate.compare]
        this.mAlphaReference = astate.reference
        this.mBlendColor = astate.constantColor

        this.mAlphaBlendEnabled ? gl.enable(gl.BLEND) : gl.disable(gl.BLEND)
        gl.blendFunc(this.mAlphaSrcBlend, gl.ONE_MINUS_SRC_ALPHA)
        // this.mAlphaCompareEnabled ? gl.enable(gl.ALPHA_TEST) : gl.disable(gl.ALPHA_TEST)
        gl.blendColor(this.mBlendColor[0], this.mBlendColor[1], this.mBlendColor[2], this.mBlendColor[3])

        // cull state
        this.mCullEnabled = cstate.enabled
        this.mCCWOrder = cstate.ccwOrder

        this.mCullEnabled ? gl.enable(gl.CULL_FACE) : gl.disable(gl.CULL_FACE)
        gl.frontFace(gl.CCW)
        gl.cullFace(this.mCCWOrder ? gl.BACK : gl.FRONT)

        // depth state
        this.mDepthEnabled = dstate.enabled
        this.mDepthWriteEnabled = dstate.writable
        this.mDepthCompareFunction = GL20Mapping.DepthCompare[dstate.compare]

        this.mDepthEnabled ? gl.enable(gl.DEPTH_TEST) : gl.disable(gl.DEPTH_TEST)
        gl.depthMask(this.mDepthEnabled)
        gl.depthFunc(this.mDepthCompareFunction)

        // offset state
        this.mFillEnabled = ostate.fillEnabled
        this.mLineEnabled = ostate.lineEnabled
        this.mPointEnabled = ostate.pointEnabled
        this.mOffsetScale = ostate.scale
        this.mOffsetBias = ostate.bias

        this.mFillEnabled ? gl.enable(gl.POLYGON_OFFSET_FILL) : gl.disable(gl.POLYGON_OFFSET_FILL)
        // this.mLineEnabled ? gl.enable(gl.POLYGON_OFFSET_LINE) : gl.disable(gl.POLYGON_OFFSET_LINE)
        // this.mPointEnabled ? gl.enable(gl.POLYGON_OFFSET_POINT) : gl.disable(gl.POLYGON_OFFSET_POINT)
        gl.polygonOffset(this.mOffsetScale, this.mOffsetBias)

        // stencil state
        this.mStencilEnabled = sstate.enabled
        this.mStencilCompareFunction = GL20Mapping.StencilCompare[sstate.compare]
        this.mStencilReference = sstate.reference
        this.mStencilMask = sstate.mask
        this.mStencilWriteMask = sstate.writeMask
        this.mStencilOnFail = GL20Mapping.StencilOperation[sstate.onFail]
        this.mStencilOnZFail = GL20Mapping.StencilOperation[sstate.onZFail]
        this.mStencilOnZPass = GL20Mapping.StencilOperation[sstate.onZPass]

        this.mStencilEnabled ? gl.enable(gl.STENCIL_TEST) : gl.disable(gl.STENCIL_TEST)
        gl.stencilFunc(this.mStencilCompareFunction, this.mStencilReference, this.mStencilMask)
        gl.stencilMask(this.mStencilWriteMask)
        gl.stencilOp(this.mStencilOnFail, this.mStencilOnZFail, this.mStencilOnZPass)

        // wire state
        this.mWireEnabled = wstate.enabled

        //gl.polygonMode(gl.FRONT_AND_BACK, this.mWireEnabled ? gl.LINES : gl.FILL)
    }
}

export class SamplerState
{
    public mBorderColor: number[] = [0, 0, 0, 0]
    public mAnisotropy: number = 1
    public mLodBias: number = 0
    public mMagFilter: number = WebGL2RenderingContext.LINEAR
    public mMinFilter: number = WebGL2RenderingContext.NEAREST_MIPMAP_LINEAR
    public mWrap: number[] =
    [
        WebGL2RenderingContext.REPEAT,
        WebGL2RenderingContext.REPEAT,
        WebGL2RenderingContext.REPEAT
    ]

    public getCurrent(target: number): void
    {
        const gl = GL20.gl

        // this.mAnisotropy = getTexParameter(target, WebGL2RenderingContext.ANISOTROPY)
        // this.mLodBias = gl.getTexParameter(target, WebGL2RenderingContext.MAX_TEXTURE_LOD_BIAS)
        this.mMagFilter = gl.getTexParameter(target, WebGL2RenderingContext.TEXTURE_MAG_FILTER)
        this.mMinFilter = gl.getTexParameter(target, WebGL2RenderingContext.TEXTURE_MIN_FILTER)
        // this.mBorderColor = gl.getTexParameter(target, WebGL2RenderingContext.BORDER_COLOR)
        this.mWrap[0] = gl.getTexParameter(target, WebGL2RenderingContext.TEXTURE_WRAP_S)
        this.mWrap[1] = gl.getTexParameter(target, WebGL2RenderingContext.TEXTURE_WRAP_T)
        this.mWrap[2] = gl.getTexParameter(target, WebGL2RenderingContext.TEXTURE_WRAP_S)
    }
}
