from collections import namedtuple


inf = float('inf')
Edge = namedtuple('Edge', 'start, end, cost')


class Graph():
    def __init__(self, edges):
        self.edges = edges2 = [Edge(*edge) for edge in edges]
        self.vertices = set(sum(([e.start, e.end] for e in edges2), []))

    def dijkstra(self, source, dest):
        summ = 0
        assert source in self.vertices
        dist = {vertex: inf for vertex in self.vertices}
        previous = {vertex: None for vertex in self.vertices}
        dist[source] = 0
        q = self.vertices.copy()
        neighbours = {vertex: set() for vertex in self.vertices}
        for start, end, cost in self.edges:
            neighbours[start].add((end, cost))

        while q:
            u = min(q, key=lambda vertex: dist[vertex])
            q.remove(u)
            if dist[u] == inf or u == dest:
                break
            for v, cost in neighbours[u]:
                alt = dist[u] + cost
                if alt < dist[v]:
                    dist[v] = alt
                    previous[v] = u
        s, u = [], dest

        while previous[u]:
            s.insert(0, u)
            u = previous[u]
        s.insert(0, u)
        summ = dist[s[-1]]
        if len(s) < 2:
            raise AssertionError
        return {'path': s, 'cost': summ}


if __name__ == '__main__':
    edges = []
    with open('in.txt') as f:
        file = f.readlines()
    count = file[0].split()[0]
    start = str(file[-2].split()[0])
    goal = str(file[-1].split()[0])
    i = 1
    for NEXT in file[1:-2]:
        _data = NEXT.split()[:-1]
        _edges = _data[::2]
        _costs = _data[1::2]
        for j in xrange(len(_edges)):
            edges.append((str(i), str(_edges[j]), int(_costs[j])))
        i = i + 1
    graph = Graph(edges)
    out = open('out.txt', 'w')
    try:
        result = graph.dijkstra(start, goal)
        out.write('Y\n')
        out.write(" ".join(result['path']) + '\n')
        out.write(str(result['cost'])+'\n')
    except AssertionError:
        out.write("N\n")
    except KeyError:
        out.write("N\n")
    finally:
        out.close()
