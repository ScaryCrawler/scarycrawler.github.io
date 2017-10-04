var quotesOnPage = document.getElementsByTagName("p");
var selector = '[id^="Quote_"';
var quotesPath = 'https://raw.githubusercontent.com/4skinSkywalker/Database-Quotes-JSON/master/quotes.json'

var lastRandomQuoteIndex = 0;

function getRandomQuoteNumber(maxValue) {
    return Math.floor(Math.random() * maxValue);
}

function getRandomQuote() {
    return quotesOnPage[getRandomQuoteNumber(quotesOnPage.length)].innerText;
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
    let otherQuotes = document.querySelectorAll(selector);

    let sortedStrings = getStringArrayFromTags();
    var i = 0;
    for(var item of otherQuotes) {
        item.innerText = sortedStrings[i++];
    }
}

function getStringArrayFromTags() {
    let otherQuotesOnPage = document.querySelectorAll(selector);

    let quotesArrayForSorting = [];
    for(var item of otherQuotesOnPage) {
        quotesArrayForSorting.push(item.innerText)
    }

    return quotesArrayForSorting.sort();
}

function getRandomQuotesFromJson() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open('GET', quotesPath, false);
    xmlhttp.send();

    if(xmlhttp.status === 200) {
        let quotes = JSON.parse(xmlhttp.responseText);
        let randomQuoteNumber = getRandomQuoteNumber(quotes.length);
        document.getElementById('QuoteOfTheDay').innerText =
            '"' + quotes[randomQuoteNumber].quoteText + '" - ' + quotes[randomQuoteNumber].quoteAuthor;
    } else console.log('Error with remote json file')
}

