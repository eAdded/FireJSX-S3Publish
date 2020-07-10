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
    accessKeyId: #enter accessKeyID of your IAM role here. Required
    secretAccessKey: #enter secretAccessKey of your IAM role here. Required
    region: #enter region of your s3 bucket. Required
    #You can put any other aws-sdk valid config here

  S3Publish:
    Bucket: #enter Name of your s3 bucket. Required
    putStaticDir: #put static dir to your s3 bucket. Defaults to true
```

**Use plugin** [@firjsx/s3encode](https://www.npmjs.com/package/@firejsx/s3encode) **if your urls contain symbols like [?, +] etc**

## Code of conduct

Code of conduct can be found at [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Contributing

Make sure to read **Contribution Guidelines** at [CONTRIBUTING.md](CONTRIBUTING.md) before contributing.

## License & Copyright

Copyright (C) 2020 Aniket Prajapati

Licensed under the [MIT LICENSE](LICENSE)

## Contributors
 + [Aniket Prajapati](https://github.com/aniketfuryrocks) @ prajapati.ani306@gmail.com , [eAdded](http://www.eadded.com)
