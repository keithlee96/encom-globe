/* ---------------------------------------------------------------------------- 
    pusher.color.js
    A color parsing and manipulation library
   ----------------------------------------------------------------------------
    The MIT License (MIT). Copyright (c) 2013, Pusher Inc.
*/
(function () {
  function normalize360(v) {
    v = v % 360;
    return v < 0 ? 360 + v : v;
  }
  function unsigned(i) {
    return i >>> 0;
  }
  function trimLc(s) {
    return s.replace(/^\s+/, "").replace(/\s+$/, "").toLowerCase();
  }
  function slice(obj, index) {
    return Array.prototype.slice.call(obj, index);
  }
  function append(arr, value) {
    arr.push(value);
    return arr;
  }
  function clamp(x, a, b) {
    return !(x > a) ? a : !(x < b) ? b : x;
  }
  function mix(x, y, a) {
    return (1 - a) * x + a * y;
  }
  function f2b(f) {
    f = Math.round(255 * f);
    if (!(f > 0)) return 0;
    else if (!(f < 255)) return 255;
    else return f & 255;
  }
  function b2f(b) {
    return b / 255;
  }
  function rgbToHsl(r, g, b) {
    var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    var h,
      s,
      l = (max + min) / 2;
    if (max == min) {
      h = s = 0;
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return [h, s, l];
  }
  function hslToRgb(h, s, l) {
    var r, g, b;
    if (s == 0) {
      r = g = b = l;
    } else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [r, g, b];
  }
  function hex4ToRgba(color) {
    var rgba = [
      parseInt(color.substr(1, 1), 16),
      parseInt(color.substr(2, 1), 16),
      parseInt(color.substr(3, 1), 16),
      1,
    ];
    for (var i = 0; i < 3; ++i) rgba[i] = (rgba[i] * 16 + rgba[i]) / 255;
    return rgba;
  }
  function hex7ToRgba(color) {
    return [
      parseInt(color.substr(1, 2), 16) / 255,
      parseInt(color.substr(3, 2), 16) / 255,
      parseInt(color.substr(5, 2), 16) / 255,
      1,
    ];
  }
  var namedColors = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 134, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 250, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 216],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [216, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 221],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [112, 128, 144],
    slategrey: [112, 128, 144],
    snow: [255, 250, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 50],
  };
  function rgbaToHsva(rgba) {
    var r = rgba[0];
    var g = rgba[1];
    var b = rgba[2];
    var min = Math.min(Math.min(r, g), b),
      max = Math.max(Math.max(r, g), b),
      delta = max - min;
    var value = max;
    var saturation, hue;
    if (max == min) {
      hue = 0;
    } else if (max == r) {
      hue = (60 * ((g - b) / (max - min))) % 360;
    } else if (max == g) {
      hue = 60 * ((b - r) / (max - min)) + 120;
    } else if (max == b) {
      hue = 60 * ((r - g) / (max - min)) + 240;
    }
    if (hue < 0) {
      hue += 360;
    }
    if (max == 0) {
      saturation = 0;
    } else {
      saturation = 1 - min / max;
    }
    return [
      Math.round(hue),
      Math.round(saturation * 100),
      Math.round(value * 100),
      rgba[3],
    ];
  }
  function hsvaToRgba(hsva) {
    var h = normalize360(hsva[0]);
    var s = hsva[1];
    var v = hsva[2];
    var s = s / 100;
    var v = v / 100;
    var hi = Math.floor((h / 60) % 6);
    var f = h / 60 - hi;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var rgb = [];
    switch (hi) {
      case 0:
        rgb = [v, t, p];
        break;
      case 1:
        rgb = [q, v, p];
        break;
      case 2:
        rgb = [p, v, t];
        break;
      case 3:
        rgb = [p, q, v];
        break;
      case 4:
        rgb = [t, p, v];
        break;
      case 5:
        rgb = [v, p, q];
        break;
    }
    return [rgb[0], rgb[1], rgb[2], hsva[3]];
  }
  function rgbaToHsl(c) {
    var hsl = rgbToHsl(c[0], c[1], c[2]);
    hsl[0] = normalize360(Math.floor(hsl[0] * 360));
    hsl[1] = Math.floor(hsl[1] * 100);
    hsl[2] = Math.floor(hsl[2] * 100);
    return hsl;
  }
  function rgbaToHsla(c) {
    var hsl = rgbaToHsl(c);
    hsl.push(c[3]);
    return hsl;
  }
  function hslToRgba(c) {
    var h = parseFloat(c[0]) / 360;
    var s = parseFloat(c[1]) / 100;
    var l = parseFloat(c[2]) / 100;
    var rgb = hslToRgb(h, s, l);
    return [rgb[0], rgb[1], rgb[2], 1];
  }
  function hslaToRgba(c) {
    var h = parseFloat(c[0]) / 360;
    var s = parseFloat(c[1]) / 100;
    var l = parseFloat(c[2]) / 100;
    var rgb = hslToRgb(h, s, l);
    return [rgb[0], rgb[1], rgb[2], parseFloat(c[3])];
  }
  var parse = {
    byteOrPercent: function (s) {
      var m;
      if (typeof s == "string" && (m = s.match(/^([0-9]+)%$/)))
        return Math.floor((parseFloat(m[1]) * 255) / 100);
      else return parseFloat(s);
    },
    floatOrPercent: function (s) {
      var m;
      if (typeof s == "string" && (m = s.match(/^([0-9]+)%$/)))
        return parseFloat(m[1]) / 100;
      else return parseFloat(s);
    },
    numberOrPercent: function (s, scale) {
      var m;
      if (typeof s == "string" && (m = s.match(/^([0-9]+)%$/)))
        return (parseFloat(m[1]) / 100) * scale;
      else return parseFloat(s);
    },
    rgba: function (v) {
      for (var i = 0; i < 3; ++i) v[i] = b2f(parse.byteOrPercent(v[i]));
      v[3] = parse.floatOrPercent(v[i]);
      return new Color(v);
    },
    rgba8: function (v) {
      return new Color([
        b2f(parse.byteOrPercent(v[0])),
        b2f(parse.byteOrPercent(v[1])),
        b2f(parse.byteOrPercent(v[2])),
        b2f(parse.byteOrPercent(v[3])),
      ]);
    },
    float3: function (v) {
      for (var i = 0; i < 3; ++i) v[i] = parse.floatOrPercent(v[i]);
      v[3] = 1;
      return new Color(v);
    },
    float4: function (v) {
      for (var i = 0; i < 3; ++i) v[i] = parse.floatOrPercent(v[i]);
      v[3] = parse.floatOrPercent(v[i]);
      return new Color(v);
    },
    hsla: function (v) {
      v[0] = parse.numberOrPercent(v[0], 360);
      v[1] = parse.numberOrPercent(v[1], 100);
      v[2] = parse.numberOrPercent(v[2], 100);
      v[3] = parse.numberOrPercent(v[3], 1);
      return new Color(hslaToRgba(v));
    },
    hsva: function (v) {
      v[0] = normalize360(parseFloat(v[0]));
      v[1] = Math.max(0, Math.min(100, parseFloat(v[1])));
      v[2] = Math.max(0, Math.min(100, parseFloat(v[2])));
      v[3] = parse.floatOrPercent(v[3]);
      return new Color(hsvaToRgba(v));
    },
  };
  var supportedFormats = {
    keyword: {},
    hex3: {},
    hex7: {},
    rgb: {
      parse: function (v) {
        v = v.slice(0);
        v.push(1);
        return parse.rgba(v);
      },
    },
    rgba: { parse: parse.rgba },
    hsl: {
      parse: function (v) {
        v = v.slice(0);
        v.push(1);
        return parse.hsla(v);
      },
    },
    hsla: { parse: parse.hsla },
    hsv: {
      parse: function (v) {
        v = v.slice(0);
        v.push(1);
        return parse.hsva(v);
      },
    },
    hsva: { parse: parse.hsva },
    rgb8: {
      parse: function (v) {
        v = v.slice(0);
        v.push(1);
        return parse.rgba(v);
      },
    },
    rgba8: {
      parse: function (v) {
        return parse.rgba8(v);
      },
    },
    packed_rgba: {
      parse: function (v) {
        v = [(v >> 24) & 255, (v >> 16) & 255, (v >> 8) & 255, (v & 255) / 255];
        return parse.rgba(v);
      },
      output: function (v) {
        return unsigned(
          (f2b(v[0]) << 24) | (f2b(v[1]) << 16) | (f2b(v[2]) << 8) | f2b(v[3])
        );
      },
    },
    packed_argb: {
      parse: function (v) {
        v = [
          (v >> 16) & 255,
          (v >> 8) & 255,
          (v >> 0) & 255,
          ((v >> 24) & 255) / 255,
        ];
        return parse.rgba(v);
      },
      output: function (v) {
        return unsigned(
          (f2b(v[3]) << 24) | (f2b(v[0]) << 16) | (f2b(v[1]) << 8) | f2b(v[2])
        );
      },
    },
    float3: { parse: parse.float3 },
    float4: { parse: parse.float4 },
  };
  function Color(value) {
    this._value = value;
  }
  var color = function () {
    var match = null;
    if (arguments[0] instanceof Color) {
      return new Color(arguments[0]._value);
    } else if (typeof arguments[0] == "string") {
      var first = arguments[0][0];
      if (first == "#") {
        if (
          (match = arguments[0].match(
            /^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/i
          ))
        ) {
          return new Color(hex4ToRgba(match[0]));
        } else if (
          (match = arguments[0].match(
            /^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/i
          ))
        ) {
          return new Color(hex7ToRgba(match[0]));
        }
      } else if ((match = supportedFormats[arguments[0].toLowerCase()])) {
        if (arguments.length == 2) return match.parse(arguments[1]);
        else return match.parse(slice(arguments, 1));
      } else if (
        (match = arguments[0].match(
          /^\s*([A-Z][A-Z0-9_]+)\s*\(\s*([\-0-9A-FX]+)\s*\)\s*$/i
        ))
      ) {
        var format = supportedFormats[match[1].toLowerCase()];
        return format.parse(match[2]);
      } else if (
        (match = arguments[0].match(
          /^\s*([A-Z][A-Z0-9]+)\s*\(\s*([0-9\.]+%?)\s*,\s*([0-9\.]+%?)\s*,\s*([0-9\.]+%?)\s*(,\s*([0-9\.]+%?)\s*)?\)\s*$/i
        ))
      ) {
        var format = supportedFormats[match[1].toLowerCase()];
        if (match[5] === undefined) {
          var v = [match[2], match[3], match[4]];
          return format.parse(v);
        } else {
          var v = [match[2], match[3], match[4], match[6]];
          return format.parse(v);
        }
      } else if (
        arguments.length == 1 &&
        (match = namedColors[trimLc(arguments[0])])
      ) {
        var v = match;
        return new Color([b2f(v[0]), b2f(v[1]), b2f(v[2]), 1]);
      }
    }
    throw "Could not parse color '" + arguments[0] + "'";
  };
  var fixed = {
    white: color("white"),
    black: color("black"),
    gray: color("gray"),
  };
  function modifyComponent(index, arg) {
    if (arg == undefined) return f2b(this._value[index]);
    var v = slice(this._value, 0);
    if (typeof arg == "string") {
      var m;
      if ((m = arg.match(/^([+\-\\*]=?)([0-9.]+)/))) {
        var op = m[1];
        var offset = parseFloat(m[2]);
        switch (op[0]) {
          case "+":
            v[index] += offset / 255;
            break;
          case "-":
            v[index] -= offset / 255;
            break;
          case "*":
            v[index] *= offset;
            break;
        }
        if (op[1] == "=") {
          this._value = v;
          return this;
        } else return new Color(v);
      }
    } else {
      var clone = this.clone();
      clone._value[index] = arg;
      return clone;
    }
  }
  function modifyHsva(i) {
    return function () {
      function change(obj, op, value) {
        value = parseFloat(value);
        var hsva = rgbaToHsva(obj._value);
        var c = 0;
        switch (op) {
          case "=":
            hsva[i] = value;
            c = 1;
            break;
          case "+":
            hsva[i] += value;
            c = 1;
            break;
          case "+=":
            hsva[i] += value;
            break;
          case "-":
            hsva[i] -= value;
            c = 1;
            break;
          case "-=":
            hsva[i] -= value;
            break;
          case "*":
            hsva[i] *= value;
            c = 1;
            break;
          case "*=":
            hsva[i] *= value;
            break;
          default:
            throw "Bad op " + op;
        }
        if (i == 0) hsva[i] = normalize360(hsva[i]);
        else if (i == 1 || i == 2) {
          if (hsva[i] < 0) hsva[i] = 0;
          else if (hsva[i] > 99) hsva[i] = 99;
        }
        if (c) obj = obj.clone();
        obj._value = hsvaToRgba(hsva);
        return obj;
      }
      if (arguments.length == 0) return rgbaToHsva(this._value)[i];
      else if (arguments.length == 1) {
        var m;
        if (
          typeof arguments[0] == "string" &&
          (m = arguments[0].match(/^([\+\-\*]=?)([0-9.]+)/))
        )
          return change(this, m[1], m[2]);
        else return change(this, "=", arguments[0]);
      } else if (arguments.length == 2)
        return change(this, arguments[0], arguments[1]);
    };
  }
  var methods = {
    clone: function () {
      return new Color(this._value.slice(0));
    },
    html: function () {
      var self = this;
      var v = this._value;
      var _fmt = {
        hex3: function () {
          return self.hex3();
        },
        hex6: function () {
          return self.hex6();
        },
        rgb: function () {
          return "rgb(" + self.rgb().join(",") + ")";
        },
        rgba: function () {
          return "rgba(" + self.rgba().join(",") + ")";
        },
        hsl: function () {
          return "hsl(" + rgbaToHsl(v).join(",") + ")";
        },
        hsla: function () {
          return "hsla(" + rgbaToHsla(v).join(",") + ")";
        },
        keyword: function () {
          var dist = 3 * 255 * 255 + 1;
          var keyword;
          for (name in namedColors) {
            var c = namedColors[name];
            var d = 0;
            for (var i = 0; i < 3; ++i) {
              var t = v[i] - b2f(c[i]);
              d += t * t;
            }
            if (d < dist) {
              keyword = name;
              dist = d;
            }
          }
          return keyword;
        },
      };
      var type = arguments[0] || "rgba";
      return _fmt[type]();
    },
    red: function () {
      return modifyComponent.call(this, 0, arguments[0]);
    },
    green: function () {
      return modifyComponent.call(this, 1, arguments[0]);
    },
    blue: function () {
      return modifyComponent.call(this, 2, arguments[0]);
    },
    alpha: function () {
      if (arguments.length == 1) {
        c = this.clone();
        c._value[3] = parse.floatOrPercent(arguments[0]);
        return c;
      } else return this._value[3];
    },
    alpha8: function () {
      if (arguments.length == 1) {
        c = this.clone();
        c._value[3] = parse.byteOrPercent(arguments[0]) / 255;
        return c;
      } else return Math.floor(this._value[3] * 255);
    },
    grayvalue: function () {
      var c = this._value;
      return (c[0] + c[1] + c[2]) / 3;
    },
    grayvalue8: function () {
      return f2b(this.grayvalue());
    },
    luminanceFast: function () {
      var c = this._value;
      return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
    },
    luminance: function () {
      function linearize(c) {
        return c < 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      }
      var r = linearize(this._value[0]);
      var g = linearize(this._value[1]);
      var b = linearize(this._value[2]);
      return r * 0.2126 + g * 0.7152 + b * 0.0722;
    },
    luminance8: function () {
      return f2b(this.luminance());
    },
    luminanceFast8: function () {
      return f2b(this.luminanceFast());
    },
    hsv: function () {
      return rgbaToHsva(this._value).slice(0, 3);
    },
    hsva: function () {
      return rgbaToHsva(this._value);
    },
    packed_rgba: function () {
      return supportedFormats.packed_rgba.output(this._value);
    },
    packed_argb: function () {
      return supportedFormats.packed_argb.output(this._value);
    },
    hue: modifyHsva(0),
    saturation: modifyHsva(1),
    value: modifyHsva(2),
    clamp: function () {
      var v = this._value;
      return new Color([
        clamp(v[0], 0, 1),
        clamp(v[1], 0, 1),
        clamp(v[2], 0, 1),
        clamp(v[3], 0, 1),
      ]);
    },
    blend: function (colorToBlend, amount) {
      if (typeof amount !== "number") amount = parse.floatOrPercent(amount);
      var c = this;
      var c2 = color(colorToBlend);
      return new Color([
        mix(c._value[0], c2._value[0], amount),
        mix(c._value[1], c2._value[1], amount),
        mix(c._value[2], c2._value[2], amount),
        mix(c._value[3], c2._value[3], amount),
      ]);
    },
    add: function (d) {
      var u = this._value;
      var v = color(d)._value;
      return new Color([
        u[0] + v[0] * v[3],
        u[1] + v[1] * v[3],
        u[2] + v[2] * v[3],
        u[3],
      ]);
    },
    inc: function (d) {
      var u = this._value;
      var v = color(d)._value;
      u[0] += v[0] * v[3];
      u[1] += v[1] * v[3];
      u[2] += v[2] * v[3];
      return this;
    },
    dec: function (d) {
      var u = this._value;
      var v = color(d)._value;
      u[0] -= v[0] * v[3];
      u[1] -= v[1] * v[3];
      u[2] -= v[2] * v[3];
      return this;
    },
    subtract: function (d) {
      var u = this._value;
      var v = color(d)._value;
      return new Color([
        u[0] - v[0] * v[3],
        u[1] - v[1] * v[3],
        u[2] - v[2] * v[3],
        u[3],
      ]);
    },
    multiply: function (d) {
      var u = this._value;
      var v = color(d)._value;
      return new Color([u[0] * v[0], u[1] * v[1], u[2] * v[2], u[3] * v[3]]);
    },
    scale: function (d) {
      var u = this._value;
      return new Color([u[0] * d, u[1] * d, u[2] * d, u[3]]);
    },
    xor: function (d) {
      var u = this.rgba8();
      var v = color(d).rgba8();
      return color("rgba8", u[0] ^ v[0], u[1] ^ v[1], u[2] ^ v[2], u[3]);
    },
    tint: function (amount) {
      return this.blend(fixed.white, amount);
    },
    shade: function (amount) {
      return this.blend(fixed.black, amount);
    },
    tone: function (amount) {
      return this.blend(fixed.gray, amount);
    },
    complement: function () {
      var hsva = this.hsva();
      hsva[0] = normalize360(hsva[0] + 180);
      return new Color(hsvaToRgba(hsva));
    },
    triad: function () {
      return [new Color(this._value), this.hue("+120"), this.hue("+240")];
    },
    hueSet: function () {
      var h = 0;
      var set = [];
      for (var s = 100; s >= 30; s -= 35)
        for (var v = 100; v >= 30; v -= 35)
          set.push(this.hue("+", h).saturation(s).value(v));
      return set;
    },
    hueRange: function (range, count) {
      var base = this.hue();
      var set = [];
      for (var i = 0; i < count; ++i) {
        var h = base + 2 * (i / (count - 1) - 0.5) * range;
        set.push(this.hue("=", h));
      }
      return set;
    },
    contrastWhiteBlack: function () {
      return this.value() < 50 ? color("white") : color("black");
    },
    contrastGray: function () {
      var hsva = this.hsva();
      var value = hsva[2] < 30 ? hsva[2] + 20 : hsva[2] - 20;
      return new Color(hsvaToRgba([hsva[0], 0, value, hsva[3]]));
    },
    contrastText: function () {
      var c = this._value;
      var b = 0.241 * c[0] * c[0] + 0.691 * c[1] * c[1] + 0.068 * c[2] * c[2];
      return b < 0.51 ? color("white") : color("black");
    },
    hex3: function () {
      function hex(d, max) {
        return Math.min(Math.round(f2b(d) / 16), 15).toString(16);
      }
      return (
        "#" + hex(this._value[0]) + hex(this._value[1]) + hex(this._value[2])
      );
    },
    hex6: function () {
      function hex(d, max) {
        var h = f2b(d).toString(16);
        return h.length < 2 ? "0" + h : h;
      }
      return (
        "#" + hex(this._value[0]) + hex(this._value[1]) + hex(this._value[2])
      );
    },
    rgb: function () {
      var v = this._value;
      return [f2b(v[0]), f2b(v[1]), f2b(v[2])];
    },
    rgba: function () {
      var v = this._value;
      return [f2b(v[0]), f2b(v[1]), f2b(v[2]), v[3]];
    },
    rgb8: function () {
      var v = this._value;
      return [f2b(v[0]), f2b(v[1]), f2b(v[2])];
    },
    rgba8: function () {
      var v = this._value;
      return [f2b(v[0]), f2b(v[1]), f2b(v[2]), this.alpha8()];
    },
    float3: function () {
      return [this._value[0], this._value[1], this._value[2]];
    },
    float4: function () {
      return [this._value[0], this._value[1], this._value[2], this._value[3]];
    },
  };
  methods["sub"] = methods["subtract"];
  methods["mul"] = methods["multiply"];
  for (var name in methods) Color.prototype[name] = methods[name];
  color.float3 = function (r, g, b) {
    return new Color([r, g, b, 1]);
  };
  color.float4 = function (r, g, b, a) {
    return new Color([r, g, b, a]);
  };
  color.version = "0.2.5";
  color.Color = Color;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = color;
  } else if (typeof window !== "undefined") {
    window.pusher = window.pusher || {};
    window.pusher.color = color;
  } else if (typeof self != "undefined") {
    self.pusher = self.pusher || {};
    self.pusher.color = color;
  }
})();
