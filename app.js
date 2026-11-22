import {notebookMarkup,setupNotebook} from './notebook.js';
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=v=>{const s=String(v||'').trim();return /^(https?:\/\/|mailto:|#|assets\/|\.\/)/i.test(s)?s:''};
const paths={
 flow:'M5 52 C37 53 47 14 90 16 M3 67 C35 68 44 29 79 29 C117 29 125 72 95 84 C69 95 55 68 71 54 C85 42 109 54 99 68 C92 78 78 68 84 61 M3 83 C30 84 44 61 52 52 M8 99 C43 99 47 82 55 81 M98 16 C117 18 124 25 139 23 M111 37 C125 46 124 58 142 60 M110 94 C124 85 132 84 145 85',
 book:'M15 25 Q45 15 76 31 Q105 15 133 23 L128 104 Q102 94 76 111 Q48 96 12 105 Z M76 31 L76 111 M20 35 Q46 27 65 37 M20 47 Q46 39 65 49 M20 59 Q46 51 65 61 M20 71 Q46 63 65 73 M87 38 Q107 28 123 33 M87 51 Q107 41 123 46 M87 64 Q107 54 123 59 M87 77 Q107 67 123 72 M10 30 L6 112 Q43 104 75 118 Q109 101 134 111 L140 29',
 talk:'M18 23 L133 20 L133 29 L18 32 Z M24 32 L25 99 L127 99 L127 29 M76 99 L76 126 M76 109 L48 132 M76 109 L104 132 M40 83 C65 85 64 52 112 44 M39 46 L66 46 M39 53 L60 53',
 curve:'M20 109 L140 109 M37 130 L37 19 M12 128 C38 123 57 109 69 86 S101 40 137 40 M33 23 L37 16 L41 23 M134 105 L142 109 L134 113',
 nature:'M49 120 L91 46 L101 53 L127 16 L149 121 M74 76 L89 67 L98 77 L108 68 L113 46 M105 94 L116 86 L122 91 M9 110 Q28 82 47 111 Q28 120 9 110 M25 116 L23 135 L33 135 L31 116 M5 136 Q34 131 56 136 M16 108 L18 108 M29 103 L31 103 M36 109 L39 109',
 mail:'M12 42 L133 26 L142 107 L24 122 Z M12 42 L82 82 L133 26 M24 122 L67 75 M142 107 L94 71 M18 49 L25 113 M31 117 L137 103'
};
export function art(type,cls=''){return `<svg class="line-art ${cls}" aria-hidden="true" viewBox="0 0 155 145" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[type]||paths.flow}"/></svg>`;}
let data;
try{data=JSON.parse(sessionStorage.getItem('website-preview')||'null');if(!new URLSearchParams(location.search).has('preview'))data=null;}catch{}
try{data=data||await (await fetch('content.json',{cache:'no-store'})).json();}catch{$('#main').innerHTML='<h1>Unable to load the website</h1><p>Please refresh or check that content.json is available.</p>';throw Error('Content unavailable');}
document.querySelectorAll('[data-name]').forEach(el=>el.textContent=data.name);
const card=c=>`<a class="pinned-card ${esc(c.color)}" href="${esc(safe(c.url)||'#'+c.id)}"><span class="pin" aria-hidden="true"></span><h2>${esc(c.title)}</h2><p>${esc(c.description)}</p>${art(c.illustration)}</a>`;
const portrait=()=>data.photo&&(/^(data:image\/(png|jpeg|webp);base64,|assets\/|https:\/\/)/.test(data.photo))?`<img src="${esc(data.photo)}" alt="${esc(data.name)}" class="portrait-img">`:'<div class="portrait-placeholder" aria-label="Profile photo placeholder"><svg viewBox="0 0 100 110" aria-hidden="true"><circle cx="50" cy="34" r="19"/><path d="M15 99V87a35 35 0 0170 0v12Z"/></svg><span>Profile photo</span></div>';
const back='<a class="back-link" href="#home">Back to the trailhead</a>';
const head=(label,title,desc,backLink=back)=>`${backLink}<header class="page-intro"><span class="eyebrow">${label}</span><h1>${esc(title)}</h1>${desc?`<p class="lede">${esc(desc)}</p>`:''}</header>`;
const coauthorWebsites={
 'Elaine Cozzi':'https://sites.google.com/view/elainecozzi/home',
 'Zachary Radke':'https://sites.google.com/view/zacharyradke/home'
};
const authorLinks=value=>esc(value).replace(/\b(Elaine Cozzi|Zachary Radke)\b/g,name=>`<a href="${coauthorWebsites[name]}">${name}</a>`);
const listItem=(x,type)=>`<article class="entry"><div class="entry-meta">${x.authors?authorLinks(x.authors):esc(x.term||x.date||'')}</div><h2>${esc(x.title)}</h2>${x.status?`<p class="entry-status">${esc(x.status)}</p>`:''}<p>${esc(x.description)}</p><div class="entry-links">${x.detail?`<a class="text-link" href="${x.detail==='sqg'?'#sqg':'#paper/'+encodeURIComponent(x.detail)}">Explore the paper</a>`:''}${safe(x.url)?`<a class="text-link" href="${esc(safe(x.url))}">${type==='paper'?esc(x.pdfLabel||'Read paper (PDF)'):'Open resource'}</a>`:''}${safe(x.publisher)?`<a class="text-link" href="${esc(safe(x.publisher))}">Journal version</a>`:''}${safe(x.source)?`<a class="text-link" href="${esc(safe(x.source))}">arXiv record</a>`:''}</div></article>`;
function render(){
 let route=location.hash.slice(1).split('/')[0]||'home';if(route==='results-map')route='research';let html='';
 const paperId=location.hash.slice(1).split('/')[1];
 const activePaper=route==='sqg'?data.papers.find(p=>p.detail==='sqg'):route==='paper'?data.papers.find(p=>p.detail===paperId):null;
 document.querySelectorAll('nav a').forEach(a=>a.toggleAttribute('aria-current',a.hash==='#'+route));
 if(route==='home')html=`<section class="hero"><div class="hero-copy"><span class="eyebrow">MATHEMATICS · ${esc(data.affiliation)}</span><h1>${esc(data.name)}</h1><p class="role">${esc(data.role)}</p><span class="accent-rule"></span><p class="hero-intro">${esc(data.intro)}</p>${safe(data.cv)?`<div class="entry-links"><a class="text-link" href="${esc(safe(data.cv))}">Read my CV</a></div>`:''}</div><div class="hero-contours" aria-hidden="true">${art('flow')}</div><figure class="portrait">${portrait()}</figure></section><section class="noticeboard" aria-label="Explore the website">${data.cards.map(card).join('')}</section>`;
 else if(route==='research')html=head('RESEARCH','Questions, mechanisms, and proofs',data.researchIntro)+`<div class="topic-tags"><span>Fluid dynamics</span><span>Endpoint regularity</span><span>Aggregation–diffusion</span><span>Geometric PDEs</span></div><section class="entries research-papers">${data.papers.map(x=>listItem(x,'paper')).join('')||'<p>New papers will appear here.</p>'}</section>`;
 else if(route==='teaching')html=head('TEACHING','Teaching',data.teachingIntro)+renderTeaching();
 else if(route==='talks')html=head('TALKS & CONFERENCES','Talks & conferences','Presentations and conference participation, drawn from my CV.')+renderTalks();
 else if(route==='about')html=head('OFF THE CLOCK','Beyond the blackboard',data.about)+notebookMarkup()+`<div class="about-layout"><div class="about-art">${art('nature')}</div><div><h2>A few things I enjoy</h2><ul class="interest-list"><li>Rock climbing</li><li>Time in nature</li><li>Mushrooms and field discoveries</li></ul>${(data.aboutLinks||[]).filter(x=>safe(x.url)).map(x=>`<p><a href="${esc(safe(x.url))}">${esc(x.title)}</a></p>`).join('')}</div></div>`;
 else if(route==='contact')html=head('CV & CONTACT','Get in touch',data.bio)+`<section class="contact-grid"><article><h2>Affiliation</h2><p>${esc(data.role)}<br>${esc(data.affiliation)}</p></article><article><h2>Email</h2>${data.email?`<a class="text-link" href="mailto:${esc(data.email)}">${esc(data.email)}</a>`:'<p>Email address to be added.</p>'}</article><article><h2>Curriculum vitae</h2>${safe(data.cv)?`<a class="text-link" href="${esc(safe(data.cv))}">Read my CV</a>`:'<p>CV to be added.</p>'}</article></section>`;
 else if(route==='lab')html=head('MATH LAB','How often does the better team win?','Explore a simple model: each team scores an independent Poisson number of goals. Change the expected goals and compare the possible outcomes.')+`<section class="lab"><div class="lab-controls"><label>Team A expected goals <output id="a-out">1.8</output><input id="a" type="range" min="0" max="5" value="1.8" step="0.1"></label><label>Team B expected goals <output id="b-out">1.2</output><input id="b" type="range" min="0" max="5" value="1.2" step="0.1"></label></div><div id="probabilities" aria-live="polite"></div><div class="match-result" id="match-result">Try playing a match with these parameters.</div><button id="simulate" class="primary-button">Play a match</button><details><summary>Inside the model</summary><p>The probability of k goals is P(X = k) = e⁻λ λᵏ / k!. We sum the independent score probabilities over wins, draws, and losses. Results concern regulation time; the model ignores tactical changes and overtime.</p></details></section>`;
 else if((route==='sqg'||route==='paper')&&activePaper)html=head('RESEARCH NOTE',activePaper.title,activePaper.description,'<a class="back-link" href="#research">Back to research</a>')+`<p class="entry-meta">${authorLinks(activePaper.authors)}</p><p class="entry-status">${esc(activePaper.status)}</p><div class="entry-links">${safe(activePaper.url)?`<a class="text-link" href="${esc(safe(activePaper.url))}">${esc(activePaper.pdfLabel||'Read paper (PDF)')}</a>`:''}${safe(activePaper.publisher)?`<a class="text-link" href="${esc(safe(activePaper.publisher))}">Journal version</a>`:''}${safe(activePaper.source)?`<a class="text-link" href="${esc(safe(activePaper.source))}">arXiv record</a>`:''}</div><div class="reading-tabs" role="tablist" aria-label="Reading level"><button id="tab-idea" role="tab" data-tab="idea">The idea</button><button id="tab-results" role="tab" data-tab="results">Main results</button><button id="tab-proof" role="tab" data-tab="proof">Proof ideas</button></div><section id="paper-panel" role="tabpanel" tabindex="0" class="paper-panel"></section>`;
 else html=head('PAGE NOT FOUND','This page has moved.','Return to the noticeboard to keep exploring.');
 $('#main').innerHTML=html;
 document.title=(activePaper?activePaper.title+' · '+data.name:(route==='home'?'':({sqg:'SQG paper',research:'Research',teaching:'Teaching',talks:'Talks & conferences',about:'Off the clock',contact:'CV & contact'}[route]||'Page')+' · ')+data.name);
 if(route==='about')setupNotebook(data,esc,art);if(activePaper)setupPaper(activePaper.explanations||(route==='sqg'?data.paperPanels:{}),location.hash.slice(1).split('/')[route==='sqg'?1:2]);
 $('#announcer').textContent=route==='home'?'Noticeboard':document.title;
}
function renderPaperPanel(key,panels){
 const blocks=panels?.[key]||[];
 return blocks.map(block=>{
  const text=esc(block.text).replaceAll('\n','<br>');
  switch(block.type){
   case 'heading':return '<h2>'+text+'</h2>';
   case 'subheading':return '<h3>'+text+'</h3>';
   case 'note':return '<aside class="margin-note">'+text+'</aside>';
   case 'equation':return '<div class="math-display">'+text.replace(/_\{([^{}]*)\}/g,'<sub>$1</sub>').replace(/\^\{([^{}]*)\}/g,'<sup>$1</sup>')+'</div>';
   case 'step':return '<details><summary>'+esc(block.title)+'</summary><p>'+text+'</p></details>';
   default:return '<p>'+text+'</p>';
  }
 }).join('');
}
function setupPaper(panels,initialTab){const select=(key)=>{document.querySelectorAll('[data-tab]').forEach(el=>{el.setAttribute('aria-selected',String(el.dataset.tab===key));el.tabIndex=el.dataset.tab===key?0:-1;});$('#paper-panel').setAttribute('aria-labelledby','tab-'+key);$('#paper-panel').innerHTML=renderPaperPanel(key,panels);};document.querySelectorAll('[data-tab]').forEach(el=>{el.onclick=()=>select(el.dataset.tab);el.onkeydown=e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();let keys=['idea','results','proof'],i=keys.indexOf(el.dataset.tab);i=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3;select(keys[i]);$('#tab-'+keys[i]).focus();}});select(['idea','results','proof'].includes(initialTab)?initialTab:'idea');}
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);$('#main').focus({preventScroll:true});});render();

function renderTeaching(){
 const institutions=[...new Set(data.courses.map(c=>c.institution||''))];
 return institutions.map(institution=>'<section class="teaching-history"><h2>'+esc(institution)+'</h2><div class="teaching-table-wrap"><table class="teaching-table"><thead><tr><th scope="col">Term</th><th scope="col">Course</th><th scope="col">Role</th></tr></thead><tbody>'+data.courses.filter(c=>(c.institution||'')===institution).map(c=>'<tr><td>'+esc(c.term)+'</td><td>'+(safe(c.url)?'<a href="'+esc(safe(c.url))+'">'+esc(c.title)+'</a>':esc(c.title))+(c.description?'<p>'+esc(c.description)+'</p>':'')+'</td><td>'+esc(c.role||'')+'</td></tr>').join('')+'</tbody></table></div></section>').join('');
}
function renderTalks(){
 const groups=[['Invited talks',data.talks.filter(t=>t.category==='invited')],['Other talks',data.talks.filter(t=>t.category!=='invited')],['Conferences organized',data.conferencesOrganized||[]],['Conferences attended as a speaker',data.conferencesAttended||[]]];
 return groups.filter(([,items])=>items.length).map(([heading,items])=>'<section class="talk-history"><h2>'+heading+'</h2>'+items.map(item=>'<article class="talk-entry"><div class="entry-meta">'+esc(item.date)+'</div><div><h3>'+esc(item.title)+'</h3>'+(item.venue?'<p class="talk-venue">'+esc(item.venue)+'</p>':'')+(item.description?'<p>'+esc(item.description)+'</p>':'')+(safe(item.url)?'<a href="'+esc(safe(item.url))+'">Open resource</a>':'')+'</div></article>').join('')+'</section>').join('')||'<p>Talk details will be added here.</p>';
}
