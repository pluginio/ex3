import { Vector } from "./Vector";

export class AxisAngle
{
    public axis: Vector
    public angle: Number

    constructor(axis: Vector, angle: number)
    {
        this.axis = axis
        this.angle = angle
    }
}