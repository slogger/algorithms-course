'use strict';
var fs = require('fs');

class BiPartGraph {
    constructor(edges) {
        this.edges = edges;
        this.maxThroughput = 0;
    }

    findMatching() {
        let superSource = new Point(0, -1);
        let superSink = new Point(0, 2);
        let throughput = this.maxThroughput;
        let edges = this.edges;
        edges.forEach(edge => {
            let superSourceEdge = new Edge(superSource, edge.start);
            let superSinkEdge = new Edge(edge.end, superSink);
            edge.throughput = throughput;
            superSourceEdge.throughput = throughput;
            superSinkEdge.throughput = throughput;
            edges.push(superSourceEdge, superSinkEdge);
        })
        // edges.filter(e => e.end.graph === 0).forEach(edge => {
        //     console.log(edge.start === superSource);
        // })
        console.log(edges);
        // return mathing;
    }

    findPath(config) {
        path = [];
        this.edges.filter(e => {e.start === config.start}).
        return path;
    }
}

class Edge {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}

class Point {
    constructor(index, graphNum) {
        this.index = index;
        this.graph = graphNum
    }
}


var output = function(matching) {
    var out = '';
    fs.writeFile('out.txt', out, 'utf-8', (err) => {
        if(err) {
            console.error('Fail on write to file');
        }
    });
};

var main = function(err, data) {
    if(err) {
        console.error('Incorrect data');
        throw err;
    }
    console.log(data);
    data = data.split('\n');
    var graphs = [];
    var edges = [];
    data[0].split(' ').forEach((pointsLength, graphIndex) => {
        for(let i = 1; i < parseInt(pointsLength) + 1; i++) {
            // console.log(i, pointsLength);
            if(!graphs[graphIndex]) {
                graphs[graphIndex] = []
            }
            graphs[graphIndex].push(new Point(i, parseInt(graphIndex)));
        }
    });
    for(let i = 1; i < data.length - 1; i++) {
        data[i].split(" ").forEach((j) => {
            edges.push(new Edge(graphs[0][i - 1], graphs[1][parseInt(j) - 1]));
        })
    }
    var biPartGraph = new BiPartGraph(edges);
    biPartGraph.findMatching()
};

fs.readFile('in.txt', 'utf-8', main);
