'use strict';
import './css/styles.css';
import Notiflix from 'notiflix'; // import notiflix
import debounce from 'lodash.debounce'; //import debounce
import { fetchCountries } from './fetchCountries'; //import fetch countries

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box'); //znalezienie input
const countryList = document.querySelector('.country-list'); //znalezienie ul
const countryInfo = document.querySelector('.country-info'); //znaleznienie div

//stworzenie listy krajów - znajduje sie w ul
const createList = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img class="flag" src="${flags.svg}" alt="${name.official} flag" width="60" height="60">${name.official}</li>`
    )
    .join('');
};

//stworzenie szczegółów dotyczących jednego kraju - znajduje sie w div
const oneResult = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<h2><img class="flag" src="${flags.svg}" alt="${
        name.official
      } flag" width="60" height="60">${name.official}</h2>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`
  );
};

//obsługa handlera
const inputHandler = event => {
  const inputValue = event.target.value.trim(); //wartosc inputa z metoda trim, ktora rozwiazuje problem spacji
  if (!inputValue) {
    // jesli nie istnieje input to ul i div sa puste
    countryList.innerHTML = ' ';
    countryInfo.innerHTML = ' ';
    return;
  }
  fetchCountries(inputValue)
    .then(data => {
      if (data.length > 10) {
        //jesli jest wiecej wynikow niz 10 to info i czysci ul
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        countryList.innerHTML = ' ';
        return;
      }
      if (data.length === 1) {
        //jesli dokladnie 1 wynik to czysci ul i wykonuje oneResult, ktore pokazuje szczegoly
        countryList.innerHTML = ' ';
        countryInfo.innerHTML = oneResult(data);
        return;
      }
      //w innym wypadku tworzy liste ul krajow
      countryList.innerHTML = createList(data);
      countryInfo.innerHTML = ' ';
    })
    .catch(error => {
      //obsluga bledu jesli nie znajdzie kraju
      Notiflix.Notify.failure('Oops, there is no country with that name.');
      countryInfo.innerHTML = ' ';
      countryList.innerHTML = ' ';
    });
};
//eventListenner na inpucie, debounce z lodasha z delayem
input.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

//style dla ul
countryList.style.listStyle = 'none';
countryList.style.paddingLeft = '0px';
