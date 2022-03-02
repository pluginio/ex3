import { Color3ds } from "./Color3ds"

export class Material3ds
{
    public name: string = ""
    public mapName: String = ""
    public diffuse: Color3ds = new Color3ds()
    public ambient: Color3ds = new Color3ds()
    public specular: Color3ds = new Color3ds()
    public shininess: number = 0
    public transparency: number = 1

    public constructor()
    {

    }
}
