const nodes = [
    {
        id: 'https://en.wikipedia.org/wiki/Hypergraph',
        label: 'Hypergraph',
    },
    {
        id: 'https://en.wikipedia.org/wiki/Mathematics',
        label: 'Mathematics',
    }
];

const links = [
    {
        source: 'https://en.wikipedia.org/wiki/Hypergraph',
        target: 'https://en.wikipedia.org/wiki/Mathematics',
        type: 'licensing',
    }
]

const types = ["licensing", "suit", "resolved"]
  
const height = 600;
const width = 1200;
const color = d3.scaleOrdinal(types, d3.schemeCategory10)

function linkArc(d) {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
        M${d.source.x},${d.source.y}
        A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    `;
}

const drag = simulation => {
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

const d_links = links.map(d => Object.create(d));
const d_nodes = nodes.map(d => Object.create(d));

const simulation = d3.forceSimulation(d_nodes)
.force("link", d3.forceLink(d_links).id(d => d.id))
.force("charge", d3.forceManyBody().strength(-400))
.force("x", d3.forceX())
.force("y", d3.forceY());

const svg = d3.create("svg")
.attr("viewBox", [-width / 2, -height / 2, width, height])
.style("font", "12px sans-serif");

// Per-type markers, as they don't inherit styles.
svg.append("defs").selectAll("marker")
.data(types)
.join("marker")
.attr("id", d => `arrow-${d}`)
.attr("viewBox", "0 -5 10 10")
.attr("refX", 15)
.attr("refY", -0.5)
.attr("markerWidth", 6)
.attr("markerHeight", 6)
.attr("orient", "auto")
.append("path")
.attr("fill", color)
.attr("d", "M0,-5L10,0L0,5");

const link = svg.append("g")
.attr("fill", "none")
.attr("stroke-width", 1.5)
.selectAll("path")
.data(d_links)
.join("path")
.attr("stroke", d => color(d.type))
.attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);

const node = svg.append("g")
.attr("fill", "currentColor")
.attr("stroke-linecap", "round")
.attr("stroke-linejoin", "round")
.selectAll("g")
.data(d_nodes)
.join("g")
.call(drag(simulation));

node.append("circle")
.attr("stroke", "white")
.attr("stroke-width", 1.5)
.attr("r", 4);

node.append("text")
    .attr("x", 8)
    .attr("y", "0.31em")
    .attr("dx", 5)
    .attr("dy", 5)
    .append("a")
    .attr("xlink:href", d => d.id) // Set the URL based on the 'url' property
    .text(d => d.label);


simulation.on("tick", () => {
link.attr("d", linkArc);
node.attr("transform", d => `translate(${d.x},${d.y})`);
});

// invalidation.then(() => simulation.stop());

document.body.appendChild(svg.node());
