import React from 'react'
import { Link, useNavigate } from 'react-router-dom';


const Footbar = () => {
  const navigate = useNavigate()
  return (
   <footer className="bg-gray-800 text-white p-6 mt-12">
      <div className="container mx-auto text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Lux Perfumes. All rights reserved.</p>
        <p className="text-sm mt-2">Designed with passion and fine fragrances.</p>                   
      </div>
    </footer>
  );
};


export default Footbar