import assert from 'node:assert/strict';import {readFile,access} from 'node:fs/promises';import {execFileSync} from 'node:child_process';
const d=JSON.parse(await readFile('content.json','utf8'));assert.equal(typeof d.name,'string');assert(d.name.length);assert(d.cards.length>0);assert(!d.cards.some(c=>c.id==='lab'));
const routes=new Set(['research','teaching','talks','about','contact','sqg','home']);
for(const c of d.cards){assert(c.id&&c.title&&c.description);assert(['cream','sage','clay'].includes(c.color));assert(['flow','book','talk','curve','nature','mail'].includes(c.illustration));if(c.url.startsWith('#'))assert(routes.has(c.url.slice(1)));else assert(/^https?:\/\//.test(c.url));}
for(const k of ['papers','courses','talks','conferencesOrganized','conferencesAttended','aboutLinks'])assert(Array.isArray(d[k]));
const paperIds=new Set();
for(const paper of d.papers){
 if(!paper.detail)continue;
 assert(/^[a-z0-9-]+$/.test(paper.detail),'Paper page IDs must be URL-safe');
 assert(!paperIds.has(paper.detail),'Duplicate paper page ID');paperIds.add(paper.detail);
 const panels=paper.detail==='sqg'?d.paperPanels:paper.explanations;
 for(const key of ['idea','results','proof']){
 assert(Array.isArray(panels?.[key]),'Missing paper explanation: '+paper.detail+'/'+key);
 for(const block of panels[key]){
  assert(['heading','subheading','paragraph','note','equation','step'].includes(block.type));
  assert.equal(typeof block.text,'string');
  if(block.type==='step')assert.equal(typeof block.title,'string');
 }
 }
 if(paper.url?.startsWith('assets/')&&paper.url.endsWith('.pdf')){
  const pdf=await readFile(paper.url);assert.equal(pdf.subarray(0,5).toString(),'%PDF-','Invalid PDF: '+paper.url);
 }
}
assert.equal(typeof d.notebook.title,'string');assert(Array.isArray(d.notebook.pages));
for(const page of d.notebook.pages){for(const key of ['photo','caption','title','alt','date'])assert.equal(typeof page[key],'string');}
for(const f of ['app.js','editor.js','notebook.js','scripts/serve.mjs','scripts/build.mjs'])execFileSync(process.execPath,['--check',f]);
for(const f of ['index.html','editor.html','style.css','README.md','AGENTS.md','.github/workflows/pages.yml','assets/favicon.svg'])await access(f);
const html=await readFile('index.html','utf8');assert(html.includes('viewport'));assert(html.includes('id="main"'));assert(!/https?:\/\/.*(?:cdn|googleapis)/.test(html));
execFileSync(process.execPath,['scripts/check-notebook.mjs'],{stdio:'inherit'});
console.log('Content, navigation destinations, required files and JavaScript syntax passed.');
