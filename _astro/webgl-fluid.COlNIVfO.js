const Tt={SIM_RESOLUTION:128,DYE_RESOLUTION:1024,CAPTURE_RESOLUTION:512,DENSITY_DISSIPATION:1,VELOCITY_DISSIPATION:.2,PRESSURE:.8,PRESSURE_ITERATIONS:20,CURL:30,SPLAT_RADIUS:.25,SPLAT_FORCE:6e3,SHADING:!0,COLORFUL:!0,COLOR_UPDATE_SPEED:10,PAUSED:!1,BACK_COLOR:{r:30,g:31,b:33},TRANSPARENT:!1,BLOOM:!0,BLOOM_ITERATIONS:8,BLOOM_RESOLUTION:256,BLOOM_INTENSITY:.4,BLOOM_THRESHOLD:.8,BLOOM_SOFT_KNEE:.7,SUNRAYS:!0,SUNRAYS_RESOLUTION:196,SUNRAYS_WEIGHT:1};let H=null,S=!1;const re=[];function gt(){for(S=!1,H!=null&&(cancelAnimationFrame(H),H=null);re.length;){const L=re.pop();try{L()}catch{}}}function Et(L){if(!S&&!(!L||typeof L.getContext!="function")){S=!0;try{xt(L)}catch{S=!1}}}function xt(L){const v=L,l=Object.assign({},Tt);function F(e,i,r,o){e.addEventListener(i,r,o),re.push(function(){e.removeEventListener(i,r,o)})}Te();function V(){this.id=-1,this.texcoordX=0,this.texcoordY=0,this.prevTexcoordX=0,this.prevTexcoordY=0,this.deltaX=0,this.deltaY=0,this.down=!1,this.moved=!1,this.color=[30,0,300]}let E=[],ie=[];E.push(new V);const{gl:t,ext:g}=pe(v);if(!t)return;De()&&(l.DYE_RESOLUTION=512),g.supportLinearFiltering||(l.DYE_RESOLUTION=512,l.SHADING=!1,l.BLOOM=!1,l.SUNRAYS=!1);function pe(e){const i={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};let r=e.getContext("webgl2",i);const o=!!r;if(o||(r=e.getContext("webgl",i)||e.getContext("experimental-webgl",i)),!r)return{gl:null,ext:{supportLinearFiltering:!1}};let n,u;o?(r.getExtension("EXT_color_buffer_float"),u=r.getExtension("OES_texture_float_linear")):(n=r.getExtension("OES_texture_half_float"),u=r.getExtension("OES_texture_half_float_linear")),r.clearColor(0,0,0,1);const a=o?r.HALF_FLOAT:n&&n.HALF_FLOAT_OES;if(!a)return{gl:null,ext:{supportLinearFiltering:!1}};let s,c,p;return o?(s=_(r,r.RGBA16F,r.RGBA,a),c=_(r,r.RG16F,r.RG,a),p=_(r,r.R16F,r.RED,a)):(s=_(r,r.RGBA,r.RGBA,a),c=_(r,r.RGBA,r.RGBA,a),p=_(r,r.RGBA,r.RGBA,a)),!s||!c||!p?{gl:null,ext:{supportLinearFiltering:!1}}:{gl:r,ext:{formatRGBA:s,formatRG:c,formatR:p,halfFloatTexType:a,supportLinearFiltering:u}}}function _(e,i,r,o){if(!Se(e,i,r,o))switch(i){case e.R16F:return _(e,e.RG16F,e.RG,o);case e.RG16F:return _(e,e.RGBA16F,e.RGBA,o);default:return null}return{internalFormat:i,format:r}}function Se(e,i,r,o){let n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,i,4,4,0,r,o,null);let u=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,u),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0),e.checkFramebufferStatus(e.FRAMEBUFFER)==e.FRAMEBUFFER_COMPLETE}function De(){return/Mobi|Android/i.test(navigator.userAgent)}class Ae{constructor(i,r){this.vertexShader=i,this.fragmentShaderSource=r,this.programs=[],this.activeProgram=null,this.uniforms=[]}setKeywords(i){let r=0;for(let n=0;n<i.length;n++)r+=dt(i[n]);let o=this.programs[r];if(o==null){let n=h(t.FRAGMENT_SHADER,this.fragmentShaderSource,i);o=oe(this.vertexShader,n),this.programs[r]=o}o!=this.activeProgram&&(this.uniforms=ne(o),this.activeProgram=o)}bind(){t.useProgram(this.activeProgram)}}class T{constructor(i,r){this.uniforms={},this.program=oe(i,r),this.uniforms=ne(this.program)}bind(){t.useProgram(this.program)}}function oe(e,i){let r=t.createProgram();if(t.attachShader(r,e),t.attachShader(r,i),t.linkProgram(r),!t.getProgramParameter(r,t.LINK_STATUS))throw t.getProgramInfoLog(r);return r}function ne(e){let i=[],r=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<r;o++){let n=t.getActiveUniform(e,o).name;i[n]=t.getUniformLocation(e,n)}return i}function h(e,i,r){i=_e(i,r);const o=t.createShader(e);if(t.shaderSource(o,i),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS))throw t.getShaderInfoLog(o);return o}function _e(e,i){if(i==null)return e;let r="";return i.forEach(o=>{r+="#define "+o+`
`}),r+e}const x=h(t.VERTEX_SHADER,`
	    precision highp float;

	    attribute vec2 aPosition;
	    varying vec2 vUv;
	    varying vec2 vL;
	    varying vec2 vR;
	    varying vec2 vT;
	    varying vec2 vB;
	    uniform vec2 texelSize;

	    void main () {
	        vUv = aPosition * 0.5 + 0.5;
	        vL = vUv - vec2(texelSize.x, 0.0);
	        vR = vUv + vec2(texelSize.x, 0.0);
	        vT = vUv + vec2(0.0, texelSize.y);
	        vB = vUv - vec2(0.0, texelSize.y);
	        gl_Position = vec4(aPosition, 0.0, 1.0);
	    }
	`),ye=h(t.VERTEX_SHADER,`
	    precision highp float;

	    attribute vec2 aPosition;
	    varying vec2 vUv;
	    varying vec2 vL;
	    varying vec2 vR;
	    uniform vec2 texelSize;

	    void main () {
	        vUv = aPosition * 0.5 + 0.5;
	        float offset = 1.33333333;
	        vL = vUv - texelSize * offset;
	        vR = vUv + texelSize * offset;
	        gl_Position = vec4(aPosition, 0.0, 1.0);
	    }
	`),be=h(t.FRAGMENT_SHADER,`
	    precision mediump float;
	    precision mediump sampler2D;

	    varying vec2 vUv;
	    varying vec2 vL;
	    varying vec2 vR;
	    uniform sampler2D uTexture;

	    void main () {
	        vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
	        sum += texture2D(uTexture, vL) * 0.35294117;
	        sum += texture2D(uTexture, vR) * 0.35294117;
	        gl_FragColor = sum;
	    }
	`),Ue=h(t.FRAGMENT_SHADER,`
	    precision mediump float;
	    precision mediump sampler2D;

	    varying highp vec2 vUv;
	    uniform sampler2D uTexture;

	    void main () {
	        gl_FragColor = texture2D(uTexture, vUv);
	    }
	`),Le=h(t.FRAGMENT_SHADER,`
	    precision mediump float;
	    precision mediump sampler2D;

	    varying highp vec2 vUv;
	    uniform sampler2D uTexture;
	    uniform float value;

	    void main () {
	        gl_FragColor = value * texture2D(uTexture, vUv);
	    }
	`),Fe=h(t.FRAGMENT_SHADER,`
	    precision mediump float;

	    uniform vec4 color;

	    void main () {
	        gl_FragColor = color;
	    }
	`),we=h(t.FRAGMENT_SHADER,`
	    precision highp float;
	    precision highp sampler2D;

	    varying vec2 vUv;
	    uniform sampler2D uTexture;
	    uniform float aspectRatio;

	    #define SCALE 25.0

	    void main () {
	        vec2 uv = floor(vUv * SCALE * vec2(aspectRatio, 1.0));
	        float v = mod(uv.x + uv.y, 2.0);
	        v = v * 0.1 + 0.8;
	        gl_FragColor = vec4(vec3(v), 1.0);
	    }
	`),Oe=`
	    precision highp float;
	    precision highp sampler2D;

	    varying vec2 vUv;
	    varying vec2 vL;
	    varying vec2 vR;
	    varying vec2 vT;
	    varying vec2 vB;
	    uniform sampler2D uTexture;
	    uniform sampler2D uBloom;
	    uniform sampler2D uSunrays;
	    uniform sampler2D uDithering;
	    uniform vec2 ditherScale;
	    uniform vec2 texelSize;

	    vec3 linearToGamma (vec3 color) {
	        color = max(color, vec3(0));
	        return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
	    }

	    void main () {
	        vec3 c = texture2D(uTexture, vUv).rgb;

	    #ifdef SHADING
	        vec3 lc = texture2D(uTexture, vL).rgb;
	        vec3 rc = texture2D(uTexture, vR).rgb;
	        vec3 tc = texture2D(uTexture, vT).rgb;
	        vec3 bc = texture2D(uTexture, vB).rgb;

	        float dx = length(rc) - length(lc);
	        float dy = length(tc) - length(bc);

	        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
	        vec3 l = vec3(0.0, 0.0, 1.0);

	        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
	        c *= diffuse;
	    #endif

	    #ifdef BLOOM
	        vec3 bloom = texture2D(uBloom, vUv).rgb;
	    #endif

	    #ifdef SUNRAYS
	        float sunrays = texture2D(uSunrays, vUv).r;
	        c *= sunrays;
	    #ifdef BLOOM
	        bloom *= sunrays;
	    #endif
	    #endif

	    #ifdef BLOOM
	        float noise = texture2D(uDithering, vUv * ditherScale).r;
	        noise = noise * 2.0 - 1.0;
	        bloom += noise / 255.0;
	        bloom = linearToGamma(bloom);
	        c += bloom;
	    #endif

	        float a = max(c.r, max(c.g, c.b));
	        gl_FragColor = vec4(c, a);
	    }
	`,Be=h(t.FRAGMENT_SHADER,`
	    precision mediump float;
	    precision mediump sampler2D;

	    varying vec2 vUv;
	    uniform sampler2D uTexture;
	    uniform vec3 curve;
	    uniform float threshold;

	    void main () {
	        vec3 c = texture2D(uTexture, vUv).rgb;
	        float br = max(c.r, max(c.g, c.b));
	        float rq = clamp(br - curve.x, 0.0, curve.y);
	        rq = curve.z * rq * rq;
	        c *= max(rq, br - threshold) / max(br, 0.0001);
	        gl_FragColor = vec4(c, 0.0);
	    }
	`),Ne=h(t.FRAGMENT_SHADER,`
	    precision mediump float;
	    precision mediump sampler2D;

	    varying vec2 vL;
	    varying vec2 vR;
	    varying vec2 vT;
	    varying vec2 vB;
	    uniform sampler2D uTexture;

	    void main () {
	        vec4 sum = vec4(0.0);
	        sum += texture2D(uTexture, vL);
	        sum += texture2D(uTexture, vR);
	        sum += texture2D(uTexture, vT);
	        sum += texture2D(uTexture, vB);
	        sum *= 0.25;
	        gl_FragColor = sum;
	    }
	`),Pe=h(t.FRAGMENT_SHADER,`
	    precision mediump float;
	    precision mediump sampler2D;

	    varying vec2 vL;
	    varying vec2 vR;
	    varying vec2 vT;
	    varying vec2 vB;
	    uniform sampler2D uTexture;
	    uniform float intensity;

	    void main () {
	        vec4 sum = vec4(0.0);
	        sum += texture2D(uTexture, vL);
	        sum += texture2D(uTexture, vR);
	        sum += texture2D(uTexture, vT);
	        sum += texture2D(uTexture, vB);
	        sum *= 0.25;
	        gl_FragColor = sum * intensity;
	    }
	`),Ie=h(t.FRAGMENT_SHADER,`
	    precision highp float;
	    precision highp sampler2D;

	    varying vec2 vUv;
	    uniform sampler2D uTexture;

	    void main () {
	        vec4 c = texture2D(uTexture, vUv);
	        float br = max(c.r, max(c.g, c.b));
	        c.a = 1.0 - min(max(br * 20.0, 0.0), 0.8);
	        gl_FragColor = c;
	    }
	`),Me=h(t.FRAGMENT_SHADER,`
	    precision highp float;
	    precision highp sampler2D;

	    varying vec2 vUv;
	    uniform sampler2D uTexture;
	    uniform float weight;

	    #define ITERATIONS 16

	    void main () {
	        float Density = 0.3;
	        float Decay = 0.95;
	        float Exposure = 0.7;

	        vec2 coord = vUv;
	        vec2 dir = vUv - 0.5;

	        dir *= 1.0 / float(ITERATIONS) * Density;
	        float illuminationDecay = 1.0;

	        float color = texture2D(uTexture, vUv).a;

	        for (int i = 0; i < ITERATIONS; i++)
	        {
	            coord -= dir;
	            float col = texture2D(uTexture, coord).a;
	            color += col * illuminationDecay * weight;
	            illuminationDecay *= Decay;
	        }

	        gl_FragColor = vec4(color * Exposure, 0.0, 0.0, 1.0);
	    }
	`),Xe=h(t.FRAGMENT_SHADER,`
	    precision highp float;
	    precision highp sampler2D;

	    varying vec2 vUv;
	    uniform sampler2D uTarget;
	    uniform float aspectRatio;
	    uniform vec3 color;
	    uniform vec2 point;
	    uniform float radius;

	    void main () {
	        vec2 p = vUv - point.xy;
	        p.x *= aspectRatio;
	        vec3 splat = exp(-dot(p, p) / radius) * color;
	        vec3 base = texture2D(uTarget, vUv).xyz;
	        gl_FragColor = vec4(base + splat, 1.0);
	    }
	`),Ce=h(t.FRAGMENT_SHADER,`
	    precision highp float;
	    precision highp sampler2D;

	    varying vec2 vUv;
	    uniform sampler2D uVelocity;
	    uniform sampler2D uSource;
	    uniform vec2 texelSize;
	    uniform vec2 dyeTexelSize;
	    uniform float dt;
	    uniform float dissipation;

	    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
	        vec2 st = uv / tsize - 0.5;

	        vec2 iuv = floor(st);
	        vec2 fuv = fract(st);

	        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
	        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
	        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
	        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

	        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
	    }

	    void main () {
	    #ifdef MANUAL_FILTERING
	        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
	        vec4 result = bilerp(uSource, coord, dyeTexelSize);
	    #else
	        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
	        vec4 result = texture2D(uSource, coord);
	    #endif
	        float decay = 1.0 + dissipation * dt;
	        gl_FragColor = result / decay;
	    }`,g.supportLinearFiltering?null:["MANUAL_FILTERING"]),ze=h(t.FRAGMENT_SHADER,`
	    precision mediump float;
	    precision mediump sampler2D;

	    varying highp vec2 vUv;
	    varying highp vec2 vL;
	    varying highp vec2 vR;
	    varying highp vec2 vT;
	    varying highp vec2 vB;
	    uniform sampler2D uVelocity;

	    void main () {
	        float L = texture2D(uVelocity, vL).x;
	        float R = texture2D(uVelocity, vR).x;
	        float T = texture2D(uVelocity, vT).y;
	        float B = texture2D(uVelocity, vB).y;

	        vec2 C = texture2D(uVelocity, vUv).xy;
	        if (vL.x < 0.0) { L = -C.x; }
	        if (vR.x > 1.0) { R = -C.x; }
	        if (vT.y > 1.0) { T = -C.y; }
	        if (vB.y < 0.0) { B = -C.y; }

	        float div = 0.5 * (R - L + T - B);
	        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
	    }
	`),Ge=h(t.FRAGMENT_SHADER,`
	    precision mediump float;
	    precision mediump sampler2D;

	    varying highp vec2 vUv;
	    varying highp vec2 vL;
	    varying highp vec2 vR;
	    varying highp vec2 vT;
	    varying highp vec2 vB;
	    uniform sampler2D uVelocity;

	    void main () {
	        float L = texture2D(uVelocity, vL).y;
	        float R = texture2D(uVelocity, vR).y;
	        float T = texture2D(uVelocity, vT).x;
	        float B = texture2D(uVelocity, vB).x;
	        float vorticity = R - L - T + B;
	        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
	    }
	`),Ye=h(t.FRAGMENT_SHADER,`
	    precision highp float;
	    precision highp sampler2D;

	    varying vec2 vUv;
	    varying vec2 vL;
	    varying vec2 vR;
	    varying vec2 vT;
	    varying vec2 vB;
	    uniform sampler2D uVelocity;
	    uniform sampler2D uCurl;
	    uniform float curl;
	    uniform float dt;

	    void main () {
	        float L = texture2D(uCurl, vL).x;
	        float R = texture2D(uCurl, vR).x;
	        float T = texture2D(uCurl, vT).x;
	        float B = texture2D(uCurl, vB).x;
	        float C = texture2D(uCurl, vUv).x;

	        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
	        force /= length(force) + 0.0001;
	        force *= curl * C;
	        force.y *= -1.0;

	        vec2 vel = texture2D(uVelocity, vUv).xy;
	        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
	    }
	`),He=h(t.FRAGMENT_SHADER,`
	    precision mediump float;
	    precision mediump sampler2D;

	    varying highp vec2 vUv;
	    varying highp vec2 vL;
	    varying highp vec2 vR;
	    varying highp vec2 vT;
	    varying highp vec2 vB;
	    uniform sampler2D uPressure;
	    uniform sampler2D uDivergence;

	    void main () {
	        float L = texture2D(uPressure, vL).x;
	        float R = texture2D(uPressure, vR).x;
	        float T = texture2D(uPressure, vT).x;
	        float B = texture2D(uPressure, vB).x;
	        float C = texture2D(uPressure, vUv).x;
	        float divergence = texture2D(uDivergence, vUv).x;
	        float pressure = (L + R + B + T - divergence) * 0.25;
	        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
	    }
	`),Ve=h(t.FRAGMENT_SHADER,`
	    precision mediump float;
	    precision mediump sampler2D;

	    varying highp vec2 vUv;
	    varying highp vec2 vL;
	    varying highp vec2 vR;
	    varying highp vec2 vT;
	    varying highp vec2 vB;
	    uniform sampler2D uPressure;
	    uniform sampler2D uVelocity;

	    void main () {
	        float L = texture2D(uPressure, vL).x;
	        float R = texture2D(uPressure, vR).x;
	        float T = texture2D(uPressure, vT).x;
	        float B = texture2D(uPressure, vB).x;
	        vec2 velocity = texture2D(uVelocity, vUv).xy;
	        velocity.xy -= vec2(R - L, T - B);
	        gl_FragColor = vec4(velocity, 0.0, 1.0);
	    }
	`),m=(t.bindBuffer(t.ARRAY_BUFFER,t.createBuffer()),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),t.STATIC_DRAW),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,t.createBuffer()),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),t.STATIC_DRAW),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),t.enableVertexAttribArray(0),e=>{t.bindFramebuffer(t.FRAMEBUFFER,e),t.drawElements(t.TRIANGLES,6,t.UNSIGNED_SHORT,0)});let d,f,W,k,y,K,w=[],I,ae,ue=qe();const N=new T(ye,be),le=new T(x,Ue),q=new T(x,Le),fe=new T(x,Fe),ce=new T(x,we),M=new T(x,Be),P=new T(x,Ne),X=new T(x,Pe),se=new T(x,Ie),j=new T(x,Me),b=new T(x,Xe),R=new T(x,Ce),J=new T(x,ze),Q=new T(x,Ge),B=new T(x,Ye),C=new T(x,He),z=new T(x,Ve),U=new Ae(x,Oe);function ve(){let e=Y(l.SIM_RESOLUTION),i=Y(l.DYE_RESOLUTION);const r=g.halfFloatTexType,o=g.formatRGBA,n=g.formatRG,u=g.formatR,a=g.supportLinearFiltering?t.LINEAR:t.NEAREST;d==null?d=Z(i.width,i.height,o.internalFormat,o.format,r,a):d=me(d,i.width,i.height,o.internalFormat,o.format,r,a),f==null?f=Z(e.width,e.height,n.internalFormat,n.format,r,a):f=me(f,e.width,e.height,n.internalFormat,n.format,r,a),W=D(e.width,e.height,u.internalFormat,u.format,r,t.NEAREST),k=D(e.width,e.height,u.internalFormat,u.format,r,t.NEAREST),y=Z(e.width,e.height,u.internalFormat,u.format,r,t.NEAREST),We(),ke()}function We(){let e=Y(l.BLOOM_RESOLUTION);const i=g.halfFloatTexType,r=g.formatRGBA,o=g.supportLinearFiltering?t.LINEAR:t.NEAREST;K=D(e.width,e.height,r.internalFormat,r.format,i,o),w.length=0;for(let n=0;n<l.BLOOM_ITERATIONS;n++){let u=e.width>>n+1,a=e.height>>n+1;if(u<2||a<2)break;let s=D(u,a,r.internalFormat,r.format,i,o);w.push(s)}}function ke(){let e=Y(l.SUNRAYS_RESOLUTION);const i=g.halfFloatTexType,r=g.formatR,o=g.supportLinearFiltering?t.LINEAR:t.NEAREST;I=D(e.width,e.height,r.internalFormat,r.format,i,o),ae=D(e.width,e.height,r.internalFormat,r.format,i,o)}function D(e,i,r,o,n,u){t.activeTexture(t.TEXTURE0);let a=t.createTexture();t.bindTexture(t.TEXTURE_2D,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,u),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,u),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,r,e,i,0,o,n,null);let s=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,s),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,a,0),t.viewport(0,0,e,i),t.clear(t.COLOR_BUFFER_BIT);let c=1/e,p=1/i;return{texture:a,fbo:s,width:e,height:i,texelSizeX:c,texelSizeY:p,attach(O){return t.activeTexture(t.TEXTURE0+O),t.bindTexture(t.TEXTURE_2D,a),O}}}function Z(e,i,r,o,n,u){let a=D(e,i,r,o,n,u),s=D(e,i,r,o,n,u);return{width:e,height:i,texelSizeX:a.texelSizeX,texelSizeY:a.texelSizeY,get read(){return a},set read(c){a=c},get write(){return s},set write(c){s=c},swap(){let c=a;a=s,s=c}}}function Ke(e,i,r,o,n,u,a){let s=D(i,r,o,n,u,a);return le.bind(),t.uniform1i(le.uniforms.uTexture,e.attach(0)),m(s.fbo),s}function me(e,i,r,o,n,u,a){return e.width==i&&e.height==r||(e.read=Ke(e.read,i,r,o,n,u,a),e.write=D(i,r,o,n,u,a),e.width=i,e.height=r,e.texelSizeX=1/i,e.texelSizeY=1/r),e}function qe(e){let i=t.createTexture();t.bindTexture(t.TEXTURE_2D,i),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.REPEAT),t.texImage2D(t.TEXTURE_2D,0,t.RGB,1,1,0,t.RGB,t.UNSIGNED_BYTE,new Uint8Array([255,255,255]));let r={texture:i,width:1,height:1,attach(n){return t.activeTexture(t.TEXTURE0+n),t.bindTexture(t.TEXTURE_2D,i),n}},o=new Image;return o.onload=()=>{r.width=o.width,r.height=o.height,t.bindTexture(t.TEXTURE_2D,i),t.texImage2D(t.TEXTURE_2D,0,t.RGB,t.RGB,t.UNSIGNED_BYTE,o)},r}function je(){let e=[];l.SHADING&&e.push("SHADING"),l.BLOOM&&e.push("BLOOM"),l.SUNRAYS&&e.push("SUNRAYS"),U.setKeywords(e)}let he=Date.now(),G=0;const $=()=>{$.loaded||($.loaded=!0,je(),ve(),xe(parseInt(Math.random()*20)+5),de())};function de(e){if(!S)return;const i=Je();Te()&&ve(),Qe(i),Ze(),l.PAUSED||$e(i),et(),H=requestAnimationFrame(de)}function Je(){let e=Date.now(),i=(e-he)/1e3;return i=Math.min(i,.016666),he=e,i}function Te(){let e=A(v.clientWidth),i=A(v.clientHeight);return e<1&&(e=1),i<1&&(i=1),v.width!=e||v.height!=i?(v.width=e,v.height=i,!0):!1}function Qe(e){l.COLORFUL&&(G+=e*l.COLOR_UPDATE_SPEED,G>=1&&(G=mt(G,0,1),E.forEach(i=>{i.color=te()})))}function Ze(){ie.length>0&&xe(ie.pop()),E.forEach(e=>{e.moved&&(e.moved=!1,ut(e))})}function $e(e){t.disable(t.BLEND),t.viewport(0,0,f.width,f.height),Q.bind(),t.uniform2f(Q.uniforms.texelSize,f.texelSizeX,f.texelSizeY),t.uniform1i(Q.uniforms.uVelocity,f.read.attach(0)),m(k.fbo),B.bind(),t.uniform2f(B.uniforms.texelSize,f.texelSizeX,f.texelSizeY),t.uniform1i(B.uniforms.uVelocity,f.read.attach(0)),t.uniform1i(B.uniforms.uCurl,k.attach(1)),t.uniform1f(B.uniforms.curl,l.CURL),t.uniform1f(B.uniforms.dt,e),m(f.write.fbo),f.swap(),J.bind(),t.uniform2f(J.uniforms.texelSize,f.texelSizeX,f.texelSizeY),t.uniform1i(J.uniforms.uVelocity,f.read.attach(0)),m(W.fbo),q.bind(),t.uniform1i(q.uniforms.uTexture,y.read.attach(0)),t.uniform1f(q.uniforms.value,l.PRESSURE),m(y.write.fbo),y.swap(),C.bind(),t.uniform2f(C.uniforms.texelSize,f.texelSizeX,f.texelSizeY),t.uniform1i(C.uniforms.uDivergence,W.attach(0));for(let r=0;r<l.PRESSURE_ITERATIONS;r++)t.uniform1i(C.uniforms.uPressure,y.read.attach(1)),m(y.write.fbo),y.swap();z.bind(),t.uniform2f(z.uniforms.texelSize,f.texelSizeX,f.texelSizeY),t.uniform1i(z.uniforms.uPressure,y.read.attach(0)),t.uniform1i(z.uniforms.uVelocity,f.read.attach(1)),m(f.write.fbo),f.swap(),R.bind(),t.uniform2f(R.uniforms.texelSize,f.texelSizeX,f.texelSizeY),g.supportLinearFiltering||t.uniform2f(R.uniforms.dyeTexelSize,f.texelSizeX,f.texelSizeY);let i=f.read.attach(0);t.uniform1i(R.uniforms.uVelocity,i),t.uniform1i(R.uniforms.uSource,i),t.uniform1f(R.uniforms.dt,e),t.uniform1f(R.uniforms.dissipation,l.VELOCITY_DISSIPATION),m(f.write.fbo),f.swap(),t.viewport(0,0,d.width,d.height),g.supportLinearFiltering||t.uniform2f(R.uniforms.dyeTexelSize,d.texelSizeX,d.texelSizeY),t.uniform1i(R.uniforms.uVelocity,f.read.attach(0)),t.uniform1i(R.uniforms.uSource,d.read.attach(1)),t.uniform1f(R.uniforms.dissipation,l.DENSITY_DISSIPATION),m(d.write.fbo),d.swap()}function et(e){l.BLOOM&&ot(d.read,K),l.SUNRAYS&&(nt(d.read,d.write,I),at(I,ae,1)),t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND);let i=t.drawingBufferWidth,r=t.drawingBufferHeight;t.viewport(0,0,i,r);let o=null;l.TRANSPARENT||tt(o,vt(l.BACK_COLOR)),l.TRANSPARENT&&rt(o),it(o,i,r)}function tt(e,i){fe.bind(),t.uniform4f(fe.uniforms.color,i.r,i.g,i.b,1),m(e)}function rt(e){ce.bind(),t.uniform1f(ce.uniforms.aspectRatio,v.width/v.height),m(e)}function it(e,i,r){if(U.bind(),l.SHADING&&t.uniform2f(U.uniforms.texelSize,1/i,1/r),t.uniform1i(U.uniforms.uTexture,d.read.attach(0)),l.BLOOM){t.uniform1i(U.uniforms.uBloom,K.attach(1)),t.uniform1i(U.uniforms.uDithering,ue.attach(2));let o=ht(ue,i,r);t.uniform2f(U.uniforms.ditherScale,o.x,o.y)}l.SUNRAYS&&t.uniform1i(U.uniforms.uSunrays,I.attach(3)),m(e)}function ot(e,i){if(w.length<2)return;let r=i;t.disable(t.BLEND),M.bind();let o=l.BLOOM_THRESHOLD*l.BLOOM_SOFT_KNEE+1e-4,n=l.BLOOM_THRESHOLD-o,u=o*2,a=.25/o;t.uniform3f(M.uniforms.curve,n,u,a),t.uniform1f(M.uniforms.threshold,l.BLOOM_THRESHOLD),t.uniform1i(M.uniforms.uTexture,e.attach(0)),t.viewport(0,0,r.width,r.height),m(r.fbo),P.bind();for(let s=0;s<w.length;s++){let c=w[s];t.uniform2f(P.uniforms.texelSize,r.texelSizeX,r.texelSizeY),t.uniform1i(P.uniforms.uTexture,r.attach(0)),t.viewport(0,0,c.width,c.height),m(c.fbo),r=c}t.blendFunc(t.ONE,t.ONE),t.enable(t.BLEND);for(let s=w.length-2;s>=0;s--){let c=w[s];t.uniform2f(P.uniforms.texelSize,r.texelSizeX,r.texelSizeY),t.uniform1i(P.uniforms.uTexture,r.attach(0)),t.viewport(0,0,c.width,c.height),m(c.fbo),r=c}t.disable(t.BLEND),X.bind(),t.uniform2f(X.uniforms.texelSize,r.texelSizeX,r.texelSizeY),t.uniform1i(X.uniforms.uTexture,r.attach(0)),t.uniform1f(X.uniforms.intensity,l.BLOOM_INTENSITY),t.viewport(0,0,i.width,i.height),m(i.fbo)}function nt(e,i,r){t.disable(t.BLEND),se.bind(),t.uniform1i(se.uniforms.uTexture,e.attach(0)),t.viewport(0,0,i.width,i.height),m(i.fbo),j.bind(),t.uniform1f(j.uniforms.weight,l.SUNRAYS_WEIGHT),t.uniform1i(j.uniforms.uTexture,i.attach(0)),t.viewport(0,0,r.width,r.height),m(r.fbo)}function at(e,i,r){N.bind();for(let o=0;o<r;o++)t.uniform2f(N.uniforms.texelSize,e.texelSizeX,0),t.uniform1i(N.uniforms.uTexture,e.attach(0)),m(i.fbo),t.uniform2f(N.uniforms.texelSize,0,e.texelSizeY),t.uniform1i(N.uniforms.uTexture,i.attach(0)),m(e.fbo)}function ut(e){let i=e.deltaX*l.SPLAT_FORCE,r=e.deltaY*l.SPLAT_FORCE;ge(e.texcoordX,e.texcoordY,i,r,e.color)}function xe(e){for(let i=0;i<e;i++){const r=te();r.r*=10,r.g*=10,r.b*=10;const o=Math.random(),n=Math.random(),u=1e3*(Math.random()-.5),a=1e3*(Math.random()-.5);ge(o,n,u,a,r)}}function ge(e,i,r,o,n){t.viewport(0,0,f.width,f.height),b.bind(),t.uniform1i(b.uniforms.uTarget,f.read.attach(0)),t.uniform1f(b.uniforms.aspectRatio,v.width/v.height),t.uniform2f(b.uniforms.point,e,i),t.uniform3f(b.uniforms.color,r,o,0),t.uniform1f(b.uniforms.radius,lt(l.SPLAT_RADIUS/100)),m(f.write.fbo),f.swap(),t.viewport(0,0,d.width,d.height),t.uniform1i(b.uniforms.uTarget,d.read.attach(0)),t.uniform3f(b.uniforms.color,n.r,n.g,n.b),m(d.write.fbo),d.swap()}function lt(e){let i=v.width/v.height;return i>1&&(e*=i),e}F(window,"touchend",e=>{const i=e.changedTouches;for(let r=0;r<i.length;r++){let o=E.find(n=>n.id==i[r].identifier);o!=null&&ee(o)}});function Ee(e,i,r,o){e.id=i,e.down=!0,e.moved=!1,e.texcoordX=r/v.width,e.texcoordY=1-o/v.height,e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.deltaX=0,e.deltaY=0,e.color=te()}function Re(e,i,r){e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.texcoordX=i/v.width,e.texcoordY=1-r/v.height,e.deltaX=ft(e.texcoordX-e.prevTexcoordX),e.deltaY=ct(e.texcoordY-e.prevTexcoordY),e.moved=Math.abs(e.deltaX)>0||Math.abs(e.deltaY)>0}function ee(e){e.down=!1}function ft(e){let i=v.width/v.height;return i<1&&(e*=i),e}function ct(e){let i=v.width/v.height;return i>1&&(e/=i),e}function te(){let e=st(Math.random(),1,1);return e.r*=.15,e.g*=.15,e.b*=.15,e}function st(e,i,r){let o,n,u,a,s,c,p,O;switch(a=Math.floor(e*6),s=e*6-a,c=r*(1-i),p=r*(1-s*i),O=r*(1-(1-s)*i),a%6){case 0:o=r,n=O,u=c;break;case 1:o=p,n=r,u=c;break;case 2:o=c,n=r,u=O;break;case 3:o=c,n=p,u=r;break;case 4:o=O,n=c,u=r;break;case 5:o=r,n=c,u=p;break}return{r:o,g:n,b:u}}function vt(e){return{r:e.r/255,g:e.g/255,b:e.b/255}}function mt(e,i,r){let o=r-i;return(e-i)%o+i}function Y(e){let i=t.drawingBufferWidth/t.drawingBufferHeight;i<1&&(i=1/i);let r=Math.round(e),o=Math.round(e*i);return t.drawingBufferWidth>t.drawingBufferHeight?{width:o,height:r}:{width:r,height:o}}function ht(e,i,r){return{x:i/e.width,y:r/e.height}}function A(e){let i=window.devicePixelRatio||1;return Math.floor(e*i)}function dt(e){if(e.length==0)return 0;let i=0;for(let r=0;r<e.length;r++)i=(i<<5)-i+e.charCodeAt(r),i|=0;return i}F(document,"mousedown",e=>{if(!S)return;let i=A(e.pageX),r=A(e.pageY),o=E.find(n=>n.id==-1);o==null&&(o=new V),Ee(o,-1,i,r)}),F(document,"mousemove",e=>{if(!S)return;let i=E[0];if(!i.down)return;let r=A(e.pageX),o=A(e.pageY);Re(i,r,o)}),F(document,"mouseup",()=>{S&&ee(E[0])}),F(document,"touchstart",e=>{if(!S)return;const i=e.targetTouches;for(;i.length>=E.length;)E.push(new V);for(let r=0;r<i.length;r++){let o=A(i[r].pageX),n=A(i[r].pageY);Ee(E[r+1],i[r].identifier,o,n)}}),F(document,"touchmove",e=>{if(!S)return;const i=e.targetTouches;for(let r=0;r<i.length;r++){let o=E[r+1];if(!o.down)continue;let n=A(i[r].pageX),u=A(i[r].pageY);Re(o,n,u)}},!1),F(document,"touchend",e=>{if(!S)return;const i=e.changedTouches;for(let r=0;r<i.length;r++){let o=E.find(n=>n.id==i[r].identifier);o!=null&&ee(o)}}),$()}export{Et as startFluid,gt as stopFluid};
