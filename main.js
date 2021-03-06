
function uppercaseAllWords(words) {
    return _.map(words.split(' '), function (w) {
        return w.charAt(0).toUpperCase() + w.substring(1);
    }).join(' ');
}

function normalizeFileName(fileName) {
    let i = fileName.toLowerCase().indexOf('.mp4');
    if (i !== -1) {
        return fileName.substring(0, i + 4);
    }
    i = fileName.indexOf('.');
    if (i !== -1) {
        return fileName.substring(0, i);
    }
    return fileName;
}

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
        //fileName = fileName.split('.').slice(0, -1).join('.');
        fileName = normalizeFileName(fileName);
        let description = s[2] + '. ' + s[4];
        let keywords = s[3].split(',');
        // keywords = _.map(keywords, uppercaseAllWords);
        let row = [
            fileName,
            description,
            description + '.',
            keywords.join(';'),
            ""
        ];
        dstData.push(row);
    }

    let result = $.csv.fromArrays(dstData);
    let blob = new Blob([result], {
        type: "text/csv;charset=utf-8"
    });

    srcFileName = srcFileName.split('.').slice(0, -1).join('.');
    saveAs(blob, srcFileName + '.CONVERTED.csv');
}

function loadCsvFile(f) {
    let reader = new FileReader();
    reader.onload = function(e) {
        //console.log(e.target.result);
        convertCsv(e.target.result, f.name);
    };
    reader.readAsText(f);
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
                //console.log('... file[' + i + '].name = ' + file.name);
                loadCsvFile(file);
            }
        }
    }
}

function dragOverHandler(ev) {
    //console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

function triggerOpenFile(ev) {
    $('#file-input').trigger('click');
}

$( document ).ready(function() {
    $('#button').on('click', function() {
        $('#file-input').trigger('click');
    });
});

function selectFile(e) {
    //console.log('selectFile');
    let file = e.target.files[0];
    console.log(file);
    loadCsvFile(file);
}
