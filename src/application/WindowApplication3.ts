import { WindowApplication } from "./WindowApplication";
import { Camera } from "../display/Camera";
import { Vector } from "../geom/Vector";
import { Spatial } from "../display/Spatial";
import { Matrix } from "../geom/Matrix";
import { Point } from "../geom/Point";

export class WindowApplication3 extends WindowApplication
{
    protected _camera: Camera
    protected _worldAxis: Vector[]
    protected _trnSpeed: number
    protected _trnSpeedFactor: number
    protected _rotSpeed: number
    protected _rotSpeedFactor: number

    protected _uArrowPressed: boolean
    protected _dArrowPressed: boolean
    protected _lArrowPressed: boolean
    protected _rArrowPressed: boolean
    protected _pgUpPressed: boolean
    protected _pgDnPressed: boolean
    protected _homePressed: boolean
    protected _endPressed: boolean
    protected _insertPressed: boolean
    protected _deletePressed: boolean

    protected _cameraMovable: boolean

    protected _motionObject: Spatial
    protected _doRoll: number
    protected _doYaw: number
    protected _doPitch: number
    protected _xTrack0: number
    protected _yTrack0: number
    protected _xTrack1: number
    protected _yTrack1: number
    protected _saveRotate: Matrix
    protected _useTrackBall: boolean
    protected _trackBallDown: boolean

    constructor(windowTitle: string, xPosition: number,
        yPosition: number, width: number, height: number,
        clearColor: number[])
    {
        super(windowTitle, xPosition, yPosition, width, height, clearColor)

        this._trnSpeed = 0
        this._rotSpeed = 0
        this._uArrowPressed = false
        this._dArrowPressed = false
        this._lArrowPressed = false
        this._rArrowPressed = false
        this._pgUpPressed = false
        this._pgDnPressed = false
        this._homePressed = false
        this._endPressed = false
        this._insertPressed = false
        this._deletePressed = false
        this._cameraMovable = false
        this._doRoll = 0
        this._doYaw = 0
        this._doPitch = 0
        this._xTrack0 = 0
        this._yTrack0 = 0
        this._xTrack1 = 0
        this._yTrack1 = 0
        this._useTrackBall = true
        this._trackBallDown = false
        
        this._worldAxis = [
            Vector.ZERO,
            Vector.ZERO,
            Vector.ZERO
        ]
    }

    public dispose(): void
    {
        super.dispose()
    }

    public onInitialize(): boolean
    {
        if(!super.onInitialize())
        {
            return false
        }

        this._camera = new Camera(false)
        this._renderer.camera = this._camera
        this._motionObject = null

        return true
    }

    public onTerminate(): void
    {
        this._renderer.camera = null
        this._camera = null
        this._motionObject = null
        super.onTerminate()
    }

    public onKeyDown(key: string, x: number, y: number): boolean
    {
        if(super.onKeyDown(key, x, y))
        {
            return true
        }

        switch(key)
        {
            case 't':
                if(this._cameraMovable)
                {
                    this._trnSpeed /= this._trnSpeedFactor
                }
                return true
            case 'T':
                if(this._cameraMovable)
                {
                    this._trnSpeed *= this._trnSpeedFactor
                }
                return true
            case 'r':
                if(this._cameraMovable)
                {
                    this._rotSpeed /= this._rotSpeedFactor
                }
                return true
            case 'R':
                if(this._cameraMovable)
                {
                    this._rotSpeed *= this._rotSpeedFactor
                }
                return true
            case '?':
                this.resetTime()
                return true
        }

        return false
    }

    public onSpecialKeyDown(key: number, x: number, y: number): boolean
    {
        if(this._cameraMovable)
        {
            if(key == KeyCodes.LEFT_ARROW)
            {
                this._lArrowPressed = true
                return true
            }
            if(key == KeyCodes.RIGHT_ARROW)
            {
                this._rArrowPressed = true
                return true
            }
            if(key == KeyCodes.UP_ARROW)
            {
                this._uArrowPressed = true
                return true
            }
            if(key == KeyCodes.DOWN_ARROW)
            {
                this._dArrowPressed = true
                return true
            }
            if(key == KeyCodes.PAGE_UP)
            {
                this._pgUpPressed = true
                return true
            }
            if(key == KeyCodes.PAGE_DOWN)
            {
                this._pgDnPressed = true
                return true
            }
            if(key == KeyCodes.HOME)
            {
                this._homePressed = true
                return true
            }
            if(key == KeyCodes.END)
            {
                this._endPressed = true
                return true
            }
            if(key == KeyCodes.INSERT)
            {
                this._insertPressed = true
                return true
            }
            if(key == KeyCodes.DELETE)
            {
                this._deletePressed = true
                return true
            }
        }

        if(this._motionObject)
        {
            if(key == KeyCodes.F1)
            {
                this._doRoll = -1
                return true
            }
            if(key == KeyCodes.F2)
            {
                this._doRoll = 1
                return true
            }
            if(key == KeyCodes.F3)
            {
                this._doYaw = -1
                return true
            }
            if(key == KeyCodes.F4)
            {
                this._doYaw = 1
                return true
            }
            if(key == KeyCodes.F5)
            {
                this._doPitch = -1
                return true
            }
            if(key == KeyCodes.F6)
            {
                this._doPitch = 1
                return true
            }
        }

        return false
    }

    public onSpecialKeyUp(key: number, x: number, y: number): boolean
    {
        if(this._cameraMovable)
        {
            if(key == KeyCodes.LEFT_ARROW)
            {
                this._lArrowPressed = false
                return true
            }
            if(key == KeyCodes.RIGHT_ARROW)
            {
                this._rArrowPressed = false
                return true
            }
            if(key == KeyCodes.UP_ARROW)
            {
                this._uArrowPressed = false
                return true
            }
            if(key == KeyCodes.DOWN_ARROW)
            {
                this._dArrowPressed = false
                return true
            }
            if(key == KeyCodes.PAGE_UP)
            {
                this._pgUpPressed = false
                return true
            }
            if(key == KeyCodes.PAGE_DOWN)
            {
                this._pgDnPressed = false
                return true
            }
            if(key == KeyCodes.HOME)
            {
                this._homePressed = false
                return true
            }
            if(key == KeyCodes.END)
            {
                this._endPressed = false
                return true
            }
            if(key == KeyCodes.INSERT)
            {
                this._insertPressed = false
                return true
            }
            if(key == KeyCodes.DELETE)
            {
                this._deletePressed = false
                return true
            }
        }

        if(this._motionObject)
        {
            if(key == KeyCodes.F1)
            {
                this._doRoll = 0
                return true
            }
            if(key == KeyCodes.F2)
            {
                this._doRoll = 0
                return true
            }
            if(key == KeyCodes.F3)
            {
                this._doYaw = 0
                return true
            }
            if(key == KeyCodes.F4)
            {
                this._doYaw = 0
                return true
            }
            if(key == KeyCodes.F5)
            {
                this._doPitch = 0
                return true
            }
            if(key == KeyCodes.F6)
            {
                this._doPitch = 0
                return true
            }
        }

        return false
    }

    public onMouseClick(button: number, state: number, x: number,
        y: number, modifiers: number): boolean
    {
        if(!this._useTrackBall
        || button != KeyCodes.MOUSE_LEFT_BUTTON
        || !this._motionObject)
        {
            return false
        }

        let mult: number = 1 / (this._width >= this._height ? this._height : this._width)

        if(state == KeyCodes.MOUSE_DOWN)
        {
            this._trackBallDown = true
            this._saveRotate = this._motionObject.localTransform.getRotate()
            this._xTrack0 = (2 * x - this._width) * mult
            this._yTrack0 = (2 * (this._height - 1 - y) - this._height) * mult
        }
        else
        {
            this._trackBallDown = false
        }

        return true
    }

    public onMotion(button: number, x: number, y: number, modifiers: number): boolean
    {
        if(!this._useTrackBall
        || button != KeyCodes.MOUSE_LEFT_BUTTON
        || !this._trackBallDown
        || !this._motionObject)
        {
            return false
        }

        let mult: number = 1 / (this._width >= this._height ? this._height : this._width)
        this._xTrack1 = (2 * x - this._width) * mult
        this._yTrack1 = (2*(this._height - 1 - y) - this._height) * mult

        this.rotateTrackBall(this._xTrack0, this._yTrack0, this._xTrack1, this._yTrack1)
        return true
    }

    protected initializeCameraMotion(trnSpeed: number, rotSpeed: number,
        trnSpeedFactor: number = 2, rotSpeedFactor: number = 2): void
    {
        this._cameraMovable = true

        this._trnSpeed = trnSpeed
        this._rotSpeed = rotSpeed
        this._trnSpeedFactor = trnSpeedFactor
        this._rotSpeedFactor = rotSpeedFactor

        this._worldAxis[0] = this._camera.dVector
        this._worldAxis[1] = this._camera.uVector
        this._worldAxis[2] = this._camera.rVector
    }

    protected moveCamera()
    {
        if(!this._cameraMovable)
        {
            return false
        }

        let moved: boolean = false

        if(this._uArrowPressed)
        {
            this.moveForward()
            moved = true
        }

        if(this._dArrowPressed)
        {
            this.moveBackward()
            moved = true
        }

        if(this._homePressed)
        {
            this.moveUp()
            moved = true
        }

        if(this._endPressed)
        {
            this.moveDown()
            moved = true
        }

        if(this._lArrowPressed)
        {
            this.turnLeft()
            moved = true
        }

        if(this._rArrowPressed)
        {
            this.turnRight()
            moved = true
        }

        if(this._pgUpPressed)
        {
            this.lookUp()
            moved = true
        }

        if(this._pgDnPressed)
        {
            this.lookDown()
            moved = true
        }

        if(this._insertPressed)
        {
            this.moveRight()
            moved = true
        }

        if(this._deletePressed)
        {
            this.moveLeft()
            moved = true
        }

        return moved
    }

    protected moveForward(): void
    {
        let pos: Point = this._camera.position
        pos.addEq(this._worldAxis[0].scale(this._trnSpeed))
        this._camera.setPosition(pos)
    }

    protected moveBackward(): void
    {
        let pos: Point = this._camera.position
        pos.subtractEq(this._worldAxis[0].scale(this._trnSpeed))
        this._camera.setPosition(pos)
    }

    protected moveUp(): void
    {
        let pos: Point = this._camera.position
        pos.addEq(this._worldAxis[1].scale(this._trnSpeed))
        this._camera.setPosition(pos)
    }

    protected moveDown(): void
    {
        let pos: Point = this._camera.position
        pos.subtractEq(this._worldAxis[1].scale(this._trnSpeed))
        this._camera.setPosition(pos)
    }

    protected turnLeft(): void
    {
        let incr: Matrix = Matrix.fromAxisAngle(this._worldAxis[1], this._rotSpeed)
        this._worldAxis[0] = incr.multiplyVector(this._worldAxis[0])
        this._worldAxis[2] = incr.multiplyVector(this._worldAxis[2])

        let dVector: Vector = incr.multiplyVector(this._camera.dVector)
        let uVector: Vector = incr.multiplyVector(this._camera.uVector)
        let rVector: Vector = incr.multiplyVector(this._camera.rVector)

        this._camera.setAxes(dVector, uVector, rVector)
    }

    protected moveLeft(): void
    {
        let pos: Point = this._camera.position
        pos.subtractEq(this._worldAxis[2].scale(this._trnSpeed))
        this._camera.setPosition(pos)
    }

    protected moveRight(): void
    {
        let pos: Point = this._camera.position
        pos.addEq(this._worldAxis[2].scale(this._trnSpeed))
        this._camera.setPosition(pos)
    }

    protected turnRight(): void
    {
        let incr: Matrix = Matrix.fromAxisAngle(this._worldAxis[1], -this._rotSpeed)
        this._worldAxis[0] = incr.multiplyVector(this._worldAxis[0])
        this._worldAxis[2] = incr.multiplyVector(this._worldAxis[2])

        let dVector: Vector = incr.multiplyVector(this._camera.dVector)
        let uVector: Vector = incr.multiplyVector(this._camera.uVector)
        let rVector: Vector = incr.multiplyVector(this._camera.rVector)

        this._camera.setAxes(dVector, uVector, rVector)
    }

    protected lookUp(): void
    {
        let incr: Matrix = Matrix.fromAxisAngle(this._worldAxis[2], this._rotSpeed)
        
        let dVector: Vector = incr.multiplyVector(this._camera.dVector)
        let uVector: Vector = incr.multiplyVector(this._camera.uVector)
        let rVector: Vector = incr.multiplyVector(this._camera.rVector)

        this._camera.setAxes(dVector, uVector, rVector)
    }

    protected lookDown(): void
    {
        let incr: Matrix = Matrix.fromAxisAngle(this._worldAxis[2], -this._rotSpeed)
        
        let dVector: Vector = incr.multiplyVector(this._camera.dVector)
        let uVector: Vector = incr.multiplyVector(this._camera.uVector)
        let rVector: Vector = incr.multiplyVector(this._camera.rVector)

        this._camera.setAxes(dVector, uVector, rVector)
    }

    public initializeObjectMotion(motionObject: Spatial): void
    {
        this._motionObject = motionObject
    }

    protected moveObject(): boolean
    {
        throw new Error("Method not implemented")
    }

    protected rotateTrackBall(x0: number, y0: number, x1: number,
        y1: number): void
    {
        throw new Error("Method not implemented")
    }
}

export class KeyCodes
{
    public static LEFT_ARROW: number = 37
    public static RIGHT_ARROW: number = 39
    public static UP_ARROW: number = 38
    public static DOWN_ARROW: number = 40
    public static PAGE_UP: number = 33
    public static PAGE_DOWN: number = 34
    public static HOME: number = 36
    public static END: number = 35
    public static INSERT: number = 45
    public static DELETE: number = 46
    public static F1: number = 112
    public static F2: number = 113
    public static F3: number = 114
    public static F4: number = 115
    public static F5: number = 116
    public static F6: number = 117

    public static MOUSE_LEFT_BUTTON: number = 0
    public static MOUSE_MIDDLE_BUTTON: number = 1
    public static MOUSE_RIGHT_BUTTON: number = 2

    public static MOUSE_DOWN: number = 1
}