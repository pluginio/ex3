import {Matrix} from '../../src/geom/Matrix'

describe('Matrix', (): void => {
    it("should be an identity matrix'", (): void => {
        let matrix: Matrix = Matrix.new()
        expect(matrix.getAtIndex(0 )).toEqual(1)
        expect(matrix.getAtIndex(1 )).toEqual(0)
        expect(matrix.getAtIndex(2 )).toEqual(0)
        expect(matrix.getAtIndex(3 )).toEqual(0)

        expect(matrix.getAtIndex(4 )).toEqual(0)
        expect(matrix.getAtIndex(5 )).toEqual(1)
        expect(matrix.getAtIndex(6 )).toEqual(0)
        expect(matrix.getAtIndex(7 )).toEqual(0)

        expect(matrix.getAtIndex(8 )).toEqual(0)
        expect(matrix.getAtIndex(9 )).toEqual(0)
        expect(matrix.getAtIndex(10)).toEqual(1)
        expect(matrix.getAtIndex(11)).toEqual(0)

        expect(matrix.getAtIndex(12)).toEqual(0)
        expect(matrix.getAtIndex(13)).toEqual(0)
        expect(matrix.getAtIndex(14)).toEqual(0)
        expect(matrix.getAtIndex(15)).toEqual(1)
    })
})