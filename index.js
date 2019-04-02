const dotenv = require('dotenv')
const seeker = require('./seeker.js')

dotenv.config()
if (!process.env.GITHUB_API_TOKEN) {
  console.error('Set GITHUB_API_TOKEN in .env file or environment.')
} else {
  seeker.seek().catch(e => console.error(e))
}
