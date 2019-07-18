# LookupLocation
A product lookup app for finding products at your local Walmart to help aide Walmart Associates.

This application is deployed static web app. Meaning you can use it right now, at 
https://kpatel20538.github.io/LookupLocation

This application relys on the Walmart Open RESTful API 
https://developer.walmartlabs.com/

## Operations

The app is able to search for items by name (along with an optional store id) or upc.

Items are then presented with pricing and a scannable Barcode (provided by JsBarcode).

One can search by upc scanning the barcode with your camera (works with smartphones and webcams) (provided by QuaggaJs)

Once the barcode is detected, the app will automatically search for item. Hinting rectangles are employed to give user an idea were the application is looking when searching for a barcode.

## Intended Use Cases

Walmart are armed with tools that can identify prices and stocking information from barcodes. However, should a customer ask if a given product is availible, their would be barcode to scan. This app can allow an associate to find an items by upc by name (with some assiatance from the item's thumbnail) and scan the generated barcode to retreive stocking information.

Should an associate lack these tools they can still make of the app's own scanning functionality to determining pricing and hints at possible locations for misplaced products.

## Successes

When compared to tools like Walton and Associate Toolkit apps, this tool succeed in being a more fault-tolerant and easy-to-use tool. 

When compared to the Official Walmart app, this tool provides barcode creation functionality not present in the orginal app. 

## Limitations

There is known security vulernability in that api keys are exposed to client. Removing this vulernability we require this app to be resturcted with a RESTful Service securing the keys and authorizing Queries. (This vulnerability is present in both Walton and Associate Toolkit)

The app does not premit search by text UPC. You must scan a barcode to search by UPC. Moving past this issue will require either a seperate UPC search screen, or some decision function that selects whether a given query is search-by-name vs. search-by-upc.

This app opts to implement a micro-framework over using industry-standard tools like React, VueJs, and Angular. This is issure can only resolve a full rewrite as much of the code is dependant on the microframework. Related issues to this is the use of ES6 modules without Babel Transpiling to ES3 ( thus breaking compability with older browsers), and the use of DomParser and Element.querySelector to generate/bind views ( instead of using a VirtualDOM to patch the Document )

The Embeding of QuaggaJS in this micro-framework is not elegant, but it can be improve on with library functions

The mobile-first principle has made desktop use of this app unintuitive. 

The use of monkey patching is questionable, and highlights the need for a framework.