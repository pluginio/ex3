import { ITexture2D } from '../interfaces/ITexture2D'
import { Renderer } from '../Renderer';
import { BufferLocking } from '../../resources/BufferLocking';
import { Texture2D } from '../../resources/Texture2D';

export class PdrTexture2D implements ITexture2D
{
    public constructor(renderer: Renderer, texture2D: Texture2D)
    {
        console.log("Creating texture 2d - WebGL 2.0")
    }

    public dispose(): void
    {
        console.log("Disposing 2d texture")
    }

    public enable(renderer: Renderer, textureUnit: number): void
    {
        console.log("Enabling 2d texture")
    }

    public disable(renderer: Renderer, textureUnit: number): void
    {
        console.log("Disabling 2d texture")
    }

    public lock(level: number, mode: BufferLocking): void
    {
        console.log("Locking 2d texture")
    }

    public unlock(level: number): void
    {
        console.log("Unlocking 2d texture")
    }
}