const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),site=path.join(root,'site'),manifest=JSON.parse(fs.readFileSync(path.join(root,'package-manifest.json'),'utf8'));
const expectedRepo='markautomationva-lab/mark-automates-staging',base='/mark-automates-staging/';
assert.equal(manifest.repository,expectedRepo);assert.equal(manifest.mode,'staging');assert.equal(manifest.base,base);
if(process.env.GITHUB_ACTIONS==='true'){assert.equal(process.env.GITHUB_REPOSITORY,expectedRepo);assert.equal(process.env.GITHUB_REF,'refs/heads/main');assert.equal(process.env.GITHUB_EVENT_NAME,'workflow_dispatch');assert.match(process.env.APPROVED_SHA||'',/^[a-f0-9]{40}$/);assert.equal(process.env.APPROVED_SHA,process.env.GITHUB_SHA,'Dispatch the exact commit you approved.');}
const list=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const p=path.join(dir,e.name);assert(!e.isSymbolicLink(),'Symlinks are prohibited');return e.isDirectory()?list(p):[path.relative(site,p).replaceAll('\\','/')];});
const files=list(site),declared=manifest.files.map(f=>f.file);assert.deepEqual(files.sort(),declared.sort(),'Exact approved inventory required');
const disallowed=/(^|\/)(?:checks|docs|node_modules|\.git|\.github|backups|hero-integration)(\/|$)|(^|\/)\.env|\.(?:zip|blend|cjs|map|json)$/i;
const signatures=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}/,/\bAKIA[A-Z0-9]{16}\b/,/\beyJ[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}/,/https?:\/\/[^\s"<>]+\/webhook(?:-test)?\//i];
for(const item of manifest.files){assert(!item.file.includes('..')&&!path.isAbsolute(item.file));assert(!disallowed.test(item.file));const full=path.join(site,item.file),body=fs.readFileSync(full);assert.equal(body.length,item.bytes,item.file+' size');assert.equal(crypto.createHash('sha256').update(body).digest('hex'),item.sha256,item.file+' hash');if(/\.(?:html|js|css|svg|txt|xml|vtt)$/.test(item.file)){const text=body.toString('utf8');assert(!signatures.some(r=>r.test(text)),'Sensitive signature; value withheld: '+item.file);}}
assert(fs.existsSync(path.join(site,'.nojekyll')));assert(!fs.existsSync(path.join(site,'CNAME')));
for(const file of ['index.html','how-it-works/index.html']){const html=fs.readFileSync(path.join(site,file),'utf8');assert(html.includes('<base href="'+base+'">'));assert(html.includes('name="robots" content="noindex,nofollow"'));}
assert(fs.readFileSync(path.join(site,'robots.txt'),'utf8').includes('Disallow: /'));
assert.equal((fs.readFileSync(path.join(site,'index.html'),'utf8').match(/data-video-captions=/g)||[]).length,6);
console.log('PASS: '+files.length+' exact approved files; staging base, noindex, six captions, safe inventory, hashes, no CNAME.');
