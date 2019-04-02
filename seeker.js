const axios = require('axios')
const path = require('path')
const fs = require('fs')

const API_BASE = 'https://api.github.com'
const LIMIT_URL = `${API_BASE}/rate_limit`
const SEARCH_URL = `${API_BASE}/search/repositories`

const addTokenHeader = options => {
  if (!options) {
    options = {}
  }

  if (process.env.GITHUB_API_TOKEN) {
    if (!options.headers) {
      options.headers = {}
    }
    options.headers.Authorization = `token ${process.env.GITHUB_API_TOKEN}`
  }
  return options
}

const get = async (url, options) => {
  options = addTokenHeader(options)
  const res = await axios.get(url, options)
  return res
}

const exist = path => {
  try {
    fs.statSync(path)
    return true
  } catch (err) {
    return false
  }
}

const createDirectory = path => {
  if (!exist(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
}

const writeFile = (path, buffer) => {
  if (!exist(path)) {
    fs.writeFileSync(path, buffer)
  }
}

const searchFiles = async (treesUrl, fullName) => {
  const params = {
    recursive: 1,
    page: 1,
    per_page: 100
  }
  const res = await get(treesUrl, { params: params })
  const targetFiles = res.data.tree.filter(item =>
    /^.*\.?(bashrc|bash_profile|zshrc|zsh_profile)/.test(item.path)
  )
  for (let file of targetFiles) {
    try {
      const saveFilePath = `files/${fullName}/${file.path}`
      const dir = path.dirname(saveFilePath)
      createDirectory(dir)
      const blobRes = await get(file.url)
      // const blob = decode(blobRes.data.content)
      writeFile(saveFilePath, Buffer.from(blobRes.data.content, 'base64'))
    } catch (err) {
      console.error(err)
    }
  }
  return targetFiles.length
}

const rateLimit = async () => {
  const res = await get(LIMIT_URL, {})
  return res.data
}

const seek = async () => {
  const params = {
    q: 'topic:dotfiles',
    sort: 'stars',
    page: 2,
    per_page: 100
  }
  const headers = {
    Accept: 'application/vnd.github.mercy-preview+json'
  }
  console.info('search dotfiles topic repositories...')
  const res = await get(SEARCH_URL, { headers: headers, params: params })
  console.info(`repositories: ${res.data.total_count}`)
  console.info(
    `target: top ${params.per_page * (params.page - 1) +
      1} to ${params.per_page * params.page}`
  )
  let count = 0
  for (let item of res.data.items) {
    const treesUrl = item.trees_url.replace('{/sha}', `/${item.default_branch}`)
    count += await searchFiles(treesUrl, item.full_name)
  }
  console.info(`saved files: ${count}`)
  console.log(await rateLimit())
}

module.exports = {
  seek
}
