import { Renderer } from "renderers/Renderer";
import { Texture1D } from "resources/Texture1D";
import { Texture2D } from "resources/Texture2D";
import { Texture3D } from "resources/Texture3D";
import { TextureCube } from "resources/TextureCube";
import { SamplerType } from "shaders/SamplerType";
import { Shader } from "shaders/Shader";
import { ShaderParameters } from "shaders/ShaderParameters";
import { GL20 } from "./GL20";
import { GL20Mapping } from "./GL20Mapping";
import { SamplerState } from "./RendererData";

export class PdrShader
{
    protected _shader: WebGLShader
    
    public dispose(): void
    {
        console.log("Disposing shader")
        GL20.gl.deleteShader(this._shader)
    }

    protected setSamplerState(renderer: Renderer, shader: Shader, profile: number,
        parameters: ShaderParameters, maxSamplers: number, currentSS: SamplerState[])
    {
        let gl = GL20.gl
        let numSamplers = shader.numSamplers
        if(numSamplers > maxSamplers)
        {
            numSamplers = maxSamplers
        }

        for(let i = 0; i < numSamplers; ++i)
        {
            let type = shader.getSamplerType(i)
            let target = GL20Mapping.TextureTarget[type]
            let textureUnit = shader.getTextureUnit(profile, i)
            let texture = parameters.getTexture(i)
            let current = currentSS[textureUnit]

            let wrap0: number, wrap1: number, wrap2: number
            switch(type)
            {
                case SamplerType.TEX_1D:
                    renderer.enableTexture1D(texture as Texture1D, textureUnit)
                    current.getCurrent(target)

                    wrap0 = GL20Mapping.WrapMode[shader.getCoordinate(i, 0)]
                    if(wrap0 != current.mWrap[0])
                    {
                        current.mWrap[0] = wrap0
                        gl.texParameteri(target, gl.TEXTURE_WRAP_S, wrap0)
                    }
                    break
                case SamplerType.TEX_2D:
                    renderer.enableTexture2D(texture as Texture2D, textureUnit)
                    current.getCurrent(target)

                    wrap0 = GL20Mapping.WrapMode[shader.getCoordinate(i, 0)]
                    if(wrap0 != current.mWrap[0])
                    {
                        current.mWrap[0] = wrap0
                        gl.texParameteri(target, gl.TEXTURE_WRAP_S, wrap0)
                    }

                    wrap1 = GL20Mapping.WrapMode[shader.getCoordinate(i, 1)]
                    if(wrap1 != current.mWrap[1])
                    {
                        current.mWrap[1] = wrap1
                        gl.texParameteri(target, gl.TEXTURE_WRAP_T, wrap1)
                    }
                    break
                case SamplerType.TEX_3D:
                    renderer.enableTexture3D(texture as Texture3D, textureUnit)
                    current.getCurrent(target)

                    wrap0 = GL20Mapping.WrapMode[shader.getCoordinate(i, 0)]
                    if(wrap0 != current.mWrap[0])
                    {
                        current.mWrap[0] = wrap0
                        gl.texParameteri(target, gl.TEXTURE_WRAP_S, wrap0)
                    }

                    wrap1 = GL20Mapping.WrapMode[shader.getCoordinate(i, 1)]
                    if(wrap1 != current.mWrap[1])
                    {
                        current.mWrap[1] = wrap1
                        gl.texParameteri(target, gl.TEXTURE_WRAP_T, wrap1)
                    }

                    wrap2 = GL20Mapping.WrapMode[shader.getCoordinate(i, 2)]
                    if(wrap0 != current.mWrap[2])
                    {
                        current.mWrap[2] = wrap2
                        gl.texParameteri(target, gl.TEXTURE_WRAP_R, wrap2)
                    }
                    break
                case SamplerType.TEX_CUBE:
                    renderer.enableTextureCube(texture as TextureCube, textureUnit)
                    current.getCurrent(target)

                    wrap0 = GL20Mapping.WrapMode[shader.getCoordinate(i, 0)]
                    if(wrap0 != current.mWrap[0])
                    {
                        current.mWrap[0] = wrap0
                        gl.texParameteri(target, gl.TEXTURE_WRAP_S, wrap0)
                    }

                    wrap1 = GL20Mapping.WrapMode[shader.getCoordinate(i, 1)]
                    if(wrap1 != current.mWrap[1])
                    {
                        current.mWrap[1] = wrap1
                        gl.texParameteri(target, gl.TEXTURE_WRAP_T, wrap1)
                    }
                    break
                default:
                    console.assert(false, "Invalid sampler type")
                    break
            }

            /*
             * TODO: Anisotripic, 
             * LOD bias, 
             * magfilter, 
             * minfilter
             * border color (not available webgl)
             * 
            let maxAnsotropy = Shader.MAX_ANISOTROPY
            let anisotropy = shader.getAnisotropy(i)
            if(anisotropy < 1 || anisotropy > maxAnsotropy)
            {
                anisotropy = 1
            }
            if(anisotropy != current.mAnisotropy)
            {
                current.mAnisotropy = anisotropy
                gl.texParameterf(target, gl.ANISOTROPY, anisotropy)
            }
            */
        }
    }

    public disableTextures(renderer: Renderer, shader: Shader, profile: number,
        parameters: ShaderParameters, maxSamplers: number)
    {
        let numSamplers = shader.numSamplers
        if(numSamplers > maxSamplers)
        {
            numSamplers = maxSamplers
        }

        for(let i = 0; i < numSamplers; ++i)
        {
            let type = shader.getSamplerType(i)
            let textureUnit = shader.getTextureUnit(profile, i)
            let texture = parameters.getTexture(i)

            switch(type)
            {
                case SamplerType.TEX_1D:
                    renderer.disableTexture1D(texture as Texture1D, textureUnit)
                    break
                case SamplerType.TEX_2D:
                    renderer.disableTexture2D(texture as Texture2D, textureUnit)
                    break
                case SamplerType.TEX_3D:
                    renderer.disableTexture3D(texture as Texture3D, textureUnit)
                    break
                case SamplerType.TEX_CUBE:
                    renderer.disableTextureCube(texture as TextureCube, textureUnit)
                    break
                default:
                    console.assert(false, "Invalid sampler type")
            }
        }
    }
}