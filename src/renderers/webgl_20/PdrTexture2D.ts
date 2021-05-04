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

    }

    public enable(renderer: Renderer, textureUnit: number): void
    {

    }

    public disable(renderer: Renderer, textureUnit: number): void
    {

    }

    public lock(level: number, mode: BufferLocking): void
    {

    }

    public unlock(level: number): void
    {

    }
}