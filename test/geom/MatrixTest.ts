import {Matrix} from '../../src/geom/Matrix'
import { Point } from '../../src/geom/Point'

describe('Matrix Zero', (): void => {
    it('should be an zero matrix', (): void => {
        let matrix: Matrix = Matrix.ZERO
        expect(matrix.toArray()).toEqual([
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ])
    })
})

describe('Matrix Identity', (): void => {
    it('should be an identity matrix', (): void => {
        let matrix: Matrix = Matrix.IDENTITY
        expect(matrix.toArray()).toEqual([
            1, 0, 0, 0,
             0, 1, 0, 0,
             0, 0, 1, 0,
             0, 0, 0, 1
        ])
    })
})

describe('Matrix constructor', (): void => {
    it('should be a constructed matrix', (): void => {
        let matrix: Matrix = new Matrix(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 8, 7, 6,
            5, 4, 3, 2
        )
        expect(matrix.toArray()).toEqual([
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 8, 7, 6,
            5, 4, 3, 2
        ])
    })
})

describe('Matrix fromBool with true', (): void => {
    it('should be an identity matrix', (): void => {
        let matrix: Matrix = Matrix.fromBool(true)
        expect(matrix.toArray()).toEqual(
            [1, 0, 0, 0,
             0, 1, 0, 0,
             0, 0, 1, 0,
             0, 0, 0, 1]
        )
    })
})

describe('Matrix fromBool with false', (): void => {
    it('should be an identity matrix', (): void => {
        let matrix: Matrix = Matrix.fromBool(false)
        expect(matrix.toArray()).toEqual(
            [0, 0, 0, 0,
             0, 0, 0, 0,
             0, 0, 0, 0,
             0, 0, 0, 0]
        )
    })
})

describe('Matrix fromTuple with row major', (): void => {
    it('should match the provided tuple', (): void => {

        let tuple = [
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 8, 7, 6,
            5, 4, 3, 2
        ]

        let matrix: Matrix = Matrix.fromTuple(tuple, true)
        expect(matrix.toArray()).toEqual([
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 8, 7, 6,
            5, 4, 3, 2
        ])
    })
})

describe('Matrix fromTuple with column major', (): void => {
    it('should match the provided tuple in column major', (): void => {

        let tuple = [
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 8, 7, 6,
            5, 4, 3, 2
        ]

        let matrix: Matrix = Matrix.fromTuple(tuple, false)
        expect(matrix.toArray()).toEqual([
            1, 5, 9, 5,
            2, 6, 8, 4,
            3, 7, 7, 3,
            4, 8, 6, 2
        ])
    })
})

// TODO: Matrix fromFrame
// TODO: Matrix fromAxisAngle

describe('Matrix fromFloats', (): void => {
    it('should create a scale matrix with x, y, z corresponding to the floats provided', (): void => {

        let matrix: Matrix = Matrix.fromFloats(
           1.0, 2.4, 5.8
        )
        expect(matrix.toArray()).toEqual([
            1, 0, 0, 0,
            0, 2.4, 0, 0,
            0, 0, 5.8, 0,
            0, 0, 0, 1
        ])
    })
})

// TODO: Matrix fromAxisAngle

describe('Matrix SET', (): void => {
    it('should set the values of a Matrix', (): void => {

        let matrix: Matrix = Matrix.IDENTITY

        matrix.set(
            9, 1, 2, 6,
            6, 9, 1, 0,
            4, 5, 2, 8,
            9, 2, 7, 5
        )

        expect(matrix.toArray()).toEqual([
            9, 1, 2, 6,
            6, 9, 1, 0,
            4, 5, 2, 8,
            9, 2, 7, 5
        ])
    })
})

describe('Matrix getAtIndex', (): void => {
    it('should get a Matrix entry at a given index', (): void => {

        let matrix = Matrix.TEST
    
        expect(matrix.getAtIndex(0)).toEqual(0)
        expect(matrix.getAtIndex(1)).toEqual(1)
        expect(matrix.getAtIndex(2)).toEqual(2)
        expect(matrix.getAtIndex(3)).toEqual(3)

        expect(matrix.getAtIndex(4)).toEqual(4)
        expect(matrix.getAtIndex(5)).toEqual(5)
        expect(matrix.getAtIndex(6)).toEqual(6)
        expect(matrix.getAtIndex(7)).toEqual(7)

        expect(matrix.getAtIndex(8)).toEqual(8)
        expect(matrix.getAtIndex(9)).toEqual(9)
        expect(matrix.getAtIndex(10)).toEqual(10)
        expect(matrix.getAtIndex(11)).toEqual(11)

        expect(matrix.getAtIndex(12)).toEqual(12)
        expect(matrix.getAtIndex(13)).toEqual(13)
        expect(matrix.getAtIndex(14)).toEqual(14)
        expect(matrix.getAtIndex(15)).toEqual(15)
    })
})

describe('Matrix getAt', (): void => {
    it('should get a Matrix entry via row and column', (): void => {

        let matrix = Matrix.TEST
    
        expect(matrix.getAt(0, 0)).toEqual(0)
        expect(matrix.getAt(0, 1)).toEqual(1)
        expect(matrix.getAt(0, 2)).toEqual(2)
        expect(matrix.getAt(0, 3)).toEqual(3)

        expect(matrix.getAt(1, 0)).toEqual(4)
        expect(matrix.getAt(1, 1)).toEqual(5)
        expect(matrix.getAt(1, 2)).toEqual(6)
        expect(matrix.getAt(1, 3)).toEqual(7)

        expect(matrix.getAt(2, 0)).toEqual(8)
        expect(matrix.getAt(2, 1)).toEqual(9)
        expect(matrix.getAt(2, 2)).toEqual(10)
        expect(matrix.getAt(2, 3)).toEqual(11)

        expect(matrix.getAt(3, 0)).toEqual(12)
        expect(matrix.getAt(3, 1)).toEqual(13)
        expect(matrix.getAt(3, 2)).toEqual(14)
        expect(matrix.getAt(3, 3)).toEqual(15)
    })
})

describe('Matrix setAt', (): void => {
    it('should get a Matrix entry via row and column', (): void => {

        let matrix = Matrix.IDENTITY
        matrix.setAt(0, 0, 0)
        matrix.setAt(0, 1, 1)
        matrix.setAt(0, 2, 2)
        matrix.setAt(0, 3, 3)

        matrix.setAt(1, 0, 4)
        matrix.setAt(1, 1, 5)
        matrix.setAt(1, 2, 6)
        matrix.setAt(1, 3, 7)

        matrix.setAt(2, 0, 8)
        matrix.setAt(2, 1, 9)
        matrix.setAt(2, 2, 10)
        matrix.setAt(2, 3, 11)

        matrix.setAt(3, 0, 12)
        matrix.setAt(3, 1, 13)
        matrix.setAt(3, 2, 14)
        matrix.setAt(3, 3, 15)
    
        expect(matrix.toArray()).toEqual([
            0, 1, 2, 3,
            4, 5, 6, 7,
            8, 9, 10, 11,
            12, 13, 14, 15
        ])
    })
})

describe('Matrix setRow', (): void => {
    it('should set a Matrix row', (): void => {

        let matrix = Matrix.ZERO
        matrix.setRow(0, [0, 1, 2, 3])
        matrix.setRow(1, [4, 5, 6, 7])
        matrix.setRow(2, [8, 9, 10, 11])
        matrix.setRow(3, [12, 13, 14, 15])
    
        expect(matrix.toArray()).toEqual([
            0, 1, 2, 3,
            4, 5, 6, 7,
            8, 9, 10, 11,
            12, 13, 14, 15
        ])
    })
})

describe('Matrix getRow', (): void => {
    it('should get a Matrix row', (): void => {

        let matrix = Matrix.TEST
    
        expect(matrix.getRow(0)).toEqual([0, 1, 2, 3])
        expect(matrix.getRow(1)).toEqual([4, 5, 6, 7])
        expect(matrix.getRow(2)).toEqual([8, 9, 10, 11])
        expect(matrix.getRow(3)).toEqual([12, 13, 14, 15])
    })
})

describe('Matrix setColumn', (): void => {
    it('should set a Matrix column', (): void => {

        let matrix = Matrix.ZERO
        matrix.setColumn(0, [0, 1, 2, 3])
        matrix.setColumn(1, [4, 5, 6, 7])
        matrix.setColumn(2, [8, 9, 10, 11])
        matrix.setColumn(3, [12, 13, 14, 15])
    
        expect(matrix.toArray()).toEqual([
            0, 4, 8, 12,
            1, 5, 9, 13,
            2, 6, 10, 14,
            3, 7, 11, 15
        ])
    })
})

describe('Matrix getColumn', (): void => {
    it('should get a Matrix column', (): void => {

        let matrix = Matrix.TEST
    
        expect(matrix.getColumn(0)).toEqual([0, 4, 8, 12])
        expect(matrix.getColumn(1)).toEqual([1, 5, 9, 13])
        expect(matrix.getColumn(2)).toEqual([2, 6, 10, 14])
        expect(matrix.getColumn(3)).toEqual([3, 7, 11, 15])
    })
})

describe('Matrix new', (): void => {
    it('should be a new identity matrix', (): void => {
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
