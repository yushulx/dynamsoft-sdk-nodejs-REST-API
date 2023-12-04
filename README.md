# Node.js REST Endpoints for Dynamsoft SDKs
This repository demonstrates how to build RESTful APIs with Node.js for Dynamic Web TWAIN (**Document Scanning**), Dynamsoft Barcode Reader (**Barcode Reading**), Dynamsoft Label Recognizer (**MRZ Recognition**) and Dynamsoft Document Normalizer (**Document Rectification**).

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