import {fileURLToPath} from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const linkBuilder = (URL, parameters, hasNextPage, hasPrevPage, page) => {
    const ROOT_URL = `http://localhost:8080/${URL}?limit=${parameters.limit}`
    let finalURLString = ROOT_URL
    if (parameters.sort) {
        finalURLString += `&sort=${parameters.sort}`
    }
    if (parameters.queryField) {
        finalURLString += `&queryField=${parameters.queryField}`
    }
    if (parameters.queryVal) {
        finalURLString += `&queryField=${parameters.queryVal}`
    }

    const links = { prevLink: null, nextLink: null }
    if (hasPrevPage) {
        let prevPage = page - 1
        let prevPageURL = finalURLString
        prevPageURL += `&page=${prevPage}`
        links.prevLink = prevPageURL
    }
    if (hasNextPage) {
        let nextPage = page + 1
        let nextPageURL = finalURLString
        nextPageURL += `&page=${nextPage}`
        links.nextLink = nextPageURL
    }
    return links
}

export const sanitizeQueryParams = (parameters) => {

    const queryParameters = {}
    // limit
    let limitIsValid = parameters.limit && !isNaN(parameters.limit)
    if (limitIsValid) {
        queryParameters.limit = parseInt(parameters.limit)
    }
    else {
        const DEFAULT_LIMIT = 10
        queryParameters.limit = DEFAULT_LIMIT
    }
    // page
    let pageIsValid = parameters.page && !isNaN(parameters.page)
    if (pageIsValid) {
        queryParameters.pageNumber = parseInt(parameters.page)
    }
    else {
        const DEFAULT_PAGE = 1
        queryParameters.pageNumber = DEFAULT_PAGE
    }
    // sort
    let sortIsValid = parameters.sort && (parameters.sort == "asc" || parameters.sort == "desc")
    if (sortIsValid) {
        queryParameters.sort = parameters.sort
    }
    else {
        queryParameters.sort = null
    }
    // query
    let queryIsValid = parameters.queryField && parameters.queryField != "" && parameters.queryVal && parameters.queryVal != ""
    if (queryIsValid) {
        queryParameters.queryField = parameters.queryField
        queryParameters.queryVal = parameters.queryVal
    }
    else {
        queryParameters.queryField = null
        queryParameters.queryVal = null
    }

    return queryParameters
}