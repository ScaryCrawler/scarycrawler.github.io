let drawer = {

};

let dataFiller = {
    addTableHeaders : function(tableHead, tableBody, desireColumns) {
        tableHead.append('tr').selectAll('th')
            .data(desireColumns)
            .enter()
            .append('th')
            .attr('class', 'tableHeaders')
            .text(d => d)
            .on('click', function(header) {
                tableBody.selectAll('tr')
                    .sort( (a, b) => sorting(a, b, header) ),

                sortingOrder[header] = !sortingOrder[header],

                colorizeTableInZebraStyle(tableBody),

                d3.select(this)
                    .style('cursor', () => changeCursorState(sortingOrder[header]))
            })
            .on('mouseover', function (header) {
                d3.select(this)
                    .style('cursor', () => changeCursorState(sortingOrder[header]))
            });
    },

    drawTableRows : function(tableBody, columns, desireColumns, data){
        let rows = tableBody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");

        rows.selectAll("td")
            .data(row => columns.map( (column, i) => row[desireColumns[i]]) )
            .enter()
            .append("td")
            .text(d => d)
            .attr('class', 'customCell')
            .on('mouseover', function () {                // remember this shit, dear reader...
                d3.select(this.parentNode)                // in this place we couldn't use some lambdas. Why?
                    .style("background-color", "#F3ED86") // because keyword 'this' in lambdas determined by where lambda
            })                                            // was defined. DEFINED - NOT USED, KARL!
            .on('mouseout', function () {
                tableBody.selectAll('tr')
                    .style("background-color", null);
                colorizeTableInZebraStyle(tableBody);
            });

        colorizeTableInZebraStyle(tableBody);
    }
};
