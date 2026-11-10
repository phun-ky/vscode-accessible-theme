# Contributing to Accessible (AA) Theme

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the
[Table of Contents](#table-of-contents) for different ways to help and details
about how this project handles them. Please make sure to read the relevant
section before making your contribution. It will make it a lot easier for us
maintainers and smooth out the experience for all involved. The community looks
forward to your contributions. 🎉

> And if you like the project, but just don't have time to contribute, that's
> fine. There are other easy ways to support the project and show your
> appreciation, which we would also be very happy about:
>
> - Star the project
> - Tweet about it
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues

## Table of Contents

- [Contributing to Accessible (AA) Theme](#contributing-to-accessible-aa-theme)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [I Have a Question](#i-have-a-question)
  - [I Want To Contribute](#i-want-to-contribute)
    - [Reporting Bugs](#reporting-bugs)
      - [Before Submitting a Bug Report](#before-submitting-a-bug-report)
      - [How Do I Submit a Good Bug Report?](#how-do-i-submit-a-good-bug-report)
    - [Suggesting Enhancements](#suggesting-enhancements)
      - [Before Submitting an Enhancement](#before-submitting-an-enhancement)
      - [How Do I Submit a Good Enhancement Suggestion?](#how-do-i-submit-a-good-enhancement-suggestion)
    - [Contributing Code](#contributing-code)
      - [Architecture](#architecture)
      - [Development](#development)
      - [Coding Style](#coding-style)
      - [Tests](#tests)
      - [Developer Certificate of Origin](#developer-certificate-of-origin)
      - [Commits and Pull Requests](#commits-and-pull-requests)
      - [Releases](#releases)
  - [Attribution](#attribution)

## Code of Conduct

This project and everyone participating in it is governed by the
[Accessible (AA) Theme Code of Conduct](https://github.com/phun-ky/vscode-accessible-theme/blob/main/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report
unacceptable behaviour to <code-of-conduct@phun-ky.net>.

## I Have a Question

> If you want to ask a question, we assume that you have read the available
> [Documentation](https://github.com/phun-ky/vscode-accessible-theme).

Before you ask a question, it is best to search for existing
[Issues](https://github.com/phun-ky/vscode-accessible-theme/issues) that might
help you. In case you have found a suitable issue and still need clarification,
you can write your question in this issue. It is also advisable to search the
internet for answers first.

If you then still feel the need to ask a question and need clarification, we
recommend the following:

- Open an
  [Issue](https://github.com/phun-ky/vscode-accessible-theme/issues/new).
- Provide as much context as you can about what you're running into.
- Provide your VS Code version, the extension version and your operating system.

We will then take care of the issue as soon as possible.

## I Want To Contribute

> ### Legal Notice
>
> When contributing to this project, you must agree that you have authored 100%
> of the content, that you have the necessary rights to the content and that the
> content you contribute may be provided under the project licence.

### Reporting Bugs

#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more
information. Therefore, we ask you to investigate carefully, collect information
and describe the issue in detail in your report. Please complete the following
steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side e.g. using
  incompatible environment components/versions (Make sure that you have read the
  [documentation](https://github.com/phun-ky/vscode-accessible-theme). If you
  are looking for support, you might want to check
  [this section](#i-have-a-question)).
- To see if other users have experienced (and potentially already solved) the
  same issue you are having, check if there is not already a bug report existing
  for your bug or error in the
  [bug tracker](https://github.com/phun-ky/vscode-accessible-theme/issues?q=label%3A%22problems%3A%20%F0%9F%90%9B%20bug%22).
- Also make sure to search the internet (including Stack Overflow) to see if
  users outside of the GitHub community have discussed the issue.
- Collect information about the bug:
  - VS Code version (**Help: About**) and the extension version
  - The theme: **Accessible (AA) Dark** or **Accessible (AA) Light**
  - Operating system
  - The language or file type, and a short snippet that shows the problem
  - A screenshot, and the colour you see if you know it (**Developer: Inspect
    Editor Tokens and Scopes** shows it)
  - Other extensions or settings that change colours, such as
    `editor.semanticHighlighting.enabled` or `workbench.colorCustomizations`
  - Can you reliably reproduce the issue? And can you also reproduce it with
    older versions?

#### How Do I Submit a Good Bug Report?

> You must never report security related issues, vulnerabilities or bugs
> including sensitive information to the issue tracker, or elsewhere in public.
> Instead, report them privately as described in the
> [security policy](https://github.com/phun-ky/vscode-accessible-theme/blob/main/SECURITY.md#reporting-a-vulnerability):
> through GitHub private vulnerability reporting or by email to
> <security@phun-ky.net>.

We use GitHub issues to track bugs and errors. If you run into an issue with the
project:

- Open an
  [Issue](https://github.com/phun-ky/vscode-accessible-theme/issues/new). (Since
  we can't be sure at this point whether it is a bug or not, we ask you not to
  talk about a bug yet and not to label the issue.)
- Explain the behaviour you would expect and the actual behaviour.
- Please provide as much context as possible and describe the _reproduction
  steps_ that someone else can follow to recreate the issue on their own. This
  usually includes your code. For good bug reports you should isolate the
  problem and create a reduced test case.
- Provide the information you collected in the previous section.

Once it's filed:

- The project team will label the issue accordingly.
- A team member will try to reproduce the issue with your provided steps. If
  there are no reproduction steps or no obvious way to reproduce the issue, the
  team will ask you for those steps and mark the issue as `pending: need repro`.
  Bugs with the `pending: need repro` tag will not be addressed until they are
  reproduced.
- If the team is able to reproduce the issue, it will be marked `🐛 needs fix`,
  as well as possibly other tags (such as `problems: 🧨 critical`), and the
  issue will be left to be implemented by someone.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for
Accessible (AA) Theme, **including completely new features and minor
improvements to existing functionality**. Following these guidelines will help
maintainers and the community to understand your suggestion and find related
suggestions.

#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Read the [documentation](https://github.com/phun-ky/vscode-accessible-theme)
  carefully and find out if the functionality is already covered, maybe by an
  individual configuration.
- Perform a [search](https://github.com/phun-ky/vscode-accessible-theme/issues)
  to see if the enhancement has already been suggested. If it has, add a comment
  to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's
  up to you to make a strong case to convince the project's developers of the
  merits of this feature. Keep in mind that we want features that will be useful
  to the majority of our users and not just a small subset. If you're just
  targeting a minority of users, consider writing an add-on/plugin library.

#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as
[GitHub issues](https://github.com/phun-ky/vscode-accessible-theme/issues).

- Use a **clear and descriptive title** for the issue to identify the
  suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many
  details as possible.
- **Describe the current behaviour** and **explain which behaviour you expected
  to see instead** and why. At this point you can also tell which alternatives
  do not work for you.
- You may want to **include screenshots and animated GIFs** which help you
  demonstrate the steps or point out the part which the suggestion is related
  to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on
  macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast)
  or [this tool](https://gitlab.gnome.org/Archive/byzanz) on Linux.
- **Explain why this enhancement would be useful** to most Accessible (AA) Theme
  users. You may also want to point out the other projects that solved it better
  and which could serve as inspiration.

### Contributing Code

Larger changes, such as new colours across a theme, are best discussed in an
issue first, with screenshots, so the work fits the [roadmap](ROADMAP.md).

#### Architecture

The extension is data, not code:

- **`themes/accessible-dark-color-theme.json`** and
  **`themes/accessible-light-color-theme.json`** are the two themes. `colors`
  holds the workbench (UI) colours, `tokenColors` the TextMate syntax colours
  and `semanticTokenColors` the semantic highlighting colours.
- **`package.json`** contributes both themes under `contributes.themes`, with
  the label users pick in **Preferences: Color Theme**. It has no `main` or
  `browser` entry point, so the extension runs no code.
- **`.vscodeignore`** is an allowlist: only the two themes, `package.json`,
  README, CHANGELOG and LICENSE go into the `.vsix`.
- **`scripts/check-pack.mjs`** reads the built `.vsix` and checks what users
  would get; see [Development](#development).
- **`test/`** holds the contrast tests; see [Tests](#tests).

#### Development

You need Node.js 24 and npm 11.

```shell-session
npm ci
npm test
npm run package
npm run check:pack
```

To try a change in VS Code, open this folder, press `F5` to start an Extension
Development Host, and pick the theme there with **Preferences: Color Theme**. Or
install the packed file:
`code --install-extension vscode-accessible-theme.vsix`.

| Command                      | What it does                                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `npm test`                   | Runs the contrast tests and the README palette check with Node's test runner                                     |
| `npm run style:lint`         | Lints the JavaScript and Markdown files with ESLint and Prettier                                                 |
| `npm run style:format-check` | Checks the format of the JSON and YAML files with Prettier                                                       |
| `npm run style:format`       | Fixes what `style:lint` and `style:format-check` can fix                                                         |
| `npm run package`            | Packs the extension into `vscode-accessible-theme.vsix` with vsce                                                |
| `npm run check:pack`         | Reads the `.vsix` and fails on an unexpected file, a manifest that differs from `package.json` or a broken theme |
| `npm run release:dry-run`    | Shows whether merging would release, and the planned version and changelog                                       |
| `npm run commit`             | Helps write a commit message in the project's style                                                              |

Run `npm run check:pack` after `npm run package`.

#### Coding Style

JavaScript and Markdown follow the project's [ESLint](https://eslint.org/)
configuration (`eslint-config-phun-ky`) and [Prettier](https://prettier.io/)
formatting, and JSON and YAML follow Prettier. Colours in the theme files are
hex values, written as `#RRGGBB`, or `#RRGGBBAA` for a colour with transparency.
A contribution must pass `npm run style:lint` and `npm run style:format-check`
with no errors. Both run in CI on every pull request, and a pull request that
fails them can't be merged.

#### Tests

`npm test` runs these with Node's test runner:

- **`test/contrast.test.mjs`:** every syntax colour (`editor.foreground`,
  `tokenColors` and `semanticTokenColors`) must reach 4.5:1 against
  `editor.background`.
- **`test/ui-contrast.test.mjs`:** every UI text colour the themes set, from
  tabs and the status bar to bracket pair colours and the terminal ANSI colours,
  must reach 4.5:1 against the background it is drawn on. `test/ui-pairs.mjs`
  pairs each foreground key with its background.
- **`test/readme-palette.test.mjs`:** the README palette tables must list
  exactly the colours each theme uses for code, with the measured ratio and WCAG
  levels.
- **`test/wcag.test.mjs`:** the WCAG 2.x contrast calculation in
  `test/wcag.mjs`, against known values.

Ratios are not rounded: 4.499:1 fails. A failing test names the key, the colours
and the ratio.

What a pull request needs:

- **New or changed colours must pass the contrast tests**, and a new colour for
  code gets a row in the README palette table.
- **Bug fixes must come with a regression test** that fails without the fix, as
  the contrast tests did for
  [#67](https://github.com/phun-ky/vscode-accessible-theme/issues/67) and
  [#68](https://github.com/phun-ky/vscode-accessible-theme/issues/68).
- **New test helpers or scripts must come with tests**, as `test/ui-pairs.mjs`
  does in `test/ui-contrast.test.mjs`.
- **Packaging changes** are tested by `npm run check:pack`, which runs in CI.

To add or change a colour:

1. Edit the theme file. Use **Developer: Inspect Editor Tokens and Scopes** in
   VS Code to find the scope or key a piece of text uses.
2. Run `npm test`. A colour below 4.5:1 fails with its ratio; pick a darker or
   lighter shade until it passes.
3. If the colour is new for code, add a row for it to the theme's palette table
   in the README. The name is the nearest match in
   [color-name-list](https://github.com/meodai/color-names), and `npm test`
   reports the ratio and levels the row must show.
4. If a new UI foreground key has no background named after it, `npm test` says
   so: map it to its background in `test/ui-pairs.mjs`, or add it to `SKIPPED`
   with the reason.
5. Add screenshots of both themes, before and after, to the pull request.

#### Developer Certificate of Origin

Every commit must be signed off under the
[Developer Certificate of Origin](https://developercertificate.org/) (DCO): a
statement that you wrote the change, or otherwise have the right to submit it
under the project's licence. You agree to it by adding a `Signed-off-by` line
with your name and email to the commit message:

```text
Signed-off-by: Your Name <you@example.com>
```

- **Per commit:** `git commit -s` adds the line for you.
- **Always:** `npm ci` sets `core.hooksPath` to `.githooks`, and the hook in
  `.githooks/prepare-commit-msg` adds the line to every commit, including those
  made by `npm run commit` or your editor.
- **Forgot?** Sign off every commit on your branch and push again:
  `git rebase --signoff main` then `git push --force-with-lease`.

The DCO check on every pull request fails if a commit isn't signed off.

#### Commits and Pull Requests

- Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `docs:`, ...). `npm run commit` helps write them. Releases
  and the changelog are generated from them (see [Releases](#releases)), so pick
  the type that matches the change: a colour that changes what users see is a
  `fix:` or a `feat:`.
- A breaking change needs a `type!:` and a `BREAKING CHANGE:` footer that says
  what to change. For this extension that means renaming or removing a theme
  (users' `workbench.colorTheme` setting names it by its label) or narrowing
  `engines.vscode`.
- Write a `#` in a commit message only before an issue number. The changelog
  turns `#` and what follows it into an issue link, so write colours without it
  (`78698C`).
- Open a pull request against `main`. The Checks workflow lints, checks the
  format, runs the tests, packs the extension and checks the package; dependency
  review, CodeQL and the DCO check also run. All of them must pass.

#### Releases

The maintainer merges pull requests, and releases follow automatically from
GitHub Actions:

1. When a merged pull request changes what gets published, the publish workflow
   checks whether there is anything to release: a `feat`, `fix`, `perf` or
   `revert` commit, or a breaking change, that touches the published files (the
   themes, `package.json`, README, LICENSE or `.vscodeignore`). Other changes
   wait for the next release.
2. If so, release-it picks the version from the commits, updates the changelog,
   packs the extension, checks the package with `npm run check:pack`, and
   publishes that same file to the Visual Studio Marketplace with Trusted
   Publishing.
3. The release commit and tag go to `main`, and a GitHub release is created with
   the `.vsix` attached.

`npm run release:dry-run` shows what a merge would release.

## Attribution

This guide is based on the **contributing-gen**.
[Make your own](https://github.com/bttger/contributing-gen)!
