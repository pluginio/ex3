import {Vector} from '../../src/geom/Vector'

describe('Vector', (): void => {
    let v: Vector = new Vector()

    it('should have an x value of 0', (): void => {
        expect(v.x).toEqual(0)
    })

    it('should have an y value of 0', (): void => {
        expect(v.y).toEqual(0)
    })

    it('should have an z value of 0', (): void => {
        expect(v.z).toEqual(0)
    })

    it('should have an w value of 0', (): void => {
        expect(v.w).toEqual(0)
    })
})
