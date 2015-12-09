class Edge(object):
    def __init__(self, u, v, w, dir):
        self.source = u
        self.sink = v
        self.capacity = w
        self.dir = dir
    def __repr__(self):
        return '{}->{}:{}'.format(self.source, self.sink, self.capacity)

class FlowNetwork(object):
    def __init__(self):
        self.network = {}
        self.flow = {}
        self.find_max_flow = False

    def get_flow_edge(self, edge, source=True):
        if source:
            for fedge in self.flow[edge.source]:
                if edge.sink == fedge.sink:
                    return fedge
        else:
            for fedge in self.flow[edge.sink]:
                if edge.source == fedge.source:
                    return fedge

    def add_vertex(self, vertex):
        self.network[vertex] = []
        self.flow[vertex] = []

    def get_edges(self, v):
        return self.network[v]

    def add_edge(self, u, v, w):
        if u == v:
            raise ValueError('u == v')
        edge = Edge(u,v,w, 'direct')
        redge = Edge(v,u,0, 'reverse')
        fedge = Edge(u,v,0, 'direct')
        fredge = Edge(v,u,0, 'reverse')
        edge.redge = redge
        redge.redge = edge
        self.network[u].append(edge)
        self.network[v].append(redge)
        self.flow[u].append(fedge)
        self.flow[v].append(fredge)

    def find_path(self, source, sink, path):
        if source == sink:
            return path
        for edge in self.get_edges(source):
            fedge = self.get_flow_edge(edge)
            residual = edge.capacity - fedge.capacity
            if residual > 0 and edge not in path:
                result = self.find_path( edge.sink, sink, path + [edge])
                if result != None:
                    return result

    def max_flow(self, source, sink):
        path = self.find_path(source, sink, [])
        while path != None:
            residuals = [edge.capacity - self.get_flow_edge(edge).capacity for edge in path]
            flow = min(residuals)
            for edge in path:
                self.get_flow_edge(edge).capacity += flow
                self.get_flow_edge(edge.redge, True).capacity -= flow
            path = self.find_path(source, sink, [])
        self.find_max_flow = True;
        return self.flow

    def get_matching(self, source, sink):
        if not self.find_max_flow:
            self.max_flow(source, sink)
        flow_edges = [item for sublist in list(self.flow.values()) for item in sublist]
        return sorted([edge for edge in flow_edges if (edge.source != source and edge.sink != sink and edge.dir == 'direct' and edge.capacity > 0)], key=lambda edge: int(edge.source[1:]))

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
    return matrix



if __name__ == '__main__':
    M = [[1,7,1,3], [1,6,4,6], [17,1,5,1], [1,6,10,4]]
    M = reduction(M)
    print(M)
