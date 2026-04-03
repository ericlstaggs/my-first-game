export function logAction(actionText) {
  console.log(`[Game Action] ${actionText}`);
}

// Console utility functions for sessionStorage debugging
export function viewSessionStorage() {
  console.log('=== SESSION STORAGE CONTENTS ===');
  console.log(`Total items: ${sessionStorage.length}`);
  
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);
    
    console.log(`\n${key}:`);
    
    // Try to parse JSON for better readability
    try {
      const parsed = JSON.parse(value);
      console.log(parsed);
    } catch (e) {
      console.log(value);
    }
  }
  console.log('================================');
}

export function clearSessionStorage() {
  const itemCount = sessionStorage.length;
  sessionStorage.clear();
  console.log(`✅ Cleared all sessionStorage data (${itemCount} items removed)`);
}

export function viewPlayerData() {
  const playerName = sessionStorage.getItem('playerName');
  console.log('=== PLAYER DATA ===');
  console.log('Player Name:', playerName || '(not set)');
  console.log('==================');
}

export function viewLeaderboardData() {
  const leaderboardData = sessionStorage.getItem('leaderboard');
  console.log('=== LEADERBOARD DATA ===');
  
  if (leaderboardData) {
    try {
      const parsed = JSON.parse(leaderboardData);
      console.table(parsed);
    } catch (e) {
      console.log('Raw data:', leaderboardData);
    }
  } else {
    console.log('No leaderboard data found');
  }
  console.log('========================');
}

export function clearPlayerData() {
  sessionStorage.removeItem('playerName');
  console.log('✅ Player data cleared');
}

export function clearLeaderboardData() {
  sessionStorage.removeItem('leaderboard');
  console.log('✅ Leaderboard data cleared');
}

// Make functions globally available for console debugging
if (typeof window !== 'undefined') {
  window.viewSessionStorage = viewSessionStorage;
  window.clearSessionStorage = clearSessionStorage;
  window.viewPlayerData = viewPlayerData;
  window.viewLeaderboardData = viewLeaderboardData;
  window.clearPlayerData = clearPlayerData;
  window.clearLeaderboardData = clearLeaderboardData;
  
  // Let users know what debugging functions are available
  console.log('🛠️ SessionStorage Debug Functions Available:');
  console.log('📋 viewSessionStorage() - Show all sessionStorage contents');
  console.log('👤 viewPlayerData() - Show player name data');
  console.log('🏆 viewLeaderboardData() - Show leaderboard data (table format)');
  console.log('🚮 clearSessionStorage() - Clear all sessionStorage data');
  console.log('🚮 clearPlayerData() - Clear player name only');
  console.log('🚮 clearLeaderboardData() - Clear leaderboard data only');
}