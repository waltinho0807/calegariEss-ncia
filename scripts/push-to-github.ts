// Script to push code to GitHub repository
// Uses GitHub integration from Replit

import { Octokit } from '@octokit/rest';
import * as fs from 'fs';
import * as path from 'path';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

const OWNER = 'waltinho0807';
const REPO = 'Scented-Store-1';

const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  '.cache',
  '.config',
  'dist',
  '.replit',
  'replit.nix',
  '.upm',
  'scripts/push-to-github.ts',
  'package-lock.json',
  '.breakpoints',
  'generated-icon.png',
  'tsconfig.tsbuildinfo',
  '.local'
];

function shouldIgnore(filePath: string): boolean {
  return IGNORE_PATTERNS.some(pattern => filePath.includes(pattern));
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (shouldIgnore(fullPath)) return;
    
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function pushToGitHub() {
  console.log('Connecting to GitHub...');
  const octokit = await getUncachableGitHubClient();
  
  console.log(`Pushing to ${OWNER}/${REPO}...`);
  
  // Get all files
  const files = getAllFiles('.');
  console.log(`Found ${files.length} files to upload`);

  // Build file tree for Contents API (works with empty repos)
  for (const filePath of files) {
    const content = fs.readFileSync(filePath);
    const relativePath = filePath.startsWith('./') ? filePath.slice(2) : filePath;
    
    try {
      // Check if file exists
      let sha: string | undefined;
      try {
        const { data: existingFile } = await octokit.repos.getContent({
          owner: OWNER,
          repo: REPO,
          path: relativePath
        });
        if ('sha' in existingFile) {
          sha = existingFile.sha;
        }
      } catch (e) {
        // File doesn't exist, that's fine
      }

      await octokit.repos.createOrUpdateFileContents({
        owner: OWNER,
        repo: REPO,
        path: relativePath,
        message: `Add ${relativePath}`,
        content: content.toString('base64'),
        sha: sha
      });
      
      console.log(`✓ Uploaded: ${relativePath}`);
    } catch (err: any) {
      console.error(`✗ Error uploading ${relativePath}:`, err.message);
    }
  }

  console.log('\n✅ Code pushed successfully to GitHub!');
  console.log(`View at: https://github.com/${OWNER}/${REPO}`);
}

pushToGitHub().catch(console.error);
