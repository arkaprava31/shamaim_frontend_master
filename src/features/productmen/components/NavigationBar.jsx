import React, { useState, useEffect } from 'react';
import { Popover } from '@headlessui/react';
import { Link, useLocation } from 'react-router-dom';

const NavigationBar = () => {
  const location = useLocation();
  const currentSection = location.pathname.split('/')[1];

  const [toggle, setToggle] = useState("");

  useEffect(() => {
    const currentPath = location.pathname.split('/')[3];
    setToggle(currentPath);
  }, [location]);

  console.log(toggle);

  function handleToggle(data) {
    setToggle(data);
  }

  return (
    <header className="w-full bg-white mt-6 py-2 rounded-t-3xl sticky top-16 z-10">
      <div className="w-full flex justify-between ">
        <Popover.Group className="w-[100%] flex lg:gap-x-12 justify-around">
          {currentSection === "men" && (
            <>
              <div onClick={() => handleToggle('crewneck')}>
                <Link to="/men/hoodies/crewneck" className="text-lg leading-6 font-medium cursor-pointer text-[#5A5757]">
                  <div className={`py-2 px-6 rounded-xl ${toggle === 'crewneck' ? 'bg-orange-200' : ''}`}>Crew Neck</div>
                </Link>
              </div>
              <div onClick={() => handleToggle('oversized')}>
                <Link to="/men/hoodies/oversized" className="text-lg leading-6 font-medium cursor-pointer text-[#5A5757]">
                  <div className={`py-2 px-6 rounded-xl ${toggle === 'oversized' ? 'bg-orange-200' : ''}`}>Oversized</div>
                </Link>
              </div>
            </>
          )}
          {currentSection === "women" && (
            <>
              <div onClick={() => handleToggle('crewneck')}>
                <Link to="/women/hoodies/crewneck" className="text-lg leading-6 font-medium cursor-pointer text-[#5A5757]">
                  <div className={`py-3 px-6 rounded-xl ${toggle === 'crewneck' ? 'bg-orange-200' : ''}`}>Crew Neck</div>
                </Link>
              </div>
              <div onClick={() => handleToggle('oversized')}>
                <Link to="/women/hoodies/oversized" className="text-lg leading-6 font-medium cursor-pointer text-[#5A5757]">
                  <div className={`py-3 px-6 rounded-xl ${toggle === 'oversized' ? 'bg-orange-200' : ''}`}>Oversized</div>
                </Link>
              </div>
            </>
          )}
        </Popover.Group>
        <div className="lg:flex lg:flex-1 lg:justify-end"></div>
      </div>
    </header>
  );
};

export default NavigationBar;
