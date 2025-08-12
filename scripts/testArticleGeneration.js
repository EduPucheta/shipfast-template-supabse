import { config } from 'dotenv';
import { generateArticle } from './generateArticles.js';

// Load environment variables from .env.local file
config({ path: '.env.local' });

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
