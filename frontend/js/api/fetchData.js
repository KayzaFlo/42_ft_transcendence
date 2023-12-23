import { navigateTo } from "../router.js";
import { closeAllModals } from "../utils/utilityFunctions.js";
import interactiveSocket from '../pages/home/socket.js'

// Load frontend page.
export const loadHTMLPage = async (filePath) => {
    try {
        const response = await fetch(filePath);
        const html = await response.text();
        let container = document.getElementById('contentContainer')
        container.innerHTML = ''
        container.innerHTML = html
    } catch (error) {
        console.error(`Error fetching page: ${filePath} -> `, error);
    }
}

// Load frontend components
export const loadHTMLComponent = async (filePath) => {
    try {
        const response = await fetch(filePath);
        const html = await response.text();
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = html;
        return tempContainer.children.length === 1
            ? tempContainer.children[0]
            : tempContainer.children;
    } catch (error) {
        console.error(`Error fetching component: ${filePath} -> `, error);
    }
};

const redirectToHome = () => {
    closeAllModals();
    interactiveSocket.closeSocket()
    sessionStorage.clear();
    navigateTo('/');
    return null
};

const createOptions = (method, data) => {
    const accessTokenLive = sessionStorage.getItem('jwt');
    const isFormData = data instanceof FormData;
    const options = {
        method,
        credentials: 'include',
        headers: {
          ...(accessTokenLive ? { 'jwt': `${accessTokenLive}` } : {}),
          ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
        },
        body: isFormData ? data : (data ? JSON.stringify(data) : null),
    };
    return options
};

export const setNewToken = (response) => {
    const access_token = response.headers.get('jwt')
    if (access_token) {
        sessionStorage.setItem('jwt', access_token);
        return access_token
    }
    return null
}

const performFetch = async (url, method, data = null) => {
    console.log(url)
    const options = createOptions(method, data);
    try {
        let response = await fetch(url, options);
        if (response.status === 401) {
            return redirectToHome();
        }
        const jwt_token = setNewToken(response);
        if (jwt_token && !response.headers.get('new')) {
            options.headers.jwt = response.headers.get('jwt');
            response = await fetch(url, options);
        }
        return response;
    } catch (error) {
        console.error("Error fetching: " + url, error);
        return null;
    }
};

const buildParams = (parameters) => {
    const params = new URLSearchParams();
    if (parameters) {
        for (const [parameterName, parameterValue] of Object.entries(parameters)) {
            if (typeof parameterValue === 'object' && parameterValue !== null) {
                for (const value of Object.values(parameterValue)) {
                        params.append(parameterName, value);
                }
            } else if (parameterValue !== null && parameterValue !== undefined) {
                params.append(parameterName, parameterValue);
            }
        }
    }
    return params.toString();
};

const buildApiUrl = (path, parameters = null) => {
    const baseUrl = "/api/";
    const paramString = buildParams(parameters);
    const queryString = paramString ? `?${paramString}` : '';
    return `${baseUrl}${path}${queryString}`;
};

export const fetchApi = async (method, path, parameters = null, data = null) => {
    const url = buildApiUrl(path, parameters);
    return await performFetch(url, method, data);
};

// Fetch other user by nickname or by status/Create user/update user by nickname.
export const fetchUser = async (method, parameters = null, data = null) => {
    return fetchApi(method, 'user/', parameters, data);
};

// Fetch login/logout/check if token
export const fetchAuth = async (method, apiPath, data = null) => {
    return fetchApi(method, `auth/${apiPath}`, null, data);
};

// Fetch own information (username, email, avatar, status, match history)
export const fetchMe = async(method, data = null) => {
    return fetchApi(method, 'user/me/', null, data);
};

// Get friend list.
export const fetchFriend = async (method, apiPath = '', data = null) => {
    return fetchApi(method, `user/friends/${apiPath}`, null, data);
};

// Upload avatar
export const fetchUpload = async (method, data = null) => {
    return fetchApi(method, 'user/upload/', null, data);
};

// Change friend status (add, remove, etc.)
export const fetchFriendChange = async (method, parameters = null, apiPath = '') => {
    return fetchApi(method, `friend/${apiPath}`, parameters);
};

// Fetch match history
export const fetchMatchHistory = async (method, data = null) => {
    return fetchApi(method, 'match/', null, data);
};

