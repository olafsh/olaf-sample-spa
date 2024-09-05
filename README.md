# OLAF Sample SPA

This is an Angular sample app for OLAF. 

## How to start?

Run command below:

```
ng serve --host {olaf-hostname} --port 4200 --ssl --disable-host-check
```

Flags `--ssl` and `--disable-host-check` have to be present as well, because OLAF service supports only secure connections and cryptography works well with SSL connection.

Don't worry, this will not unlock security issues, but just allow you to use custom domain instead of `localhost`.
