import fs = require('fs')
import Q = require('q')

var exists = Q.denodeify<boolean>(fs.exists);
var readFile = Q.denodeify<string>(fs.readFile);
var writeFile = Q.denodeify<any>(fs.writeFile);

var targetFile = process.argv[2];

if (!targetFile) console.log('Please specify the target file');
else {
    fs.exists(targetFile, targetExists => {
        //.then(targetExists => {
            if (!targetExists)
                throw new Error(`Target file not found: '${targetFile}'`);

            readFile(targetFile, 'utf8')
                .then(contents => addShebang(contents))
                .then(contents => writeFile(targetFile, contents))
                .fail(error => console.log(error))
                .then(() => process.exit());
        })
       
}

function addShebang(contents: string) {
    var sbRegex = new RegExp('^#!/usr/bin/env node');
    if (!contents.match(sbRegex)) {
        return '#!/usr/bin/env node\n\n' + contents;
    }
    else return contents;
}