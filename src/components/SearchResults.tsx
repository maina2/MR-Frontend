import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { SearchResult } from '../types/Search';

interface SearchResultsProps {
  results: SearchResult[];
  onResultClick: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onResultClick }) => {
  const navigate = useNavigate();

  return (
    <div className="absolute z-50 w-full max-w-md bg-white shadow-lg rounded-lg mt-1 max-h-96 overflow-y-auto border border-gray-100">
      {results.length === 0 ? (
        <div className="p-4 text-gray-600 text-center">
          <div className="text-2xl mb-2 opacity-50">🔍</div>
          <p className="font-medium">No results found</p>
        </div>
      ) : (
        results.map((result) => (
          <div
            key={`${result.type}-${result.id}`}
            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all duration-200"
            onClick={() => {
              navigate(`/deliveries/${result.id}`);
              onResultClick();
            }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{result.parcel_id}</p>
                <p className="text-sm text-gray-600">{result.customer_name}</p>
                <p className="text-sm text-gray-500">{result.delivery_city}</p>
              </div>
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                {result.type}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchResults;