import { Shader } from "./Shader";
import { PixelShaderProfile } from "./PixelShaderProfile";

export class PixelShader extends Shader
{
    protected static msProfile: PixelShaderProfile

    public constructor(programName: string, numInputs: number, numOutputs: number,
        numConstants: number, numSamplers: number, profileOwner: boolean)
    {
        super(programName, numInputs, numOutputs, numConstants, numSamplers, profileOwner)
    }

    // override
    public dispose(): void
    {
        // TODO Renderer.unbindAllPixelShader(this)
        super.dispose()
    }

    public static set profile(profile: PixelShaderProfile)
    {
        this.msProfile = profile
    }

    public static get profile(): PixelShaderProfile
    {
        return this.msProfile
    }
}