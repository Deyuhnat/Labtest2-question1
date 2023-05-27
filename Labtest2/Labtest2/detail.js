const params = new URLSearchParams(window.location.search);
const countryCode = params.get('country');
const main = document.querySelector('main');
const spinner = document.querySelector('.spinner-border');

main.style.display = 'none';

fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
    .then(response => response.json())
    .then(data => {
        main.style.display = 'block';
        spinner.style.display = 'none';
        const country = data[0];

        console.log('data: ', data);
        console.log('country:', country);

        const nameElement = document.getElementById('country-name');
        const flagElement = document.getElementById('country-flag');
        const populationElement = document.getElementById('country-population');
        const regionElement = document.getElementById('country-region');
        const subregionElement = document.getElementById('country-subregion');
        const languagesElement = document.getElementById('country-languages');
        const capitalElement = document.getElementById('country-capital');
        const currencyElement = document.getElementById('country-currency');
        const timezonesElement = document.getElementById('country-timezones');

        const currencies = Object.keys(country.currencies);
        
        console.log('currencies:', country.currencies);
        

        nameElement.textContent = country.name.common || '';
        flagElement.src = country.flags.png;
        flagElement.alt = `${country.name.common} flag`;
        populationElement.textContent = "Population: " + country.population.toLocaleString();
        regionElement.textContent = "Region: " + country.region;
        subregionElement.textContent = "Subregion: " + country.subregion;
        languagesElement.textContent = "Languages: " + Object.values(country.languages).join(', ');
        capitalElement.textContent = "Capital: " + country.capital[0];
        // currencyElement.textContent = country.currencies ? "Currency: " + country.currencies.XCD.name + " (" + country.currencies.XCD.symbol + ")" : '';
        currencyElement.textContent = `Currency: ${country.currencies[currencies[0]].name} (${country.currencies[currencies[0]].symbol})`;
        timezonesElement.textContent = "Timezones: " + country.timezones.join(', ');
    })
    .catch(err => {
        console.log(err);
        alert("An error occurred while fetching the country data.");
        main.style.display = 'none';
    });