// Get your token from https://cesium.com/ion/tokens
console.log('CesiumJS version: ' + Cesium.VERSION);
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NTA5OWFmYi0xYTNmLTRiOTAtODc3Yi0yOWM0MjgxMjc3YWUiLCJpZCI6MTY1Mzc3LCJpYXQiOjE2OTQxOTgxOTJ9.EEXcYZSBfyXI2t14GuQQPpIagDPqPshx5aD2zv4llL0';
Cesium.GoogleMaps.defaultApiKey = "AIzaSyA0SIcbfBXj0RYV7t7L5PITeNlHPd9h4DA";

// function WebGLGlobeDataSource(name) {
//   this._name = name;
//   this._changed = new Cesium.Event();
//   this._error = new Cesium.Event();
//   this._isLoading = false;
//   this._loading = new Cesium.Event();
//   this._entityCollection = new Cesium.EntityCollection();
//   this._heightScale = 10000000;
// }

// Object.defineProperties(WebGLGlobeDataSource.prototype, {
//   name: {
//       get: function() {
//           return this._name;
//       }
//   },
//   clock: {
//       value: undefined,
//       writable: false
//   },
//   entities: {
//       get: function() {
//           return this._entityCollection;
//       }
//   },
//   isLoading: {
//       get: function() {
//           return this._isLoading;
//       }
//   },
//   changedEvent: {
//       get: function() {
//           return this._changed;
//       }
//   },
//   errorEvent: {
//       get: function() {
//           return this._error;
//       }
//   },
//   loadingEvent: {
//       get: function() {
//           return this._loading;
//       }
//   }
// });

// WebGLGlobeDataSource.prototype.load = function(data) {
//   if (!Cesium.defined(data)) {
//       throw new Cesium.DeveloperError("data is required.");
//   }

//   this._setLoading(true);
//   const heightScale = this._heightScale;
//   const entities = this._entityCollection;

//   entities.suspendEvents();
//   entities.removeAll();

//   for (let i = 0; i < data.length; i += 3) {
//       const latitude = data[i];
//       const longitude = data[i + 1];
//       const height = data[i + 2];

//       if (height === 0) {
//           continue;
//       }

//       const color = Cesium.Color.fromHsl(0.6 - height * 0.5, 1.0, 0.5);
//       const surfacePosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
//       const heightPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, height * heightScale);

//       const polyline = new Cesium.PolylineGraphics();
//       polyline.material = new Cesium.ColorMaterialProperty(color);
//       polyline.width = new Cesium.ConstantProperty(2);
//       polyline.arcType = new Cesium.ConstantProperty(Cesium.ArcType.NONE);
//       polyline.positions = new Cesium.ConstantProperty([surfacePosition, heightPosition]);

//       const entity = new Cesium.Entity({
//           id: `index ${i.toString()}`,
//           polyline: polyline
//       });

//       entities.add(entity);
//   }

//   entities.resumeEvents();
//   this._changed.raiseEvent(this);
//   this._setLoading(false);
// };

// WebGLGlobeDataSource.prototype._setLoading = function(isLoading) {
//   if (this._isLoading !== isLoading) {
//       this._isLoading = isLoading;
//       this._loading.raiseEvent(this, isLoading);
//   }
// };


const viewer = new Cesium.Viewer("cesiumContainer", {
    timeline: false,
    animation: true,
    sceneModePicker: false,
    baseLayerPicker: false,
  });
  // const dataSource = new WebGLGlobeDataSource();
  // dataSource.load([
  //   34.060162, -118.219284, 100,
  //   34.051009, -118.245314, 150,
  //   34.055329, -118.237946, 80,
  //   34.043961, -118.240940, 110,
  //   34.065053, -118.236427, 130
  // ]);

  // viewer.clock.shouldAnimate = false;
  // viewer.dataSources.add(dataSource);

function goToLocation(latitude, longitude, height, heading = 0, pitch = -45, lonOffset = 0, latOffset = -(height / 100000)) {
    // Log the current camera position and orientation
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(longitude + lonOffset, latitude + latOffset, height),
        orientation: {
            heading: Cesium.Math.toRadians(heading),
            pitch: Cesium.Math.toRadians(pitch),
            roll: 0.0
        },
        duration: 2
    });
}

    goToLocation(33.8407, -118.2468, 100000);

    viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
        e.cancel = true;  // Cancel the default home button behavior
        goToLocation(33.8407, -118.2468, 100000);
    });
  

    function interpolatePoints(start, end, numPoints = 100) {
        const interpolatedPoints = [];
    
        for (let i = 0; i < numPoints; i++) {
            const fraction = i / (numPoints - 1);
            
            const latitude = start.latitude + fraction * (end.latitude - start.latitude);
            const longitude = start.longitude + fraction * (end.longitude - start.longitude);
            const height = start.height + fraction * (end.height - start.height);
    
            interpolatedPoints.push({
                latitude: latitude,
                longitude: longitude,
                height: height
            });
        }
    
        return interpolatedPoints;
    }
    
    const endPoint = {
        latitude: 34.05008,
        longitude: -118.25333,
        height: 280
    };
    
    const startPoint = {
        latitude: 34.0632583,
        longitude: -118.414617,
        height: 200
    };
    
    const flightData = interpolatePoints(startPoint, endPoint);
    
    console.log(flightData);
    
// Create a point for each.
for (let i = 0; i < flightData.length; i++) {
  const dataPoint = flightData[i];

  viewer.entities.add({
    description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
    position: Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height),
    point: { pixelSize: 10, color: Cesium.Color.RED }
  });
}
  // Hide the default globe as the Photorealistic 3D Tiles include terrain
  viewer.scene.globe.show = false;
  
  // Function to add Photorealistic 3D Tiles
  async function addPhotorealisticTiles() {
    try {
      // Replace the following line with the correct method to add the Google Photorealistic 3D Tiles
      const tileset = await Cesium.createGooglePhotorealistic3DTileset();
      viewer.scene.primitives.add(tileset);
    } catch (error) {
      console.log(`Error loading Photorealistic 3D Tiles: ${error}`);
    }
  }
  
  // Call the function to add the Photorealistic 3D Tiles
  addPhotorealisticTiles();

/* Initialize the viewer clock:
  Assume the radar samples are 30 seconds apart, and calculate the entire flight duration based on that assumption.
  Get the start and stop date times of the flight, where the start is the known flight departure time (converted from PST 
    to UTC) and the stop is the start plus the calculated duration. (Note that Cesium uses Julian dates. See 
    https://simple.wikipedia.org/wiki/Julian_day.)
  Initialize the viewer's clock by setting its start and stop to the flight start and stop times we just calculated. 
  Also, set the viewer's current time to the start time and take the user to that time. 
*/
const timeStepInSeconds = 30;
const totalSeconds = timeStepInSeconds * (flightData.length - 1);
const start = Cesium.JulianDate.fromIso8601("2020-03-09T23:10:00Z");
const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
// viewer.timeline.zoomTo(start, stop);
// Speed up the playback speed 50x.
viewer.clock.multiplier = 50;
// Start playing the scene.
viewer.clock.shouldAnimate = true;

// The SampledPositionedProperty stores the position and timestamp for each sample along the radar sample series.
const positionProperty = new Cesium.SampledPositionProperty();

for (let i = 0; i < flightData.length; i++) {
  const dataPoint = flightData[i];

  // Declare the time for this individual sample and store it in a new JulianDate instance.
  const time = Cesium.JulianDate.addSeconds(start, i * timeStepInSeconds, new Cesium.JulianDate());
  const position = Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height);
  // Store the position along with its timestamp.
  // Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
  positionProperty.addSample(time, position);

  viewer.entities.add({
    description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
    position: position,
    point: { pixelSize: 10, color: Cesium.Color.RED },
  });
}

// STEP 4 CODE (green circle entity)
// Create an entity to both visualize the entire radar sample series with a line and add a point that moves along the samples.

async function getDroneData(){
  console.log("creating drone");
  const resource = await Cesium.IonResource.fromAssetId(2314135);
  const airplaneEntity = viewer.entities.add({
    availability: new Cesium.TimeIntervalCollection([ new Cesium.TimeInterval({ start: start, stop: stop }) ]),
    position: positionProperty,
    model: {uri: resource},
    path: new Cesium.PathGraphics({ width: 3 }),
  });
}

getDroneData();

// Make the camera track this moving entity.

async function fetchData() {
    console.log('Fetching data...');
    const url = "https://adsbx-flight-sim-traffic.p.rapidapi.com/api/aircraft/json/lat/34.0407/lon/-118.2468/dist/25/";
    const headers = {
        "X-RapidAPI-Key": "a129c45c68mshbcc8bbe0572d46ap16eb71jsn638a7fcad839",
        "X-RapidAPI-Host": "adsbx-flight-sim-traffic.p.rapidapi.com"
    };
    
    try {
        const response = await fetch(url, { headers });
        const data = await response.json();
        console.log('Data fetched successfully:', data);
        return data.ac;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// // Get today's date
// const today = new Date();

// // Subtract an hour from the current time
// const oneHourAgo = new Date(today);
// oneHourAgo.setHours(today.getHours() - 1);

// // Function to format date to 'YYYY-MM-DDTHH:MM'
// function formatDate(date) {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
//   const day = String(date.getDate()).padStart(2, '0');
//   const hour = String(date.getHours()).padStart(2, '0');
//   const minute = String(date.getMinutes()).padStart(2, '0');
  
//   return `${year}-${month}-${day}T${hour}:${minute}`;
// }


// const URL = "https://www.airnowapi.org/aq/data";

// const PARAMS = {
//   startDate: formatDate(oneHourAgo),
//   endDate: formatDate(today),
//   parameters: 'CO',
//   BBOX: '-118.75,33.5,-117.5,34.5',
//   dataType: 'B',
//   format: 'application/json',
//   verbose: '0',
//   monitorType: '2',
//   includerawconcentrations: '1',
//   API_KEY: '0D892FD5-78A4-4BE4-9FA5-0FC0A1193FFD'
// };
  

async function updateViewer(flightData) {
    console.log('Updating viewer with flight data...');
    const entities = viewer.entities.values;
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        if (!(entity.path) && !(entity.cylinder)) {
            viewer.entities.remove(entity);
            i--;  // Adjust the index since we've modified the collection
        }
    }

    try {
        let airplaneUri = await Cesium.IonResource.fromAssetId(2295748);
        let isHelicopter = false;
    
        for (const dataPoint of flightData) {
            if (dataPoint.type.length === 3) {
                airplaneUri = await Cesium.IonResource.fromAssetId(2309852);
                isHelicopter = true;
                console.log("CHANGED TO HELICOPTER HELICOPTER");
                const position = Cesium.Cartesian3.fromDegrees(parseFloat(dataPoint.lon), parseFloat(dataPoint.lat), (parseFloat(dataPoint.alt) - 40) || 0);
            const heading = Cesium.Math.toRadians(parseFloat(dataPoint.trak - 90) || 0);
            const pitch = 0;
            const roll = 0;
            const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
            console.log("HELI ADDED")
            viewer.entities.add({
                position: position,
                model: {
                    uri: airplaneUri,
                    scale: new Cesium.CallbackProperty(function(time, result) {
                        var cameraPosition = viewer.camera.position;
                        var entityPosition = position;
                        var distance = Cesium.Cartesian3.distance(cameraPosition, entityPosition);
                        var scale = distance / 1000.0;
                        return Math.max(scale, 1000.0);
                    }, false)
                },
                orientation: orientation,
                description: `ICAO: ${dataPoint.icao}, Altitude: ${dataPoint.alt}, Speed: ${dataPoint.spd}`
            });
            }
            else    {
            const position = Cesium.Cartesian3.fromDegrees(parseFloat(dataPoint.lon), parseFloat(dataPoint.lat), (parseFloat(dataPoint.alt) - 40) || 0);
            const heading = Cesium.Math.toRadians(parseFloat(dataPoint.trak - 90) || 0);
            const pitch = 0;
            const roll = 0;
            const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
    
            viewer.entities.add({
                position: position,
                model: {
                    uri: airplaneUri,
                    scale: new Cesium.CallbackProperty(function(time, result) {
                        var cameraPosition = viewer.camera.position;
                        var entityPosition = position;
                        var distance = Cesium.Cartesian3.distance(cameraPosition, entityPosition);
                        var scale = distance / 750.0;
                        return Math.max(scale, 25.0);
                    }, false)
                },
                orientation: orientation,
                description: `ICAO: ${dataPoint.icao}, Altitude: ${dataPoint.alt}, Speed: ${dataPoint.spd}`
            });
        }
        }
        console.log('Viewer updated successfully.');
    } catch (error) {
        console.error('Error updating viewer:', error);
    }
    
    
}


const today = new Date();


// Subtract an hour from the current time
const oneHourAgo = new Date(today);
oneHourAgo.setHours(today.getHours() - 1);


// Function to format date to 'YYYY-MM-DDTHH:MM'
function formatDate(date) {
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
const day = String(date.getDate()).padStart(2, '0');
const hour = String(date.getHours()).padStart(2, '0');
const minute = String(date.getMinutes()).padStart(2, '0');
return `${year}-${month}-${day}T${hour}:${minute}`;
}




const URL = "https://www.airnowapi.org/aq/data";


const PARAMS = {
startDate: formatDate(oneHourAgo),
endDate: formatDate(today),
parameters: 'PM25',
BBOX: '-118.75,33.5,-117.5,34.5',
dataType: 'B',
format: 'application/json',
verbose: '0',
monitorType: '2',
includerawconcentrations: '1',
API_KEY: '0D892FD5-78A4-4BE4-9FA5-0FC0A1193FFD'
};


// Construct the full URL with parameters
const fullUrl = `${URL}?${new URLSearchParams(PARAMS).toString()}`;


// Fetch the data
fetch(fullUrl)
.then(response => response.json())
.then(data => {
console.log(data);
const transformedData = data.map(dataPoint => {
return [dataPoint.Latitude, dataPoint.Longitude, dataPoint.Value];
}).flat();
console.log(transformedData);
for (let i = 0; i < transformedData.length; i += 3) {
const latitude = transformedData[i];
const longitude = transformedData[i + 1];
const height = transformedData[i + 2];


if (height === 0) {
continue;
}


const color = Cesium.Color.fromHsl(0.6 - height / 100 , 1.0, 0.5);
const surfacePosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
const cylinderHeight = height * 1000; // Adjust the height scale as needed
const cylinderRadius = 500; // Adjust the radius as needed


// Cylinder (main body)
viewer.entities.add({
position: surfacePosition,
cylinder: {
length: cylinderHeight,
topRadius: cylinderRadius,
bottomRadius: cylinderRadius,
material: color
}
});
}


})
.catch(error => {
console.error("Error fetching data:", error);
});



async function mainLoop() {
    console.log('Main loop started.');
    while (true) {
        try {
            const flightData = await fetchData();
            await updateViewer(flightData);
            console.log('Waiting for 10 seconds before fetching again...');

            await new Promise(resolve => setTimeout(resolve, 10000));  // Wait for 10 seconds before fetching again
        } catch (error) {
            console.error('Error in main loop:', error);
        }
    }
}

mainLoop();