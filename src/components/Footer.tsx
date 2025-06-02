export const Footer = () => {
  return (
    <footer className="hidden md:block bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Modern Rift POS. All rights reserved.
            </p>
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">System Online</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <a 
              href="#" 
              className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-sm text-gray-500 hover:text-orange-500 transition-colors duration-200 font-medium"
            >
              Get Help
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}