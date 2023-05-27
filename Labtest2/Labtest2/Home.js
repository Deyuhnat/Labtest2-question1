let allCountries = [];
let currentPage = 1;
const itemsPerPage = 10;

let filteredCountries = [...allCountries];
let searchedCountries = [...allCountries];

function displayCountries() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let countryList = document.getElementById('country-list');
    countryList.innerHTML = "";

    let countriesToDisplay = searchedCountries.slice(startIndex, endIndex);
    for (let country of countriesToDisplay) {
        let card = document.createElement('div');
        card.classList.add('country-card');

        let flag = document.createElement('img');
        flag.src = country.flags.png;
        flag.alt = `${country.name.common} flag`;
        card.appendChild(flag);

        let name = document.createElement('h2');
        name.textContent = country.name.common;
        card.appendChild(name);

        let population = document.createElement('p');
        population.textContent = `Population: ${country.population}`;
        card.appendChild(population);

        let region = document.createElement('p');
        region.textContent = `Region: ${country.region}`;
        card.appendChild(region);

        let subregion = document.createElement('p');
        subregion.textContent = `Subregion: ${country.subregion}`;
        card.appendChild(subregion);

        let details = document.createElement('a');
        details.href = `detail.html?country=${country.cca3}`;
        details.textContent = 'More info';
        card.appendChild(details);

        countryList.appendChild(card);

    }
}

fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
        allCountries = data;
        filteredCountries = [...data];
        searchedCountries = [...data];
        displayCountries();
    })
    .catch((error) => {
        console.error('Error:', error);
    });

function next() {
    if (currentPage < Math.ceil(searchedCountries.length / itemsPerPage)) {
        currentPage++;
        displayCountries();
    }
}

function previous() {
    if (currentPage > 1) {
        currentPage--;
        displayCountries();
    }
}

document.getElementById('previous').addEventListener('click', previous);
document.getElementById('next').addEventListener('click', next);

function filterCountries() {
    const regionFilter = document.getElementById('region-filter').value;
    const subregionFilter = document.getElementById('subregion-filter').value;
    const populationFilter = document.getElementById('population-filter').value;

    filteredCountries = allCountries.filter(country => {
        return (regionFilter === '' || country.region === regionFilter) &&
            (subregionFilter === '' || country.subregion === subregionFilter) &&
            (populationFilter === '' ||
                (country.population / 1000000 >= Number(populationFilter.split('-')[0]) &&
                    country.population / 1000000 <= Number(populationFilter.split('-')[1])));
    });

    searchedCountries = [...filteredCountries];
    displayCountries();
}

//searching countries
function searchCountries() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    searchedCountries = filteredCountries.filter(country =>
        country.name.common.toLowerCase().includes(searchInput)
    );

    displayCountries();
}

//filter and search inputs
document.getElementById('region-filter').addEventListener('change', filterCountries);
document.getElementById('subregion-filter').addEventListener('change', filterCountries);
document.getElementById('population-filter').addEventListener('change', filterCountries);
document.getElementById('search-input').addEventListener('input', searchCountries);


fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
        allCountries = data;
        filteredCountries = [...data];
        searchedCountries = [...data];

        populateRegionsAndSubregions();
        displayCountries();
    })
    .catch((error) => {
        console.error('Error:', error);
    });

function populateRegionsAndSubregions() {
    let regionSet = new Set();
    let subregionSet = new Set();

    allCountries.forEach(country => {
        regionSet.add(country.region);
        subregionSet.add(country.subregion);
    });

    let regionFilter = document.getElementById('region-filter');
    let subregionFilter = document.getElementById('subregion-filter');

    regionFilter.innerHTML = '<option value="">Filter by Region</option>';
    subregionFilter.innerHTML = '<option value="">Filter by Subregion</option>';

    // Populate regions
    regionSet.forEach(region => {
        if (region) {
            let option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionFilter.appendChild(option);
        }
    });

    // Populate subregions
    subregionSet.forEach(subregion => {
        if (subregion) {
            let option = document.createElement('option');
            option.value = subregion;
            option.textContent = subregion;
            subregionFilter.appendChild(option);
        }
    });
}

function sortCountries() {
    const sortValue = document.getElementById('sort-filter').value;

    if (sortValue === 'population-asc') {
        searchedCountries.sort((a, b) => a.population - b.population);
    } else if (sortValue === 'population-desc') {
        searchedCountries.sort((a, b) => b.population - a.population);
    } else if (sortValue === 'name-asc') {
        searchedCountries.sort((a, b) => a.name.common.localeCompare(b.name.common));
    } else if (sortValue === 'name-desc') {
        searchedCountries.sort((a, b) => b.name.common.localeCompare(a.name.common));
    }

    displayCountries();
}

// Attach event listeners to sort select input
document.getElementById('sort-filter').addEventListener('change', sortCountries);