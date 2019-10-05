


function convertCsv(data) {
    //console.log('processing...');
    let csv = $.csv.toObjects(data, {
        separator: ';'
    });
    //console.log(csv);

    csv.forEach(function(v){ delete v.Id });
    console.log(csv);

    let result = $.csv.fromObjects(csv);

    let blob = new Blob([result], {
        type: "text/plain;charset=utf-8"
    });

    saveAs(blob, 'result.csv');
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
                    convertCsv(e.target.result);
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
