import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-100 py-3 px-4 mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-row justify-center items-center overflow-x-auto whitespace-nowrap">
          <p className="text-gray-600 text-xs sm:text-sm">
            © 2025 Library Management System. All rights reserved. 
            <span className="mx-1 sm:mx-2">|</span> 
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <span className="mx-1 sm:mx-2">|</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <span className="mx-1 sm:mx-2">|</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;