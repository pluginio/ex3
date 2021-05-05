import { VisualEffect } from "../../shaders/VisualEffect";
import { VertexShader } from "../../shaders/VertexShader";
import { VariableType } from "../../shaders/VariableType";
import { VariableSemantic } from "../../shaders/VariableSemantic";
import { VisualEffectInstance } from "../../shaders/VisualEffectInstance";
import { PixelShader } from "../../shaders/PixelShader";
import { VisualPass } from "../../shaders/VisualPass";
import { AlphaState } from "../../shaders/states/AlphaState";
import { CullState } from "../../shaders/states/CullState";
import { DepthState } from "../../shaders/states/DepthState";
import { OffsetState } from "../../shaders/states/OffsetState";
import { StencilState } from "../../shaders/states/StencilState";
import { WireState } from "../../shaders/states/WireState";
import { VisualTechnique } from "../../shaders/VisualTechnique";
// import { PVWMatrixConstant } from "../../shaders/floats/PVWMatrixConstant";

export class DefaultEffect extends VisualEffect
{
    private static msVPrograms:string[] = [
        "",
        `
        attribute vec4 a_position;
        void main() {
          gl_Position = a_position;
        }`,
        "",
        "",
        ""
    ]

    private static msPPrograms:string[] = [
        "",
        `gl_FragColor = vec4(1, 0, 0.5, 1);`,
        "",
        "",
        ""
    ]

    private static msGL10VRegisters: number[] = [0]
    private static msGL20VRegisters: number[] = [1]

    private static msVRegisters:number[][] = [
        null,
        DefaultEffect.msGL10VRegisters,
        DefaultEffect.msGL10VRegisters,
        DefaultEffect.msGL10VRegisters,
        DefaultEffect.msGL20VRegisters,
    ]

    constructor()
    {
        super()

        let vshader: VertexShader = new VertexShader('default',
            1, 1, 1, 0, false)
        vshader.setInput(0, 'modelPosition', VariableType.FLOAT3, VariableSemantic.POSITION)
        vshader.setOutput(0, 'clipPosition', VariableType.FLOAT, VariableSemantic.POSITION)
        vshader.setConstant(0, 'PVWMatrix', 4)
        vshader.setBaseRegisters(DefaultEffect.msVRegisters)
        vshader.setPrograms(DefaultEffect.msVPrograms)

        let pshader: PixelShader = new PixelShader('default',
            1, 1, 0, 0, false)
        pshader.setInput(0, 'vertexTCoord', VariableType.FLOAT2, VariableSemantic.TEXCOORD0)
        pshader.setOutput(0, 'pixelColor', VariableType.FLOAT4, VariableSemantic.COLOR0)
        pshader.setPrograms(DefaultEffect.msPPrograms)

        let pass: VisualPass = new VisualPass()
        pass.vertexShader = vshader
        pass.pixelShader = pshader
        pass.alphaState = new AlphaState()
        pass.cullState = new CullState()
        pass.depthState = new DepthState()
        pass.offsetState = new OffsetState()
        pass.stencilState = new StencilState()
        pass.wireState = new WireState()

        let technique: VisualTechnique = new VisualTechnique()
        technique.insertPass(pass)
        this.insertTechnique(technique)
    }

    public dispose(): void
    {
        super.dispose()
    }

    public createInstance(): VisualEffectInstance
    {
        let instance: VisualEffectInstance = new VisualEffectInstance(this, 0)
        // instance.setVertexConstant(0, 0, new PVWMatrixConstant())
        return instance
    }
}