# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.1.0](https://github.com/Quadrats/quadrats/compare/v0.0.2...v0.1.0) (2021-01-05)

### Code Refactoring

- **common/embed/twitter:** only need tweetId for embeding twitter tweet ([815b219](https://github.com/Quadrats/quadrats/commit/815b219a25ee02eec63ffafece0e626884c7d9d3))
- **react:** extract css files instead of auto injecting ([e5943b3](https://github.com/Quadrats/quadrats/commit/e5943b3715099476d2455ae3cb2f611389d0feaf))

### BREAKING CHANGES

- **react:** Please import css or scss files from each packages
- **common/embed/twitter:** The TwitterEmbedStrategy only record tweetId, remove account and rename hash to
  tweetId

## [0.0.2](https://github.com/Quadrats/quadrats/compare/v0.0.1...v0.0.2) (2020-12-21)

### Bug Fixes

- **react:** add sideEffects about style ([89138b4](https://github.com/Quadrats/quadrats/commit/89138b4f424f6ab071f24154a83efc051907d7da))

## 0.0.1 (2020-12-18)

**Note:** Version bump only for package quadrats
