/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     *
     * @property svg : area for svg zone
     * @property x : scale for X-axis
     * @property y: scale for Y-axis
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;

        this.svg = d3.select("#barChart");
    }

    chartConfiguration(svgArea, xScaleParam, yScaleParam) {
        let margin = {
            top: 10,
            bottom: 30,
            right: 5,
            left: 50
        };

        let width = +svgArea.attr("width") - margin.left - margin.right,
            height = +svgArea.attr("height") - margin.bottom - margin.top;

        this.x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
        this.y = d3.scaleLinear().rangeRound([height, 0]);

        this.x.domain(fifaDataset.championshipDataset.map(d => d[xScaleParam]));
        this.y.domain([0, d3.max(fifaDataset.championshipDataset, d => d[yScaleParam])]);

        this.svgGroup = this.svg.append("g")
            .attr("transform", "translate(" + margin.left + "," +  margin.top +  ")");
    }

    drawBarChart(svgGroup, xScale, yScale) {
        return svgGroup
            .selectAll(".bar")
            .data(fifaDataset.championshipDataset)
            .enter()
            .append("rect")
                .attr("class", "bar")
                .attr("x", d => this.x(d[xScale]))
                .attr("y", d => this.y(d[yScale]))
                .attr("width", this.x.bandwidth())
                .attr("height", d => (this.svg.attr('height') - 30) - this.y(d[yScale])); // TODO: need to replace this hardcode
    }

    drawAxes(svgGroup) {
        svgGroup.append("g")
            .attr("class", "axisX")
            .attr("transform", "translate(0," + (this.svg.attr('height') - 30) + ")")
            .call(d3.axisBottom(this.x));

        svgGroup.append("g")
            .attr("class", "axisY")
            .attr("transform", "translate(0," + 10 + ")")
            .call(d3.axisLeft(this.y))
                .append("text")
                .attr("transform", "rotate(-90)")
                // .attr("y", 0)
                // .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("Frequency");
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {
        // console.log(fifaDataset.championshipDataset);

        this.chartConfiguration(this.svg, 'YEAR', 'AVERAGE_ATTENDANCE');
        this.drawAxes(this.svgGroup);
        this.drawBarChart(this.svgGroup, 'YEAR', 'AVERAGE_ATTENDANCE');


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