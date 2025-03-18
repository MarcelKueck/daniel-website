/**
 * Baumfällung Partsch Junior Image Downloader
 * 
 * This script downloads tree care and forestry images 
 * for the website from Pexels and saves them to the assets/images directory.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Output directory
const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'images');

// Make sure directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    // Create parent directory if needed
    const parentDir = path.join(__dirname, '..', 'assets');
    if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir);
    }
    fs.mkdirSync(OUTPUT_DIR);
}

// Define all the images needed with direct URLs to Pexels
const websiteImages = [
    // Hero section
    {
        name: 'hero-video.jpg',
        url: 'https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg?auto=compress&cs=tinysrgb&w=1200',
        attribution: 'Photo by Pixabay from Pexels'
    },
    
    // Service cards
    {
        name: 'residential.jpg',
        url: 'https://images.pexels.com/photos/589840/pexels-photo-589840.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Snapwire from Pexels'
    },
    {
        name: 'commercial.jpg',
        url: 'https://images.pexels.com/photos/2069425/pexels-photo-2069425.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Mike from Pexels'
    },
    {
        name: 'forest.jpg',
        url: 'https://images.pexels.com/photos/640809/pexels-photo-640809.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Tobi from Pexels'
    },
    
    // Featured projects
    {
        name: 'project1-before.jpg',
        url: 'https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Pixabay from Pexels'
    },
    {
        name: 'project1-after.jpg',
        url: 'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Pixabay from Pexels'
    },
    {
        name: 'project2-before.jpg',
        url: 'https://images.pexels.com/photos/460621/pexels-photo-460621.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Pixabay from Pexels'
    },
    {
        name: 'project2-after.jpg',
        url: 'https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Pixabay from Pexels'
    },
    {
        name: 'project3-before.jpg',
        url: 'https://images.pexels.com/photos/5976812/pexels-photo-5976812.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Harry Cooke from Pexels'
    },
    {
        name: 'project3-after.jpg',
        url: 'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Valeria Boltneva from Pexels'
    },
    
    // Background
    {
        name: 'forest-bg.jpg',
        url: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=1200',
        attribution: 'Photo by Kasuma from Pexels'
    },
    
    // Equipment
    {
        name: 'equipment1.jpg',
        url: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Pixabay from Pexels'
    },
    {
        name: 'equipment2.jpg',
        url: 'https://images.pexels.com/photos/15766364/pexels-photo-15766364.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Elina Volkova from Pexels'
    },
    {
        name: 'equipment3.jpg',
        url: 'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Pixabay from Pexels'
    },
    {
        name: 'equipment4.jpg',
        url: 'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Pixabay from Pexels'
    },
    {
        name: 'equipment5.jpg',
        url: 'https://images.pexels.com/photos/1117214/pexels-photo-1117214.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Johannes Plenio from Pexels'
    },
    
    // About section
    {
        name: 'daniel-portrait.jpg',
        url: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Moose Photos from Pexels'
    },
    {
        name: 'heritage-old.jpg',
        url: 'https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Pixabay from Pexels'
    },
    {
        name: 'heritage-new.jpg',
        url: 'https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Elina Volkova from Pexels'
    },
    {
        name: 'heritage-combined.jpg',
        url: 'https://images.pexels.com/photos/5967868/pexels-photo-5967868.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Anna Tarazevich from Pexels'
    },
    
    // Case studies (representative examples of before/after scenarios)
    {
        name: 'case1-before.jpg',
        url: 'https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Pixabay from Pexels'
    },
    {
        name: 'case1-after.jpg',
        url: 'https://images.pexels.com/photos/462136/pexels-photo-462136.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Pixabay from Pexels'
    },
    {
        name: 'case2-before.jpg',
        url: 'https://images.pexels.com/photos/1723914/pexels-photo-1723914.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Pedro Figueras from Pexels'
    },
    {
        name: 'case2-after.jpg',
        url: 'https://images.pexels.com/photos/145685/pexels-photo-145685.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Pixabay from Pexels'
    },
    {
        name: 'case3-before.jpg',
        url: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Tom Swinnen from Pexels'
    },
    {
        name: 'case3-after.jpg',
        url: 'https://images.pexels.com/photos/775201/pexels-photo-775201.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Jaymantri from Pexels'
    },
    {
        name: 'case4-before.jpg',
        url: 'https://images.pexels.com/photos/775203/pexels-photo-775203.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Kaboompics.com from Pexels'
    },
    {
        name: 'case4-after.jpg',
        url: 'https://images.pexels.com/photos/2649403/pexels-photo-2649403.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by stein egil liland from Pexels'
    },
    {
        name: 'case5-before.jpg',
        url: 'https://images.pexels.com/photos/789382/pexels-photo-789382.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Jill Wellington from Pexels'
    },
    {
        name: 'case5-after.jpg',
        url: 'https://images.pexels.com/photos/9754/mountains-clouds-forest-fog.jpg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Pixabay from Pexels'
    },
    {
        name: 'case6-before.jpg',
        url: 'https://images.pexels.com/photos/302804/pexels-photo-302804.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Pixabay from Pexels'
    },
    {
        name: 'case6-after.jpg',
        url: 'https://images.pexels.com/photos/158063/bellingrath-gardens-alabama-landscape-scenic-158063.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Pixabay from Pexels'
    },
    {
        name: 'case7-before.jpg',
        url: 'https://images.pexels.com/photos/975761/pexels-photo-975761.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Alicja Gancarz from Pexels'
    },
    {
        name: 'case7-after.jpg',
        url: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Egor Kamelev from Pexels'
    },
    {
        name: 'case8-before.jpg',
        url: 'https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Pixabay from Pexels'
    },
    {
        name: 'case8-after.jpg',
        url: 'https://images.pexels.com/photos/172277/pexels-photo-172277.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Pixabay from Pexels'
    },
    {
        name: 'case9-before.jpg',
        url: 'https://images.pexels.com/photos/235767/pexels-photo-235767.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Pixabay from Pexels'
    },
    {
        name: 'case9-after.jpg',
        url: 'https://images.pexels.com/photos/1179225/pexels-photo-1179225.jpeg?auto=compress&cs=tinysrgb&w=800',
        attribution: 'Photo by Johannes Plenio from Pexels'
    }
];

/**
 * Download an image from a URL and save it to the specified path
 */
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download image: ${response.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(filepath);
            response.pipe(fileStream);
            
            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });
            
            fileStream.on('error', (err) => {
                fs.unlink(filepath, () => {}); // Delete the file if there was an error
                reject(err);
            });
        }).on('error', reject);
    });
}

/**
 * Update the attribution file with image information
 */
function updateAttributionFile(attributions) {
    const attributionPath = path.join(OUTPUT_DIR, 'attribution.html');
    
    // Create HTML content
    let attributionHtml = '<html><head><title>Image Attribution</title>';
    attributionHtml += '<style>body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:20px}h1{color:#184A2C}h2{color:#3A6A51;margin-top:30px}ul{padding-left:20px}li{margin-bottom:10px}</style>';
    attributionHtml += '</head><body>';
    attributionHtml += '<h1>Image Attribution</h1>';
    attributionHtml += '<p>The following images are used in the Baumfällung Partsch Junior website.</p>';
    attributionHtml += '<ul>';
    
    // Add all image attributions
    attributions.forEach(image => {
        attributionHtml += `<li><strong>${image.name}</strong> - ${image.attribution}</li>\n`;
    });
    
    attributionHtml += '</ul>';
    attributionHtml += '<p>These images are used for demonstration purposes only. For a production website, please ensure proper licensing and attribution.</p>';
    attributionHtml += '</body></html>';
    
    // Write the attribution file
    fs.writeFileSync(attributionPath, attributionHtml);
    console.log('Attribution file created at: ' + attributionPath);
}

/**
 * Wait for a specified amount of time
 */
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Download all website images
 */
async function downloadAllImages() {
    console.log('Starting download of website images...');
    console.log(`Images will be saved to: ${OUTPUT_DIR}`);
    console.log('--------------------------------------------------');
    
    const successfulDownloads = [];
    const failedDownloads = [];
    
    // Loop through and download each image
    for (const image of websiteImages) {
        const filepath = path.join(OUTPUT_DIR, image.name);
        
        try {
            console.log(`Downloading ${image.name}...`);
            await downloadImage(image.url, filepath);
            console.log(`✓ Downloaded ${image.name}`);
            successfulDownloads.push(image);
        } catch (error) {
            console.error(`× Error downloading ${image.name}: ${error.message}`);
            failedDownloads.push(image.name);
        }
        
        // Small delay to avoid rate limiting
        await wait(300);
    }
    
    // Create the attribution file for successful downloads
    if (successfulDownloads.length > 0) {
        updateAttributionFile(successfulDownloads);
    }
    
    // Summary
    console.log('\n--------------------------------------------------');
    console.log(`Download complete. ${successfulDownloads.length} of ${websiteImages.length} images downloaded.`);
    
    if (failedDownloads.length > 0) {
        console.log(`\nThe following images could not be downloaded:`);
        failedDownloads.forEach(name => console.log(`- ${name}`));
        console.log('\nTroubleshooting:');
        console.log('- Check your internet connection');
        console.log('- Try running the script again later');
        console.log('- You can manually download images with similar content and save them with these filenames');
    }
}

// Run the script
downloadAllImages().catch(error => {
    console.error('Error in main process:', error);
});