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
