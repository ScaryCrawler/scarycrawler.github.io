var dataset_Countries2012;

var sortingOrder = { // true for asc
    name: true,      // false for desc
    continent: true,
    gdp: true,
    life_expectancy: true,
    population: true,
    year: true
};

var cbContinentsState = {
    Americas: false,
    Africa: false,
    Asia: false,
    Europe: false,
    Oceania: false
};

var gdpParseFormatter = (str) => parseInt(str.replace('.','').replace('T','000'));
var populationParseFormatter = (str) => parseInt(str.replace(/,/g,''));
var sorter = (a, b, order) => order ? d3.ascending(a, b) : d3.descending(a, b);

var changeCursorState = (header) => header ?
    'url(images/down-arrow_2.png), auto' : 'url(images/up-arrow_2.png), auto';

let desireColumns;

function drawTable() {
    /*let */desireColumns = getNeededColumnKeys(Object.keys(dataset_Countries2012[0]));

    dataset_Countries2012.forEach(o => formatStringRepresent(o));

    let table = d3.select('body').append('table').attr('class', 'tableClass'),
        thead = table.append('thead').attr('class', 'thead'),
        tbody = table.append('tbody');

    table.append('caption')
        .html("World Countries Ranking")
        .attr('class', 'caption');

    thead.append('tr').selectAll('th')
        .data(desireColumns)
        .enter()
        .append('th')
        .attr('class', 'tableHeaders')
        .text(d => d)
        .on('click', function(header, i) { tbody
            .selectAll('tr')
            .sort((a, b) => sorting(a, b, header)),
                sortingOrder[header] = !sortingOrder[header],
                colorizeTableInZebraStyle(tbody),
                d3.select(this)
                    .style('cursor', () => changeCursorState(sortingOrder[header]))
        })
        .on('mouseover', function (header, i) {
            d3.select(this)
                .style('cursor', () => changeCursorState(sortingOrder[header]))
        });

    let rows = tbody.selectAll('tr.row')
        .data(dataset_Countries2012)
        .enter()
        .append('tr')
        .each(function (d, i) {
            d3.select(this)
                .attr('class', (i % 2 === 0) ? 'even' : 'odd')
        })
        .attr('class', 'row');


    let cells = rows.selectAll('td')
        .data(row => d3.range(desireColumns.length)
            .map((column, i) => row[desireColumns[i]]))
        .enter()
        .append('td')
        .attr('class', 'customCell')
        .text(d => d)
        .on('mouseover', function (d, i) {            // remember this shit, dear reader...
            d3.select(this.parentNode)                // in this place we couldn't use some lambdas. Why?
                .style("background-color", "#F3ED86") // because keyword 'this' in lambdas determined by where lambda
        })                                            // was defined. DEFINED - NOT USED, KARL!
        .on('mouseout', function () {
            tbody.selectAll('tr')
                .style("background-color", null);
            colorizeTableInZebraStyle(tbody);
        });

    colorizeTableInZebraStyle(tbody);
}

function onCbChanged(continent) {
    console.log(continent)
    console.log(d3.select('#cb' + continent).property('checked'))
    cbContinentsState[continent] = d3.select('#cb' + continent).property('checked');
    d3.select("table")
        .select('tbody')
        .selectAll('tr')
        .remove();
    drawTableRows(d3.select("table").select('tbody'),
        desireColumns,
        dataset_Countries2012.filter(e => Object.values(cbContinentsState).includes(true) ?
            cbContinentsState[e['continent']] : true
        ))
}

function drawTableRows(body, columns, data){
    let rows = body.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    rows.selectAll("td")
        .data(row => columns.map((column, i) => row[desireColumns[i]]))
        .enter()
        .append("td")
        .text(d => d);

    colorizeTableInZebraStyle(body);
}

function sorting(a, b, header) {
    if (header === 'continent') {
        if(a[header] === b[header])
            return sorter(a['name'], b['name'], sortingOrder[header])
    }
    if (header === 'population') {
        return sorter(populationParseFormatter(a[header]), populationParseFormatter(b[header]), sortingOrder[header])
    }
    if (header === 'gdp') {
        a[header] = a[header].toString();
        b[header] = b[header].toString();
        return sorter(gdpParseFormatter(a[header]), gdpParseFormatter(b[header]), sortingOrder[header])
    }
    return sortingOrder[header] ? d3.ascending(a[header], b[header]) : d3.descending(a[header], b[header]);
}

function colorizeTableInZebraStyle(tbody) {
    tbody.selectAll('tr')
        .each(function (d, i) {
            d3.select(this)
                .attr('class', (i % 2 === 0) ? 'odd' : 'even')
        })
}

function formatStringRepresent(str) {
    str.population = d3.format(',')(str.population);
    str.life_expectancy = d3.format('.1f')(str.life_expectancy);

    if(str.gdp > 1e9 && str.gdp < 1e12)
        str.gdp = d3.formatPrefix(',.1', 1e9)(str.gdp);
    if(str.gdp > 1e12)
        str.gdp = d3.formatPrefix(',.1', 1e12)(str.gdp);
}

function getNeededColumnKeys(columnsKeys) {
    let neededColumnsKeys = [];

    columnsKeys.forEach(x => {
        switch (x) {
            case 'continent' :
                neededColumnsKeys.push(x);
                break;
            case 'name':
                neededColumnsKeys.unshift(x);
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