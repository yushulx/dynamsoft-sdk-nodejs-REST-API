const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyParser = require('body-parser');
const barcode4nodejs = require("barcode4nodejs")
const docscan4nodejs = require("docscan4nodejs");
const docrectifier4nodejs = require("docrectifier4nodejs");
const mrz4nodejs = require('mrz4nodejs');
const multer = require('multer');
const sharp = require('sharp');

barcode4nodejs.initLicense(
    "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==",
);

mrz4nodejs.initLicense(
    "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==",
);

let mrzScanner = new mrz4nodejs();
let ret = mrzScanner.loadModel(path.dirname(require.resolve('mrz4nodejs')));
console.log('loadModel: ' + ret);

docrectifier4nodejs.initLicense(
    "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==",
);
let docRectifier = new docrectifier4nodejs();
docRectifier.setParameters(docrectifier4nodejs.Template.color);

app.use(cors());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const folderPath = path.join(__dirname, 'uploads');

if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
}

const upload = multer({ dest: 'uploads/' });


let dynamsoftService = 'http://127.0.0.1:18622';

// All products
app.get('/dynamsoft/product', (req, res) => {
    res.send(JSON.stringify(["Dynamic Web TWAIN",
        "Dynamsoft Barcode Reader",
        "Dynamsoft Label Recognizer",
        "Dynamsoft Document Normalizer",]));
});

// Dynamic Web TWAIN
app.get('/dynamsoft/dwt/getdevices', (req, res) => {

    docscan4nodejs.getDevices(dynamsoftService).then((scanners) => {
        res.send(scanners);
    });
});

app.post('/dynamsoft/dwt/ScanDocument', async (req, res) => {
    const json = req.body;

    let parameters = {
        license: "LICENSE-KEY",
        device: json['scan'],
    };

    parameters.config = {
        IfShowUI: false,
        PixelType: 2,
        //XferCount: 1,
        //PageSize: 1,
        Resolution: 200,
        IfFeederEnabled: false,
        IfDuplexEnabled: false,
    };

    try {
        let jobId = await docscan4nodejs.scanDocument(dynamsoftService, parameters);
        let filename = await docscan4nodejs.getImageFile(dynamsoftService, jobId, './uploads');
        console.log('Scanned file: ' + filename);
        res.send(JSON.stringify({
            'image': 'uploads/' + filename
        }));
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('An error occurred while processing the image.');
    }
});

// Dynamsoft Barcode Reader
app.post('/dynamsoft/dbr/DecodeBarcode', upload.single('image'), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        let result = await barcode4nodejs.decodeFileAsync(file.path, barcode4nodejs.barcodeTypes);
        console.log(result);
        res.status(200).send(result);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('An error occurred while processing the image.');
    }
});

// Dynamsoft Label Recognizer
app.post('/dynamsoft/dlr/DetectMrz', upload.single('image'), async (req, res) => {
    console.log('DetectMrz');
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        let result = await mrzScanner.decodeFileAsync(file.path);
        console.log(result);
        let output = "";
        if (result.length == 2) {
            output = mrzScanner.parseTwoLines(result[0].text, result[1].text);
        }
        else if (result.length == 3) {
            output = mrzScanner.parseThreeLines(result[0].text, result[1].text, result[2].text);
        }
        console.log(output);
        res.status(200).send(output);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('An error occurred while processing the image.');
    }
});

// Dynamsoft Document Normalizer
app.post('/dynamsoft/ddn/rectifyDocument', upload.single('image'), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        let results = await docRectifier.detectFileAsync(file.path);
        let result = results[0];
        result = await docRectifier.normalizeFileAsync(file.path, result['x1'], result['y1'], result['x2'], result['y2'], result['x3'], result['y3'], result['x4'], result['y4']);

        let data = result['data']
        let width = result['width']
        let height = result['height']
        for (let i = 0; i < data.length; i += 4) {
            const red = data[i];
            const blue = data[i + 2];
            data[i] = blue;
            data[i + 2] = red;
        }
        sharp(data, {
            raw: {
                width: width,
                height: height,
                channels: 4
            }
        })
            .jpeg() // Convert to JPEG
            .toBuffer() // Convert to buffer
            .then(jpegBuffer => {
                res.set('Content-Type', 'application/octet-stream');
                res.send(jpegBuffer);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('An error occurred while processing the image.');
            });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('An error occurred while processing the image.');
    }
});

// Start the server
const port = process.env.PORT || 3000;

server.listen(port, '0.0.0.0', () => {
    host = server.address().address;
    console.log(`Server running at http://0.0.0.0:${port}/`);
});