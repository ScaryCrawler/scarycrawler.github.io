class Table {
    drawHead(table) {
        return table.append('thead').attr('class', 'thead');
    }

    drawBody(table) {
        return table.append('tbody');
    }

    drawCaption(table) {
        return table.append('caption')
            .html("World Countries Ranking")
            .attr('class', 'caption');
    }

    drawTable() {
        return d3.select('body')
            .append('table')
            .attr('class', 'tableClass');
    }

    cleanTable(tableBody) {
        return tableBody.selectAll('tr').remove();
    }
}