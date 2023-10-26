// Get your token from https://cesium.com/ion/tokens
console.log('CesiumJS version: ' + Cesium.VERSION);
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NTA5OWFmYi0xYTNmLTRiOTAtODc3Yi0yOWM0MjgxMjc3YWUiLCJpZCI6MTY1Mzc3LCJpYXQiOjE2OTQxOTgxOTJ9.EEXcYZSBfyXI2t14GuQQPpIagDPqPshx5aD2zv4llL0';
Cesium.GoogleMaps.defaultApiKey = "AIzaSyA0SIcbfBXj0RYV7t7L5PITeNlHPd9h4DA";


const viewer = new Cesium.Viewer("cesiumContainer", {
    timeline: false,
    animation: true,
    sceneModePicker: false,
    baseLayerPicker: false,
  });

function goToLocation(latitude, longitude, height, heading = 0, pitch = -45, lonOffset = 0, latOffset = -(height / 100000)) {
    // Log the current camera position and orientation
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(longitude + lonOffset, latitude + latOffset, height),
        orientation: {
            heading: Cesium.Math.toRadians(heading),
            pitch: Cesium.Math.toRadians(pitch),
            roll: 0.0
        },
        duration: 0.5
    });
}
    goToLocation(34.0837, -118.4134, 1000);

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
    for (let i = 0; i < flightData.length; i++) {
        
        flightData[i].height += -1 * (i-0) * (i-100);
    }
    
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

async function getDroneData()   {
  console.log("creating drone");
  const resource = await Cesium.IonResource.fromAssetId(2295748);
  const scale_factor = 60;
  const airplaneEntity = viewer.entities.add({
    availability: new Cesium.TimeIntervalCollection([ new Cesium.TimeInterval({ start: start, stop: stop }) ]),
    position: positionProperty,
    model: {
        uri: resource,
        scale: scale_factor // This makes the model 100x bigger
    },
    path: new Cesium.PathGraphics({ width: 300 / scale_factor }),  // Adjusting the path width to be consistent with the bigger model
});

  viewer.trackedEntity = airplaneEntity;
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


const BASE_PARAMS = {
    startDate: formatDate(oneHourAgo),
    endDate: formatDate(today),
    BBOX: '-118.75,33.5,-117.5,34.5',
    dataType: 'B',
    format: 'application/json',
    verbose: '0',
    monitorType: '2',
    includerawconcentrations: '1',
    API_KEY: '0D892FD5-78A4-4BE4-9FA5-0FC0A1193FFD'
};

const PARAMS_MAP = {
    PM25: {...BASE_PARAMS, parameters: 'PM25'},
    O3: {...BASE_PARAMS, parameters: 'O3'},
    NO2: {...BASE_PARAMS, parameters: 'NO2'},
};

let pm25Data, o3Data, no2Data;

async function fetchData(params) {
    const fullUrl = `${URL}?${new URLSearchParams(params).toString()}`;
    const response = await fetch(fullUrl);
    const data = await response.json();

    return data.map(dataPoint => [dataPoint.Latitude, dataPoint.Longitude, dataPoint.Value]).flat();
}

function displayData(transformedData, pollutantType) {
    // Clear previous entities but not all entities
    let entitiesToRemove = viewer.entities.values.filter(entity => entity.cylinder || entity.label);
    for (let entity of entitiesToRemove) {
        viewer.entities.remove(entity);
    }

    for (let i = 0; i < transformedData.length; i += 3) {
        const [latitude, longitude, height] = [transformedData[i], transformedData[i + 1], transformedData[i + 2]];
        if (height === 0) continue;

        let color;
        switch(pollutantType) {
            case 'PM25':
                color = new Cesium.Color(0.6 - height / 100, 1.0, 0.8, 1);
                break;
            case 'NO2':
                color = new Cesium.Color(1.0, 0.6 - height / 100, 1.0, 1);
                break;
            case 'O3':
                color = new Cesium.Color(0.5, 1.0, 0.6 - height / 100, 1);
                break;
            default:
                color = Cesium.Color.fromHsl(0.6 - height / 100, 1.0, 0.5);
        }

        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height * 500 + 100),  // +100 to display label just above the cylinder
            label: {
                text: height.toFixed(2),  // display the height value rounded to 2 decimal places
                font: '14pt sans-serif',
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -10)  // Offset to place it just above the cylinder
            }
        });

        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
            cylinder: {
                length: height * 1000,
                topRadius: 500,
                bottomRadius: 500,
                material: color
            }
        });
    }
}



(async function() {
    pm25Data = await fetchData(PARAMS_MAP.PM25);
    o3Data = await fetchData(PARAMS_MAP.O3);
    no2Data = await fetchData(PARAMS_MAP.NO2);
})().catch(error => console.error("Error fetching data:", error));

// Event listener for radio buttons
document.querySelectorAll("input[name='pollutant']").forEach(radio => {
    radio.addEventListener('change', (event) => {
        switch (event.target.value) {
            case 'PM25':
                displayData(pm25Data, 'PM25');;
                break;
            case 'O3':
                displayData(o3Data, 'O3');
                break;
            case 'NO2':
                displayData(no2Data, 'NO2');
                break;
        }
    });
});




async function mainLoop() {
    console.log('Main loop started.');
    while (true) {
        try {
            // const flightData = await fetchData();
            // await updateViewer(flightData);
            console.log('Waiting for 10 seconds before fetching again...');

            await new Promise(resolve => setTimeout(resolve, 10000));  // Wait for 10 seconds before fetching again
        } catch (error) {
            console.error('Error in main loop:', error);
        }
    }
}

mainLoop();
