import * as THREE from 'three';
import {M,material,mesh,box,cylinder,sphere,rod,label,trackPoint} from './scene.js';

export function buildTrain(world){
  const engine=new THREE.Group(),tender=new THREE.Group(),coach=new THREE.Group();world.add(engine,tender,coach);
  const wheels=[],linkages=[];
  function wheel(parent,x,z,r=.46){
    const g=new THREE.Group();g.position.set(x,.71+r,z);parent.add(g);
    const tire=cylinder(g,r,.12,M.iron);tire.rotation.x=Math.PI/2;
    const rim=mesh(g,new THREE.TorusGeometry(r*.83,.041,6,24),M.brass,0,0,z>0?.072:-.072);
    const disk=cylinder(g,r*.64,.125,M.dark);disk.rotation.x=Math.PI/2;
    for(let i=0;i<10;i++){const a=i*Math.PI/5;rod(g,[Math.cos(a)*r*.12,Math.sin(a)*r*.12,.075],[Math.cos(a)*r*.77,Math.sin(a)*r*.77,.075],.025,M.green);}
    const hub=cylinder(g,.093,.19,M.brass);hub.rotation.x=Math.PI/2;
    sphere(g,.06,M.brass,.16,0,z>0?.12:-.12);wheels.push(g);return g;
  }
  // Boiler and smoke box. The engine's forward axis is +X.
  box(engine,3.9,.18,1.12,M.dark,0,1.34,0);
  for(const z of [-.58,.58]){box(engine,2.7,.065,.2,M.brass,.38,1.5,z);box(engine,3.5,.085,.16,M.green,0,1.38,z);}
  const boiler=cylinder(engine,.55,2.55,M.green,.4,2.03,0,48);boiler.rotation.z=Math.PI/2;
  const smokebox=cylinder(engine,.565,.51,M.dark,1.66,2.03,0,48);smokebox.rotation.z=Math.PI/2;
  const face=cylinder(engine,.51,.045,M.iron,1.935,2.03,0,40);face.rotation.z=Math.PI/2;
  const door=cylinder(engine,.405,.05,M.dark,1.966,2.03,0,40);door.rotation.z=Math.PI/2;
  const frontRing=mesh(engine,new THREE.TorusGeometry(.44,.024,8,40),M.brass,2.00,2.03,0);frontRing.rotation.y=Math.PI/2;
  rod(engine,[2.02,1.89,0],[2.02,2.19,0],.025,M.brass);rod(engine,[2.02,2.03,-.14],[2.02,2.03,.14],.025,M.brass);
  for(const x of [-.53,.32,1.05]){const band=mesh(engine,new THREE.TorusGeometry(.553,.025,8,40),M.brass,x,2.03,0);band.rotation.y=Math.PI/2;}
  for(let i=0;i<20;i++){const a=i*Math.PI/10;sphere(engine,.026,M.brass,1.945,2.03+Math.sin(a)*.49,Math.cos(a)*.49);}
  cylinder(engine,.155,.55,M.dark,1.25,2.75,0,28);cylinder(engine,.23,.08,M.brass,1.25,3.05,0,28);cylinder(engine,.14,.06,M.black,1.25,3.1,0,28);
  cylinder(engine,.21,.24,M.green,.16,2.63,0,28);sphere(engine,.21,M.green,.16,2.76,0);cylinder(engine,.08,.24,M.brass,-.44,2.73,0,16);
  for(const z of [-.62,.62]){
    rod(engine,[-.62,2.1,z],[1.47,2.1,z],.023,M.brass);
    for(const x of [-.6,.1,.8,1.45])rod(engine,[x,2.1,z],[x,2.1,z*.84],.019,M.brass);
    rod(engine,[.8,1.58,z],[1.21,1.58,z],.055,M.iron);
    rod(engine,[.5,2.4,z*.8],[-.86,2.4,z*.8],.037,M.brass);
    for(const x of [-.48,.35,1.15])wheel(engine,x,z,.46);
    const bar=box(engine,1.66,.065,.07,M.brass,.35,1.18,z*1.16);linkages.push({bar,z:z*1.16});
    cylinder(engine,.17,.5,M.dark,1.34,1.38,z,16).rotation.z=Math.PI/2;
    box(engine,.48,.075,.25,M.brass,-1.67,1.07,z*1.11);box(engine,.48,.075,.25,M.brass,-1.67,1.26,z*1.11);
    for(const x of [-1.91,-1.53])rod(engine,[x,1.34,z*1.12],[x,1.7,z*1.12],.025,M.brass);
  }
  // Cab walls, windows, roof, number plates and visible controls.
  box(engine,1.1,.18,1.24,M.green,-1.22,1.55,0);
  for(const z of [-.59,.59]){
    box(engine,1.05,.55,.07,M.green,-1.22,1.87,z);
    box(engine,.09,.73,.07,M.green,-1.72,2.48,z);box(engine,.11,.73,.07,M.green,-.74,2.48,z);
    box(engine,1.1,.12,.08,M.green,-1.22,2.83,z);box(engine,.08,.69,.08,M.brass,-1.21,2.49,z);
    box(engine,.4,.58,.035,M.glass,-.96,2.49,z);box(engine,.38,.58,.035,M.glass,-1.47,2.49,z);
    const plate=label(engine,'001',.43,.22,-1.21,1.91,z>0?.636:-.636,'#f1d496','#347f9d');if(z<0)plate.rotation.y=Math.PI;
    for(let i=0;i<7;i++)sphere(engine,.018,M.brass,-1.67+i*.15,1.64,z>0?.64:-.64);
  }
  box(engine,.09,.87,1.18,M.green,-1.77,2.26,0);box(engine,.11,.69,1.16,M.green,-.7,2.48,0);
  for(const z of [-.29,.29])box(engine,.13,.4,.37,M.glass,-.633,2.53,z);
  const roof=box(engine,1.32,.13,1.45,M.dark,-1.24,2.94,0);roof.geometry.translate(0,0,0);
  rod(engine,[-.9,1.71,.15],[-.9,2.0,.15],.03,M.brass);const valve=mesh(engine,new THREE.TorusGeometry(.12,.022,6,14),M.brass,-.9,2.0,.15);valve.rotation.y=Math.PI/2;
  box(engine,.15,.16,1.45,M.dark,2.06,1.39,0);for(const z of [-.46,.46]){const b=cylinder(engine,.11,.26,M.iron,2.23,1.4,z);b.rotation.z=Math.PI/2;}
  for(let i=0;i<8;i++)rod(engine,[2.08,1.41,(i-3.5)*.15],[2.38,1.06,(i-3.5)*.13],.025,M.dark);
  const headlight=cylinder(engine,.13,.15,M.brass,2.07,2.62,0);headlight.rotation.z=Math.PI/2;
  cylinder(engine,.103,.012,M.warm,2.15,2.62,0).rotation.z=Math.PI/2;
  const headlamp=new THREE.PointLight(0xffda92,.1,5,2);headlamp.position.set(2.3,2.6,0);engine.add(headlamp);
  // Tender with a real coal mound.
  box(tender,1.95,.15,1.15,M.dark,0,1.15,0);box(tender,1.8,.65,1.08,M.green,0,1.58,0);
  box(tender,1.7,.04,1.0,M.black,0,1.92,0);
  for(const z of [-.54,.54]){box(tender,1.84,.08,.07,M.brass,0,1.97,z);for(let i=0;i<9;i++)sphere(tender,.021,M.brass,-.8+i*.2,1.37,z);const p=label(tender,'SAKURA',1.16,.2,0,1.64,z>0?.547:-.547);if(z<0)p.rotation.y=Math.PI;}
  for(let i=0;i<33;i++){const x=Math.sin(i*12.73)*.72,z=Math.cos(i*5.13)*.4;const c=mesh(tender,new THREE.IcosahedronGeometry(.16,0),M.black,x,1.97+(1-Math.abs(x))*.18,z);c.rotation.set(i,i*2,i*.7);}
  for(const x of [-.58,.58])for(const z of [-.58,.58])wheel(tender,x,z,.29);
  box(tender,.65,.06,.7,M.dark,-1.22,1.1,0);
  // Cream passenger coach, with separate frames, door handles and roof seams.
  box(coach,3.6,.18,1.28,M.dark,0,1.2,0);box(coach,3.45,1.3,1.18,M.cream,0,1.93,0);box(coach,3.48,.43,1.2,M.green,0,1.47,0);
  for(const z of [-.614,.614]){
    for(let i=0;i<5;i++){const x=-1.18+i*.59;box(coach,.46,.65,.04,M.wood,x,2.11,z);box(coach,.375,.54,.05,M.glass,x,2.11,z*1.03);box(coach,.018,.54,.06,M.brass,x,2.11,z*1.08);box(coach,.4,.025,.07,M.cream,x,2.11,z*1.09);}
    box(coach,3.5,.045,.045,M.brass,0,1.73,z);box(coach,3.5,.05,.045,M.brass,0,2.52,z);
    const p=label(coach,'さ く ら 線',1.0,.19,0,1.45,z*1.005,'#eddbac','#347f9d');if(z<0)p.rotation.y=Math.PI;
  }
  const roofGeo=new THREE.CylinderGeometry(.73,.73,3.8,32,1,false,0,Math.PI);roofGeo.rotateZ(Math.PI/2);mesh(coach,roofGeo,M.dark,0,2.57,0);
  box(coach,3.83,.12,1.44,M.dark,0,2.59,0);
  for(const x of [-1.68,1.68]){box(coach,.04,.96,.63,M.wood,x,2.05,0);box(coach,.05,.49,.36,M.glass,x,2.18,0);for(const z of [-.5,.5])rod(coach,[x*1.12,1.26,z],[x*1.12,2.22,z],.023,M.brass);box(coach,.45,.065,1.13,M.dark,x*1.12,1.24,0);box(coach,.38,.075,.78,M.brass,x*1.13,1.0,0);}
  for(const x of [-1.05,1.05]){box(coach,.74,.16,1.14,M.iron,x,.99,0);for(const off of [-.25,.25])for(const z of [-.62,.62])wheel(coach,x+off,z,.27);}
  for(const x of [-1.0,0,1.0])cylinder(coach,.075,.09,M.brass,x,3.27,0,12);
  const smoke=[];const smokeGeo=new THREE.SphereGeometry(1,10,8);
  for(let i=0;i<14;i++){const mat=new THREE.MeshStandardMaterial({color:0xe4e4d4,transparent:true,opacity:0,depthWrite:false,roughness:1});const puff=new THREE.Mesh(smokeGeo,mat);world.add(puff);smoke.push({puff,age:i*.21,life:2.8});}
  let distance=8.3,rotation=0;
  function position(group,d){const p=trackPoint(d);group.position.set(p.x,0,p.z);group.rotation.y=p.angle;}
  function update(dt,running,time){
    if(running){distance+=dt*.88;rotation-=dt*1.91;}
    position(engine,distance);position(tender,distance-3.31);position(coach,distance-6.72);
    wheels.forEach(w=>w.rotation.z=rotation);
    linkages.forEach(l=>{l.bar.position.x=.35+Math.cos(rotation)*.16;l.bar.position.y=1.17+Math.sin(rotation)*.16;});
    for(const s of smoke){s.age+=dt;const t=s.age/s.life;if(t>=1){s.age=0;if(running){s.puff.position.copy(engine.localToWorld(new THREE.Vector3(1.25,3.12,0)));s.puff.visible=true;}else s.puff.visible=false;}
      if(s.puff.visible){s.puff.position.y+=dt*.62;s.puff.position.x-=dt*.24;const scale=.12+t*.55;s.puff.scale.setScalar(scale);s.puff.material.opacity=(1-t)*.28*(running?1:.5);}
    }
  }
  update(0,false,0);return {engine,coach,tender,headlamp,update};
}
