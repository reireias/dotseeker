const path = require('path')
const fs = require('fs')
const GitHub = require('./GitHub.js')

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
    this.gh = new GitHub(process.env.GITHUB_API_TOKEN)
  }

  async seek() {
    console.info('search dotfiles topic repositories...')
    const data = await this.gh.search({
      q: this.q,
      sort: this.sort,
      page: this.page,
      per_page: this.perPage
    })

    console.info(`repositories: ${data.total_count}`)
    console.info(
      `target: top ${this.perPage * (this.page - 1) + 1} to ${this.perPage *
        this.page}`
    )
    let count = 0
    const params = {
      recursive: 1,
      type: 'blob',
      page: 1,
      per_page: 100
    }
    for (let item of data.items) {
      const data = await this.gh.tree(
        item.trees_url,
        item.default_branch,
        params
      )
      count += await this._searchFiles(data.tree, item.full_name)
    }
    console.info(`saved files: ${count}`)
    console.info('limit rate info:')
    console.info(await this.gh.rateLimit())
  }

  async _searchFiles(tree, fullName) {
    const targetFiles = tree.filter(item =>
      /^.*\.?(bashrc|bash_profile|zshrc|zsh_profile)/.test(item.path)
    )
    for (let file of targetFiles) {
      try {
        const saveFilePath = `files/${fullName}/${file.path}`
        const dir = path.dirname(saveFilePath)
        createDirectory(dir)
        const blob = await this.gh.blob(file.url)
        writeFile(saveFilePath, Buffer.from(blob.content, 'base64'))
      } catch (err) {
        console.error(err)
      }
    }
    return targetFiles.length
  }
}
