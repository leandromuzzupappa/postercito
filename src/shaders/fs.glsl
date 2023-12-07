uniform float uTime;
uniform float uFrequency;

varying float vDepth;
varying vec2 vUv;

void main(){
  vec2 uv=vUv;
  
  vec3 color=vec3(.8314,.0627,.5098);
  color.rg*=sin(uv.xx*uFrequency)+.4;
  
  color=mix(color,vec3(1.),vDepth/2.);
  color.rb*=mix(sin(uv.yy*uTime),color.bb,vDepth*2.);
  
  float top=12.;
  
  for(float i=0.;i<top;i++){
    float t=i/top;
    float x=sin(uv.x*10.+t*10.+uTime*2.);
    float y=sin(uv.y*10.+t*10.+uTime*2.);
    float z=sin(uv.x*10.+uv.y*10.+t*10.+uTime*2.);
    color+=vec3(x,y,z)*.1;
  }
  
  gl_FragColor=vec4(color,1.);
}