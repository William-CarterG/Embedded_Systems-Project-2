import React, { useState, useEffect } from 'react';

const IndexPage = () => {
  // Fake data to fill the container information
  const containerData = [
    { id: 1, available: false, document: 'Document Nº1', dateStored: '01/09/2022' },
    { id: 2, available: false, document: 'Document Nº2', dateStored: '01/09/2022' },
    { id: 3, available: false, document: 'Document Nº3', dateStored: '23/05/2023' },
  ];
  const [containers, setContainers] = useState(containerData);
  useEffect(() => {
    const updatedContainers = containers.map(container => {
      const localStorageKey = `box-${container.id}`;
      const storedValue = localStorage.getItem(localStorageKey);
      const isAvailable = storedValue === '' || storedValue === null;
      return {
        ...container,
        available: isAvailable,
      };
    });
    setContainers(updatedContainers);
  }, []);

  
  return (
    <div className="container mx-auto px-5 py-10">
      <div className="-m-4 flex flex-wrap">
        {containers.map(container => (
          <div className="w-full p-4 md:w-1/2 lg:w-1/3" key={container.id}>
            <div className={`text-white relative block h-48 overflow-hidden rounded ${container.available ? 'bg-green-500' : 'bg-red-500'} flex flex-col justify-center items-center text-center`}>
              <h2 className="text-3xl font-bold">Container Nº{container.id}</h2>
              <p className="text-xl">{container.available ? 'Available' : 'Not Available'}</p>
            </div>
            <div className="mt-4">
              <h3 className="title-font mb-1 text-xs tracking-widest text-black">DOCUMENT</h3>
              <h2 className="title-font text-lg font-medium text-gray-900">{container.document}</h2>
              {container.available ? null : <p className="mt-1">Date Stored: {container.dateStored}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default IndexPage;
