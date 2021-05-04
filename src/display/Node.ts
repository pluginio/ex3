import {Spatial} from "./Spatial"
import { Culler } from "./Culler";

export class Node extends Spatial
{
    protected _child: Spatial[] = []

    public constructor()
    {
        super()
    }

    public dispose(): void
    {
        this._child.forEach(element => {
            element.parent = null
            element = null
        });
        this._child.length = 0;

        super.dispose()
    }

    public get numChildren()
    {
        return this._child.length
    }

    public attachChild(child: Spatial): number
    {
        if(!child)
        {
            console.assert(false, "You cannot attach null children to a node.")
        }

        if(child.parent)
        {
            console.assert(false, "The child already has a parent.")
            return -1
        }

        child.parent = this

        //TODO check that javascript get find null object in a list with indexOf
        for(let i: number = 0; i < this._child.length; ++i)
        {
            if(this._child[i] == null)
            {
                this._child[i] = child
                return i
            }
        }

        this._child.push(child)

        return this.numChildren
    }

    public detachChild(child: Spatial): number
    {
        if(child)
        {
            for(let i = 0; i < this._child.length; ++i)
            {
                if(child == this._child[i])
                {
                    this._child[i].parent = null
                    this._child[i] = null
                    return i
                }
            }
        }

        return -1
    }

    public detachChildAt(index: number): Spatial
    {
        if(0 <= index && index < this._child.length)
        {
            if(this._child[index])
            {
                this._child[index].parent = null
                this._child[index] = null
            }
            return this._child[index]
        }
        return null
    }

    public setChildAt(index: number, child: Spatial): Spatial
    {
        if(child)
        {
            console.assert(!child.parent, "The child already has a parent")
        }

        let numChildren: number = this._child.length

        let previousChild: Spatial = this._child[index]
        if(previousChild)
        {
            previousChild.parent = null
        }

        if(child)
        {
            child.parent = this
        }

        this._child[index] = child
        return previousChild
    }

    public getChildAt(index: number): Spatial
    {
        if(0 <= index && index < this._child.length)
        {
            return this._child[index]
        }
        return null
    }

    protected updateWorldData(applicationTime: number): void
    {
        super.updateWorldData(applicationTime)
        this._child.forEach(element => {
            element.update(applicationTime, false)
        });
    }

    protected updateWorldBound(): void
    {
        this.worldBound.center.set(0, 0, 0, 1)
        this.worldBound.radius = 0

        this._child.forEach(element => {
            if(element)
            {
                this.worldBound.growToContain(element.worldBound)
            }
        });
    }

    // internal TODO check discrepancy between protected and public internal in Node & spatial
    public getVisibleSet(culler: Culler, noCull: boolean): void
    {
        this._child.forEach(element => {
            element.onGetVisibleSet(culler, noCull)
        });
    }
}