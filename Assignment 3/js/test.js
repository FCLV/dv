function ForceDirectedGraph({
    nodes, // an iterable of node objects (typically [{id}, …])
    links // an iterable of link objects (typically [{source, target}, …])
}, {
    nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
    nodeGroup, // given d in nodes, returns an (ordinal) value for color
    nodeGroups, // an array of ordinal values representing the node groups
    nodeTitle, // given d in nodes, a title string
    nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
    nodeStroke = "#fff", // node stroke color
    nodeStrokeWidth = 1.5, // node stroke width, in pixels
    nodeStrokeOpacity = 1, // node stroke opacity
    nodeRadius = 5, // node radius, in pixels
    nodeStrength,
    linkSource = ({ source }) => source, // given d in links, returns a node identifier string
    linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
    linkStroke = "#999", // link stroke color
    linkStrokeOpacity = 0.6, // link stroke opacity
    linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
    linkStrokeLinecap = "round", // link stroke linecap
    linkStrength,
    colors = d3.schemeTableau10, // an array of color strings, for the node groups
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    invalidation // when this promise resolves, stop the simulation
} = {}) {
    // Compute values.
    const N = d3.map(nodes, nodeId).map(intern);
    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);
    if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
    const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
    const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
    const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(nodes, (_, i) => ({ id: N[i] }));
    links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));
    // create a dict to store points of links
    dict = {}
    for (i in links) {
        let p1, p2
        if (links[i].source < links[i].target) {
            p1 = links[i].source
            p2 = links[i].target
        } else {
            p2 = links[i].source
            p1 = links[i].target
        }
        dict[p1 + ',' + p2] = 1
    }

    // Compute default domains.
    if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

    // Construct the scales.
    const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

    // Construct the forces.
    const forceNode = d3.forceManyBody();
    const forceLink = d3.forceLink(links).id(({ index: i }) => N[i]);
    if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
    if (linkStrength !== undefined) forceLink.strength(linkStrength);

    const simulation = d3.forceSimulation(nodes)
        .force("link", forceLink)
        .force("charge", forceNode)
        .force("center", d3.forceCenter())
        .on("tick", ticked);

    const wrapper = d3.select("#force-directed-graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const bounds = wrapper.append('g')
        // .attr("viewBox", [-width / 2, -height / 2, width, height])
        // .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const link = bounds.append("g")
        .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
        .attr("stroke-linecap", linkStrokeLinecap)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr('class', 'lk');

    const node = bounds.append("g")
        .attr("fill", nodeFill)
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("class", "dot")
        .attr("r", nodeRadius)
        .call(drag(simulation));

    bounds.append("g")
        .selectAll('text')
        .data(nodes)
        .join('text')
        .style('font-weight', 500)
        .style('font-family', 'Arial')
        .style('fill', 'black')
        .attr('class', 'tt')
        .text(d => d.id)
        .style('opacity', 0)

    d3.selectAll('.dot')
        .on('mousemove', function(e, datum) {
            d3.selectAll('.dot')
                .style('opacity', function(d) { return isConnected(d) })
            d3.selectAll('.tt')
                .style('opacity', function(d) { return isConnected(d) == 1 ? 1 : 0 })
                .attr('x', d => d.x)
                .attr('y', d => d.y)
            d3.selectAll('.lk')
                .style('opacity', function(d) { return isLinked(d) })

            // whether the d and datum are connected
            function isConnected(d) {
                let p1, p2
                if (d.id < datum.id) {
                    p1 = d.id
                    p2 = datum.id
                } else {
                    p1 = datum.id
                    p2 = d.id
                }

                if (p1 == p2) {
                    return 1
                } else if (dict[p1 + ',' + p2] == 1) {
                    return 1
                } else {
                    return 0.2
                }
            }

            // whether d is the link whose source/target is datum
            function isLinked(d) {
                if (d.source.id == datum.id || d.target.id == datum.id) {
                    return 1
                } else {
                    return 0.2
                }
            }

        })
        .on('mouseleave', function() {
            d3.selectAll('.tt').style('opacity', 0)
            d3.selectAll('.dot').style('opacity', 1)
            d3.selectAll('.lk').style('opacity', 1)
        })


    if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
    if (L) link.attr("stroke", ({ index: i }) => L[i]);
    if (G) node.attr("fill", ({ index: i }) => color(G[i]));
    if (T) node.append("title").text(({ index: i }) => T[i]);
    if (invalidation != null) invalidation.then(() => simulation.stop());

    function intern(value) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
    }

    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
            // tooltip.style("opacity", 0)

        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    // return Object.assign(bounds.node(), { scales: { color } });
}