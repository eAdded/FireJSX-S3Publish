"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const fs = require("fs");
const aws_sdk_1 = require("aws-sdk");
const mime_1 = require("mime");
const Fs_1 = require("firejsx/utils/Fs");
exports.default = (function ({ postExport }, { custom, staticDir, outDir, args, cli }) {
    //work only when exported
    if (args["--export"]) {
        //check config and arg
        let { S3Publish: { putStaticDir = true, Bucket } = {}, Aws } = custom;
        //check if bucket was given
        if (typeof Bucket !== "string")
            throw new Error(`[S3Publish] Expected String got ${typeof Bucket} for Bucket. Check your S3Publish config`);
        //init s3
        const s3 = new aws_sdk_1.S3(Aws);
        //post Export Hook
        postExport(async () => {
            const promises = [];
            function putObjs(prefix, root) {
                Fs_1.readDirRecursively(root, fs, path => {
                    let Key = path.replace(`${root}/`, '');
                    const dot = Key.lastIndexOf('.') + 1;
                    const ext = Key.substring(dot);
                    promises.push(new Promise((resolve, reject) => {
                        s3.putObject({
                            Bucket,
                            //we dont want .html in html files
                            Key: `${prefix}${ext === 'html' ? Key.substring(0, dot - 1) : Key}`,
                            Body: fs_1.createReadStream(path),
                            ContentType: mime_1.getType(ext),
                        }, err => {
                            if (err) {
                                cli.error(`[S3Publish] ${path}`);
                                reject();
                            }
                            else {
                                cli.ok(`[S3Publish] ${path}`);
                                resolve();
                            }
                        });
                    }));
                });
            }
            putObjs('', outDir);
            if (staticDir && putStaticDir)
                putObjs('static/', staticDir);
            await Promise.all(promises);
        });
    }
});
