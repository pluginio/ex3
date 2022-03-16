import {Matrix} from '../../src/geom/Matrix'
import { Point } from '../../src/geom/Point'

describe('Matrix', (): void => {
    it('should be an identity matrix', (): void => {
        let matrix: Matrix = Matrix.new()
        expect(matrix.toArray()).toEqual(
            [1, 0, 0, 0,
             0, 1, 0, 0,
             0, 0, 1, 0,
             0, 0, 0, 1]
        )
    })
})

describe('Matrix addition', (): void => {
    it('should add 2 identity matrices', (): void => {
        let m1: Matrix = Matrix.new()
        let m2: Matrix = Matrix.new()
        
        let result = m1.add(m2)
        expect(result.toArray()).toEqual(
            [2, 0, 0, 0,
             0, 2, 0, 0,
             0, 0, 2, 0,
             0, 0, 0, 2]
        )
    })
})

describe('Matrix complex addition', (): void => {
    it('should add 2 complex matrices', (): void => {
        let m1: Matrix = Matrix.new(
            -2,  2,  15,  7,   
             9,  7,  14, -2,
            16, -3,   8, 12,
            -5,  5, 1.2,  9)
        let m2: Matrix = Matrix.new(
             1,  2,  3,  4,
             5,  6,  7,  8,
             9, 10, 11, 12,
            13, 14, 15, 16
        )
        
        let result = m1.add(m2)
        expect(result.toArray()).toEqual(
            [ -1,  4, 18,     11,
              14, 13, 21,      6,
              25,  7, 19,     24, 
              8,  19, 81 / 5, 25]
        )
    })
})

describe('Matrix multiplication', (): void => {
    it('should multiply 2 identity matrices', (): void => {
        let m1: Matrix = Matrix.new()
        let m2: Matrix = Matrix.new()

        let result = m1.multiply(m2)
        expect(result.toArray()).toEqual(
            [1, 0, 0, 0,
             0, 1, 0, 0,
             0, 0, 1, 0,
             0, 0, 0, 1]
        )
    })
})

describe('Matrix complex multiplication', (): void => {
    it('should multiply 2 complex matrices', (): void => {
        let m1: Matrix = Matrix.new(
            0, 1, 2, 3,
            4, 5, 6, 7,
            8, 9, 8, 7,
            6, 5, 4, 3
        )
        let m2: Matrix = Matrix.new(
            9,   8,  7,  6,
            5,  -4, -3, -2,
            -1, -2, -3, -4,
            -5, -6, -7, -8
        )

        let result = m1.multiply(m2)
        expect(result.toArray()).toEqual([
            -12, -26, -30, -34,
             20, -42, -54, -66,
             74, -30, -44, -58,
             60,   2,  -6, -14
        ])
    })
})

describe('Identity matrix multiplication against a Point', (): void => {
    it('should return the Point unchanged', (): void => {
        let m1: Matrix = Matrix.new()
        let p1: Point = Point.new( 1, 2, 3, 0)

        let result = m1.multiplyPoint(p1)
        expect(result.toArray()).toEqual([
            1, 2, 3, 0
        ])
    })
})
