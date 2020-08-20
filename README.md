# 🕛 Twelvety

[See the demo site](https://twelvety.netlify.app)

Twelvety is a pre-configured Eleventy starter project built to be fast. It includes:

- Component architecture
- CSS pipeline using Sass and CleanCSS
- JS pipeline using Browserify, Babel and Uglify
- Page-specific CSS and JS
- Inline critical CSS and defer non-critical CSS
- Minified HTML, CSS and JS
- Responsive picture shortcode with WebP support
- Content hash of assets

Write components like this:

```html
<main class="home">
  <h1 class="home__title">Twelvety</h1>
</main>

{% stylesheet 'scss' %}
  @import 'mixins';

  .home {
    @include container;

    &__title {
      color: red;
    }
  }
{% endstylesheet %}

{% javascript %}
  console.log('Super fast 💨')
{% endjavascript %}
```

## Deploy to netlify

To quickly deploy your own instance of Twelvety to Netlify, just click the button below and follow the instructions.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/gregives/twelvety)

**What will happen when I click this button?** Netlify will clone the Twelvety git repository to your GitHub account (it will ask your permission to do this), add the new repository to your netlify account and deploy it!

## Run Locally

You'll need [Node.js](https://nodejs.org) and npm (included with Node.js). To install the required packages, run

```sh
npm install
```

### Commands

- Run `npm run serve` to run a development server and live reload
- Run `npm run build` to build for production
- Run `npm run clean` to clean the output folder and Twelvety cache

## Features

Twelvety sets up transforms, shortcodes and some sensible Eleventy options.

## Visual Studio Code

If you're using Visual Studio Code I recommend this [Liquid extension](https://github.com/panoply/vscode-liquid) so that your Sass and JavaScript will be highlighted correctly.
