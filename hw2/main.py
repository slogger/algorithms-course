class Graph(object):
    """docstring for Graph"""
    def __init__(self, count, edges):
        self.nodes = list(range(count))
        self.edges = edges
        self.visited = set()
        self.connectivity_components = []

    def get_neighbors(self, node):
        return self.edges[node]

    def get_valid_nodes(self, nodes):
        return [node for node in nodes if node not in self.visited]

    def search(self, nodes, components=set()):
        self.visited = self.visited.union(nodes)
        components = components.union(nodes)
        neighbors = []
        for node in nodes:
            neighbors.extend(self.get_valid_nodes(self.get_neighbors(node)))
        if len(neighbors) != 0:
            components = components.union(neighbors)
            self.search(neighbors, components)
        else:
            self.connectivity_components.append(components)
            _next = [node for node in self.nodes if node not in self.visited]
            if _next != []:
                self.search([_next[0]])


def readfile(path):
    file = open(path)
    count = file.readline().split()[0]
    edges = []
    for edge in file.readlines():
        str_nodes = edge.split()[:-1]
        edges.append([int(node)-1 for node in str_nodes])
    file.close()
    return {
        'edges': edges,
        'count': int(count),
    }


def main():
    input_data = readfile('in.txt')
    graph = Graph(input_data['count'], input_data['edges'])
    graph.search([0])
    components = graph.connectivity_components
    output = open('out.txt', 'w')
    output.write('{}\n'.format(len(components)))
    for component in components[:-1]:
        output.write(" ".join([str(node + 1) for node in component]) + ' 0\n')
    for component in components[-1:]:
        output.write(" ".join([str(node + 1) for node in component]) + '\n')
    output.close()
if __name__ == '__main__':
    main()
