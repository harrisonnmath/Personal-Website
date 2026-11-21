const paperRoute = id => id === 'sqg' ? '#sqg' : '#paper/' + encodeURIComponent(id);

const positions = {
 'endpoint-local':[40,375], 'endpoint-global':[40,640],
 'generalized':[365,375], 'log-well':[295,640], 'log-ill':[550,640], 'sqg':[800,375]
};
const connections = [
 ['question','endpoint','question'],['question','weights','question'],['question','active','question'],
 ['endpoint','endpoint-local','question'],['weights','generalized','question'],['weights','log-ill','question'],['active','sqg','question'],
 ['endpoint-local','endpoint-global','extension'],['generalized','log-well','specialization'],
 ['log-well','log-ill','complement'],['log-ill','mechanism','theme'],['sqg','mechanism','theme']
];

export function resultsMap(data, esc) {
 const nodes=data.resultsMap.nodes;
 const node=id=>{const n=nodes.find(n=>n.id===id),[x,y]=positions[id];return `<button type="button" class="idea-result ${esc(n.outcome)}" style="left:${x}px;top:${y}px" data-result="${esc(id)}" aria-pressed="false" aria-controls="result-detail"><span class="result-kind">${esc(n.label)}</span><strong>${esc(n.space)}</strong><span>${esc(n.graphTitle||n.title)}</span></button>`;};
 return `<section class="results-atlas idea-atlas" aria-label="Connected map of research ideas">
 <div class="atlas-intro"><span class="eyebrow">QUESTIONS · RESULTS · METHODS</span><h2>${esc(data.resultsMap.title)}</h2><p>${esc(data.resultsMap.intro)}</p></div>
 <div class="idea-legend"><span><i class="legend-line"></i>Research direction or added hypothesis</span><span><i class="legend-line dashed"></i>Complementary results or shared ideas</span></div>
 <div class="idea-scroll" role="region" aria-label="Research connections diagram; scroll horizontally on smaller screens" tabindex="0"><div class="idea-network">
 <svg viewBox="0 0 1040 865" class="idea-wires" aria-hidden="true" fill="none"><defs><marker id="idea-direction" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9" stroke="#6b7f61" stroke-width="1.3" fill="none"/></marker></defs>
 <g class="idea-edge" data-from="question" data-to="endpoint"><path d="M520 112 V142 H150 V180"/><text x="190" y="134">change the integrability scale</text></g>
 <g class="idea-edge" data-from="question" data-to="weights"><path d="M520 112 V180"/></g>
 <g class="idea-edge" data-from="question" data-to="active"><path d="M520 112 V142 H890 V180"/><text x="705" y="134">change the equation</text></g>
 <g class="idea-edge" data-from="endpoint" data-to="endpoint-local"><path d="M150 280 V375"/><text x="160" y="333">endpoint estimates</text></g>
 <g class="idea-edge" data-from="weights" data-to="generalized"><path d="M520 280 V320 H475 V375"/><text x="330" y="310">admissible weights</text></g>
 <g class="idea-edge" data-from="weights" data-to="log-ill"><path d="M580 280 V335 H660 V640"/><text x="672" y="510">test the limit</text></g>
 <g class="idea-edge" data-from="active" data-to="sqg"><path d="M890 280 V375"/><text x="900" y="333">nonlocal feedback</text></g>
 <g class="idea-edge" data-from="endpoint-local" data-to="endpoint-global"><path d="M150 515 V640"/><text x="160" y="565">add Dini</text><text x="160" y="586">continuity</text></g>
 <g class="idea-edge" data-from="generalized" data-to="log-well"><path d="M475 515 V555 H405 V640"/><text x="320" y="577">specialize to</text><text x="320" y="598">logarithmic weights</text></g>
 <g class="idea-edge conceptual" data-from="log-well" data-to="log-ill"><path d="M515 715 H550"/><text x="532" y="815" text-anchor="middle">Together: a sharp boundary at α = ½</text><path d="M405 785 V795 H660 V785"/></g>
 <g class="idea-edge conceptual" data-from="log-ill" data-to="mechanism"><path d="M770 710 H805"/></g>
 <g class="idea-edge conceptual" data-from="sqg" data-to="mechanism"><path d="M910 515 V645"/><text x="920" y="565">related</text><text x="920" y="586">ideas</text></g>
 </svg>
 <div class="idea-question" data-idea="question"><span class="eyebrow">THE CENTRAL QUESTION</span><h3>When does regularity control nonlinear transport?</h3></div>
 <div class="idea-concept" data-idea="endpoint" style="left:30px"><span>2D EULER · VORTICITY</span><h3>Explore the L¹ endpoint</h3><p>Can existence survive at critical integrability?</p></div>
 <div class="idea-concept" data-idea="weights" style="left:400px"><span>2D EULER · VELOCITY</span><h3>Refine smoothness</h3><p>How much extra control is enough?</p></div>
 <div class="idea-concept" data-idea="active" style="left:770px"><span>INVISCID SQG · SCALAR</span><h3>Change the transport law</h3><p>What does nonlocal feedback change?</p></div>
 ${Object.keys(positions).map(node).join('')}
 <div class="idea-method" data-idea="mechanism"><span class="eyebrow">A SHARED THEME</span><h3>Transport & amplification</h3><p>Different constructions reveal how small-scale structure grows.</p></div>
 </div></div><p class="atlas-caption">Directions organize the questions. Dashed connections express complementary results or related ideas, rather than implications between theorems. Select a result to highlight its immediate connections.</p>
 <aside id="result-detail" class="result-detail idea-detail" aria-label="Selected result"></aside></section>`;
}

export function setupResultsMap(data, esc, safe) {
  const nodes = data.resultsMap.nodes;
  function select(id) {
    const n = nodes.find(n => n.id === id);
    if (!n) return;
    document.querySelectorAll('[data-result]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.result === id)));
    const paper = data.papers.find(p => p.detail === n.paper);
    document.querySelector('#result-detail').innerHTML = `<span class="result-kind ${esc(n.outcome)}">${esc(n.label)}</span><h3>${esc(n.title)}</h3><div class="selected-space">${esc(n.space)}</div><p>${esc(n.statement)}</p><h4>Assumptions & scope</h4><p>${esc(n.assumptions)}</p><h4>Inside the argument</h4><p>${esc(n.mechanism)}</p>${paper ? `<div class="result-source"><span class="eyebrow">THE PAPER</span><p>${esc(paper.title)}</p><p class="entry-meta">${esc(paper.authors)}<br>${esc(paper.status)}</p><a href="${paperRoute(n.paper)}">Explore the paper</a><a href="${paperRoute(n.paper)}/proof">Read proof ideas</a>${safe(paper.url) ? `<a href="${esc(safe(paper.url))}">Read PDF</a>` : ''}${safe(paper.source) ? `<a href="${esc(safe(paper.source))}">Source record</a>` : ''}</div>` : ''}`;
    document.querySelectorAll('.idea-edge').forEach(edge=>{const linked=edge.dataset.from===id||edge.dataset.to===id;edge.classList.toggle('edge-selected',linked);});
    const linked=new Set(connections.filter(edge=>edge[0]===id||edge[1]===id).flatMap(edge=>edge.slice(0,2)));
    document.querySelectorAll('[data-idea], [data-result]').forEach(el=>{el.classList.toggle('idea-related',linked.has(el.dataset.idea||el.dataset.result));});
    document.querySelector('#map-selection-status').textContent = n.title;
  }
  const status = document.createElement('p');
  status.id = 'map-selection-status';status.className = 'sr-only';status.setAttribute('role','status');
  document.querySelector('.results-atlas').append(status);
  document.querySelectorAll('[data-result]').forEach(button => button.addEventListener('click', () => {
    select(button.dataset.result);

  }));
  select('generalized');
}
