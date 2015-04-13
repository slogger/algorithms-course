#!/usr/bin/python3
class Labirynt(object):
    def __init__(self, h, w, start, finish, raw_lab):
        self.height = int(h)
        self.weight = int(w)
        self.start = start
        self.finish = finish
        self.raw = raw_lab
        self.labirynt = []
        self.build_labirynt()

    def build_labirynt(self):
        for line in self.raw:
            row = line.split()
            for y in range(len(row)):
                if row[y] in '1':
                    row[y] = '#'
                else:
                    row[y] = 0
            self.labirynt.append(row)

    def get_value(self, coord):
        return self.labirynt[coord[0] % self.weight][coord[1]]

    def set_value(self, coord, val):
        self.labirynt[coord[0] % self.weight][coord[1]] = val

    def get_neighbors_coord(self, coord):
        (x, y) = coord
        return [(x, y-1),
                (x, y+1),
                (x-1, y),
                (x+1, y)]

    def is_wall(self, coord):
        value = str(self.get_value(coord))
        return value in '#'

    def is_visited(self, coord):
        value = self.get_value(coord)
        return value is not 0

    def valid_to_search(self, coord):
        return not self.is_visited(coord) and not self.is_wall(coord)

    def valid_to_go(self, coord, i):
        value = self.get_value(coord)
        if value == '#':
            return False
        elif value == i-1:
            return True
        else:
            return False

    def computing(self, i=0, neighbors=[]):
        stack = []
        for neighbor in neighbors:
            val = self.get_value(neighbor)
            if self.valid_to_search(neighbor):
                self.set_value(neighbor, i+1)
                stack.extend(self.get_neighbors_coord(neighbor))
        f = False
        for cell in stack:
            if self.valid_to_search(cell):
                f = True
        if f:
            self.computing(i+1, stack)

    def one_step(self, coord):
        value = self.get_value(coord)
        neighbors = self.get_neighbors_coord(coord)
        valid_neighbors = [x for x
                           in neighbors if self.valid_to_go(x, value)]
        try:
            return valid_neighbors[0]
        except IndexError:
            return False

    def find_path(self, coord):
        path = [coord]
        value = self.get_value(coord)
        if value == '#':
            return []
        nxt = coord
        while value - 1:
            nxt = self.one_step(nxt)
            if not nxt:
                path = []
                break
            value = self.get_value(nxt)
            path.append(nxt)
        return path

    def __str__(self):
        out = ''
        for line in self.labirynt:
            out += ''.join([str(x) for x in line]) + '\n'
        return out


def read_input():
    tmp = []
    file = open('in.txt', 'r')
    for line in file:
        tmp.append(line)
    file.close()

    H = "".join(tmp[0].split())
    W = "".join(tmp[1].split())
    _tmp = tmp[-2].split()
    start = (int(_tmp[0])-1, int(_tmp[1])-1)
    _tmp = tmp[-1].split()
    finish = (int(_tmp[0])-1, int(_tmp[1])-1)
    tmp = tmp[2:-2]
    return Labirynt(H, W, start, finish, tmp)


def main():
    lab = read_input()
    # print(lab)
    need_search = (lab.get_value(lab.finish) != '#') and (
        lab.get_value(lab.start) != '#')
    file = open('out.txt', 'w')
    path = []
    if need_search:
        lab.set_value(lab.finish, 1)
        lab.computing(1, lab.get_neighbors_coord(lab.finish))
        path = lab.find_path(lab.start)
        # print(lab)
    if len(path) > 0:
        file.write('Y\n')
        for step in path:
            y = step[1]+1
            x = step[0]+1 if step[0]+1 > 0 else lab.weight + step[0]+1
            file.write('{} {}\n'.format(x, y))
    else:
        file.write('N\n')
    file.close()


if __name__ == '__main__':
    main()
