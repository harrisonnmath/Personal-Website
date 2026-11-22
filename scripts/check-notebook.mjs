import assert from 'node:assert/strict';
import {setupNotebook} from '../notebook.js';

const escape = text => String(text??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function mount(pages) {
  const elements = Object.fromEntries(['#notebook-spread','#notebook-count','#notebook-prev','#notebook-next'].map(id=>[id,{innerHTML:'',textContent:'',isConnected:true,querySelector:()=>null}]));
  const handlers = {};
  const frame = {addEventListener:(name,callback)=>{handlers[name]=callback;}};
  elements['#notebook-spread'].closest=()=>frame;
  globalThis.document={querySelector:id=>elements[id]};
  globalThis.window={matchMedia:()=>({matches:true})};
  setupNotebook({name:'Test',notebook:{title:'Test notebook',subtitle:'Test notes',pages}},escape,()=> '');
  return {elements,handlers};
}
const pages=[{photo:'assets/test.jpg',alt:'A test image',title:'First',caption:'<script>test</script>',date:''},{photo:'javascript:alert(1)',title:'Second',caption:'Second note'}];
let {elements,handlers}=mount(pages);
assert.equal(elements['#notebook-prev'].disabled,true);
elements['#notebook-next'].onclick();
assert(elements['#notebook-spread'].innerHTML.includes('assets/test.jpg'));
assert(elements['#notebook-spread'].innerHTML.includes('&lt;script&gt;test&lt;/script&gt;'));
handlers.keydown({key:'ArrowRight',preventDefault(){}});
assert.equal(elements['#notebook-next'].disabled,true);
assert(!elements['#notebook-spread'].innerHTML.includes('src="javascript:'));
elements['#notebook-next'].onclick();
assert.equal(elements['#notebook-count'].textContent,'Entry 2 of 2');
elements['#notebook-prev'].onclick();
assert.equal(elements['#notebook-count'].textContent,'Entry 1 of 2');
({elements}=mount([]));
elements['#notebook-next'].onclick();
assert(elements['#notebook-spread'].innerHTML.includes('still unwritten'));
assert.equal(elements['#notebook-next'].disabled,true);
console.log('Notebook navigation, boundaries, empty state, and safe captions passed.');
