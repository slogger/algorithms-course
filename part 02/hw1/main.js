'use strict';
var fs = require('fs');

/**
 * @class
 * @name Point
 * @desc abstraction for point object
 */
class Point {
    /**
     * @arg x {Number}
     * @arg y {Number}
     * @arg index {Number}
     */
    constructor(x, y, index) {
        this.x = x;
        this.y = y;
        this.index = index;
    }
}

/**
 * @class
 * @name Edge
 * @desc abstaction for Edge object
 */
class Edge {
    /**
     * @arg m {Point} - start point
     * @arg n {Point} - end point
     */
    constructor(m, n) {
        this.start = m;
        this.end = n;
        this.weight = Math.abs(m.x - n.x) + Math.abs(m.y - n.y);
    }
}

/**
 * @class
 * @name Graph
 * @desc abstraction for Graph object
 */
class Graph {
    /**
     * @arg edges {Array}
     */
    constructor(edges) {
        this.edges = edges;
    }
}

/**
 * @class
 * @name FullGraph
 * @desc abstraction for FullGraph object
 */
class FullGraph extends Graph {
    /**
     * @arg points {Array}
     */
    constructor(points) {
        super([]);
        points.forEach((point, i) => {
            let otherPoints = points.filter((_point) => _point !== point);
            otherPoints.forEach((otherPoint) => this.edges.push(new Edge(point, otherPoint)));
        });
    }
}
/**
 * @class
 * @name SpanningTree
 * @desc abstraction for SpanningTree object
 */
class SpanningTree {
    constructor() {
        this.tree = [];
        this.includedPoints = new Set();
        this.weight = 0;
    }
    /**
     * @method
     * @name append
     * @arg edge {Edge}
     * @return {Boolean} - true if edge add to tree
     */
    append(edge) {
        if(!this.includedPoints.has(edge.start) || !this.includedPoints.has(edge.end)) {
            this.tree.push(edge);
            this.includedPoints.add(edge.start);
            this.includedPoints.add(edge.end);
            this.weight += edge.weight;
            return true;
        } else {
            return false;
        }
    }
    /**
     * @method
     * @name conjugateOf
     * @arg point {Point}
     * @return conjugatePoints {Array}
     */
    conjugateOf(point) {
        var conjugatePoints = [];
        this.tree.forEach((edge, index) => {
            if(edge.end === point) {
                conjugatePoints.push(edge.start);
            } else if(edge.start === point) {
                conjugatePoints.push(edge.end);
            }
        });
        return conjugatePoints;
    }
}

/**
 * @function
 * @name kruskal
 * @desc find minimal spanning tree
 * @arg edges {Array}
 * @arg spanningTree {SpanningTree}
 * @return {Promise}
 */
var kruskal = function(edges, spanningTree) {
    var promise = new Promise(
        function(resolve, reject) {
            if(edges.length === 0) {
                resolve(spanningTree);
            }
            spanningTree.append(edges.shift());
            kruskal(edges, spanningTree).then(spanningTree => resolve(spanningTree));
        }
    );
    return promise;
};

var getPoints = function(data) {
    data = data.split('\n');
    var count = data[0];
    var points = [];
    for(let i = 1; i <= count; i++) {
        var coords = data[i].split(' ');
        points.push(new Point(coords[0], coords[1], i));
    }
    return points;
};

var output = function(spanningTree) {
    var points = [];
    var out = '';
    for(let point of spanningTree.includedPoints) {
        points.push(point);
    }
    points = points.sort((a, b) => a.index - b.index);
    for(let point of points) {
        let conjugatePoints = spanningTree.conjugateOf(point).sort((a, b) => a.index - b.index);
        let _out = [point.index];
        conjugatePoints.forEach((elem, i) => _out.push(elem.index));
        _out.push(0);
        out += _out.join(' ');
        out += '\n';
    }
    out += spanningTree.weight;
    fs.writeFile('out.txt', out, 'utf-8', (err) => {
        if (err) {
            console.error('Fail on write to file');
        }
    });
};

var main = function(err, data) {
    if(err) {
        console.error('Incorrect data');
    }
    var graph = new FullGraph(getPoints(data));
    kruskal(graph.edges.sort((a, b) => a.weight - b.weight), new SpanningTree())
        .then(mst => output(mst));
};

fs.readFile('in.txt', 'utf-8', main);
