import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CountryList.css';

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    smallerThanLithuania: false,
    inOceaniaRegion: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://restcountries.com/v2/all?fields=name,region,area'
        );
        setCountries(response.data);
      } catch (error) {
        console.log('Error fetching countries:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [countries, filterOptions]);

  const sortCountries = () => {
    const sortedCountries = [...filteredCountries].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setFilteredCountries(sortedCountries);
  };
  

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    sortCountries()
};

const applyFilters = () => {
    // Apply selected filters to the countries list
    let filtered = countries;
  
    if (filterOptions.smallerThanLithuania) {
      const lithuania = countries.find((country) => country.name === 'Lithuania');
      filtered = filtered.filter((country) => country.area < lithuania.area);
    }
  
    if (filterOptions.inOceaniaRegion) {
      filtered = filtered.filter((country) => country.region === 'Oceania');
    }
  
    setFilteredCountries(filtered);
  };
  

  const handleFilterChange = (filterName) => {
    // Update the filter options based on div click
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      [filterName]: !prevOptions[filterName],
    }));
  };

  return (
    <div className="container">
      <h1>Country List</h1>
      <div className="filters-container">
      <div  className="filters">
      <div
          className={filterOptions.smallerThanLithuania ? 'active' : 'filter'}
          onClick={() => handleFilterChange('smallerThanLithuania')}
        >
          Smaller than Lithuania by area
        </div>
        <div
          className={filterOptions.inOceaniaRegion ? 'active' : 'filter'}
          onClick={() => handleFilterChange('inOceaniaRegion')}
        >
          In Oceania region
        </div>
      </div>
      <div>
      <button onClick={toggleSortOrder}>
        Sort by Name ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </button>
      </div>
      
      </div>
     
      <div className="country-list">
        {filteredCountries.map((country) => (
          <div className="country-item" key={country.name}>
            <div><strong>Country:</strong> {country.name}</div>
            <div><strong>Region:</strong> {country.region}</div>
            <div><strong>Area:</strong> {country.area}</div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default CountryList;
