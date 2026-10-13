import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {buildWorld,M,lamps} from './scene.js';
import {buildTrain} from './train.js';
import {buildPetals} from './particles.js';

const $=id=>document.getElementById(id);
let toastTimer;
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2400);}
for(const [button,dialog] of [['nav-story','story-dialog'],['help','help-dialog']])$(button).addEventListener('click',()=>$(dialog).showModal());
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.dialog-close').onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});

try{start();}catch(error){console.error('Exhibition could not initialize:',error);$('loading').style.display='none';$('fallback').hidden=false;}
function start(){
  const wrap=$('canvas-wrap'),viewer=$('viewer');
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;renderer.outputColorSpace=THREE.SRGBColorSpace;
  wrap.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','樱花列车三维模型。拖动旋转，滚轮缩放。');renderer.domElement.tabIndex=0;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,160);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.065;controls.minDistance=5;controls.maxDistance=120;controls.maxPolarAngle=Math.PI*.47;controls.minPolarAngle=.18;controls.autoRotateSpeed=.42;controls.enablePan=true;
  const hemi=new THREE.HemisphereLight(0xe7f3ed,0x7a8660,2.6);scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xfff1cd,4.4);sun.position.set(-7,18,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-16;sun.shadow.camera.right=16;sun.shadow.camera.top=14;sun.shadow.camera.bottom=-14;sun.shadow.normalBias=.045;sun.shadow.bias=-.00008;sun.shadow.radius=3;scene.add(sun);
  const rim=new THREE.DirectionalLight(0xd6e6e4,2.1);rim.position.set(9,8,-12);scene.add(rim);
  const fill=new THREE.DirectionalLight(0xe8eadb,.9);fill.position.set(3,6,15);scene.add(fill);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(150,150),new THREE.ShadowMaterial({color:0x234438,opacity:.16}));ground.rotation.x=-Math.PI/2;ground.position.y=-1.08;ground.receiveShadow=true;scene.add(ground);
  const world=buildWorld(scene),train=buildTrain(world),petals=buildPetals(world);
  let running=false,night=false,tween=null,currentView='overview',lastTime=performance.now();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let petalsEnabled=!reduced;petals.setEnabled(petalsEnabled);$('petals').classList.toggle('selected',petalsEnabled);$('petals').setAttribute('aria-pressed',String(petalsEnabled));$('petals').onclick=()=>{petalsEnabled=!petalsEnabled;petals.setEnabled(petalsEnabled);$('petals').classList.toggle('selected',petalsEnabled);$('petals').setAttribute('aria-pressed',String(petalsEnabled));};
  function mobile(){return innerWidth<=600;}
  function overview(){const aspect=wrap.clientWidth/wrap.clientHeight;const position=mobile()?new THREE.Vector3(25,23,33).multiplyScalar(Math.max(1,.9/aspect)):new THREE.Vector3(20,17,25).multiplyScalar(Math.max(1,1.3/aspect));return {position,target:new THREE.Vector3(0,.6,0)};}
  function view(name,instant=false){
    currentView=name;controls.autoRotate=false;$('rotate').setAttribute('aria-pressed','false');let next;
    if(name==='engine'){setRunning(false);next={target:train.engine.localToWorld(new THREE.Vector3(.25,1.65,0)),position:train.engine.localToWorld(new THREE.Vector3(8,5.7,10))};}
    else if(name==='station'){setRunning(false);next={target:new THREE.Vector3(.25,1.3,-.45),position:new THREE.Vector3(6,6,11)};}
    else next=overview();
    if(mobile()&&name!=='overview'){next.position.sub(next.target).multiplyScalar(name==='station'?2:1.65).add(next.target);}
    if(instant||reduced){camera.position.copy(next.position);controls.target.copy(next.target);controls.update();}
    else tween={from:camera.position.clone(),targetFrom:controls.target.clone(),to:next.position,targetTo:next.target,start:performance.now()};
    document.querySelectorAll('.view-card').forEach(b=>{const active=b.dataset.view===name;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
  }
  function setRunning(value){running=value;$('run-label').textContent=value?'暂停':'出发';$('journey-state').textContent=value?'ON THE WAY':'READY TO GO';$('run').querySelector('.play-icon').textContent=value?'Ⅱ':'▶';$('run').setAttribute('aria-pressed',String(value));}
  $('run').onclick=()=>{if(!running&&currentView!=='overview')view('overview');setRunning(!running);toast(running?'开往春天。':'停一会儿。');};
  $('reset').onclick=()=>view('overview');$('nav-explore').onclick=()=>view('overview');
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>view(b.dataset.view));
  $('rotate').onclick=()=>{tween=null;controls.autoRotate=!controls.autoRotate;$('rotate').setAttribute('aria-pressed',String(controls.autoRotate));};
  function zoom(factor){tween=null;const v=camera.position.clone().sub(controls.target);v.multiplyScalar(factor).clampLength(controls.minDistance,controls.maxDistance);camera.position.copy(controls.target).add(v);controls.update();}
  $('zoom-in').onclick=()=>zoom(.8);$('zoom-out').onclick=()=>zoom(1.25);
  $('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if($('app').requestFullscreen)await $('app').requestFullscreen();else toast('当前浏览器不支持全屏');}catch{toast('当前环境暂不支持全屏');}};
  function light(value){night=value;document.body.classList.toggle('night',value);$('day').classList.toggle('selected',!value);$('night').classList.toggle('selected',value);$('day').setAttribute('aria-pressed',String(!value));$('night').setAttribute('aria-pressed',String(value));}
  $('day').onclick=()=>light(false);$('night').onclick=()=>light(true);
  controls.addEventListener('start',()=>{tween=null;controls.autoRotate=false;$('rotate').setAttribute('aria-pressed','false');});
  function resize(){const w=wrap.clientWidth,h=wrap.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.setViewOffset(w,h,mobile()?0:-w*.05,-h*.025,w,h);camera.updateProjectionMatrix();if(currentView==='overview'&&!tween){const next=overview();camera.position.copy(next.position);controls.target.copy(next.target);controls.update();}}
  new ResizeObserver(resize).observe(wrap);document.addEventListener('fullscreenchange',resize);
  document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||/BUTTON|INPUT|TEXTAREA|A/.test(e.target.tagName))return;if(e.code==='Space'){e.preventDefault();$('run').click();}if(e.key.toLowerCase()==='r')view('overview');if(e.key.toLowerCase()==='n')light(!night);});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();toast('三维画面暂时中断，请刷新页面恢复。');});
  view('overview',true);resize();
  renderer.render(scene,camera);$('loading').style.opacity='0';setTimeout(()=>$('loading').style.display='none',650);
  document.documentElement.dataset.sceneReady='true';
  let lightLevel=0;
  function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-lastTime)/1000,.05);lastTime=now;if(document.hidden)return;
    if(tween){const p=Math.min((now-tween.start)/1100,1),k=p*p*(3-2*p);camera.position.lerpVectors(tween.from,tween.to,k);controls.target.lerpVectors(tween.targetFrom,tween.targetTo,k);if(p===1)tween=null;}
    lightLevel=THREE.MathUtils.damp(lightLevel,night?1:0,4,dt);hemi.intensity=THREE.MathUtils.lerp(1.2,.24,lightLevel);sun.intensity=THREE.MathUtils.lerp(2,.25,lightLevel);rim.intensity=THREE.MathUtils.lerp(.6,.8,lightLevel);fill.intensity=THREE.MathUtils.lerp(.2,.12,lightLevel);rim.color.set(night?0x81b4cf:0xd6e6e4);M.warm.emissiveIntensity=.25+lightLevel*3;M.glass.emissive.set(0xffc875);M.glass.emissiveIntensity=lightLevel*.45;lamps.forEach(l=>l.intensity=lightLevel*5);train.headlamp.intensity=.1+lightLevel*3;ground.material.opacity=.16-lightLevel*.06;
    train.update(dt,running,now/1000);petals.update(dt,now/1000);controls.update();renderer.render(scene,camera);
  }
  requestAnimationFrame(frame);
}
