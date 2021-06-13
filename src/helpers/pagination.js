const paginateArray = (array, page_size, page_number) => {
    page_size = parseInt(page_size)
    page_number = parseInt(page_number)
    console.log(page_number)
    return array.slice((parseInt(page_number)*parseInt(page_size)),  parseInt(parseInt(page_number)+1) * parseInt(page_size));
}

export default paginateArray;