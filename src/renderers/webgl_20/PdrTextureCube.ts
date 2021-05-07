import { ITextureCube } from '../interfaces/ITextureCube'
import { Renderer } from '../Renderer';
import { BufferLocking } from '../../resources/BufferLocking';
import { TextureCube } from '../../resources/TextureCube';

export class PdrTextureCube implements ITextureCube
{
    public constructor(renderer: Renderer, textureCube: TextureCube)
    {
        console.log("Creating texture cube - WebGL 2.0")
    }

    public dispose(): void
    {
        console.log("Disposing texture cube")
    }

    public enable(renderer: Renderer, textureUnit: number): void
    {
        console.log("Enabling texture cube")
    }

    public disable(renderer: Renderer, textureUnit: number): void
    {
        console.log("Disabling texture cube")
    }

    public lock(face: number, level: number, mode: BufferLocking): void
    {
        console.log("Locking texture cube")
    }

    public unlock(face: number, level: number): void
    {
        console.log("Unlocking texture cube")
    }
}