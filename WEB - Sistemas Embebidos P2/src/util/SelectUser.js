import React from 'react';

const SelectUser = ({ setCurrentMenu, setCurrentUser}) => {
    const handleAdminClick = () => {
        setCurrentMenu('index');
        setCurrentUser('admin');
    }

    const handleUserClick = () => {
        setCurrentMenu('index');
        setCurrentUser('user');
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
         <div className="w-full mx-auto py-16">

           <div className="w-1/4 h-2/4 mx-auto">
             <div className="px-2 py-4 my-3 shadow rounded-md">
             <h1 className="text-3xl text-center font-bold mb-6 text-white capitalize">
              Select user role
            </h1>
               <ul className="flex flex-row justify-center items-center space-x-2">
                 <li>
                   <div
                     onClick={handleAdminClick}
                     className="flex items-center px-12 py-6 text-base font-normal text-gray-900 rounded-lg dark:text-white bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                      <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                    </svg>
                     <span className="ml-3">Admin Role</span>
                   </div>
                 </li>
                 <li>
                 <div
                     onClick={handleUserClick}
                     className="flex items-center px-12 py-6 text-base font-normal text-gray-900 rounded-lg dark:text-white bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                      </svg>
                     <span className="ml-3">User Role</span>
                   </div>
                 </li>
               </ul>
             </div>
           </div>
         </div>
        </div>
    );
};
export default SelectUser