import {AttributeType} from "./AttributeType"
import {AttributeUsage} from "./AttributeUsage"

export class Attribute
{
    public streamIndex: number
    public offset: number
    public type: AttributeType
    public usage: AttributeUsage
    public usageIndex: number     
}