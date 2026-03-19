import axios from "axios";
import { tokenStore } from "./tokenStore";

const api = axios.create({
  baseURL: process.env.SERVER_HOST,
  withCredentials: true,
});

// --- State interne ---
let isRefreshing = false;
let failedQueue: any[] = [];

// --- Process queue after refresh ---
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) promise.reject(error);
    else promise.resolve(token);
  });
  failedQueue = [];
};

// --- Interceptor REQUEST : Ajouter automatiquement accessToken ---
api.interceptors.request.use(
  config => {
    const token = tokenStore.getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// --- Interceptor RESPONSE ---
api.interceptors.response.use(
  response => response,

  async error => {
    const originalRequest = error.config;

    // --- Vérifier si c’est une erreur 401 et que ce n’est pas déjà en retry ---
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // --- Si un refresh est déjà en cours, placer la requête dans une queue ---
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // --- Récupérer refresh depuis tokenStore ---
        const refreshToken = tokenStore.getRefreshToken();

        if (!refreshToken) {
          processQueue("NO_REFRESH_TOKEN", null);
          return Promise.reject({
            response: {
              status: 401,
              data: {
                code: "AUTH_REQUIRED",
                message: "Connexion requise",
              },
            },
          });
        }


        // --- Appel refresh ---
        const r = await axios.post(
          `${process.env.SERVER_HOST}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const newAccessToken = r.data.accessToken;

        // --- METTRE À JOUR le tokenStore ---
        tokenStore.setTokens({ accessToken: newAccessToken });

        // --- Mise à jour axios defaults ---
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // --- Libérer la queue ---
        processQueue(null, newAccessToken);

        // --- Relancer la requête échouée ---
        return axios(originalRequest);

      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
