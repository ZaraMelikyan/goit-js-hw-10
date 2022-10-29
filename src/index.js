import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  cardContainer: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener(
  'input',
  debounce(validation, DEBOUNCE_DELAY)
);

function validation() {
  const inputValue = refs.searchInput.value.trim();
  if (inputValue === '') {
    clear();

    return;
  }

  if (!inputValue) {
    return;
  }

  fetchCountries(inputValue)
    .then(response => {
      if (response.length > 10) {
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (response.length >= 2 && response.length <= 10) {
        return renderListCountries(response);
      } else {
        return renderCountries(response);
      }
    })

    .catch(error => {
      clear();

      return Notiflix.Notify.failure(
        'Oops, there is no country with that name'
      );
    });
}

function renderCountries(countries) {
  clear();
  const markup = countries
    .map(country => {
      const { name, capital, population, flags, languages } = country;
      return `<div>
      <img src="${flags.svg}" width ="30"><span>${name.official}</span>
      <p>Capital :${capital}</p>
      <p>Population :${population}</p>
      <p>Languages :${Object.values(languages)}</p>
      </div>`;
    })
    .join('');

  refs.cardContainer.innerHTML = markup;
}

function renderListCountries(items) {
  clear();
  const markupList = items
    .map(country => {
      return `<li>
    <img src="${country.flags.svg}" alt="${country.name.official}" width ="30"><p>${country.name.official}</p></li>`;
    })
    .join('');
  refs.countryList.innerHTML = markupList;
  refs.countryList.addEventListener('mouseover', onHoverItemList);
}

function onHoverItemList(event) {
  if (event.target.alt === undefined) {
    return;
  }
  eveent.target.setAttribute('width', '50');
}

function clear() {
  refs.countryList.innerHTML = '';
  refs.cardContainer.innerHTML = '';
}
