/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {
        let svg = d3.select("#barChart");

        console.log(svg);
        console.log(fifaDataset.championshipDataset);

        let margin = { top: 20, right: 20, bottom: 30, left: 40},
            width = +svg.attr("width") - margin.left - margin.right, // redundant thing
            heigth = +svg.attr("height") - margin.top - margin.bottom;

        let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
            y = d3.scaleLinear().rangeRound([heigth, 0]);

        let group = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        x.domain(fifaDataset.championshipDataset.map(d => d["YEAR"]));
        y.domain([0, d3.max(fifaDataset.championshipDataset, d => d["AVERAGE_ATTENDANCE"])]);

        group.selectAll(".bar")
            .data(fifaDataset.championshipDataset)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d["YEAR"]))
            .attr("y", d => y(d["AVERAGE_ATTENDANCE"]))
            .attr("width", x.bandwidth())
            .attr("height", d => heigth - y(d["AVERAGE_ATTENDANCE"]));


        // ******* TODO: PART I *******


        // Create the x and y scales; make
        // sure to leave room for the axes

        // Create colorScale

        // Create the axes (hint: use #xAxis and #yAxis)

        // Create the bars (hint: use #bars)




        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData() {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.
        this.updateBarChart();
    }
}