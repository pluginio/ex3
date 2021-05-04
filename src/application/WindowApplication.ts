import { Application } from "./Application";
import { Renderer } from "renderers/Renderer";
import { TextureFormat } from "resources/TextureFormat";

export abstract class WindowApplication extends Application
{
    protected _date: Date

    protected _windowTitle: string
    protected _xPosition: number
    protected _yPosition: number
    protected _width: number
    protected _height: number
    protected _clearColor: number[]
    protected _allowResize: boolean

    protected _windowID: number

    protected _colorFormat: TextureFormat
    protected _depthStencilFormat: TextureFormat
    protected _numMultisamples: number
    protected _renderer: Renderer

    protected _lastTime: number
    protected _accumulatedTime: number
    protected _frameRate: number

    protected _frameCount: number
    protected _accumulatedFrameCount: number
    protected _timer: number
    protected _maxTimer: number

    constructor(windowTitle: string, xPosition: number,
        yPosition: number, width: number, height: number,
        clearColor: number[])
    {
        super()

        this._date = new Date()

        this._windowTitle = windowTitle
        this._xPosition = xPosition
        this._yPosition = yPosition
        this._width = width
        this._height = height
        this._clearColor = clearColor
        this._allowResize = true

        this._windowID = 0
        this._renderer = null
        this._lastTime = -1
        this._accumulatedTime = 0
        this._frameRate = 0
        this._frameCount = 0
        this._accumulatedFrameCount = 0
        this._timer = 30
        this._maxTimer = 300

        // TODO Path if neccessary
        this._colorFormat = TextureFormat.A8R8G8B8
        this._depthStencilFormat = TextureFormat.D24S8
        this._numMultisamples = 0
    }

    public dispose(): void
    {

    }

    public run(numArguments: number, args: string[]): number
    {
        let theApp: WindowApplication = Application.TheApplication as WindowApplication
        return theApp.main(numArguments, args)
    }

    public main(numArguments: number, args:string[]): number
    {
        return 0
    }

    // member access
    public get windowTitle(): string
    {
        return this._windowTitle
    }

    public get xPosition(): number
    {
        return this._xPosition
    }

    public get yPosition(): number
    {
        return this._yPosition
    }

    public get width(): number
    {
        return this._width
    }

    public get height(): number
    {
        return this._height
    }

    public get aspectRatio(): number
    {
        return this._width/this._height
    }

    public set windowID(windowID: number)
    {
        this._windowID = windowID
    }

    public get windowID(): number
    {
        return this._windowID
    }

    public get renderer(): Renderer
    {
        return this._renderer
    }

    // event callbacks
    public onInitialize(): boolean
    {
        this._renderer.clearColor = this._clearColor
        return true
    }

    public onTerminate(): void
    {
    }

    public onMove(x: number, y: number): void
    {
        this._xPosition = x
        this._yPosition = y
    }

    public onResize(width: number, height: number): void
    {
        if(width > 0 && height > 0)
        {
            if(this._renderer)
            {
                this._renderer.resize(width, height)
            }

            this._width = width
            this._height = height
        }
    }
    
    public onPrecreate(): boolean
    {
        return true
    }

    public onPreidle(): void
    {
        this._renderer.clearBuffers()
    }

    public onDisplay(): void {}
    public onIdle(): void {}
    public onKeyDown(key: string, x: number, y: number): boolean { return false }
    public onKeyUp(key: string, x: number, y: number): boolean { return false }
    public onSpecialKeyDown(key: number, x: number, y: number): boolean { return false }
    public onSpecialKeyUp(key: number, x: number, y: number): boolean { return false }
    public onMouseClick(button: number, state: number, x: number, y: number,
        modifiers: number): boolean { return false }
    public onMotion(button: number, x: number, y: number, modifiers: number): boolean { return false }
    public onPassiveMotion(x: number, y: number): boolean { return false }
    public onMouseWheel(delta: number, x: number, y: number, modifiers: number): boolean { return false }

    // mouse position
    public setMousePosition(x: number, y: number): void {}
    public getMousePosition(): number[] { return [0,0] }

    // font
    public getStringWidth(text: string): number { return 0 }
    public getCharacterWidth(character: string): number { return 0 }
    public getFontHeight(): number { return 0 }

    // TODO key identifiers

    // performance measurements
    protected resetTime(): void
    {
        this._lastTime = -1
    }

    protected measureTime(): void
    {
        if(this._lastTime == 1)
        {
            this._lastTime = this._date.getTime() / 1000
            this._accumulatedTime = 0
            this._frameRate = 0
            this._frameCount = 0
            this._accumulatedFrameCount = 0
            this._timer = this._maxTimer
        }

        // accumulate the time only when the miniature time allows it
        if(--this._timer == 0)
        {
            let currentTime: number = this._date.getTime() / 1000
            let delta: number = currentTime - this._lastTime
            this._lastTime = currentTime
            this._accumulatedTime += delta
            this._accumulatedFrameCount += this._frameCount
            this._frameCount = 0
            this._timer = this._maxTimer
        } 
    }

    protected updateFrameCount(): void
    {
        ++this._frameCount
    }

    protected drawFrameRate(x: number, y: number, color: number[]): void
    {
        if(this._accumulatedTime > 0)
        {
            this._frameRate = this._accumulatedFrameCount / this._accumulatedTime
        }
        else
        {
            this._frameRate = 0
        }
        // TODO display on renderer 
        // mRenderer.drawFramerate(x, y, color, message)
        console.log(`fps: ${this._frameRate}`)
    }
}