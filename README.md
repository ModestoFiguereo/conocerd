# ConoceRD website

**_conocerd.com_** website code.

## Getting it running

Once the repo is cloned in your machine, make sure to install the `npm` dependencies by running:
```sh
$ npm install
```

Then, make sure to install `bower` dependencies.
```sh
$ bower install
```

After that deploy the app to the server by typing:
```sh
$ gulp deploy
```

Then run the server:
```sh
$ npm start
```

Or you can accomplish the last two steps by typing this command:
```sh
$ npm run start-modestly
```

Finally run gulp and the webpage will open on localhost:3000 if the page stays blank after a while just close the browser tab and open the page again.

## Automated tasks
Gulp is used to tasks on `conocerd` project.

### `gulp clean`
> Clean tmp files and folders and build.

### `gulp concat-css`
> Concatenate all css files into a single file conocerd.css.

### `gulp minify-css`
> Minify conocerd.css and generate file conocerd.min.css.

### `gulp lint-js`
> Ensure js files have no syntax errors and comply with code standards.

### `gulp concat-js`
> Concatenate all js files into a single file conocerd.js.

### `gulp minify-js`
> Minify conocerd.js and generate file conocerd.min.js.

### `gulp build`
> Get files that matter from `src/` folder into `dist/` folder.

### `gulp compile-server`
> Transpile server files and get them to `.tmp/` folder.

### `gulp ship`
> Get files from `/dist` into `.tmp/public/` folder so the server can serve them.

### `gulp deploy`
> Run all the above task in sequence.
