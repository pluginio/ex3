import { PdrIndexBuffer } from './PdrIndexBuffer'
import { PdrPixelShader } from './PdrPixelShader'
import { PdrTexture1D } from './PdrTexture1D'
import { PdrTexture2D } from './PdrTexture2D'
import { PdrTexture3D } from './PdrTexture3D'
import { PdrTextureCube } from './PdrTextureCube'
import { PdrVertexBuffer } from './PdrVertexBuffer'
import { PdrVertexShader } from './PdrVertexShader'
import { PdrVertexFormat } from './PdrVertexFormat'
import { PdrRenderTarget } from './PdrRenderTarget';

export class Resources
{
    public static indexBuffer = PdrIndexBuffer
    public static pixelShader = PdrPixelShader
    public static texture1D = PdrTexture1D
    public static texture2D = PdrTexture2D
    public static texture3D = PdrTexture3D
    public static textureCube = PdrTextureCube
    public static renderTarget = PdrRenderTarget
    public static vertexBuffer = PdrVertexBuffer
    public static vertexFormat = PdrVertexFormat
    public static vertexShader = PdrVertexShader
}