
class YearChart {

    /**
     * Constructor for the Year Chart
     *
     * @param electoralVoteChart instance of ElectoralVoteChart
     * @param tileChart instance of TileChart
     * @param votePercentageChart instance of Vote Percentage Chart
     * @param electionInfo instance of ElectionInfo
     * @param electionWinners data corresponding to the winning parties over mutiple election years
     */
    constructor (electoralVoteChart, tileChart, votePercentageChart, electionWinners) {

        //Creating YearChart instance
        this.electoralVoteChart = electoralVoteChart;
        this.tileChart = tileChart;
        this.votePercentageChart = votePercentageChart;
        // the data
        this.electionWinners = electionWinners;

        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let divyearChart = d3.select("#year-chart").classed("fullView", true);

        //fetch the svg bounds
        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width*1 - this.margin.left - this.margin.right;
        this.svgHeight = 100;

        //add the svg to the div
        this.svg = divyearChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
    };


    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */


    /**
     * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
     */
    update () {
        function chooseClass (data) {
            if (data == "R") {
                return "yearChart republican";
            }
            else if (data == "D") {
                return "yearChart democrat";
            }
            else if (data == "I") {
                return "yearChart independent";
            }
        }
        //Domain definition for global color scale
        let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

        //Color range for global color scale
        let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

        //ColorScale be used consistently by all the charts
        this.colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);
        var ColorScale = this.colorScale;
        // ******* TODO: PART I *******

        var data = this.electionWinners;
        var svg = d3.select('#year-chart')
            .select('svg');

        var xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.YEAR), d3.max(data, d => d.YEAR)])
            .range([30,this.svgWidth - 30]);

        svg.append('line')
            .attr("x1", 0)
            .attr("y1", this.svgHeight/2)
            .attr("x2", this.svgWidth )
            .attr("y2", this.svgHeight/2)
            .style("stroke-dasharray", ("2, 2"))
            .attr('stroke', 'black');

        var yearAxis = svg.selectAll('.yearChart')
            .data(data)
            .enter()
            .append("g")
            .attr("class", "yearChart");

        yearAxis.append("circle")
            .attr("r", '10')
            .attr('class', function (d) {
                return chooseClass(d['PARTY']);
            })
            .attr("transform", function(d, i) {
                return "translate("+ xScale(d.YEAR) + ",50)";
            });

        yearAxis.append("text")
            .attr("dy", "90")
            .attr("dx", d => xScale(d.YEAR))
            .attr('class', 'yeartext')
            .text(function(d) { return d.YEAR; });

        var s = this;
        yearAxis.on('click', function (d) {
            yearAxis.selectAll('circle')
                .classed('selected', false)
                .classed('highlighted', false);
            d3.select(this)
                .select('circle')
                .classed('selected', true)
                .classed('highlighted', true);

            d3.csv("data/Year_Timeline_" + d.YEAR + ".csv", function (error, electionResult) {
                s.electoralVoteChart.update(electionResult, ColorScale);
                s.tileChart.update(electionResult, ColorScale);
                s.votePercentageChart.update(electionResult);
            });
        });

        //******* TODO: EXTRA CREDIT *******

        //Implement brush on the year chart created above.
        //Implement a call back method to handle the brush end event.
        //Call the update method of shiftChart and pass the data corresponding to brush selection.
        //HINT: Use the .brush class to style the brush.

    };

};