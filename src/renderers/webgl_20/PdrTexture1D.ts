import { ITexture1D } from '../interfaces/ITexture1D'
import { Renderer } from '../Renderer';
import { BufferLocking } from '../../resources/BufferLocking';
import { Texture1D } from '../../resources/Texture1D';

export class PdrTexture1D implements ITexture1D
{
    public constructor(renderer: Renderer, texture1D: Texture1D)
    {
        console.log("Creating texture 1d - WebGL 2.0")
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