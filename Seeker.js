const path = require('path')
const fs = require('fs')
const GitHub = require('./GitHub.js')

const TREE_SEARCH_LIMIT = 100

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

module.exports = class Seeker {
  constructor(options = {}) {
    this.q = options.q === undefined ? 'topic:dotfiles' : options.q
    this.sort = options.sort === undefined ? 'stars' : options.sort
    this.page = options.page === undefined ? 1 : options.page
    this.perPage = options.perPage === undefined ? 10 : options.perPage
    this.filenamePattern =
      options.filenamePattern === undefined
        ? /^.*\.?(bashrc|bash_profile|zshrc|zsh_profile)/
        : options.filenamePattern
    this.gh = new GitHub(process.env.GITHUB_API_TOKEN)
  }

  async seek() {
    console.info('search dotfiles topic repositories...')
    const start = this.perPage * (this.page - 1) + 1
    const end = this.perPage * this.page
    console.info(`target: top ${start} to ${end}`)

    const repositories = await this._searchRepository()
    console.info(`repositories: ${repositories.total_count}`)

    let count = 0
    for (const repository of repositories.items) {
      count += await this._downloadFiles(repository)
    }
    console.info(`saved files: ${count}`)

    console.info('limit rate info:')
    console.info(await this.gh.rateLimit())
  }

  async _searchRepository() {
    return this.gh.search({
      q: this.q,
      sort: this.sort,
      page: this.page,
      per_page: this.perPage
    })
  }

  async _downloadFiles(repository) {
    const params = {
      recursive: 1,
      type: 'blob',
      page: 1,
      per_page: TREE_SEARCH_LIMIT
    }
    const treeData = await this.gh.tree(
      repository.trees_url,
      repository.default_branch,
      params
    )
    const targets = treeData.tree.filter(item =>
      this.filenamePattern.test(item.path)
    )
    let count = 0
    for (const target of targets) {
      try {
        await this._download(target, repository.full_name)
        count += 1
      } catch (err) {
        console.error(err)
      }
    }
    return count
  }

  async _download(target, repositoryName) {
    const saveFilePath = `files/${repositoryName}/${target.path}`
    const dir = path.dirname(saveFilePath)
    createDirectory(dir)
    const blob = await this.gh.blob(target.url)
    writeFile(saveFilePath, Buffer.from(blob.content, 'base64'))
  }
}
