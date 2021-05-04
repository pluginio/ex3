import { ShaderFloat } from "./ShaderFloat";
import { Projector } from "../../resources/Projector";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";
import { Matrix } from "../../geom/Matrix";

export class ProjectorMatrixConstant extends ShaderFloat
{
    protected _projector: Projector   
    protected _biased: boolean
    protected _bsMatrix: number

    public constructor(projector: Projector, biased: boolean, bsMatrix: number)
    {
        super(4)
        this._projector = projector
        this._biased = biased
        this._bsMatrix = bsMatrix

        this._allowUpdater = true
    }

    public update(visual: Visual, camera: Camera): void
    {
        let pvMatrix: Matrix = this._projector.projectionViewMatrix
        let wMatrix: Matrix = visual.worldTransform.matrix
        let pvwMatrix: Matrix = pvMatrix.multiply(wMatrix)
        if(this._biased)
        {
            pvwMatrix = Projector.BiasScaleMatrix[this._bsMatrix].multiply(pvwMatrix)
        }

        let source: number[] = pvwMatrix.toArray()

        this._data.position = 0
        for(let i: number = 0; i < 16; ++i)
        {
            this._data.writeFloat32(source[i])
        }
    }

    public get projector(): Projector
    {
        return this._projector
    }
}