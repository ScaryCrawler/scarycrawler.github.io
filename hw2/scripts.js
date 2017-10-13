var dataset_Countries2012;

function drawTable() {
    console.log(dataset_Countries2012);
    let columnsKeys = Object.keys(dataset_Countries2012[0]);
    console.log(columnsKeys);


    let desireColumns = getNeededColumnKeys(columnsKeys);
    console.log(desireColumns);

    let table = d3.select('body').append('table'),
        thead = table.append('thead').attr('class', 'thead'),
        tbody = table.append('tbody');

    table.append('caption')
        .html("World Countries Ranking")

    thead.append('tr').selectAll('th')
        .data(desireColumns)
        .enter()
        .append('th')
        .text(d => d)
        .on('click', (header, i) => tbody
            .selectAll('tr')
            .sort((a, b) => d3.descending(a[header], b[header])));

    let rows = tbody.selectAll('tr.row')
        .data(dataset_Countries2012)
        .enter()
        .append('tr')
        .attr('class', 'row');

    let cells = rows.selectAll('td')
        .data(row => d3.range(Object.keys(row).length)
            .map((column, i) => row[desireColumns[i]]))
        .enter()
        .append('td')
        .text(d => d)
        .on('mouseover', function (d, i) {            // remember this shit, dear reader...
            d3.select(this.parentNode)                // in this place we couldn't use some lambdas. Why?
                .style("background-color", "#F3ED86") // because keyword 'this' in lambdas determined by where lambda
        })                                            // was defined. DEFINED - NOT USED, KARL!
        .on('mouseout', () => tbody.selectAll('tr')
            .style("background-color", null)
            .selectAll('td')
            .style("background-color", null));
}

function getNeededColumnKeys(columnsKeys) {
    let neededColumnsKeys = [];

    columnsKeys.forEach(x => {
        switch (x) {
            case 'continent' :
                neededColumnsKeys.push(x);
                break;
            case 'name':
                neededColumnsKeys.push(x);
                break;
            case 'gdp':
                neededColumnsKeys.push(x);
                break;
            case 'life_expectancy':
                neededColumnsKeys.push(x);
                break;
            case 'population':
                neededColumnsKeys.push(x);
                break;
            case 'year':
                neededColumnsKeys.push(x);
                break;
            default:
                break;
        }
    });

    return neededColumnsKeys;
}