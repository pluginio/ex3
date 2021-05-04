export class Pool<T> {
    private _released: T[]
    private readonly _pool: T[]

    private type: new () => T

    public constructor(count: number, type: new () => T) {
        this.type = type

        this._released = new Array<T>()
        this._pool = new Array<T>()

        this.expand(count)
    }

    public expand(count: number = 10): void {
        let i
        for (i = 0; i < count; ++i) {
            let t: T = new this.type()
            this._released.push(t)
        }
        let total: number = this._pool.length + this._released.length
        console.info(
            this.type.name + ' pool expanded. Total objects in pool: ' + total
        )
    }

    public get(): T {
        if (this._released.length == 0) {
            this._released.push(new this.type())
        }

        let obj: T = this._released.shift()
        this._pool.push(obj)

        return obj
    }

    public release(obj: T): void {
        let pos = this._pool.indexOf(obj)
        if (pos > -1) {
            this._pool.splice(pos, 1)
            this._released.push(obj)
        }
    }

    public clear(): void {
        for (let obj of this._pool) {
            this.release(obj)
        }
        this._pool.length = 0
        this._released.length = 0
    }

    public get numReleased(): number {
        return this._released.length
    }

    public get numActive(): number {
        return this._pool.length
    }

    public get active(): T[] {
        return this._pool
    }
}
