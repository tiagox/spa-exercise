# SPA Exercise

This is exercise application used as a demostration of the way I work in a small full-stack environment.

This is a single page application that displays a list of items. These items must include a picture and a description.

If for any reason you what to check what this application's requirements are, please check the [intructions page](INSTRUCTIONS.md).

## Stack

### Infrastructure & things

- Docker
- docker-compose
- Prettier (to format the JS files)

### Backend

- Node.js
- Express.js
- Multer (to support upload of files in Express.js)
- Mongoose (as a MondoDB OMD)

### Frontend

- VanillaJS
- SortableJS (to add drag&drop and sorting capabilities)
- Parcel (to bundle the application and enable ES6 funtionalities)
- SASS (to write the CSS)

## Notes about the code

### ID reference for DOM elements

I've extensibly used a HTML/JavaScript feature I've recently discovered and it might be new for you too:

In the browser environment you can reference to the DOM elements by its ID like a `window.ID` reference, as following:

```html
<button id="saveButton">Save</button>
```

and then use it in JavaScript like:

```javascript
saveButton.addEventListener('click', event => { /* ... */ }
```

### Semicolons

If you've checked the code, you've might noticed that I don't like them and Prettier take care of them, so this is not a big deal, just a code styling preference.

### Frontend code splitting

I haven't splitted the frontend code in different files. To be honest I don't think that is really necessary, yet...

## Run the app

The application infrastractura is based on Docker you that's all you need (oh, and `docker-compose`).

Just clone this repository and...

```
git clone git@github.com:tiagox/spa-exercise.git
cd spa-exercise
docker-compose up
```

Access to http://localhost:8080 and that sould be all!
