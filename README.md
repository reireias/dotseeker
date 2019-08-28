[![Build Status](https://travis-ci.org/reireias/dotseeker.svg?branch=master)](https://travis-ci.org/reireias/dotseeker) [![Actions](https://github.com/reireias/dotseeker/workflows/CI/badge.svg)]
# dotseeker

Collect dotfile (e.g. `.zshrc`) from GitHub repositories which has dotfiles topic.

## Usage
Install packages.

```console
yarn install
```

Set GITHUB_API_TOKEN in `.env` file or environment.

```
GITHUB_API_TOKEN=xxxxxxxxxxxxxxxxx
```

Execute!

```console
yarn start
```

dotseeker downloads dotfile into `files` directory.

```
# example for reireias/dotfile repository
files
└── reireias
    └── dotfiles
        ├── .bashrc
        └── .zshrc
```

## Customize
You can customize this search logic.

```js
await new Seeker(params).seek()
```

If params not specified, Seeker use default params.

The default params is follows.

```js
params = {
  q: 'topic:dotfiles',
  sort: 'stars',
  page: 1,
  perPage: 10,
  filenamePattern: /^.*\.?(bashrc|bash_profile|zshrc|zsh_profile)/
}
```

The params structure is follows.

```js
params = {
  q: String,
  sort: String,
  page: Number,
  perPage: Number,
  filenamePattern: Regexp Object
}
```

### q
`q` is a query for searching repository.

See [GitHub API Document](https://developer.github.com/v3/search/#parameters)

### sort
`sort` is a sort option for searching repository.
- `stars`, `forks`, `help-wanted-issues`, `updated` are allows.

See [GitHub API Document](https://developer.github.com/v3/search/#parameters)

### page
`page` is the page number for searching result pagenation.

See [GitHub API Pagenation Document](https://developer.github.com/v3/#pagination)

### perPage
`perPage` is the number of repository in one page for searching result pagenation.

See [GitHub API Pagenation Document](https://developer.github.com/v3/#pagination)

### filenamePattern
The regexp object for filtering download file.

Example
```js
/^.*\.?(bashrc|bash_profile|zshrc|zsh_profile)/
```

