# Assurance Case

Why the [security expectations](SECURITY.md#security-expectations) of Accessible
(AA) Theme hold, what they rest on, and where they don't hold yet. It is kept
short because the extension is small: two theme files, no code, no shipped
dependencies, and a build and release pipeline.

## What is being protected

- **Users of the extension:** installing it must give them two colour themes and
  nothing else: no code that runs in their editor, no network access, no
  collected data.
- **The published extension:** what users install from the Visual Studio
  Marketplace must be exactly what this repository built, with nothing added on
  the way.
- **The repository and its release pipeline:** the source, the workflows and the
  credentials that publish releases.

## Threat model

| Threat                               | Where                                    | How it is countered                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------ | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Code added to the extension          | Pull requests, the package               | `npm run check:pack` reads the built `.vsix` on every pull request and again before every publish, and fails on any file outside the expected eight, on a packaged manifest that differs from `package.json`, and on a theme that is missing or doesn't parse. An entry point (`main` or `browser`) would need a code file, which the check rejects              |
| A tampered or substituted release    | The Marketplace                          | Releases are published only from `publish.yml` on `main`, through Marketplace Trusted Publishing (no personal access token) and a GitHub environment only `main` can deploy to. The Marketplace signs each version and VS Code checks the signature on install. The same file is attached to the GitHub release with its SHA-256 digest                          |
| A malicious or vulnerable dependency | Development dependencies, GitHub Actions | None is shipped: the package is built with `--no-dependencies` and checked file by file. Dependency review blocks pull requests that add a high or critical advisory, `npm audit` gates every release, Dependabot proposes updates weekly, installs use `npm ci` with the lockfile, and Actions are pinned to commit SHAs                                        |
| A malicious change to the source     | Pull requests                            | Pull requests only, with required checks (lint, format, tests, packaging, dependency review, CodeQL, the DCO) on `main`; no force pushes or deletion of `main`                                                                                                                                                                                                   |
| Abuse of CI credentials              | Workflows                                | Read-only default permissions in every workflow, write only per job; `id-token: write` only on the publish and Scorecard jobs; pull requests from forks get no secrets; the labeler runs on `pull_request_target` but checks out and runs nothing from the pull request; no expression is interpolated into a shell script; secret scanning with push protection |

## Trust boundaries

1. **Repository to the Marketplace:** only the publish workflow, after a merge
   to `main` and the release guard, can publish, through Trusted Publishing in
   the `marketplace` environment.
2. **The Marketplace to VS Code:** VS Code downloads the `.vsix` and checks the
   Marketplace signature before installing it.
3. **Theme files to VS Code:** VS Code reads the two JSON files as colour
   values. The extension has no code, so nothing of it runs on this side of the
   boundary.

## Secure design principles

- **Economy of mechanism:** data only. Two JSON files and a manifest, with no
  code, options or settings.
- **Fail-safe defaults:** `.vscodeignore` is an allowlist, so a new file in the
  repository stays out of the package unless it is added on purpose, and
  `check:pack` fails a package with an unexpected file.
- **Least privilege:** the extension asks VS Code for nothing; CI tokens are
  read-only by default and write only where a job needs it.
- **Open design:** everything is public, including the release pipeline and this
  document.
- **Minimal dependencies:** none shipped.

## Common weaknesses countered

| Weakness                                           | Status                                                                                                 |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| CWE-94 code injection                              | No code in the extension; `check:pack` rejects files that aren't expected                              |
| CWE-494 download of code without integrity check   | The Marketplace signs each version and VS Code verifies it; the GitHub release lists the file's digest |
| CWE-829 inclusion from an untrusted control sphere | No shipped dependencies; Actions pinned to SHAs; the lockfile fixes development dependencies           |
| CWE-798 hard-coded credentials                     | No credentials in the repository; publishing uses OIDC; secret scanning with push protection           |
| CWE-250 execution with unnecessary privileges      | Per-job workflow permissions; `id-token: write` only where trusted publishing or Scorecard needs it    |

## Known gaps

- **One maintainer:** pull requests by the maintainer get no second review, and
  access to the repository and the Marketplace publisher rests on one person;
  see [governance](GOVERNANCE.md#continuity).
- **Tags are not signed, and releases carry no provenance attestation.** A
  release is verified through the Marketplace signature and the digest on the
  GitHub release instead.
- **Open VSX:** not published there yet
  ([#78](https://github.com/phun-ky/vscode-accessible-theme/issues/78)), so
  editors that install from Open VSX have no official copy.
