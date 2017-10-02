var quotesOnPage = document.getElementsByTagName("p");

function getRandomQuote() {
    return quotesOnPage[Math.floor(Math.random() * quotesOnPage.length)].innerText;
}

// now it works awful because 'random' can return same number as being before
// TODO: fix this sheet

function changeQuoteOfTheDay() {
    return document.getElementById('quoteOfTheDay').innerText = getRandomQuote(quotesOnPage)
}

// function test() {
//     console.log('Changed Quote Of The Day: ' +  getRandomQuote(quotesOnPageOnPage))
//     console.log('Quote looks like: ' + changeQuoteOfTheDay(quotesOnPageOnPage))
// }