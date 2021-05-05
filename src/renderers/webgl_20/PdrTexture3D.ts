import { ITexture3D } from '../interfaces/ITexture3D'
import { Renderer } from '../Renderer';
import { BufferLocking } from '../../resources/BufferLocking';
import { Texture3D } from '../../resources/Texture3D';

export class PdrTexture3D implements ITexture3D
{
    public constructor(renderer: Renderer, texture3D: Texture3D)
    {
        console.log("Creating texture 3d - WebGL 2.0")
    }

    public dispose(): void
    {
        console.log("Disposing 3d texture")
    }

    public enable(renderer: Renderer, textureUnit: number): void
    {
        console.log("Enabling 3d texture")
    }

    public disable(renderer: Renderer, textureUnit: number): void
    {
        console.log("Disabling 3d texture")
    }

    public lock(level: number, mode: BufferLocking): void
    {
        console.log("Locking 3d texture")
    }

    public unlock(level: number): void
    {
        console.log("Unlocking 3d texture")
    }
}