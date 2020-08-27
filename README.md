# 🕛 Twelvety

[See the demo site](https://twelvety.netlify.app)

Twelvety is a pre-configured Eleventy starter project built to be fast. It includes:

- Component architecture
- CSS pipeline using Sass, PostCSS and CleanCSS
- JS pipeline using Browserify, Babel and Uglify
- Page-specific CSS and JS
- Inline critical CSS and defer non-critical CSS
- Minified HTML, CSS and JS
- Responsive picture shortcode **with WebP support**
- Content-hash of assets

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

To quickly deploy your own instance of Twelvety to netlify, just click the button below and follow the instructions.

[![Deploy to netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/gregives/twelvety)

**What will happen when I click this button?** Netlify will clone the Twelvety git repository to your GitHub account (it will ask your permission to do this), add the new repository to your netlify account and deploy it!

## Run Locally

Click the <kbd>Use this template</kbd> button at the top of this repository to make your own Twelvety repository in your GitHub account. Clone or download your new Twelvety repository onto your computer.

You'll need [Node.js](https://nodejs.org) and npm (included with Node.js). To install the required packages, run

```sh
npm install
```

### Commands

- Run `npm run serve` to run a development server and live-reload
- Run `npm run build` to build for production
- Run `npm run clean` to clean the output folder and Twelvety cache

The brains of Twelvety live in the `utils` folder: if you just want to make a website, then you don't need to touch anything inside `utils`. However, if you want to change any of the shortcodes, have a look around!

## Features

Twelvety sets up transforms, shortcodes and some sensible Eleventy options. Click the features below to learn how they work.

<details>
<summary><strong><code>stylesheet</code> paired shortcode</strong></summary>
<br>

Use the `stylesheet` paired shortcode to include your Sass. You can import Sass files from your `styles` directory (defined in `.twelvety.js`) and from `node_modules`. The Sass will be rendered using [node-sass](https://github.com/sass/node-sass), passed into [PostCSS](https://github.com/postcss/postcss) (with [PostCSS Preset Env](https://github.com/csstools/postcss-preset-env) and [Autoprefixer](https://github.com/postcss/autoprefixer) for compatibility) and either minified using [clean-css](https://github.com/jakubpawlowicz/clean-css) or beautified by [JS Beautifier](https://github.com/beautify-web/js-beautify) (in production and development respectively).

```html
{% stylesheet 'scss' %}
  @import 'normalize.css/normalize';
  @import 'mixins';

  .home {
    @include container;

    color: $color--red;
  }
{% endstylesheet %}
```

By default, Twelvety does **not** use indented Sass so you need to use semicolons. If you want to change this, have a look in the `renderStyles` function near the top of `utils/shortcodes/stylesheet.js`. In the future, Twelvety should probably use the `language` parameter of the paired shortcode (which currently does nothing) to infer this.

The `stylesheet` paired shortcode also has a third parameter, which by default is set to `page.url`, the URL of the current page being rendered. This means that only the required CSS is included in each page. You can make your own 'chunk' of CSS using this parameter, for example, a CSS file common to all pages of your website.

___

</details>

<details>
<summary><strong><code>styles</code> shortcode</strong></summary>
<br>

The `styles` shortcode collects together all Sass written in `stylesheet` paired shortcodes for the given chunk and outputs the rendered CSS. The 'chunk' defaults to `page.url`, the URL of the current page being rendered.

```html
<!-- Inline all styles on current page -->
<style>
  {% styles page.url %}
</style>

<!-- Capture styles on current page -->
{% capture css %}
  {% styles page.url %}
{% endcapture %}
<!-- And output asset using `asset` shortcode -->
<link rel="stylesheet" href="{% asset css, 'css' %}">
```

Note that the `styles` shortcode must be placed below any `stylesheet` paired shortcodes in the template; see the `append` paired shortcode and transform for more information.

___

</details>

<details>
<summary><strong><code>javascript</code> paired shortcode</strong></summary>
<br>

Include your JavaScript using the `javascript` paired shortcode. Twelvety uses [Browserify](http://browserify.org) so that you can `require('modules')` and [Babel](https://babeljs.io) so you can use the latest JavaScript. Your JavaScript will then be minified using [Uglify](https://github.com/mishoo/UglifyJS) in production or beautified by [JS Beautifier](https://github.com/beautify-web/js-beautify) in development.

```html
{% javascript %}
  const axios = require('axios')

  axios.get('/api/endpoint')
    .then((response) => {
      console.log('Yay, it worked!')
    })
    .catch((error) => {
      console.log('Uh oh, something went wrong')
    })
{% endjavascript %}
```

The `javascript` paired shortcode has a second parameter, which by default is set to `page.url`, the URL of the current page being rendered. This means that only the required JavaScript is included in each page. You can make your own 'chunk' of JavaScript using this parameter, for example, a JavaScript file for all vendor code.

The output of each `javascript` paired shortcode will be wrapped in an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) so that your variables do not pollute global scope. If you want to define something on `window`, use `window.something =`.

___

</details>

<details>
<summary><strong><code>script</code> shortcode</strong></summary>
<br>

The `script` shortcode collects together all the JavaScript for the given chunk and outputs the JavaScript (after transpilation and minification). The 'chunk' defaults to `page.url`, the URL of the current page being rendered.

```html
<!-- Inline all JavaScript on current page -->
<script>
  {% script page.url %}
</script>

<!-- Capture JavaScript on current page -->
{% capture js -%}
  {% script page.url %}
{%- endcapture -%}
<!-- And output asset using `asset` shortcode -->
<script src="{% asset js, 'js' %}" defer></script>
```

Note that the `script` shortcode must be placed below any `javascript` paired shortcodes in the template; usually this is not a problem as JavaScript is often included immediately preceding `</body>`. If you want the JavaScript somewhere else, see the `append` paired shortcode and transform.

___

</details>

<details>
<summary><strong><code>asset</code> shortcode</strong></summary>
<br>

The `asset` shortcode outputs a content-hashed asset with the given content and extension. The content may be either a `String` or `Buffer`. Assets will be saved to the `assets` directory inside the `output` directory (both defined within `.twelvety.js`).

```html
<!-- Capture some content -->
{% capture css %}
h1 {
  color: red;
}
{% endcapture %}

<!-- Save content to content-hashed file with .css extension -->
<link rel="stylesheet" href="{% asset css, 'css' %}">

<!-- Output of shortcode -->
<link rel="stylesheet" href="/_assets/58f4b924.css">
```

You can import the `asset` shortcode function in JavaScript: this is how the `picture` shortcode saves your responsive images into the `assets` directory.

___

</details>

<details>
<summary><strong><code>picture</code> shortcode</strong></summary>
<br>

The `picture` shortcode outputs a responsive picture element with WebP support. It is similar to an `img` tag in that it takes a `src` and `alt`. Your images must be stored within the `images` directory, defined within `.twelvety.js`. Twelvety will save the outputted images to the `assets` directory inside the `output` directory (both defined within `.twelvety.js`). The `picture` shortcode also takes two other parameters: `sizes` which defaults to `90vw, (min-width: 1280px) 1152px`, based upon the breakpoint sizes; and `loading` which defaults to `lazy`, can also be `eager`.

```html
<!-- Picture shortcode with src, alt, sizes and loading -->
{% picture 'car.jpg', 'Panning photo of grey coupe on road', '90vw', 'eager' %}

<!-- Absolute paths also work -->
{% picture '/src/_assets/images/car.jpg', 'Panning photo of grey coupe on road', '90vw', 'eager' %}

<!-- Output of shortcode -->
<picture style="background-color:rgb(38%,28%,26%);padding-bottom:50.000%">
  <source srcset="/_assets/de73383e.webp 160w,/_assets/de540255.webp 320w,/_assets/f5ae5a88.webp 480w,/_assets/724f8636.webp 640w,/_assets/c56ea7d2.webp 800w,/_assets/5895e31e.webp 960w,/_assets/57b3f4bf.webp 1120w,/_assets/c262ceab.webp 1280w,/_assets/7f120115.webp 1440w,/_assets/17243df5.webp 1600w,/_assets/fdd5ad8c.webp 1760w,/_assets/c3fcc9b2.webp 1920w" sizes="90vw" type="image/webp">
  <source srcset="/_assets/66146e9b.jpeg 160w,/_assets/e13943d8.jpeg 320w,/_assets/991f26a4.jpeg 480w,/_assets/f03726c4.jpeg 640w,/_assets/6723a0ee.jpeg 800w,/_assets/8fd76043.jpeg 960w,/_assets/222c41b6.jpeg 1120w,/_assets/181500ea.jpeg 1280w,/_assets/01dc1181.jpeg 1440w,/_assets/7a40a8d9.jpeg 1600w,/_assets/a1472000.jpeg 1760w,/_assets/a3312c7b.jpeg 1920w" sizes="90vw" type="image/jpeg">
  <img src="/_assets/a3312c7b.jpeg" alt="Panning photo of grey coupe on road" loading="eager">
</picture>
```

The `picture` shortcode uses native lazy-loading but it would be easy to add support for `lazysizes` or a similar library if you wished. The `picture` shortcode calculates the average colour of the image to show while the image loads, using `padding-bottom` to avoid layout shift.

The `picture` shortcode is automatically used for every image in Markdown. To disable this, you'll need to edit the instance of markdown-it (see Markdown feature).

```md
<!-- Automatically uses picture shortcode -->
![Panning photo of grey coupe on road](car.jpg)
```

**The images outputted by the `picture` shortcode are cached.** If you want to clear the cache, delete `.twelvety.cache` (just a JSON file) or run `npm run clean` to delete the cache and the output directory. If you delete the output directory but `.twelvety.cache`, things will break.

___

</details>

<details>
<summary><strong><code>append</code> paired shortcode and transform</strong></summary>
<br>

Okay folks, here it is: the one _gotcha_ with Twelvety. In order for the `styles` shortcode to work, it must come after all `stylesheet` paired shortcodes, which would usually be in the `body`. However, if we want our CSS to be linked or inlined in the `head`. This is where the `append` paired shortcode and transform come in, to move the output of the `styles` shortcode back into the `head` where we want it.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Everything in append paired shortcode will be moved here -->
  </head>
  <body>
    <!-- Stylesheet paired shortcodes can go here -->
    ...
    <!-- Append paired shortcode with styles inside -->
    {% append 'head' %}
      <style>
        {% styles page.url %}
      </style>
    {% endappend %}
  </body>
</html>
```

The `append` paired shortcode will actually be replaced with a `template`. The `append` transform then uses [jsdom](https://github.com/jsdom/jsdom) to append the contents of the `template` to the given selector (in this case, `head`).

The same problem exists for the `script` shortcode, however, this is not such a problem because it's very common to include JavaScript from the bottom of `body` anyway.

### Possible Workarounds

Nunjucks' `block`s may be a solution to this problem but they would tie Twelvety to nunjucks which I'd rather avoid. Another option is replacing the `{% styles page.url %}` with a placeholder (for example, `<div data-styles="{{ page.url }}">`) which could then be exchanged for the styles using a transform, instead of a shortcode.

___

</details>

<details>
<summary><strong><code>markdown</code> paired shortcode and configuration</strong></summary>
<br>

Twelvety sets its own instance of markdown-it. The configuration options are:

```js
{
  html: true,
  breaks: true,
  typographer: true
}
```

Twelvety also modifies the `image` rule of the renderer: instead of outputting an `img` element, Twelvety uses the responsive `picture` shortcode to render each image. If you want to disable this, remove the following lines in `utils/markdown.js`.

```js
md.renderer.rules.image = function(tokens, index) {
  const token = tokens[index]
  const src = token.attrs[token.attrIndex('src')][1]
  const alt = token.content
  return pictureShortcode(src, alt)
}
```

Twelvety also adds a `markdown` paired shortcode which uses the markdown-it configuration.

```html
{% markdown %}
# `markdown` paired shortcode

Let's you use **Markdown** like _this_.
{% endmarkdown %}
```

This is also really useful for including Markdown files into a template.

```html
{% markdown %}
  {%- include 'content.md' -%}
{% endmarkdown %}
```

Be careful of the [common pitfall of indented code blocks](https://www.11ty.dev/docs/languages/markdown/#there-are-extra-and-in-my-output) when using the `markdown` paired shortcode.

___

</details>

<details>
<summary><strong><code>critical</code> transform</strong></summary>
<br>

The `critical` transform extracts and inlines critical-path CSS on every page using [critical](https://github.com/addyosmani/critical). Currently, the critical CSS is **not** removed from the linked CSS file(s), which means that some CSS may be loaded twice; I'm looking into a solution for this.

___

</details>

<details>
<summary><strong><code>format</code> transform</strong></summary>
<br>

The `format` transform beautifies HTML in development using [JS Beautifier](https://github.com/beautify-web/js-beautify) and minifies HTML in production using [HTMLMinifier](https://github.com/kangax/html-minifier). Any inline CSS and JavaScript will also be beautified or minified.

___

</details>

## Visual Studio Code

If you're using Visual Studio Code I recommend this [Liquid extension](https://github.com/panoply/vscode-liquid) so that your Sass and JavaScript will be highlighted correctly.
