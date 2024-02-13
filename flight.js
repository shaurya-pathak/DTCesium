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

var color1 = 'rgb(0, 0, 0)';
var color2 = 'rgb(100, 0, 0)';

function updateColorGradient(fromColor, toColor) {

    color1 = fromColor;
    color2 = toColor;
    // Get the div and span elements
    var colorMapLegend = document.getElementById('colorMapLegend');
  
    // Update the background gradient
    colorMapLegend.style.background = `linear-gradient(to right, ${fromColor}, ${toColor})`;
  
    // Update the displayed color values
  }

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

async function fetchPlaneData() {
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

function normalizeData(data) {
    // Extract only every third value to normalize
    const valuesToNormalize = data.filter((_, index) => index % 3 === 2);
    const minVal = Math.min(...valuesToNormalize);
    const maxVal = Math.max(...valuesToNormalize);
    document.getElementById('minValue').textContent = minVal.toFixed(2);
    document.getElementById('maxValue').textContent = maxVal.toFixed(2);
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


function displayData(transformedData, labels = false, height_divisor = 1) {

    // Normalize data before using it
    let preNormalizedData = transformedData;
    transformedData = normalizeData(transformedData);
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
                length: height * 30000,
                topRadius: 500,
                bottomRadius: 500,
                material: color
            }
        });
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


const pollutantColorMap = { 'from': 'rgb(0, 255, 0)', 'to': 'rgb(255, 0, 0)' }; // Example gradient colors
const socioeconomicColorMap = { 'from': 'rgb(0, 0, 255)', 'to': 'rgb(255, 255, 0)' };
const statColorMap = { 'from': 'rgb(100, 100, 0)', 'to': 'rgb(200, 0, 200)' };


const fileMappings = {
    'Data/time-series-data/': ['Time Series Data', pollutantColorMap],
    'Data/CES_4.0_Score.json': ['CES 4.0 Score', statColorMap],
    'Data/CES_4.0_Percentile.json': ['CES 4.0 Percentile', statColorMap],
    'Data/CES_4.0_Percentile_Range.json': ['CES 4.0 Percentile Range', statColorMap],
    'Data/Ozone.json': ['Ozone', pollutantColorMap],
    'Data/Ozone_Pctl.json': ['Ozone Pctl', pollutantColorMap],
    'Data/PM2.5.json': ['PM2.5', pollutantColorMap],
    'Data/PM2.5_Pctl.json': ['PM2.5 Pctl', pollutantColorMap],
    'Data/Diesel_PM.json': ['Diesel PM', pollutantColorMap],
    'Data/Diesel_PM_Pctl.json': ['Diesel PM Pctl', pollutantColorMap],
    'Data/Drinking_Water.json': ['Drinking Water', pollutantColorMap],
    'Data/Drinking_Water_Pctl.json': ['Drinking Water Pctl', pollutantColorMap],
    'Data/Lead.json': ['Lead', pollutantColorMap],
    'Data/Lead_Pctl.json': ['Lead Pctl', pollutantColorMap],
    'Data/Pesticides.json': ['Pesticides', pollutantColorMap],
    'Data/Pesticides_Pctl.json': ['Pesticides Pctl', pollutantColorMap],
    'Data/Tox._Release.json': ['Tox. Release', pollutantColorMap],
    'Data/Tox._Release_Pctl.json': ['Tox. Release Pctl', pollutantColorMap],
    'Data/CES_Traffic.json': ['Traffic', pollutantColorMap],
    'Data/CES_Traffic_Pctl.json': ['Traffic Pctl', pollutantColorMap],
    'Data/Cleanup_Sites.json': ['Cleanup Sites', pollutantColorMap],
    'Data/Cleanup_Sites_Pctl.json': ['Cleanup Sites Pctl', pollutantColorMap],
    'Data/Groundwater_Threats.json': ['Groundwater Threats', pollutantColorMap],
    'Data/Groundwater_Threats_Pctl.json': ['Groundwater Threats Pctl', pollutantColorMap],
    'Data/Haz._Waste.json': ['Haz. Waste', pollutantColorMap],
    'Data/Haz._Waste_Pctl.json': ['Haz. Waste Pctl', pollutantColorMap],
    'Data/Imp._Water_Bodies.json': ['Imp. Water Bodies', pollutantColorMap],
    'Data/Imp._Water_Bodies_Pctl.json': ['Imp. Water Bodies Pctl', pollutantColorMap],
    'Data/Solid_Waste.json': ['Solid Waste', pollutantColorMap],
    'Data/Solid_Waste_Pctl.json': ['Solid Waste Pctl', pollutantColorMap],
    'Data/Pollution_Burden.json': ['Pollution Burden', pollutantColorMap],
    'Data/Pollution_Burden_Score.json': ['Pollution Burden Score', pollutantColorMap],
    'Data/Pollution_Burden_Pctl.json': ['Pollution Burden Pctl', pollutantColorMap],
    'Data/Asthma.json': ['Asthma', socioeconomicColorMap],
    'Data/Asthma_Pctl.json': ['Asthma Pctl', socioeconomicColorMap],
    'Data/Low_Birth_Weight.json': ['Low Birth Weight', socioeconomicColorMap],
    'Data/Low_Birth_Weight_Pctl.json': ['Low Birth Weight Pctl', socioeconomicColorMap],
    'Data/Cardiovascular_Disease.json': ['Cardiovascular Disease', socioeconomicColorMap],
    'Data/Cardiovascular_Disease_Pctl.json': ['Cardiovascular Disease Pctl', socioeconomicColorMap],
    'Data/Education.json': ['Education', socioeconomicColorMap],
    'Data/Education_Pctl.json': ['Education Pctl', socioeconomicColorMap],
    'Data/Linguistic_Isolation.json': ['Linguistic Isolation', socioeconomicColorMap],
    'Data/Linguistic_Isolation_Pctl.json': ['Linguistic Isolation Pctl', socioeconomicColorMap],
    'Data/Poverty.json': ['Poverty', socioeconomicColorMap],
    'Data/Poverty_Pctl.json': ['Poverty Pctl', socioeconomicColorMap],
    'Data/Unemployment.json': ['Unemployment', socioeconomicColorMap],
    'Data/Unemployment_Pctl.json': ['Unemployment Pctl', socioeconomicColorMap],
    'Data/Housing_Burden.json': ['Housing Burden', socioeconomicColorMap],
    'Data/Housing_Burden_Pctl.json': ['Housing Burden Pctl', socioeconomicColorMap],
    'Data/Pop._Char._.json': ['Pop. Char. ', socioeconomicColorMap],
    'Data/Pop._Char._Score.json': ['Pop. Char. Score', socioeconomicColorMap],
    'Data/Pop._Char._Pctl.json': ['Pop. Char. Pctl', socioeconomicColorMap],
    'Data/pm25_predictions.json': ['pm25_predictions', pollutantColorMap],
    'Data/adult_asthma.json': ['adult_asthma', socioeconomicColorMap],
    'Data/traffic.json': ['traffic_counts', pollutantColorMap],
    'Data/poverty.json': ['poverty_data', socioeconomicColorMap],
    'Data/income.json': ['income_data', socioeconomicColorMap]
};


(async function() {
    for (const [file, value] of Object.entries(fileMappings)) {
        const key = value[0]; // Extract the display name

        if (key === 'Time Series Data') {
            console.log('Fetching time series data...');

            // Define your fileList array with the specific file names
            const fileList = ['recent_0.json', 'recent_1.json', 'recent_2.json', 'recent_3.json', 'recent_4.json'];

            let allTimeSeriesData = [];

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
            dataMap[key] = [allTimeSeriesData, value[1]]; // Assuming 'key' and 'value' are defined earlier in your code

        } else {
            // Handling for all other data types
            const response = await fetch(file);
            dataMap[key] = [await response.json(), value[1]]; // Store data along with its color map
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
    const selectedData = dataMap[event.target.value];

    if (selectedData) {
        console.log('selected data', selectedData)
        const colorMap = selectedData[1];
        console.log('Updating color map');
        updateColorGradient(colorMap.from, colorMap.to);
        console.log('Displaying data');

        if (event.target.value === 'Time Series Data') {
            timeSeriesData = selectedData[0];
            displayTimeSeriesData(); // Function to display time series data
        } else {
            displayData(selectedData[0], labels = false); // Function for other types of data
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


function updateDateDisplay(count, data) {
    // Get the last predictionDateTime from the data
    const lastPrediction = data.files[count].predictionDateTime;

    // Format the date as needed, here we're just using the ISO string directly
    const formattedDate = formatDateTime(lastPrediction);

    // Update the currentDate span with this date
    document.getElementById('currentDate').textContent = formattedDate;
}

async function displayTimeSeriesData() {
    console.log('Displaying time series data...');
    const response = await fetch('Data/time-series-data/manifest.json');
    const data = await response.json();
    updateDateDisplay(timeStepCount, data);
    displayData(timeSeriesData[timeStepCount]);
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



document.getElementById('searchPollutant').addEventListener('input', function() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('searchPollutant');
    filter = input.value.toUpperCase();
    div = document.getElementById("pollutantSelect");
    a = div.getElementsByTagName('option');
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
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
  window.addEventListener('click', function(e) {
    if (!document.getElementById('pollutantDropdown').contains(e.target)) {
      document.getElementById('pollutantSelect').style.display = 'none';
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


let isLoopActive = false;

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

