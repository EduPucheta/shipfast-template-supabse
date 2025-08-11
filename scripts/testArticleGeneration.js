import { generateArticle } from './generateArticles.js';

// Test script to verify article generation
async function testGeneration() {
  console.log('Testing article generation...');
  
  try {
    await generateArticle();
    console.log('✅ Article generation test completed successfully');
  } catch (error) {
    console.error('❌ Article generation test failed:', error);
  }
}

testGeneration();
