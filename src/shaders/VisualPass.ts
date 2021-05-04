import { PixelShader } from "./PixelShader";
import { VertexShader } from "./VertexShader";
import { AlphaState } from "./states/AlphaState";
import { CullState } from "./states/CullState";
import { DepthState } from "./states/DepthState";
import { OffsetState } from "./states/OffsetState";
import { StencilState } from "./states/StencilState";
import { WireState } from "./states/WireState";

export class VisualPass
{
    protected _vShader: VertexShader
    protected _pShader: PixelShader
    protected _alphaState: AlphaState
    protected _cullState: CullState
    protected _depthState: DepthState
    protected _offsetState: OffsetState
    protected _stencilState: StencilState
    protected _wireState: WireState

    public set vertexShader(vShader: VertexShader)
    {
        this._vShader = vShader
    }

    public set pixelShader(pShader: PixelShader)
    {
        this._pShader = pShader
    }

    public set alphaState(alphaState: AlphaState)
    {
        this._alphaState = alphaState
    }

    public set cullState(cullState: CullState)
    {
        this._cullState = cullState
    }

    public set depthState(depthState: DepthState)
    {
        this._depthState = depthState
    }

    public set offsetState(offsetState: OffsetState)
    {
        this._offsetState = offsetState
    }

    public set stencilState(stencilState: StencilState)
    {
        this._stencilState = stencilState
    }

    public set wireState(wireState: WireState)
    {
        this._wireState = wireState
    }

    public get vertexShader(): VertexShader
    {
        return this._vShader
    }

    public get pixelShader(): PixelShader
    {
        return this._pShader
    }

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
}