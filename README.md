## Twitch Lite

A lightweight website for watching Twitch streams without the bloat of the official website.

- less CPU usage, faster load times
- smaller memory footprint (example below: 388MB -> 25MB)
- ~44.9KB (gzipped) on initial page load

![](https://user-images.githubusercontent.com/19637735/61996760-5f2fda80-b098-11e9-9560-f355125d383d.png)

- Log in at twitch.tv to use chat
    - the site itself will not ask for any credentials
- works with [BetterTTV](https://betterttv.com/) and [FrankerFaceZ](https://www.frankerfacez.com/)
- link to specific channels with `https://thavixt.github.io/twitch-lite/?stream=<channel_name>`
- bookmark as `https://thavixt.github.io/twitch-lite/` without any query parameters to remember your last watched stream
- save your favourite streams in a compact list to switch between them in 1 click, without leaving the page
  - the list shows the viewer counts of online channels for convinience

### Todo

- [ ] PWA -> [`create-react-app` docs](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
- [x] save & remove favourites
- [x] request cache
- [ ] mobile layout improvements
    - [ ] fullscreen api?
- [x] splitter
    - [ ] drag improvements
- [ ] favourites bar scroll bar styling
- [ ] import favourites from 'followed channels' list of a user?


### Development

This is a simple React app made with `create-react-app`. If you want to fork the project:

- change `homepage` in `package.json`
- replace the `CLIENT_ID` constant in `src/api/request.js` with your own client ID from https://dev.twitch.tv/console/apps/
- `npm i`
- `npm run start` to develop
- `npm run deploy` to build and publish it through `gh-pages`
