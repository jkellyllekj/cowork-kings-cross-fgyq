(function(){
var P=window.PLACES,list=document.getElementById('list'),nav=document.getElementById('nav'),filter='all',sort='order';
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function photos(p){
 if(!p.photos.length)return '<div class="photos"><div class="placeholder"><span>No photo available. See the website and map links below.</span></div></div>';
 return '<div class="photos ph">'+p.photos.map(function(f){return '<figure><img loading="lazy" src="'+esc(f.src)+'" alt="'+esc(p.name)+'" referrerpolicy="no-referrer"><figcaption>Photo: <a href="'+esc(f.url)+'" target="_blank" rel="noopener">'+esc(f.credit)+'</a>. '+esc(f.lic)+'</figcaption></figure>'}).join('')+'</div>';
}
function card(p){
 return '<article class="card" id="'+p.id+'"><h2>'+esc(p.name)+'</h2>'+
 (p.unsure?'<span class="tag unsure">not sure</span>':'')+'<span class="tag">'+(p.free?'free or low cost':'paid')+'</span><span class="tag">'+esc(p.area)+'</span>'+
 photos(p)+
 '<dl><dt>Address</dt><dd>'+esc(p.address)+'</dd><dt>Nearest</dt><dd>'+esc(p.station)+'</dd><dt>Hours</dt><dd>'+esc(p.hours)+'</dd><dt>Price</dt><dd>'+esc(p.price)+'</dd></dl>'+
 '<p class="line">'+esc(p.line)+'</p><div class="btns"><a href="'+esc(p.maps)+'" target="_blank" rel="noopener">Open in Google Maps</a>'+(p.site?'<a class="alt" href="'+esc(p.site)+'" target="_blank" rel="noopener">Official website</a>':'')+'</div></article>';
}
function render(){
 var a=P.filter(function(p){return filter==='all'||(filter==='free'&&p.free)||(filter==='paid'&&!p.free)||(filter==='unsure'&&p.unsure)});
 if(sort==='name')a=a.slice().sort(function(x,y){return x.name.localeCompare(y.name)});
 if(sort==='free')a=a.slice().sort(function(x,y){return (y.free?1:0)-(x.free?1:0)});
 list.innerHTML=a.map(card).join('')||'<p>Nothing here.</p>';
 nav.innerHTML=a.map(function(p){return '<a href="#'+p.id+'">'+esc(p.name.split(',')[0].split(' (')[0])+'</a>'}).join('');
}
document.getElementById('chips').addEventListener('click',function(e){var b=e.target.closest('.chip');if(!b)return;filter=b.dataset.f;[].forEach.call(this.children,function(c){c.classList.toggle('on',c===b)});render()});
document.getElementById('sort').addEventListener('change',function(){sort=this.value;render()});
document.getElementById('theme').addEventListener('click',function(){var r=document.documentElement,d=(r.dataset.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'))==='dark';r.dataset.theme=d?'light':'dark'});
list.addEventListener('click',function(e){if(e.target.tagName==='IMG'){var o=document.createElement('div');o.className='lb';o.innerHTML='<img src="'+e.target.src+'">';o.onclick=function(){o.remove()};document.body.appendChild(o)}});
render();
if(window.L){var map=L.map('map').setView([51.529,-0.125],12),pts=[];
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
 P.forEach(function(p){if(p.lat==null)return;pts.push([p.lat,p.lng]);
  var im=p.photos.length?'<img src="'+esc(p.photos[0].src)+'" referrerpolicy="no-referrer">':'';
  L.marker([p.lat,p.lng]).addTo(map).bindPopup('<div class="pop">'+im+'<div class="b"><strong>'+esc(p.name)+'</strong><a href="#'+p.id+'">See details</a></div></div>')});
 map.fitBounds(pts,{padding:[20,20]});}
})();
