import {Plane} from '../../src/geom/Plane'

describe('Plane', (): void => {
    let p: Plane = Plane.new()

    it('should have a normal x value of 0', (): void => {
        expect(p.normal.x).toEqual(0)
    })

    it('should have a normal y value of 0', (): void => {
        expect(p.normal.y).toEqual(0)
    })

    it('should have a normal z value of 0', (): void => {
        expect(p.normal.z).toEqual(0)
    })

    it('should have an z value of -0', (): void => {
        expect(p.constant).toEqual(-0)
    })
})
