import { ControlledObject } from "../controllers/ControlledObject";
import { Transform } from "../geom/Transform";
import { Bound } from "../geom/Bound";
import { CullingMode } from "./CullingMode";
import { Culler } from "./Culler";

export abstract class Spatial extends ControlledObject
{
    public localTransform: Transform = Transform.IDENTITY
    public worldTransform: Transform = Transform.IDENTITY
    
    public worldTransformIsCurrent: boolean = false

    public worldBound: Bound = Bound.new()
    public worldBoundIsCurrent: boolean = false

    public culling: CullingMode = CullingMode.DYNAMIC

    protected _parent: Spatial = null

    protected constructor()
    {
        super()
    }

    public dispose(): void
    {
        this.localTransform.dispose()
        this.worldTransform.dispose()
        this.worldBound.dispose()

        super.dispose()
    }

    public update(applicationTime: number = -Number.MAX_VALUE, initiator: boolean = true)
    {
        this.updateWorldData(applicationTime);
        this.updateWorldBound();
        if (initiator)
        {
            this.propagateBoundToRoot();
        }
    }

    public get parent(): Spatial
    {
        return this._parent
    }

    // internal
    public onGetVisibleSet(culler: Culler, noCull: boolean): void
    {
        if (this.culling == CullingMode.ALWAYS)
        {
            return;
        }
    
        if (this.culling == CullingMode.NEVER)
        {
            noCull = true;
        }
    
        let savePlaneState: number = culler.planeState //uint
        if (noCull || culler.isVisible(this.worldBound))
        {
            this.getVisibleSet(culler, noCull)
        }
        culler.planeState = savePlaneState
    }

    // internal
    public getVisibleSet(culler: Culler, noCull: boolean)
    {
        throw new Error("Spatial::getVisibleSet must be overridden")
    }

    // internal
    public set parent(parent: Spatial)
    {
        this._parent = parent
    }

    protected updateWorldData(applicationTime: number): void
    {
        // Update any controllers associated with this object.
        this.updateControllers(applicationTime);

        // Update world transforms.
        if (!this.worldTransformIsCurrent)
        {
            if (this._parent)
            {
                this.worldTransform = this._parent.worldTransform.multiply(this.localTransform)
            }
            else
            {
                this.worldTransform = this.localTransform;
            }
        }
    }

    protected updateWorldBound(): void
    {
        throw new Error("Spatial::updateWorldBound must be overridden")
    }

    protected propagateBoundToRoot(): void
    {
        if(this._parent)
        {
            this._parent.updateWorldBound()
            this._parent.propagateBoundToRoot()
        }
    }
}