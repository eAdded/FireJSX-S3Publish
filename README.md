# S3Publish

Simple, small [FireJSX](https://github.com/eAdded/FireJSX) plugin, which puts exported files from FireJSX to a S3 Bucket

## Install

install using **yarn** or **npm**

**yarn**

```bash
$ yarn add @firejsx/s3publish
```

**npm**

```bash
$ npm install @firejsx/s3publish
```

## Config

create a **firejsx.yml** file in the project root or specify one using `[ -c, --conf ]` flag.

Now you need to register the plugin and provide AWS Credentials

*firejsx.yml*

```yaml
plugins:
  - "@firejsx/s3publish"

custom:
  Aws:
    accessKeyId: string #enter accessKeyID of your IAM role here. Required
    secretAccessKey: string #enter secretAccessKey of your IAM role here. Required
    region: string #enter region of your s3 bucket. Required
    #You can put any other aws-sdk valid config here

  S3Publish:
    Bucket: string #enter Name of your s3 bucket. Required
    putStaticDir: boolean #put static dir to your s3 bucket. Defaults to true
    gzip: boolean #Gzip files. Defaults to true
    #You can put any other aws-sdk s3 putObject property here
```
**Consider using lib** [s3encode](https://www.npmjs.com/package/s3encode) **if your urls contains symbols like [?]**

## CacheControl

By default, files ending with `.html` and `.map.js` are set to `max-age:360` and others are set to `max-age=31536000`

To change cacheControl, you need to create a `firejsx.js` instead of `firejsx.yml` file in the project root dir

```javascript
exports.default = {
   custom: {
        //this is the default function to determine max-age
        CacheControl : path => path.endsWith('.html') || path.endsWith('.map.js') ? 'max-age:360' : 'max-age=31536000'
   }
}
```

## Code of conduct

Code of conduct can be found at [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Contributing

Make sure to read **Contribution Guidelines** at [CONTRIBUTING.md](CONTRIBUTING.md) before contributing.

## License & Copyright

Copyright (C) 2020 Aniket Prajapati

Licensed under the [MIT LICENSE](LICENSE)

## Contributors
 + [Aniket Prajapati](https://github.com/aniketfuryrocks) @ prajapati.ani306@gmail.com , [eAdded](http://www.eadded.com)
