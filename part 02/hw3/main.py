def _reduction(matrix):
    for i in range(len(matrix)):
        minElem = min(matrix[i])
        matrix[i] = [x - minElem for x in matrix[i]]
    return matrix

def transpose(matrix):
    return [list(i) for i in zip(*matrix)]

def reduction(matrix):
    # reduction on row
    matrix = _reduction(matrix)
    transposematrix = transpose(matrix)
    for col in transposematrix:
        if min(col) is not 0:
            # reduction on columns
            transposematrix = _reduction(transpose(matrix))
            break;
    matrix = transpose(transposematrix)
    print(matrix)



if __name__ == '__main__':
    M = [[1,7,1,3], [1,6,4,6], [17,1,5,1], [1,6,10,4]]
    reduction(M)
