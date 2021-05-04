import {CompareMode} from '../CompareMode'
import { OperationType } from '../../shaders/OperationType';
import { Constants } from '../../core/Constants';

export class StencilState
{
    public enabled: boolean = false
    public compare: CompareMode = CompareMode.NEVER
    public reference: number = 0

    // TODO Javascript numbers are not uint (Check compatibility)
    public mask: number = Constants.UINT_MAX
    public writeMask: number = Constants.UINT_MAX
    
    public onFail: OperationType = OperationType.KEEP
    public onZFail: OperationType = OperationType.KEEP
    public onZPass: OperationType = OperationType.KEEP
}