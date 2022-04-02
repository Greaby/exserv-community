const Graph = require("graphology");
const gexf = require("graphology-gexf");
const forceAtlas2 = require("graphology-layout-forceatlas2");

const fs = require("fs");

const { range } = require("./interpolation");

const incremental_id = () => {
    let key_map = {};

    let i = 0;

    return (key) => {
        if (key_map[key] === undefined) {
            key_map[key] = i++;
        }
        return key_map[key];
    };
};

const key_generator = incremental_id();

console.log("read gexf");
const gexf_document = fs.readFileSync("data/exserv.gexf").toString();

console.log("load graph");
let graph = gexf.parse(Graph, gexf_document);

// console.log("force atlas");
// forceAtlas2.assign(graph, {
//     iterations: 200,
//     settings: {
//         gravity: 0.8,
//     },
// });

console.log("graph optimisation");
let graph_minify = new Graph();

graph.forEachNode((node, attributes) => {
    if (attributes.indegree < 2) {
        graph.dropNode(node);
    }
});

const sizes = graph
    .mapNodes((_node, attributes) => {
        return attributes.size;
    })
    .filter((x) => x);

const min_size = Math.min(...sizes);
const max_size = Math.max(...sizes);

graph.forEachNode((node, attributes) => {
    graph_minify.addNode(key_generator(node), {
        label: attributes.label,
        size: Math.round(range(min_size, max_size, 1, 8, attributes.size)),
        x: Math.round(attributes.x),
        y: Math.round(attributes.y),
        c: attributes.modularity_class,
    });
});

graph.forEachEdge(
    (
        edge,
        _attributes,
        source,
        target,
        _sourceAttributes,
        _targetAttributes
    ) => {
        graph_minify.addEdgeWithKey(
            key_generator(edge),
            key_generator(source),
            key_generator(target)
        );
    }
);

console.log("save as json");
const graph_data = JSON.stringify(graph_minify.export());
fs.writeFile(`dist/index.min.json`, graph_data, function (err) {
    if (err) return console.log(err);
});
