# publibike-checker
This project is a simple web server intended to give the current number of bikes available at selected Publibike stations (Switzerland). The result from the server is raw text, it is intended to be used conjointly with a mobile widget which executes the request when clicked and displays the result directly (e.g. "HTTP Request Widget" on Android).

## Installation

```
npm install
node index.js
```
## Usage

To get the number of bikes, simply configure the widget (or make a plain HTTP GET request) to issue a GET request to the server root URL.
- The different stations are fetched by giving key-value pairs in the request string: the key is the (arbitrary) name of the station, and the value is the ID of the station on the Publibike API (you need to get this ID yourself by analyzing the network requests in your browser when selecting the station on Publibike's website map).
- The type of bike ("E-Bike" or "Bike") can be specified as "type" key in the query string. When no parameter is given, both types of bikes are counted.
- The e-bike with highest battery level can be retrieved along with the stations by adding a "battery" query string argument set to true. In this case, a new line will be added under each station with the name of the bike having the highest battery level (when available).

An example request would be: 
```
http://mydomain.org:3000/?type=E-Bike&home=233&work=29&battery=true
```
An instance of the server is available at 
```
http://publibike.decensor.yt
```
Note that the API and this server may change at any time.
