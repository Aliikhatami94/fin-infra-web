#!/usr/bin/env tsx
/**
 * Test script to verify fin-web can connect to fin-api backend.
 * 
 * Usage:
 *   pnpm tsx scripts/test-api-integration.ts
 * 
 * Tests:
 * - Backend connectivity
 * - v0 API endpoints
 * - Data transformation
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const TEST_USER_ID = 'test_user'

interface TestResult {
  endpoint: string
  method: string
  status: 'pass' | 'fail'
  statusCode?: number
  duration?: number
  error?: string
  data?: any
}

const results: TestResult[] = []

async function testEndpoint(
  endpoint: string,
  method: string = 'GET',
  body?: any
): Promise<TestResult> {
  const startTime = Date.now()
  const url = `${API_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    
    const duration = Date.now() - startTime
    const data = await response.json().catch(() => null)
    
    return {
      endpoint,
      method,
      status: response.ok ? 'pass' : 'fail',
      statusCode: response.status,
      duration,
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : data?.detail || 'Request failed',
    }
  } catch (error) {
    return {
      endpoint,
      method,
      status: 'fail',
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

async function runTests() {
  console.log('🧪 Testing fin-api Integration\n')
  console.log(`API URL: ${API_URL}`)
  console.log(`Test User: ${TEST_USER_ID}\n`)
  console.log('─'.repeat(80))
  
  // Test 1: Health check
  console.log('\n1️⃣  Testing connectivity...')
  const healthResult = await testEndpoint('/ping')
  results.push(healthResult)
  printResult(healthResult)
  
  // Test 2: Dashboard KPIs
  console.log('\n2️⃣  Testing Dashboard KPIs...')
  const kpisResult = await testEndpoint(`/v0/dashboard/kpis?user_id=${TEST_USER_ID}`)
  results.push(kpisResult)
  printResult(kpisResult)
  
  if (kpisResult.status === 'pass' && kpisResult.data) {
    console.log('\n   📊 KPI Structure:')
    console.log(`      - Net Worth: $${kpisResult.data.net_worth.value.toLocaleString()}`)
    console.log(`      - Cash Flow: $${kpisResult.data.cash_flow.net.toLocaleString()}/month`)
    console.log(`      - Savings Rate: ${(kpisResult.data.savings_rate.rate * 100).toFixed(1)}%`)
  }
  
  // Test 3: Dashboard Summary
  console.log('\n3️⃣  Testing Dashboard Summary...')
  const summaryResult = await testEndpoint(`/v0/dashboard/summary?user_id=${TEST_USER_ID}`)
  results.push(summaryResult)
  printResult(summaryResult)
  
  // Test 4: Insights Feed
  console.log('\n4️⃣  Testing Insights Feed...')
  const insightsResult = await testEndpoint(`/v0/insights/feed?user_id=${TEST_USER_ID}&limit=5`)
  results.push(insightsResult)
  printResult(insightsResult)
  
  if (insightsResult.status === 'pass' && insightsResult.data) {
    const insights = insightsResult.data.insights || []
    console.log(`\n   💡 Found ${insights.length} insights`)
  }
  
  // Test 5: Portfolio Metrics
  console.log('\n5️⃣  Testing Portfolio Metrics...')
  const portfolioResult = await testEndpoint(`/v0/portfolio/metrics?user_id=${TEST_USER_ID}`)
  results.push(portfolioResult)
  printResult(portfolioResult)
  
  // Test 6: Banking Connection Status
  console.log('\n6️⃣  Testing Banking Connection Status...')
  const bankingResult = await testEndpoint(`/v0/banking-connection/status?user_id=${TEST_USER_ID}`)
  results.push(bankingResult)
  printResult(bankingResult)
  
  // Test 7: AI Categories
  console.log('\n7️⃣  Testing AI Categories...')
  const categoriesResult = await testEndpoint('/v0/ai/categories')
  results.push(categoriesResult)
  printResult(categoriesResult)
  
  // Print Summary
  console.log('\n' + '─'.repeat(80))
  console.log('\n📈 Test Summary\n')
  
  const passed = results.filter(r => r.status === 'pass').length
  const failed = results.filter(r => r.status === 'fail').length
  const avgDuration = Math.round(
    results.reduce((sum, r) => sum + (r.duration || 0), 0) / results.length
  )
  
  console.log(`✅ Passed: ${passed}/${results.length}`)
  console.log(`❌ Failed: ${failed}/${results.length}`)
  console.log(`⏱️  Average Response Time: ${avgDuration}ms`)
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:')
    results.filter(r => r.status === 'fail').forEach(r => {
      console.log(`   - ${r.method} ${r.endpoint}: ${r.error}`)
    })
  }
  
  console.log('\n' + '─'.repeat(80))
  
  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0)
}

function printResult(result: TestResult) {
  const statusIcon = result.status === 'pass' ? '✅' : '❌'
  const statusCode = result.statusCode ? ` [${result.statusCode}]` : ''
  const duration = result.duration ? ` (${result.duration}ms)` : ''
  
  console.log(`   ${statusIcon} ${result.method} ${result.endpoint}${statusCode}${duration}`)
  
  if (result.error) {
    console.log(`      Error: ${result.error}`)
  }
}

// Run tests
runTests().catch(error => {
  console.error('\n💥 Test runner crashed:', error)
  process.exit(1)
})
