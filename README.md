# OLAF Sample SPA

To add custom domain open file `angular.json`, find `serve` and add `options` section:

```
"options": {
  "host": "your-custom-domain",
  "port": 4200
}
```

For using custom domain you need to register custom domain in `hosts`. In terminal open `/etc/hosts` and add column:

```
127.0.0.1 your-custom-domain
```

And for the end you need to add flag `--disable-host-check` to `ng serve`.

For example: `ng serve --disable-host-check`

Don't worry, this will not unlock security issues, but just allow you to use custom domain instead of `localhost`.
