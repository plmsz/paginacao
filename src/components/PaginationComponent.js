import './styles.css';
import { useState, useEffect } from 'react'

const renderData = data => {
    return (
        <ul>
            {data.map((todo, index) => {
                return <li key={index}>{todo.id} - {todo.title}</li>
            })}
        </ul>
    )
}

function PaginationComponent() {
    const [data, setData] = useState([])
    const [currentPage, setcurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    const [pageNumberLimit, setpageNumberLimit] = useState(5)
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5)
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0)
    
    const handleClick = (event) => {
        setcurrentPage(Number(event.target.id));
      };
    

    const pages = []

    for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
        pages.push(i)
    }

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)

    const renderPageNumbers = pages.map(number => {
        if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
            return (
                <li key={number}
                    id={number}
                    onClick={handleClick}
                    className={currentPage === number ? "active" : null}
                >
                    {number}
                </li>
            )
        } else {
            return null
        }
    })
    useEffect(() => (
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then((response) => response.json())
            .then((json) => setData(json))
    ), [])

    const handleNextBtn = () => {
        setcurrentPage(currentPage + 1)
        if (currentPage + 1 > maxPageNumberLimit + pageNumberLimit) {
            setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit + pageNumberLimit)
        }
    }
    const handlePrevBtn = () => {
        setcurrentPage(currentPage - 1)
        if ((currentPage - 1) % pageNumberLimit === 0) {
            setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit - pageNumberLimit)
        }
    }

    let pageIncrementBtn = null;
    if(pages.length > maxPageNumberLimit){
        pageIncrementBtn= <li onClick={handleNextBtn}> &hellip; </li>
    }
    let pageDecrementBtn = null;
    if(minPageNumberLimit >= 1){
        pageDecrementBtn= <li onClick={handlePrevBtn}> &hellip; </li>
    }

    return (
        <>
            <h1>Todo list</h1>
            <ul className='pageNumbers'>
                <li onClick={handlePrevBtn}>
                    <button disabled={currentItems === pages[0] ? true :false}> &lArr; </button>
                    
                </li>
                {pageDecrementBtn}
                {renderPageNumbers}
                {pageIncrementBtn}
                <li onClick={handleNextBtn}>
                    <button disabled={currentItems === pages[pages.length-1] ? true :false}> &rArr; </button>
                    
                </li>
            </ul>
            {renderData(currentItems)}
        </>
    );
}

export default PaginationComponent;