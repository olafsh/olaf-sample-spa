# OLAF Sample SPA

This is an Angular sample app for OLAF. 

## How to start?

First you need to register your custom domain in `hosts`. In terminal open `/etc/hosts` and add column:

```
127.0.0.1 olaf-sample.local
```

Then is time to change host in `package.json` file. Find `scripts` and `start` and change flag `--host` with your custom domain.

The file should look like this:

```
...
"scripts": {
  "ng": "ng",
  "start": "ng serve --host olaf-sample.local --ssl --disable-host-check",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test"
},
...
```

Flags `--ssl` and `--disable-host-check` have to be present as well, because OLAF service supports only secure connections and cryptography works well with SSL connection.

Don't worry, this will not unlock security issues, but just allow you to use custom domain instead of `localhost`.

## Development server

Run `npm start` for a dev server. Navigate to `http://olaf-sample.local:4200/`. The application will automatically reload if you change any of the source files.
