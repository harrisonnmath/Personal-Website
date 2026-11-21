import http from 'node:http';
import {readFile,writeFile,rename} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const base=resolve('.');const port=Number(process.env.PORT||3000);const host='127.0.0.1';
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.pdf':'application/pdf','.zip':'application/zip'};
http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/__local_content'&&req.method==='GET'){res.setHeader('Content-Type','application/json');return res.end('{"local":true}');}
 if(url.pathname==='/__local_content'&&req.method==='PUT'){
  const origin=req.headers.origin;
  if(!origin||!['http://localhost:'+port,'http://127.0.0.1:'+port].includes(origin)){res.writeHead(403);return res.end('Same-origin local editor required.');}
  let body='';for await(const chunk of req){body+=chunk;if(body.length>4000000){res.writeHead(413);return res.end('Content is too large.');}}
  const data=JSON.parse(body);if(!data.name||!Array.isArray(data.cards))throw Error('Invalid content');
  await writeFile('content.json.tmp',JSON.stringify(data,null,2)+'\n');await rename('content.json.tmp','content.json');res.setHeader('Content-Type','application/json');return res.end('{"saved":true}');
 }
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
 const relative=decodeURIComponent(url.pathname).replace(/^\/+/, '')||'index.html';
 if(relative.split('/').some(p=>p.startsWith('.'))){res.writeHead(404);return res.end();}
 const path=resolve(base,relative==='downloads/website-source.zip'?'dist/downloads/website-source.zip':relative);if(!path.startsWith(base+sep)){res.writeHead(403);return res.end();}
 const data=await readFile(path);res.setHeader('Content-Type',types[extname(path)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404);res.end('Page or file not found.');}
}).listen(port,host,()=>console.log('Website and local editor: http://'+host+':'+port));
