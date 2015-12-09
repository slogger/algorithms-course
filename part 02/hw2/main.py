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



if __name__ == '__main__':
    g = FlowNetwork()
    with open('in.txt') as f:
        file = f.readlines()
    k, l = file[0].split()
    xpart = ['x{}'.format(i) for i in range(1, int(k)+1)]
    ypart = ['y{}'.format(i) for i in range(1, int(l)+1)]
    [g.add_vertex(v) for v in xpart+ypart+['s', 't']]
    [g.add_edge('s', x, 1) for x in xpart]
    [g.add_edge(y, 't', 1) for y in ypart]
    [g.add_edge('x%s' % i, 'y%s' % j, 1) for i in range(len(file))[1:] for j in file[i].split()]

    # g.max_flow('s','t')

    matching = g.get_matching('s','t')
    i = 0
    out = []
    for i in range(int(k)):
        if len([edge for edge in matching if 'x{}'.format(i+1) == edge.source]) > 0:
            edge = [edge for edge in matching if 'x{}'.format(i+1) == edge.source][0]
            out.append(edge.sink[1:])
        else:
            out.append('0')

    print(' '.join(out))
    file = open('out.txt', 'w')
    file.write(' '.join(out))
