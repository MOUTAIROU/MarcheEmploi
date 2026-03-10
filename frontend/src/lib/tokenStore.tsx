let _accessToken: string | null = null;
let _refreshToken: string | null = null;

export const tokenStore = {
  setTokens({ accessToken, refreshToken }: { accessToken?: string; refreshToken?: string }) {
    if (accessToken !== undefined) _accessToken = accessToken;
    if (refreshToken !== undefined) _refreshToken = refreshToken;
  },

  getAccessToken() {
    return _accessToken;
  },

  getRefreshToken() {
    return _refreshToken;
  }
};
