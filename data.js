// function loadCSVData(csvFilePath, callback) {
//     Papa.parse(csvFilePath, {
//         download: true,
//         header: true,
//         complete: function(results) {
//             console.log("CSV Data Loaded:", results.data);  // Log the parsed CSV data
//             callback(results.data);
//         },
//         error: function(error) {
//             console.error("Error loading CSV:", error);  // Log any errors during CSV loading
//         }
//     });
// }

// function styleGeoJSONData(geojsonDataSource, csvData) {
//     console.time("Styling GeoJSON");  // Start timer for styling GeoJSON
//     console.log("CSV Data for styling:", csvData);

//     const dataMap = new Map(csvData.map(item => [item.Census_Tract, parseFloat(item.Value)]).filter(item => !isNaN(item[1])));
//     console.log("Data Map created:", dataMap);

//     const entities = geojsonDataSource.entities.values;
//     console.log("Total entities to style:", entities.length);

//     // Calculate the min and max values from the CSV data
//     const values = Array.from(dataMap.values());
//     const minValue = Math.min(...values);
//     const maxValue = Math.max(...values);
//     updateLabels([minValue, maxValue])
//     console.log("Min Value:", minValue, "Max Value:", maxValue); // Debug output

//     // Define the start and end colors
//     const startColor = [252, 251, 222]; // White
//     const endColor = [41, 74, 119]; // Custom Blue

//     // Define the start and end colors in 'rgb(r, g, b)' format strings
//     const startColorStr = 'rgb(252, 251, 222)'; // White
//     const endColorStr = 'rgb(41, 74, 119)'; // Custom Blue

//     // Call the createGradient function with these colors as the first element in an array
//     createGradient([startColorStr, endColorStr]);

//     // Function to interpolate colors
//     function interpolateColors(startColor, endColor, steps) {
//         let colorArray = [];
//         for (let i = 0; i <= steps; i++) {
//             let r = startColor[0] + (endColor[0] - startColor[0]) * i / steps;
//             let g = startColor[1] + (endColor[1] - startColor[1]) * i / steps;
//             let b = startColor[2] + (endColor[2] - startColor[2]) * i / steps;
//             colorArray.push([Math.round(r), Math.round(g), Math.round(b)]);
//         }
//         return colorArray;
//     }

//     // Generate 10 equidistant colors
//     const colors = interpolateColors(startColor, endColor, 10);

//     // Function to assign a color based on value
//     function getColorForValue(value) {
//         // console.log(value, minValue, maxValue)
//         const ratio = (value - minValue) / (maxValue - minValue);
//         // console.log("Ratio: ", ratio);
//         const bin = Math.floor(ratio * 10);
//         const [r, g, b] = colors[bin];
//         // console.log(`Value: ${value}, Bin: ${bin}, Color: rgb(${r}, ${g}, ${b})`);
//         return new Cesium.Color(r/255, g/255, b/255, 0.7); // Returns the color as a CSS-style string

//     }

//     entities.forEach(entity => {
//         const censusTractProperty = entity.properties['GEOID'];
//         if (censusTractProperty) {
//             const value = censusTractProperty.getValue();
//             const csvItem = dataMap.get(value.substring(1));
//             if (csvItem !== undefined) {
//                 const metricValue = csvItem; // Directly use the already parsed float value
//                 const color = getColorForValue(metricValue);
//                 entity.polygon.material = new Cesium.ColorMaterialProperty(color);
//                 entity.polygon.outline = false;
//             } else {
//                 entity.polygon.material = new Cesium.ColorMaterialProperty(Cesium.Color.TRANSPARENT);
//                 entity.polygon.outline = false;
//             }
//         } else {
//             entity.polygon.material = new Cesium.ColorMaterialProperty(Cesium.Color.TRANSPARENT);
//             entity.polygon.outline = false;
//         }
//     });
//     console.timeEnd("Styling GeoJSON");  // End timer for styling GeoJSON
// }