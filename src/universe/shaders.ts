/** GLSL for the Universe. Every fragment shader ends with the colour-space include. */

export const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
#ifndef FBM_OCT
#define FBM_OCT 5
#endif
float fbm(vec3 p){
  float a=0.5;
  float s=0.0;
  for(int i=0;i<FBM_OCT;i++){
    s+=a*snoise(p);
    p=p*2.02+vec3(7.1);
    a*=0.5;
  }
  return s;
}
`

/* ------------------------------ Sky dome ------------------------------ */

export const SKY_VERT = /* glsl */ `
varying vec3 vDir;
void main(){
  vDir=position;
  vec4 mv=modelViewMatrix*vec4(position,1.0);
  gl_Position=projectionMatrix*mv;
}
`

export const SKY_FRAG = /* glsl */ `
${NOISE}
uniform float uTime;
uniform float uProgress;
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform vec2 uMouse;
varying vec3 vDir;
void main(){
  vec3 d=normalize(vDir);
  vec3 q=d*1.5+vec3(uMouse*0.12,uProgress*4.0);
  float n=fbm(q+vec3(0.0,uTime*0.02,0.0));
  float n2=fbm(q*2.0-vec3(uTime*0.03,0.0,n));
  float cloud=smoothstep(-0.25,0.9,n);
  vec3 col=uA*0.6;
  col=mix(col,uB*0.85,cloud*0.55);
  float band=sin(d.x*3.0+n2*2.5+uTime*0.15)*0.5+0.5;
  float ribbon=smoothstep(0.6,0.0,abs(d.y-0.12+0.28*n))*band;
  col+=uC*ribbon*0.32*(0.5+0.5*n2);
  col+=uB*pow(max(n2,0.0),2.0)*0.35;
  float horizon=smoothstep(0.9,0.0,abs(d.y));
  col+=uA*horizon*0.25;
  gl_FragColor=vec4(col,1.0);
  #include <colorspace_fragment>
}
`

/* ------------------------------ Star dust ------------------------------ */

export const DUST_VERT = /* glsl */ `
uniform float uTime;
uniform float uScale;
attribute float aSeed;
attribute float aSize;
varying float vTw;
varying float vSeed;
void main(){
  vSeed=aSeed;
  vec4 mv=modelViewMatrix*vec4(position,1.0);
  float tw=0.55+0.45*sin(uTime*(0.5+aSeed*2.2)+aSeed*40.0);
  vTw=tw;
  gl_PointSize=clamp(aSize*uScale*(90.0/max(-mv.z,1.0)),1.0,26.0);
  gl_Position=projectionMatrix*mv;
}
`

export const DUST_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying float vTw;
varying float vSeed;
void main(){
  float d=length(gl_PointCoord-0.5);
  float a=pow(smoothstep(0.5,0.0,d),2.0);
  vec3 col=mix(vec3(1.0),uColor,step(0.5,vSeed)*0.85);
  gl_FragColor=vec4(col*(1.0+a*1.2),a*vTw*uOpacity);
  #include <colorspace_fragment>
}
`

/* ------------------------------ Name particles ------------------------------ */

export const NAME_VERT = /* glsl */ `
${NOISE}
uniform float uMorph;
uniform float uTime;
uniform float uExplode;
uniform float uPx;
uniform vec3 uMouse;
uniform float uMouseOn;
attribute vec3 aStart;
attribute float aSeed;
varying float vA;
varying float vSeed;
float ease(float t){return t*t*(3.0-2.0*t);}
void main(){
  float delay=aSeed*0.45;
  float m=ease(clamp((uMorph-delay)/0.55,0.0,1.0));
  vec3 p=mix(aStart,position,m);
  float sw=(1.0-m)*m*4.0;
  p.x+=sin(uTime*1.2+aSeed*20.0)*sw*0.8;
  p.y+=cos(uTime*1.1+aSeed*30.0)*sw*0.8;
  vec3 drift=vec3(snoise(vec3(position.xy*0.5,uTime*0.35+aSeed)),snoise(vec3(position.yx*0.5,uTime*0.35+aSeed+9.0)),snoise(vec3(position.xy*0.5+3.0,uTime*0.35)));
  p+=drift*0.07*m;
  vec2 dm=p.xy-uMouse.xy;
  float f=smoothstep(2.8,0.0,length(dm))*uMouseOn*m;
  p.xy+=normalize(dm+vec2(0.0001))*f*1.9;
  p.z+=f*(aSeed-0.5)*6.0;
  vec3 outward=normalize(vec3(position.xy,0.0)+vec3(0.001));
  p+=outward*uExplode*(5.0+aSeed*22.0)+vec3(0.0,0.0,(aSeed-0.5)*uExplode*34.0);
  vec4 mv=modelViewMatrix*vec4(p,1.0);
  vSeed=aSeed;
  vA=(0.3+0.7*m)*(1.0-uExplode*0.8);
  gl_PointSize=clamp((1.5+aSeed*2.4)*uPx*(34.0/max(-mv.z,1.0)),1.5,10.0);
  gl_Position=projectionMatrix*mv;
}
`

export const NAME_FRAG = /* glsl */ `
uniform vec3 uColorB;
uniform vec3 uColorC;
varying float vA;
varying float vSeed;
void main(){
  float d=length(gl_PointCoord-0.5);
  float a=pow(smoothstep(0.5,0.0,d),1.6);
  vec3 col=mix(uColorB,uColorC,vSeed)*1.5+vec3(0.15);
  gl_FragColor=vec4(col,a*vA);
  #include <colorspace_fragment>
}
`

/* ------------------------------ Core artifact ------------------------------ */

export const CORE_VERT = /* glsl */ `
${NOISE}
uniform float uTime;
uniform float uAmp;
varying vec3 vNormalV;
varying vec3 vViewDir;
varying float vNoise;
void main(){
  float n=snoise(position*0.7+vec3(0.0,uTime*0.25,uTime*0.15));
  float n2=snoise(position*1.9-vec3(uTime*0.2));
  vNoise=n;
  vec3 displaced=position+normal*(n*0.75+n2*0.18)*uAmp;
  vec4 mv=modelViewMatrix*vec4(displaced,1.0);
  vNormalV=normalize(normalMatrix*normal);
  vViewDir=normalize(-mv.xyz);
  gl_Position=projectionMatrix*mv;
}
`

export const CORE_FRAG = /* glsl */ `
uniform float uTime;
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
varying vec3 vNormalV;
varying vec3 vViewDir;
varying float vNoise;
void main(){
  float fres=pow(1.0-max(dot(normalize(vNormalV),normalize(vViewDir)),0.0),2.4);
  vec3 irid=0.5+0.5*cos(6.28318*(vec3(0.0,0.33,0.67)+fres*1.1+uTime*0.05+vNoise*0.4));
  vec3 col=mix(uA*0.9,uB*1.4,vNoise*0.5+0.5);
  col+=uC*fres*2.1;
  col+=irid*fres*0.7;
  col+=uC*pow(max(vNoise,0.0),3.0)*1.4;
  gl_FragColor=vec4(col,1.0);
  #include <colorspace_fragment>
}
`

/* ------------------------------ Portal disc ------------------------------ */

export const PORTAL_VERT = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv=uv;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
}
`

export const PORTAL_FRAG = /* glsl */ `
${NOISE}
uniform float uTime;
uniform float uHover;
uniform float uUnstable;
uniform float uActive;
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
varying vec2 vUv;
void main(){
  vec2 p=vUv*2.0-1.0;
  float r=length(p);
  if(r>1.0) discard;
  float ang=atan(p.y,p.x);
  float swirl=ang+(1.0-r)*6.0-uTime*(0.6+uHover*1.4);
  float n=snoise(vec3(cos(swirl)*r*1.6,sin(swirl)*r*1.6,uTime*0.3));
  float rings=sin(r*24.0-uTime*3.0)*0.5+0.5;
  vec3 col=mix(uA*1.2,uB*1.6,smoothstep(-0.4,0.8,n));
  col+=uC*pow(1.0-r,3.0)*(1.5+uHover*1.6);
  col+=uC*smoothstep(0.82,1.0,r)*0.9;
  col+=uB*rings*0.14*(1.0-r);
  float row=floor(vUv.y*30.0+uTime*8.0);
  float glitch=step(0.985-uUnstable*0.14,fract(sin(row*12.9898)*43758.5453));
  col=mix(col,col.gbr*1.6,glitch*uUnstable);
  float alpha=smoothstep(1.0,0.88,r)*(0.82+0.18*n);
  alpha*=1.0-glitch*uUnstable*0.6;
  gl_FragColor=vec4(col*(1.0+uActive*0.45),alpha);
  #include <colorspace_fragment>
}
`

/* ------------------------------ Tunnel streaks ------------------------------ */

export const STREAK_VERT = /* glsl */ `
uniform float uTime;
uniform float uSpeed;
uniform float uZMin;
uniform float uLen;
attribute float aSeed;
varying float vSeed;
void main(){
  vSeed=aSeed;
  vec3 p=position;
  p.z=uZMin+mod(position.z-uZMin+uTime*uSpeed*(0.6+aSeed),uLen);
  vec4 mv=modelViewMatrix*vec4(p,1.0);
  gl_PointSize=clamp((1.5+aSeed*2.0)*(60.0/max(-mv.z,1.0)),1.0,8.0);
  gl_Position=projectionMatrix*mv;
}
`

export const STREAK_FRAG = /* glsl */ `
uniform vec3 uColor;
varying float vSeed;
void main(){
  float d=length(gl_PointCoord-0.5);
  float a=pow(smoothstep(0.5,0.0,d),1.8);
  gl_FragColor=vec4(uColor*(1.2+vSeed),a*0.8);
  #include <colorspace_fragment>
}
`
