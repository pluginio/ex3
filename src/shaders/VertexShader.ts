import { Renderer } from "../renderers/Renderer";
import { Shader } from "./Shader";
import { VertexShaderProfile } from "./VertexShaderProfile";

export class VertexShader extends Shader
{
    protected static msProfile: VertexShaderProfile

    public constructor(programName: string, numInputs: number, numOutputs: number,
        numConstants: number, numSamplers: number, profileOwner: boolean)
    {
        super(programName, numInputs, numOutputs, numConstants, numSamplers, profileOwner)
    }

    // override
    public dispose(): void
    {
        Renderer.unbindAllVertexShader(this)
        super.dispose()
    }

    public static set profile(profile: VertexShaderProfile)
    {
        this.msProfile = profile
    }

    public static get profile(): VertexShaderProfile
    {
        return this.msProfile
    }
}