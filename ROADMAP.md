# Roadmap

What Accessible (AA) Theme intends to do, and not do, from November 2026 to
November 2027. It's a plan, not a promise: priorities can change, and changes to
this file are made in pull requests like any other. Individual pieces of work
are tracked as
[GitHub issues](https://github.com/phun-ky/vscode-accessible-theme/issues),
grouped in milestones.

## Planned

### Keeping the themes readable

Since 1.0.47, every syntax colour and every UI text colour the themes set
reaches WCAG AA (4.5:1) against the background it is drawn on, and `npm test`
checks it for both themes, along with the README palette tables. From here:

- **No colour below AA.** A new or changed colour must pass the contrast tests
  before it is merged.
- **Only the latest release is supported;** see the
  [security policy](SECURITY.md#supported-versions).

### Reaching more editors

- **Open VSX**, so VSCodium, Cursor, Gitpod and other editors that install from
  it get an official copy
  ([#78](https://github.com/phun-ky/vscode-accessible-theme/issues/78)).
- **A better Marketplace listing:** an extension icon, a gallery banner and
  lighter screenshots
  ([#82](https://github.com/phun-ky/vscode-accessible-theme/issues/82)).

### Project health

- **OpenSSF Best Practices:** the passing badge, then silver and OSPS Baseline
  ([#81](https://github.com/phun-ky/vscode-accessible-theme/issues/81)).
- **Clearer release logs:** the vsce and ovsx output in the Publish workflow log
  ([#88](https://github.com/phun-ky/vscode-accessible-theme/issues/88)).
- **A second maintainer**, so that pull requests get a review from someone other
  than the author and access to the project doesn't rest on one person; see
  [governance](GOVERNANCE.md#continuity).

## Considered, not scheduled

Ideas that fit the project but have no date. Each would be discussed in an issue
first.

- **Setting the UI colours the themes leave to VS Code**, so that every text
  colour on screen is one the contrast tests check. Today, unset colours use VS
  Code's defaults.
- **AAA variants** of the two themes, with 7:1 contrast for normal text.

## Not planned

- **Code in the extension.** It stays two theme files: no commands, settings,
  activation events or bundled code; see the
  [security policy](SECURITY.md#security-expectations).
- **Collecting data.** The extension doesn't collect, store or send data
  anywhere.
- **Publisher-side signing with vsce-sign.** The Marketplace signs every version
  itself, and the GitHub release carries the same file
  ([#89](https://github.com/phun-ky/vscode-accessible-theme/issues/89)).
