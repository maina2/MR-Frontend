import { FiSearch, FiUser, FiX, FiLogOut } from 'react-icons/fi';
import { useCallback, useState, useEffect, useRef } from 'react';
import { ModernRiftLogo } from './ModernRiftLogo';
import { useNavigate } from 'react-router-dom';
import { useGetGlobalSearchQuery } from '../api/apiSlice';
import SearchResults from './SearchResults';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: searchData, isLoading, isError, error } = useGetGlobalSearchQuery(
    { q: searchQuery },
    { skip: !searchQuery || searchQuery.trim().length < 2 }
  );

  useEffect(() => {
    if (isError) {
      const errorMessage =
        (error as { data?: { detail?: string } })?.data?.detail || 'Search failed.';
      toast.error(errorMessage);
    }
  }, [isError, error]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = debounce((value: string) => {
    setSearchQuery(value);
    setIsSearchOpen(value.trim().length >= 2);
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleSearchChange(value);
  };

  const handleResultClick = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
    setShowMobileSearch(false);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const handleProfileClick = useCallback(() => {
    console.log('Navigating to User Profile page');
    navigate('/profile');
  }, [navigate]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="h-14 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <ModernRiftLogo className="h-8 transition-transform duration-300 hover:scale-105" />
              <span className="ml-2 text-lg font-bold text-gray-800 hidden sm:block">
                Modern Rift
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative" ref={searchRef}>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="h-5 w-5 text-orange-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => searchQuery.trim().length >= 2 && setIsSearchOpen(true)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm"
                placeholder="Search deliveries..."
              />
              {isSearchOpen && !isLoading && searchData && (
                <SearchResults results={searchData.results} onResultClick={handleResultClick} />
              )}
              {isSearchOpen && isLoading && (
                <div className="absolute z-50 w-full max-w-md bg-white shadow-lg rounded-lg mt-1 p-4">
                  <div className="animate-pulse text-gray-600">Searching...</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-orange-500 hover:bg-gray-50 transition-all duration-200"
            >
              {showMobileSearch ? <FiX className="h-5 w-5" /> : <FiSearch className="h-5 w-5" />}
            </button>

            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 p-2 rounded-lg text-gray-600 hover:text-orange-500 hover:bg-gray-50 transition-all duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <FiUser className="h-4 w-4 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium">Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="md:hidden p-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
            >
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {showMobileSearch && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-4 pt-4" ref={searchRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="h-5 w-5 text-orange-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => searchQuery.trim().length >= 2 && setIsSearchOpen(true)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all duration-200"
                placeholder="Search deliveries..."
                autoFocus
              />
              {isSearchOpen && !isLoading && searchData && (
                <SearchResults results={searchData.results} onResultClick={handleResultClick} />
              )}
              {isSearchOpen && isLoading && (
                <div className="absolute z-50 w-full max-w-md bg-white shadow-lg rounded-lg mt-1 p-4">
                  <div className="animate-pulse text-gray-600">Searching...</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};