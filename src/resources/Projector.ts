import { Camera } from "../display/Camera";
import { DepthType } from "../display/DepthType";
import { Matrix } from "../geom/Matrix";

export class Projector extends Camera
{
    public static BiasScaleMatrix: Matrix[] = [
        new Matrix(
            0.5,  0.0, 0.0, 0.5,
            0.0, -0.5, 0.0, 0.5,
            0.0,  0.0, 1.0, 0.0,
            0.0,  0.0, 0.0, 1.0
        ),
        new Matrix(
            0.5,  0.0, 0.0, 0.5,
            0.0,  0.5, 0.0, 0.5,
            0.0,  0.0, 1.0, 0.0,
            0.0,  0.0, 0.0, 1.0
        )
    ]

    public constructor(depthType: DepthType, isPerspective: boolean = true)
    {
        super(isPerspective)
        this._depthType = depthType
    }
}