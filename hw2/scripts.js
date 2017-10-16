let dataset_Countries2012;
let dataset_CountriesByYears;

let sortingOrder = { // true for asc
    name: true,      // false for desc
    continent: true,
    gdp: true,
    life_expectancy: true,
    population: true,
    year: true
};

let cbContinentsState = {
    Americas: false,
    Africa: false,
    Asia: false,
    Europe: false,
    Oceania: false
};

let desireColumns = ['name', 'continent', 'gdp', 'life_expectancy', 'population', 'year'];

let gdpParseFormatter = (str) =>
    parseFloat(str.replace('.', '').replace('P', '1e15').replace('T', '1e12').replace('G', '1e9').replace('M', '1e6'));
let populationParseFormatter = (str) => parseInt(str.replace(/,/g, ''));
let sorter = (a, b, order) => order ? d3.ascending(a, b) : d3.descending(a, b);

let changeCursorState = (header) => header ?
    'url(images/down-arrow_2.png), auto' : 'url(images/up-arrow_2.png), auto';

let dataset;

let tableCleaner = (tableBody) => tableBody.selectAll('tr').remove();

let tableDrawer = () => d3.select('body').append('table').attr('class', 'tableClass');
let tableHeadDrawer = (table) =>  table.append('thead').attr('class', 'thead');
let tableBodyDrawer = (table) => table.append('tbody');

let tableCaptionDrawer = (table) => table.append('caption')
    .html("World Countries Ranking")
    .attr('class', 'caption');

function addTableHeaders(thead, tbody) {
    thead.append('tr').selectAll('th')
        .data(desireColumns)
        .enter()
        .append('th')
        .attr('class', 'tableHeaders')
        .text(d => d)
        .on('click', function(header) { tbody
            .selectAll('tr')
            .sort((a, b) => sorting(a, b, header)),
            sortingOrder[header] = !sortingOrder[header],
            colorizeTableInZebraStyle(tbody),
            d3.select(this)
                .style('cursor', () => changeCursorState(sortingOrder[header]))
        })
        .on('mouseover', function (header) {
            d3.select(this)
                .style('cursor', () => changeCursorState(sortingOrder[header]))
        });
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
        .text(d => d)
        .attr('class', 'customCell')
        .on('mouseover', function (d, i) {            // remember this shit, dear reader...
            d3.select(this.parentNode)                // in this place we couldn't use some lambdas. Why?
                .style("background-color", "#F3ED86") // because keyword 'this' in lambdas determined by where lambda
        })                                            // was defined. DEFINED - NOT USED, KARL!
        .on('mouseout', function () {
            body.selectAll('tr')
                .style("background-color", null);
            colorizeTableInZebraStyle(body);
        });
    colorizeTableInZebraStyle(body);
}

function rangeChangeYear(value){
    dataset = changeData(value - d3.select('#rangeYear').property('min'));
    dataset.forEach(o => formatStringRepresent(o));

    let tableBody = d3.select('table').select('tbody');

    tableCleaner(tableBody);
    drawTableRows(tableBody, desireColumns, dataset)
}

function changeData(year) {
    let data = [];

    dataset_CountriesByYears.forEach(x => {
        var a = {};
        a['continent'] = x.continent;
        a['name'] = x.name;
        a['gdp'] = x.years[year].gdp !== null ? x.years[year].gdp : 0.0;
        a['life_expectancy'] = x.years[year].life_expectancy;
        a['population'] = x.years[year].population;
        a['year'] = x.years[year].year;
        data.push(a);
    });

    return data;
}

function drawTable() {
    let table = tableDrawer(),
        thead = tableHeadDrawer(table),
        tbody = tableBodyDrawer(table);

    tableCaptionDrawer(table);
    addTableHeaders(thead, tbody);
    drawTableRows(tbody, desireColumns, dataset);

    colorizeTableInZebraStyle(tbody);
}

function drawTableByAllYears() {
    dataset = changeData(0);
    dataset.forEach(o => formatStringRepresent(o));

    drawTable();
}

function drawTableByOneYear() {
    dataset = dataset_Countries2012;
    dataset.forEach(o => formatStringRepresent(o));

    drawTable();
}

function onCbChanged(continent) {
    cbContinentsState[continent] = d3.select('#cb' + continent).property('checked');

    let tableBody = d3.select("table").select('tbody');

    tableCleaner(tableBody);
    drawTableRows(tableBody,
        desireColumns,
        dataset.filter(e => Object.values(cbContinentsState).includes(true) ?
            cbContinentsState[e['continent']] : true
        ))
}

function onRbChanged(aggregation) {
    let data = dataset;
    if (!d3.select('#rb' + aggregation).property('checked') &&
        d3.select('#rb' + aggregation).attr('value') === 'None' ||
        d3.select('#rb' + aggregation).property('checked') &&
        d3.select('#rb' + aggregation).attr('value') === 'Continent' ){
            data = aggregate();
    }

    let tableBody = d3.select("table").select('tbody');

    tableCleaner(tableBody);
    drawTableRows(d3.select('table').select('tbody'), desireColumns, data)
}

function aggregate() {
    let nestedRows =  d3.nest()
        .key(d => d['continent'])
        .rollup(leaves => {
            let initial = JSON.parse(JSON.stringify(leaves[0]));
            d3.keys(initial).forEach(key => initial[key] = 0);
            initial.name = initial.continent = leaves[0].continent;
            initial.year = leaves[0].year;


            return leaves.reduce( (prev, curr) => {
                let ans = {};
                d3.keys(prev).forEach(key => {
                    switch (key) {
                        case 'gdp':
                            curr[key] = curr[key].toString();
                            ans[key] = prev[key] += gdpParseFormatter(curr[key]);
                            break;
                        case 'population':
                            ans[key] = prev[key] += populationParseFormatter(curr[key]);
                            break;
                        case 'life_expectancy':
                            ans[key] = prev[key] += curr[key] / leaves.length;
                            break;
                        default:
                            ans[key] = prev[key];
                    }
                });
                return ans;
            } , initial);
        },)
        .entries(dataset);

    let ret = [];
    nestedRows.map(e => e.value).forEach(x => ret.push(x));

    ret.forEach(d => formatStringRepresent(d));
    return ret;
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

    if(str.gdp < 1e9)
        str.gdp = d3.formatPrefix(',.1', 1e6)(str.gdp);
    if(str.gdp >= 1e9 && str.gdp < 1e12)
        str.gdp = d3.formatPrefix(',.1', 1e9)(str.gdp);
    if(str.gdp >= 1e12 && str.gdp < 1e15)
        str.gdp = d3.formatPrefix(',.1', 1e12)(str.gdp);
    if(str.gdp >= 1e15)
        str.gdp = d3.formatPrefix(',.1', 1e15)(str.gdp);
}