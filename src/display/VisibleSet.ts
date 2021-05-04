import { Spatial } from "./Spatial";
import { Disposable } from "../core/Disposable";

export class VisibleSet implements Disposable
{
    private _visible: Spatial[] = []

    public dispose(): void
    {
        this._visible.length = 0
    }

    public get numVisible(): number
    {
        return this._visible.length
    }

    public get allVisible(): Spatial[]
    {
        return this._visible
    }

    public getVisibleAt(index: number): Spatial
    {
        console.assert(0 <= index && index < this._visible.length, "Invalid index to visibleAt")
        return this._visible[index]
    }

    public insert(visible: Spatial): void
    {
        this._visible.push(visible)
    }

    public clear(): void
    {
        this._visible.length = 0
    }
}