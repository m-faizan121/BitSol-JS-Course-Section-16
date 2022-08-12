'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

////////////////////////////////////////////////////////// Asynchronous Javascript

//Asynchronous means that program dont need to wait for some code, and continue to execulte unlike Synchronous Javascript
//Example: setTimeOut(), API requests etc
//API Request (JS jas lot of online APIs that can be used to retrieve data)

function getCountryData(countryName) {

    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v2/name/${countryName}`) // This URL copied from github-public-apis website
    request.send();

    // As soon as the send() finction retrieve data in background, this event listener will call automatically
    request.addEventListener('load', function() {
        let data = JSON.parse(this.responseText);
        data = data[0];

        const html = `
        <article class="country">
            <img class="country__img" src="${data.flag}"/>
            <div class="country__data">
                <h3 class="country__name">${data.name}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)}</p>
                <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
                <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
            </div>
            </article>`;

        countriesContainer.insertAdjacentHTML('beforeend', html);
        countriesContainer.style.opacity = 1;

    })

}

getCountryData('Pakistan');
getCountryData('USA');

////////////////////////////////////////////////////////// CallBack Hell

// Nested Asynchronous Code to Make Code execute in sequence is called CallBack Hell
// Why we do in sequence ? 
// For example: As different Asynchronous calls dont wait for other, whoever execute first will display its result but
// if we want to perform in order, one after another we have to make Asynchronous calls in sequence

// CallBack Hell example

// setTimeout(() => {
//     console.log('1 second passes')
//     setTimeout(() => {
//         console.log('2 second passes')
//         setTimeout(() => {
//             console.log('3 second passes')
//             setTimeout(() => {
//                 console.log('4 second passes')
//                 setTimeout(() => {
//                     console.log('5 second passes')
//                 }, 1000);
//             }, 1000);
//         }, 1000);
//     }, 1000);
// }, 1000);

// But call back hell have too much massy code and will solve it using Promises (invented in ES6 of JS)

//////////////////////////////////////////////////////// Prmoises

// Promise is a Conatiner for a Future Value
// Future value can be API/AJAX respinse which we know that occur in future

// Advantages
// 1) We dont rely on Events & Callbacks
// 2) Prevent CallBack Hell as discussed above

// Promises has 2 types
// 1) Pending
// 2) Settled (Fulfilled & Rejected)

// Consuming Promises (Handling Fullfilled Promises)

function showCountry(data) {
    const html = `
        <article class="country">
            <img class="country__img" src="${data.flag}"/>
            <div class="country__data">
                <h3 class="country__name">${data.name}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)}</p>
                <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
                <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
            </div>
            </article>`;

        countriesContainer.insertAdjacentHTML('beforeend', html);
        countriesContainer.style.opacity = 1;
}

const getCountryDataUsingPromises = function(countryName) {
    const promis = fetch(`https://restcountries.com/v2/name/${countryName}`); // fetch function using GET by default and returns a promise
    promis.then(function(response) { // This callback function will execute as Promise is fullfilled
        return response.json(); // In order to read data from fetch response, we have to call json()
    }).then(function(data){ // This callback will handle response coming from above promise
        showCountry(data[0]);
    });
}
getCountryDataUsingPromises('Aus');


// Promises Chaining
const getNeighborCountryDataUsingPromises = function(countryName) {
    const promis = fetch(`https://restcountries.com/v2/name/${countryName}`); // fetch function using GET by default and returns a promise
    promis.then(function(response) { // First callback function will execute as Promise is Fullfilled
        return response.json(); // In order to read data from fetch response, we have to call json()
    }).then(function(data){ // This callback will handle response coming from above promise
        showCountry(data[0]);
        const neighbour = data[0].borders[0];

        if(!neighbour) return;

        return fetch(`https://restcountries.com/v2/name/${neighbour}`);
    }).then (function(response) {
        return response.json(); // In order to read data from fetch response, we have to call json()
    }).then(function(data){ // This callback will handle response coming from above promise
        showCountry(data[0]);
    });
}
getNeighborCountryDataUsingPromises('Pakistan');

// Handling Rejected Promises Errors (such as Loosing Internet)
const rejectedPromis = function(countryName) {
    const promis = fetch(`https://restcountries.com/v2/name/${countryName}`); // fetch function using GET by default and returns a promise
    promis.then(function(response) { // First callback function will execute as Promise is Fullfilled
        return response.json(); // In order to read data from fetch response, we have to call json()
    }, function(error) { // Second callback function will execute as Promise is Rejected
        alert('Promise Rejected');
    }).then(function(data){ // This callback will handle response coming from above promise
        showCountry(data[0]);
    })
}

// In case of multiple callback functions for multiple promises, we can use one catch at the end
const handleRejecttionUsingCatch = function(countryName) {
    const promis = fetch(`https://restcountries.com/v2/name/${countryName}`); // fetch function using GET by default and returns a promise
    promis.then(function(response) { // First callback function will execute as Promise is Fullfilled
        return response.json(); // In order to read data from fetch response, we have to call json()
    }).then(function(data){ // This callback will handle response coming from above promise
        showCountry(data[0]);
        const neighbour = data[0].borders[0];

        if(!neighbour) return;

        return fetch(`https://restcountries.com/v2/name/${neighbour}`);
    }).then (function(response) {
        return response.json(); // In order to read data from fetch response, we have to call json()
    }).then(function(data){ // This callback will handle response coming from above promise
        showCountry(data[0]);
    }).catch(function(error) {
        alert('Promise Rejected');
    });
}

// Manual Error using Throw
const throwManualError = function(countryName) {
    const promis = fetch(`https://restcountries.com/v2/name/${countryName}`); // fetch function using GET by default and returns a promise
    promis.then(function(response) { // First callback function will execute as Promise is Fullfilled

        if(!response.ok) // Not OK
            throw new Error('Promise is Rejected');

        return response.json(); // In order to read data from fetch response, we have to call json()
    }).then(function(data){ // This callback will handle response coming from above promise
        showCountry(data[0]);
        const neighbour = data[0].borders[0];

        if(!neighbour) return;

        return fetch(`https://restcountries.com/v2/name/${neighbour}`);
    }).then (function(response) {
        return response.json(); // In order to read data from fetch response, we have to call json()
    }).then(function(data){ // This callback will handle response coming from above promise
        showCountry(data[0]);
    }).catch(function(error) {
        alert(error);
    });
}

////////////////////////////////////////////////////////// Event Loop
// As JS cannot do multi-threading programming so how cam we do Asynchronous non-blocking cunoncurrency ?
// JS put normal callbacks into CallBack Queue aand Promises into Micro Task Queue 
// Micro Task Queue has more priority then CallBack Queue

setTimeout(() => console.log('I am Regular Call Back'), 0);
Promise.resolve('I am Promise Call Back').then((response) => console.log(response));

// In above code, callback ftn of Promise is put in microtask queue and has high priority as compared to Normal callback
// So it will execute in this order:
/*
I am Promise Call Back
I am Regular Call Back
*/

////////////////////////////////////////////////////////// Building a Simple Promise
const promise = new Promise(function(resolve, reject){
    const random = Math.random();
    if(random >= 0.5) {
        resolve('I am resolved');
    }
    else {
        reject('I am rejected');
    }
})
promise.then(
    function(response) {
        console.log(response);
    }, function(error) {
        console.log(error);
    }
)

// Promisifying Geolocation API
// Promisifying means convert Call Back API into Promise Based API

// Simple Call Back API
navigator.geolocation.getCurrentPosition(
    function(pos) {
        console.log(pos);
    },
    function(err) {
        console.log(err);
    }
)

// Promisifying to Promised Based
const getPosition1 = new Promise(function(resolve, reject){
    navigator.geolocation.getCurrentPosition(
        function(pos) {
            resolve(pos);
        },
        function(err) {
            reject(err);
        }
    )
})
// Above can be simplifed as this
const getPosition2 = new Promise(function(resolve, reject){
    navigator.geolocation.getCurrentPosition(resolve, reject) // As resolve and reject are callback ftns, so they are auto called with parameters
})

// Calling Promise
getPosition1.then(
    function(resp) {
        console.log(resp);
    },
    function(err) {
        console.log(err);
    }
)
getPosition2.then(
    function(resp) {
        console.log(resp);
    },
    function(err) {
        console.log(err);
    }
)

// Consuming Promises using Async/Await
// In order to reduce chaingin using (then), we can use async/await
// Remember: Asynch functions always return Promise object

const getCountryUsingAsync = async function(countryName) {
    const response = await fetch(`https://restcountries.com/v2/name/${countryName}`);
    const data = await response.json();
    console.log(data[0].name); // Pakistan
}
getCountryUsingAsync('Pakistan');

// To use error handling in async, we use try-catch block
// Try catch is same as in othe languages like java, c++

////////////////////////////////////// Return Values from Async Functions

const getCountryUsingAsync2 = async function(countryName) {
    const response = await fetch(`https://restcountries.com/v2/name/${countryName}`);
    const data = await response.json();
    return data[0];
}
// As we know, async functions always return Promise, wo we have to use (then) to handle them
getCountryUsingAsync2('Pakistan').then(response => console.log(response.name)); // Pakistan


///////////////////////////////////////// Parallel Promises
// This can be done using Promise.all() method

const getJSON = function (url, errorMsg = 'Something went wrong') {
    return fetch(url).then(response => {
      if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
  
      return response.json();
    });
  };
  

const getCountriesParallel = async function(countryName1, countryName2, countryName3) {
    const response = await Promise.all([getJSON(`https://restcountries.com/v2/name/${countryName1}`),
    getJSON(`https://restcountries.com/v2/name/${countryName2}`),
    getJSON(`https://restcountries.com/v2/name/${countryName3}`)]);
    console.log(response.map(d => d[0].capital));

}
getCountriesParallel('Pakistan', 'UAE', 'USA'); // ['Islamabad', 'Abu Dhabi', 'Washington, D.C.']

// Promise Combinators

// 1) Race
// It gives response which executes first/fast

const getCountriesRace = async function(countryName1, countryName2, countryName3) {
    const response = await Promise.race([getJSON(`https://restcountries.com/v2/name/${countryName1}`),
    getJSON(`https://restcountries.com/v2/name/${countryName2}`),
    getJSON(`https://restcountries.com/v2/name/${countryName3}`)]);
    console.log(response[0].name);

}
getCountriesRace('Pakistan', 'UAE', 'USA'); // United States of America


// 2) AllSettled
Promise.allSettled([
    Promise.resolve('Success'),
    Promise.reject('Error'),
    Promise.resolve('Success Too')
]).then(res => console.log(res));
