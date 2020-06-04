const axios = require('axios')

const API_BASE = 'https://api.github.com'
const SEARCH_URL = `${API_BASE}/search/repositories`
const LIMIT_URL = `${API_BASE}/rate_limit`

module.exports = class GitHub {
  constructor(token) {
    this.token = token
    this.headers = { Authorization: `token ${this.token}` }
  }

  async search(params = {}) {
    const headers = {
      Authorization: `token ${this.token}`,
      Accept: 'application/vnd.github.mercy-preview+json',
    }
    const res = await axios.get(SEARCH_URL, {
      headers: headers,
      params: params,
    })
    return res.data
  }

  async tree(treesUrl, branch, params = {}) {
    const url = treesUrl.replace('{/sha}', `/${branch}`)
    const res = await axios.get(url, {
      headers: this.headers,
      params: params,
    })
    return res.data
  }

  async blob(url) {
    const res = await axios.get(url, { headers: this.headers })
    return res.data
  }

  async rateLimit() {
    const res = await axios.get(LIMIT_URL, { headers: this.headers })
    return res.data
  }
}
