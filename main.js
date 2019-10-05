

function convertCsv(data, srcFileName) {
    //console.log('processing...');
    let srcData = $.csv.toArrays(data, {
        separator: ';'
    });
    //console.log(csv);

    let dstData = [];
    for (let i = 1; i < srcData.length; ++i) {
        let s = srcData[i];
        let fileName = s[1];
        fileName = fileName.split('.').slice(0, -1).join('.');
        let description = s[2] + '. ' + s[4];
        let keywords = s[3].split(',');
        let row = [
            fileName,
            description,
            "",
            keywords.join(';'),
            ""
        ];
        dstData.push(row);
    }

    let result = $.csv.fromArrays(dstData);
    let blob = new Blob([result], {
        type: "text/csv;charset=utf-8"
    });

    saveAs(blob, srcFileName + '.converted.csv');
}

function dropHandler(ev) {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
                let file = ev.dataTransfer.items[i].getAsFile();
                console.log('... file[' + i + '].name = ' + file.name);

                let reader = new FileReader();
                reader.onload = function(e){
                    console.log(e.target.result);
                    convertCsv(e.target.result, file.name);
                };
                reader.readAsText(file);
            }
        }
    }
}

function dragOverHandler(ev) {
    //console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}
