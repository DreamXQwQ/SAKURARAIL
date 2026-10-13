import * as THREE from 'three';
import {random} from './scene.js';

export function buildPetals(world){
  const shape=new THREE.Shape();shape.moveTo(0,-.12);shape.bezierCurveTo(-.14,-.035,-.13,.08,-.05,.12);shape.quadraticCurveTo(-.015,.14,0,.085);shape.quadraticCurveTo(.015,.14,.05,.12);shape.bezierCurveTo(.13,.08,.14,-.035,0,-.12);
  const geometry=new THREE.ShapeGeometry(shape,5);
  const mat=new THREE.MeshToonMaterial({color:0xffffff,side:THREE.DoubleSide,transparent:true,opacity:.85,depthWrite:false});
  const count=240,petals=new THREE.InstancedMesh(geometry,mat,count),dummy=new THREE.Object3D(),data=[];petals.instanceMatrix.setUsage(THREE.DynamicDrawUsage);petals.frustumCulled=false;world.add(petals);
  for(let i=0;i<count;i++){data.push({x:(random()-.5)*26,y:.6+random()*8,z:(random()-.5)*17,phase:random()*6.28,speed:.25+random()*.45,scale:.45+random()*.85});petals.setColorAt(i,new THREE.Color([0xf3a4c9,0xffcadd,0xffe7f1,0xf58fbb][i%4]));}
  const settled=new THREE.InstancedMesh(geometry,new THREE.MeshToonMaterial({color:0xf4b2ce,side:THREE.DoubleSide}),160);
  for(let i=0;i<160;i++){dummy.position.set((random()-.5)*19.7,.39,(random()-.5)*11.1);dummy.rotation.set(-Math.PI/2,0,random()*6.28);dummy.scale.setScalar(.3+random()*.6);dummy.updateMatrix();settled.setMatrixAt(i,dummy.matrix);}world.add(settled);
  let enabled=true;
  return {setEnabled(value){enabled=value;petals.visible=value;},update(dt,time){if(!enabled)return;for(let i=0;i<count;i++){const p=data[i];p.y-=dt*p.speed;p.x+=dt*.3;if(p.y<.45){p.y=6+random()*3;p.x=(random()-.5)*25;}if(p.x>14)p.x=-14;dummy.position.set(p.x+Math.sin(time*.4+p.phase)*.6,p.y,p.z+Math.cos(time*.35+p.phase)*.4);dummy.rotation.set(time*.8+p.phase,Math.sin(time+p.phase),time*.35+p.phase);dummy.scale.setScalar(p.scale);dummy.updateMatrix();petals.setMatrixAt(i,dummy.matrix);}petals.instanceMatrix.needsUpdate=true;}};
}
