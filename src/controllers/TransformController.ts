import { Spatial } from "../display/Spatial";
import { Transform } from "../geom/Transform";
import { Controller } from "./Controller";

export class TransformController extends Controller
{
    protected _localTransform: Transform

    public constructor(localTransform: Transform)
    {
        super()
        this._localTransform = localTransform
    }

    public get localTransform(): Transform
    {
        return this._localTransform
    }

    public set localTransform(value: Transform)
    {
        this._localTransform = value;
    }

    public update(applicationTime: number): boolean
    {
        if(!super.update(applicationTime))
        {
            return false;
        }

        let spatial = this._object as Spatial
        spatial.localTransform = this._localTransform
        return true
    }
}
