import Axios from 'axios';

export const getAccessToken = params => {
    const headers = {
        'Content-Type': 'application/json; charset=utf-8'
    }
    return Axios.get('/open-apis/auth/v3/app_access_token/internal/', { params, headers });
}

export const sendMsgCard = (params, headers) => {
    return Axios.post('/open-apis/message/v4/send/', params, { headers })
}