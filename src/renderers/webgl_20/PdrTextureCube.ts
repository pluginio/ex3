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

    }

    public enable(renderer: Renderer, textureUnit: number): void
    {

    }

    public disable(renderer: Renderer, textureUnit: number): void
    {

    }

    public lock(face: number, level: number, mode: BufferLocking): void
    {

    }

    public unlock(face: number, level: number): void
    {

    }
}