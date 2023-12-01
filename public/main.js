// Get Dynamsoft products.
let host = placeholder = 'http://192.168.8.72:3000/';
let dropdown = document.getElementById("dropdown");
function selectChanged() {
    switchProduct(dropdown.value)
}

function hideAll() {
    let divElement = document.getElementById("dwt");
    divElement.style.display = "none";

    divElement = document.getElementById("dbr");
    divElement.style.display = "none";

    divElement = document.getElementById("dlr");
    divElement.style.display = "none";

    divElement = document.getElementById("ddn");
    divElement.style.display = "none";
}

function switchProduct(name) {
    if (name === 'Dynamic Web TWAIN') {
        let divElement = document.getElementById("dwt");
        divElement.style.display = "block";

        divElement = document.getElementById("dbr");
        divElement.style.display = "none";

        divElement = document.getElementById("dlr");
        divElement.style.display = "none";

        divElement = document.getElementById("ddn");
        divElement.style.display = "none";
    }
    else if (name === 'Dynamsoft Barcode Reader') {
        let divElement = document.getElementById("dbr");
        divElement.style.display = "block";

        divElement = document.getElementById("dwt");
        divElement.style.display = "none";

        divElement = document.getElementById("dlr");
        divElement.style.display = "none";

        divElement = document.getElementById("ddn");
        divElement.style.display = "none";
    }
    else if (name == 'Dynamsoft Label Recognizer') {
        let divElement = document.getElementById("dlr");
        divElement.style.display = "block";

        divElement = document.getElementById("dwt");
        divElement.style.display = "none";

        divElement = document.getElementById("dbr");
        divElement.style.display = "none";

        divElement = document.getElementById("ddn");
        divElement.style.display = "none";
    }
    else if (name == 'Dynamsoft Document Normalizer') {
        let divElement = document.getElementById("ddn");
        divElement.style.display = "block";

        divElement = document.getElementById("dwt");
        divElement.style.display = "none";

        divElement = document.getElementById("dbr");
        divElement.style.display = "none";

        divElement = document.getElementById("dlr");
        divElement.style.display = "none";
    }
}

async function connect() {
    dropdown.innerHTML = "";
    host = document.getElementById("host").value == "" ? placeholder : document.getElementById("host").value;

    try {
        const response = await fetch(host + 'dynamsoft/product', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status == 200) {
            const products = await response.json();

            products.forEach(element => {
                let optionElement = document.createElement("option");
                optionElement.value = element;
                optionElement.text = element;
                dropdown.appendChild(optionElement);
            });
            switchProduct(dropdown.value)
        }
        else {
            hideAll();
        }

    } catch (error) {
        console.log(error);
    }


}

// Dynamic Web TWAIN
let selectSources = document.getElementById("sources");
let devices = [];

async function getDevices() {
    document.getElementById("loading-indicator").style.display = "flex";
    selectSources.innerHTML = "";
    let url = host + 'dynamsoft/dwt/getdevices';
    const response = await fetch(url, { "method": "GET" });

    if (response.status == 200) {

        try {
            let json = await response.json();
            if (json) {
                devices = json;
                json.forEach(element => {
                    let option = document.createElement("option");
                    option.text = element['name'];
                    option.value = element['name'];
                    selectSources.add(option);
                });
            }
        } catch (error) {
            console.log(error)
        }

    }
    document.getElementById("loading-indicator").style.display = "none";
}

async function acquireImage() {
    let url = host + 'dynamsoft/dwt/ScanDocument';
    if (devices.length > 0 && selectSources.selectedIndex >= 0) {
        let parameters = {
            device: devices[selectSources.selectedIndex]['device'],
            config: {
                IfShowUI: false,
                PixelType: 2,
                //XferCount: 1,
                //PageSize: 1,
                Resolution: 200,
                IfFeederEnabled: false,
                IfDuplexEnabled: false,
            }
        };

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parameters)
        });

        const result = await response.json();
        let img = document.getElementById('scanner-image');
        url = result['image'];
        img.src = url;

        let option = document.createElement("option");
        option.selected = true;
        option.text = url;
        option.value = url;

        let thumbnails = document.getElementById("thumb-box");
        let newImage = document.createElement('img');
        newImage.setAttribute('src', url);
        if (thumbnails != null) {
            thumbnails.appendChild(newImage);
            newImage.addEventListener('click', e => {
                if (e != null && e.target != null) {
                    let target = e.target;
                    img.src = target.src;
                }
            });
        }
    }

}

// Dynamsoft Barcode Reader
document.getElementById("barcode-file").addEventListener("change", function () {
    document.getElementById('barcode-result').innerHTML = '';
    let currentFile = this.files[0];
    if (currentFile == null) {
        return;
    }
    var fr = new FileReader();
    fr.onload = function () {
        let image = document.getElementById('barcode-image');
        image.src = fr.result;
    }
    fr.readAsDataURL(currentFile);
});

async function decodeBarcode() {
    let url = host + 'dynamsoft/dbr/DecodeBarcode';

    const input = document.getElementById('barcode-file');
    const file = input.files[0];

    if (!file) {
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    let response = await fetch(url, {
        method: 'POST',
        body: formData
    });

    if (response.headers.get('Content-Type').includes('application/json')) {
        let data = await response.json();
        let content = 'total barcode(s) found: ' + data.length;
        let index = 0;
        data.forEach(element => {
            content += '\n';
            content += index + ". text: " + element['value'] + ", format: " + element['format'];
            index += 1;
        });
        document.getElementById('barcode-result').innerHTML = content;
    }
    else if (response.headers.get('Content-Type').includes('text/plain')) {
        let data = await response.text();
        document.getElementById('barcode-result').innerHTML = data;
    }
}

// Dynamsoft Label Recognizer
document.getElementById("mrz-file").addEventListener("change", function () {
    document.getElementById('barcode-result').innerHTML = '';
    let currentFile = this.files[0];
    if (currentFile == null) {
        return;
    }
    var fr = new FileReader();
    fr.onload = function () {
        let image = document.getElementById('mrz-image');
        image.src = fr.result;
    }
    fr.readAsDataURL(currentFile);
});

async function detectMrz() {
    let url = host + 'dynamsoft/dlr/DetectMrz';

    const input = document.getElementById('mrz-file');
    const file = input.files[0];

    if (!file) {
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    let response = await fetch(url, {
        method: 'POST',
        body: formData
    });

    if (response.headers.get('Content-Type').includes('application/json')) {
        let data = await response.json();
        document.getElementById('mrz-result').innerHTML = JSON.stringify(data);
    }
    else {
        let data = await response.text();
        document.getElementById('mrz-result').innerHTML = data;
    }
}

// Dynamsoft Document Normalizer
document.getElementById("document-file").addEventListener("change", function () {
    let currentFile = this.files[0];
    if (currentFile == null) {
        return;
    }
    var fr = new FileReader();
    fr.onload = function () {
        let image = document.getElementById('document-image');
        image.src = fr.result;
    }
    fr.readAsDataURL(currentFile);
});

async function rectifyDocument() {
    let url = host + 'dynamsoft/ddn/rectifyDocument';

    const input = document.getElementById('document-file');
    const file = input.files[0];

    if (!file) {
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    let response = await fetch(url, {
        method: 'POST',
        body: formData
    });

    if (response.status == 200) {
        const result = await response.json();
        let img = document.getElementById('document-rectified-image');
        img.src = result['image'];
        let divElement = document.getElementById("document-rectified-image");
        divElement.style.display = "block";

        divElement = document.getElementById("document-result");
        divElement.style.display = "none";
    }
    else {
        document.getElementById('document-result').innerHTML = await response.text();

        let divElement = document.getElementById("document-result");
        divElement.style.display = "block";

        divElement = document.getElementById("document-rectified-image");
        divElement.style.display = "none";
    }
}
