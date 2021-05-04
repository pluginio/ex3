import { ControlledObject } from '../controllers/ControlledObject'

export abstract class Controller
{
    //TODO private abstract static readonly _pool: Pool<Controller>

    public repeat: RepeatType = RepeatType.CLAMP
    public minTime: number = 0
    public maxTime: number = 0
    public phase: number = 0
    public frequency: number = 1
    public active: boolean = true

    private _object: ControlledObject = null
    private _applicationTime: number = -Number.MAX_VALUE

    public get object(): ControlledObject
    {
        return this._object
    }

    // internal
    public set object(value: ControlledObject)
    {
        this._object = value
    }

    public get applicationTime(): number
    {
        return this._applicationTime
    }

    public set applicationTime(value: number)
    {
        this._applicationTime = value
    }

    public update(applicationTime: number): boolean
    {
        if(this.active)
        {
            this._applicationTime = applicationTime
            return true
        }
        return false
    }

    protected get controlTime(): number
    {
        let controlTime = this.frequency * this.applicationTime + this.phase

        if(this.repeat == RepeatType.CLAMP)
        {
            if(controlTime < this.minTime)
            {
                return this.minTime
            }
            if(controlTime > this.maxTime)
            {
                return this.maxTime
            }
            return controlTime
        }

        let timeRange: number = this.maxTime - this.minTime
        if(timeRange > 0)
        {
            let multiples: number = (controlTime - this.minTime) / timeRange
            let integerTime: number = Math.floor(multiples)
            let fractionTime: number = multiples - integerTime

            if(this.repeat == RepeatType.WRAP)
            {
                return this.minTime + fractionTime * timeRange
            }

            if(Math.round(integerTime) & 1)
            {
                return this.maxTime - fractionTime * timeRange
            }
            else
            {
                return this.minTime + fractionTime * timeRange
            }
        }

        return this.minTime
    }
}

export enum RepeatType
{
    CLAMP,
    WRAP,
    CYCLE
}