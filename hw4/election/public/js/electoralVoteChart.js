
class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param shiftChart an instance of the ShiftChart class
     */
    constructor (shiftChart){
        this.shiftChart = shiftChart;

        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

        //Gets access to the div element created for this chart from HTML
        this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;

        //creates svg element within the div
        this.svg = divelectoralVotes.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight)

        this.treshold = false;
    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */



    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

    update (electionResult, colorScale){
        function chooseClass (party) {
            if (party == "R"){
                return "republican";
            }
            else if (party == "D"){
                return "democrat";
            }
            else if (party == "I"){
                return "independent";
            }
        }

        // ******* TODO: PART II *******
        var Gdata = d3.nest()
            .key(function(d) { return d['State_Winner']; })
            .rollup(function(v) {
                return v.map(function (state) {
                        return {
                            'State' : state['State'],
                            'State_Winner': state['State_Winner'],
                            'Total_EV': state['Total_EV'],
                            'RD_Difference': state['RD_Difference']
                        }
                    }
                ).sort(function (a, b) { return a['RD_Difference'] - b['RD_Difference']; })
            })
            .entries(electionResult);

        var data = [];
        Gdata.forEach(function (states) {
            if(states.key == 'I'){
                data = states.value.concat(data);
            }
            else{
                data = data.concat(states.value);
            }
        });


        var svg = d3.select("#electoral-vote").select('svg');

        var sum = d3.sum(data, d => d['Total_EV']);
        var width = this.svgWidth - 20;

        var bias = 0;
        var bars = svg.selectAll('rect')
            .data(data);
        bars.exit().remove();

        bars = bars.enter()
            .append('rect')
            .merge(bars)
            .attr('y', 50)
            .attr('x', function (d) {
                var cur = bias;
                bias += d.Total_EV * width / sum;
                return cur;
            })
            .attr('height', 30)
            .attr('width', d => d.Total_EV * width / sum)
            .attr('class', 'electoralVotes')
            .attr('fill', function (d) {
                return d['State_Winner'] != 'I' ? colorScale(d.RD_Difference) : '#45AD6A';
            });



        var ev = Gdata.map(function (p) {
            return {
                'party': p.key,
                'ev_count': d3.sum(p.value, s => s['Total_EV'])
            }
        })

        var counts = svg.selectAll('text')
            .data(ev);
        counts.exit().remove();
        counts = counts.enter()
            .append('text')
            .merge(counts)
            .attr("dy", "40")
            .attr("dx", function (d, i) {
                if(d.party == 'I') return 0;
                if(i == ev.length - 1){
                    return width;
                }
                else{
                    if (ev[i+1].party != 'I')
                        return 0;
                    else
                        return ev[i+1].ev_count * width / sum;
                }
            })
            .attr('class', function (d) {
                return 'electoralVoteText ' + chooseClass(d.party);
            })
            .text(function(d) { return d.ev_count; });

        if(!this.treshold){

            svg.append('line')
                .attr("x1", width/2)
                .attr("x2", width/2)
                .attr("y1", 40)
                .attr("y2", 90)
                .attr('stroke', 'black');

            this.treshold = true;
        }

        var half = Math.ceil(sum / 2) + 1
        svg.append('text')
            .attr("dy", "35")
            .attr("dx", width/2)
            .attr('class', 'electoralVotesNote')
            .text('Electoral Vote ('+half+' needed to win)');

        //******* TODO: PART V *******
        var shiftChart = this.shiftChart;
        function brushed() {
            var s = d3.event.selection;
            var selectedData = []
            if (s != null) {
                selectedData = bars.filter(function (d) {
                    var x = d3.select(this).attr('x');
                    var y = d3.select(this).attr('y');
                    return x >= s[0] && x <= s[1];
                })._groups[0]
                    .map(d => d.__data__);
            }
            shiftChart.update(selectedData);
        }
        var brush = d3.brushX().extent([[0,40],[this.svgWidth, 90]]).on("end", brushed);
        svg.append("g").attr("class", "brush").call(brush);

    };


}