(() => {
    "use strict";
    const t = THREE;
    class e extends t.DataTextureLoader {
        constructor(e) {
            super(e), this.type = t.HalfFloatType
        }
        parse(e) {
            const n = function(t, e) {
                    switch (t) {
                        case 1:
                            console.error("THREE.RGBELoader Read Error: " + (e || ""));
                            break;
                        case 2:
                            console.error("THREE.RGBELoader Write Error: " + (e || ""));
                            break;
                        case 3:
                            console.error("THREE.RGBELoader Bad File Format: " + (e || ""));
                            break;
                        default:
                            console.error("THREE.RGBELoader: Error: " + (e || ""))
                    }
                    return -1
                },
                r = function(t, e, n) {
                    e = e || 1024;
                    let r = t.pos,
                        a = -1,
                        o = 0,
                        i = "",
                        s = String.fromCharCode.apply(null, new Uint16Array(t.subarray(r, r + 128)));
                    for (; 0 > (a = s.indexOf("\n")) && o < e && r < t.byteLength;) i += s, o += s.length, r += 128, s += String.fromCharCode.apply(null, new Uint16Array(t.subarray(r, r + 128)));
                    return -1 < a && (!1 !== n && (t.pos += o + a + 1), i + s.slice(0, a))
                },
                a = function(t, e, n, r) {
                    const a = t[e + 3],
                        o = Math.pow(2, a - 128) / 255;
                    n[r + 0] = t[e + 0] * o, n[r + 1] = t[e + 1] * o, n[r + 2] = t[e + 2] * o, n[r + 3] = 1
                },
                o = function(e, n, r, a) {
                    const o = e[n + 3],
                        i = Math.pow(2, o - 128) / 255;
                    r[a + 0] = t.DataUtils.toHalfFloat(Math.min(e[n + 0] * i, 65504)), r[a + 1] = t.DataUtils.toHalfFloat(Math.min(e[n + 1] * i, 65504)), r[a + 2] = t.DataUtils.toHalfFloat(Math.min(e[n + 2] * i, 65504)), r[a + 3] = t.DataUtils.toHalfFloat(1)
                },
                i = new Uint8Array(e);
            i.pos = 0;
            const s = function(t) {
                const e = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,
                    a = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,
                    o = /^\s*FORMAT=(\S+)\s*$/,
                    i = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,
                    s = {
                        valid: 0,
                        string: "",
                        comments: "",
                        programtype: "RGBE",
                        format: "",
                        gamma: 1,
                        exposure: 1,
                        width: 0,
                        height: 0
                    };
                let c, l;
                if (t.pos >= t.byteLength || !(c = r(t))) return n(1, "no header found");
                if (!(l = c.match(/^#\?(\S+)/))) return n(3, "bad initial token");
                for (s.valid |= 1, s.programtype = l[1], s.string += c + "\n"; c = r(t), !1 !== c;)
                    if (s.string += c + "\n", "#" !== c.charAt(0)) {
                        if ((l = c.match(e)) && (s.gamma = parseFloat(l[1])), (l = c.match(a)) && (s.exposure = parseFloat(l[1])), (l = c.match(o)) && (s.valid |= 2, s.format = l[1]), (l = c.match(i)) && (s.valid |= 4, s.height = parseInt(l[1], 10), s.width = parseInt(l[2], 10)), 2 & s.valid && 4 & s.valid) break
                    } else s.comments += c + "\n";
                return 2 & s.valid ? 4 & s.valid ? s : n(3, "missing image size specifier") : n(3, "missing format specifier")
            }(i);
            if (-1 !== s) {
                const e = s.width,
                    r = s.height,
                    c = function(t, e, r) {
                        const a = e;
                        if (a < 8 || a > 32767 || 2 !== t[0] || 2 !== t[1] || 128 & t[2]) return new Uint8Array(t);
                        if (a !== (t[2] << 8 | t[3])) return n(3, "wrong scanline width");
                        const o = new Uint8Array(4 * e * r);
                        if (!o.length) return n(4, "unable to allocate buffer space");
                        let i = 0,
                            s = 0;
                        const c = 4 * a,
                            l = new Uint8Array(4),
                            d = new Uint8Array(c);
                        let u = r;
                        for (; u > 0 && s < t.byteLength;) {
                            if (s + 4 > t.byteLength) return n(1);
                            if (l[0] = t[s++], l[1] = t[s++], l[2] = t[s++], l[3] = t[s++], 2 != l[0] || 2 != l[1] || (l[2] << 8 | l[3]) != a) return n(3, "bad rgbe scanline format");
                            let e, r = 0;
                            for (; r < c && s < t.byteLength;) {
                                e = t[s++];
                                const a = e > 128;
                                if (a && (e -= 128), 0 === e || r + e > c) return n(3, "bad scanline data");
                                if (a) {
                                    const n = t[s++];
                                    for (let t = 0; t < e; t++) d[r++] = n
                                } else d.set(t.subarray(s, s + e), r), r += e, s += e
                            }
                            const h = a;
                            for (let t = 0; t < h; t++) {
                                let e = 0;
                                o[i] = d[t + e], e += a, o[i + 1] = d[t + e], e += a, o[i + 2] = d[t + e], e += a, o[i + 3] = d[t + e], i += 4
                            }
                            u--
                        }
                        return o
                    }(i.subarray(i.pos), e, r);
                if (-1 !== c) {
                    let n, i, l;
                    switch (this.type) {
                        case t.FloatType:
                            l = c.length / 4;
                            const e = new Float32Array(4 * l);
                            for (let t = 0; t < l; t++) a(c, 4 * t, e, 4 * t);
                            n = e, i = t.FloatType;
                            break;
                        case t.HalfFloatType:
                            l = c.length / 4;
                            const r = new Uint16Array(4 * l);
                            for (let t = 0; t < l; t++) o(c, 4 * t, r, 4 * t);
                            n = r, i = t.HalfFloatType;
                            break;
                        default:
                            console.error("THREE.RGBELoader: unsupported type: ", this.type)
                    }
                    return {
                        width: e,
                        height: r,
                        data: n,
                        header: s.string,
                        gamma: s.gamma,
                        exposure: s.exposure,
                        type: i
                    }
                }
            }
            return null
        }
        setDataType(t) {
            return this.type = t, this
        }
        load(e, n, r, a) {
            return super.load(e, (function(e, r) {
                switch (e.type) {
                    case t.FloatType:
                    case t.HalfFloatType:
                        e.colorSpace = t.LinearSRGBColorSpace, e.minFilter = t.LinearFilter, e.magFilter = t.LinearFilter, e.generateMipmaps = !1, e.flipY = !0
                }
                n && n(e, r)
            }), r, a)
        }
    }
    class n extends t.Mesh {
        constructor(e, n = {}) {
            const r = [e.isCubeTexture ? "#define ENVMAP_TYPE_CUBE" : ""].join("\n") + "\n\n\t\t\t\tvarying vec3 vWorldPosition;\n\n\t\t\t\tuniform float radius;\n\t\t\t\tuniform float height;\n\t\t\t\tuniform float angle;\n\n\t\t\t\t#ifdef ENVMAP_TYPE_CUBE\n\n\t\t\t\t\tuniform samplerCube map;\n\n\t\t\t\t#else\n\n\t\t\t\t\tuniform sampler2D map;\n\n\t\t\t\t#endif\n\n\t\t\t\t// From: https://www.shadertoy.com/view/4tsBD7\n\t\t\t\tfloat diskIntersectWithBackFaceCulling( vec3 ro, vec3 rd, vec3 c, vec3 n, float r ) \n\t\t\t\t{\n\n\t\t\t\t\tfloat d = dot ( rd, n );\n\n\t\t\t\t\tif( d > 0.0 ) { return 1e6; }\n\n\t\t\t\t\tvec3 o = ro - c;\n\t\t\t\t\tfloat t = - dot( n, o ) / d;\n\t\t\t\t\tvec3 q = o + rd * t;\n\n\t\t\t\t\treturn ( dot( q, q ) < r * r ) ? t : 1e6;\n\n\t\t\t\t}\n\n\t\t\t\t// From: https://www.iquilezles.org/www/articles/intersectors/intersectors.htm\n\t\t\t\tfloat sphereIntersect( vec3 ro, vec3 rd, vec3 ce, float ra ) {\n\n\t\t\t\t\tvec3 oc = ro - ce;\n\t\t\t\t\tfloat b = dot( oc, rd );\n\t\t\t\t\tfloat c = dot( oc, oc ) - ra * ra;\n\t\t\t\t\tfloat h = b * b - c;\n\n\t\t\t\t\tif( h < 0.0 ) { return -1.0; }\n\n\t\t\t\t\th = sqrt( h );\n\n\t\t\t\t\treturn - b + h;\n\n\t\t\t\t}\n\n\t\t\t\tvec3 project() {\n\n\t\t\t\t\tvec3 p = normalize( vWorldPosition );\n\t\t\t\t\tvec3 camPos = cameraPosition;\n\t\t\t\t\tcamPos.y -= height;\n\n\t\t\t\t\tfloat intersection = sphereIntersect( camPos, p, vec3( 0.0 ), radius );\n\t\t\t\t\tif( intersection > 0.0 ) {\n\n\t\t\t\t\t\tvec3 h = vec3( 0.0, - height, 0.0 );\n\t\t\t\t\t\tfloat intersection2 = diskIntersectWithBackFaceCulling( camPos, p, h, vec3( 0.0, 1.0, 0.0 ), radius );\n\t\t\t\t\t\tp = ( camPos + min( intersection, intersection2 ) * p ) / radius;\n\n\t\t\t\t\t} else {\n\n\t\t\t\t\t\tp = vec3( 0.0, 1.0, 0.0 );\n\n\t\t\t\t\t}\n\n\t\t\t\t\treturn p;\n\n\t\t\t\t}\n\n\t\t\t\t#include <common>\n\n\t\t\t\tvoid main() {\n\n\t\t\t\t\tvec3 projectedWorldPosition = project();\n\n\t\t\t\t\t#ifdef ENVMAP_TYPE_CUBE\n\n\t\t\t\t\t\tvec3 outcolor = textureCube( map, projectedWorldPosition ).rgb;\n\n\t\t\t\t\t#else\n\n\t\t\t\t\t\tvec3 direction = normalize( projectedWorldPosition );\n\t\t\t\t\t\tvec2 uv = equirectUv( direction );\n\t\t\t\t\t\tvec3 outcolor = texture2D( map, uv ).rgb;\n\n\t\t\t\t\t#endif\n\n\t\t\t\t\tgl_FragColor = vec4( outcolor, 1.0 );\n\n\t\t\t\t\t#include <tonemapping_fragment>\n\t\t\t\t\t#include <encodings_fragment>\n\n\t\t\t\t}\n\t\t\t\t",
                a = {
                    map: {
                        value: e
                    },
                    height: {
                        value: n.height || 15
                    },
                    radius: {
                        value: n.radius || 100
                    }
                };
            super(new t.IcosahedronGeometry(1, 16), new t.ShaderMaterial({
                uniforms: a,
                fragmentShader: r,
                vertexShader: "\n\t\t\tvarying vec3 vWorldPosition;\n\n\t\t\tvoid main() {\n\n\t\t\t\tvec4 worldPosition = ( modelMatrix * vec4( position, 1.0 ) );\n\t\t\t\tvWorldPosition = worldPosition.xyz;\n\n\t\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n\t\t\t}\n\t\t\t",
                side: t.DoubleSide
            }))
        }
        set radius(t) {
            this.material.uniforms.radius.value = t
        }
        get radius() {
            return this.material.uniforms.radius.value
        }
        set height(t) {
            this.material.uniforms.height.value = t
        }
        get height() {
            return this.material.uniforms.height.value
        }
    }
    AFRAME.registerComponent("ground-projected-skybox", {
        schema: {
            envMapUrl: {
                default: ""
            },
            scale: {
                default: 100
            }
        },
        update: async function(t) {
            const e = AFRAME.utils.diff(t, this.data);
            if (e.envMapUrl) {
                this.cleanup(), this.skybox = await this.createSkybox(this.data.envMapUrl);
                const t = this.el.sceneEl.object3D;
                t.add(this.skybox), t.environment = this.envMap
            }
            e.scale && (console.log(this.data.scale), this.skybox.scale.setScalar(this.data.scale))
        },
        createSkybox: async function(t) {
            const r = new e;
            return this.envMap = await r.loadAsync(t), this.envMap.mapping = THREE.EquirectangularReflectionMapping, new n(this.envMap)
        },
        cleanup() {
            const t = this.el.sceneEl.object3D;
            this.skybox && t.remove(this.skybox), this.envMap && (t.environment = null, this.envMap.dispose())
        },
        remove: function() {
            this.cleanup()
        }
    })
})();
