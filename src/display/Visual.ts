import { ByteArray } from '../core/ByteArray';
import { AttributeType } from '../resources/AttributeType';
import { AttributeUsage } from '../resources/AttributeUsage';
import { Bound } from '../geom/Bound';
import { IndexBuffer } from '../resources/IndexBuffer';
import { VertexBuffer } from '../resources/VertexBuffer';
import { VertexFormat } from '../resources/VertexFormat';
import { Culler } from './Culler';
import { PrimitiveType } from './PrimitiveType';
import { Spatial } from './Spatial';
import { UpdateType } from './UpdateType';
import { VisualEffectInstance } from '../shaders/VisualEffectInstance';

export abstract class Visual extends Spatial
{
    protected _type: PrimitiveType
    protected _vFormat: VertexFormat
    protected _vBuffer: VertexBuffer
    protected _iBuffer: IndexBuffer
    protected _modelBound: Bound

    protected _effect: VisualEffectInstance

    public constructor(type: PrimitiveType, vFormat: VertexFormat, vBuffer: VertexBuffer, iBuffer: IndexBuffer)
    {
        super()

        this._type = type
        this._vFormat = vFormat
        this._vBuffer = vBuffer
        this._iBuffer = iBuffer
        this._modelBound = new Bound()

        this.updateModelSpace(UpdateType.MODEL_BOUND_ONLY)
    }

    public dispose(): void
    {
        super.dispose()
    }

    public get primitiveType(): PrimitiveType
    {
        return this._type
    }

    public set vertexFormat(value: VertexFormat)
    {
        this._vFormat = value
    }

    public get vertexFormat(): VertexFormat
    {
        return this._vFormat
    }

    public set vertexBuffer(value: VertexBuffer)
    {
        this._vBuffer = value
    }

    public get vertexBuffer(): VertexBuffer
    {
        return this._vBuffer
    }

    public set indexBuffer(value: IndexBuffer)
    {
        this._iBuffer = value
    }

    public get indexBuffer(): IndexBuffer
    {
        return this._iBuffer
    }

    public get modelBound(): Bound
    {
        return this._modelBound
    }

    public set effectInstance(value: VisualEffectInstance)
    {
        this._effect = value
    }

    public get effectInstance(): VisualEffectInstance
    {
        return this._effect
    }

    public updateModelSpace(type: UpdateType)
    {
        // virtual
        this.updateModelBound()
    }

    // override
    protected updateWorldBound()
    {
        this._modelBound.transformBy(this.worldTransform, this.worldBound)
    }

    protected updateModelBound()
    {
        let numVertices: number = this._vBuffer.numElements
        let stride: number = this._vFormat.stride

        let posIndex: number = this._vFormat.indexAt(AttributeUsage.POSITION)
        if(posIndex == -1)
        {
            console.assert(false, "Update requires vertex positions")
            return
        }

        let posType: AttributeType = this._vFormat.attributeTypeAt(posIndex)
        if(posType != AttributeType.FLOAT3 &&
            posType != AttributeType.FLOAT4)
        {
            console.assert(false, "Positions must be 3-tuples or 4-tuples")
        }

        let data: ByteArray = this._vBuffer.data
        data.position = this._vFormat.offsetAt(posIndex)
        this._modelBound.computeFromData(numVertices, stride, data)
    }

    // internal - override TODO beware of internal signature for override
    public getVisibleSet(culler: Culler, noCull: boolean) 
    {
        culler.insert(this)
    }

}