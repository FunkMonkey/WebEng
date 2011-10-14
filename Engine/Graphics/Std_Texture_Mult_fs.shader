#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform vec4 uPostAddColor;
uniform vec4 uMultColor;
uniform sampler2D uSampler;


void main(void) {
	gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)) * uMultColor;
	gl_FragColor.a += gl_FragColor.a * uPostAddColor.a;
	
	for(int i = 0; i < 4; i++)
	{
		if(gl_FragColor[i] > 1.0)
			gl_FragColor[i] = 1.0;
		else if(gl_FragColor[i] < 0.0)
			gl_FragColor[i] = 0.0;
    }
	
}