import { Camera, FrustumPlaneType } from "./Camera";
import { VisibleSet } from "./VisibleSet";
import { Spatial } from "./Spatial";
import { Point } from "../geom/Point";
import { Plane } from "../geom/Plane";
import { Vector } from "../geom/Vector";
import { Bound } from "../geom/Bound";

export class Culler
{
    public static MAX_PLANE_QUANTITY: number = 32

    protected _camera: Camera
    protected _frustum: number[] = []
    protected _planeQuantity: number
    protected _plane: Plane[] = []
    protected _planeState: number

    protected _visibleSet: VisibleSet

    public constructor(camera: Camera)
    {
        this._visibleSet = new VisibleSet()
        
        let i: number
        for(i = 0; i < Culler.MAX_PLANE_QUANTITY; ++i)
        {
            this._plane.push(Plane.new())
        }
        this._planeQuantity = 6
        this._camera = camera
    }

    public set camera(camera: Camera)
    {
        this._camera = camera
    }

    public get camera(): Camera
    {
        return this._camera
    }

    public set frustum(frustum: number[])
    {
        if (!this._camera)
        {
            console.assert(false, "SetFrustum requires the existence of a camera");
            return;
        }

        // Copy the frustum values.
        this._frustum[FrustumPlaneType.DMIN] = frustum[FrustumPlaneType.DMIN];
        this._frustum[FrustumPlaneType.DMAX] = frustum[FrustumPlaneType.DMAX];
        this._frustum[FrustumPlaneType.UMIN] = frustum[FrustumPlaneType.UMIN];
        this._frustum[FrustumPlaneType.UMAX] = frustum[FrustumPlaneType.UMAX];
        this._frustum[FrustumPlaneType.RMIN] = frustum[FrustumPlaneType.RMIN];
        this._frustum[FrustumPlaneType.RMAX] = frustum[FrustumPlaneType.RMAX];

        let dMin2: number = this._frustum[FrustumPlaneType.DMIN]*this._frustum[FrustumPlaneType.DMIN];
        let uMin2: number = this._frustum[FrustumPlaneType.UMIN]*this._frustum[FrustumPlaneType.UMIN];
        let uMax2: number = this._frustum[FrustumPlaneType.UMAX]*this._frustum[FrustumPlaneType.UMAX];
        let rMin2: number = this._frustum[FrustumPlaneType.RMIN]*this._frustum[FrustumPlaneType.RMIN];
        let rMax2: number = this._frustum[FrustumPlaneType.RMAX]*this._frustum[FrustumPlaneType.RMAX];

        // Get the camera coordinate frame.
        let position: Point = this._camera.position
        let dVector: Vector = this._camera.dVector
        let uVector: Vector = this._camera.uVector
        let rVector: Vector = this._camera.rVector
        let dirDotEye: number = position.dot(dVector);

        // Update the near plane.
        this._plane[FrustumPlaneType.DMIN].normal = dVector
        this._plane[FrustumPlaneType.DMIN].constant = 
            dirDotEye + this._frustum[FrustumPlaneType.DMIN]

        // Update the far plane.
        this._plane[FrustumPlaneType.DMAX].normal = dVector.negate()
        this._plane[FrustumPlaneType.DMAX].constant = -(dirDotEye + this._frustum[FrustumPlaneType.DMAX])

        // Update the bottom plane
        let invLength: number = 1 / Math.sqrt(dMin2 + uMin2);
        let c0: number = -this._frustum[FrustumPlaneType.UMIN]*invLength;  // D component
        let c1: number = +this._frustum[FrustumPlaneType.DMIN]*invLength;  // U component
        let normal: Vector = dVector.scale(c0).add(uVector.scale(c1))
        let constant: number = position.dot(normal)
        this._plane[FrustumPlaneType.UMIN].normal = normal
        this._plane[FrustumPlaneType.UMIN].constant = constant

        // Update the top plane.
        invLength = 1 / Math.sqrt(dMin2 + uMax2)
        c0 = +this._frustum[FrustumPlaneType.UMAX]*invLength  // D component
        c1 = -this._frustum[FrustumPlaneType.DMIN]*invLength  // U component
        normal = dVector.scale(c0).add(uVector.scale(c1))
        constant = position.dot(normal)
        this._plane[FrustumPlaneType.UMAX].normal =normal
        this._plane[FrustumPlaneType.UMAX].constant = constant

        // Update the left plane.
        invLength = 1 / Math.sqrt(dMin2 + rMin2)
        c0 = -this._frustum[FrustumPlaneType.RMIN]*invLength  // D component
        c1 = +this._frustum[FrustumPlaneType.DMIN]*invLength  // R component
        normal = dVector.scale(c0).add(rVector.scale(c1))
        constant = position.dot(normal);
        this._plane[FrustumPlaneType.RMIN].normal = normal
        this._plane[FrustumPlaneType.RMIN].constant = constant

        // Update the right plane.
        invLength = 1 / Math.sqrt(dMin2 + rMax2);
        c0 = +this._frustum[FrustumPlaneType.RMAX]*invLength;  // D component
        c1 = -this._frustum[FrustumPlaneType.DMIN]*invLength;  // R component
        normal = dVector.scale(c0).add(rVector.scale(c1))
        constant = position.dot(normal);
        this._plane[FrustumPlaneType.RMAX].normal = normal
        this._plane[FrustumPlaneType.RMAX].constant = constant

        // All planes are active initially.
        this._planeState = 0xFFFFFFFF;
    }

    public get frustum(): number[]
    {
        return this._frustum
    }

    public get visibleSet(): VisibleSet
    {
        return this._visibleSet
    }

    public insert(visible: Spatial): void
    {
        // virtual
    }

    public get planeQuantity(): number
    {
        return this._planeQuantity
    }

    public get planes(): Plane[]
    {
        return this._plane
    }

    public set planeState(planeState: number)
    {
        this._planeState = planeState
    }

    public get planeState(): number
    {
        return this._planeState
    }

    public pushPlane(plane: Plane): void
    {
        if(this._planeQuantity < Culler.MAX_PLANE_QUANTITY)
        {
            this._plane[this._planeQuantity] = plane
            ++this._planeQuantity
        }
    }

    public popPlane(): void
    {
        if(this._planeQuantity > FrustumPlaneType.QUANTITY)
        {
            --this._planeQuantity
        }
    }

    public isVisible(bound: Bound): boolean
    {
        if (bound.radius == 0)
        {
            return false;
        }
    
        // Start with the last pushed plane, which is potentially the most
        // restrictive plane.
        let index: number = this._planeQuantity - 1;
        let mask: number = (1 << index); //uint
    
        for (let i: number = 0; i < this._planeQuantity; ++i, --index, mask >>= 1)
        {
            if (this._planeState & mask)
            {
                let side: number = bound.whichSide(this._plane[index]); // int
    
                if (side < 0)
                {
                    // The object is on the negative side of the plane, so
                    // cull it.
                    return false;
                }
    
                if (side > 0)
                {
                    // The object is on the positive side of plane.  There is
                    // no need to compare subobjects against this plane, so
                    // mark it as inactive.
                    this._planeState &= ~mask;
                }
            }
        }
    
        return true;
    }

    public isVisiblePortal(numVertices: number, vertices: Point[], ignoreNearPlane: boolean): boolean
    {
        let index:number = this._planeQuantity - 1;
        for (let i: number = 0; i < this._planeQuantity; ++i, --index)
        {
            let plane: Plane = this._plane[index];
            if (ignoreNearPlane && index == FrustumPlaneType.DMIN)
            {
                continue;
            }

            let j: number = 0
            for (j = 0; j < numVertices; ++j)
            {
                let side: number = plane.whichSide(vertices[j]);
                if (side >= 0)
                {
                    // The polygon is not totally outside this plane.
                    break;
                }
            }

            if (j == numVertices)
            {
                // The polygon is totally outside this plane.
                return false;
            }
        }

        return true;
    }

    public whichSide(plane: Plane): number
    {
        let NdEmC: number = plane.distanceTo(this._camera.position)

        let normal: Vector = plane.normal
        let NdD: number = normal.dot(this._camera.dVector);
        let NdU: number = normal.dot(this._camera.uVector);
        let NdR: number = normal.dot(this._camera.rVector);
        let FdN: number = this._frustum[FrustumPlaneType.DMAX]/this._frustum[FrustumPlaneType.DMIN];

        let positive: number = 0
        let negative: number = 0
        let sgnDist: number

        // Check near-plane vertices.
        let PDMin: number = this._frustum[FrustumPlaneType.DMIN]*NdD;
        let NUMin: number = this._frustum[FrustumPlaneType.UMIN]*NdU;
        let NUMax: number = this._frustum[FrustumPlaneType.UMAX]*NdU;
        let NRMin: number = this._frustum[FrustumPlaneType.RMIN]*NdR;
        let NRMax: number = this._frustum[FrustumPlaneType.RMAX]*NdR;

        // V = E + dmin*D + umin*U + rmin*R
        // N*(V-C) = N*(E-C) + dmin*(N*D) + umin*(N*U) + rmin*(N*R)
        sgnDist = NdEmC + PDMin + NUMin + NRMin;
        if (sgnDist > 0)
        {
            positive++;
        }
        else if (sgnDist < 0)
        {
            negative++;
        }

        // V = E + dmin*D + umin*U + rmax*R
        // N*(V-C) = N*(E-C) + dmin*(N*D) + umin*(N*U) + rmax*(N*R)
        sgnDist = NdEmC + PDMin + NUMin + NRMax;
        if (sgnDist > 0)
        {
            positive++;
        }
        else if (sgnDist < 0)
        {
            negative++;
        }

        // V = E + dmin*D + umax*U + rmin*R
        // N*(V-C) = N*(E-C) + dmin*(N*D) + umax*(N*U) + rmin*(N*R)
        sgnDist = NdEmC + PDMin + NUMax + NRMin;
        if (sgnDist > 0)
        {
            positive++;
        }
        else if (sgnDist < 0)
        {
            negative++;
        }

        // V = E + dmin*D + umax*U + rmax*R
        // N*(V-C) = N*(E-C) + dmin*(N*D) + umax*(N*U) + rmax*(N*R)
        sgnDist = NdEmC + PDMin + NUMax + NRMax;
        if (sgnDist > 0)
        {
            positive++;
        }
        else if (sgnDist < 0)
        {
            negative++;
        }

        // check far-plane vertices (s = dmax/dmin)
        let PDMax: number = this._frustum[FrustumPlaneType.DMAX]*NdD;
        let FUMin: number = FdN*NUMin;
        let FUMax: number = FdN*NUMax;
        let FRMin: number = FdN*NRMin;
        let FRMax: number = FdN*NRMax;

        // V = E + dmax*D + umin*U + rmin*R
        // N*(V-C) = N*(E-C) + dmax*(N*D) + s*umin*(N*U) + s*rmin*(N*R)
        sgnDist = NdEmC + PDMax + FUMin + FRMin;
        if (sgnDist > 0)
        {
            positive++;
        }
        else if (sgnDist < 0)
        {
            negative++;
        }

        // V = E + dmax*D + umin*U + rmax*R
        // N*(V-C) = N*(E-C) + dmax*(N*D) + s*umin*(N*U) + s*rmax*(N*R)
        sgnDist = NdEmC + PDMax + FUMin + FRMax;
        if (sgnDist > 0)
        {
            positive++;
        }
        else if (sgnDist < 0)
        {
            negative++;
        }

        // V = E + dmax*D + umax*U + rmin*R
        // N*(V-C) = N*(E-C) + dmax*(N*D) + s*umax*(N*U) + s*rmin*(N*R)
        sgnDist = NdEmC + PDMax + FUMax + FRMin;
        if (sgnDist > 0)
        {
            positive++;
        }
        else if (sgnDist < 0)
        {
            negative++;
        }

        // V = E + dmax*D + umax*U + rmax*R
        // N*(V-C) = N*(E-C) + dmax*(N*D) + s*umax*(N*U) + s*rmax*(N*R)
        sgnDist = NdEmC + PDMax + FUMax + FRMax;
        if (sgnDist > 0)
        {
            positive++;
        }
        else if (sgnDist < 0)
        {
            negative++;
        }

        if (positive > 0)
        {
            if (negative > 0)
            {
                // Frustum straddles the plane.
                return 0;
            }

            // Frustum is fully on the positive side.
            return +1;
        }

        // Frustum is fully on the negative side.
        return -1;
    }

    public computeVisibleSet(scene: Spatial): void
    {
        if (this._camera && scene)
        {
            this.frustum = this._camera.frustum
            this._visibleSet.clear();
            scene.onGetVisibleSet(this, false);
        }
        else
        {
            console.assert(false, "A camera and a scene are required for culling");
        }
    }
}