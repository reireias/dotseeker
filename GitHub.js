const axios = require('axios')

const API_BASE = 'https://api.github.com'
const SEARCH_URL = `${API_BASE}/search/repositories`

module.exports = class GitHub {
  constructor(token) {
    this.token = token
  }

  async search(params = {}) {
    const headers = {
      Authorization: `token ${this.token}`,
      Accept: 'application/vnd.github.mercy-preview+json'
    }
    const res = await axios.get(SEARCH_URL, {
      headers: headers,
      params: params
    })
    return res.data
  }
}
