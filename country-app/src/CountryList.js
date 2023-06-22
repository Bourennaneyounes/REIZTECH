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
    let filtered = countries;

    if (filterOptions.smallerThanLithuania) {
      const lithuania = countries.find((country) => country.name === 'Lithuania');
      filtered = countries.filter((country) => country.area < lithuania.area);
    }

    if (filterOptions.inOceaniaRegion) {
      filtered = countries.filter((country) => country.region === 'Oceania');
    }

    setFilteredCountries(filtered);
  };

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      [name]: checked,
    }));
  };

  return (
    <div className="container">
      <h1>Country List</h1>
      <div  className="filters">
        <label>
          <input
            type="checkbox"
            name="smallerThanLithuania"
            checked={filterOptions.smallerThanLithuania}
            onChange={handleFilterChange}
          />
          Smaller than Lithuania by area
        </label>
        <label>
          <input
            type="checkbox"
            name="inOceaniaRegion"
            checked={filterOptions.inOceaniaRegion}
            onChange={handleFilterChange}
          />
          In Oceania region
        </label>
      </div>
      <button onClick={toggleSortOrder}>
        Sort by Name ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </button>
      <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Region</th>
            <th>Area</th>
          </tr>
        </thead>
        <tbody>
          {filteredCountries.map((country) => (
            <tr key={country.name}>
              <td>{country.name}</td>
              <td>{country.region}</td>
              <td>{country.area}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default CountryList;
