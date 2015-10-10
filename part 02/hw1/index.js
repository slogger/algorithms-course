'use strict';
var fs = require('fs');
var Kruskal = require("./kruskal");

var metric = function(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

var getPoints = function(data) {
    var count = data[0];
    var points = [];
    var getInt = function(a) {
        return parseInt(a);
    }
    for (var i = 1; i < data.length - 1; i++) {
        points.push(data[i].split(' ').map(getInt));
    }
    return points;
}

var getFullGraph = function(count) {
    var edges = [];
    for (var i = 0; i < count; i++) {
        for (var j = 0; j < count; j++) {
            if (i !== j) {
                edges.push([i, j]);
            }
        }
    }
    return edges;
}

var output = function(mst, points) {
    var sum = 0;
    var s = {};
    var out = '';
    for (var ind in mst) {
        var u = mst[ind][0];
        var v = mst[ind][1];
        var w = metric(points[u], points[v], true);
        try {
            s[u].push(v + 1);
        } catch (e) {
            s[u] = [v + 1]
        }
        try {
            s[v].push(u + 1);
        } catch (e) {
            s[v] = [u + 1]
        }
        sum += w;
    }

    for (var i = 0; i < points.length; i++) {
        var a = s[i] || [];
        a.push(0);
        out += a.join(" ") + "\n";
        console.log(a.join(" "));
    }
    console.log(sum);
    out += sum
    fs.writeFile('out.txt', out, 'utf-8');
}

var main = function(err, data) {
    if (err) {
        console.error('Incorrect data');
    }
    data = data.split('\n');
    var count = data[0];
    var points = getPoints(data);
    var fullGraph = getFullGraph(count);
    var mst = Kruskal.kruskal(points, fullGraph, metric);
    output(mst, points)
};

fs.readFile('in.txt', 'utf-8', main);
