var quotesOnPage = document.getElementsByTagName("p");
var selector = '[id^="Quote_"';

var lastRandomQuoteIndex = 0;

function getRandomQuoteNumber() {
    return Math.floor(Math.random() * quotesOnPage.length);
}

function getRandomQuote() {
    return quotesOnPage[getRandomQuoteNumber()].innerText;
}

function getQuote(index) {
    return quotesOnPage[index];
}

function getNewUniqueNumber() {
    let index = getRandomQuoteNumber();
    while (index === lastRandomQuoteIndex) {
        index = getRandomQuoteNumber();
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

