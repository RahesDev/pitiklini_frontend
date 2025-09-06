import axios from './axios';
import { respChanges } from './responseModify';
import { env } from './envconfig';
const backendHost = env.apiHost

export const getMethod = async (data) => {
    try {
        
        let respData = await axios({
            'method': 'get',
            'url': backendHost+data.apiUrl
        });
        return respChanges(respData?.data);
    }
    catch (err) {
        return {
            status: 'error',
            message: err?.response?.data?.message,
            error: err?.response?.data?.errors
        }
    }
}

export const postMethod = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': backendHost+data.apiUrl,
            data: data.payload ? data.payload : {}
        });
        return respChanges(respData.data);
    }
    catch (err) {
        return {
            status: 'error',
           message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}
export const createcheck = async (data) => {
    try {
      let respData = await axios({
        method: "post",
        url: backendHost + data.apiUrl,
        data: {
          paymentAmount: data.paymentAmount || 0, // Pass as part of the request body
          currencySymbol: data.currencySymbol
        },
      });
      return respChanges(respData.data);
    } catch (err) {
      return {
        status: "error",
        message: err.response?.data?.message || "Unknown error occurred",
        error: err.response?.data?.errors || null,
      };
    }
  };
  
  export const updatePaymentStatus = async (data) => {
    try {
      // Ensure sessionId is sent as part of the request body
      const respData = await axios.post(`${backendHost}${data.apiUrl}`, {
        sessionId: data.sessionId || null, // Send sessionId in the request body
      });
  
      // Process the response data (assuming respChanges is a utility function)
      return respChanges(respData.data);
    } catch (err) {
      console.error("Error in updatePaymentStatus:", err.response?.data || err.message);
  
      return {
        status: "error",
        message: err.response?.data?.message || "An error occurred",
        error: err.response?.data?.errors || null,
      };
    }
  };
  
export const fileUpload = async (data) => {
    try {
        const config = {
            headers: {
              "content-type": "multipart/form-data",
            },
          };
        let respData = await axios({
            'method': 'post',
            'url': data.apiUrl,
            data: data.payload ? data.payload : {}
        });
        return respChanges(respData.data);
    }
    catch (err) {
        return {
            status: 'error',
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}

