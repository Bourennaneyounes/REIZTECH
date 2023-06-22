import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CountryList = () => {
  const [countries, setCountries] = useState([]);

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

  return (
    <div>
      <h1>Country List</h1>
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
