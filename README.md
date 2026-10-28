# Mark Automates — staging

This repository contains the approved static staging package and minimal deployment controls. It contains no development workspace or production custom-domain configuration.

Expected URL: https://markautomationva-lab.github.io/mark-automates-staging/

Only site/ is published by Pages. The repository itself is public, so the workflow, validator, package inventory and this README are also publicly readable. Noindex is a search-engine request, not access control.

## Approved updates

Prepare the reviewed package in the separate local source project, validate it, and update site/ and package-manifest.json together. Review the update before committing to main. Pushes do not publish the site.

To publish an approved commit, run the Approved staging deployment workflow manually on main and enter that exact commit's full SHA. Validation checks the repository, branch, event, SHA, file allowlist, sizes, hashes and staging metadata before artifact upload. Deployment uses GitHub's short-lived token/OIDC and only site/. No personal token or deployment secret belongs in this repository.

GitHub Pages must use GitHub Actions as its publishing source for this staging repository. Do not set a custom domain or add CNAME. The existing Portfolio repository and markautomates.tech are separate and must not be changed.
