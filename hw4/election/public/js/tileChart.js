/** Class implementing the tileChart. */
class TileChart {

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    constructor(){

        let divTiles = d3.select("#tiles").classed("content", true);
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        //Gets access to the div element created for this chart and legend element from HTML
        let svgBounds = divTiles.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth/2;
        let legendHeight = 150;
        //add the svg to the div
        let legend = d3.select("#legend").classed("content",true);

        //creates svg elements within the div
        this.legendSvg = legend.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",legendHeight)
            .attr("transform", "translate(" + this.margin.left + ",0)")
        this.svg = divTiles.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight)
            .attr("transform", "translate(" + this.margin.left + ",0)")
    };



    /**
     * Creates tiles and tool tip for each state, legend for encoding the color scale information.
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */
    update (electionResult, colorScale){
        /**
         * Returns the class that needs to be assigned to an element.
         *
         * @param party an ID for the party that is being referred to.
         */
        function chooseClass (party) {
            if (party == "R"){
                return "republican";
            }
            else if (party== "D"){
                return "democrat";
            }
            else if (party == "I"){
                return "independent";
            }
        }

        /**
         * Renders the HTML content for tool tip.
         *
         * @param tooltip_data information that needs to be populated in the tool tip
         * @return text HTML content for tool tip
         */
        function tooltip_render(tooltip_data) {
            let text = "<h2 class ="  + chooseClass(tooltip_data.winner) + " >" + tooltip_data.state + "</h2>";
            text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
            text += "<ul>"
            tooltip_data.result.forEach((row)=>{
                //text += "<li>" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
                text += "<li class = " + chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
            });
            text += "</ul>";

            return text;
        }
        //Calculates the maximum number of columns to be laid out on the svg
        this.maxColumns = d3.max(electionResult,function(d){
            return parseInt(d["Space"]);
        });

        //Calculates the maximum number of rows to be laid out on the svg
        this.maxRows = d3.max(electionResult,function(d){
            return parseInt(d["Row"]);
        });

        //Creates a legend element and assigns a scale that needs to be visualized
        this.legendSvg.append("g")
            .attr("class", "legendQuantile")
            .attr("transform", "translate(0,50)");

        var w = this.svgWidth*0.8 / 10;
        let legendQuantile = d3.legendColor()
            .shapeWidth(w)
            .cells(10)
            .orient('horizontal')
            .scale(colorScale);

        this.legendSvg.select(".legendQuantile")
            .style("font-size","10px")
            .call(legendQuantile);

        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('se')
            .offset(function() {
                return [0,0];
            })
            .html((d)=>{
                var tooltip_data = {
                    "state": d.State,
                    "winner": d.State_Winner,
                    "electoralVotes" : d.Total_EV,
                    "result":[
                        {"nominee": d.D_Nominee_prop,"votecount": d.D_Votes,"percentage": d.D_Percentage,"party":"D"} ,
                        {"nominee": d.R_Nominee_prop,"votecount": d.R_Votes,"percentage": d.R_Percentage,"party":"R"} ,
                        {"nominee": d.I_Nominee_prop,"votecount": d.I_Votes,"percentage": d.I_Percentage,"party":"I"}
                    ]
                }
                return tooltip_render(tooltip_data);
            });

        // ******* TODO: PART IV *******

        var svg = d3.select('#tiles').select('svg');
        svg.call(tip);

        var tileWidth = this.svgWidth / (this.maxColumns+1);
        var tileHeight = this.svgHeight / (this.maxRows+1);

        var tiles = svg.selectAll('rect')
            .data(electionResult);
        tiles.exit().remove();
        var tiles = tiles.enter()
            .append('rect')
            .merge(tiles)
            .attr('fill', function (d) {
                return d['State_Winner'] != 'I' ? colorScale(d.RD_Difference) : '#45AD6A';
            })
            .attr('class', 'tile')
            .attr('y', d => d["Row"] * tileHeight)
            .attr('x', d => d["Space"] * tileWidth)
            .attr('width', tileWidth)
            .attr('height', tileHeight)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        var state_text = svg.selectAll('.state')
            .data(electionResult);
        state_text.exit().remove();
        var state_text = state_text.enter()
            .append('text')
            .merge(state_text)
            .attr('class', 'state tilestext')
            .attr("dy", d => d["Row"] * tileHeight + tileHeight*0.4)
            .attr("dx", d => d["Space"] * tileWidth + tileWidth/2)
            .text(d => d.Abbreviation)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        var ev_text = svg.selectAll('.ev')
            .data(electionResult);
        ev_text.exit().remove();
        var ev_text = ev_text.enter()
            .append('text')
            .merge(ev_text)
            .attr('class', 'ev tilestext')
            .attr("dy", d => d["Row"] * tileHeight + tileHeight*0.8)
            .attr("dx", d => d["Space"] * tileWidth + tileWidth/2)
            .text(d => d.Total_EV)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
    };


}