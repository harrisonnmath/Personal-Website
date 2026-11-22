import {mkdir,copyFile,rm,cp} from 'node:fs/promises';
import {writeSourceZip} from './source-zip.mjs';
await rm('dist',{recursive:true,force:true}); await mkdir('dist',{recursive:true});
for(const f of ['index.html','editor.html','style.css','app.js','editor.js','notebook.js','boot-trail.js','content.json']) await copyFile(f,'dist/'+f);
await cp('assets','dist/assets',{recursive:true});
await mkdir('dist/downloads',{recursive:true});
const files=['index.html','editor.html','style.css','app.js','editor.js','notebook.js','boot-trail.js','content.json','assets','scripts','package.json','README.md','AGENTS.md','.github','.gitignore','start-website.cmd'];
await writeSourceZip(files,'dist/downloads/website-source.zip');
console.log('Built portable website in dist/ (including source download).');
