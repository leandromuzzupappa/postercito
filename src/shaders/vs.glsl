uniform float uAmplitude;
uniform float uFrequency;
uniform float uTime;

varying vec2 vUv;
varying float vDepth;

float noise(vec2 pos,float freq,float time){
  return sin(pos.x*freq+time)*sin(pos.y*freq+time)*.5+.5;
}

void main(){
  vUv=uv;
  
  vec3 pos=position.xyz;
  pos.y+=noise(pos.xz,uFrequency,uTime)*uAmplitude;
  
  float r=length(pos.xz)*2.;
  float a=atan(pos.x,pos.z);
  
  pos.y+=sin(r*10.+uTime*2.)*.1;
  pos.x-=atan(a*10.+uTime*2.)*.1;
  pos.z-=pos.z*noise(pos.xz,uFrequency,uTime);
  
  gl_Position=projectionMatrix*modelViewMatrix*vec4(pos*1.,1.);
  
  vDepth=gl_Position.y;
}