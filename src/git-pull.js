import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import { promises as fs } from 'fs';

async function pullFromGitHub() {
  try {
    await git.init({ fs, dir: '.' });
    await git.addRemote({
      fs,
      dir: '.',
      remote: 'origin',
      url: 'https://github.com/niteshprakashkesarkar3/scoreboard.git' // Replace with your GitHub repo URL
    });
    
    await git.pull({
      fs,
      http,
      dir: '.',
      ref: 'main',
      remote: 'origin',
    });
    
    console.log('Successfully pulled latest changes');
  } catch (error) {
    console.error('Error pulling from GitHub:', error);
  }
}

pullFromGitHub();