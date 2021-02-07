# Trail of Cthulhu (Unsanctioned) Foundry VTT System

A Foundry VTT system for running games of Trail of Cthulhu.

<a target="_new" href="screenshot.jpg"><img src="screenshot-thumb.jpg" style="width: 50%"></a>

## How to install

This sytem isn't registered so to install it into your Foundry instance:

1. On the admin screen, got to **Game Systems**
2. Click **Install System**
3. Where it says **Manfest URL**, paste in

    ```
    https://gitlab.com/n3dst4/trail-of-cthulhu-unsanctioned/-/raw/master/src/system.json
    ```
    
4. Click **Install**


## Making PCs

All the character abilities are represented as Items. They should all auto-populate wyhen you create a character, but there are compendium packs containing all the standard abilities from Trail of Cthulhu if you'd like to import them.

## Bug reports and contact

If you have a GitLab account, then by all means log an issue over at [the project site][project-site]. Merge requests are also welcome!

Otherwise you can email me at `neil at lumphammer.com`, or hit me up on Discord (search for `n3dst4#8227`.)


## Development & general hacking

If you're a developer and you'd like to hack on this code, please be aware it uses Webpack and React so some of it will not look like normal Handlebars + JQuery Foundry stuff.

1. Clone the repo.
2. Copy `foundryconfig_template.json` to `foundryconfig.json` and edit it to fill in the `dataPath`, e.g.  `"dataPath" "/home/ndc/foundrydata",`.
3. `npm i` to install dependencies
4. `npm run build` to do a build
5. `npm run link` to link it into your foundry data folder
6. `npm start` to start a live incremental build (so you don't need to keep running `npm run build` after every change).
7. Open your local foundry server and create a world with "Trail of Cthulhu (Unsanctioned)" as the system.


## TODO

- [ ] Item images for investigative & general abilities
- [ ] Combine ability compendia
- [ ] Options tab


## The future

- [ ] i18n
- [ ] multi-system support
  - [ ] compendia of abilities
  - [ ] choose which sidebar pools are visible
  - [ ] character sheet skin
  - [ ] extra features?
- [ ] expandy-collapsy bits on the notes area
- [ ] rich text editing
- [ ] Character gen mode? (track free values, point spends, I<->G trades, synergies)
- [ ] GM player skill matrix (pickable actors, show a big ol' matrix)


## Generating Compendia

1. In your **Items** tab, delete the "Trail of Cthulhu Abilies" folder
2. In the **Compendium Packs** tab, make sure the edit lock is toggled off for the pack (right click and `Toggle edit lock` if you see a padlock.) 
3. Open the browser console (F12) and type `generateTrailAbilitiesData()`
4. Check the compenium packs if you like
5. Copy the `packs/*.db` files back from `dist/` into `src/`


## Release process

We have "release" branch. Its job is to hold a manifest version that points to the right release download.

To perform a release from `master`: 

1. Update the version in `package.json` and `system.json`.
2. Update the CHANGELOG.
3. Commit and push.
4. Run `npm run package`.
5. On GitLab, create a tag matching the new version.
6. Upload the release package to that tag as an asset.
7. Get the download URL for the asset.
8. Paste it into the `download` field of `system.json`.
9. Commit and push.
10. FF the `release` branch to to `master`.

Now, anyone who installs or upgrades, will see the new manifest, and the new download.

Why do we have a separate `release` branch? To keep control. The manifest on `master` can be unstable, broken, experimental, whatever and we know that users will be safely looking at the `release` version.


## Credits

<span>Photo by <a href="https://unsplash.com/@anniespratt?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Annie Spratt</a> on <a href="https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>

<span>Photo by <a href="https://unsplash.com/@marjan_blan?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Марьян Блан | @marjanblan</a> on <a href="https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>

<span>Photo by <a href="https://unsplash.com/@eltimeshau?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Elti Meshau</a> on <a href="https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>

This System for Foundry VTT uses trademarks and/or copyrights owned by Pelgrane Press Ltd, which are used under the Pelgrane Press Ltd, Community Use Policy. We are expressly prohibited from charging you to use or access this content. This System for Foundry VTT is not published, endorsed, or specifically approved by Pelgrane Press Ltd. For more information about Pelgrane Press Ltd’s Community Use Policy, please visit [this page](https://wp.me/p7Ic36-5FU). For more information about Pelgrane Press Ltd visit [pelgranepress.com](http://pelgranepress.com/).”

Huge thanks to Nick van Oosten/NickEast for [Foundry Project Creator](https://gitlab.com/foundry-projects/foundry-pc/create-foundry-project) and [the Typescript types to go with it](https://gitlab.com/foundry-projects/foundry-pc/foundry-pc-types).


[project-site]: https://gitlab.com/n3dst4/trail-of-cthulhu-unsanctioned/-/issues