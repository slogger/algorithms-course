'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var fs = require('fs');

/**
 * @class
 * @name Point
 * @desc abstraction for point object
 */

var Point =
/**
 * @arg x {Number}
 * @arg y {Number}
 * @arg index {Number}
 */
function Point(x, y, index) {
    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
    this.index = index;
}

/**
 * @class
 * @name Edge
 * @desc abstaction for Edge object
 */
;

var Edge =
/**
 * @arg m {Point} - start point
 * @arg n {Point} - end point
 */
function Edge(m, n) {
    _classCallCheck(this, Edge);

    this.start = m;
    this.end = n;
    this.weight = Math.abs(m.x - n.x) + Math.abs(m.y - n.y);
}

/**
 * @class
 * @name Graph
 * @desc abstraction for Graph object
 */
;

var Graph =
/**
 * @arg edges {Array}
 */
function Graph(edges) {
    _classCallCheck(this, Graph);

    this.edges = edges;
}

/**
 * @class
 * @name FullGraph
 * @desc abstraction for FullGraph object
 */
;

var FullGraph = (function (_Graph) {
    _inherits(FullGraph, _Graph);

    /**
     * @arg points {Array}
     */

    function FullGraph(points) {
        var _this = this;

        _classCallCheck(this, FullGraph);

        _get(Object.getPrototypeOf(FullGraph.prototype), 'constructor', this).call(this, []);
        points.forEach(function (point, i) {
            var otherPoints = points.filter(function (_point) {
                return _point !== point;
            });
            otherPoints.forEach(function (otherPoint) {
                return _this.edges.push(new Edge(point, otherPoint));
            });
        });
    }

    /**
     * @class
     * @name SpanningTree
     * @desc abstraction for SpanningTree object
     */
    return FullGraph;
})(Graph);

var SpanningTree = (function () {
    function SpanningTree() {
        _classCallCheck(this, SpanningTree);

        this.tree = [];
        this.includedPoints = new Set();
        this.weight = 0;
    }

    /**
     * @function
     * @name kruskal
     * @desc find minimal spanning tree
     * @arg edges {Array}
     * @arg spanningTree {SpanningTree}
     * @return {Promise}
     */

    /**
     * @method
     * @name append
     * @arg edge {Edge}
     * @return {Boolean} - true if edge add to tree
     */

    _createClass(SpanningTree, [{
        key: 'append',
        value: function append(edge) {
            if (!this.includedPoints.has(edge.start) || !this.includedPoints.has(edge.end)) {
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
    }, {
        key: 'conjugateOf',
        value: function conjugateOf(point) {
            var conjugatePoints = [];
            this.tree.forEach(function (edge, index) {
                if (edge.end === point) {
                    conjugatePoints.push(edge.start);
                } else if (edge.start === point) {
                    conjugatePoints.push(edge.end);
                }
            });
            return conjugatePoints;
        }
    }]);

    return SpanningTree;
})();

var kruskal = function kruskal(edges, spanningTree) {
    var promise = new Promise(function (resolve, reject) {
        if (edges.length === 0) {
            resolve(spanningTree);
        }
        spanningTree.append(edges.shift());
        kruskal(edges, spanningTree).then(function (spanningTree) {
            return resolve(spanningTree);
        });
    });
    return promise;
};

var getPoints = function getPoints(data) {
    data = data.split('\n');
    var count = data[0];
    var points = [];
    for (var i = 1; i <= count; i++) {
        var coords = data[i].split(' ');
        points.push(new Point(coords[0], coords[1], i));
    }
    return points;
};

var output = function output(spanningTree) {
    var points = [];
    var out = '';
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = spanningTree.includedPoints[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var point = _step.value;

            points.push(point);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    points = points.sort(function (a, b) {
        return a.index - b.index;
    });
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        var _loop = function () {
            var point = _step2.value;

            var conjugatePoints = spanningTree.conjugateOf(point).sort(function (a, b) {
                return a.index - b.index;
            });
            var _out = [point.index];
            conjugatePoints.forEach(function (elem, i) {
                return _out.push(elem.index);
            });
            _out.push(0);
            out += _out.join(' ');
            out += '\n';
        };

        for (var _iterator2 = points[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            _loop();
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                _iterator2['return']();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    out += spanningTree.weight;
    fs.writeFile('out.txt', out, 'utf-8', function (err) {
        if (err) {
            console.error('Fail on write to file');
        }
    });
};

var main = function main(err, data) {
    if (err) {
        console.error('Incorrect data');
    }
    var graph = new FullGraph(getPoints(data));
    kruskal(graph.edges.sort(function (a, b) {
        return a.weight - b.weight;
    }), new SpanningTree()).then(function (mst) {
        return output(mst);
    });
};

fs.readFile('in.txt', 'utf-8', main);
