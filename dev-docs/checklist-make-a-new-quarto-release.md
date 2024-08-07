- [ ] create a branch `v1.x`, where x is the version being released
  - `git checkout -b v1.4`
  - `git push origin v1.4`
- [ ] mark the current release as the stable release in the `main` branch
  - edit QUARTO_VERSION line in `/configuration` to be the new version (e.g. `1.5`)
  - kick off a v1.5 build in GHA: https://github.com/quarto-dev/quarto-cli/actions/workflows/create-release.yml
- [ ] mark v1.4 release as stable
  - go to https://github.com/quarto-dev/quarto-cli/releases
  - find the latest v1.4 release and edit, (eg https://github.com/quarto-dev/quarto-cli/releases/edit/v1.4.549)
  - at the bottom of the page, there will be two checkboxes, "Set as pre-release" and "Set as latest release":
    - "Set as pre-release" should be unchecked, and
    - "Set as latest release" should be checked.
- [ ] once the v1.5 build completes, edit the quarto.org website configuration on https://github.com/quarto-dev/quarto-web to reflect the new version
  - this means flipping the profile group configuration in `_quarto.yml` from `[rc,prelease]` to `[prerelease,rc]`
  - publish the release blog post that should exist in https://github.com/quarto-dev/quarto-web/tree/main/docs/blog/posts
    by removing the `draft: true` line in the metadata and changing the date to match the release date
- [ ] quarto-dev/quarto-web changes

  - wait for the downloads file to be automatically updated by the GitHub Action on https://github.com/quarto-dev/quarto-web
  - update the highlights file
    - create a `docs/prerelease/1.5/_highlights.qmd`
    - change `docs/prerelease/_highlights.qmd` so its include points to the new version-specific `_highlights.qmd` file (here, 1.5)
    - change `docs/prerelease/_highlights-release.qmd` so its include points to the new version-specific `_highlights.qmd` file (here, 1.4)
  - add the stable version to the older downloads list, like [this example](https://github.com/quarto-dev/quarto-web/commit/85ef62ec5036026d62d57f9cfb190d8b923b2d43)

- Packaging and package managers, etc
  - TBD chocolatey, winget, etc?
  - [ ] update release on pypi repo
    - Goto the [quarto-cli-pypi repo](https://github.com/quarto-dev/quarto-cli-pypi)
    - Update `version.txt` to be the version you'd like to publish and commit
    - Go to actions
      - Select 'Publish Quarto PyPi'
      - [ ] Click "Run Workflow"
        - **Publishing Test**: You may elect to publish to test.pypi first by _unchecking_ the `Production Release` option
          - Once complete, trest using
            ```bash
            python3 -m pip install --index-url https://test.pypi.org/ --extra-index-url https://pypi.org/ quarto-cli
            ```
          - You may have to run this command twice as the first time may report the package not found and cause cache invalidation. The next try should succeed.
          - Published to: <https://test.pypi.org/project/quarto-cli/>
        - **Publishing Production**: You may elect to publish to production pypyi by checking the `Production Release` option
          - Published to: <https://pypi.org/project/quarto-cli/>
      - Take a sip of tea ☕, bask in the glory of automation.
