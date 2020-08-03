"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const fs = require("fs");
const aws_sdk_1 = require("aws-sdk");
const mime_1 = require("mime");
const Fs_1 = require("firejsx/utils/Fs");
const zlib_1 = require("zlib");
exports.default = (function ({ postExport }, { custom, staticDir, outDir, args, cli }) {
    //work only when exported
    if (args["--export"]) {
        //check config and arg
        let _a = custom, _b = _a.S3Publish, _c = _b === void 0 ? {} : _b, { putStaticDir = true, Bucket, gzip = true, CacheControl = path => path.endsWith('html') || path.endsWith('.map.js') ? 'max-age:360' : 'max-age=31536000' } = _c, extra = __rest(_c, ["putStaticDir", "Bucket", "gzip", "CacheControl"]), { Aws } = _a;
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
                        function putObj(err, Body) {
                            err ?
                                reject(err) :
                                s3.putObject(Object.assign(Object.assign({}, extra), { Bucket, 
                                    //we dont want .html in html files
                                    Key: `${prefix}${ext === 'html' ? Key.substring(0, dot - 1) : Key}`, ContentType: mime_1.getType(ext), Body, ContentEncoding: gzip ? 'gzip' : undefined, CacheControl: CacheControl(path) }), err => err ?
                                    cli.error(`[S3Publish] ${path}`, err) && reject() :
                                    cli.ok(`[S3Publish] ${path}`) && resolve());
                        }
                        fs_1.readFile(path, gzip ?
                            (err, data) => err ? reject(err) : zlib_1.gzip(data, putObj) :
                            putObj);
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
