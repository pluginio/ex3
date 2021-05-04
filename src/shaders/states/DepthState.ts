import {CompareMode} from '../CompareMode'

export class DepthState
{
    public enabled: boolean = true
    public writable: boolean = true
    public compare: CompareMode = CompareMode.LEQUAL
}