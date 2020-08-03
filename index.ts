import {createReadStream} from "fs"
import * as fs from "fs"
import {Config as AWS_CONFIG} from "aws-sdk/lib/config"
import {S3} from "aws-sdk"
import {getType} from "mime"
import {readDirRecursively} from "firejsx/utils/Fs"
import {Plugin} from "firejsx/types/Plugin";
import {createGzip} from "zlib"

interface Config {
    Aws: AWS_CONFIG
    S3Publish: {
        Bucket: string,
        rmDist: boolean,
        putStaticDir: boolean,
        gzip: boolean
    }
}

export default <Plugin>function ({postExport}, {custom, staticDir, outDir, args, cli}) {
    //work only when exported
    if (args["--export"]) {
        //check config and arg
        let {S3Publish: {putStaticDir = true, Bucket, gzip = true} = {}, Aws} = <Config>custom

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
                        s3.putObject({
                            Bucket,
                            //we dont want .html in html files
                            Key: `${prefix}${ext === 'html' ? Key.substring(0, dot - 1) : Key}`,
                            ContentType: getType(ext),
                            ...(() => {
                                if (gzip)
                                    return {
                                        Body: createReadStream(path).pipe(createGzip()),
                                        ContentEncoding: 'gzip'
                                    }
                                else
                                    return {
                                        Body: createReadStream(path)
                                    }
                            })()
                        }, err => {
                            if (err) {
                                cli.error(`[S3Publish] ${path}`)
                                reject()
                            } else {
                                cli.ok(`[S3Publish] ${path}`)
                                resolve()
                            }
                        })
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