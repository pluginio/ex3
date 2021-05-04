import {Point} from '../../src/geom/Point'

describe('Point', (): void => {
    it("should have an x value of 0'", (): void => {
        let point: Point = Point.new()
        expect(point.x).toEqual(0)
    })
})
