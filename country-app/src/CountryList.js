import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');

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

  const sortCountries = () => {
    const sortedCountries = [...countries].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setCountries(sortedCountries);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    sortCountries()
};

  return (
    <div>
      <h1>Country List</h1>
      <button onClick={toggleSortOrder}>
        Sort by Name ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </button>
      <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Region</th>
            <th>Area</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => (
            <tr key={country.name}>
              <td>{country.name}</td>
              <td>{country.region}</td>
              <td>{country.area}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CountryList;
