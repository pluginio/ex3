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