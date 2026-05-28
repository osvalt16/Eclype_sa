/* ── Éclypse SA — Fonctions communes ── */
const REPO_OWNER='osvalt16',REPO_NAME='Eclype_sa';
const RAW=`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main`;
const API=`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`;

/* Token GitHub */
let _ghTok=null;
async function getToken(){
  if(_ghTok)return _ghTok;
  const l=localStorage.getItem('eclypse_admin_token');
  if(l){_ghTok=l;return l;}
  try{
    const r=await fetch(`${RAW}/config.json?t=${Date.now()}`);
    const d=await r.json();
    if(d.p){_ghTok=d.p.join('');localStorage.setItem('eclypse_admin_token',_ghTok);return _ghTok;}
  }catch(e){}
  return '';
}

/* Lecture fichier GitHub */
async function ghGet(file){
  const t=await getToken();
  const r=await fetch(`${API}/${file}`,{headers:{'Authorization':'token '+t}});
  const j=await r.json();
  return{sha:j.sha,data:JSON.parse(decodeURIComponent(escape(atob(j.content.split('\n').join('')))))};
}

/* Écriture fichier GitHub */
async function ghPut(file,data,sha,msg){
  const t=await getToken();
  const content=btoa(unescape(encodeURIComponent(JSON.stringify(data,null,2))));
  await fetch(`${API}/${file}`,{
    method:'PUT',
    headers:{'Authorization':'token '+t,'Content-Type':'application/json'},
    body:JSON.stringify({message:msg,content,sha})
  });
}

/* Toast */
function showToast(msg,dur=3000){
  const el=document.getElementById('toast');
  if(!el)return;
  el.textContent=msg;el.style.display='block';
  clearTimeout(el._t);el._t=setTimeout(()=>el.style.display='none',dur);
}

/* Session */
function getSession(){
  const s=localStorage.getItem('eclypse_user')||sessionStorage.getItem('eclypse_user');
  return s?JSON.parse(s):null;
}
function setSession(user,remember){
  const s=remember?localStorage:sessionStorage;
  s.setItem('eclypse_user',JSON.stringify(user));
  localStorage.setItem('eclypse_user',JSON.stringify(user));
}
function clearSession(){
  localStorage.removeItem('eclypse_user');
  sessionStorage.removeItem('eclypse_user');
}