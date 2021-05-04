import { AttributeType } from "./AttributeType";
import { AttributeUsage } from "./AttributeUsage";
import { Disposable } from "../core/Disposable";
import { Attribute } from "./Attribute";

export class VertexFormat implements Disposable
{
    public static MAX_ATTRIBUTES: number = 16
    public static MAX_TCOORD_UNITS: number = 8
    public static MAX_COLOR_UNITS: number = 2

    public static create(numAttributes: number, ...args:any): VertexFormat
    {
        let vFormat = new VertexFormat(numAttributes)

        let offset: number = 0
        let pointer: number = 0

        for(let i = 0; i < numAttributes; ++i)
        {
            let usage: AttributeUsage = args[pointer++]
            let type: AttributeType = args[pointer++]
            let usageIndex: number = args[pointer++]
            vFormat.setAttribute(i, 0, offset, type, usage, usageIndex)

            offset += this.msTypeSize[type] //TODO does the enum get cast automatically?
        }

        vFormat.stride = offset

        return vFormat
    }

    public static getComponentSize(type: AttributeType): number
    {
        return this.msComponentSize[type]
    }

    public static getNumComponents(type: AttributeType): number
    {
        return this.msNumComponents[type]
    }

    public static getTypeSize(type: AttributeType): number
    {
        return this.msTypeSize[type]
    }

    protected _numAttributes: number
    protected _attributes: Attribute[] = []
    protected _stride: number

    public constructor(numAttributes: number)
    {
        this._numAttributes = numAttributes
        this._stride = 0

        console.assert(this._numAttributes > 0, "Number of attributes must be positive")

        for(let i = 0; i < VertexFormat.MAX_ATTRIBUTES; ++i)
        {
            let attribute: Attribute = new Attribute()
            attribute.streamIndex = 0
            attribute.offset = 0
            attribute.type = AttributeType.NONE
            attribute.usage = AttributeUsage.NONE
            attribute.usageIndex = 0

            this._attributes.push(attribute)
        }
    }

    public dispose(): void
    {
        //TODO Renderer.UnbindAllVertexFormat()
    }

    public setAttribute(attribute: number, streamIndex: number, offset: number, type: AttributeType,
        usage: AttributeUsage, usageIndex: number): void
    {
        console.assert(0 <= attribute && attribute < this._numAttributes, "Invalid index in setAttribute")

        this._attributes[attribute].streamIndex = streamIndex
        this._attributes[attribute].offset = offset
        this._attributes[attribute].type = type
        this._attributes[attribute].usage = usage
        this._attributes[attribute].usageIndex = usageIndex
    }

    public set stride(stride: number)
    {
        console.assert(stride > 0, "Stride must be positive");
        this._stride = stride
    }

    public get numAttributes(): number
    {
        return this._numAttributes
    }

    public streamIndexAt(index: number): number
    {
        if(0 <= index && index < this._numAttributes)
        {
            return this._attributes[index].streamIndex
        }
        else
        {
            console.assert(false, "Invalid index in streamIndexAt")
        }
    }

    public offsetAt(index: number): number
    {
        if(0 <= index && index < this._numAttributes)
        {
            return this._attributes[index].offset
        }
        else
        {
            console.assert(false, "Invalid index in offsetAt")
        }
    }

    public attributeTypeAt(index: number): AttributeType
    {
        if(0 <= index && index < this._numAttributes)
        {
            return this._attributes[index].type
        }
        else
        {
            console.assert(false, "Invalid index in attributeTypeAt")
        }
    }

    public attributeUsageAt(index: number): AttributeUsage
    {
        if(0 <= index && index < this._numAttributes)
        {
            return this._attributes[index].usage
        }
        else
        {
            console.assert(false, "Invalid index in attributeUsageAt")
        }
    }

    public usageIndexAt(index: number): number
    {
        if(0 <= index && index < this._numAttributes)
        {
            return this._attributes[index].usageIndex
        }
        else
        {
            console.assert(false, "Invalid index in usageIndexAt")
        }
    }

    public attributeAt(index: number): Attribute
    {
        console.assert(0 <= index && index < this._numAttributes, "Invalid index in GetAttribute")

        let attribute: Attribute = this._attributes[index]
        
        // TODO can we not simply return the element from the list??
        let copy = new Attribute()
        copy.streamIndex = attribute.streamIndex
        copy.offset = attribute.offset
        copy.type = attribute.type
        copy.usage = attribute.usage

        return copy
    }

    public get stride(): number
    {
        return this._stride
    }

    public indexAt(usage: AttributeUsage, usageIndex: number = 0): number
    {
        for(let i = 0; i < this._numAttributes; ++i)
        {
            if(this._attributes[i].usage == usage &&
                this._attributes[i].usageIndex == usageIndex)
            {
                return i
            }
        }
        return -1
    }

    protected static msComponentSize: number[] = 
    [
        0,  // AT_NONE
        4,  // AT_FLOAT1
        4,  // AT_FLOAT2
        4,  // AT_FLOAT3
        4,  // AT_FLOAT4
        2,  // AT_HALF1
        2,  // AT_HALF2
        2,  // AT_HALF3
        2,  // AT_HALF4
        1,  // AT_UBYTE4
        2,  // AT_SHORT1
        2,  // AT_SHORT2
        2   // AT_SHORT4
    ]

    protected static msNumComponents: number[] = 
    [
        0,  // AT_NONE
        1,  // AT_FLOAT1
        2,  // AT_FLOAT2
        3,  // AT_FLOAT3
        4,  // AT_FLOAT4
        1,  // AT_HALF1
        2,  // AT_HALF2
        3,  // AT_HALF3
        4,  // AT_HALF4
        4,  // AT_UBYTE4
        1,  // AT_SHORT1
        2,  // AT_SHORT2
        4   // AT_SHORT4
    ]

    protected static msTypeSize: number[] =
    [
        0,  // AT_NONE
        4,  // AT_FLOAT1
        8,  // AT_FLOAT2
        12, // AT_FLOAT3
        16, // AT_FLOAT4
        2,  // AT_HALF1
        4,  // AT_HALF2
        6,  // AT_HALF3
        8,  // AT_HALF4
        4,  // AT_UBYTE4
        2,  // AT_SHORT1
        4,  // AT_SHORT2
        8   // AT_SHORT4
    ]
}