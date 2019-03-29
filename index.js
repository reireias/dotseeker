const axios = require('axios')
const path = require('path')
const fs = require('fs')

const SEARCH_URL = 'https://api.github.com/search/repositories'

const sleep = async t => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, t)
  })
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
  const res = await axios.get(treesUrl, { params: params })
  const targetFiles = res.data.tree.filter(item =>
    /^.*\.?(bashrc|bash_profile|zshrc|zsh_profile)/.test(item.path)
  )
  for (let file of targetFiles) {
    try {
      const saveFilePath = `files/${fullName}/${file.path}`
      const dir = path.dirname(saveFilePath)
      createDirectory(dir)
      const blobRes = await axios.get(file.url)
      // const blob = decode(blobRes.data.content)
      writeFile(saveFilePath, Buffer.from(blobRes.data.content, 'base64'))
    } catch (err) {
      console.error(err)
    }
    await sleep(1000)
  }
  return targetFiles.length
}

const main = async () => {
  const params = {
    q: 'topic:dotfiles',
    sort: 'stars',
    page: 1,
    per_page: 10
  }
  const headers = {
    Accept: 'application/vnd.github.mercy-preview+json'
  }
  console.info('search dotfiles topic repositories...')
  const res = await axios.get(SEARCH_URL, { headers: headers, params: params })
  console.info(`repositories: ${res.data.total_count}`)
  console.info(`target: top ${res.data.items.length} most stars repositories`)
  let count = 0
  for (let item of res.data.items) {
    const treesUrl = item.trees_url.replace('{/sha}', `/${item.default_branch}`)
    count += await searchFiles(treesUrl, item.full_name)
    await sleep(1000)
  }
  console.info(`saved files: ${count}`)
}
main().catch(e => console.error(e))
