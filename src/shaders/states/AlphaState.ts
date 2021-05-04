import { SrcBlendMode } from "../../shaders/SrcBlendMode";
import { DstBlendMode } from "../../shaders/DstBlendMode";
import { CompareMode } from "../../shaders/CompareMode";

export class AlphaState
{
    public blendEnabled: boolean = false
    public srcBlend: SrcBlendMode = SrcBlendMode.SRC_ALPHA
    public dstBlend: DstBlendMode = DstBlendMode.ONE_MINUS_SRC_ALPHA
    public compareEnabled: boolean = false
    public compare: CompareMode = CompareMode.ALWAYS
    public reference: number = 0
    public constantColor: number[] = [0, 0, 0, 0]
}