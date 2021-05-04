import { Controller } from "./Controller";
import { Disposable } from "../core/Disposable";

export abstract class ControlledObject implements Disposable
{
    private _controllers: Controller[] = []

    public dispose(): void
    {
        this.detatchAllControllers()
        this._controllers.length = 0
    }

    public get numControllers(): number
    {
        return this._controllers.length
    }

    public getControllerAt(index: number): Controller
    {
        if(0 <= index && index < this._controllers.length)
        {
            return this._controllers[index]
        }
        
        console.assert(false, "Invalid index in GetController.")
        return null
    }

    public attachController(controller: Controller): void
    {
        if(this instanceof Controller)
        {
            console.assert(false, "Controllers may not be controlled")
            return
        }

        if(!controller)
        {
            console.assert(false, "Cannot attach a null controller")
        }

        if(this._controllers.includes(controller))
        {
            return
        }

        controller.object = this
        this._controllers.push(controller)
    }

    public detachController(controller: Controller): void
    {
        let index: number = this._controllers.indexOf(controller)
        if(index > -1)
        {
            controller.object = null
            this._controllers.splice(index, 1)
        }
    }

    public detatchAllControllers(): void
    {
        this._controllers.forEach(controller => {
            controller.object = null
            controller = null
        });

        this._controllers.length = 0
    }

    public updateControllers(applicationTime: number): boolean
    {
        let someoneUpdated: boolean = false

        this._controllers.forEach(controller => {
            if(controller.update(applicationTime))
            {
                someoneUpdated = true
            }
        });
        return someoneUpdated
    }
}