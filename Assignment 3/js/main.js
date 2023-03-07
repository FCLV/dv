/**
 * Load data from CSV file asynchronously and render force directed graph
 */
d3.json('data/miserables.json').then(data => {
        const forceDirectedGraph = new ForceDirectedGraph(data, {
            nodeId: d => d.id,
            nodeGroup: d => d.group,
            // nodeTitle: d => `${d.id}\n${d.group}`,
            nodeTitle: null,
            linkStrokeWidth: l => Math.sqrt(l.value),
            width: 1000,
            height: 1000,
            // invalidation // a promise to stop the simulation when the cell is re-run
        });
        console.log('2')
    })
    .catch(error => console.error(error));