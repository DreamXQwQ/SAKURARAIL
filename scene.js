import * as THREE from 'three';

export const palette = { green: 0x409dbd, dark: 0x344e6a, brass: 0xf0ce8c, cream: 0xfff6e8, iron: 0x526b80, wood: 0xb28d91 };
const toonRamp=new THREE.DataTexture(new Uint8Array([95,175,255]),3,1,THREE.RedFormat);toonRamp.minFilter=toonRamp.magFilter=THREE.NearestFilter;toonRamp.needsUpdate=true;
export const materials = {};
export function material(name, color, roughness = .65, metalness = 0) {
  return materials[name] ||= new THREE.MeshToonMaterial({color,gradientMap:toonRamp});
}
export const M = {
  green:material('green',palette.green,.34,.38), dark:material('dark',palette.dark,.45,.4),
  brass:material('brass',palette.brass,.27,.72), cream:material('cream',palette.cream,.64),
  iron:material('iron',palette.iron,.35,.72), wood:material('wood',palette.wood),
  glass:material('glass',0x84cde2), black:material('black',0x344359),
  leaf:material('leaf',0x94c5b6), leaf2:material('leaf2',0xb2d5bd), stone:material('stone',0xb3c4d0),
  blossom:material('blossom',0xf4a2c1),blossomLight:material('blossomLight',0xffc9de),blossomPale:material('blossomPale',0xffe5ed),trunk:material('trunk',0x947281),
  warm:new THREE.MeshToonMaterial({color:0xffe3a1,emissive:0xffc35e,emissiveIntensity:.25,gradientMap:toonRamp})
};
export function mesh(parent, geo, mat, x=0,y=0,z=0) {
  const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
}
export function box(parent,w,h,d,mat,x=0,y=0,z=0){return mesh(parent,new THREE.BoxGeometry(w,h,d),mat,x,y,z);}
export function cylinder(parent,r,h,mat,x=0,y=0,z=0,segments=24){return mesh(parent,new THREE.CylinderGeometry(r,r,h,segments),mat,x,y,z);}
export function sphere(parent,r,mat,x=0,y=0,z=0){return mesh(parent,new THREE.SphereGeometry(r,12,8),mat,x,y,z);}
export function rod(parent,a,b,r,mat){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b);const m=cylinder(parent,r,va.distanceTo(vb),mat);m.position.copy(va).add(vb).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),vb.sub(va).normalize());return m;}
export function label(parent,text,w,h,x,y,z,color='#f2e8c5',bg='#244637'){
  const c=document.createElement('canvas');c.width=768;c.height=192;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,768,192);ctx.strokeStyle=color;ctx.lineWidth=5;ctx.strokeRect(12,12,744,168);ctx.fillStyle=color;ctx.font='500 74px "Microsoft YaHei", serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,384,101);
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
  return mesh(parent,new THREE.PlaneGeometry(w,h),new THREE.MeshToonMaterial({map:tex,gradientMap:toonRamp}),x,y,z);
}
let seed=842;
export function random(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646;}

export const TRACK_R=3.65, STRAIGHT=10.4, TRACK_LENGTH=STRAIGHT*2+Math.PI*TRACK_R*2;
export function trackPoint(distance){
  let d=((distance%TRACK_LENGTH)+TRACK_LENGTH)%TRACK_LENGTH;
  let x,z,tx,tz;
  if(d<STRAIGHT){x=-STRAIGHT/2+d;z=TRACK_R;tx=1;tz=0;}
  else if((d-=STRAIGHT)<Math.PI*TRACK_R){const a=Math.PI/2-d/TRACK_R;x=STRAIGHT/2+Math.cos(a)*TRACK_R;z=Math.sin(a)*TRACK_R;tx=Math.sin(a);tz=-Math.cos(a);}
  else if((d-=Math.PI*TRACK_R)<STRAIGHT){x=STRAIGHT/2-d;z=-TRACK_R;tx=-1;tz=0;}
  else{d-=STRAIGHT;const a=-Math.PI/2-d/TRACK_R;x=-STRAIGHT/2+Math.cos(a)*TRACK_R;z=Math.sin(a)*TRACK_R;tx=Math.sin(a);tz=-Math.cos(a);}
  return {x,z,angle:Math.atan2(-tz,tx),tx,tz};
}
function roundedBase(parent,w,d,depth,y,mat){
  const r=1.15,s=new THREE.Shape();s.moveTo(-w/2+r,-d/2);s.lineTo(w/2-r,-d/2);s.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);s.lineTo(w/2,d/2-r);s.quadraticCurveTo(w/2,d/2,w/2-r,d/2);s.lineTo(-w/2+r,d/2);s.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r);s.lineTo(-w/2,-d/2+r);s.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2);
  const geo=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.12,bevelThickness:.09,curveSegments:16});geo.rotateX(-Math.PI/2);return mesh(parent,geo,mat,0,y,0);
}
function makeTexture(){const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');ctx.fillStyle='#b3d8bb';ctx.fillRect(0,0,512,512);for(let i=0;i<5000;i++){const v=random();ctx.fillStyle=v>.65?'#e1f0cc':v>.25?'#9dc4aa':'#8eb7a0';ctx.globalAlpha=.1;ctx.fillRect(random()*512,random()*512,1+random()*4,1+random()*4);}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,2);return t;}

export function buildWorld(scene){
  const world=new THREE.Group();scene.add(world);
  const earth=material('earth',0xd6acb7),trim=material('trim',0xe8dce4),ground=material('ground',0xffffff);ground.map=makeTexture();
  roundedBase(world,21.5,12.6,.72,-.84,trim);roundedBase(world,21.25,12.35,.35,-.10,earth);roundedBase(world,21.0,12.1,.13,.22,ground);
  box(world,3.35,.5,.04,M.cream,0,-.38,6.37);label(world,'SAKURA RAIL · 001',3.15,.29,0,-.38,6.4,'#5684a4','#f4ecf1');
  // Individual sleepers, continuous steel rails, and an instanced gravel bed.
  const pts=[];for(let i=0;i<=300;i++){const p=trackPoint(i/300*TRACK_LENGTH);pts.push(new THREE.Vector3(p.x,.48,p.z));}
  const curve=new THREE.CatmullRomCurve3(pts,true);
  const ballastGeo=new THREE.TubeGeometry(curve,350,.57,8,true);ballastGeo.scale(1,.15,1);ballastGeo.translate(0,.38,0);mesh(world,ballastGeo,material('ballast',0xa4a58f,.95));
  const sleeperGeo=new THREE.BoxGeometry(.2,.12,1.35),sleepers=new THREE.InstancedMesh(sleeperGeo,M.wood,132),dummy=new THREE.Object3D();
  for(let i=0;i<132;i++){const p=trackPoint(i*TRACK_LENGTH/132);dummy.position.set(p.x,.57,p.z);dummy.rotation.set(0,p.angle,0);dummy.updateMatrix();sleepers.setMatrixAt(i,dummy.matrix);}sleepers.castShadow=true;sleepers.receiveShadow=true;world.add(sleepers);
  for(const side of [-1,1]){const rails=[];for(let i=0;i<=350;i++){const p=trackPoint(i/350*TRACK_LENGTH);rails.push(new THREE.Vector3(p.x+side*p.tz*.43,.68,p.z-side*p.tx*.43));}mesh(world,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rails,true),350,.043,8,true),M.iron);}
  const stones=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.1,0),M.stone,950);
  for(let i=0;i<950;i++){const p=trackPoint(random()*TRACK_LENGTH),o=(random()-.5)*1.08;dummy.position.set(p.x+p.tz*o,.51+random()*.08,p.z-p.tx*o);dummy.rotation.set(random()*3,random()*3,random()*3);dummy.scale.set(.5+random(),.35+random()*.4,.5+random());dummy.updateMatrix();stones.setMatrixAt(i,dummy.matrix);}stones.receiveShadow=true;world.add(stones);
  // Tree canopy layers create an intentionally hand-crafted miniature silhouette.
  const bloomGeometry=new THREE.IcosahedronGeometry(1,2);
  function cherry(x,z,height){const g=new THREE.Group();world.add(g);g.position.set(x,.35,z);rod(g,[0,0,0],[.12,height*.7,0],.095,M.trunk);
    for(let i=0;i<5;i++){const a=i*2.4,reach=height*(.22+random()*.09),bx=Math.cos(a)*reach,bz=Math.sin(a)*reach,by=height*(.59+random()*.2);rod(g,[.08,height*.35,0],[bx,by,bz],.055,M.trunk);rod(g,[bx*.5,by*.8,bz*.5],[bx*1.2,by*1.04,bz*1.2],.03,M.trunk);
      for(let j=0;j<3;j++){const m=mesh(g,bloomGeometry,[M.blossom,M.blossomLight,M.blossomPale][(i+j)%3],bx+(random()-.5)*.65,by+(random()-.25)*.45,bz+(random()-.5)*.65);const r=height*(.16+random()*.055);m.scale.set(r*1.24,r*.85,r);m.rotation.set(random(),random(),random());}}
    const crown=mesh(g,bloomGeometry,M.blossomLight,0,height*.86,0);crown.scale.set(height*.28,height*.22,height*.27);return g;}
  [[-8.8,-4.3,3.4],[-6.4,-4.9,3.8],[-3.6,-5,3.1],[-.4,-5,3.7],[2.8,-5,3.2],[5.8,-4.9,3.6],[8.4,-4.4,3.9],[-9.2,-1.5,2.8],[-8.8,1.1,2.3],[9.2,-1.6,2.9],[8.8,1.3,2.3],[-5.0,-.2,3.0],[5.4,-.4,2.8],[-9.5,4.7,1.9],[9.4,4.9,1.8]].forEach(p=>cherry(...p));
  for(let i=0;i<65;i++){const x=(random()-.5)*19,z=(random()-.5)*10.7;if(Math.abs(z)<4.45&&Math.abs(z)>2.85)continue;if(Math.abs(x)<4.2&&Math.abs(z)<2.5)continue;const r=.15+random()*.26;const m=sphere(world,r,i%4?M.leaf2:M.stone,x,.36+r*.35,z);m.scale.set(1,.55,1);}
  buildStation(world);
  // A fence, stacked timber, a footpath, flower beds, and tiny travelers.
  for(let i=0;i<17;i++){const x=-4+i*.5;cylinder(world,.035,.53,M.cream,x,.62,-2.8,6);if(i<16){box(world,.5,.038,.04,M.cream,x+.25,.82,-2.8);box(world,.5,.038,.04,M.cream,x+.25,.62,-2.8);}}
  const pathMat=material('path',0xc7bd97,.95);for(let i=0;i<10;i++)box(world,.53,.055,.57,pathMat,-.7,.39,1.0+i*.17);
  for(let i=0;i<7;i++){const log=cylinder(world,.12,1.1,M.wood,4.4+(i%3)*.23,.49+Math.floor(i/3)*.2,-1.6,12);log.rotation.z=Math.PI/2;}
  const flowers=material('flowers',0xc99c73);for(let i=0;i<24;i++){const x=-3.7+random()*1.2,z=1.05+random()*.5;rod(world,[x,.37,z],[x,.64,z],.012,M.leaf);sphere(world,.055,flowers,x,.64,z);}
  person(world,-1.25,.45,1.2,0xb88263);person(world,1.0,.45,1.1,0x4d6774);person(world,2.4,.45,.8,0xb9a66b);
  return world;
}

export const lamps=[];
function lamp(parent,x,z){cylinder(parent,.047,2.0,M.dark,x,1.35,z,10);box(parent,.28,.04,.28,M.dark,x,2.42,z);box(parent,.2,.26,.2,M.warm,x,2.25,z);for(const a of [-1,1])for(const b of [-1,1])box(parent,.022,.3,.022,M.dark,x+a*.105,2.25,z+b*.105);mesh(parent,new THREE.ConeGeometry(.23,.14,4),M.dark,x,2.51,z).rotation.y=Math.PI/4;const l=new THREE.PointLight(0xffcd7d,0,5,2);l.position.set(x,2.2,z);parent.add(l);lamps.push(l);}
function buildStation(parent){
  const g=new THREE.Group();parent.add(g);g.position.set(.25,.35,-.45);
  const wall=material('wall',0xffefe2),roof=material('roof',0x71bad0);
  box(g,7.8,.16,2.3,M.cream,0,.08,0);box(g,4.5,1.8,1.8,wall,0,1.03,-.25);
  for(let y=.28;y<1.9;y+=.14)box(g,4.53,.016,1.83,material('siding',0xb2a480),0,y,-.25);
  box(g,4.62,.11,1.98,M.cream,0,1.98,-.25);
  for(const side of [-1,1]){const m=box(g,5.15,.12,1.44,roof,0,2.28,-.25+side*.6);m.rotation.x=side*.48;for(let i=0;i<19;i++){const slat=box(g,.035,.035,1.45,M.dark,-2.4+i*.265,2.35,-.25+side*.6);slat.rotation.x=side*.48;}}
  box(g,5.2,.14,.13,M.dark,0,2.62,-.25);box(g,.36,.65,.35,wall,1.45,2.68,-.35);box(g,.45,.09,.45,M.cream,1.45,3.03,-.35);
  for(const x of [-1.55,1.55]){box(g,.73,.92,.04,M.cream,x,1.16,.677);box(g,.59,.77,.055,M.glass,x,1.16,.702);box(g,.045,.77,.06,M.cream,x,1.16,.741);box(g,.59,.045,.06,M.cream,x,1.16,.741);box(g,.83,.09,.16,M.cream,x,.7,.76);}
  box(g,.65,1.28,.05,M.dark,0,.8,.692);box(g,.56,1.16,.055,M.wood,0,.8,.727);box(g,.4,.44,.025,M.glass,0,1.03,.76);sphere(g,.025,M.brass,.2,.73,.78);
  label(g,'さ く ら 駅',1.62,.4,0,1.7,.708,'#427693','#f2f9fd');
  for(const x of [-3.15,3.15]){box(g,.095,1.95,.095,M.cream,x,1.1,.5);box(g,.85,.1,1.5,roof,x,2.13,.04);}
  for(const x of [-2.8,2.8]){for(let i=0;i<4;i++)box(g,.95,.045,.065,M.wood,x,.57,.52+i*.09);box(g,.95,.3,.06,M.wood,x,.79,.55);for(const o of [-.35,.35])box(g,.07,.4,.34,M.iron,x+o,.37,.7);}
  label(g,'SAKURA LINE',1.0,.24,-3.5,1.32,1.08,'#427693','#edfaff');rod(g,[-3.92,.12,1.08],[-3.92,1.53,1.08],.035,M.dark);rod(g,[-3.08,.12,1.08],[-3.08,1.53,1.08],.035,M.dark);
  lamp(parent,-4.2,1.1);lamp(parent,4.2,1.1);lamp(parent,-7.1,4.9);lamp(parent,7.4,-1.7);
}
function person(parent,x,y,z,color){const g=new THREE.Group();parent.add(g);g.position.set(x,y,z);const cloth=material('person'+color,color);sphere(g,.09,M.cream,0,.61,0);cylinder(g,.07,.08,M.dark,0,.7,0,12);box(g,.15,.25,.1,cloth,0,.4,0);for(const side of [-1,1]){rod(g,[side*.05,.29,0],[side*.065,.04,0],.035,M.dark);rod(g,[side*.1,.48,0],[side*.14,.27,.01],.026,cloth);}box(g,.16,.18,.08,M.wood,.2,.18,.01);}
