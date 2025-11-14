(function(){
  var CORE_VERSION = "v1"
  var PANEL_ORIGIN = (function(){
    try {
      var s = document.currentScript;
      if (s && s.dataset && s.dataset.api) return s.dataset.api
      if (s && s.src) { return new URL(s.src).origin }
    } catch(e){}
    return location.origin
  })()
  var firebaseLoaded = !!window.firebase
  function loadScript(src){return new Promise(function(res,rej){var s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
  function ensureFirebase(){
    if(firebaseLoaded) return Promise.resolve()
    return Promise.resolve()
      .then(function(){return loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js')})
      .then(function(){return loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js')})
      .then(function(){return loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js')})
  }
  function initApp(){
    var config={
      apiKey:"AIzaSyD2FZQJEv-2JbyYrve9Odw6F_Y2YRYwpqQ",
      authDomain:"panelcentralweb.firebaseapp.com",
      projectId:"panelcentralweb",
      storageBucket:"panelcentralweb.firebasestorage.app",
      messagingSenderId:"1025406460370",
      appId:"1:1025406460370:web:b0e8f55f96d0b84097280b"
    }
    if(!window.firebase.apps.length) window.firebase.initializeApp(config)
    return { auth: window.firebase.auth(), db: window.firebase.firestore() }
  }
  function siteIdFromDomain(domain){return domain.replace(/[^a-z0-9]+/gi,'-').replace(/^-+|-+$/g,'').toLowerCase()}
  function createBar(user,domain,version){
    var bar=document.createElement('div')
    bar.style.position='fixed'
    bar.style.top='12px'
    bar.style.right='12px'
    bar.style.zIndex='2147483647'
    bar.style.background='rgba(0,0,0,0.8)'
    bar.style.color='#fff'
    bar.style.padding='8px 12px'
    bar.style.borderRadius='8px'
    bar.style.fontSize='12px'
    bar.style.display='flex'
    bar.style.gap='8px'
    bar.innerHTML='<span>Core '+version+'</span><span>'+domain+'</span>'+(user?'<span>'+user.email+'</span>':'')
    var btn=document.createElement('button')
    btn.textContent='Panel'
    btn.style.background='#10b981'
    btn.style.color='#fff'
    btn.style.border='none'
    btn.style.padding='4px 8px'
    btn.style.borderRadius='6px'
    btn.onclick=function(){window.open('https://'+location.host.replace(/^www\./,''),'_blank')}
    bar.appendChild(btn)
    document.body.appendChild(bar)
  }
  function injectHTML(list){list.forEach(function(html){var el=document.createElement('div');el.innerHTML=html;document.body.appendChild(el)})}
  function injectCSS(list){list.forEach(function(css){var s=document.createElement('style');s.textContent=css;document.head.appendChild(s)})}
  function injectJS(list){list.forEach(function(js){var s=document.createElement('script');s.textContent=js;document.head.appendChild(s)})}
  function applyDarkMode(on){var c='core-dark-mode';if(on){document.documentElement.classList.add(c)}else{document.documentElement.classList.remove(c)}}
  function handleCommand(cmd){
    var t=cmd.commandType
    var p=cmd.payload||{}
    if(t==='refresh'){location.reload()}
    if(t==='styles'){injectCSS([p.css||''])}
    if(t==='popup'){var d=document.createElement('div');d.style.position='fixed';d.style.top='0';d.style.left='0';d.style.right='0';d.style.bottom='0';d.style.background='rgba(0,0,0,0.6)';d.style.display='grid';d.style.placeItems='center';var c=document.createElement('div');c.style.background='#fff';c.style.padding='16px';c.textContent=p.text||'';d.appendChild(c);d.onclick=function(){d.remove()};document.body.appendChild(d)}
    if(t==='text'){var sel=p.selector;var txt=p.text;var els=sel?document.querySelectorAll(sel):[];els.forEach(function(e){e.textContent=txt})}
    if(t==='darkmode'){applyDarkMode(Boolean(p.on))}
    if(t==='inject'){injectHTML([p.html||'']);injectCSS([p.css||'']);if(p.scripts&&Array.isArray(p.scripts)){p.scripts.forEach(function(u){var s=document.createElement('script');s.src=u;document.head.appendChild(s)})}}
  }
  function ackCommand(id){fetch(PANEL_ORIGIN+'/api/ack-command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id})}).catch(function(){})}
  function sendLog(domain,type,data){fetch(PANEL_ORIGIN+'/api/ingest-log',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({domain:domain,type:type,data:data})}).catch(function(){})}
  function heartbeat(domain){fetch(PANEL_ORIGIN+'/api/heartbeat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({domain:domain,version:CORE_VERSION})}).catch(function(){})}
  ensureFirebase().then(function(){
    var {auth,db}=initApp()
    var domain=location.hostname
    var siteId=siteIdFromDomain(domain)
    auth.onAuthStateChanged(function(u){if(u) createBar(u,domain,CORE_VERSION)})
    db.collection('globalConfig').doc('default').onSnapshot(function(s){var d=s.exists? s.data() : {};if(d){if(d.maintenanceMode){document.body.innerHTML=''};injectHTML(d.defaultHTMLInjections||[]);injectCSS(d.defaultCSSInjections||[]);injectJS(d.defaultJSInjections||[]);if(d.darkMode) applyDarkMode(true)}})
    db.collection('sites').where('domain','==',domain).limit(1).onSnapshot(function(s){})
    heartbeat(domain); setInterval(function(){heartbeat(domain)},30000)
    db.collection('commands').where('executed','==',false).onSnapshot(function(s){s.forEach(function(d){var c=d.data();if(!c.siteId||c.siteId===domain){handleCommand(c);ackCommand(d.id)}})})
    window.addEventListener('error',function(e){try{sendLog(domain,'error',{message:e.message,stack:e.error&&e.error.stack})}catch{}})
    try{sendLog(domain,'log',{event:'core_loaded',version:CORE_VERSION})}catch{}
  })
})();
