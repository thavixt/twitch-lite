![gh-pages](https://github.com/thavixt/twitch-lite/workflows/gh-pages/badge.svg)

## Twitch Lite

A lightweight alternative for watching Twitch streams without the bloat of the official website.
- less CPU usage, faster load times
- smaller memory footprint (example below: 388MB -> 25MB) (2 yr old screenshot - might need a new one)

![](https://user-images.githubusercontent.com/19637735/61996760-5f2fda80-b098-11e9-9560-f355125d383d.png)

- in essence, it's just the Embedded Player and Chat provided by Twitch, with some light API usage
- works with [BetterTTV](https://betterttv.com/) and [FrankerFaceZ](https://www.frankerfacez.com/)
- link to specific channels with `https://thavixt.github.io/twitch-lite/?stream=<channel_name>`
- bookmark as `https://thavixt.github.io/twitch-lite/` without any query parameters to remember your last watched stream
- save your favourite streams in a compact list to switch between them in 1 click, without leaving the page
    - the list shows the viewer counts of online channels for convinience
- click 'Log in' to authenticate at Twitch.tv
    - the app only fetches the list of stream you follow (to display a neat list) and info about those that are actually live at the time

> Note: Adblocks won't work in the embedded player.

### Development

This is a simple React app made with `create-react-app`. If you want to fork the project:

- change `homepage` in `package.json`
- create a `.env` file based on the `.env.example` file (https://dev.twitch.tv/console/apps/)
- `npm i`
- `npm start` to develop
- `npm deploy` to build and publish it through `gh-pages`
    - *or* just `git push`, and the GitHub action provided will do the deployment through `gh-pages` automatically (see `.github/workflows/push.yaml`).
    - requires setting up secrets in the repo (see the `.env.example` keys)

### Todo list

- [ ] showcase improvement/differences (mabye some graph, or just an updated Chrome task manager screenshot)
- [ ] improve styling in general, major overhaul
    - [ ] use SCSS or something else for better organization/readability
    - [ ] maybe copy over the small `classnames`-like helper from the other project...
    - [ ] favourites bar scroll bar styling
- [x] splitter
    - [ ] drag improvements
    - [ ] (WIP) option to reverse col order
    - [ ] better (meaning: actual...) drag feedback
- [ ] write some small `localStorage.get/set` wrapper (if useful)
- [x] use the Twitch API
    - [x] get the user's followed channels list
    - [ ] get info about live channels
    - [ ] (ASAP) refresh token handling
- [x] favourites list, save & remove (when not authenticated)
- [x] request cache
    - [ ] check cache expiry logic
- [ ] mobile layout improvements
    - [ ] fullscreen api?
- [x] import favourites from 'followed channels' list of a user
- [ ] maybe poc PWA? ([`create-react-app` docs](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app))
- [ ] write some tests (should've started with this...)
- [ ] research if `eject`ing from CRA could be a benefit
