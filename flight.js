// Get your token from https://cesium.com/ion/tokens
console.log('CesiumJS version: ' + Cesium.VERSION);
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NTA5OWFmYi0xYTNmLTRiOTAtODc3Yi0yOWM0MjgxMjc3YWUiLCJpZCI6MTY1Mzc3LCJpYXQiOjE2OTQxOTgxOTJ9.EEXcYZSBfyXI2t14GuQQPpIagDPqPshx5aD2zv4llL0';
Cesium.GoogleMaps.defaultApiKey = "AIzaSyA0SIcbfBXj0RYV7t7L5PITeNlHPd9h4DA";


const viewer = new Cesium.Viewer("cesiumContainer", {
    timeline: false,
    animation: false,
    sceneModePicker: false,
    baseLayerPicker: false,
  });

  addPhotorealisticTiles();

var color1 = 'rgb(0, 0, 0)';
var color2 = 'rgb(100, 0, 0)';
var height_multiplier = 70;
var threeDTiles = true;
var cmap_pollution = true;
var isLoopActive = false;





function goToLocation(latitude, longitude, height, heading = 0, pitch = -45, lonOffset = 0, latOffset = -(height / 100000)) {
    // Log the current camera position and orientation
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(longitude + lonOffset, latitude + latOffset, height),
        orientation: {
            heading: Cesium.Math.toRadians(heading),
            pitch: Cesium.Math.toRadians(pitch),
            roll: 0.0
        },
        duration: 3.0
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
    
//     const endPoint = {
//         latitude: 34.05008,
//         longitude: -118.25333,
//         height: 280
//     };
    
//     const startPoint = {
//         latitude: 34.0632583,
//         longitude: -118.414617,
//         height: 200
//     };
    
//     const flightData = interpolatePoints(startPoint, endPoint);
//     for (let i = 0; i < flightData.length; i++) {
        
//         flightData[i].height += -1 * (i-0) * (i-100);
//     }
    
//     console.log(flightData);
    
// // Create a point for each.
// for (let i = 0; i < flightData.length; i++) {
//   const dataPoint = flightData[i];

//   viewer.entities.add({
//     description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
//     position: Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height),
//     point: { pixelSize: 10, color: Cesium.Color.RED }
//   });
// }
  // Hide the default globe as the Photorealistic 3D Tiles include terrain
  viewer.scene.globe.show = true;
  
  // Global variable to keep track of the added tileset
let photorealisticTileset = null;

async function addPhotorealisticTiles() {
  try {
    // Assuming this method is correct for adding the tiles
    const tileset = await Cesium.createGooglePhotorealistic3DTileset();
    viewer.scene.primitives.add(tileset);
    // Save the reference to the added tileset for later removal
    photorealisticTileset = tileset;
    viewer.scene.globe.show = false;
    
  } catch (error) {
    console.log(`Error loading Photorealistic 3D Tiles: ${error}`);
  }
}

function deletePhotorealisticTiles() {
  if (photorealisticTileset) {
    // Remove the tileset from the scene
    viewer.scene.primitives.remove(photorealisticTileset);
    // Clear the reference
    photorealisticTileset = null;
    viewer.scene.globe.show = true;
  } else {
    console.log("No Photorealistic 3D Tiles to remove.");
  }
}

// Call the function to add the Photorealistic 3D Tiles
// addPhotorealisticTiles();

// When needed, call the function to delete the Photorealistic 3D Tiles
// deletePhotorealisticTiles();



/* Initialize the viewer clock:
  Assume the radar samples are 30 seconds apart, and calculate the entire flight duration based on that assumption.
  Get the start and stop date times of the flight, where the start is the known flight departure time (converted from PST 
    to UTC) and the stop is the start plus the calculated duration. (Note that Cesium uses Julian dates. See 
    https://simple.wikipedia.org/wiki/Julian_day.)
  Initialize the viewer's clock by setting its start and stop to the flight start and stop times we just calculated. 
  Also, set the viewer's current time to the start time and take the user to that time. 
*/
// const timeStepInSeconds = 30;
// const totalSeconds = timeStepInSeconds * (flightData.length - 1);
// const start = Cesium.JulianDate.fromIso8601("2020-03-09T23:10:00Z");
// const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
// viewer.clock.startTime = start.clone();
// viewer.clock.stopTime = stop.clone();
// viewer.clock.currentTime = start.clone();
// // viewer.timeline.zoomTo(start, stop);
// // Speed up the playback speed 50x.
// viewer.clock.multiplier = 50;
// // Start playing the scene.
// viewer.clock.shouldAnimate = true;

// The SampledPositionedProperty stores the position and timestamp for each sample along the radar sample series.
// const positionProperty = new Cesium.SampledPositionProperty();

// for (let i = 0; i < flightData.length; i++) {
//   const dataPoint = flightData[i];

//   // Declare the time for this individual sample and store it in a new JulianDate instance.
//   const time = Cesium.JulianDate.addSeconds(start, i * timeStepInSeconds, new Cesium.JulianDate());
//   const position = Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height);
//   // Store the position along with its timestamp.
//   // Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
//   positionProperty.addSample(time, position);

//   viewer.entities.add({
//     description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
//     position: position,
//     point: { pixelSize: 10, color: Cesium.Color.RED },
//   });
// }

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

//   viewer.trackedEntity = airplaneEntity;
}

getDroneData();

// Make the camera track this moving entity.

// async function printUniqueAircraftTypes(response) {
//     const data = await response.json();
//     console.log('Data fetched successfully:', data);
    
//     const aircraftTypes = data.ac.map(ac => ac.type); // Extract the 'type' from each aircraft
//     const uniqueAircraftTypes = [...new Set(aircraftTypes)]; // Remove duplicates
    
//     console.log('Unique Aircraft Types:', uniqueAircraftTypes);
//     return uniqueAircraftTypes; // Optional, in case you need the list elsewhere
// }

async function fetchPlaneData() {
    console.log('Fetching data...');
    const url = "https://adsbx-flight-sim-traffic.p.rapidapi.com/api/aircraft/json/lat/34/lon/-118.25/dist/25/";
    const headers = {
        "X-RapidAPI-Key": "a129c45c68mshbcc8bbe0572d46ap16eb71jsn638a7fcad839",
        "X-RapidAPI-Host": "adsbx-flight-sim-traffic.p.rapidapi.com"
    };
    
    try {
        const response = await fetch(url, { headers });
        // await printUniqueAircraftTypes(response);
        const data = await response.json();
        console.log('Data fetched successfully:', data);
        return data.ac;
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function updateThresholdLabels(newValues) {
    createIntervals(["green", "lime", "yellow", "orange", "red"], newValues);
  }
function generateRawThresholds(maxValue) {
    newValues = [0, maxValue / 5, maxValue *2  / 5, maxValue * 3 / 5, maxValue *4  / 5];
    return newValues;
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
        // let airplaneUri = await Cesium.IonResource.fromAssetId(2295748);
        let isHelicopter = false;
        // Define the colors using Cesium.IonResource.fromAssetId
    const red = await Cesium.IonResource.fromAssetId(2492972);
    const orange = await Cesium.IonResource.fromAssetId(2492971);
    const lime = await Cesium.IonResource.fromAssetId(2492970);
    const green = await Cesium.IonResource.fromAssetId(2492969);
    const yellow = await Cesium.IonResource.fromAssetId(2492974);

    // Function to get color based on altitude ratio
    async function getColorBasedOnAltitudeRatio(altitude) {
        const thresholds = [0.2, 0.4, 0.6, 0.8]; // Example altitude ratio thresholds
        const colors = [green, lime, yellow, orange, red]; // Corresponding Cesium.IonResource colors
        const defaultColor = red; // Default color if altitude is above all thresholds
        
        // Find the index of the first threshold greater than the altitude ratio
        const index = thresholds.findIndex(threshold => altitude <= threshold);
        
        // Return the corresponding Cesium.IonResource, or the default color if altitude is above all thresholds
        return index !== -1 ? colors[index] : defaultColor;
    }

    // Iterate through your flightData to add entities
    for (const dataPoint of flightData) {
        const position = Cesium.Cartesian3.fromDegrees(parseFloat(dataPoint.lon), parseFloat(dataPoint.lat), (parseFloat(dataPoint.alt) - 40) || 0);
        const heading = Cesium.Math.toRadians(parseFloat(dataPoint.trak) || 0);
        const pitch = 0;
        const roll = 0;
        const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

        carbon_emissions_per_100_miles = {
            'P28A': 65,
            'BE36': 80,
            'E170': 210,
            'A21N': 220,
            'C172': 60,
            'SLG2': 180,
            'B738': 200,
            'B763': 300,
            'B39M': 250,
            'GLAS': 150,
            'LNC2': 180,
            'C72R': 70,
            'F2TH': 350,
            'A320': 220,
            'G73T': 280,
            'C152': 50,
            'P28T': 70,
            'B737': 200,
            'SR22': 60,
            'A321': 230,
            'B789': 250,
            'B739': 220,
            'GLF5': 400,
            'CL35': 300,
            'D6SL': 280,
            'AS50': 90,
            'B78X': 270,
            'GLF3': 350,
            'AA5': 75,
            'PA32': 90,
            'PTS1': 100,
            'C560': 180,
            'CRJ7': 220,
            'B752': 280,
            'B350': 120,
            'SR20': 70,
            'R22': 40,
            'DA40': 60,
            'B38M': 250,
            'F900': 400,
            'S92': 500,
            'E55P': 250,
            'TOBA': 110,
            'R44': 45,
            'R66': 50,
            'B753': 280,
            'B407': 90,
            'A20N': 220,
            'GLF4': 380,
            'A319': 220,
            'E75L': 220,
            'S22T': 150,
            'B06': 400,
            'A388': 550,
            'C25C': 200,
            'E135': 150,
            'BE35': 80,
            'C182': 70,
            'GLF6': 450,
            'C700': 300,
            'C25B': 250,
            'CL60': 500,
            'C56X': 200
        }
        const emissions = carbon_emissions_per_100_miles[dataPoint.type] || 0;
        // Calculate altitude ratio
        const maxAltitude = 4200; // Maximum altitude for the data set
        const altitudeRatio = parseFloat(dataPoint.alt) / maxAltitude;
        const maxCO2Emissions = 600; // Maximum CO2 emissions for the data set
        const pollutionRatio = emissions / maxCO2Emissions;
        var colorResource;
        // Get the color (Cesium.IonResource) based on the altitude ratio
        if (cmap_pollution) {
            var rawThresholds = generateRawThresholds(maxCO2Emissions);
            updateThresholdLabels(rawThresholds);
            colorResource = await getColorBasedOnAltitudeRatio(pollutionRatio);
        }
        // else {
        //     var rawThresholds = generateRawThresholds(maxAltitude);
        //     updateThresholdLabels(rawThresholds);
        //     colorResource = await getColorBasedOnAltitudeRatio(altitudeRatio);
        // }

        // Add the entity with the model URI set based on the color (Cesium.IonResource)
        viewer.entities.add({
            position: position,
            model: {
                uri: colorResource,
                scale: new Cesium.CallbackProperty(function(time, result) {
                    var cameraPosition = viewer.camera.position;
                    var entityPosition = position;
                    var distance = Cesium.Cartesian3.distance(cameraPosition, entityPosition);
                    var scale = distance / 3500.0;
                    return Math.max(scale, 25.0);
                }, false)
            },
            orientation: orientation,
            description: `ICAO: ${dataPoint.icao}, Altitude: ${dataPoint.alt}, Speed: ${dataPoint.spd}, Emissions per 100 miles: ${emissions !== 0 ? `${emissions} kg of CO2 per 100 miles` : 'Data not available'}`,
        });
        


        // }
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

let pm25Data, o3Data, no2Data, pm25_predictions, traffic_counts, adult_asthma, poverty_data, income_data;

async function fetchData(params) {
    try {
        const fullUrl = `${URL}?${new URLSearchParams(params).toString()}`;
        const response = await fetch(fullUrl);
        
        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data fetched successfully:', data);
        return data.map(dataPoint => [dataPoint.Latitude, dataPoint.Longitude, dataPoint.Value]).flat();
    } catch (error) {
        // Output the error to the console or handle it as needed
        console.error('Fetch error:', error.message);
        throw error; // Rethrow the error if you want the calling function to handle it
    }
}

function normalizeData(data, time_series=false) {
    // Extract only every third value to normalize
    const valuesToNormalize = data.filter((_, index) => index % 3 === 2);
    var minVal = Math.min(...valuesToNormalize);
    var maxVal = Math.max(...valuesToNormalize);
    if (time_series) {
        minVal = 0;
        maxVal = 50;
    }
    console.log('Min and max values to update:', minVal, maxVal)
    updateLabels([minVal, maxVal]);
    // document.getElementById('minValue').textContent = minVal.toFixed(2);
    // document.getElementById('maxValue').textContent = maxVal.toFixed(2);
    console.log('Min and max values:', minVal, maxVal)
    // Return a new array with only the third values normalized
    return data.map((value, index) => {
        if (index % 3 === 2) { // Check if it is the third value
            // Normalize only the third value
            return (value - minVal) / (maxVal - minVal);
        } else {
            // Return the other values as they are
            return value;
        }
    });
}

function interpolateColor(height) {
    // Ensure height is between 0 and 1
    // console.log('begin interpolate color')
    height = Math.max(0, Math.min(1, height));

    // Parse the RGB values from the strings
    const fromColorComponents = color1.match(/\d+/g).map(Number);
    const toColorComponents = color2.match(/\d+/g).map(Number);

    // Interpolate between color1 and color2 for each RGB component
    let red = fromColorComponents[0] + (toColorComponents[0] - fromColorComponents[0]) * height;
    let green = fromColorComponents[1] + (toColorComponents[1] - fromColorComponents[1]) * height;
    let blue = fromColorComponents[2] + (toColorComponents[2] - fromColorComponents[2]) * height;

    // Return the interpolated color in 'rgb()' format
    // console.log('finish interpolate color')
    // console.log(`rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`)
    return `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`;
}

// Usage

function colorStringToCesiumColor(rgbString) {
    let parts = rgbString.match(/\d+/g).map(Number);
    return new Cesium.Color(parts[0] / 255, parts[1] / 255, parts[2] / 255, 1);
}

// Function to show the loading spinner
function enableLoadingSpinner() {
    console.log('Enabling loading spinner');
    var spinner = document.getElementById('loadingSpinner');
    spinner.style.display = 'block'; // Use 'block' to show the spinner
}

// Function to hide the loading spinner
function disableLoadingSpinner() {
    console.log('Disabling loading spinner');
    var spinner = document.getElementById('loadingSpinner');
    spinner.style.display = 'none'; // Use 'none' to hide the spinner
}



function displayData(transformedData, labels = false, height_divisor = 1, time_series = false) {

    enableLoadingSpinner();
    setTimeout(disableLoadingSpinner, 5000);
    // Normalize data before using it
    let preNormalizedData = transformedData;
    transformedData = normalizeData(transformedData, time_series=time_series);
    // console.log('Normalized data:', transformedData);

    // Clear previous entities but not all entities
    let entitiesToRemove = viewer.entities.values.filter(entity => entity.ellipsoid || entity.label);
    // console.log('Removing', entitiesToRemove.length, 'ellipsoids/labels');
    for (let entity of entitiesToRemove) {
        viewer.entities.remove(entity);
    }

    entitiesToRemove = viewer.entities.values.filter(entity => entity.cylinder);
    // console.log('Removing', entitiesToRemove.length, 'cylinders');
    for (let entity of entitiesToRemove) {
        viewer.entities.remove(entity);
    }
    var finalPosition = viewer.camera.positionWC;
    
    // Convert the position to cartographic coordinates (radians)
    var cartographicPosition = Cesium.Cartographic.fromCartesian(finalPosition);
    var pos_height = cartographicPosition.height;
    var opacity = 1.0
    if (pos_height < 10000) {
        opacity = 0.5;
    }
    height_multiplier = Math.min(200, pos_height / 1000);


    for (let i = 0; i < transformedData.length; i += 3) {
        const [latitude, longitude, rawHeight] = [transformedData[i], transformedData[i + 1], transformedData[i + 2]];
        const height = rawHeight / height_divisor;

        if (height === 0) {
            //console.log(`Skipping data point ${i/3} due to zero height.`);
            continue;
        }

        let color;
        color = interpolateColor(height);
        color = colorStringToCesiumColor(color);
        color = new Cesium.Color(color.red, color.green, color.blue, opacity);
        // console.log('Color:', color)

        if (labels) {
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height * 15000 + 100), // +100 to display label just above the cylinder
                label: {
                    text: preNormalizedData[i+2].toFixed(2), // display the height value rounded to 2 decimal places
                    font: '14pt sans-serif',
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -10) // Offset to place it just above the cylinder
                }
            });
            // console.log(`Label added for data point ${i/3}`);
        }

        
        
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
            cylinder: {
                length: height * 100 * (pos_height / 1000), // Scale the height by 3000
                topRadius: 500,
                bottomRadius: 500,
                material: color
            }
        });
        // updateCylindersToHeight();
        // console.log(`Cylinder added for data point ${i/3}`);
    }
}

function normalizeDataAtHeight(data) {
    // Extract only every third value to normalize
    const valuesToNormalize = data.filter((_, index) => index % 4 === 2);
    const minVal = Math.min(...valuesToNormalize);
    const maxVal = Math.max(...valuesToNormalize);
    document.getElementById('minValue').textContent = minVal.toFixed(2);
    document.getElementById('maxValue').textContent = maxVal.toFixed(2);
    console.log('Min and max values:', minVal, maxVal)
    // Return a new array with only the third values normalized
    return data.map((value, index) => {
        if (index % 4 === 2) { // Check if it is the third value
            // Normalize only the third value
            return (value - minVal) / (maxVal - minVal);
        } else {
            // Return the other values as they are
            return value;
        }
    });
}

function updateTooltipText(newText) {
    var tooltip = document.querySelector('.custom-tooltip');
    showNotification(newText);
    if (tooltip) {
        tooltip.textContent = newText;
    }
}

document.getElementById('3dInCheckbox').addEventListener('change', function() {

    if (!this.checked) {
        console.log('Removing photorealistic tiles')
        threeDTiles = false;
        if (document.getElementById('pollutantSelect').value === "Time Series Data") {
            // Your code here to execute if the selected value is "Time Series Data"
            displayTimeSeriesData();
        }
        deletePhotorealisticTiles();

    }
    if (this.checked)   {
        console.log('Adding photorealistic tiles')
        threeDTiles = true;
        if (document.getElementById('pollutantSelect').value === "Time Series Data") {
            // Your code here to execute if the selected value is "Time Series Data"
            displayTimeSeriesData();
        }
        addPhotorealisticTiles();
    }
    if(this.checked) {
        
    
        showNotification('3d tiles are on, time series data will take significantly longer to load');
      } else {
        showNotification('2d tiles will be shown.');
      }
});

function updateLegendUnits(units) {
    // Find the element that contains the units
    const unitsElement = document.getElementById('legendUnits');

    // Update the text content of the element to the new units
    unitsElement.textContent = units;
}



function displayDataAtHeight(transformedData, pollutantType, labels = true, sphere_scale = 1, value_divisor = 1) {
    // Clear previous entities

    let entitiesToRemove = viewer.entities.values.filter(entity => entity.ellipsoid || entity.label);
    for (let entity of entitiesToRemove) {
        viewer.entities.remove(entity);
    }
    entitiesToRemove = viewer.entities.values.filter(entity => entity.cylinder);
    for (let entity of entitiesToRemove) {
        viewer.entities.remove(entity);
    }

    // Find min and max values for the color map
    // const values = transformedData.filter((element, index) => index % 4 === 2); // Extract the third value
    // const minValue = Math.min(...values);
    // const maxValue = Math.max(...values);
    // // After finding min and max, update the legend with these values
    // document.getElementById('minValue').textContent = minValue.toFixed(2);
    // document.getElementById('maxValue').textContent = maxValue.toFixed(2);

    transformedData = normalizeDataAtHeight(transformedData);

    // Function to map value to a color between red and green based on min and max
    // function getValueColor(value) {
    //     const hue = (value - minValue) / (maxValue - minValue) * 120 / 360; // Map to 0-120 degrees of HSL color wheel (red-green)
    //     return Cesium.Color.fromHsl(hue, 1.0, 0.5, 0.4);
    // }

    for (let i = 0; i < transformedData.length; i += 4) {
        const [latitude, longitude, rawValue, height] = [transformedData[i], transformedData[i + 1], transformedData[i + 2], transformedData[i + 3]];
        // Scale the value for visualization purposes
        if (height == 0.0) {
            continue; // Skip the rest of the loop when i is 5
        }
        const scaledValue = rawValue / value_divisor;
        let color = interpolateColor(scaledValue);

        // Add the label for the value if required
        if (labels) {
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(longitude, latitude, (height / 3.281)),
                label: {
                    text: scaledValue.toFixed(2), // Display the value rounded to 2 decimal places
                    font: '14pt sans-serif',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -10) // Offset for the label
                }
            });
        }

        // Add the sphere positioned at the specified height
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
            ellipsoid: {
                radii: new Cesium.Cartesian3(250 * sphere_scale, 250 * sphere_scale, 250 * sphere_scale), // Sphere size can be scaled
                material: color
            }
        });
    }
}


let dataMap = {};
let timeStepCount = 1;
let isPlaying = false;
let playInterval;
var timeSeriesData;
var twoDtimeSeriesData


const pollutantColorMap = { 'from': 'rgb(0, 255, 0)', 'to': 'rgb(255, 0, 0)' }; // Example gradient colors
const socioeconomicColorMap = { 'from': 'rgb(0, 0, 255)', 'to': 'rgb(255, 255, 0)' };
const statColorMap = { 'from': 'rgb(100, 100, 0)', 'to': 'rgb(200, 0, 200)' };


const fileMappings = {
    'Data/no_data.json': ['No Data', pollutantColorMap, 'No specific definition provided.', ''],
    'Data/time-series-data/': ['Time Series Data', pollutantColorMap, 'PM2.5 Predictions for the next 5 days', 'μg/m³'],
    'Data/CES_4.0_Score.json': ['CES 4.0 Score', statColorMap, 'CalEnviroScreen Score, Pollution Score multiplied by Population Characteristics Score', ''],
    'Data/CES_4.0_Percentile.json': ['CES 4.0 Percentile', statColorMap, 'Percentile of the CalEnviroScreen score', ''],
    'Data/CES_4.0_Percentile_Range.json': ['CES 4.0 Percentile Range', statColorMap, 'Percentile of the CalEnviroScreen score, grouped by 5% increments', ''],
    'Data/Ozone.json': ['Ozone', pollutantColorMap, 'Amount of daily maximum 8 hour Ozone concentration', 'ppm'],
    'Data/Ozone_Pctl.json': ['Ozone Pctl', pollutantColorMap, 'Ozone percentile', ''],
    'Data/PM2.5.json': ['PM2.5', pollutantColorMap, 'Annual mean PM2.5 concentrations', 'μg/m³'],
    'Data/PM2.5_Pctl.json': ['PM2.5 Pctl', pollutantColorMap, 'PM2.5 percentile', ''],
    'Data/Diesel_PM.json': ['Diesel PM', pollutantColorMap, 'Diesel PM emissions from on-road and non-road sources', 'μg/m³'],
    'Data/Diesel_PM_Pctl.json': ['Diesel PM Pctl', pollutantColorMap, 'Diesel PM percentile', ''],
    'Data/Drinking_Water.json': ['Drinking Water', pollutantColorMap, 'Drinking water contaminant index for selected contaminants', ''],
    'Data/Drinking_Water_Pctl.json': ['Drinking Water Pctl', pollutantColorMap, 'Drinking water percentile', ''],
    'Data/Lead.json': ['Lead', pollutantColorMap, 'Potential risk for lead exposure in children living in low-income communities with older housing', ''],
    'Data/Lead_Pctl.json': ['Lead Pctl', pollutantColorMap, 'Children\'s lead risk from housing percentile', ''],
    'Data/Pesticides.json': ['Pesticides', pollutantColorMap, 'Total pounds of selected active pesticide ingredients used in production-agriculture per square mile', 'lbs/mi²'],
    'Data/Pesticides_Pctl.json': ['Pesticides Pctl', pollutantColorMap, 'Pesticides percentile', ''],
    'Data/Tox._Release.json': ['Tox. Release', pollutantColorMap, 'Toxicity-weighted concentrations of modeled chemical releases to air', 'TEQ'],
    'Data/Tox._Release_Pctl.json': ['Tox. Release Pctl', pollutantColorMap, 'Toxic release percentile', ''],
    'Data/CES_Traffic.json': ['Traffic', pollutantColorMap, 'Traffic density in vehicle-kilometers per hour per road length, within 150 meters of the census tract boundary', 'veh-km/hr'],
    'Data/CES_Traffic_Pctl.json': ['Traffic Pctl', pollutantColorMap, 'Traffic percentile', ''],
    'Data/Cleanup_Sites.json': ['Cleanup Sites', pollutantColorMap, 'Sum of weighted EnviroStor cleanup sites within buffered distances to populated blocks of census tracts', ''],
    'Data/Cleanup_Sites_Pctl.json': ['Cleanup Sites Pctl', pollutantColorMap, 'Cleanup sites percentile', ''],
    'Data/Groundwater_Threats.json': ['Groundwater Threats', pollutantColorMap, 'Sum of weighted GeoTracker leaking underground storage tank sites within buffered distances to populated blocks of census tracts', ''],
    'Data/Groundwater_Threats_Pctl.json': ['Groundwater Threats Pctl', pollutantColorMap, 'Groundwater threats percentile', ''],
    'Data/Haz._Waste.json': ['Haz. Waste', pollutantColorMap, 'Sum of weighted hazardous waste facilities and large quantity generators within buffered distances to populated blocks of census tracts', ''],
    'Data/Haz._Waste_Pctl.json': ['Haz. Waste Pctl', pollutantColorMap, 'Hazardous waste percentile', ''],
    'Data/Imp._Water_Bodies.json': ['Imp. Water Bodies', pollutantColorMap, 'Sum of number of pollutants across all impaired water bodies within buffered distances to populated blocks of census tracts', ''],
    'Data/Imp._Water_Bodies_Pctl.json': ['Imp. Water Bodies Pctl', pollutantColorMap, 'Impaired water bodies percentile', ''],
    'Data/Solid_Waste.json': ['Solid Waste', pollutantColorMap, 'Sum of weighted solid waste sites and facilities within buffered distances to populated blocks of census tracts', ''],
    'Data/Solid_Waste_Pctl.json': ['Solid Waste Pctl', pollutantColorMap, 'Solid waste percentile', ''],
    'Data/Pollution_Burden.json': ['Pollution Burden', pollutantColorMap, 'Average of percentiles from the Pollution Burden indicators', ''],
    'Data/Pollution_Burden_Score.json': ['Pollution Burden Score', pollutantColorMap, 'Pollution Burden variable scaled with a range of 0-10', ''],
    'Data/Pollution_Burden_Pctl.json': ['Pollution Burden Pctl', pollutantColorMap, 'Pollution burden percentile', ''],
    'Data/Asthma.json': ['Asthma', socioeconomicColorMap, 'Age-adjusted rate of emergency department visits for asthma', ''],
    'Data/Asthma_Pctl.json': ['Asthma Pctl', socioeconomicColorMap, 'Asthma percentile', ''],
    'Data/Low_Birth_Weight.json': ['Low Birth Weight', socioeconomicColorMap, 'Percent low birth weight', ''],
    'Data/Low_Birth_Weight_Pctl.json': ['Low Birth Weight Pctl', socioeconomicColorMap, 'Low birth weight percentile', ''],
    'Data/Cardiovascular_Disease.json': ['Cardiovascular Disease', socioeconomicColorMap, 'Age-adjusted rate of emergency department visits for heart attacks per 10,000', ''],
    'Data/Cardiovascular_Disease_Pctl.json': ['Cardiovascular Disease Pctl', socioeconomicColorMap, 'Cardiovascular disease percentile', ''],
    'Data/Education.json': ['Education', socioeconomicColorMap, 'Percent of population over 25 with less than a high school education', ''],
    'Data/Education_Pctl.json': ['Education Pctl', socioeconomicColorMap, 'Education percentile', ''],
    'Data/Linguistic_Isolation.json': ['Linguistic Isolation', socioeconomicColorMap, 'Percent limited English speaking households', ''],
    'Data/Linguistic_Isolation_Pctl.json': ['Linguistic Isolation Pctl', socioeconomicColorMap, 'Linguistic isolation percentile', ''],
    'Data/Poverty.json': ['Poverty', socioeconomicColorMap, 'Percent of population living below two times the federal poverty level', ''],
    'Data/Poverty_Pctl.json': ['Poverty Pctl', socioeconomicColorMap, 'Poverty percentile', ''],
    'Data/Unemployment.json': ['Unemployment', socioeconomicColorMap, 'Percent of the population over the age of 16 that is unemployed and eligible for the labor force', ''],
    'Data/Unemployment_Pctl.json': ['Unemployment Pctl', socioeconomicColorMap, 'Unemployment percentile', ''],
    'Data/Housing_Burden.json': ['Housing Burden', socioeconomicColorMap, 'Percent housing-burdened low-income households', ''],
    'Data/Housing_Burden_Pctl.json': ['Housing Burden Pctl', socioeconomicColorMap, 'Housing burden percentile', ''],
    'Data/Pop._Char._.json': ['Pop. Char. ', socioeconomicColorMap, 'Average of percentiles from the Population Characteristics indicators', ''],
    'Data/Pop._Char._Score.json': ['Pop. Char. Score', socioeconomicColorMap, 'Population Characteristics variable scaled with a range of 0-10', ''],
    'Data/Pop._Char._Pctl.json': ['Pop. Char. Pctl', socioeconomicColorMap, 'Population characteristics percentile', ''],
    'Data/pm25_predictions.json': ['pm25_predictions', pollutantColorMap, 'Predicted PM2.5 using PWWB Machine Learning Models.', ''],
    'Data/traffic.json': ['traffic_counts', pollutantColorMap, 'Traffic density or counts', ''],
    'Data/poverty.json': ['poverty_data', socioeconomicColorMap, 'Percent of population living below two times the federal poverty level', ''],
    'Data/income.json': ['income_data', socioeconomicColorMap, 'No specific definition provided.', ''],
};

// document.addEventListener('DOMContentLoaded', function() {
//     var infoButton = document.querySelector('.info-button');
//     infoButton.title = "You can hover over this button to see more information about how to use the control panel.";
// });




(async function() {
    for (const [file, value] of Object.entries(fileMappings)) {
        const key = value[0]; // Extract the display name

        if (key === 'Time Series Data') {
            console.log('Fetching time series data...');

            // Define your fileList array with the specific file names
            const fileList = ['recent_0.json', 'recent_1.json', 'recent_2.json', 'recent_3.json', 'recent_4.json'];
            let allTimeSeriesData = [];

            const twodFileList = ['recent_0.png', 'recent_1.png', 'recent_2.png', 'recent_3.png', 'recent_4.png'];

            let imageUrls = [];

            // Base URL
            const baseUrl = 'https://sagemaker-us-east-2-958520404663.s3.us-east-2.amazonaws.com/sagemaker/predictions/';

            // Loop through the twodFileList and construct each URL
            for (const fileName of twodFileList) {
                const fullUrl = `${baseUrl}${fileName}`; // Construct the full URL
                imageUrls.push(fullUrl); // Add the URL to the array
            }

            console.log(imageUrls);


            // Loop through the fileList and fetch each file
            for (const fileName of fileList) {
                try {
                    const fileResponse = await fetch(`https://sagemaker-us-east-2-958520404663.s3.us-east-2.amazonaws.com/sagemaker/predictions/${fileName}`);
                    allTimeSeriesData.push(await fileResponse.json());
                    console.log(`Fetched data from ${fileName}`);
                } catch (error) {
                    console.error(`Error fetching data from ${fileName}:`, error);
                }
            }

            console.log('Time series data:', allTimeSeriesData);
            dataMap[key] = [allTimeSeriesData, value[1], value[2], value[3], imageUrls]; // Assuming 'key' and 'value' are defined earlier in your code

        }
        else {
            // Handling for all other data types
            const response = await fetch(file);
            dataMap[key] = [await response.json(), value[1], value[2], value[3]]; // Store data along with its color map
        }
    }

    // Fetch data for PM25, O3, NO2 and store them along with their color maps
    // Assuming fetchData is a function you've defined elsewhere to fetch these specific data types
    dataMap['PM25'] = [await fetchData(PARAMS_MAP.PM25), pollutantColorMap];
    dataMap['O3'] = [await fetchData(PARAMS_MAP.O3), pollutantColorMap];
    dataMap['NO2'] = [await fetchData(PARAMS_MAP.NO2), pollutantColorMap];

})().catch(error => {
    console.error("Error fetching data:", error);
});
console.log("DATA MAP", dataMap);
// Event listener for select element


document.getElementById('pollutantSelect').addEventListener('change', (event) => {
    console.log('Selected value:', event.target.value);
    
    while (viewer.imageryLayers.length > 1) {
        viewer.imageryLayers.remove(viewer.imageryLayers.get(viewer.imageryLayers.length - 1));
    }
    console.log("Removed all custom imagery layers from viewer");
    // console.log('Removing', entitiesToRemove.length, 'cylinders');
    const entities = viewer.entities.values;
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        viewer.entities.remove(entity);
        i--;
    }
    
    console.log("Removed all imagery layers from viewer");
    if (event.target.value == 'Live Air Traffic'){
        if (!isLoopActive) {
                isLoopActive = true;
                updateTooltipText('Uses Radar from AdsBE Exchange to show live air traffic');
                mainLoop();
            }
        return;
    }
    else {
        isLoopActive = false;
    }
    const selectedData = dataMap[event.target.value];


    if (selectedData) {
        console.log('selected data', selectedData)
        const colorMap = selectedData[1];
        const dataDescription = selectedData[2];
        updateLegendUnits(selectedData[3]);
        console.log(dataDescription)
        updateTooltipText(dataDescription);
        console.log('Updating color map');
        createGradient([colorMap.from, colorMap.to]);
        console.log('Displaying data');

        if (event.target.value === 'Time Series Data') {
            timeSeriesData = selectedData[0];
            twoDtimeSeriesData = selectedData[4];
            displayTimeSeriesData(); // Function to display time series data
            document.querySelector('.time-control').style.display = 'block'; // Show the time control for time series data
        } else {
            displayData(selectedData[0], labels = false); // Function for other types of data
            document.querySelector('.time-control').style.display = 'none'; // Hide the time control for non-time series data
        }
        
    } else {
        console.error('No data found for selected key:', event.target.value);
    }
});

function formatDateTime(isoString) {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Adding 1 because getMonth() returns month from 0-11
    const day = date.getDate();
    let hours = date.getHours();
    const amPm = hours >= 12 ? 'PM' : 'AM';

    // Convert 24-hour time to 12-hour format
    hours = hours % 12;
    // The hour '0' should be '12'
    hours = hours ? hours : 12;

    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const formattedTime = `${String(hours).padStart(2, '0')} ${amPm}`;

    return `${formattedDate} ${formattedTime}`;
}
function updatePredictionDateTime(predictions) {
    // Get the current date and time
    const now = new Date();
    const leastRecent = new Date(now.getTime() - 12 * 60 * 60 * 1000); // 7 hours back

    // Adjust the array as specified: most recent, then least recent to most recent - 1
    predictions['files'].forEach((prediction, index) => {
        let adjustedHour;
        if (index === 0) {
            // First prediction gets the current time (most recent)
            adjustedHour = new Date(leastRecent.getTime() + (5 - 1) * 60 * 60 * 1000);
        } else {
            // Subsequent predictions get leastRecent + (index - 1) to simulate the rotation
            adjustedHour = new Date(leastRecent.getTime() + (index - 1) * 60 * 60 * 1000);
        }
        const formattedDateTime = adjustedHour.toISOString().substring(0, 19);
        prediction.predictionDateTime = formattedDateTime;
    });

    // Return the updated predictions array
    return predictions;
}


function updateDateDisplay(count, data) {
    // Get the last predictionDateTime from the data
    const lastPrediction = data.files[count].predictionDateTime;
    console.log(data.files)
    // Format the date as needed, here we're just using the ISO string directly
    const formattedDate = formatDateTime(lastPrediction);

    // Update the currentDate span with this date
    document.getElementById('currentDate').textContent = formattedDate;
}

function display2DTimeSeriesData() {
    console.log('Displaying 2D time series data...');
    display2DData(twoDtimeSeriesData[timeStepCount]);
}

async function displayTimeSeriesData() {
    console.log('Displaying time series data...');
    
    var response;
    try {
        response = await fetch(`https://sagemaker-us-east-2-958520404663.s3.us-east-2.amazonaws.com/sagemaker/predictions/manifest.json`);
    } catch (error) {
        console.error(`Error fetching data from ${fileName}:`, error);
    }
    var data = await response.json();
    console.log('Time series data manifest:', data);
    data = updatePredictionDateTime(data);
    console.log('Time series data updated manifest:', data);
    updateDateDisplay(timeStepCount, data);
    if (!threeDTiles)    {
        _ = normalizeData(timeSeriesData[timeStepCount], time_series = true);
        entitiesToRemove = viewer.entities.values.filter(entity => entity.cylinder);
        // console.log('Removing', entitiesToRemove.length, 'cylinders');
        for (let entity of entitiesToRemove) {
            viewer.entities.remove(entity);
        }
        display2DTimeSeriesData();
        return;
    }
    showNotification('3d tiles are on, time series data will take significantly longer to load');
    displayData(timeSeriesData[timeStepCount], labels = false, height_divisor = 1, time_series = true);
}

function display2DData(imageUrl) {
    console.log('Displaying 2D data...');
    // Explicitly define the bounds of the rectangle
    const west = -119.78;  // Minimum longitude
    const south = 33.18;   // Minimum latitude
    const east = -117.42; // Maximum longitude
    const north = 34.47;   // Maximum latitude
    console.log("Creating SingleTileImageryProvider with bounds:", {west, south, east, north});

    // Create a SingleTileImageryProvider with your image and its bounds
    const singleTileProvider = new Cesium.SingleTileImageryProvider({
        url: imageUrl, // Ensure the path to your image is correct
        rectangle: Cesium.Rectangle.fromDegrees(west, south, east, north)
    });

    // Log the creation of the imagery provider
    console.log("SingleTileImageryProvider created:", singleTileProvider);

    // Create an ImageryLayer with the provider and add it to the viewer
    const imageryLayer = new Cesium.ImageryLayer(singleTileProvider, {
        alpha: 0.7 // Set the transparency of the layer (0.0 - 1.0)
    });

    viewer.imageryLayers.add(imageryLayer);
    console.log("Added custom imagery layer to viewer");
}




document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

    const playPauseButton = document.getElementById('playPauseButton');
    const stepForwardButton = document.getElementById('stepForwardButton');
    const stepBackButton = document.getElementById('stepBackButton');

    const stepDate = (days) => {
        timeStepCount += days;
        timeStepCount = timeStepCount % 5;
        console.log(`Stepped to timeStepCount: ${timeStepCount}`);
        displayTimeSeriesData();
    };

    playPauseButton.addEventListener('click', function () {
        isPlaying = !isPlaying;
        console.log(`Play/pause toggled. isPlaying: ${isPlaying}`);
        document.getElementById('playPauseImg').src = isPlaying ? 'images/pause_icon.png' : 'images/play_icon.png';

        if (isPlaying) {
            console.log("Starting interval for stepping through data");
            playInterval = setInterval(() => stepDate(1), 1750);
        } else {
            console.log("Clearing interval for stepping through data");
            clearInterval(playInterval);
        }
    });

    stepForwardButton.addEventListener('click', function () {
        console.log("Step forward button clicked");
        stepDate(1);
    });

    stepBackButton.addEventListener('click', function () {
        console.log("Step back button clicked");
        stepDate(-1);
        
    });

    // Initialize the display
    console.log("Initializing time series data display");
    displayTimeSeriesData();
});

document.getElementById('searchPollutant').addEventListener('input', filterPollutants);
document.getElementById('categorySelect').addEventListener('change', filterPollutants);

function filterPollutants() {
    var input = document.getElementById('searchPollutant');
    var filter = input.value.toUpperCase();
    var categorySelect = document.getElementById('categorySelect');
    var category = categorySelect.value;
    var div = document.getElementById("pollutantSelect");
    var options = div.getElementsByTagName('option');

    for (var i = 0; i < options.length; i++) {
        var txtValue = options[i].textContent || options[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1 && (options[i].dataset.category === category || category === "all")) {
            options[i].style.display = "";
        } else {
            options[i].style.display = "none";
        }
    }
}



// document.getElementById('searchPollutant').addEventListener('input', function() {
//     var input, filter, ul, li, a, i, txtValue;
//     input = document.getElementById('searchPollutant');
//     filter = input.value.toUpperCase();
//     div = document.getElementById("pollutantSelect");
//     a = div.getElementsByTagName('option');
//     for (i = 0; i < a.length; i++) {
//       txtValue = a[i].textContent || a[i].innerText;
//       if (txtValue.toUpperCase().indexOf(filter) > -1) {
//         a[i].style.display = "";
//       } else {
//         a[i].style.display = "none";
//       }
//     }
//   });

  // Listen for clicks on the entire document
    document.addEventListener('click', function(event) {
        // Get the controlPanel element
        var controlPanel = document.getElementById('controlPanel');

        // Check if the click occurred inside the controlPanel
        var isClickInside = controlPanel.contains(event.target);

        // If the click is outside the controlPanel, hide the pollutantSelect
        if (!isClickInside) {
            document.getElementById('pollutantSelect').style.display = "none";
        }
    });

  
  document.getElementById('searchPollutant').addEventListener('focus', function() {
    document.getElementById('pollutantSelect').style.display = "block";
  });
  
  document.getElementById('pollutantSelect').addEventListener('change', function() {
    var select = document.getElementById('pollutantSelect');
    // Do something with the selected value
    console.log('Selected pollutant:', select.value);
    document.getElementById('searchPollutant').value = select.options[select.selectedIndex].text;
    select.style.display = "none";
  });
  
  // Optional: hide the select when clicking outside of the dropdown
//   window.addEventListener('click', function(e) {
//     if (!document.getElementById('pollutantDropdown').contains(e.target)) {
//       document.getElementById('pollutantSelect').style.display = 'none';
//     }
//   });

function updateCylindersToHeight() {
    var finalPosition = viewer.camera.positionWC;
    
    // Convert the position to cartographic coordinates (radians)
    var cartographicPosition = Cesium.Cartographic.fromCartesian(finalPosition);
    // Convert radians to degrees for longitude and latitude
    var longitude = Cesium.Math.toDegrees(cartographicPosition.longitude);
    var latitude = Cesium.Math.toDegrees(cartographicPosition.latitude);
    var height = cartographicPosition.height;
    
    // Log the camera's final longitude, latitude, and height
    console.log('Camera movement ended. Final position:', `Longitude: ${longitude}, Latitude: ${latitude}, Height: ${height}`);
    
    // Place your additional code here
    var entities = viewer.entities.values;
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        // Check if the entity is a cylinder
        if (entity.cylinder) {
            // Update the cylinder's height (length)
            entity.cylinder.length = (entity.cylinder.length / height_multiplier) * (height / 1000);
            
            if (height < 10000) {
                var newOpacity = 0.5; // Opacity ranges from 0 (completely transparent) to 1 (completely opaque)
                var currentColor = entity.cylinder.material.color.getValue(); // Get the current color of the cylinder
                var newColor = new Cesium.Color(currentColor.red, currentColor.green, currentColor.blue, newOpacity);
                
                // Set the new color with updated opacity
                entity.cylinder.material = new Cesium.ColorMaterialProperty(newColor);
            }
            else    {
                var newOpacity = 1.0; // Opacity ranges from 0 (completely transparent) to 1 (completely opaque)
                var currentColor = entity.cylinder.material.color.getValue(); // Get the current color of the cylinder
                var newColor = new Cesium.Color(currentColor.red, currentColor.green, currentColor.blue, newOpacity);
                
                // Set the new color with updated opacity
                entity.cylinder.material = new Cesium.ColorMaterialProperty(newColor);
            }
        }
    }
    height_multiplier = Math.min(200, height / 1000);
    console.log('Height Multiplier:', height_multiplier);

}


var previousCameraHeight = 0; // Initialize the previous camera height
var thresholdDistance = 5000; // Define the threshold distance, e.g., 10,000 meters

function hasCylinders(viewer) {
    var entities = viewer.entities.values;
    for (var i = 0; i < entities.length; i++) {
        // Assuming cylinders are added as ellipsoids or through a custom cylinder property
        if (entities[i].ellipsoid || entities[i].cylinder) {
            return true; // Found at least one cylinder
        }
    }
    return false; // No cylinders found
}

viewer.camera.moveEnd.addEventListener(function() {
    var currentCameraHeight = viewer.camera.positionCartographic.height;
    
    // Calculate the absolute difference between the current and previous camera heights
    var heightDifference = Math.abs(currentCameraHeight - previousCameraHeight);
    
    // Check if the height difference exceeds the threshold
    if (heightDifference > thresholdDistance && hasCylinders(viewer)) {
        // The camera's distance from the Earth's surface has changed significantly
        // Run the desired code block
        
        enableLoadingSpinner();
        updateCylindersToHeight();
        setTimeout(disableLoadingSpinner, 5000);
        
        // Update the previous camera height for the next comparison
        previousCameraHeight = currentCameraHeight;
    }
});
  

document.getElementById('myCheckbox').addEventListener('change', function() {
    if (!this.checked) {
        // Code to run when checkbox is unchecked
        const entities = viewer.entities.values;
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (!(entity.path) && !(entity.cylinder)) {
                viewer.entities.remove(entity);
                i--;  // Adjust the index since we've modified the collection
            }
        }
    }
});



// Function to show a notification
function showNotification(message) {
    var container = document.getElementById('notificationContainer');
    
    // Check if a notification already exists
    var existingNotification = container.querySelector('div');
    
    if (existingNotification) {
        // Update the existing notification text
        existingNotification.innerText = message;
        console.log('Updated Notification: ', message);
    } else {
        // Create the notification element
        var notification = document.createElement('div');
        notification.style.background = 'rgba(0, 0, 0, 0.7)';
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.marginBottom = '10px';
        notification.innerText = message;
        console.log('Notification: ', message);

        // Add the notification to the notification container
        container.appendChild(notification);
    }

    // Clear any existing timeout to reset the timer
    clearTimeout(container.timeoutId);
  
    // Remove the notification after 5 seconds of no new notifications
    // container.timeoutId = setTimeout(function() {
    //     if (container.firstChild) {
    //         container.removeChild(container.firstChild);
    //     }
    // }, 000);
}

  // You can similarly attach event listeners to other elements to show notifications based on different scenarios
  

// document.getElementById('polCheckbox').addEventListener('change', function() {

//     if (!this.checked) {
//         //console.log('Removing photorealistic tiles')
//         cmap_pollution = false;
//         //deletePhotorealisticTiles();

//     }
//     if (this.checked)   {
//         //console.log('Adding photorealistic tiles')
//         cmap_pollution = true;
//         //addPhotorealisticTiles();
//     }
// });



async function mainLoop() {
    console.log('Main loop started.');
    while (isLoopActive) {
        try {
            const flightData = await fetchPlaneData();
            await updateViewer(flightData);
            console.log('Waiting for 10 seconds before fetching again...');
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds before fetching again
        } catch (error) {
            console.error('Error in main loop:', error);
        }
    }
    console.log('Main loop stopped.');
}

document.getElementById('myCheckbox').addEventListener('change', async function() {
    if (this.checked) {
        if (!isLoopActive) {
            isLoopActive = true;
            mainLoop();
        }
    } else {
        isLoopActive = false;
    }
});

function createGradient(colors) {
    color1 = colors[0];
    color2 = colors[1];
    const svg = document.getElementById("colorLegend");
    let gradientStops = '';
    const step = 100 / (colors.length - 1); // Calculate the step percentage for each color

    // Generate the gradient stops based on the colors array
    colors.forEach((color, index) => {
        gradientStops += `<stop offset="${step * index}%" style="stop-color:${color};stop-opacity:1" />`;
    });

    // Set the innerHTML of the SVG to include the linearGradient with dynamically created stops
    svg.innerHTML = `<defs>
                        <linearGradient id="gradientColors" x1="0%" y1="0%" x2="100%" y2="0%">
                            ${gradientStops}
                        </linearGradient>
                     </defs>
                     <rect x="0" y="15" width="200" height="20" fill="url(#gradientColors)" />`;
}


// Function to create discrete intervals
function createIntervals(colors, labels) {
    const svg = document.getElementById("colorLegend");
    svg.innerHTML = ''; // Clear existing content
    const intervalWidth = 200 / colors.length;

    // Adding each rectangle
    colors.forEach((color, index) => {
        const rect = `<rect x="${intervalWidth * index}" y="15" width="${intervalWidth}" height="20" fill="${color}" />`;
        svg.innerHTML += rect;
    });

    // Adding labels
    updateLabels(labels);
}

// Function to update labels
function updateLabels(labels) {
    const svg = document.getElementById("colorLegend");
    const svgWidth = 200; // Match the SVG width
    const intervalWidth = svgWidth / labels.length;

    // Clear existing text to prevent overlapping labels
    const textElements = svg.querySelectorAll('text');
    textElements.forEach(element => element.remove());

    labels.forEach((label, index) => {
        // Convert label to a number and check if it's an integer
        const numberLabel = Number(label);
        let formattedLabel = numberLabel;
        if (!Number.isInteger(numberLabel)) {
            // If not an integer, round to one decimal place, but avoid unnecessary trailing zeros
            formattedLabel = parseFloat(numberLabel.toFixed(1));
        }

        let xPosition = intervalWidth * index + intervalWidth / 2;
        let textAnchor = "middle"; // Default text anchor

        // Adjust position and anchoring for the first and last labels
        if (index === 0) {
            xPosition = 0; // Move to the very left
            textAnchor = "start"; // Left-justify the first label
        } else if (index === labels.length - 1) {
            xPosition = svgWidth; // Move to the very right
            textAnchor = "end"; // Right-justify the last label
        }

        // Create SVG text element for better compatibility
        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.setAttribute("x", xPosition.toString());
        textElement.setAttribute("y", "12");
        textElement.setAttribute("font-size", "12");
        textElement.setAttribute("text-anchor", textAnchor);
        textElement.setAttribute("fill", "white");
        textElement.textContent = formattedLabel.toString();

        svg.appendChild(textElement);
    });
}


 
// Example usage
// For Gradient
// createGradient(0, 1);

// For Discrete Intervals
// createIntervals(["green", "lime", "yellow", "orange", "red"], [0.2, 0.4, 0.6, 0.8, 1.0]);



