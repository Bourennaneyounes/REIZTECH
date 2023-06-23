import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CountryList.css';

interface Country {
  name: string;
  region: string;
  area: number;
}

interface FilterOptions {
  smallerThanLithuania: boolean;
  inOceaniaRegion: boolean;
}

const CountryList: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    smallerThanLithuania: false,
    inOceaniaRegion: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      filtered = filtered.filter((country) => country.area <(lithuania?.area || 0));
    }
  
    if (filterOptions.inOceaniaRegion) {
      filtered = filtered.filter((country) => country.region === 'Oceania');
    }
  
    setFilteredCountries(filtered);
    setCurrentPage(1); // Reset to the first page when filters change
  };
  

  const handleFilterChange = (filterName) => {
    // Update the filter options based on div click
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      [filterName]: !prevOptions[filterName],
    }));
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredCountries.length / itemsPerPage);
  };

  const paginatedCountries = filteredCountries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

 
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
        {paginatedCountries.map((country) => (
          <div className="country-item" key={country.name}>
            <div><strong>Country:</strong> {country.name}</div>
            <div><strong>Region:</strong> {country.region}</div>
            <div><strong>Area:</strong> {country.area}</div>
          </div>
        ))}
      </div>
      <div>
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>{currentPage}</span>
        <button
          disabled={currentPage === getTotalPages()}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CountryList;
