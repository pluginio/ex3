import {Quaternion} from '../../src/geom/Quaternion'

describe('Quaternion', (): void => {
    let q: Quaternion =  Quaternion.new()

    it('should have an w value of 1', (): void => {
        expect(q.w).toEqual(1)
    })

    it('should have an x value of 0', (): void => {
        expect(q.x).toEqual(0)
    })

    it('should have an y value of 0', (): void => {
        expect(q.y).toEqual(0)
    })

    it('should have an z value of 0', (): void => {
        expect(q.z).toEqual(0)
    })
})
