var quotesOnPage = document.getElementsByTagName("p");

var quotesJsonDataBase;
var quotesPath = 'https://raw.githubusercontent.com/4skinSkywalker/Database-Quotes-JSON/master/quotes.json'

var lastRandomQuoteIndex = 0;

var xmlhttp = new XMLHttpRequest();

function loadQuotesFromRemoteDataBase() {
    xmlhttp = new XMLHttpRequest();

    xmlhttp.open('GET', quotesPath, true);
    xmlhttp.send();

    if(xmlhttp.status === 200) {
        quotesJsonDataBase = JSON.parse(xmlhttp.responseText);
    } else console.log('Error with remote json file')
}

function getRandomQuoteNumber(maxValue) {
    return Math.floor(Math.random() * maxValue);
}


function getQuote(index) {
    return quotesOnPage[index];
}

function getNewUniqueNumber() {
    let index = getRandomQuoteNumber(quotesOnPage.length);
    while (index === lastRandomQuoteIndex) {
        index = getRandomQuoteNumber(quotesOnPage.length);
    }
    return index;
}

function changeQuoteOfTheDay() {
    lastRandomQuoteIndex = getNewUniqueNumber();

    let tmpQuote = document.getElementById('QuoteOfTheDay').innerText;
    document.getElementById('QuoteOfTheDay').innerText = getQuote(lastRandomQuoteIndex).innerText;
    getQuote(lastRandomQuoteIndex).innerText = tmpQuote;
}

function sortQuotes() {
    let otherQuotes = document.getElementsByClassName('otherQuotes');

    let sortedStrings = getSortedStringArrayFromTags();
    var i = 0;
    for(var item of otherQuotes) {
        item.innerText = sortedStrings[i++];
    }
}

function getSortedStringArrayFromTags() {
    let otherQuotesOnPage = document.getElementsByClassName('otherQuotes');

    let quotesArrayForSorting = [];
    for(var item of otherQuotesOnPage) {
        quotesArrayForSorting.push(item.innerText)
    }

    return quotesArrayForSorting.sort();
}

function getRandomQuotesFromJson() {
    if(xmlhttp.status === 200 && quotesJsonDataBase === undefined) {
        quotesJsonDataBase = JSON.parse(xmlhttp.responseText);
    }

    let randomQuoteNumber = getRandomQuoteNumber(quotesJsonDataBase.length);
    document.getElementById('QuoteOfTheDay').innerText =
        '"' + quotesJsonDataBase[randomQuoteNumber].quoteText + '" - '
        + quotesJsonDataBase[randomQuoteNumber].quoteAuthor;
}

