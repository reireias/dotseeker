const axios = require('axios')

const SEARCH_URL = 'https://api.github.com/search/repositories'

const sleep = async t => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, t)
  })
}

const searchFiles = async treesUrl => {
  const params = {
    recursive: 1,
    page: 1,
    per_page: 100
  }
  const res = await axios.get(treesUrl, { params: params })
  const targetFiles = res.data.tree.filter(item =>
    /^.*\.?(bashrc|bash_profile)/.test(item.path)
  )
  for (let file of targetFiles) {
    const blobRes = await axios.get(file.url)
    console.info(blobRes.data.content)
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
  const res = await axios.get(SEARCH_URL, { headers: headers, params: params })
  console.info(res.data.total_count)
  console.info(res.data.items.length)
  let count = 0
  for (let item of res.data.items) {
    const treesUrl = item.trees_url.replace('{/sha}', '/master')
    count += await searchFiles(treesUrl)
    await sleep(1000)
  }
  console.info(count)
}
main().catch(e => console.error(e))
