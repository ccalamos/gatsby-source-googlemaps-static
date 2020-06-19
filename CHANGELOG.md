# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.1.12] - 2020-06-19

Updated .ts files to have return types on every function.

### Changed

- Private functions now have return types

## [1.1.11] - 2020-06-18

Fixed README.md badges to be parsed by NPM

### Fixed

- Fixed README badges.

### Changed

- Updated npmignore file to allow types def.

## [1.1.10] - 2020-06-17

Updated index type file

### Fixed

- Fixed README badges.

## [1.1.9] - 2020-06-17

Updated index type file

### Changed

- Updated index.d.ts to use T[] instead of Array<T>.

## [1.1.8] - 2020-06-17

Updated TypeScript files to upgrade Code Inspector quality score

### Changed

- Updated *.ts and *.d.ts to use T[] instead of Array<T>.
- Renamed path to newPath.
- Discontinued use of multiple variable declaration.

## [1.1.7] - 2020-06-17

Updated Changelog format, ignored files, and updated all packages.

### Changed

- Changelog now is based on [KeepAChangelog.com](http://keepachangelog.com/)
- Updated .eslintignore
- Updated .gitignore
- Updated .npmignore
- Prettier is now 2.0.5
- fs-extra is now 9.0.1

## [1.1.6] - 2020-06-17

Added TypeScript config to work alongside ESLint and Babel. Restructured code to pass all linters.

### Added

- Added tsconfig.json

### Changed

- Restructured src folder
- Fixed .ts files

### Fixed

- Linting inconsistencies

## [1.1.5] - 2020-06-16

Updated repository with Contributing documents.

### Added

- Added ESLint Rules

### Changed

- Updated .ts files to pass lint.

## [1.1.4] - 2020-06-04

Updated repository with Contributing documents.

### Added

- Added CONTRIBUTING.md
- Added SECURITY.md
- Added Pull Request Template

## [1.1.3] - 2020-06-04

Updated repository with Community Management Documents.

### Added

- Added Code of Conduct.
- Added MIT License.

## [1.1.2] - 2020-06-04

Fixed GraphQL error in README examples.

### Fixed

- Updated README.md examples.

## [1.1.1] - 2020-04-03

SECURITY UPDATE: Updated vulnerability with package `kind-of`.

### Fixed

- Increased `kind-of` to 7.8.4

## [1.1.0] - 2020-03-30

Allowed creation of multiple map nodes and downloads.

### Added

- Implemented multiple maps

### Changed

- Updated watch command

### Fixed


## [1.0.5] - 2020-01-16

Switched from npm to yarn.

### Fixed

- Removed package.lock

## [1.0.0 - 1.0.4] - 2020-01-15

Initial creation of GSGS, with markers, paths, styles and implicit centering.

### Added
- Ability to download Static Map

### Fixed

- Semantic Versioning Control.
- GitHub Actions to automate NPM publishing.
