const dotenv = require('dotenv')
const Seeker = require('./Seeker.js')

dotenv.config()
if (!process.env.GITHUB_API_TOKEN) {
  console.error('Set GITHUB_API_TOKEN in .env file or environment.')
} else {
  new Seeker().seek().catch(e => console.error(e))
}
