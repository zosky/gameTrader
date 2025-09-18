#!/usr/bin/env node
/* A script to cache key prices from the IsThereAnyDeal API for all games in gamelist.json */

const fs = require('fs').promises;
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const API_KEY = process.env.ITAD_API_KEY;
const BASE_URL = 'https://api.isthereanydeal.com';
const COUNTRY = 'CA';

// Rate limiting - delay between requests
const RATE_LIMIT_DELAY = 100; // ms

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadExistingGameCache(outputPath) {
  try {
    const existingData = await fs.readFile(outputPath, 'utf8');
    const priceData = JSON.parse(existingData);
    
    const steamIDToGameMap = new Map();
    const gameIDToInfoMap = new Map();
    
    for (const item of priceData) {
      if (item.steamID && item.id) {
        steamIDToGameMap.set(item.steamID, {
          gameID: item.id,
          slug: item.slug,
          title: item.title,
          assets: item.assets
        });
        gameIDToInfoMap.set(item.id, {
          steamID: item.steamID,
          slug: item.slug,
          title: item.title,
          assets: item.assets
        });
      }
    }
    
    console.log(`📋 Found ${steamIDToGameMap.size} cached game mappings in existing priceData.json`);
    return { steamIDToGameMap, gameIDToInfoMap };
  } catch (error) {
    console.log(`📋 No existing priceData.json found or error reading it: ${error.message}`);
    return { steamIDToGameMap: new Map(), gameIDToInfoMap: new Map() };
  }
}

async function lookupGameBySteamID(steamID) {
  try {
    const url = `${BASE_URL}/games/lookup/v1?appid=${steamID}&key=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to lookup steamID ${steamID}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.found && data.game) {
      return {
        steamID: steamID,
        gameID: data.game.id,
        slug: data.game.slug,
        title: data.game.title,
        assets: data.game.assets
      };
    }
    
    console.warn(`Game not found for steamID: ${steamID}`);
    return null;
  } catch (error) {
    console.error(`Error looking up steamID ${steamID}:`, error.message);
    return null;
  }
}

async function fetchPricesForGames(gameIDs) {
  try {
    const url = `${BASE_URL}/games/prices/v3?country=${COUNTRY}&key=${API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameIDs)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch prices: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching prices:', error.message);
    return [];
  }
}

async function main() {
  try {
    console.log('Starting price cache update...');
    
    // Check for existing cache first
    const outputPath = path.join(__dirname, '../public/priceData.json');
    const { steamIDToGameMap, gameIDToInfoMap } = await loadExistingGameCache(outputPath);
    
    // Read the gamelist.json file
    const gamelistPath = path.join(__dirname, '../public/gamelist.json');
    const gamelistData = await fs.readFile(gamelistPath, 'utf8');
    const games = JSON.parse(gamelistData);
    
    console.log(`Found ${games.length} games in gamelist.json`);
    
    // Extract unique steamIDs
    const uniqueSteamIDs = [...new Set(games.map(game => game.steamID))];
    console.log(`Processing ${uniqueSteamIDs.length} unique Steam IDs`);
    
    // Separate cached and uncached steamIDs
    const cachedSteamIDs = [];
    const uncachedSteamIDs = [];
    
    for (const steamID of uniqueSteamIDs) {
      if (steamIDToGameMap.has(steamID)) {
        cachedSteamIDs.push(steamID);
      } else {
        uncachedSteamIDs.push(steamID);
      }
    }
    
    console.log(`✅ Found ${cachedSteamIDs.length} games in cache`);
    console.log(`🔍 Need to lookup ${uncachedSteamIDs.length} new games`);
    
    // Build game map starting with cached data
    const gameMap = new Map(gameIDToInfoMap);
    const validGameIDs = [...gameIDToInfoMap.keys()];
    
    // Lookup only uncached steamIDs
    for (let i = 0; i < uncachedSteamIDs.length; i++) {
      const steamID = uncachedSteamIDs[i];
      console.log(`Looking up ${i + 1}/${uncachedSteamIDs.length}: steamID ${steamID}`);
      
      const gameInfo = await lookupGameBySteamID(steamID);
      if (gameInfo) {
        gameMap.set(gameInfo.gameID, gameInfo);
        validGameIDs.push(gameInfo.gameID);
      }
      
      // Rate limiting
      if (i < uncachedSteamIDs.length - 1) {
        await delay(RATE_LIMIT_DELAY);
      }
    }
    
    console.log(`Successfully processed ${validGameIDs.length} total games (${cachedSteamIDs.length} cached + ${uncachedSteamIDs.length} new lookups)`);
    
    if (validGameIDs.length === 0) {
      console.error('No valid games found. Exiting.');
      return;
    }
    
    // Fetch prices for all games
    console.log('Fetching price data...');
    const priceData = await fetchPricesForGames(validGameIDs);
    
    // Merge price data with game info and add steamID
    const enrichedPriceData = priceData.map(priceItem => {
      const gameInfo = gameMap.get(priceItem.id);
      return {
        ...priceItem,
        steamID: gameInfo ? gameInfo.steamID : null,
        slug: gameInfo ? gameInfo.slug : null,
        title: gameInfo ? gameInfo.title : null,
        assets: gameInfo ? gameInfo.assets : null
      };
    });
    
    // Save the results
    await fs.writeFile(outputPath, JSON.stringify(enrichedPriceData, null, 2));
    
    console.log(`✅ Price data saved to ${outputPath}`);
    console.log(`📊 Processed ${enrichedPriceData.length} games with price data`);
    
    // Summary
    const gamesWithDeals = enrichedPriceData.filter(game => game.deals && game.deals.length > 0);
    console.log(`🎮 Games with active deals: ${gamesWithDeals.length}`);
    
    const gamesOnSale = enrichedPriceData.filter(game => 
      game.deals && game.deals.some(deal => deal.cut > 0)
    );
    console.log(`💰 Games currently on sale: ${gamesOnSale.length}`);
    
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

// Run the script
main();