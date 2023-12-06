# Node.js REST Endpoints for Dynamsoft SDKs
This repository demonstrates how to build RESTful APIs with Node.js for Dynamic Web TWAIN (**Document Scanning**), Dynamsoft Barcode Reader (**Barcode Reading**), Dynamsoft Label Recognizer (**MRZ Recognition**) and Dynamsoft Document Normalizer (**Document Rectification**).



https://github.com/yushulx/dynamsoft-sdk-nodejs-REST-API/assets/2202306/d85401ca-d17c-4af4-b8d0-57d645dbbd28



## Usage
1. Request a 30-day FREE trial license [here](https://www.dynamsoft.com/customer/license/trialLicense) for different SDKs, and then update the license keys in the `app.js` file.
    
    ```javascript
    // Dynamic Web TWAIN
    let parameters = {
        license: "LICENSE-KEY",
    };
    
    // Dynamsoft Barcode Reader
    barcode4nodejs.initLicense(
        "LICENSE-KEY",
    );

    // Dynamsoft Label Recognizer
    mrz4nodejs.initLicense(
        "LICENSE-KEY",
    );

    // Dynamsoft Document Normalizer
    docrectifier4nodejs.initLicense(
        "LICENSE-KEY",
    );
    ```

2. Install Dynamsoft service for Dynamic Web TWAIN:
    
    - Windows: [Dynamsoft-Service-Setup.msi](https://demo.dynamsoft.com/DWT/DWTResources/dist/DynamsoftServiceSetup.msi)
    - macOS: [Dynamsoft-Service-Setup.pkg](https://demo.dynamsoft.com/DWT/DWTResources/dist/DynamsoftServiceSetup.pkg)
    - Linux: 
        - [Dynamsoft-Service-Setup.deb](https://demo.dynamsoft.com/DWT/DWTResources/dist/DynamsoftServiceSetup.deb)
        - [Dynamsoft-Service-Setup-arm64.deb](https://demo.dynamsoft.com/DWT/DWTResources/dist/DynamsoftServiceSetup-arm64.deb)
        - [Dynamsoft-Service-Setup-mips64el.deb](https://demo.dynamsoft.com/DWT/DWTResources/dist/DynamsoftServiceSetup-mips64el.deb)
        - [Dynamsoft-Service-Setup.rpm](https://demo.dynamsoft.com/DWT/DWTResources/dist/DynamsoftServiceSetup.rpm)
        
3. Run the app:

    ```bash
    npm install
    npm start
    ```

4. Open a web browser and visit `http://localhost:3000/`.
    ![image](https://github.com/yushulx/dynamsoft-sdk-nodejs-REST-API/assets/2202306/a607edc8-73ff-4b93-b956-c9bc669b8970)

## Microsoft Power App Demo
The following API endpoints can empower low-code platforms.
- `/dynamsoft/dbr/DecodeBarcode/base64` - Decodes barcodes from a base64 encoded image.
- `/dynamsoft/dlr/DetectMrz/base64` - Detects Machine Readable Zones (MRZ) in a base64 encoded image.
- `/dynamsoft/ddn/rectifyDocument/base64` - Rectifies document images from a base64 encoded input.

https://github.com/yushulx/dynamsoft-sdk-nodejs-REST-API/assets/2202306/6160986e-5ebf-4f39-bd88-8bcebc105ae5


