const fs = require('fs')
const rimraf = require('rimraf')
const Seeker = require('../Seeker')
const GitHub = require('../GitHub')

const exist = path => {
  try {
    fs.statSync(path)
    return true
  } catch (err) {
    return false
  }
}

jest.mock('../GitHub')
const blobMock = jest.fn(() => {
  // content = base64 encoded 'Hello World'
  return { content: 'SGVsbG8gV29ybGQ=' }
})
GitHub.mockImplementation(() => {
  return {
    blob: blobMock
  }
})

afterEach(() => {
  const path = './files/dummy'
  if (exist(path)) {
    rimraf.sync(path)
  }
})

describe('constructor', () => {
  describe('arguments', () => {
    it('should set instance variables', () => {
      const options = {
        q: 'q',
        sort: 'sort',
        page: 2,
        perPage: 100
      }
      const seeker = new Seeker(options)
      expect(seeker.q).toBe(options.q)
      expect(seeker.sort).toBe(options.sort)
      expect(seeker.page).toBe(options.page)
      expect(seeker.perPage).toBe(options.perPage)
    })
  })

  describe('no arguments', () => {
    it('should use default options', () => {
      const seeker = new Seeker()
      expect(seeker.q).toBe('topic:dotfiles')
      expect(seeker.sort).toBe('stars')
      expect(seeker.page).toBe(1)
      expect(seeker.perPage).toBe(10)
    })
  })
})

describe('_download', () => {
  it('should download file.', async () => {
    const target = { path: '.bashrc', url: 'https://example.com' }
    const seeker = new Seeker()
    await seeker._download(target, 'dummy/dummy')
    expect(exist('./files/dummy/dummy/.bashrc')).toBeTruthy()
  })
})
