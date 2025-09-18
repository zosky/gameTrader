# Game Trader

A Vue 3 self-updating SPA (Single Page Application) to facilitate game trades by tracking Steam game inventories and their historical pricing data.

## 🎮 What It Does

Game Trader is a web application that helps you manage and track your Steam game inventory for trading purposes. It provides:

- **Game Inventory Management**: Track your Steam games with automatic duplicate detection and quantity counting
- **Real-time Price Tracking**: Fetches historical low prices from IsThereAnyDeal API for 3-month, 1-year, and all-time periods
- **Multiple View Modes**: Switch between grid cards and detailed table views
- **Search & Sorting**: Find games quickly and sort by name, price, or quantity
- **Visual Statistics**: See total game count, key count, and estimated inventory value at a glance

## ✨ Key Features

### Game Management
- Automatically processes duplicate games and shows quantities
- Displays Steam game images with fallback placeholders
- Shows Steam IDs and base IDs for game identification

### Price Intelligence
- Integrates with IsThereAnyDeal API for accurate pricing data
- Tracks historical low prices across different time periods
- Displays prices in Canadian dollars (CAD)
- Calculates estimated total inventory value

### User Interface
- **Grid View**: Card-based layout with game images and key information
- **List View**: Detailed table with sortable columns for all data points
- **Search**: Real-time filtering by game name
- **Sorting**: Multiple sort options including by price data
- **Responsive Design**: Works on desktop and mobile devices

### Data Management
- Self-updating system that refreshes price data automatically
- Caches API responses to minimize external requests
- Persistent data storage in JSON format

## 🛠️ Technology Stack

- **Frontend**: Vue 3 with Composition API
- **Styling**: Tailwind CSS with dark theme
- **Build Tool**: Vite
- **Icons**: Material Design Icons (mdue)
- **Routing**: Vue Router with file-based routing
- **Auto-imports**: Unplugin auto-imports for Vue and components

## 📁 Project Structure

```
├── src/
│   ├── components/          # Vue components
│   │   ├── GameCard.vue     # Grid view game cards
│   │   ├── GameList.vue     # Table view component
│   │   ├── GameHeader.vue   # Search and controls
│   │   ├── HeaderBar.vue    # Main navigation
│   │   └── money.vue        # Currency formatting
│   ├── pages/               # Route pages
│   └── App.vue              # Main app component
├── public/
│   ├── gamelist.json        # Your game inventory data
│   └── priceData.json       # Cached price information
├── scripts/
│   ├── cacheKeyPrices.js    # Price data fetching script
│   └── git-hook-pre-push.sh # Auto-update hook
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- IsThereAnyDeal API key (for price data)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gameTrader
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your API key:
```
ITAD_API_KEY=your_isthereanydeal_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

### Data Setup

1. **Game List**: Update `public/gamelist.json` with your Steam games:
```json
[
  {"steamID": 123456, "name": "Game Name"},
  {"steamID": 789012, "baseID": 789010, "name": "Game DLC"}
]
```

2. **Price Data**: Run the price caching script:
```bash
npm run json
```

## 🔄 Automated Updates

The application includes automation scripts:

- **Price Updates**: `cacheKeyPrices.js` fetches fresh price data from IsThereAnyDeal
- **Git Integration**: Pre-push hook automatically updates prices before deployment
- **Quick Deploy**: `npm run goTime` updates data and pushes to main branch

## 💰 Price Tracking

The app tracks three types of historical low prices:
- **3m**: Lowest price in the last 3 months
- **1y**: Lowest price in the last year  
- **all**: All-time lowest price

Prices are fetched from IsThereAnyDeal API and cached locally for performance.

## 🎯 Use Cases

Perfect for:
- **Game Traders**: Track inventory values and make informed trading decisions
- **Key Resellers**: Monitor price trends and inventory worth
- **Collectors**: Organize and value your Steam game collection
- **Bundle Buyers**: Track which games you already own to avoid duplicates

## 📊 Stats Dashboard

The header displays real-time statistics:
- 🎮 **Unique Games**: Total number of different games
- 🔑 **Total Keys**: Combined quantity including duplicates
- 💰 **Estimated Value**: Total worth based on historical low prices

## 🤝 Contributing

This is a personal inventory management tool, but feel free to fork and adapt for your own use!

## 📄 License

MIT License - see LICENSE file for details

---

*Built with ❤️ for the Steam trading community*