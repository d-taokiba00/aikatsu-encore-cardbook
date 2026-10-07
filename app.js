const MASTER_URL = './cards.json';
const STORAGE_KEY = 'aikatsu-encore-cardbook-v01';
let cards = [];
let owned = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

const $ = s => document.querySelector(s);

async function init(){
  try{
    const res = await fetch(MASTER_URL, {cache:'no-store'});
    if(!res.ok) throw new Error('cards.json を読み込めません');
    cards = await res.json();
    render();
  }catch(e){
    $('#cardList').innerHTML = `<div class="loading">カードデータを読み込めませんでした。<br>${e.message}</div>`;
  }
}

function imageCandidates(id){
  return [`images/${id}.webp`,`images/${id}.jpg`,`images/${id}.jpeg`,`images/${id}.png`];
}

function render(){
  $('#totalCount').textContent = cards.length;
  $('#cardList').innerHTML = cards.map(card => cardHTML(card)).join('');
  updateSummary();
}

function cardHTML(card){
  const n = Number(owned[card.id] || 0);
  const meta = [card.brand,card.type,card.rarity].filter(Boolean).join(' / ');
  const candidates = JSON.stringify(imageCandidates(card.id));
  return `<article class="card ${n===0?'unowned':''}" data-id="${escapeHtml(card.id)}">
    <div class="visual"><img src="${imageCandidates(card.id)[0]}" alt="${escapeHtml(card.name||card.id)}" data-candidates='${candidates}' onerror="nextImage(this)"><div class="noimage" hidden>画像なし<br>${escapeHtml(card.id)}</div></div>
    <div class="info"><div class="id">${escapeHtml(card.id)}</div><div class="name">${escapeHtml(card.name||'名称未設定')}</div><div class="meta">${escapeHtml(meta)}</div></div>
    <div class="counter"><button aria-label="${escapeHtml(card.id)}を1枚減らす" onclick="changeOwned('${jsSafe(card.id)}',-1)">−</button><span class="count" id="count-${safeId(card.id)}">${n}</span><button aria-label="${escapeHtml(card.id)}を1枚増やす" onclick="changeOwned('${jsSafe(card.id)}',1)">＋</button></div>
  </article>`;
}

function nextImage(img){
  const list = JSON.parse(img.dataset.candidates);
  const i = Number(img.dataset.i || 0) + 1;
  if(i < list.length){ img.dataset.i=i; img.src=list[i]; return; }
  img.hidden=true; img.parentElement.querySelector('.noimage').hidden=false;
}

function changeOwned(id,delta){
  const next = Math.max(0, Number(owned[id]||0)+delta);
  owned[id]=next;
  localStorage.setItem(STORAGE_KEY,JSON.stringify(owned));
  const el=document.getElementById('count-'+safeId(id));
  if(el) el.textContent=next;
  const card=el?.closest('.card');
  if(card) card.classList.toggle('unowned',next===0);
  updateSummary();
}

function updateSummary(){
  const total=cards.length;
  const have=cards.reduce((s,c)=>s+(Number(owned[c.id])>0?1:0),0);
  $('#ownedCount').textContent=have;
  $('#ownedRate').textContent=total?Math.round(have/total*100)+'%':'0%';
}

function safeId(s){return String(s).replace(/[^a-zA-Z0-9_-]/g,'_')}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function jsSafe(s){return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'")}

init();
