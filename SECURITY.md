# Security Policy

Accessible (AA) Theme is a VS Code extension that contributes two colour themes,
Accessible (AA) Dark and Accessible (AA) Light, as JSON files. It contains no
code and ships no dependencies. What that means for its security, and how
vulnerabilities are reported and handled, is described below.

## Supported Versions

Only the latest release is supported:

| Release                  | Supported |
| ------------------------ | --------- |
| The latest `1.x` release | ✅        |
| Every earlier release    | ❌        |

The Visual Studio Marketplace serves one listing, and VS Code updates extensions
to the newest version automatically, so fixes are released as a new version and
reach users through those updates. If you have turned automatic updates off,
update the extension from the Extensions view to get a fix.

## Reporting a Vulnerability

Report vulnerabilities privately, either with GitHub's
[private vulnerability reporting](https://github.com/phun-ky/vscode-accessible-theme/security/advisories/new)
or by email to <security@phun-ky.net>. Please don't open a public issue for a
security problem.

## How Reports Are Handled

1. **Acknowledgement:** you'll get a reply within 7 days confirming the report
   was received.
2. **Assessment:** the maintainer reproduces the issue and judges its severity,
   and may ask you for details.
3. **Fix:** a fix is developed in a private GitHub security advisory and
   released as a new version. The aim is a fix within 30 days for serious
   issues.
4. **Disclosure:** the advisory is published when the fix is released, with a
   CVE where one applies. Please keep the issue private until then.
5. **Credit:** reporters are credited in the advisory and the release notes,
   unless they ask to stay anonymous.

## Security Expectations

What you can rely on:

- **No code runs.** The extension contributes two theme files and nothing else:
  `package.json` has no `main` or `browser` entry point and no activation
  events, so VS Code has no code of the extension to run. `npm run check:pack`
  fails a package that contains any file outside the expected nine (the two
  themes, the icon, `package.json`, README, CHANGELOG, LICENSE and the two
  manifest files vsce writes).
- **No side effects.** The extension doesn't access the network or the file
  system, doesn't change your settings, and doesn't collect or send any data.
- **No dependencies are shipped.** The `.vsix` contains no `node_modules`; every
  npm package in this repository is a development tool.
- **Releases are traceable.** Every release is built and published from GitHub
  Actions, and the same file is attached to the GitHub release (see below).

What you can't rely on:

- **Open VSX.** The extension is not published on Open VSX yet
  ([#78](https://github.com/phun-ky/vscode-accessible-theme/issues/78)), so
  VSCodium, Cursor, Gitpod and other editors that install from Open VSX don't
  have an official copy. A copy on any other registry is not from this project
  until this policy lists it.
- **Colours outside the themes.** UI colours the themes leave unset use VS
  Code's defaults, and settings such as `workbench.colorCustomizations` or other
  extensions can override any colour. The contrast the README states holds for
  the colours the themes set.

## Verifying Releases

Releases are published to the
[Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=phun-ky.vscode-accessible-theme)
by the verified publisher `phun-ky`, from the workflow
`.github/workflows/publish.yml` in this repository. Publishing uses Marketplace
Trusted Publishing, so it needs no personal access token: GitHub Actions proves
which repository, workflow and environment are publishing, and only `main` can
deploy to that environment.

- **Marketplace signature:** the Marketplace signs every version it serves, and
  VS Code checks the signature when it installs the extension
  (`extensions.verifySignature`, on by default).
- **Same file as the GitHub release:** each release has a git tag, `1.0.47` for
  example, and a GitHub release with the `.vsix` attached. The GitHub release
  page shows the file's SHA-256 digest. To compare it with what the Marketplace
  serves:

  ```shell
  version=1.0.47
  curl -sL --compressed "https://marketplace.visualstudio.com/_apis/public/gallery/publishers/phun-ky/vsextensions/vscode-accessible-theme/$version/vspackage" | sha256sum
  gh release download "$version" --repo phun-ky/vscode-accessible-theme --pattern vscode-accessible-theme.vsix --output - | sha256sum
  ```

  Both lines must print the same digest.

- **Build provenance:** from the first release after 1.0.47, the publish
  workflow signs a build provenance attestation for the `.vsix` with Sigstore,
  naming this repository, the workflow and the commit that built it. The GitHub
  release has it attached as `vscode-accessible-theme.vsix.sigstore.json`.
  Because the Marketplace serves the same file, either copy can be checked:

  ```shell
  gh attestation verify vscode-accessible-theme.vsix --repo phun-ky/vscode-accessible-theme --signer-workflow phun-ky/vscode-accessible-theme/.github/workflows/publish.yml
  ```

  1.0.47 and earlier releases have no attestation.

Git tags are not signed.

## Dependencies

**Choosing them.** The extension ships no dependencies, and adding a runtime
dependency would need code to use it, which is discussed in an issue first.
Development dependencies must be widely used, actively maintained and under an
OSI-approved licence compatible with MIT; strong copyleft licences (GPL, AGPL)
are not accepted.

**Obtaining them.** Packages come only from the npm registry, with exact
versions locked in `package-lock.json` and installed with `npm ci` in CI. GitHub
Actions are pinned to commit SHAs. The package is built with
`vsce package --no-dependencies`, and `npm run check:pack` fails if anything
else gets into it.

**Tracking them.** Dependabot proposes version updates weekly, after a 14-day
cooldown, and security updates as soon as an advisory is published. Every pull
request runs
[dependency review](https://github.com/phun-ky/vscode-accessible-theme/blob/main/.github/workflows/dependency-review.yml),
and every release runs `npm audit --omit=dev --audit-level=high` first.

**Fixing known vulnerabilities.** Findings are checked against the GitHub
Advisory Database:

| Finding                    | Where                  | What happens                                                                                |
| -------------------------- | ---------------------- | ------------------------------------------------------------------------------------------- |
| Critical or high           | Development dependency | Blocks merging when introduced (dependency review); an existing one is fixed within 30 days |
| Moderate or low            | Development dependency | Fixed with the next update, within 90 days, or listed as an accepted exception              |
| Any                        | A shipped dependency   | Not applicable while the extension ships none; `npm audit` blocks the release               |
| Licence outside the policy | New dependency         | Not merged                                                                                  |

**Accepted exceptions.** A vulnerability that can't be fixed yet and can't be
exploited through this project is allowed in dependency review, listed here, and
recorded as an [OpenVEX](https://openvex.dev/) statement in
[`vex.openvex.json`](vex.openvex.json). Each one is removed as soon as a fix is
reachable:

| Advisory                                                                            | Package        | Why it is accepted                                                                                                                                                                                                                                                                                                  | Remove when                                               |
| ----------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) (moderate) | `minimatch` 10 | Development only: the latest eslint, `@eslint/config-array`, typescript-eslint, `eslint-plugin-import-x` and `@vscode/vsce` all require `^10`, and the fix is in 11.0.1. The denial of service needs a crafted glob pattern, and the only patterns here are this repository's own lint and packaging configuration. | Those packages allow `minimatch` 11.0.1 or later          |
| [GHSA-238p-pmpm-9mq7](https://github.com/advisories/GHSA-238p-pmpm-9mq7) (low)      | `katex` 0.16   | Development only, through `eslint-config-phun-ky` > `@eslint/markdown` > `micromark-extension-math`, which requires `^0.16`. ESLint loads katex but never calls it: lint parses Markdown and never renders math to HTML.                                                                                            | `micromark-extension-math` allows `katex` 0.18.2 or later |

## Code Scanning

CodeQL (GitHub default setup) analyses the GitHub Actions workflows and the
JavaScript in this repository on every pull request and every push to `main`.
The ruleset on `main` blocks merging while CodeQL reports an error, or a
security alert of high or critical severity. Other CodeQL alerts are fixed
within 90 days, or dismissed with the reason when they are false positives.
OpenSSF Scorecard runs on every push to `main` and weekly, with results at
<https://scorecard.dev/viewer/?uri=github.com/phun-ky/vscode-accessible-theme>.

## Secrets

The project keeps as few secrets as possible:

| Secret     | Used by       | For                                                   |
| ---------- | ------------- | ----------------------------------------------------- |
| `GH_TOKEN` | `publish.yml` | Pushing release commits and tags, and GitHub releases |

Publishing to the Marketplace needs no secret: it uses short-lived OIDC tokens
from GitHub, exchanged through Marketplace Trusted Publishing.

- **Storage:** secrets are kept only as encrypted GitHub Actions secrets, never
  in the repository. Secret scanning with push protection blocks commits that
  contain one.
- **Access:** only the maintainer can view or change them, and they are not
  available to workflows run from forks.
- **Rotation:** at least once a year, and immediately if one may have been
  exposed.

## Assurance Case

Why these expectations hold, where they don't hold yet, and the threat model and
trust boundaries behind them are set out in the [assurance case](ASSURANCE.md).
