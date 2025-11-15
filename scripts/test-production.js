// Production performance test
// Measures real-world performance on Vercel

import 'dotenv/config';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../.env.local') });

const PROD_URL = 'https://shadcn-4tfk8v1ph-marcelo-arias-projects-172831c7.vercel.app';
const BYPASS_SECRET = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

const ALL_PAGES = [
  'index',
  'quemsomos', 
  'purificacao',
  'tratamentos',
  'artigos',
  'testemunhos',
  'contato'
];

async function fetchPageWithTiming(pageId) {
  const timingBreakdown = { page: pageId };
  
  const requestStart = Date.now();
  
  try {
    // Build URL with bypass token if available
    let url = `${PROD_URL}/api/content-v2?pages=${pageId}`;
    if (BYPASS_SECRET) {
      url += `&x-vercel-protection-bypass=${BYPASS_SECRET}&x-vercel-set-bypass-cookie=true`;
    }
    
    const response = await fetch(url);
    
    const networkTime = Date.now() - requestStart;
    timingBreakdown.network = networkTime;
    
    if (!response.ok) {
      return { 
        ...timingBreakdown,
        success: false, 
        error: `HTTP ${response.status}` 
      };
    }
    
    const parseStart = Date.now();
    const data = await response.json();
    const parseTime = Date.now() - parseStart;
    timingBreakdown.jsonParse = parseTime;
    
    const totalTime = Date.now() - requestStart;
    timingBreakdown.clientTotal = totalTime;
    
    if (data.timings) {
      timingBreakdown.serverTotal = data.timings.total;
      timingBreakdown.serverOperations = data.timings.operations;
      timingBreakdown.overhead = totalTime - data.timings.total;
    }
    
    timingBreakdown.source = data.sources?.[pageId] || 'unknown';
    timingBreakdown.success = true;
    
    return timingBreakdown;
    
  } catch (error) {
    const totalTime = Date.now() - requestStart;
    return { 
      ...timingBreakdown,
      clientTotal: totalTime,
      success: false, 
      error: error.message 
    };
  }
}

async function runProductionTest(cycleNum) {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║   CYCLE ${cycleNum}: PRODUCTION PERFORMANCE TEST                  ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝\n`);
  
  const cycleStart = Date.now();
  
  const promises = ALL_PAGES.map(pageId => fetchPageWithTiming(pageId));
  const results = await Promise.all(promises);
  
  const cycleTime = Date.now() - cycleStart;
  
  results.sort((a, b) => (b.clientTotal || 0) - (a.clientTotal || 0));
  
  console.log('┌─────────────┬────────┬─────────┬──────────┬──────────┬──────────┐');
  console.log('│ Page        │ Source │ Network │ Server   │ Overhead │ Total    │');
  console.log('├─────────────┼────────┼─────────┼──────────┼──────────┼──────────┤');
  
  results.forEach(result => {
    if (!result.success) {
      console.log(`│ ${result.page.padEnd(11)} │ ERROR  │ ${result.error.padEnd(42)} │`);
      return;
    }
    
    const page = result.page.padEnd(11);
    const source = (result.source || '?').padEnd(6);
    const network = `${result.network || 0}ms`.padEnd(7);
    const server = `${result.serverTotal || 0}ms`.padEnd(8);
    const overhead = `${result.overhead || 0}ms`.padEnd(8);
    const total = `${result.clientTotal || 0}ms`.padEnd(8);
    
    console.log(`│ ${page} │ ${source} │ ${network} │ ${server} │ ${overhead} │ ${total} │`);
  });
  
  console.log('└─────────────┴────────┴─────────┴──────────┴──────────┴──────────┘');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  const clientTotals = results.filter(r => r.success).map(r => r.clientTotal);
  const serverTotals = results.filter(r => r.success && r.serverTotal).map(r => r.serverTotal);
  const networkTimes = results.filter(r => r.success).map(r => r.network);
  const overheads = results.filter(r => r.success && r.overhead).map(r => r.overhead);
  
  const avg = (arr) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
  const min = (arr) => arr.length > 0 ? Math.min(...arr) : 0;
  const max = (arr) => arr.length > 0 ? Math.max(...arr) : 0;
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log(`║   CYCLE ${cycleNum} STATISTICS                                     ║`);
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`Cycle completed in:     ${cycleTime}ms`);
  console.log(`Successful:             ${successful}/${ALL_PAGES.length} pages`);
  console.log(`Failed:                 ${failed} pages`);
  console.log('');
  console.log('CLIENT TOTAL (end-to-end):');
  console.log(`  Average:              ${avg(clientTotals)}ms`);
  console.log(`  Min:                  ${min(clientTotals)}ms`);
  console.log(`  Max:                  ${max(clientTotals)}ms`);
  console.log('');
  console.log('SERVER PROCESSING:');
  console.log(`  Average:              ${avg(serverTotals)}ms`);
  console.log(`  Min:                  ${min(serverTotals)}ms`);
  console.log(`  Max:                  ${max(serverTotals)}ms`);
  console.log('');
  console.log('NETWORK LATENCY:');
  console.log(`  Average:              ${avg(networkTimes)}ms`);
  console.log(`  Min:                  ${min(networkTimes)}ms`);
  console.log(`  Max:                  ${max(networkTimes)}ms`);
  console.log('');
  console.log('OVERHEAD (network + parse):');
  console.log(`  Average:              ${avg(overheads)}ms`);
  console.log(`  Min:                  ${min(overheads)}ms`);
  console.log(`  Max:                  ${max(overheads)}ms`);
  console.log('');
  
  const cacheHits = results.filter(r => r.source === 'cache').length;
  const dbHits = results.filter(r => r.source === 'db').length;
  
  console.log('DATA SOURCE:');
  console.log(`  Cache hits:           ${cacheHits}`);
  console.log(`  DB hits:              ${dbHits}`);
  console.log('════════════════════════════════════════════════════════════');
  
  return {
    cycleNum,
    cycleTime,
    avgClient: avg(clientTotals),
    avgServer: avg(serverTotals),
    avgNetwork: avg(networkTimes),
    avgOverhead: avg(overheads),
    cacheHits,
    dbHits,
    results
  };
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   PRODUCTION PERFORMANCE TEST - 2 CYCLES                  ║');
  console.log('║   Testing on Vercel Edge Functions                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🌐 URL: ${PROD_URL}`);
  console.log(`📋 Pages: ${ALL_PAGES.join(', ')}`);
  
  // Cycle 1 - Cold cache
  const cycle1 = await runProductionTest(1);
  
  console.log('\n⏳ Waiting 3 seconds before Cycle 2...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Cycle 2 - Warm cache
  const cycle2 = await runProductionTest(2);
  
  // Comparison
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   📊 COMPARISON: CYCLE 1 vs CYCLE 2                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  console.log('CLIENT TOTAL (end-to-end):');
  const clientChange = ((cycle1.avgClient - cycle2.avgClient) / cycle1.avgClient * 100).toFixed(1);
  console.log(`  ${cycle1.avgClient}ms → ${cycle2.avgClient}ms (${clientChange}% improvement)`);
  
  console.log('\nSERVER PROCESSING:');
  const serverChange = ((cycle1.avgServer - cycle2.avgServer) / cycle1.avgServer * 100).toFixed(1);
  console.log(`  ${cycle1.avgServer}ms → ${cycle2.avgServer}ms (${serverChange}% improvement)`);
  
  console.log('\nNETWORK LATENCY:');
  const networkChange = ((cycle1.avgNetwork - cycle2.avgNetwork) / cycle1.avgNetwork * 100).toFixed(1);
  console.log(`  ${cycle1.avgNetwork}ms → ${cycle2.avgNetwork}ms (${networkChange}% change)`);
  
  console.log('\nDATA SOURCE:');
  console.log(`  Cache: ${cycle1.cacheHits} → ${cycle2.cacheHits}`);
  console.log(`  DB: ${cycle1.dbHits} → ${cycle2.dbHits}`);
  
  // Calculate speedup
  if (cycle1.avgClient > cycle2.avgClient) {
    const speedup = (cycle1.avgClient / cycle2.avgClient).toFixed(2);
    console.log(`\n🚀 SPEEDUP: ${speedup}x faster with cache`);
  }
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   🎯 PRODUCTION vs DEV COMPARISON                          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  console.log('Development (Vercel Dev):');
  console.log('  Server processing:    ~35ms');
  console.log('  Total time:           ~1900ms (with dev overhead)');
  console.log('');
  console.log('Production (Vercel Edge):');
  console.log(`  Server processing:    ~${cycle2.avgServer}ms`);
  console.log(`  Total time:           ~${cycle2.avgClient}ms`);
  console.log('');
  
  const devOverhead = 1900 - 35;
  const prodOverhead = cycle2.avgClient - cycle2.avgServer;
  const overheadImprovement = ((devOverhead - prodOverhead) / devOverhead * 100).toFixed(1);
  
  console.log('📉 Overhead reduction:');
  console.log(`  Dev overhead:         ${devOverhead}ms`);
  console.log(`  Prod overhead:        ${prodOverhead}ms`);
  console.log(`  Improvement:          ${overheadImprovement}% reduction`);
  console.log('');
}

main().catch(console.error);
