module.exports = {
    seed: "twitter-graph",

    twitter_account: "greaby_",
    twitter_id: 151869891,

    folders: {
        dist: "dist",
    },

    graph: {
        node_min_size: 3,
        node_max_size: 15,
    },

    expire: 2592000000, // in milliseconds

    colors: ["#0887A3", "#F29F05", "#A61F38", "#8F8EBF", "#94A66D"],
    edge_colors: ["#bfe8f2", "#f7ebd4", "#f7dee3", "#d3d3e8", "#e2e8d5"],
};
