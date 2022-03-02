import { Light } from "../../display/Light";
import { Material } from "../../display/Material";
import { LightAmbientConstant } from "../../shaders/floats/LightAmbientConstant";
import { LightAttenuationConstant } from "../../shaders/floats/LightAttenuationConstant";
import { MaterialAmbientConstant } from "../../shaders/floats/MaterialAmbientConstant";
import { MaterialEmissiveConstant } from "../../shaders/floats/MaterialEmissiveConstant";
import { PVWMatrixConstant } from "../../shaders/floats/PVWMatrixConstant";
import { PixelShader } from "../../shaders/PixelShader";
import { AlphaState } from "../../shaders/states/AlphaState";
import { CullState } from "../../shaders/states/CullState";
import { DepthState } from "../../shaders/states/DepthState";
import { OffsetState } from "../../shaders/states/OffsetState";
import { StencilState } from "../../shaders/states/StencilState";
import { WireState } from "../../shaders/states/WireState";
import { VariableSemantic } from "../../shaders/VariableSemantic";
import { VariableType } from "../../shaders/VariableType";
import { VertexShader } from "../../shaders/VertexShader";
import { VisualEffect } from "../../shaders/VisualEffect";
import { VisualEffectInstance } from "../../shaders/VisualEffectInstance";
import { VisualPass } from "../../shaders/VisualPass";
import { VisualTechnique } from "../../shaders/VisualTechnique";
import { DefaultEffect } from "./DefaultEffect";

export class LightAmbEffect extends VisualEffect
{
    // TODO: add LightAmb programs
    private static msVPrograms:string[] = [
        "",
        "",
        "",
        "",
        ""
    ]

    private static msPPrograms:string[] = [
        "",
        "",
        "",
        "",
        ""
    ]

    private static msGL10VRegisters: number[] = [0, 4, 5, 6, 7]
    private static msGL20VRegisters: number[] = [1, 5, 6, 7, 8]

    private static msVRegisters: number [][] =
    [
        null,
        DefaultEffect.msGL10VRegisters,
        DefaultEffect.msGL10VRegisters,
        DefaultEffect.msGL10VRegisters,
        DefaultEffect.msGL20VRegisters,
    ]

    constructor()
    {
        super()

        let vshader: VertexShader = new VertexShader("LightAmb",
            1, 2, 5, 0, false)
        vshader.setInput(0, "modelPosition", VariableType.FLOAT3, VariableSemantic.POSITION)
        vshader.setOutput(0, "clipPosition", VariableType.FLOAT4, VariableSemantic.POSITION)
        vshader.setOutput(1, "vertexColor", VariableType.FLOAT4, VariableSemantic.COLOR0)
        vshader.setConstant(0, "PVWMatrix", 4)
        vshader.setConstant(1, "MaterialEmissive", 1)
        vshader.setConstant(2, "MaterialAmbient", 1)
        vshader.setConstant(3, "LightAmbient", 1)
        vshader.setConstant(4, "LightAttenuation", 1)
        vshader.setBaseRegisters(LightAmbEffect.msVRegisters)
        vshader.setPrograms(LightAmbEffect.msVPrograms)

        let pshader = new PixelShader("LightAmb",
            1, 1, 0, 0, false)
        pshader.setInput(0, "vertexColor", VariableType.FLOAT4, VariableSemantic.COLOR0)
        pshader.setOutput(0, "vertexColor", VariableType.FLOAT4, VariableSemantic.COLOR0)
        pshader.setPrograms(LightAmbEffect.msPPrograms)

        let pass: VisualPass = new VisualPass()
        pass.vertexShader = vshader
        pass.pixelShader = pshader
        pass.alphaState = new AlphaState()
        pass.cullState = new CullState()
        pass.depthState = new DepthState()
        pass.offsetState = new OffsetState()
        pass.stencilState = new StencilState()
        pass.wireState = new WireState()

        let technique = new VisualTechnique()
        technique.insertPass(pass)
        this.insertTechnique(technique)
    }

    public dispose(): void {
        super.dispose()
    }

    public CreateInstance(light: Light, material: Material)
    {
        let instance: VisualEffectInstance = new VisualEffectInstance(this, 0)
        instance.setVertexConstant(0, 0, new PVWMatrixConstant())
        instance.setVertexConstant(0, 1, new MaterialEmissiveConstant(material))
        instance.setVertexConstant(0, 2, new MaterialAmbientConstant(material))
        instance.setVertexConstant(0, 3, new LightAmbientConstant(light))
        instance.setVertexConstant(0, 4, new LightAttenuationConstant(light))

        return instance
    }

    public static CreateUniqueInstance(light: Light, material: Material)
    {
        let effect: LightAmbEffect = new LightAmbEffect()
        return effect.CreateInstance(light, material)
    }
}
