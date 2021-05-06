import {Disposable} from '../core/Disposable'

export class PooledList<T extends Disposable> implements Disposable
{
    private _elements: Array<T> = new Array<T>()
    private type: new () => T

    constructor(type: new () => T, numElements: number = 0){
        this.type = type
        this.reallocate(numElements)
    }

    public at(index: number): T
    {
        return this._elements[index]
    }

    public reallocate(numElements: number): void
    {
        this.dispose()

        let count = numElements
        while(count > 0)
        {
            let element = new this.type()
            // TODO: Make an interface for Pooled objects and call something like reset()
            this._elements.push(element)
            count--;
        }
    }

    public dispose(): void
    {
        this._elements.forEach(element => {
            element.dispose()
        })
    }
}