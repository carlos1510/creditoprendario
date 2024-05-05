import * as React from 'react';
import './style.css';

function Pagination({perPage, currentPage, totalPage, setCurrentPage}){
    
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(totalPage / perPage); i++){
        pageNumbers.push(i);
    }

    const onPreviusPage = () => {
        setCurrentPage(currentPage - 1);
    }

    const onNextPage = () => {
        setCurrentPage(currentPage + 1);
    }

    const onSpecificPage = (n) => {
        setCurrentPage(n);
    }

    return (
        <>
            <div className="flex justify-center pt-4">
                <nav className="flex space-x-2" aria-label="Pagination">
                    <button type='button' 
                        className={`relative inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-violet-300 to-indigo-300 border border-fuchsia-100 hover:border-violet-100 text-white font-semibold cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 ${ currentPage === 1 ? 'is-disabled' : '' }` } 
                        disabled={currentPage === 1 ? true : false}
                        onClick={onPreviusPage}>
                        Anterior
                    </button>
                    {
                        pageNumbers.map((noPage) => (
                            <a 
                                key={noPage} 
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-fuchsia-100 hover:bg-fuchsia-200 cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 ${noPage === currentPage ? 'is-current': ''}`} 
                                onClick={() => onSpecificPage(noPage)}>
                                {noPage}
                            </a>
                        ))
                    }
                    <button type='button' 
                        className={`relative inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-violet-300 to-indigo-300 border border-fuchsia-100 hover:border-violet-100 text-white font-semibold cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 ${ currentPage >= pageNumbers.length ? 'is-disabled' : ''}`} 
                        disabled={ currentPage >= pageNumbers.length ? true : false}
                        onClick={onNextPage}>
                        Siguiente
                    </button>
                </nav>
            </div>
        </>
    );
}

export default Pagination;