var quotesOnPage = document.getElementsByTagName("p");

function getRandomQuote() {
    return quotesOnPage[Math.floor(Math.random() * quotesOnPage.length)].innerText;
}

// now it works awful because 'random' can return same number as being before
// TODO: fix this sheet

function changeQuoteOfTheDay() {
    return document.getElementById('quoteOfTheDay').innerText = getRandomQuote(quotesOnPage)
}

function sortQuotes() {
    var quotesArrayForSorting = [];

    var selector = '[id^="Quote_"'
    var otherQuotesOnPage = document.querySelectorAll(selector);

    for(var item of otherQuotesOnPage) {
        // console.log(item.innerText)
        quotesArrayForSorting.push(item.innerText)
    }
    quotesArrayForSorting.sort();

    var otherQuotes = document.querySelectorAll(selector);

    var i = 0;
    for(var item of otherQuotes) {
        item.innerText = quotesArrayForSorting[i++];
    }
}

// function test() {
//     // console.log('Changed Quote Of The Day: ' +  getRandomQuote(quotesOnPage))
//     // console.log('Quote looks like: ' + changeQuoteOfTheDay(quotesOnPage))
//     console.log('sort (?): ' + sortQuotes())
// }