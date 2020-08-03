import {readFile} from "fs"
import * as fs from "fs"
import {Config as AWS_CONFIG} from "aws-sdk/lib/config"
import {S3} from "aws-sdk"
import {getType} from "mime"
import {readDirRecursively} from "firejsx/utils/Fs"
import {Plugin} from "firejsx/types/Plugin";
import {gzip as GZIP} from "zlib"

interface Config {
    Aws: AWS_CONFIG
    S3Publish: {
        Bucket: string,
        putStaticDir: boolean,
        gzip: boolean,
        CacheControl: (string) => string
        [key: string]: any
    }
}

export default <Plugin>function ({postExport}, {custom, staticDir, outDir, args, cli}) {
    //work only when exported
    if (args["--export"]) {
        //check config and arg
        let {
            S3Publish: {
                putStaticDir = true,
                Bucket,
                gzip = true,
                CacheControl = path => path.endsWith('.html') || path.endsWith('.map.js') ? 'max-age:360' : 'max-age=31536000',
                ...extra
            } = {}, Aws
        } = <Config>custom

        //check if bucket was given
        if (typeof Bucket !== "string")
            throw new Error(`[S3Publish] Expected String got ${typeof Bucket} for Bucket. Check your S3Publish config`)

        //init s3
        const s3 = new S3(Aws);
        //post Export Hook
        postExport(async () => {
            const promises = [];

            function putObjs(prefix, root) {
                readDirRecursively(root, fs, path => {
                    let Key = path.replace(`${root}/`, '')
                    const dot = Key.lastIndexOf('.') + 1;
                    const ext = Key.substring(dot);
                    promises.push(new Promise((resolve, reject) => {
                        function putObj(err, Body) {
                            err ? reject(err) :
                                s3.putObject({
                                        ...extra,
                                        Bucket,
                                        //we dont want .html in html files
                                        Key: `${prefix}${ext === 'html' ? Key.substring(0, dot - 1) : Key}`,
                                        ContentType: getType(ext),
                                        Body,
                                        ContentEncoding: gzip ? 'gzip' : undefined,
                                        CacheControl: CacheControl(path)
                                    }, err => err ?
                                    reject(void cli.error(`[S3Publish] ${path}`, err)) :
                                    resolve(void cli.ok(`[S3Publish] ${path}`))
                                )
                        }

                        readFile(path, gzip ?
                            (err, data) => err ? reject(err) : GZIP(data, putObj) :
                            putObj)
                    }))
                })
            }

            putObjs('', outDir)
            if (staticDir && putStaticDir)
                putObjs('static/', staticDir)
            await Promise.all(promises);
        })
    }
}