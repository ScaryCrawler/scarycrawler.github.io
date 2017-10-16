var dataset_Countries2012;

var sortingOrder = { // true for asc
    name: true,      // false for desc
    continent: true,
    gdp: true,
    life_expectancy: true,
    population: true,
    year: true
};

var gdpParseFormatter = (str) => parseInt(str.replace('.','').replace('T','000'));
var populationParseFormatter = (str) => parseInt(str.replace(/,/g,''));
var sorter = (a, b, order) => order ? d3.ascending(a, b) : d3.descending(a, b);

var changeCursorState = (header) => header ?
    'url(images/down-arrow_2.png), auto' : 'url(images/up-arrow_2.png), auto';


let cells;
let rows;
let table;

let desireColumns;

function drawTable() {
    console.log(dataset_Countries2012);
    let columnsKeys = Object.keys(dataset_Countries2012[0]);
    console.log(columnsKeys);


    desireColumns = getNeededColumnKeys(columnsKeys);
    console.log(desireColumns);

    dataset_Countries2012.forEach(o => formatStringRepresent(o));

    table = d3.select('body').append('table').attr('class', 'tableClass'),
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

    rows = tbody.selectAll('tr.row')
        .data(dataset_Countries2012)
        .enter()
        .append('tr')
        .each(function (d, i) {
            d3.select(this)
                .attr('class', (i % 2 === 0) ? 'even' : 'odd')
        })
        .attr('class', 'row');


    cells = rows.selectAll('td')
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

function getChangedData() {
    var changedData = [];
    // console.log(Object.keys(states[0])[0]); // TODO: BULLSHIT
    states.forEach(s => dataset_Countries2012.forEach(function (x) {
        if (x.continent === Object.keys(s)[0])
            changedData.push(x);
    }));
    return changedData;
}


function updateOnContinents() {
    var changedData = getChangedData();

    tbody.selectAll('tr')
        .data(dataset_Countries2012)
        .remove();

    rows_ = tbody.selectAll('tr')
        .data(changedData)
        .enter()
        .append('tr')
        .each(function (d, i) {
            d3.select(this)
                .attr('class', (i % 2 === 0) ? 'even' : 'odd')
        })
        .attr('class', 'row');

    cells = rows_.selectAll('td')
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

    // rows.data(changedData)
    //     .exit()
    //     .remove();
}

function sorting(a, b, header) {
    // switch (header) {
    //     // case 'continent' : {
    //     //     if (a[header] === b[header]) // TODO: ask about order in country name in desc use case
    //     //         return sorter(a['name'], b['name'], sortingOrder[header]);
    //     //     break;
    //     // }
    //     case 'population' :
    //         return sorter(populationParseFormatter(a[header]),
    //             populationParseFormatter(b[header]),
    //             sortingOrder[header]);
    //         break;
    //     case 'gdp' :
    //         a[header] = a[header].toString();
    //         b[header] = b[header].toString();
    //         return sorter(gdpParseFormatter(a[header]),
    //             gdpParseFormatter(b[header]),
    //             sortingOrder[header]);
    //         break;
    //     // default:
    //     //     return sorter(a[header], b[header], sortingOrder[header]);
    //         // break;
    // }

    if (header === 'continent') { // TODO: ask about order in country name in desc use case
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

function onCheckBoxStateChanged() {
    d3.selectAll('input')
        .each(function (d) {
            console.log(d3.select(this).attr('checked'))
        });

    var a = Math.round(Math.random() * 50);

    var test = dataset_Countries2012;
    var changedData =  test.slice(a, a + 15);

    updateOnContinents(changedData);
}

function onAmericaClicked() {
    states[0].Americas = !states[0].Americas;

    updateOnContinents();
}

var states = [
    {Americas: false},
    {Africa: false},
    {Oceania: false}
]

// var states = {
//     Americas: false,
//     Africa: false,
//     Oceania: false
// }

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