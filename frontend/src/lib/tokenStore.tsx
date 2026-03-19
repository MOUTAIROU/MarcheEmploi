let _accessToken: string | null = null;
let _refreshToken: string | null = null;

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export const tokenStore = {

  setTokens({ accessToken, refreshToken }: { accessToken?: string; refreshToken?: string }) {

    if (typeof window !== "undefined") {

      if (accessToken !== undefined) {
        _accessToken = accessToken;
        localStorage.setItem(ACCESS_KEY, accessToken);
      }

      if (refreshToken !== undefined) {
        _refreshToken = refreshToken;
        localStorage.setItem(REFRESH_KEY, refreshToken);
      }

    }
  },

  getAccessToken() {

    if (!_accessToken && typeof window !== "undefined") {
      _accessToken = localStorage.getItem(ACCESS_KEY);
    }

    return _accessToken;
  },

  getRefreshToken() {

    if (!_refreshToken && typeof window !== "undefined") {
      _refreshToken = localStorage.getItem(REFRESH_KEY);
    }

    return _refreshToken;
  },

  clear() {
    _accessToken = null;
    _refreshToken = null;

    if (typeof window !== "undefined") {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
    }
  }

};