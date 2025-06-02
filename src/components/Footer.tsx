export const Footer = () => {
  return (
    <footer className="hidden border-t border-gray-200 bg-white py-4 md:block">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Modern Rift POS. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-600">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-600">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-600">
              Help
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}