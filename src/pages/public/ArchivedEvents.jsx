import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaEye, FaSort, FaSortUp, FaSortDown, FaFilter } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import archivedEventsService from '../../services/archivedEventsService';
import { ArchivedEventsListSkeleton } from '../../components/LoadingSkeletons';
import { showToast } from '../../components/Toast';
import { scrollToTop } from '../../utils/scrollUtils';

const ArchivedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [yearsLoading, setYearsLoading] = useState(true);
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch available years on component mount
  useEffect(() => {
    fetchAvailableYears();
  }, []);

  // Fetch events when filters change
  useEffect(() => {
    console.log('ArchivedEvents useEffect triggered. sortBy:', sortBy, 'selectedYear:', selectedYear, 'searchQuery:', searchQuery);
    fetchArchivedEvents();
  }, [sortBy, selectedYear, searchQuery]);

  const fetchAvailableYears = async () => {
    try {
      setYearsLoading(true);
      const years = await archivedEventsService.getAvailableYears();
      console.log('Fetched available years:', years);
      
      // Ensure we have a valid array
      if (Array.isArray(years)) {
        setAvailableYears(years);
      } else {
        console.warn('Invalid years data format:', years);
        setAvailableYears([]);
      }
    } catch (err) {
      console.error('Error fetching available years:', err);
      setAvailableYears([]);
      // Don't show error toast for years - not critical
    } finally {
      setYearsLoading(false);
    }
  };

  const fetchArchivedEvents = async () => {
    try {
      setLoading(true);
      const params = {
        sortBy,
        ...(selectedYear && { year: selectedYear }),
        ...(searchQuery.trim() && { search: searchQuery.trim() })
      };
      
      console.log('Fetching events with params:', params);
      const data = await archivedEventsService.getAll(params);
      console.log('Received events data:', data?.length, 'events');
      
      setEvents(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching archived events:', err);
      setError('Failed to load archived events. Please try again later.');
      setEvents([]);
      showToast('Failed to load archived events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedYear('');
    setSortBy('date_desc');
  };

  const getSortIcon = (sortType) => {
    if (sortBy !== sortType) return <FaSort className="w-3 h-3 opacity-50" />;
    return sortBy.includes('_asc') ? <FaSortUp className="w-3 h-3" /> : <FaSortDown className="w-3 h-3" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Date not available';
    }
  };

  const handleViewDetailsClick = () => {
    scrollToTop();
  };

  const getResultsText = () => {
    if (loading) return '';
    
    const totalEvents = events.length;
    let filterText = '';
    
    if (selectedYear) filterText += `from ${selectedYear}`;
    if (searchQuery.trim()) {
      filterText += `${filterText ? ' ' : ''}matching "${searchQuery.trim()}"`;
    }
    
    if (filterText) {
      return `Found ${totalEvents} event${totalEvents !== 1 ? 's' : ''} ${filterText}`;
    }
    
    return `Showing ${totalEvents} event${totalEvents !== 1 ? 's' : ''}`;
  };

  if (loading && events.length === 0) {
    return <ArchivedEventsListSkeleton />;
  }

  return (
    <>
      <Helmet>
        <title>Archived Events | Chinmaya Mission Vasai</title>
        <meta name="description" content="Browse our collection of past spiritual events, workshops, and community gatherings at Chinmaya Mission Vasai. Relive the memorable moments and sacred celebrations." />
        <meta name="keywords" content="archived events, past events, Chinmaya Mission Vasai, spiritual gatherings, workshops, celebrations" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Archived Events
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our collection of past spiritual events, workshops, and community gatherings. 
              Relive the sacred moments and celebrations that have enriched our spiritual journey.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Enhanced Search and Filter Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search events by title, description, location..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              
              {/* Filter Toggle Button for Mobile */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden inline-flex items-center px-4 py-3 bg-[#BC3612] dark:bg-[#F47930] text-white rounded-lg hover:bg-[#ff725e] transition-colors"
              >
                <FaFilter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>

            {/* Filters Row */}
            <div className={`flex flex-col md:flex-row gap-4 ${showFilters ? 'block' : 'hidden md:flex'}`}>
              {/* Year Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Year
                </label>
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  disabled={yearsLoading}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                >
                  <option value="">All Years</option>
                  {availableYears
                    .filter(yearData => yearData.year !== null && yearData.year !== undefined)
                    .map((yearData) => (
                      <option key={yearData.year} value={yearData.year}>
                        {yearData.year} ({yearData.count} event{yearData.count !== 1 ? 's' : ''})
                      </option>
                    ))}
                </select>
              </div>

              {/* Sort Options */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort by
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'date_desc', label: 'Newest First', icon: 'date' },
                    { value: 'date_asc', label: 'Oldest First', icon: 'date' },
                    { value: 'title_asc', label: 'A-Z', icon: 'title' },
                    { value: 'title_desc', label: 'Z-A', icon: 'title' }
                  ].map(({ value, label, icon }) => (
                    <button
                      key={value}
                      onClick={() => handleSortChange(value)}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        sortBy === value
                          ? 'bg-[#BC3612] dark:bg-[#F47930] text-white'
                          : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                      }`}
                    >
                      {getSortIcon(value)}
                      <span className="ml-1">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedYear || sortBy !== 'date_desc') && (
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-center mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              {getResultsText()}
            </p>
            {loading && events.length > 0 && (
              <div className="inline-flex items-center mt-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#BC3612] dark:border-[#F47930] mr-2"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Updating results...</span>
              </div>
            )}
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg max-w-md mx-auto">
                <p>{error}</p>
                <button
                  onClick={fetchArchivedEvents}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Events Grid */}
          {!error && (
            <>
              {events.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 dark:text-gray-400">
                    {searchQuery || selectedYear ? (
                      <>
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-xl mb-2">No events found</p>
                        <p className="mb-4">
                          {searchQuery && selectedYear
                            ? `No events found matching "${searchQuery}" in ${selectedYear}`
                            : searchQuery
                            ? `No events found matching "${searchQuery}"`
                            : `No events found for ${selectedYear}`
                          }
                        </p>
                        <button
                          onClick={clearFilters}
                          className="inline-flex items-center px-4 py-2 bg-[#BC3612] dark:bg-[#F47930] hover:bg-[#ff725e] dark:hover:bg-[#ff725e] text-white rounded-lg transition-colors"
                        >
                          Clear Filters
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="text-6xl mb-4">📅</div>
                        <p className="text-xl mb-2">No archived events available</p>
                        <p>Check back later for event archives</p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <div
                      key={event._id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      {/* Event Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={event.coverImage || '/images/default-event.jpg'}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white font-semibold text-lg line-clamp-2">
                            {event.title}
                          </h3>
                        </div>
                        
                        {/* Year Badge */}
                        {event.year && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium">
                              {event.year}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Event Content */}
                      <div className="p-6">
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                          {event.description}
                        </p>

                        {/* Event Details */}
                        <div className="space-y-2 mb-4">
                          {event.date && (
                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                              <FaCalendarAlt className="w-4 h-4 mr-2 text-[#BC3612] dark:text-[#F47930]" />
                              {formatDate(event.date)}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                              <FaMapMarkerAlt className="w-4 h-4 mr-2 text-[#BC3612] dark:text-[#F47930]" />
                              {event.location}
                            </div>
                          )}
                        </div>

                        {/* View Details Button */}
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {event.images?.length || 0} photo{(event.images?.length || 0) !== 1 ? 's' : ''}
                          </div>
                          <Link
                            to={`/archived-events/${event._id}`}
                            onClick={handleViewDetailsClick}
                            className="inline-flex items-center px-4 py-2 bg-[#BC3612] dark:bg-[#F47930] hover:bg-[#ff725e] dark:hover:bg-[#ff725e] text-white text-sm font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930]"
                            aria-label={`View details for ${event.title}`}
                          >
                            <FaEye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ArchivedEvents;
