const fs = require('fs').promises;
const path = require('path');
const http = require('http');
const { type } = require('os');

// Function to fetch JSON data from a URL
function fetchJson(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData);
                } catch (e) {
                    reject(new Error('Error parsing JSON: ' + e.message));
                }
            });
        }).on('error', (err) => {
            reject(new Error('Error fetching data: ' + err.message));
        });
    });
}

// Main function to fetch and process data
async function fetchAndProcessData() {
    try {
        // Fetch the data from the URL
        const data = await fetchJson('http://zoskypc:1188/gameWWW/extraKeys.json');
        
        // Process the data to extract only name and steamID
        const processedData = data.map(item => ({
            steamID: item.appID,
            baseID: item.baseID,
            name: item.name
        }));

        // Write the processed data to public/keylist.json
        // Custom formatting to match the requested output
        const items = processedData.map(item => `  ${JSON.stringify(item)}`).join(',\n');
        const formattedJson = `[\n${items}\n]`;
        const outputPath = path.resolve('public', 'gamelist.json');
        await fs.writeFile(outputPath, formattedJson);
        
        console.log(`Data has been processed and saved to ${outputPath}`);
    } catch (error) {
        console.error('Error processing data:', error);
    }
}

// Run the function
fetchAndProcessData();