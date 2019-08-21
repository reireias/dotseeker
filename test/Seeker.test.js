const Seeker = require('../Seeker')

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
