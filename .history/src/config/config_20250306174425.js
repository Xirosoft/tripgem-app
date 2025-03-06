export default {
  apiUrl: 'http://akerio.local/wp-json/tripgem/v1',
  token:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxfQ.RnLvERAhsRVZfHSx-PObptsAbqHD2VVkf3LikxyRPsk',

  // Add headers configuration
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: this.token ? `Bearer ${this.token}` : '',
    }
  },
}
