var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);

// node_modules/@vitest/utils/node_modules/pretty-format/node_modules/ansi-styles/index.js
var require_ansi_styles = __commonJS((exports, module) => {
  var ANSI_BACKGROUND_OFFSET = 10;
  var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
  var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
  function assembleStyles() {
    const codes = new Map;
    const styles = {
      modifier: {
        reset: [0, 0],
        bold: [1, 22],
        dim: [2, 22],
        italic: [3, 23],
        underline: [4, 24],
        overline: [53, 55],
        inverse: [7, 27],
        hidden: [8, 28],
        strikethrough: [9, 29]
      },
      color: {
        black: [30, 39],
        red: [31, 39],
        green: [32, 39],
        yellow: [33, 39],
        blue: [34, 39],
        magenta: [35, 39],
        cyan: [36, 39],
        white: [37, 39],
        blackBright: [90, 39],
        redBright: [91, 39],
        greenBright: [92, 39],
        yellowBright: [93, 39],
        blueBright: [94, 39],
        magentaBright: [95, 39],
        cyanBright: [96, 39],
        whiteBright: [97, 39]
      },
      bgColor: {
        bgBlack: [40, 49],
        bgRed: [41, 49],
        bgGreen: [42, 49],
        bgYellow: [43, 49],
        bgBlue: [44, 49],
        bgMagenta: [45, 49],
        bgCyan: [46, 49],
        bgWhite: [47, 49],
        bgBlackBright: [100, 49],
        bgRedBright: [101, 49],
        bgGreenBright: [102, 49],
        bgYellowBright: [103, 49],
        bgBlueBright: [104, 49],
        bgMagentaBright: [105, 49],
        bgCyanBright: [106, 49],
        bgWhiteBright: [107, 49]
      }
    };
    styles.color.gray = styles.color.blackBright;
    styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
    styles.color.grey = styles.color.blackBright;
    styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;
    for (const [groupName, group] of Object.entries(styles)) {
      for (const [styleName, style] of Object.entries(group)) {
        styles[styleName] = {
          open: `\x1B[${style[0]}m`,
          close: `\x1B[${style[1]}m`
        };
        group[styleName] = styles[styleName];
        codes.set(style[0], style[1]);
      }
      Object.defineProperty(styles, groupName, {
        value: group,
        enumerable: false
      });
    }
    Object.defineProperty(styles, "codes", {
      value: codes,
      enumerable: false
    });
    styles.color.close = "\x1B[39m";
    styles.bgColor.close = "\x1B[49m";
    styles.color.ansi256 = wrapAnsi256();
    styles.color.ansi16m = wrapAnsi16m();
    styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
    styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
    Object.defineProperties(styles, {
      rgbToAnsi256: {
        value: (red, green, blue) => {
          if (red === green && green === blue) {
            if (red < 8) {
              return 16;
            }
            if (red > 248) {
              return 231;
            }
            return Math.round((red - 8) / 247 * 24) + 232;
          }
          return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
        },
        enumerable: false
      },
      hexToRgb: {
        value: (hex) => {
          const matches = /(?<colorString>[a-f\d]{6}|[a-f\d]{3})/i.exec(hex.toString(16));
          if (!matches) {
            return [0, 0, 0];
          }
          let { colorString } = matches.groups;
          if (colorString.length === 3) {
            colorString = colorString.split("").map((character) => character + character).join("");
          }
          const integer = Number.parseInt(colorString, 16);
          return [
            integer >> 16 & 255,
            integer >> 8 & 255,
            integer & 255
          ];
        },
        enumerable: false
      },
      hexToAnsi256: {
        value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
        enumerable: false
      }
    });
    return styles;
  }
  Object.defineProperty(module, "exports", {
    enumerable: true,
    get: assembleStyles
  });
});

// node_modules/@vitest/utils/node_modules/pretty-format/build/collections.js
var require_collections = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.printIteratorEntries = printIteratorEntries;
  exports.printIteratorValues = printIteratorValues;
  exports.printListItems = printListItems;
  exports.printObjectProperties = printObjectProperties;
  var getKeysOfEnumerableProperties = (object, compareKeys) => {
    const rawKeys = Object.keys(object);
    const keys = compareKeys !== null ? rawKeys.sort(compareKeys) : rawKeys;
    if (Object.getOwnPropertySymbols) {
      Object.getOwnPropertySymbols(object).forEach((symbol) => {
        if (Object.getOwnPropertyDescriptor(object, symbol).enumerable) {
          keys.push(symbol);
        }
      });
    }
    return keys;
  };
  function printIteratorEntries(iterator, config, indentation, depth, refs, printer, separator = ": ") {
    let result = "";
    let width = 0;
    let current = iterator.next();
    if (!current.done) {
      result += config.spacingOuter;
      const indentationNext = indentation + config.indent;
      while (!current.done) {
        result += indentationNext;
        if (width++ === config.maxWidth) {
          result += "…";
          break;
        }
        const name = printer(current.value[0], config, indentationNext, depth, refs);
        const value = printer(current.value[1], config, indentationNext, depth, refs);
        result += name + separator + value;
        current = iterator.next();
        if (!current.done) {
          result += `,${config.spacingInner}`;
        } else if (!config.min) {
          result += ",";
        }
      }
      result += config.spacingOuter + indentation;
    }
    return result;
  }
  function printIteratorValues(iterator, config, indentation, depth, refs, printer) {
    let result = "";
    let width = 0;
    let current = iterator.next();
    if (!current.done) {
      result += config.spacingOuter;
      const indentationNext = indentation + config.indent;
      while (!current.done) {
        result += indentationNext;
        if (width++ === config.maxWidth) {
          result += "…";
          break;
        }
        result += printer(current.value, config, indentationNext, depth, refs);
        current = iterator.next();
        if (!current.done) {
          result += `,${config.spacingInner}`;
        } else if (!config.min) {
          result += ",";
        }
      }
      result += config.spacingOuter + indentation;
    }
    return result;
  }
  function printListItems(list, config, indentation, depth, refs, printer) {
    let result = "";
    if (list.length) {
      result += config.spacingOuter;
      const indentationNext = indentation + config.indent;
      for (let i = 0;i < list.length; i++) {
        result += indentationNext;
        if (i === config.maxWidth) {
          result += "…";
          break;
        }
        if (i in list) {
          result += printer(list[i], config, indentationNext, depth, refs);
        }
        if (i < list.length - 1) {
          result += `,${config.spacingInner}`;
        } else if (!config.min) {
          result += ",";
        }
      }
      result += config.spacingOuter + indentation;
    }
    return result;
  }
  function printObjectProperties(val, config, indentation, depth, refs, printer) {
    let result = "";
    const keys = getKeysOfEnumerableProperties(val, config.compareKeys);
    if (keys.length) {
      result += config.spacingOuter;
      const indentationNext = indentation + config.indent;
      for (let i = 0;i < keys.length; i++) {
        const key = keys[i];
        const name = printer(key, config, indentationNext, depth, refs);
        const value = printer(val[key], config, indentationNext, depth, refs);
        result += `${indentationNext + name}: ${value}`;
        if (i < keys.length - 1) {
          result += `,${config.spacingInner}`;
        } else if (!config.min) {
          result += ",";
        }
      }
      result += config.spacingOuter + indentation;
    }
    return result;
  }
});

// node_modules/@vitest/utils/node_modules/pretty-format/build/plugins/AsymmetricMatcher.js
var require_AsymmetricMatcher = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.test = exports.serialize = exports.default = undefined;
  var _collections = require_collections();
  var Symbol2 = globalThis["jest-symbol-do-not-touch"] || globalThis.Symbol;
  var asymmetricMatcher = typeof Symbol2 === "function" && Symbol2.for ? Symbol2.for("jest.asymmetricMatcher") : 1267621;
  var SPACE = " ";
  var serialize = (val, config, indentation, depth, refs, printer) => {
    const stringedValue = val.toString();
    if (stringedValue === "ArrayContaining" || stringedValue === "ArrayNotContaining") {
      if (++depth > config.maxDepth) {
        return `[${stringedValue}]`;
      }
      return `${stringedValue + SPACE}[${(0, _collections.printListItems)(val.sample, config, indentation, depth, refs, printer)}]`;
    }
    if (stringedValue === "ObjectContaining" || stringedValue === "ObjectNotContaining") {
      if (++depth > config.maxDepth) {
        return `[${stringedValue}]`;
      }
      return `${stringedValue + SPACE}{${(0, _collections.printObjectProperties)(val.sample, config, indentation, depth, refs, printer)}}`;
    }
    if (stringedValue === "StringMatching" || stringedValue === "StringNotMatching") {
      return stringedValue + SPACE + printer(val.sample, config, indentation, depth, refs);
    }
    if (stringedValue === "StringContaining" || stringedValue === "StringNotContaining") {
      return stringedValue + SPACE + printer(val.sample, config, indentation, depth, refs);
    }
    if (typeof val.toAsymmetricMatcher !== "function") {
      throw new Error(`Asymmetric matcher ${val.constructor.name} does not implement toAsymmetricMatcher()`);
    }
    return val.toAsymmetricMatcher();
  };
  exports.serialize = serialize;
  var test = (val) => val && val.$$typeof === asymmetricMatcher;
  exports.test = test;
  var plugin = {
    serialize,
    test
  };
  var _default = plugin;
  exports.default = _default;
});

// node_modules/@vitest/utils/node_modules/pretty-format/build/plugins/DOMCollection.js
var require_DOMCollection = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.test = exports.serialize = exports.default = undefined;
  var _collections = require_collections();
  var SPACE = " ";
  var OBJECT_NAMES = ["DOMStringMap", "NamedNodeMap"];
  var ARRAY_REGEXP = /^(HTML\w*Collection|NodeList)$/;
  var testName = (name) => OBJECT_NAMES.indexOf(name) !== -1 || ARRAY_REGEXP.test(name);
  var test = (val) => val && val.constructor && !!val.constructor.name && testName(val.constructor.name);
  exports.test = test;
  var isNamedNodeMap = (collection) => collection.constructor.name === "NamedNodeMap";
  var serialize = (collection, config, indentation, depth, refs, printer) => {
    const name = collection.constructor.name;
    if (++depth > config.maxDepth) {
      return `[${name}]`;
    }
    return (config.min ? "" : name + SPACE) + (OBJECT_NAMES.indexOf(name) !== -1 ? `{${(0, _collections.printObjectProperties)(isNamedNodeMap(collection) ? Array.from(collection).reduce((props, attribute) => {
      props[attribute.name] = attribute.value;
      return props;
    }, {}) : {
      ...collection
    }, config, indentation, depth, refs, printer)}}` : `[${(0, _collections.printListItems)(Array.from(collection), config, indentation, depth, refs, printer)}]`);
  };
  exports.serialize = serialize;
  var plugin = {
    serialize,
    test
  };
  var _default = plugin;
  exports.default = _default;
});

// node_modules/@vitest/utils/node_modules/pretty-format/build/plugins/lib/escapeHTML.js
var require_escapeHTML = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = escapeHTML;
  function escapeHTML(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
});

// node_modules/@vitest/utils/node_modules/pretty-format/build/plugins/lib/markup.js
var require_markup = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.printText = exports.printProps = exports.printElementAsLeaf = exports.printElement = exports.printComment = exports.printChildren = undefined;
  var _escapeHTML = _interopRequireDefault(require_escapeHTML());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var printProps = (keys, props, config, indentation, depth, refs, printer) => {
    const indentationNext = indentation + config.indent;
    const colors = config.colors;
    return keys.map((key) => {
      const value = props[key];
      let printed = printer(value, config, indentationNext, depth, refs);
      if (typeof value !== "string") {
        if (printed.indexOf(`
`) !== -1) {
          printed = config.spacingOuter + indentationNext + printed + config.spacingOuter + indentation;
        }
        printed = `{${printed}}`;
      }
      return `${config.spacingInner + indentation + colors.prop.open + key + colors.prop.close}=${colors.value.open}${printed}${colors.value.close}`;
    }).join("");
  };
  exports.printProps = printProps;
  var printChildren = (children, config, indentation, depth, refs, printer) => children.map((child) => config.spacingOuter + indentation + (typeof child === "string" ? printText(child, config) : printer(child, config, indentation, depth, refs))).join("");
  exports.printChildren = printChildren;
  var printText = (text, config) => {
    const contentColor = config.colors.content;
    return contentColor.open + (0, _escapeHTML.default)(text) + contentColor.close;
  };
  exports.printText = printText;
  var printComment = (comment, config) => {
    const commentColor = config.colors.comment;
    return `${commentColor.open}<!--${(0, _escapeHTML.default)(comment)}-->${commentColor.close}`;
  };
  exports.printComment = printComment;
  var printElement = (type, printedProps, printedChildren, config, indentation) => {
    const tagColor = config.colors.tag;
    return `${tagColor.open}<${type}${printedProps && tagColor.close + printedProps + config.spacingOuter + indentation + tagColor.open}${printedChildren ? `>${tagColor.close}${printedChildren}${config.spacingOuter}${indentation}${tagColor.open}</${type}` : `${printedProps && !config.min ? "" : " "}/`}>${tagColor.close}`;
  };
  exports.printElement = printElement;
  var printElementAsLeaf = (type, config) => {
    const tagColor = config.colors.tag;
    return `${tagColor.open}<${type}${tagColor.close} …${tagColor.open} />${tagColor.close}`;
  };
  exports.printElementAsLeaf = printElementAsLeaf;
});

// node_modules/@vitest/utils/node_modules/pretty-format/build/plugins/DOMElement.js
var require_DOMElement = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.test = exports.serialize = exports.default = undefined;
  var _markup = require_markup();
  var ELEMENT_NODE = 1;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  var FRAGMENT_NODE = 11;
  var ELEMENT_REGEXP = /^((HTML|SVG)\w*)?Element$/;
  var testHasAttribute = (val) => {
    try {
      return typeof val.hasAttribute === "function" && val.hasAttribute("is");
    } catch {
      return false;
    }
  };
  var testNode = (val) => {
    const constructorName = val.constructor.name;
    const { nodeType, tagName } = val;
    const isCustomElement = typeof tagName === "string" && tagName.includes("-") || testHasAttribute(val);
    return nodeType === ELEMENT_NODE && (ELEMENT_REGEXP.test(constructorName) || isCustomElement) || nodeType === TEXT_NODE && constructorName === "Text" || nodeType === COMMENT_NODE && constructorName === "Comment" || nodeType === FRAGMENT_NODE && constructorName === "DocumentFragment";
  };
  var test = (val) => val?.constructor?.name && testNode(val);
  exports.test = test;
  function nodeIsText(node) {
    return node.nodeType === TEXT_NODE;
  }
  function nodeIsComment(node) {
    return node.nodeType === COMMENT_NODE;
  }
  function nodeIsFragment(node) {
    return node.nodeType === FRAGMENT_NODE;
  }
  var serialize = (node, config, indentation, depth, refs, printer) => {
    if (nodeIsText(node)) {
      return (0, _markup.printText)(node.data, config);
    }
    if (nodeIsComment(node)) {
      return (0, _markup.printComment)(node.data, config);
    }
    const type = nodeIsFragment(node) ? "DocumentFragment" : node.tagName.toLowerCase();
    if (++depth > config.maxDepth) {
      return (0, _markup.printElementAsLeaf)(type, config);
    }
    return (0, _markup.printElement)(type, (0, _markup.printProps)(nodeIsFragment(node) ? [] : Array.from(node.attributes, (attr) => attr.name).sort(), nodeIsFragment(node) ? {} : Array.from(node.attributes).reduce((props, attribute) => {
      props[attribute.name] = attribute.value;
      return props;
    }, {}), config, indentation + config.indent, depth, refs, printer), (0, _markup.printChildren)(Array.prototype.slice.call(node.childNodes || node.children), config, indentation + config.indent, depth, refs, printer), config, indentation);
  };
  exports.serialize = serialize;
  var plugin = {
    serialize,
    test
  };
  var _default = plugin;
  exports.default = _default;
});

// node_modules/@vitest/utils/node_modules/pretty-format/build/plugins/Immutable.js
var require_Immutable = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.test = exports.serialize = exports.default = undefined;
  var _collections = require_collections();
  var IS_ITERABLE_SENTINEL = "@@__IMMUTABLE_ITERABLE__@@";
  var IS_LIST_SENTINEL = "@@__IMMUTABLE_LIST__@@";
  var IS_KEYED_SENTINEL = "@@__IMMUTABLE_KEYED__@@";
  var IS_MAP_SENTINEL = "@@__IMMUTABLE_MAP__@@";
  var IS_ORDERED_SENTINEL = "@@__IMMUTABLE_ORDERED__@@";
  var IS_RECORD_SENTINEL = "@@__IMMUTABLE_RECORD__@@";
  var IS_SEQ_SENTINEL = "@@__IMMUTABLE_SEQ__@@";
  var IS_SET_SENTINEL = "@@__IMMUTABLE_SET__@@";
  var IS_STACK_SENTINEL = "@@__IMMUTABLE_STACK__@@";
  var getImmutableName = (name) => `Immutable.${name}`;
  var printAsLeaf = (name) => `[${name}]`;
  var SPACE = " ";
  var LAZY = "…";
  var printImmutableEntries = (val, config, indentation, depth, refs, printer, type) => ++depth > config.maxDepth ? printAsLeaf(getImmutableName(type)) : `${getImmutableName(type) + SPACE}{${(0, _collections.printIteratorEntries)(val.entries(), config, indentation, depth, refs, printer)}}`;
  function getRecordEntries(val) {
    let i = 0;
    return {
      next() {
        if (i < val._keys.length) {
          const key = val._keys[i++];
          return {
            done: false,
            value: [key, val.get(key)]
          };
        }
        return {
          done: true,
          value: undefined
        };
      }
    };
  }
  var printImmutableRecord = (val, config, indentation, depth, refs, printer) => {
    const name = getImmutableName(val._name || "Record");
    return ++depth > config.maxDepth ? printAsLeaf(name) : `${name + SPACE}{${(0, _collections.printIteratorEntries)(getRecordEntries(val), config, indentation, depth, refs, printer)}}`;
  };
  var printImmutableSeq = (val, config, indentation, depth, refs, printer) => {
    const name = getImmutableName("Seq");
    if (++depth > config.maxDepth) {
      return printAsLeaf(name);
    }
    if (val[IS_KEYED_SENTINEL]) {
      return `${name + SPACE}{${val._iter || val._object ? (0, _collections.printIteratorEntries)(val.entries(), config, indentation, depth, refs, printer) : LAZY}}`;
    }
    return `${name + SPACE}[${val._iter || val._array || val._collection || val._iterable ? (0, _collections.printIteratorValues)(val.values(), config, indentation, depth, refs, printer) : LAZY}]`;
  };
  var printImmutableValues = (val, config, indentation, depth, refs, printer, type) => ++depth > config.maxDepth ? printAsLeaf(getImmutableName(type)) : `${getImmutableName(type) + SPACE}[${(0, _collections.printIteratorValues)(val.values(), config, indentation, depth, refs, printer)}]`;
  var serialize = (val, config, indentation, depth, refs, printer) => {
    if (val[IS_MAP_SENTINEL]) {
      return printImmutableEntries(val, config, indentation, depth, refs, printer, val[IS_ORDERED_SENTINEL] ? "OrderedMap" : "Map");
    }
    if (val[IS_LIST_SENTINEL]) {
      return printImmutableValues(val, config, indentation, depth, refs, printer, "List");
    }
    if (val[IS_SET_SENTINEL]) {
      return printImmutableValues(val, config, indentation, depth, refs, printer, val[IS_ORDERED_SENTINEL] ? "OrderedSet" : "Set");
    }
    if (val[IS_STACK_SENTINEL]) {
      return printImmutableValues(val, config, indentation, depth, refs, printer, "Stack");
    }
    if (val[IS_SEQ_SENTINEL]) {
      return printImmutableSeq(val, config, indentation, depth, refs, printer);
    }
    return printImmutableRecord(val, config, indentation, depth, refs, printer);
  };
  exports.serialize = serialize;
  var test = (val) => val && (val[IS_ITERABLE_SENTINEL] === true || val[IS_RECORD_SENTINEL] === true);
  exports.test = test;
  var plugin = {
    serialize,
    test
  };
  var _default = plugin;
  exports.default = _default;
});

// node_modules/@vitest/utils/node_modules/pretty-format/node_modules/react-is/cjs/react-is.development.js
var require_react_is_development = __commonJS((exports) => {
  if (true) {
    (function() {
      var REACT_ELEMENT_TYPE = Symbol.for("react.element");
      var REACT_PORTAL_TYPE = Symbol.for("react.portal");
      var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
      var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
      var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
      var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
      var REACT_CONTEXT_TYPE = Symbol.for("react.context");
      var REACT_SERVER_CONTEXT_TYPE = Symbol.for("react.server_context");
      var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
      var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
      var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
      var REACT_MEMO_TYPE = Symbol.for("react.memo");
      var REACT_LAZY_TYPE = Symbol.for("react.lazy");
      var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
      var enableScopeAPI = false;
      var enableCacheElement = false;
      var enableTransitionTracing = false;
      var enableLegacyHidden = false;
      var enableDebugTracing = false;
      var REACT_MODULE_REFERENCE;
      {
        REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
      }
      function isValidElementType(type) {
        if (typeof type === "string" || typeof type === "function") {
          return true;
        }
        if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
          return true;
        }
        if (typeof type === "object" && type !== null) {
          if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== undefined) {
            return true;
          }
        }
        return false;
      }
      function typeOf(object) {
        if (typeof object === "object" && object !== null) {
          var $$typeof = object.$$typeof;
          switch ($$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = object.type;
              switch (type) {
                case REACT_FRAGMENT_TYPE:
                case REACT_PROFILER_TYPE:
                case REACT_STRICT_MODE_TYPE:
                case REACT_SUSPENSE_TYPE:
                case REACT_SUSPENSE_LIST_TYPE:
                  return type;
                default:
                  var $$typeofType = type && type.$$typeof;
                  switch ($$typeofType) {
                    case REACT_SERVER_CONTEXT_TYPE:
                    case REACT_CONTEXT_TYPE:
                    case REACT_FORWARD_REF_TYPE:
                    case REACT_LAZY_TYPE:
                    case REACT_MEMO_TYPE:
                    case REACT_PROVIDER_TYPE:
                      return $$typeofType;
                    default:
                      return $$typeof;
                  }
              }
            case REACT_PORTAL_TYPE:
              return $$typeof;
          }
        }
        return;
      }
      var ContextConsumer = REACT_CONTEXT_TYPE;
      var ContextProvider = REACT_PROVIDER_TYPE;
      var Element2 = REACT_ELEMENT_TYPE;
      var ForwardRef = REACT_FORWARD_REF_TYPE;
      var Fragment = REACT_FRAGMENT_TYPE;
      var Lazy = REACT_LAZY_TYPE;
      var Memo = REACT_MEMO_TYPE;
      var Portal = REACT_PORTAL_TYPE;
      var Profiler = REACT_PROFILER_TYPE;
      var StrictMode = REACT_STRICT_MODE_TYPE;
      var Suspense = REACT_SUSPENSE_TYPE;
      var SuspenseList = REACT_SUSPENSE_LIST_TYPE;
      var hasWarnedAboutDeprecatedIsAsyncMode = false;
      var hasWarnedAboutDeprecatedIsConcurrentMode = false;
      function isAsyncMode(object) {
        {
          if (!hasWarnedAboutDeprecatedIsAsyncMode) {
            hasWarnedAboutDeprecatedIsAsyncMode = true;
            console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, " + "and will be removed in React 18+.");
          }
        }
        return false;
      }
      function isConcurrentMode(object) {
        {
          if (!hasWarnedAboutDeprecatedIsConcurrentMode) {
            hasWarnedAboutDeprecatedIsConcurrentMode = true;
            console["warn"]("The ReactIs.isConcurrentMode() alias has been deprecated, " + "and will be removed in React 18+.");
          }
        }
        return false;
      }
      function isContextConsumer(object) {
        return typeOf(object) === REACT_CONTEXT_TYPE;
      }
      function isContextProvider(object) {
        return typeOf(object) === REACT_PROVIDER_TYPE;
      }
      function isElement(object) {
        return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function isForwardRef(object) {
        return typeOf(object) === REACT_FORWARD_REF_TYPE;
      }
      function isFragment(object) {
        return typeOf(object) === REACT_FRAGMENT_TYPE;
      }
      function isLazy(object) {
        return typeOf(object) === REACT_LAZY_TYPE;
      }
      function isMemo(object) {
        return typeOf(object) === REACT_MEMO_TYPE;
      }
      function isPortal(object) {
        return typeOf(object) === REACT_PORTAL_TYPE;
      }
      function isProfiler(object) {
        return typeOf(object) === REACT_PROFILER_TYPE;
      }
      function isStrictMode(object) {
        return typeOf(object) === REACT_STRICT_MODE_TYPE;
      }
      function isSuspense(object) {
        return typeOf(object) === REACT_SUSPENSE_TYPE;
      }
      function isSuspenseList(object) {
        return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;
      }
      exports.ContextConsumer = ContextConsumer;
      exports.ContextProvider = ContextProvider;
      exports.Element = Element2;
      exports.ForwardRef = ForwardRef;
      exports.Fragment = Fragment;
      exports.Lazy = Lazy;
      exports.Memo = Memo;
      exports.Portal = Portal;
      exports.Profiler = Profiler;
      exports.StrictMode = StrictMode;
      exports.Suspense = Suspense;
      exports.SuspenseList = SuspenseList;
      exports.isAsyncMode = isAsyncMode;
      exports.isConcurrentMode = isConcurrentMode;
      exports.isContextConsumer = isContextConsumer;
      exports.isContextProvider = isContextProvider;
      exports.isElement = isElement;
      exports.isForwardRef = isForwardRef;
      exports.isFragment = isFragment;
      exports.isLazy = isLazy;
      exports.isMemo = isMemo;
      exports.isPortal = isPortal;
      exports.isProfiler = isProfiler;
      exports.isStrictMode = isStrictMode;
      exports.isSuspense = isSuspense;
      exports.isSuspenseList = isSuspenseList;
      exports.isValidElementType = isValidElementType;
      exports.typeOf = typeOf;
    })();
  }
});

// node_modules/@vitest/utils/node_modules/pretty-format/node_modules/react-is/index.js
var require_react_is = __commonJS((exports, module) => {
  if (false) {} else {
    module.exports = require_react_is_development();
  }
});

// node_modules/@vitest/utils/node_modules/pretty-format/build/plugins/ReactElement.js
var require_ReactElement = __commonJS((exports) => {
  var react_is = __toESM(require_react_is(), 1);
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.test = exports.serialize = exports.default = undefined;
  var ReactIs = _interopRequireWildcard(react_is);
  var _markup = require_markup();
  function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function")
      return null;
    var cacheBabelInterop = new WeakMap;
    var cacheNodeInterop = new WeakMap;
    return (_getRequireWildcardCache = function(nodeInterop2) {
      return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
  }
  function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
      return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
      return { default: obj };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj) {
      if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    newObj.default = obj;
    if (cache) {
      cache.set(obj, newObj);
    }
    return newObj;
  }
  var getChildren = (arg, children = []) => {
    if (Array.isArray(arg)) {
      arg.forEach((item) => {
        getChildren(item, children);
      });
    } else if (arg != null && arg !== false) {
      children.push(arg);
    }
    return children;
  };
  var getType2 = (element) => {
    const type = element.type;
    if (typeof type === "string") {
      return type;
    }
    if (typeof type === "function") {
      return type.displayName || type.name || "Unknown";
    }
    if (ReactIs.isFragment(element)) {
      return "React.Fragment";
    }
    if (ReactIs.isSuspense(element)) {
      return "React.Suspense";
    }
    if (typeof type === "object" && type !== null) {
      if (ReactIs.isContextProvider(element)) {
        return "Context.Provider";
      }
      if (ReactIs.isContextConsumer(element)) {
        return "Context.Consumer";
      }
      if (ReactIs.isForwardRef(element)) {
        if (type.displayName) {
          return type.displayName;
        }
        const functionName = type.render.displayName || type.render.name || "";
        return functionName !== "" ? `ForwardRef(${functionName})` : "ForwardRef";
      }
      if (ReactIs.isMemo(element)) {
        const functionName = type.displayName || type.type.displayName || type.type.name || "";
        return functionName !== "" ? `Memo(${functionName})` : "Memo";
      }
    }
    return "UNDEFINED";
  };
  var getPropKeys = (element) => {
    const { props } = element;
    return Object.keys(props).filter((key) => key !== "children" && props[key] !== undefined).sort();
  };
  var serialize = (element, config, indentation, depth, refs, printer) => ++depth > config.maxDepth ? (0, _markup.printElementAsLeaf)(getType2(element), config) : (0, _markup.printElement)(getType2(element), (0, _markup.printProps)(getPropKeys(element), element.props, config, indentation + config.indent, depth, refs, printer), (0, _markup.printChildren)(getChildren(element.props.children), config, indentation + config.indent, depth, refs, printer), config, indentation);
  exports.serialize = serialize;
  var test = (val) => val != null && ReactIs.isElement(val);
  exports.test = test;
  var plugin = {
    serialize,
    test
  };
  var _default = plugin;
  exports.default = _default;
});

// node_modules/@vitest/utils/node_modules/pretty-format/build/plugins/ReactTestComponent.js
var require_ReactTestComponent = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.test = exports.serialize = exports.default = undefined;
  var _markup = require_markup();
  var Symbol2 = globalThis["jest-symbol-do-not-touch"] || globalThis.Symbol;
  var testSymbol = typeof Symbol2 === "function" && Symbol2.for ? Symbol2.for("react.test.json") : 245830487;
  var getPropKeys = (object) => {
    const { props } = object;
    return props ? Object.keys(props).filter((key) => props[key] !== undefined).sort() : [];
  };
  var serialize = (object, config, indentation, depth, refs, printer) => ++depth > config.maxDepth ? (0, _markup.printElementAsLeaf)(object.type, config) : (0, _markup.printElement)(object.type, object.props ? (0, _markup.printProps)(getPropKeys(object), object.props, config, indentation + config.indent, depth, refs, printer) : "", object.children ? (0, _markup.printChildren)(object.children, config, indentation + config.indent, depth, refs, printer) : "", config, indentation);
  exports.serialize = serialize;
  var test = (val) => val && val.$$typeof === testSymbol;
  exports.test = test;
  var plugin = {
    serialize,
    test
  };
  var _default = plugin;
  exports.default = _default;
});

// node_modules/@vitest/utils/node_modules/pretty-format/build/index.js
var require_build = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = exports.DEFAULT_OPTIONS = undefined;
  exports.format = format;
  exports.plugins = undefined;
  var _ansiStyles = _interopRequireDefault(require_ansi_styles());
  var _collections = require_collections();
  var _AsymmetricMatcher = _interopRequireDefault(require_AsymmetricMatcher());
  var _DOMCollection = _interopRequireDefault(require_DOMCollection());
  var _DOMElement = _interopRequireDefault(require_DOMElement());
  var _Immutable = _interopRequireDefault(require_Immutable());
  var _ReactElement = _interopRequireDefault(require_ReactElement());
  var _ReactTestComponent = _interopRequireDefault(require_ReactTestComponent());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var toString = Object.prototype.toString;
  var toISOString = Date.prototype.toISOString;
  var errorToString = Error.prototype.toString;
  var regExpToString = RegExp.prototype.toString;
  var getConstructorName = (val) => typeof val.constructor === "function" && val.constructor.name || "Object";
  var isWindow = (val) => typeof window !== "undefined" && val === window;
  var SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
  var NEWLINE_REGEXP = /\n/gi;

  class PrettyFormatPluginError extends Error {
    constructor(message, stack) {
      super(message);
      this.stack = stack;
      this.name = this.constructor.name;
    }
  }
  function isToStringedArrayType(toStringed) {
    return toStringed === "[object Array]" || toStringed === "[object ArrayBuffer]" || toStringed === "[object DataView]" || toStringed === "[object Float32Array]" || toStringed === "[object Float64Array]" || toStringed === "[object Int8Array]" || toStringed === "[object Int16Array]" || toStringed === "[object Int32Array]" || toStringed === "[object Uint8Array]" || toStringed === "[object Uint8ClampedArray]" || toStringed === "[object Uint16Array]" || toStringed === "[object Uint32Array]";
  }
  function printNumber(val) {
    return Object.is(val, -0) ? "-0" : String(val);
  }
  function printBigInt(val) {
    return String(`${val}n`);
  }
  function printFunction(val, printFunctionName) {
    if (!printFunctionName) {
      return "[Function]";
    }
    return `[Function ${val.name || "anonymous"}]`;
  }
  function printSymbol(val) {
    return String(val).replace(SYMBOL_REGEXP, "Symbol($1)");
  }
  function printError(val) {
    return `[${errorToString.call(val)}]`;
  }
  function printBasicValue(val, printFunctionName, escapeRegex, escapeString) {
    if (val === true || val === false) {
      return `${val}`;
    }
    if (val === undefined) {
      return "undefined";
    }
    if (val === null) {
      return "null";
    }
    const typeOf = typeof val;
    if (typeOf === "number") {
      return printNumber(val);
    }
    if (typeOf === "bigint") {
      return printBigInt(val);
    }
    if (typeOf === "string") {
      if (escapeString) {
        return `"${val.replace(/"|\\/g, "\\$&")}"`;
      }
      return `"${val}"`;
    }
    if (typeOf === "function") {
      return printFunction(val, printFunctionName);
    }
    if (typeOf === "symbol") {
      return printSymbol(val);
    }
    const toStringed = toString.call(val);
    if (toStringed === "[object WeakMap]") {
      return "WeakMap {}";
    }
    if (toStringed === "[object WeakSet]") {
      return "WeakSet {}";
    }
    if (toStringed === "[object Function]" || toStringed === "[object GeneratorFunction]") {
      return printFunction(val, printFunctionName);
    }
    if (toStringed === "[object Symbol]") {
      return printSymbol(val);
    }
    if (toStringed === "[object Date]") {
      return isNaN(+val) ? "Date { NaN }" : toISOString.call(val);
    }
    if (toStringed === "[object Error]") {
      return printError(val);
    }
    if (toStringed === "[object RegExp]") {
      if (escapeRegex) {
        return regExpToString.call(val).replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
      }
      return regExpToString.call(val);
    }
    if (val instanceof Error) {
      return printError(val);
    }
    return null;
  }
  function printComplexValue(val, config, indentation, depth, refs, hasCalledToJSON) {
    if (refs.indexOf(val) !== -1) {
      return "[Circular]";
    }
    refs = refs.slice();
    refs.push(val);
    const hitMaxDepth = ++depth > config.maxDepth;
    const min = config.min;
    if (config.callToJSON && !hitMaxDepth && val.toJSON && typeof val.toJSON === "function" && !hasCalledToJSON) {
      return printer(val.toJSON(), config, indentation, depth, refs, true);
    }
    const toStringed = toString.call(val);
    if (toStringed === "[object Arguments]") {
      return hitMaxDepth ? "[Arguments]" : `${min ? "" : "Arguments "}[${(0, _collections.printListItems)(val, config, indentation, depth, refs, printer)}]`;
    }
    if (isToStringedArrayType(toStringed)) {
      return hitMaxDepth ? `[${val.constructor.name}]` : `${min ? "" : !config.printBasicPrototype && val.constructor.name === "Array" ? "" : `${val.constructor.name} `}[${(0, _collections.printListItems)(val, config, indentation, depth, refs, printer)}]`;
    }
    if (toStringed === "[object Map]") {
      return hitMaxDepth ? "[Map]" : `Map {${(0, _collections.printIteratorEntries)(val.entries(), config, indentation, depth, refs, printer, " => ")}}`;
    }
    if (toStringed === "[object Set]") {
      return hitMaxDepth ? "[Set]" : `Set {${(0, _collections.printIteratorValues)(val.values(), config, indentation, depth, refs, printer)}}`;
    }
    return hitMaxDepth || isWindow(val) ? `[${getConstructorName(val)}]` : `${min ? "" : !config.printBasicPrototype && getConstructorName(val) === "Object" ? "" : `${getConstructorName(val)} `}{${(0, _collections.printObjectProperties)(val, config, indentation, depth, refs, printer)}}`;
  }
  function isNewPlugin(plugin) {
    return plugin.serialize != null;
  }
  function printPlugin(plugin, val, config, indentation, depth, refs) {
    let printed;
    try {
      printed = isNewPlugin(plugin) ? plugin.serialize(val, config, indentation, depth, refs, printer) : plugin.print(val, (valChild) => printer(valChild, config, indentation, depth, refs), (str) => {
        const indentationNext = indentation + config.indent;
        return indentationNext + str.replace(NEWLINE_REGEXP, `
${indentationNext}`);
      }, {
        edgeSpacing: config.spacingOuter,
        min: config.min,
        spacing: config.spacingInner
      }, config.colors);
    } catch (error) {
      throw new PrettyFormatPluginError(error.message, error.stack);
    }
    if (typeof printed !== "string") {
      throw new Error(`pretty-format: Plugin must return type "string" but instead returned "${typeof printed}".`);
    }
    return printed;
  }
  function findPlugin(plugins2, val) {
    for (let p = 0;p < plugins2.length; p++) {
      try {
        if (plugins2[p].test(val)) {
          return plugins2[p];
        }
      } catch (error) {
        throw new PrettyFormatPluginError(error.message, error.stack);
      }
    }
    return null;
  }
  function printer(val, config, indentation, depth, refs, hasCalledToJSON) {
    const plugin = findPlugin(config.plugins, val);
    if (plugin !== null) {
      return printPlugin(plugin, val, config, indentation, depth, refs);
    }
    const basicResult = printBasicValue(val, config.printFunctionName, config.escapeRegex, config.escapeString);
    if (basicResult !== null) {
      return basicResult;
    }
    return printComplexValue(val, config, indentation, depth, refs, hasCalledToJSON);
  }
  var DEFAULT_THEME = {
    comment: "gray",
    content: "reset",
    prop: "yellow",
    tag: "cyan",
    value: "green"
  };
  var DEFAULT_THEME_KEYS = Object.keys(DEFAULT_THEME);
  var toOptionsSubtype = (options) => options;
  var DEFAULT_OPTIONS = toOptionsSubtype({
    callToJSON: true,
    compareKeys: undefined,
    escapeRegex: false,
    escapeString: true,
    highlight: false,
    indent: 2,
    maxDepth: Infinity,
    maxWidth: Infinity,
    min: false,
    plugins: [],
    printBasicPrototype: true,
    printFunctionName: true,
    theme: DEFAULT_THEME
  });
  exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
  function validateOptions(options) {
    Object.keys(options).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(DEFAULT_OPTIONS, key)) {
        throw new Error(`pretty-format: Unknown option "${key}".`);
      }
    });
    if (options.min && options.indent !== undefined && options.indent !== 0) {
      throw new Error('pretty-format: Options "min" and "indent" cannot be used together.');
    }
    if (options.theme !== undefined) {
      if (options.theme === null) {
        throw new Error('pretty-format: Option "theme" must not be null.');
      }
      if (typeof options.theme !== "object") {
        throw new Error(`pretty-format: Option "theme" must be of type "object" but instead received "${typeof options.theme}".`);
      }
    }
  }
  var getColorsHighlight = (options) => DEFAULT_THEME_KEYS.reduce((colors, key) => {
    const value = options.theme && options.theme[key] !== undefined ? options.theme[key] : DEFAULT_THEME[key];
    const color = value && _ansiStyles.default[value];
    if (color && typeof color.close === "string" && typeof color.open === "string") {
      colors[key] = color;
    } else {
      throw new Error(`pretty-format: Option "theme" has a key "${key}" whose value "${value}" is undefined in ansi-styles.`);
    }
    return colors;
  }, Object.create(null));
  var getColorsEmpty = () => DEFAULT_THEME_KEYS.reduce((colors, key) => {
    colors[key] = {
      close: "",
      open: ""
    };
    return colors;
  }, Object.create(null));
  var getPrintFunctionName = (options) => options?.printFunctionName ?? DEFAULT_OPTIONS.printFunctionName;
  var getEscapeRegex = (options) => options?.escapeRegex ?? DEFAULT_OPTIONS.escapeRegex;
  var getEscapeString = (options) => options?.escapeString ?? DEFAULT_OPTIONS.escapeString;
  var getConfig = (options) => ({
    callToJSON: options?.callToJSON ?? DEFAULT_OPTIONS.callToJSON,
    colors: options?.highlight ? getColorsHighlight(options) : getColorsEmpty(),
    compareKeys: typeof options?.compareKeys === "function" || options?.compareKeys === null ? options.compareKeys : DEFAULT_OPTIONS.compareKeys,
    escapeRegex: getEscapeRegex(options),
    escapeString: getEscapeString(options),
    indent: options?.min ? "" : createIndent(options?.indent ?? DEFAULT_OPTIONS.indent),
    maxDepth: options?.maxDepth ?? DEFAULT_OPTIONS.maxDepth,
    maxWidth: options?.maxWidth ?? DEFAULT_OPTIONS.maxWidth,
    min: options?.min ?? DEFAULT_OPTIONS.min,
    plugins: options?.plugins ?? DEFAULT_OPTIONS.plugins,
    printBasicPrototype: options?.printBasicPrototype ?? true,
    printFunctionName: getPrintFunctionName(options),
    spacingInner: options?.min ? " " : `
`,
    spacingOuter: options?.min ? "" : `
`
  });
  function createIndent(indent) {
    return new Array(indent + 1).join(" ");
  }
  function format(val, options) {
    if (options) {
      validateOptions(options);
      if (options.plugins) {
        const plugin = findPlugin(options.plugins, val);
        if (plugin !== null) {
          return printPlugin(plugin, val, getConfig(options), "", 0, []);
        }
      }
    }
    const basicResult = printBasicValue(val, getPrintFunctionName(options), getEscapeRegex(options), getEscapeString(options));
    if (basicResult !== null) {
      return basicResult;
    }
    return printComplexValue(val, getConfig(options), "", 0, []);
  }
  var plugins = {
    AsymmetricMatcher: _AsymmetricMatcher.default,
    DOMCollection: _DOMCollection.default,
    DOMElement: _DOMElement.default,
    Immutable: _Immutable.default,
    ReactElement: _ReactElement.default,
    ReactTestComponent: _ReactTestComponent.default
  };
  exports.plugins = plugins;
  var _default = format;
  exports.default = _default;
});

// node:util
var exports_util = {};
__export(exports_util, {
  types: () => types,
  promisify: () => promisify,
  log: () => log,
  isUndefined: () => isUndefined,
  isSymbol: () => isSymbol,
  isString: () => isString,
  isRegExp: () => isRegExp,
  isPrimitive: () => isPrimitive,
  isObject: () => isObject2,
  isNumber: () => isNumber,
  isNullOrUndefined: () => isNullOrUndefined,
  isNull: () => isNull,
  isFunction: () => isFunction,
  isError: () => isError,
  isDate: () => isDate,
  isBuffer: () => isBuffer,
  isBoolean: () => isBoolean,
  isArray: () => isArray,
  inspect: () => inspect,
  inherits: () => inherits,
  format: () => format,
  deprecate: () => deprecate,
  default: () => util_default,
  debuglog: () => debuglog,
  callbackifyOnRejected: () => callbackifyOnRejected,
  callbackify: () => callbackify,
  _extend: () => _extend,
  TextEncoder: () => TextEncoder,
  TextDecoder: () => TextDecoder2
});
function format(f, ...args) {
  if (!isString(f)) {
    var objects = [f];
    for (var i = 0;i < args.length; i++)
      objects.push(inspect(args[i]));
    return objects.join(" ");
  }
  var i = 0, len = args.length, str = String(f).replace(formatRegExp, function(x2) {
    if (x2 === "%%")
      return "%";
    if (i >= len)
      return x2;
    switch (x2) {
      case "%s":
        return String(args[i++]);
      case "%d":
        return Number(args[i++]);
      case "%j":
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return "[Circular]";
        }
      default:
        return x2;
    }
  });
  for (var x = args[i];i < len; x = args[++i])
    if (isNull(x) || !isObject2(x))
      str += " " + x;
    else
      str += " " + inspect(x);
  return str;
}
function deprecate(fn, msg) {
  if (typeof process === "undefined" || process?.noDeprecation === true)
    return fn;
  var warned = false;
  function deprecated(...args) {
    if (!warned) {
      if (process.throwDeprecation)
        throw new Error(msg);
      else if (process.traceDeprecation)
        console.trace(msg);
      else
        console.error(msg);
      warned = true;
    }
    return fn.apply(this, ...args);
  }
  return deprecated;
}
function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];
  if (style)
    return "\x1B[" + inspect.colors[style][0] + "m" + str + "\x1B[" + inspect.colors[style][1] + "m";
  else
    return str;
}
function stylizeNoColor(str, styleType) {
  return str;
}
function arrayToHash(array) {
  var hash = {};
  return array.forEach(function(val, idx) {
    hash[val] = true;
  }), hash;
}
function formatValue(ctx, value, recurseTimes) {
  if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== inspect && !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret))
      ret = formatValue(ctx, ret, recurseTimes);
    return ret;
  }
  var primitive = formatPrimitive(ctx, value);
  if (primitive)
    return primitive;
  var keys = Object.keys(value), visibleKeys = arrayToHash(keys);
  if (ctx.showHidden)
    keys = Object.getOwnPropertyNames(value);
  if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0))
    return formatError(value);
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ": " + value.name : "";
      return ctx.stylize("[Function" + name + "]", "special");
    }
    if (isRegExp(value))
      return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
    if (isDate(value))
      return ctx.stylize(Date.prototype.toString.call(value), "date");
    if (isError(value))
      return formatError(value);
  }
  var base = "", array = false, braces = ["{", "}"];
  if (isArray(value))
    array = true, braces = ["[", "]"];
  if (isFunction(value)) {
    var n = value.name ? ": " + value.name : "";
    base = " [Function" + n + "]";
  }
  if (isRegExp(value))
    base = " " + RegExp.prototype.toString.call(value);
  if (isDate(value))
    base = " " + Date.prototype.toUTCString.call(value);
  if (isError(value))
    base = " " + formatError(value);
  if (keys.length === 0 && (!array || value.length == 0))
    return braces[0] + base + braces[1];
  if (recurseTimes < 0)
    if (isRegExp(value))
      return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
    else
      return ctx.stylize("[Object]", "special");
  ctx.seen.push(value);
  var output;
  if (array)
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  else
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  return ctx.seen.pop(), reduceToSingleString(output, base, braces);
}
function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize("undefined", "undefined");
  if (isString(value)) {
    var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
    return ctx.stylize(simple, "string");
  }
  if (isNumber(value))
    return ctx.stylize("" + value, "number");
  if (isBoolean(value))
    return ctx.stylize("" + value, "boolean");
  if (isNull(value))
    return ctx.stylize("null", "null");
}
function formatError(value) {
  return "[" + Error.prototype.toString.call(value) + "]";
}
function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length;i < l; ++i)
    if (hasOwnProperty(value, String(i)))
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    else
      output.push("");
  return keys.forEach(function(key) {
    if (!key.match(/^\d+$/))
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
  }), output;
}
function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  if (desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] }, desc.get)
    if (desc.set)
      str = ctx.stylize("[Getter/Setter]", "special");
    else
      str = ctx.stylize("[Getter]", "special");
  else if (desc.set)
    str = ctx.stylize("[Setter]", "special");
  if (!hasOwnProperty(visibleKeys, key))
    name = "[" + key + "]";
  if (!str)
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes))
        str = formatValue(ctx, desc.value, null);
      else
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      if (str.indexOf(`
`) > -1)
        if (array)
          str = str.split(`
`).map(function(line) {
            return "  " + line;
          }).join(`
`).slice(2);
        else
          str = `
` + str.split(`
`).map(function(line) {
            return "   " + line;
          }).join(`
`);
    } else
      str = ctx.stylize("[Circular]", "special");
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/))
      return str;
    if (name = JSON.stringify("" + key), name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/))
      name = name.slice(1, -1), name = ctx.stylize(name, "name");
    else
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), name = ctx.stylize(name, "string");
  }
  return name + ": " + str;
}
function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0, length = output.reduce(function(prev, cur) {
    if (numLinesEst++, cur.indexOf(`
`) >= 0)
      numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
  }, 0);
  if (length > 60)
    return braces[0] + (base === "" ? "" : base + `
 `) + " " + output.join(`,
  `) + " " + braces[1];
  return braces[0] + base + " " + output.join(", ") + " " + braces[1];
}
function isArray(ar) {
  return Array.isArray(ar);
}
function isBoolean(arg) {
  return typeof arg === "boolean";
}
function isNull(arg) {
  return arg === null;
}
function isNullOrUndefined(arg) {
  return arg == null;
}
function isNumber(arg) {
  return typeof arg === "number";
}
function isString(arg) {
  return typeof arg === "string";
}
function isSymbol(arg) {
  return typeof arg === "symbol";
}
function isUndefined(arg) {
  return arg === undefined;
}
function isRegExp(re) {
  return isObject2(re) && objectToString(re) === "[object RegExp]";
}
function isObject2(arg) {
  return typeof arg === "object" && arg !== null;
}
function isDate(d) {
  return isObject2(d) && objectToString(d) === "[object Date]";
}
function isError(e) {
  return isObject2(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
}
function isFunction(arg) {
  return typeof arg === "function";
}
function isPrimitive(arg) {
  return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined";
}
function isBuffer(arg) {
  return arg instanceof Buffer;
}
function objectToString(o) {
  return Object.prototype.toString.call(o);
}
function pad(n) {
  return n < 10 ? "0" + n.toString(10) : n.toString(10);
}
function timestamp() {
  var d = new Date, time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(":");
  return [d.getDate(), months[d.getMonth()], time].join(" ");
}
function log(...args) {
  console.log("%s - %s", timestamp(), format.apply(null, args));
}
function inherits(ctor, superCtor) {
  if (superCtor)
    ctor.super_ = superCtor, ctor.prototype = Object.create(superCtor.prototype, { constructor: { value: ctor, enumerable: false, writable: true, configurable: true } });
}
function _extend(origin, add) {
  if (!add || !isObject2(add))
    return origin;
  var keys = Object.keys(add), i = keys.length;
  while (i--)
    origin[keys[i]] = add[keys[i]];
  return origin;
}
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
function callbackifyOnRejected(reason, cb) {
  if (!reason) {
    var newReason = new Error("Promise was rejected with a falsy value");
    newReason.reason = reason, reason = newReason;
  }
  return cb(reason);
}
function callbackify(original) {
  if (typeof original !== "function")
    throw new TypeError('The "original" argument must be of type Function');
  function callbackified(...args) {
    var maybeCb = args.pop();
    if (typeof maybeCb !== "function")
      throw new TypeError("The last argument must be of type Function");
    var self2 = this, cb = function(...args2) {
      return maybeCb.apply(self2, ...args2);
    };
    original.apply(this, args).then(function(ret) {
      process.nextTick(cb.bind(null, null, ret));
    }, function(rej) {
      process.nextTick(callbackifyOnRejected.bind(null, rej, cb));
    });
  }
  return Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original)), Object.defineProperties(callbackified, Object.getOwnPropertyDescriptors(original)), callbackified;
}
var formatRegExp, debuglog, inspect, types = () => {}, months, promisify, TextEncoder, TextDecoder2, util_default;
var init_util = __esm(() => {
  formatRegExp = /%[sdj%]/g;
  debuglog = ((debugs = {}, debugEnvRegex = {}, debugEnv) => ((debugEnv = typeof process !== "undefined" && false) && (debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase()), debugEnvRegex = new RegExp("^" + debugEnv + "$", "i"), (set) => {
    if (set = set.toUpperCase(), !debugs[set])
      if (debugEnvRegex.test(set))
        debugs[set] = function(...args) {
          console.error("%s: %s", set, pid, format.apply(null, ...args));
        };
      else
        debugs[set] = function() {};
    return debugs[set];
  }))();
  inspect = ((i) => (i.colors = { bold: [1, 22], italic: [3, 23], underline: [4, 24], inverse: [7, 27], white: [37, 39], grey: [90, 39], black: [30, 39], blue: [34, 39], cyan: [36, 39], green: [32, 39], magenta: [35, 39], red: [31, 39], yellow: [33, 39] }, i.styles = { special: "cyan", number: "yellow", boolean: "yellow", undefined: "grey", null: "bold", string: "green", date: "magenta", regexp: "red" }, i.custom = Symbol.for("nodejs.util.inspect.custom"), i))(function inspect2(obj, opts, ...rest) {
    var ctx = { seen: [], stylize: stylizeNoColor };
    if (rest.length >= 1)
      ctx.depth = rest[0];
    if (rest.length >= 2)
      ctx.colors = rest[1];
    if (isBoolean(opts))
      ctx.showHidden = opts;
    else if (opts)
      _extend(ctx, opts);
    if (isUndefined(ctx.showHidden))
      ctx.showHidden = false;
    if (isUndefined(ctx.depth))
      ctx.depth = 2;
    if (isUndefined(ctx.colors))
      ctx.colors = false;
    if (ctx.colors)
      ctx.stylize = stylizeWithColor;
    return formatValue(ctx, obj, ctx.depth);
  });
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  promisify = ((x) => (x.custom = Symbol.for("nodejs.util.promisify.custom"), x))(function promisify2(original) {
    if (typeof original !== "function")
      throw new TypeError('The "original" argument must be of type Function');
    if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
      var fn = original[kCustomPromisifiedSymbol];
      if (typeof fn !== "function")
        throw new TypeError('The "nodejs.util.promisify.custom" argument must be of type Function');
      return Object.defineProperty(fn, kCustomPromisifiedSymbol, { value: fn, enumerable: false, writable: false, configurable: true }), fn;
    }
    function fn(...args) {
      var promiseResolve, promiseReject, promise = new Promise(function(resolve, reject) {
        promiseResolve = resolve, promiseReject = reject;
      });
      args.push(function(err, value) {
        if (err)
          promiseReject(err);
        else
          promiseResolve(value);
      });
      try {
        original.apply(this, args);
      } catch (err) {
        promiseReject(err);
      }
      return promise;
    }
    if (Object.setPrototypeOf(fn, Object.getPrototypeOf(original)), kCustomPromisifiedSymbol)
      Object.defineProperty(fn, kCustomPromisifiedSymbol, { value: fn, enumerable: false, writable: false, configurable: true });
    return Object.defineProperties(fn, Object.getOwnPropertyDescriptors(original));
  });
  ({ TextEncoder, TextDecoder: TextDecoder2 } = globalThis);
  util_default = { TextEncoder, TextDecoder: TextDecoder2, promisify, log, inherits, _extend, callbackifyOnRejected, callbackify };
});

// node_modules/loupe/loupe.js
var require_loupe = __commonJS((exports, module) => {
  (function(global2, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.loupe = {}));
  })(exports, function(exports2) {
    function _typeof(obj) {
      "@babel/helpers - typeof";
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr))
        return arr;
    }
    function _iterableToArrayLimit(arr, i) {
      if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
        return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;
      try {
        for (var _i = arr[Symbol.iterator](), _s;!(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);
          if (i && _arr.length === i)
            break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null)
            _i["return"]();
        } finally {
          if (_d)
            throw _e;
        }
      }
      return _arr;
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o)
        return;
      if (typeof o === "string")
        return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor)
        n = o.constructor.name;
      if (n === "Map" || n === "Set")
        return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length)
        len = arr.length;
      for (var i = 0, arr2 = new Array(len);i < len; i++)
        arr2[i] = arr[i];
      return arr2;
    }
    function _nonIterableRest() {
      throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    var ansiColors = {
      bold: ["1", "22"],
      dim: ["2", "22"],
      italic: ["3", "23"],
      underline: ["4", "24"],
      inverse: ["7", "27"],
      hidden: ["8", "28"],
      strike: ["9", "29"],
      black: ["30", "39"],
      red: ["31", "39"],
      green: ["32", "39"],
      yellow: ["33", "39"],
      blue: ["34", "39"],
      magenta: ["35", "39"],
      cyan: ["36", "39"],
      white: ["37", "39"],
      brightblack: ["30;1", "39"],
      brightred: ["31;1", "39"],
      brightgreen: ["32;1", "39"],
      brightyellow: ["33;1", "39"],
      brightblue: ["34;1", "39"],
      brightmagenta: ["35;1", "39"],
      brightcyan: ["36;1", "39"],
      brightwhite: ["37;1", "39"],
      grey: ["90", "39"]
    };
    var styles = {
      special: "cyan",
      number: "yellow",
      bigint: "yellow",
      boolean: "yellow",
      undefined: "grey",
      null: "bold",
      string: "green",
      symbol: "green",
      date: "magenta",
      regexp: "red"
    };
    var truncator = "…";
    function colorise(value, styleType) {
      var color = ansiColors[styles[styleType]] || ansiColors[styleType];
      if (!color) {
        return String(value);
      }
      return "\x1B[".concat(color[0], "m").concat(String(value), "\x1B[").concat(color[1], "m");
    }
    function normaliseOptions() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, _ref$showHidden = _ref.showHidden, showHidden = _ref$showHidden === undefined ? false : _ref$showHidden, _ref$depth = _ref.depth, depth = _ref$depth === undefined ? 2 : _ref$depth, _ref$colors = _ref.colors, colors = _ref$colors === undefined ? false : _ref$colors, _ref$customInspect = _ref.customInspect, customInspect = _ref$customInspect === undefined ? true : _ref$customInspect, _ref$showProxy = _ref.showProxy, showProxy = _ref$showProxy === undefined ? false : _ref$showProxy, _ref$maxArrayLength = _ref.maxArrayLength, maxArrayLength = _ref$maxArrayLength === undefined ? Infinity : _ref$maxArrayLength, _ref$breakLength = _ref.breakLength, breakLength = _ref$breakLength === undefined ? Infinity : _ref$breakLength, _ref$seen = _ref.seen, seen = _ref$seen === undefined ? [] : _ref$seen, _ref$truncate = _ref.truncate, truncate2 = _ref$truncate === undefined ? Infinity : _ref$truncate, _ref$stylize = _ref.stylize, stylize = _ref$stylize === undefined ? String : _ref$stylize;
      var options = {
        showHidden: Boolean(showHidden),
        depth: Number(depth),
        colors: Boolean(colors),
        customInspect: Boolean(customInspect),
        showProxy: Boolean(showProxy),
        maxArrayLength: Number(maxArrayLength),
        breakLength: Number(breakLength),
        truncate: Number(truncate2),
        seen,
        stylize
      };
      if (options.colors) {
        options.stylize = colorise;
      }
      return options;
    }
    function truncate(string, length) {
      var tail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : truncator;
      string = String(string);
      var tailLength = tail.length;
      var stringLength = string.length;
      if (tailLength > length && stringLength > tailLength) {
        return tail;
      }
      if (stringLength > length && stringLength > tailLength) {
        return "".concat(string.slice(0, length - tailLength)).concat(tail);
      }
      return string;
    }
    function inspectList(list, options, inspectItem) {
      var separator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ", ";
      inspectItem = inspectItem || options.inspect;
      var size = list.length;
      if (size === 0)
        return "";
      var originalLength = options.truncate;
      var output = "";
      var peek = "";
      var truncated = "";
      for (var i = 0;i < size; i += 1) {
        var last = i + 1 === list.length;
        var secondToLast = i + 2 === list.length;
        truncated = "".concat(truncator, "(").concat(list.length - i, ")");
        var value = list[i];
        options.truncate = originalLength - output.length - (last ? 0 : separator.length);
        var string = peek || inspectItem(value, options) + (last ? "" : separator);
        var nextLength = output.length + string.length;
        var truncatedLength = nextLength + truncated.length;
        if (last && nextLength > originalLength && output.length + truncated.length <= originalLength) {
          break;
        }
        if (!last && !secondToLast && truncatedLength > originalLength) {
          break;
        }
        peek = last ? "" : inspectItem(list[i + 1], options) + (secondToLast ? "" : separator);
        if (!last && secondToLast && truncatedLength > originalLength && nextLength + peek.length > originalLength) {
          break;
        }
        output += string;
        if (!last && !secondToLast && nextLength + peek.length >= originalLength) {
          truncated = "".concat(truncator, "(").concat(list.length - i - 1, ")");
          break;
        }
        truncated = "";
      }
      return "".concat(output).concat(truncated);
    }
    function quoteComplexKey(key) {
      if (key.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) {
        return key;
      }
      return JSON.stringify(key).replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
    }
    function inspectProperty(_ref2, options) {
      var _ref3 = _slicedToArray(_ref2, 2), key = _ref3[0], value = _ref3[1];
      options.truncate -= 2;
      if (typeof key === "string") {
        key = quoteComplexKey(key);
      } else if (typeof key !== "number") {
        key = "[".concat(options.inspect(key, options), "]");
      }
      options.truncate -= key.length;
      value = options.inspect(value, options);
      return "".concat(key, ": ").concat(value);
    }
    function inspectArray(array, options) {
      var nonIndexProperties = Object.keys(array).slice(array.length);
      if (!array.length && !nonIndexProperties.length)
        return "[]";
      options.truncate -= 4;
      var listContents = inspectList(array, options);
      options.truncate -= listContents.length;
      var propertyContents = "";
      if (nonIndexProperties.length) {
        propertyContents = inspectList(nonIndexProperties.map(function(key) {
          return [key, array[key]];
        }), options, inspectProperty);
      }
      return "[ ".concat(listContents).concat(propertyContents ? ", ".concat(propertyContents) : "", " ]");
    }
    var toString = Function.prototype.toString;
    var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\s\(\/]+)/;
    var maxFunctionSourceLength = 512;
    function getFuncName(aFunc) {
      if (typeof aFunc !== "function") {
        return null;
      }
      var name = "";
      if (typeof Function.prototype.name === "undefined" && typeof aFunc.name === "undefined") {
        var functionSource = toString.call(aFunc);
        if (functionSource.indexOf("(") > maxFunctionSourceLength) {
          return name;
        }
        var match = functionSource.match(functionNameMatch);
        if (match) {
          name = match[1];
        }
      } else {
        name = aFunc.name;
      }
      return name;
    }
    var getFuncName_1 = getFuncName;
    var getArrayName = function getArrayName(array) {
      if (typeof Buffer === "function" && array instanceof Buffer) {
        return "Buffer";
      }
      if (array[Symbol.toStringTag]) {
        return array[Symbol.toStringTag];
      }
      return getFuncName_1(array.constructor);
    };
    function inspectTypedArray(array, options) {
      var name = getArrayName(array);
      options.truncate -= name.length + 4;
      var nonIndexProperties = Object.keys(array).slice(array.length);
      if (!array.length && !nonIndexProperties.length)
        return "".concat(name, "[]");
      var output = "";
      for (var i = 0;i < array.length; i++) {
        var string = "".concat(options.stylize(truncate(array[i], options.truncate), "number")).concat(i === array.length - 1 ? "" : ", ");
        options.truncate -= string.length;
        if (array[i] !== array.length && options.truncate <= 3) {
          output += "".concat(truncator, "(").concat(array.length - array[i] + 1, ")");
          break;
        }
        output += string;
      }
      var propertyContents = "";
      if (nonIndexProperties.length) {
        propertyContents = inspectList(nonIndexProperties.map(function(key) {
          return [key, array[key]];
        }), options, inspectProperty);
      }
      return "".concat(name, "[ ").concat(output).concat(propertyContents ? ", ".concat(propertyContents) : "", " ]");
    }
    function inspectDate(dateObject, options) {
      var stringRepresentation = dateObject.toJSON();
      if (stringRepresentation === null) {
        return "Invalid Date";
      }
      var split = stringRepresentation.split("T");
      var date = split[0];
      return options.stylize("".concat(date, "T").concat(truncate(split[1], options.truncate - date.length - 1)), "date");
    }
    function inspectFunction(func, options) {
      var name = getFuncName_1(func);
      if (!name) {
        return options.stylize("[Function]", "special");
      }
      return options.stylize("[Function ".concat(truncate(name, options.truncate - 11), "]"), "special");
    }
    function inspectMapEntry(_ref, options) {
      var _ref2 = _slicedToArray(_ref, 2), key = _ref2[0], value = _ref2[1];
      options.truncate -= 4;
      key = options.inspect(key, options);
      options.truncate -= key.length;
      value = options.inspect(value, options);
      return "".concat(key, " => ").concat(value);
    }
    function mapToEntries(map) {
      var entries = [];
      map.forEach(function(value, key) {
        entries.push([key, value]);
      });
      return entries;
    }
    function inspectMap(map, options) {
      var size = map.size - 1;
      if (size <= 0) {
        return "Map{}";
      }
      options.truncate -= 7;
      return "Map{ ".concat(inspectList(mapToEntries(map), options, inspectMapEntry), " }");
    }
    var isNaN2 = Number.isNaN || function(i) {
      return i !== i;
    };
    function inspectNumber(number, options) {
      if (isNaN2(number)) {
        return options.stylize("NaN", "number");
      }
      if (number === Infinity) {
        return options.stylize("Infinity", "number");
      }
      if (number === -Infinity) {
        return options.stylize("-Infinity", "number");
      }
      if (number === 0) {
        return options.stylize(1 / number === Infinity ? "+0" : "-0", "number");
      }
      return options.stylize(truncate(number, options.truncate), "number");
    }
    function inspectBigInt(number, options) {
      var nums = truncate(number.toString(), options.truncate - 1);
      if (nums !== truncator)
        nums += "n";
      return options.stylize(nums, "bigint");
    }
    function inspectRegExp(value, options) {
      var flags = value.toString().split("/")[2];
      var sourceLength = options.truncate - (2 + flags.length);
      var source = value.source;
      return options.stylize("/".concat(truncate(source, sourceLength), "/").concat(flags), "regexp");
    }
    function arrayFromSet(set) {
      var values = [];
      set.forEach(function(value) {
        values.push(value);
      });
      return values;
    }
    function inspectSet(set, options) {
      if (set.size === 0)
        return "Set{}";
      options.truncate -= 7;
      return "Set{ ".concat(inspectList(arrayFromSet(set), options), " }");
    }
    var stringEscapeChars = new RegExp("['\\u0000-\\u001f\\u007f-\\u009f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5" + "\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]", "g");
    var escapeCharacters = {
      "\b": "\\b",
      "\t": "\\t",
      "\n": "\\n",
      "\f": "\\f",
      "\r": "\\r",
      "'": "\\'",
      "\\": "\\\\"
    };
    var hex = 16;
    var unicodeLength = 4;
    function escape(char) {
      return escapeCharacters[char] || "\\u".concat("0000".concat(char.charCodeAt(0).toString(hex)).slice(-unicodeLength));
    }
    function inspectString(string, options) {
      if (stringEscapeChars.test(string)) {
        string = string.replace(stringEscapeChars, escape);
      }
      return options.stylize("'".concat(truncate(string, options.truncate - 2), "'"), "string");
    }
    function inspectSymbol(value) {
      if ("description" in Symbol.prototype) {
        return value.description ? "Symbol(".concat(value.description, ")") : "Symbol()";
      }
      return value.toString();
    }
    var getPromiseValue = function getPromiseValue() {
      return "Promise{…}";
    };
    try {
      var _process$binding = process.binding("util"), getPromiseDetails = _process$binding.getPromiseDetails, kPending = _process$binding.kPending, kRejected = _process$binding.kRejected;
      if (Array.isArray(getPromiseDetails(Promise.resolve()))) {
        getPromiseValue = function getPromiseValue(value, options) {
          var _getPromiseDetails = getPromiseDetails(value), _getPromiseDetails2 = _slicedToArray(_getPromiseDetails, 2), state = _getPromiseDetails2[0], innerValue = _getPromiseDetails2[1];
          if (state === kPending) {
            return "Promise{<pending>}";
          }
          return "Promise".concat(state === kRejected ? "!" : "", "{").concat(options.inspect(innerValue, options), "}");
        };
      }
    } catch (notNode) {}
    var inspectPromise = getPromiseValue;
    function inspectObject(object, options) {
      var properties = Object.getOwnPropertyNames(object);
      var symbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(object) : [];
      if (properties.length === 0 && symbols.length === 0) {
        return "{}";
      }
      options.truncate -= 4;
      options.seen = options.seen || [];
      if (options.seen.indexOf(object) >= 0) {
        return "[Circular]";
      }
      options.seen.push(object);
      var propertyContents = inspectList(properties.map(function(key) {
        return [key, object[key]];
      }), options, inspectProperty);
      var symbolContents = inspectList(symbols.map(function(key) {
        return [key, object[key]];
      }), options, inspectProperty);
      options.seen.pop();
      var sep = "";
      if (propertyContents && symbolContents) {
        sep = ", ";
      }
      return "{ ".concat(propertyContents).concat(sep).concat(symbolContents, " }");
    }
    var toStringTag = typeof Symbol !== "undefined" && Symbol.toStringTag ? Symbol.toStringTag : false;
    function inspectClass(value, options) {
      var name = "";
      if (toStringTag && toStringTag in value) {
        name = value[toStringTag];
      }
      name = name || getFuncName_1(value.constructor);
      if (!name || name === "_class") {
        name = "<Anonymous Class>";
      }
      options.truncate -= name.length;
      return "".concat(name).concat(inspectObject(value, options));
    }
    function inspectArguments(args, options) {
      if (args.length === 0)
        return "Arguments[]";
      options.truncate -= 13;
      return "Arguments[ ".concat(inspectList(args, options), " ]");
    }
    var errorKeys = ["stack", "line", "column", "name", "message", "fileName", "lineNumber", "columnNumber", "number", "description"];
    function inspectObject$1(error, options) {
      var properties = Object.getOwnPropertyNames(error).filter(function(key) {
        return errorKeys.indexOf(key) === -1;
      });
      var name = error.name;
      options.truncate -= name.length;
      var message = "";
      if (typeof error.message === "string") {
        message = truncate(error.message, options.truncate);
      } else {
        properties.unshift("message");
      }
      message = message ? ": ".concat(message) : "";
      options.truncate -= message.length + 5;
      var propertyContents = inspectList(properties.map(function(key) {
        return [key, error[key]];
      }), options, inspectProperty);
      return "".concat(name).concat(message).concat(propertyContents ? " { ".concat(propertyContents, " }") : "");
    }
    function inspectAttribute(_ref, options) {
      var _ref2 = _slicedToArray(_ref, 2), key = _ref2[0], value = _ref2[1];
      options.truncate -= 3;
      if (!value) {
        return "".concat(options.stylize(key, "yellow"));
      }
      return "".concat(options.stylize(key, "yellow"), "=").concat(options.stylize('"'.concat(value, '"'), "string"));
    }
    function inspectHTMLCollection(collection, options) {
      return inspectList(collection, options, inspectHTML, `
`);
    }
    function inspectHTML(element, options) {
      var properties = element.getAttributeNames();
      var name = element.tagName.toLowerCase();
      var head = options.stylize("<".concat(name), "special");
      var headClose = options.stylize(">", "special");
      var tail = options.stylize("</".concat(name, ">"), "special");
      options.truncate -= name.length * 2 + 5;
      var propertyContents = "";
      if (properties.length > 0) {
        propertyContents += " ";
        propertyContents += inspectList(properties.map(function(key) {
          return [key, element.getAttribute(key)];
        }), options, inspectAttribute, " ");
      }
      options.truncate -= propertyContents.length;
      var truncate2 = options.truncate;
      var children = inspectHTMLCollection(element.children, options);
      if (children && children.length > truncate2) {
        children = "".concat(truncator, "(").concat(element.children.length, ")");
      }
      return "".concat(head).concat(propertyContents).concat(headClose).concat(children).concat(tail);
    }
    var symbolsSupported = typeof Symbol === "function" && typeof Symbol.for === "function";
    var chaiInspect = symbolsSupported ? Symbol.for("chai/inspect") : "@@chai/inspect";
    var nodeInspect = false;
    try {
      var nodeUtil = (init_util(), __toCommonJS(exports_util));
      nodeInspect = nodeUtil.inspect ? nodeUtil.inspect.custom : false;
    } catch (noNodeInspect) {
      nodeInspect = false;
    }
    function FakeMap() {
      this.key = "chai/loupe__" + Math.random() + Date.now();
    }
    FakeMap.prototype = {
      get: function get(key) {
        return key[this.key];
      },
      has: function has(key) {
        return this.key in key;
      },
      set: function set(key, value) {
        if (Object.isExtensible(key)) {
          Object.defineProperty(key, this.key, {
            value,
            configurable: true
          });
        }
      }
    };
    var constructorMap = new (typeof WeakMap === "function" ? WeakMap : FakeMap);
    var stringTagMap = {};
    var baseTypesMap = {
      undefined: function undefined$1(value, options) {
        return options.stylize("undefined", "undefined");
      },
      null: function _null(value, options) {
        return options.stylize(null, "null");
      },
      boolean: function boolean(value, options) {
        return options.stylize(value, "boolean");
      },
      Boolean: function Boolean(value, options) {
        return options.stylize(value, "boolean");
      },
      number: inspectNumber,
      Number: inspectNumber,
      bigint: inspectBigInt,
      BigInt: inspectBigInt,
      string: inspectString,
      String: inspectString,
      function: inspectFunction,
      Function: inspectFunction,
      symbol: inspectSymbol,
      Symbol: inspectSymbol,
      Array: inspectArray,
      Date: inspectDate,
      Map: inspectMap,
      Set: inspectSet,
      RegExp: inspectRegExp,
      Promise: inspectPromise,
      WeakSet: function WeakSet(value, options) {
        return options.stylize("WeakSet{…}", "special");
      },
      WeakMap: function WeakMap(value, options) {
        return options.stylize("WeakMap{…}", "special");
      },
      Arguments: inspectArguments,
      Int8Array: inspectTypedArray,
      Uint8Array: inspectTypedArray,
      Uint8ClampedArray: inspectTypedArray,
      Int16Array: inspectTypedArray,
      Uint16Array: inspectTypedArray,
      Int32Array: inspectTypedArray,
      Uint32Array: inspectTypedArray,
      Float32Array: inspectTypedArray,
      Float64Array: inspectTypedArray,
      Generator: function Generator() {
        return "";
      },
      DataView: function DataView() {
        return "";
      },
      ArrayBuffer: function ArrayBuffer() {
        return "";
      },
      Error: inspectObject$1,
      HTMLCollection: inspectHTMLCollection,
      NodeList: inspectHTMLCollection
    };
    var inspectCustom = function inspectCustom(value, options, type) {
      if (chaiInspect in value && typeof value[chaiInspect] === "function") {
        return value[chaiInspect](options);
      }
      if (nodeInspect && nodeInspect in value && typeof value[nodeInspect] === "function") {
        return value[nodeInspect](options.depth, options);
      }
      if ("inspect" in value && typeof value.inspect === "function") {
        return value.inspect(options.depth, options);
      }
      if ("constructor" in value && constructorMap.has(value.constructor)) {
        return constructorMap.get(value.constructor)(value, options);
      }
      if (stringTagMap[type]) {
        return stringTagMap[type](value, options);
      }
      return "";
    };
    var toString$1 = Object.prototype.toString;
    function inspect3(value, options) {
      options = normaliseOptions(options);
      options.inspect = inspect3;
      var _options = options, customInspect = _options.customInspect;
      var type = value === null ? "null" : _typeof(value);
      if (type === "object") {
        type = toString$1.call(value).slice(8, -1);
      }
      if (baseTypesMap[type]) {
        return baseTypesMap[type](value, options);
      }
      if (customInspect && value) {
        var output = inspectCustom(value, options, type);
        if (output) {
          if (typeof output === "string")
            return output;
          return inspect3(output, options);
        }
      }
      var proto = value ? Object.getPrototypeOf(value) : false;
      if (proto === Object.prototype || proto === null) {
        return inspectObject(value, options);
      }
      if (value && typeof HTMLElement === "function" && value instanceof HTMLElement) {
        return inspectHTML(value, options);
      }
      if ("constructor" in value) {
        if (value.constructor !== Object) {
          return inspectClass(value, options);
        }
        return inspectObject(value, options);
      }
      if (value === Object(value)) {
        return inspectObject(value, options);
      }
      return options.stylize(String(value), type);
    }
    function registerConstructor(constructor, inspector) {
      if (constructorMap.has(constructor)) {
        return false;
      }
      constructorMap.set(constructor, inspector);
      return true;
    }
    function registerStringTag(stringTag, inspector) {
      if (stringTag in stringTagMap) {
        return false;
      }
      stringTagMap[stringTag] = inspector;
      return true;
    }
    var custom = chaiInspect;
    exports2.custom = custom;
    exports2.default = inspect3;
    exports2.inspect = inspect3;
    exports2.registerConstructor = registerConstructor;
    exports2.registerStringTag = registerStringTag;
    Object.defineProperty(exports2, "__esModule", { value: true });
  });
});

// node_modules/diff-sequences/build/index.js
var require_build2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = diffSequence;
  var pkg = "diff-sequences";
  var NOT_YET_SET = 0;
  var countCommonItemsF = (aIndex, aEnd, bIndex, bEnd, isCommon) => {
    let nCommon = 0;
    while (aIndex < aEnd && bIndex < bEnd && isCommon(aIndex, bIndex)) {
      aIndex += 1;
      bIndex += 1;
      nCommon += 1;
    }
    return nCommon;
  };
  var countCommonItemsR = (aStart, aIndex, bStart, bIndex, isCommon) => {
    let nCommon = 0;
    while (aStart <= aIndex && bStart <= bIndex && isCommon(aIndex, bIndex)) {
      aIndex -= 1;
      bIndex -= 1;
      nCommon += 1;
    }
    return nCommon;
  };
  var extendPathsF = (d, aEnd, bEnd, bF, isCommon, aIndexesF, iMaxF) => {
    let iF = 0;
    let kF = -d;
    let aFirst = aIndexesF[iF];
    let aIndexPrev1 = aFirst;
    aIndexesF[iF] += countCommonItemsF(aFirst + 1, aEnd, bF + aFirst - kF + 1, bEnd, isCommon);
    const nF = d < iMaxF ? d : iMaxF;
    for (iF += 1, kF += 2;iF <= nF; iF += 1, kF += 2) {
      if (iF !== d && aIndexPrev1 < aIndexesF[iF]) {
        aFirst = aIndexesF[iF];
      } else {
        aFirst = aIndexPrev1 + 1;
        if (aEnd <= aFirst) {
          return iF - 1;
        }
      }
      aIndexPrev1 = aIndexesF[iF];
      aIndexesF[iF] = aFirst + countCommonItemsF(aFirst + 1, aEnd, bF + aFirst - kF + 1, bEnd, isCommon);
    }
    return iMaxF;
  };
  var extendPathsR = (d, aStart, bStart, bR, isCommon, aIndexesR, iMaxR) => {
    let iR = 0;
    let kR = d;
    let aFirst = aIndexesR[iR];
    let aIndexPrev1 = aFirst;
    aIndexesR[iR] -= countCommonItemsR(aStart, aFirst - 1, bStart, bR + aFirst - kR - 1, isCommon);
    const nR = d < iMaxR ? d : iMaxR;
    for (iR += 1, kR -= 2;iR <= nR; iR += 1, kR -= 2) {
      if (iR !== d && aIndexesR[iR] < aIndexPrev1) {
        aFirst = aIndexesR[iR];
      } else {
        aFirst = aIndexPrev1 - 1;
        if (aFirst < aStart) {
          return iR - 1;
        }
      }
      aIndexPrev1 = aIndexesR[iR];
      aIndexesR[iR] = aFirst - countCommonItemsR(aStart, aFirst - 1, bStart, bR + aFirst - kR - 1, isCommon);
    }
    return iMaxR;
  };
  var extendOverlappablePathsF = (d, aStart, aEnd, bStart, bEnd, isCommon, aIndexesF, iMaxF, aIndexesR, iMaxR, division) => {
    const bF = bStart - aStart;
    const aLength = aEnd - aStart;
    const bLength = bEnd - bStart;
    const baDeltaLength = bLength - aLength;
    const kMinOverlapF = -baDeltaLength - (d - 1);
    const kMaxOverlapF = -baDeltaLength + (d - 1);
    let aIndexPrev1 = NOT_YET_SET;
    const nF = d < iMaxF ? d : iMaxF;
    for (let iF = 0, kF = -d;iF <= nF; iF += 1, kF += 2) {
      const insert = iF === 0 || iF !== d && aIndexPrev1 < aIndexesF[iF];
      const aLastPrev = insert ? aIndexesF[iF] : aIndexPrev1;
      const aFirst = insert ? aLastPrev : aLastPrev + 1;
      const bFirst = bF + aFirst - kF;
      const nCommonF = countCommonItemsF(aFirst + 1, aEnd, bFirst + 1, bEnd, isCommon);
      const aLast = aFirst + nCommonF;
      aIndexPrev1 = aIndexesF[iF];
      aIndexesF[iF] = aLast;
      if (kMinOverlapF <= kF && kF <= kMaxOverlapF) {
        const iR = (d - 1 - (kF + baDeltaLength)) / 2;
        if (iR <= iMaxR && aIndexesR[iR] - 1 <= aLast) {
          const bLastPrev = bF + aLastPrev - (insert ? kF + 1 : kF - 1);
          const nCommonR = countCommonItemsR(aStart, aLastPrev, bStart, bLastPrev, isCommon);
          const aIndexPrevFirst = aLastPrev - nCommonR;
          const bIndexPrevFirst = bLastPrev - nCommonR;
          const aEndPreceding = aIndexPrevFirst + 1;
          const bEndPreceding = bIndexPrevFirst + 1;
          division.nChangePreceding = d - 1;
          if (d - 1 === aEndPreceding + bEndPreceding - aStart - bStart) {
            division.aEndPreceding = aStart;
            division.bEndPreceding = bStart;
          } else {
            division.aEndPreceding = aEndPreceding;
            division.bEndPreceding = bEndPreceding;
          }
          division.nCommonPreceding = nCommonR;
          if (nCommonR !== 0) {
            division.aCommonPreceding = aEndPreceding;
            division.bCommonPreceding = bEndPreceding;
          }
          division.nCommonFollowing = nCommonF;
          if (nCommonF !== 0) {
            division.aCommonFollowing = aFirst + 1;
            division.bCommonFollowing = bFirst + 1;
          }
          const aStartFollowing = aLast + 1;
          const bStartFollowing = bFirst + nCommonF + 1;
          division.nChangeFollowing = d - 1;
          if (d - 1 === aEnd + bEnd - aStartFollowing - bStartFollowing) {
            division.aStartFollowing = aEnd;
            division.bStartFollowing = bEnd;
          } else {
            division.aStartFollowing = aStartFollowing;
            division.bStartFollowing = bStartFollowing;
          }
          return true;
        }
      }
    }
    return false;
  };
  var extendOverlappablePathsR = (d, aStart, aEnd, bStart, bEnd, isCommon, aIndexesF, iMaxF, aIndexesR, iMaxR, division) => {
    const bR = bEnd - aEnd;
    const aLength = aEnd - aStart;
    const bLength = bEnd - bStart;
    const baDeltaLength = bLength - aLength;
    const kMinOverlapR = baDeltaLength - d;
    const kMaxOverlapR = baDeltaLength + d;
    let aIndexPrev1 = NOT_YET_SET;
    const nR = d < iMaxR ? d : iMaxR;
    for (let iR = 0, kR = d;iR <= nR; iR += 1, kR -= 2) {
      const insert = iR === 0 || iR !== d && aIndexesR[iR] < aIndexPrev1;
      const aLastPrev = insert ? aIndexesR[iR] : aIndexPrev1;
      const aFirst = insert ? aLastPrev : aLastPrev - 1;
      const bFirst = bR + aFirst - kR;
      const nCommonR = countCommonItemsR(aStart, aFirst - 1, bStart, bFirst - 1, isCommon);
      const aLast = aFirst - nCommonR;
      aIndexPrev1 = aIndexesR[iR];
      aIndexesR[iR] = aLast;
      if (kMinOverlapR <= kR && kR <= kMaxOverlapR) {
        const iF = (d + (kR - baDeltaLength)) / 2;
        if (iF <= iMaxF && aLast - 1 <= aIndexesF[iF]) {
          const bLast = bFirst - nCommonR;
          division.nChangePreceding = d;
          if (d === aLast + bLast - aStart - bStart) {
            division.aEndPreceding = aStart;
            division.bEndPreceding = bStart;
          } else {
            division.aEndPreceding = aLast;
            division.bEndPreceding = bLast;
          }
          division.nCommonPreceding = nCommonR;
          if (nCommonR !== 0) {
            division.aCommonPreceding = aLast;
            division.bCommonPreceding = bLast;
          }
          division.nChangeFollowing = d - 1;
          if (d === 1) {
            division.nCommonFollowing = 0;
            division.aStartFollowing = aEnd;
            division.bStartFollowing = bEnd;
          } else {
            const bLastPrev = bR + aLastPrev - (insert ? kR - 1 : kR + 1);
            const nCommonF = countCommonItemsF(aLastPrev, aEnd, bLastPrev, bEnd, isCommon);
            division.nCommonFollowing = nCommonF;
            if (nCommonF !== 0) {
              division.aCommonFollowing = aLastPrev;
              division.bCommonFollowing = bLastPrev;
            }
            const aStartFollowing = aLastPrev + nCommonF;
            const bStartFollowing = bLastPrev + nCommonF;
            if (d - 1 === aEnd + bEnd - aStartFollowing - bStartFollowing) {
              division.aStartFollowing = aEnd;
              division.bStartFollowing = bEnd;
            } else {
              division.aStartFollowing = aStartFollowing;
              division.bStartFollowing = bStartFollowing;
            }
          }
          return true;
        }
      }
    }
    return false;
  };
  var divide = (nChange, aStart, aEnd, bStart, bEnd, isCommon, aIndexesF, aIndexesR, division) => {
    const bF = bStart - aStart;
    const bR = bEnd - aEnd;
    const aLength = aEnd - aStart;
    const bLength = bEnd - bStart;
    const baDeltaLength = bLength - aLength;
    let iMaxF = aLength;
    let iMaxR = aLength;
    aIndexesF[0] = aStart - 1;
    aIndexesR[0] = aEnd;
    if (baDeltaLength % 2 === 0) {
      const dMin = (nChange || baDeltaLength) / 2;
      const dMax = (aLength + bLength) / 2;
      for (let d = 1;d <= dMax; d += 1) {
        iMaxF = extendPathsF(d, aEnd, bEnd, bF, isCommon, aIndexesF, iMaxF);
        if (d < dMin) {
          iMaxR = extendPathsR(d, aStart, bStart, bR, isCommon, aIndexesR, iMaxR);
        } else if (extendOverlappablePathsR(d, aStart, aEnd, bStart, bEnd, isCommon, aIndexesF, iMaxF, aIndexesR, iMaxR, division)) {
          return;
        }
      }
    } else {
      const dMin = ((nChange || baDeltaLength) + 1) / 2;
      const dMax = (aLength + bLength + 1) / 2;
      let d = 1;
      iMaxF = extendPathsF(d, aEnd, bEnd, bF, isCommon, aIndexesF, iMaxF);
      for (d += 1;d <= dMax; d += 1) {
        iMaxR = extendPathsR(d - 1, aStart, bStart, bR, isCommon, aIndexesR, iMaxR);
        if (d < dMin) {
          iMaxF = extendPathsF(d, aEnd, bEnd, bF, isCommon, aIndexesF, iMaxF);
        } else if (extendOverlappablePathsF(d, aStart, aEnd, bStart, bEnd, isCommon, aIndexesF, iMaxF, aIndexesR, iMaxR, division)) {
          return;
        }
      }
    }
    throw new Error(`${pkg}: no overlap aStart=${aStart} aEnd=${aEnd} bStart=${bStart} bEnd=${bEnd}`);
  };
  var findSubsequences = (nChange, aStart, aEnd, bStart, bEnd, transposed, callbacks, aIndexesF, aIndexesR, division) => {
    if (bEnd - bStart < aEnd - aStart) {
      transposed = !transposed;
      if (transposed && callbacks.length === 1) {
        const { foundSubsequence: foundSubsequence2, isCommon: isCommon2 } = callbacks[0];
        callbacks[1] = {
          foundSubsequence: (nCommon, bCommon, aCommon) => {
            foundSubsequence2(nCommon, aCommon, bCommon);
          },
          isCommon: (bIndex, aIndex) => isCommon2(aIndex, bIndex)
        };
      }
      const tStart = aStart;
      const tEnd = aEnd;
      aStart = bStart;
      aEnd = bEnd;
      bStart = tStart;
      bEnd = tEnd;
    }
    const { foundSubsequence, isCommon } = callbacks[transposed ? 1 : 0];
    divide(nChange, aStart, aEnd, bStart, bEnd, isCommon, aIndexesF, aIndexesR, division);
    const {
      nChangePreceding,
      aEndPreceding,
      bEndPreceding,
      nCommonPreceding,
      aCommonPreceding,
      bCommonPreceding,
      nCommonFollowing,
      aCommonFollowing,
      bCommonFollowing,
      nChangeFollowing,
      aStartFollowing,
      bStartFollowing
    } = division;
    if (aStart < aEndPreceding && bStart < bEndPreceding) {
      findSubsequences(nChangePreceding, aStart, aEndPreceding, bStart, bEndPreceding, transposed, callbacks, aIndexesF, aIndexesR, division);
    }
    if (nCommonPreceding !== 0) {
      foundSubsequence(nCommonPreceding, aCommonPreceding, bCommonPreceding);
    }
    if (nCommonFollowing !== 0) {
      foundSubsequence(nCommonFollowing, aCommonFollowing, bCommonFollowing);
    }
    if (aStartFollowing < aEnd && bStartFollowing < bEnd) {
      findSubsequences(nChangeFollowing, aStartFollowing, aEnd, bStartFollowing, bEnd, transposed, callbacks, aIndexesF, aIndexesR, division);
    }
  };
  var validateLength = (name, arg) => {
    if (typeof arg !== "number") {
      throw new TypeError(`${pkg}: ${name} typeof ${typeof arg} is not a number`);
    }
    if (!Number.isSafeInteger(arg)) {
      throw new RangeError(`${pkg}: ${name} value ${arg} is not a safe integer`);
    }
    if (arg < 0) {
      throw new RangeError(`${pkg}: ${name} value ${arg} is a negative integer`);
    }
  };
  var validateCallback = (name, arg) => {
    const type = typeof arg;
    if (type !== "function") {
      throw new TypeError(`${pkg}: ${name} typeof ${type} is not a function`);
    }
  };
  function diffSequence(aLength, bLength, isCommon, foundSubsequence) {
    validateLength("aLength", aLength);
    validateLength("bLength", bLength);
    validateCallback("isCommon", isCommon);
    validateCallback("foundSubsequence", foundSubsequence);
    const nCommonF = countCommonItemsF(0, aLength, 0, bLength, isCommon);
    if (nCommonF !== 0) {
      foundSubsequence(nCommonF, 0, 0);
    }
    if (aLength !== nCommonF || bLength !== nCommonF) {
      const aStart = nCommonF;
      const bStart = nCommonF;
      const nCommonR = countCommonItemsR(aStart, aLength - 1, bStart, bLength - 1, isCommon);
      const aEnd = aLength - nCommonR;
      const bEnd = bLength - nCommonR;
      const nCommonFR = nCommonF + nCommonR;
      if (aLength !== nCommonFR && bLength !== nCommonFR) {
        const nChange = 0;
        const transposed = false;
        const callbacks = [
          {
            foundSubsequence,
            isCommon
          }
        ];
        const aIndexesF = [NOT_YET_SET];
        const aIndexesR = [NOT_YET_SET];
        const division = {
          aCommonFollowing: NOT_YET_SET,
          aCommonPreceding: NOT_YET_SET,
          aEndPreceding: NOT_YET_SET,
          aStartFollowing: NOT_YET_SET,
          bCommonFollowing: NOT_YET_SET,
          bCommonPreceding: NOT_YET_SET,
          bEndPreceding: NOT_YET_SET,
          bStartFollowing: NOT_YET_SET,
          nChangeFollowing: NOT_YET_SET,
          nChangePreceding: NOT_YET_SET,
          nCommonFollowing: NOT_YET_SET,
          nCommonPreceding: NOT_YET_SET
        };
        findSubsequences(nChange, aStart, aEnd, bStart, bEnd, transposed, callbacks, aIndexesF, aIndexesR, division);
      }
      if (nCommonR !== 0) {
        foundSubsequence(nCommonR, aEnd, bEnd);
      }
    }
  }
});

// node_modules/assertion-error/index.js
var require_assertion_error = __commonJS((exports, module) => {
  /*!
   * assertion-error
   * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
   * MIT Licensed
   */
  /*!
   * Return a function that will copy properties from
   * one object to another excluding any originally
   * listed. Returned function will create a new `{}`.
   *
   * @param {String} excluded properties ...
   * @return {Function}
   */
  function exclude() {
    var excludes = [].slice.call(arguments);
    function excludeProps(res, obj) {
      Object.keys(obj).forEach(function(key) {
        if (!~excludes.indexOf(key))
          res[key] = obj[key];
      });
    }
    return function extendExclude() {
      var args = [].slice.call(arguments), i = 0, res = {};
      for (;i < args.length; i++) {
        excludeProps(res, args[i]);
      }
      return res;
    };
  }
  /*!
   * Primary Exports
   */
  module.exports = AssertionError;
  function AssertionError(message, _props, ssf) {
    var extend = exclude("name", "message", "stack", "constructor", "toJSON"), props = extend(_props || {});
    this.message = message || "Unspecified AssertionError";
    this.showDiff = false;
    for (var key in props) {
      this[key] = props[key];
    }
    ssf = ssf || AssertionError;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ssf);
    } else {
      try {
        throw new Error;
      } catch (e) {
        this.stack = e.stack;
      }
    }
  }
  /*!
   * Inherit from Error.prototype
   */
  AssertionError.prototype = Object.create(Error.prototype);
  /*!
   * Statically set name
   */
  AssertionError.prototype.name = "AssertionError";
  /*!
   * Ensure correct constructor
   */
  AssertionError.prototype.constructor = AssertionError;
  AssertionError.prototype.toJSON = function(stack) {
    var extend = exclude("constructor", "toJSON", "stack"), props = extend({ name: this.name }, this);
    if (stack !== false && this.stack) {
      props.stack = this.stack;
    }
    return props;
  };
});

// node_modules/pathval/index.js
var require_pathval = __commonJS((exports, module) => {
  function hasProperty(obj, name) {
    if (typeof obj === "undefined" || obj === null) {
      return false;
    }
    return name in Object(obj);
  }
  function parsePath(path2) {
    var str = path2.replace(/([^\\])\[/g, "$1.[");
    var parts = str.match(/(\\\.|[^.]+?)+/g);
    return parts.map(function mapMatches(value) {
      if (value === "constructor" || value === "__proto__" || value === "prototype") {
        return {};
      }
      var regexp = /^\[(\d+)\]$/;
      var mArr = regexp.exec(value);
      var parsed = null;
      if (mArr) {
        parsed = { i: parseFloat(mArr[1]) };
      } else {
        parsed = { p: value.replace(/\\([.[\]])/g, "$1") };
      }
      return parsed;
    });
  }
  function internalGetPathValue(obj, parsed, pathDepth) {
    var temporaryValue = obj;
    var res = null;
    pathDepth = typeof pathDepth === "undefined" ? parsed.length : pathDepth;
    for (var i = 0;i < pathDepth; i++) {
      var part = parsed[i];
      if (temporaryValue) {
        if (typeof part.p === "undefined") {
          temporaryValue = temporaryValue[part.i];
        } else {
          temporaryValue = temporaryValue[part.p];
        }
        if (i === pathDepth - 1) {
          res = temporaryValue;
        }
      }
    }
    return res;
  }
  function internalSetPathValue(obj, val, parsed) {
    var tempObj = obj;
    var pathDepth = parsed.length;
    var part = null;
    for (var i = 0;i < pathDepth; i++) {
      var propName = null;
      var propVal = null;
      part = parsed[i];
      if (i === pathDepth - 1) {
        propName = typeof part.p === "undefined" ? part.i : part.p;
        tempObj[propName] = val;
      } else if (typeof part.p !== "undefined" && tempObj[part.p]) {
        tempObj = tempObj[part.p];
      } else if (typeof part.i !== "undefined" && tempObj[part.i]) {
        tempObj = tempObj[part.i];
      } else {
        var next = parsed[i + 1];
        propName = typeof part.p === "undefined" ? part.i : part.p;
        propVal = typeof next.p === "undefined" ? [] : {};
        tempObj[propName] = propVal;
        tempObj = tempObj[propName];
      }
    }
  }
  function getPathInfo(obj, path2) {
    var parsed = parsePath(path2);
    var last = parsed[parsed.length - 1];
    var info = {
      parent: parsed.length > 1 ? internalGetPathValue(obj, parsed, parsed.length - 1) : obj,
      name: last.p || last.i,
      value: internalGetPathValue(obj, parsed)
    };
    info.exists = hasProperty(info.parent, info.name);
    return info;
  }
  function getPathValue(obj, path2) {
    var info = getPathInfo(obj, path2);
    return info.value;
  }
  function setPathValue(obj, path2, val) {
    var parsed = parsePath(path2);
    internalSetPathValue(obj, val, parsed);
    return obj;
  }
  module.exports = {
    hasProperty,
    getPathInfo,
    getPathValue,
    setPathValue
  };
});

// node_modules/chai/lib/chai/utils/flag.js
var require_flag = __commonJS((exports, module) => {
  /*!
   * Chai - flag utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  module.exports = function flag(obj, key, value) {
    var flags = obj.__flags || (obj.__flags = Object.create(null));
    if (arguments.length === 3) {
      flags[key] = value;
    } else {
      return flags[key];
    }
  };
});

// node_modules/chai/lib/chai/utils/test.js
var require_test = __commonJS((exports, module) => {
  /*!
   * Chai - test utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  /*!
   * Module dependencies
   */
  var flag = require_flag();
  module.exports = function test(obj, args) {
    var negate = flag(obj, "negate"), expr = args[0];
    return negate ? !expr : expr;
  };
});

// node_modules/type-detect/type-detect.js
var require_type_detect = __commonJS((exports, module) => {
  (function(global2, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, global2.typeDetect = factory());
  })(exports, function() {
    var promiseExists = typeof Promise === "function";
    var globalObject = function(Obj) {
      if (typeof globalThis === "object") {
        return globalThis;
      }
      Object.defineProperty(Obj, "typeDetectGlobalObject", {
        get: function get() {
          return this;
        },
        configurable: true
      });
      var global2 = typeDetectGlobalObject;
      delete Obj.typeDetectGlobalObject;
      return global2;
    }(Object.prototype);
    var symbolExists = typeof Symbol !== "undefined";
    var mapExists = typeof Map !== "undefined";
    var setExists = typeof Set !== "undefined";
    var weakMapExists = typeof WeakMap !== "undefined";
    var weakSetExists = typeof WeakSet !== "undefined";
    var dataViewExists = typeof DataView !== "undefined";
    var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== "undefined";
    var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== "undefined";
    var setEntriesExists = setExists && typeof Set.prototype.entries === "function";
    var mapEntriesExists = mapExists && typeof Map.prototype.entries === "function";
    var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());
    var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());
    var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === "function";
    var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
    var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === "function";
    var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(""[Symbol.iterator]());
    var toStringLeftSliceLength = 8;
    var toStringRightSliceLength = -1;
    function typeDetect(obj) {
      var typeofObj = typeof obj;
      if (typeofObj !== "object") {
        return typeofObj;
      }
      if (obj === null) {
        return "null";
      }
      if (obj === globalObject) {
        return "global";
      }
      if (Array.isArray(obj) && (symbolToStringTagExists === false || !(Symbol.toStringTag in obj))) {
        return "Array";
      }
      if (typeof window === "object" && window !== null) {
        if (typeof window.location === "object" && obj === window.location) {
          return "Location";
        }
        if (typeof window.document === "object" && obj === window.document) {
          return "Document";
        }
        if (typeof window.navigator === "object") {
          if (typeof window.navigator.mimeTypes === "object" && obj === window.navigator.mimeTypes) {
            return "MimeTypeArray";
          }
          if (typeof window.navigator.plugins === "object" && obj === window.navigator.plugins) {
            return "PluginArray";
          }
        }
        if ((typeof window.HTMLElement === "function" || typeof window.HTMLElement === "object") && obj instanceof window.HTMLElement) {
          if (obj.tagName === "BLOCKQUOTE") {
            return "HTMLQuoteElement";
          }
          if (obj.tagName === "TD") {
            return "HTMLTableDataCellElement";
          }
          if (obj.tagName === "TH") {
            return "HTMLTableHeaderCellElement";
          }
        }
      }
      var stringTag = symbolToStringTagExists && obj[Symbol.toStringTag];
      if (typeof stringTag === "string") {
        return stringTag;
      }
      var objPrototype = Object.getPrototypeOf(obj);
      if (objPrototype === RegExp.prototype) {
        return "RegExp";
      }
      if (objPrototype === Date.prototype) {
        return "Date";
      }
      if (promiseExists && objPrototype === Promise.prototype) {
        return "Promise";
      }
      if (setExists && objPrototype === Set.prototype) {
        return "Set";
      }
      if (mapExists && objPrototype === Map.prototype) {
        return "Map";
      }
      if (weakSetExists && objPrototype === WeakSet.prototype) {
        return "WeakSet";
      }
      if (weakMapExists && objPrototype === WeakMap.prototype) {
        return "WeakMap";
      }
      if (dataViewExists && objPrototype === DataView.prototype) {
        return "DataView";
      }
      if (mapExists && objPrototype === mapIteratorPrototype) {
        return "Map Iterator";
      }
      if (setExists && objPrototype === setIteratorPrototype) {
        return "Set Iterator";
      }
      if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
        return "Array Iterator";
      }
      if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
        return "String Iterator";
      }
      if (objPrototype === null) {
        return "Object";
      }
      return Object.prototype.toString.call(obj).slice(toStringLeftSliceLength, toStringRightSliceLength);
    }
    return typeDetect;
  });
});

// node_modules/chai/lib/chai/utils/expectTypes.js
var require_expectTypes = __commonJS((exports, module) => {
  /*!
   * Chai - expectTypes utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  var AssertionError = require_assertion_error();
  var flag = require_flag();
  var type = require_type_detect();
  module.exports = function expectTypes(obj, types2) {
    var flagMsg = flag(obj, "message");
    var ssfi = flag(obj, "ssfi");
    flagMsg = flagMsg ? flagMsg + ": " : "";
    obj = flag(obj, "object");
    types2 = types2.map(function(t) {
      return t.toLowerCase();
    });
    types2.sort();
    var str = types2.map(function(t, index) {
      var art = ~["a", "e", "i", "o", "u"].indexOf(t.charAt(0)) ? "an" : "a";
      var or = types2.length > 1 && index === types2.length - 1 ? "or " : "";
      return or + art + " " + t;
    }).join(", ");
    var objType = type(obj).toLowerCase();
    if (!types2.some(function(expected) {
      return objType === expected;
    })) {
      throw new AssertionError(flagMsg + "object tested must be " + str + ", but " + objType + " given", undefined, ssfi);
    }
  };
});

// node_modules/chai/lib/chai/utils/getActual.js
var require_getActual = __commonJS((exports, module) => {
  /*!
   * Chai - getActual utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  module.exports = function getActual(obj, args) {
    return args.length > 4 ? args[4] : obj._obj;
  };
});

// node_modules/get-func-name/index.js
var require_get_func_name = __commonJS((exports, module) => {
  var toString = Function.prototype.toString;
  var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\s\(\/]+)/;
  var maxFunctionSourceLength = 512;
  function getFuncName(aFunc) {
    if (typeof aFunc !== "function") {
      return null;
    }
    var name = "";
    if (typeof Function.prototype.name === "undefined" && typeof aFunc.name === "undefined") {
      var functionSource = toString.call(aFunc);
      if (functionSource.indexOf("(") > maxFunctionSourceLength) {
        return name;
      }
      var match = functionSource.match(functionNameMatch);
      if (match) {
        name = match[1];
      }
    } else {
      name = aFunc.name;
    }
    return name;
  }
  module.exports = getFuncName;
});

// node_modules/chai/lib/chai/config.js
var require_config = __commonJS((exports, module) => {
  module.exports = {
    includeStack: false,
    showDiff: true,
    truncateThreshold: 40,
    useProxy: true,
    proxyExcludedKeys: ["then", "catch", "inspect", "toJSON"],
    deepEqual: null
  };
});

// node_modules/chai/lib/chai/utils/inspect.js
var require_inspect = __commonJS((exports, module) => {
  var getName = require_get_func_name();
  var loupe2 = require_loupe();
  var config = require_config();
  module.exports = inspect4;
  function inspect4(obj, showHidden, depth, colors) {
    var options = {
      colors,
      depth: typeof depth === "undefined" ? 2 : depth,
      showHidden,
      truncate: config.truncateThreshold ? config.truncateThreshold : Infinity
    };
    return loupe2.inspect(obj, options);
  }
});

// node_modules/chai/lib/chai/utils/objDisplay.js
var require_objDisplay = __commonJS((exports, module) => {
  /*!
   * Chai - flag utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  /*!
   * Module dependencies
   */
  var inspect4 = require_inspect();
  var config = require_config();
  module.exports = function objDisplay(obj) {
    var str = inspect4(obj), type = Object.prototype.toString.call(obj);
    if (config.truncateThreshold && str.length >= config.truncateThreshold) {
      if (type === "[object Function]") {
        return !obj.name || obj.name === "" ? "[Function]" : "[Function: " + obj.name + "]";
      } else if (type === "[object Array]") {
        return "[ Array(" + obj.length + ") ]";
      } else if (type === "[object Object]") {
        var keys = Object.keys(obj), kstr = keys.length > 2 ? keys.splice(0, 2).join(", ") + ", ..." : keys.join(", ");
        return "{ Object (" + kstr + ") }";
      } else {
        return str;
      }
    } else {
      return str;
    }
  };
});

// node_modules/chai/lib/chai/utils/getMessage.js
var require_getMessage = __commonJS((exports, module) => {
  /*!
   * Chai - message composition utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  /*!
   * Module dependencies
   */
  var flag = require_flag();
  var getActual = require_getActual();
  var objDisplay2 = require_objDisplay();
  module.exports = function getMessage(obj, args) {
    var negate = flag(obj, "negate"), val = flag(obj, "object"), expected = args[3], actual = getActual(obj, args), msg = negate ? args[2] : args[1], flagMsg = flag(obj, "message");
    if (typeof msg === "function")
      msg = msg();
    msg = msg || "";
    msg = msg.replace(/#\{this\}/g, function() {
      return objDisplay2(val);
    }).replace(/#\{act\}/g, function() {
      return objDisplay2(actual);
    }).replace(/#\{exp\}/g, function() {
      return objDisplay2(expected);
    });
    return flagMsg ? flagMsg + ": " + msg : msg;
  };
});

// node_modules/chai/lib/chai/utils/transferFlags.js
var require_transferFlags = __commonJS((exports, module) => {
  /*!
   * Chai - transferFlags utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  module.exports = function transferFlags(assertion, object, includeAll) {
    var flags = assertion.__flags || (assertion.__flags = Object.create(null));
    if (!object.__flags) {
      object.__flags = Object.create(null);
    }
    includeAll = arguments.length === 3 ? includeAll : true;
    for (var flag in flags) {
      if (includeAll || flag !== "object" && flag !== "ssfi" && flag !== "lockSsfi" && flag != "message") {
        object.__flags[flag] = flags[flag];
      }
    }
  };
});

// node_modules/deep-eql/index.js
var require_deep_eql = __commonJS((exports, module) => {
  /*!
   * deep-eql
   * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  var type = require_type_detect();
  function FakeMap() {
    this._key = "chai/deep-eql__" + Math.random() + Date.now();
  }
  FakeMap.prototype = {
    get: function get(key) {
      return key[this._key];
    },
    set: function set(key, value) {
      if (Object.isExtensible(key)) {
        Object.defineProperty(key, this._key, {
          value,
          configurable: true
        });
      }
    }
  };
  var MemoizeMap = typeof WeakMap === "function" ? WeakMap : FakeMap;
  /*!
   * Check to see if the MemoizeMap has recorded a result of the two operands
   *
   * @param {Mixed} leftHandOperand
   * @param {Mixed} rightHandOperand
   * @param {MemoizeMap} memoizeMap
   * @returns {Boolean|null} result
  */
  function memoizeCompare(leftHandOperand, rightHandOperand, memoizeMap) {
    if (!memoizeMap || isPrimitive3(leftHandOperand) || isPrimitive3(rightHandOperand)) {
      return null;
    }
    var leftHandMap = memoizeMap.get(leftHandOperand);
    if (leftHandMap) {
      var result = leftHandMap.get(rightHandOperand);
      if (typeof result === "boolean") {
        return result;
      }
    }
    return null;
  }
  /*!
   * Set the result of the equality into the MemoizeMap
   *
   * @param {Mixed} leftHandOperand
   * @param {Mixed} rightHandOperand
   * @param {MemoizeMap} memoizeMap
   * @param {Boolean} result
  */
  function memoizeSet(leftHandOperand, rightHandOperand, memoizeMap, result) {
    if (!memoizeMap || isPrimitive3(leftHandOperand) || isPrimitive3(rightHandOperand)) {
      return;
    }
    var leftHandMap = memoizeMap.get(leftHandOperand);
    if (leftHandMap) {
      leftHandMap.set(rightHandOperand, result);
    } else {
      leftHandMap = new MemoizeMap;
      leftHandMap.set(rightHandOperand, result);
      memoizeMap.set(leftHandOperand, leftHandMap);
    }
  }
  /*!
   * Primary Export
   */
  module.exports = deepEqual;
  module.exports.MemoizeMap = MemoizeMap;
  function deepEqual(leftHandOperand, rightHandOperand, options) {
    if (options && options.comparator) {
      return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
    }
    var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
    if (simpleResult !== null) {
      return simpleResult;
    }
    return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
  }
  function simpleEqual(leftHandOperand, rightHandOperand) {
    if (leftHandOperand === rightHandOperand) {
      return leftHandOperand !== 0 || 1 / leftHandOperand === 1 / rightHandOperand;
    }
    if (leftHandOperand !== leftHandOperand && rightHandOperand !== rightHandOperand) {
      return true;
    }
    if (isPrimitive3(leftHandOperand) || isPrimitive3(rightHandOperand)) {
      return false;
    }
    return null;
  }
  /*!
   * The main logic of the `deepEqual` function.
   *
   * @param {Mixed} leftHandOperand
   * @param {Mixed} rightHandOperand
   * @param {Object} [options] (optional) Additional options
   * @param {Array} [options.comparator] (optional) Override default algorithm, determining custom equality.
   * @param {Array} [options.memoize] (optional) Provide a custom memoization object which will cache the results of
      complex objects for a speed boost. By passing `false` you can disable memoization, but this will cause circular
      references to blow the stack.
   * @return {Boolean} equal match
  */
  function extensiveDeepEqual(leftHandOperand, rightHandOperand, options) {
    options = options || {};
    options.memoize = options.memoize === false ? false : options.memoize || new MemoizeMap;
    var comparator = options && options.comparator;
    var memoizeResultLeft = memoizeCompare(leftHandOperand, rightHandOperand, options.memoize);
    if (memoizeResultLeft !== null) {
      return memoizeResultLeft;
    }
    var memoizeResultRight = memoizeCompare(rightHandOperand, leftHandOperand, options.memoize);
    if (memoizeResultRight !== null) {
      return memoizeResultRight;
    }
    if (comparator) {
      var comparatorResult = comparator(leftHandOperand, rightHandOperand);
      if (comparatorResult === false || comparatorResult === true) {
        memoizeSet(leftHandOperand, rightHandOperand, options.memoize, comparatorResult);
        return comparatorResult;
      }
      var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
      if (simpleResult !== null) {
        return simpleResult;
      }
    }
    var leftHandType = type(leftHandOperand);
    if (leftHandType !== type(rightHandOperand)) {
      memoizeSet(leftHandOperand, rightHandOperand, options.memoize, false);
      return false;
    }
    memoizeSet(leftHandOperand, rightHandOperand, options.memoize, true);
    var result = extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options);
    memoizeSet(leftHandOperand, rightHandOperand, options.memoize, result);
    return result;
  }
  function extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options) {
    switch (leftHandType) {
      case "String":
      case "Number":
      case "Boolean":
      case "Date":
        return deepEqual(leftHandOperand.valueOf(), rightHandOperand.valueOf());
      case "Promise":
      case "Symbol":
      case "function":
      case "WeakMap":
      case "WeakSet":
        return leftHandOperand === rightHandOperand;
      case "Error":
        return keysEqual(leftHandOperand, rightHandOperand, ["name", "message", "code"], options);
      case "Arguments":
      case "Int8Array":
      case "Uint8Array":
      case "Uint8ClampedArray":
      case "Int16Array":
      case "Uint16Array":
      case "Int32Array":
      case "Uint32Array":
      case "Float32Array":
      case "Float64Array":
      case "Array":
        return iterableEqual(leftHandOperand, rightHandOperand, options);
      case "RegExp":
        return regexpEqual(leftHandOperand, rightHandOperand);
      case "Generator":
        return generatorEqual(leftHandOperand, rightHandOperand, options);
      case "DataView":
        return iterableEqual(new Uint8Array(leftHandOperand.buffer), new Uint8Array(rightHandOperand.buffer), options);
      case "ArrayBuffer":
        return iterableEqual(new Uint8Array(leftHandOperand), new Uint8Array(rightHandOperand), options);
      case "Set":
        return entriesEqual(leftHandOperand, rightHandOperand, options);
      case "Map":
        return entriesEqual(leftHandOperand, rightHandOperand, options);
      case "Temporal.PlainDate":
      case "Temporal.PlainTime":
      case "Temporal.PlainDateTime":
      case "Temporal.Instant":
      case "Temporal.ZonedDateTime":
      case "Temporal.PlainYearMonth":
      case "Temporal.PlainMonthDay":
        return leftHandOperand.equals(rightHandOperand);
      case "Temporal.Duration":
        return leftHandOperand.total("nanoseconds") === rightHandOperand.total("nanoseconds");
      case "Temporal.TimeZone":
      case "Temporal.Calendar":
        return leftHandOperand.toString() === rightHandOperand.toString();
      default:
        return objectEqual(leftHandOperand, rightHandOperand, options);
    }
  }
  /*!
   * Compare two Regular Expressions for equality.
   *
   * @param {RegExp} leftHandOperand
   * @param {RegExp} rightHandOperand
   * @return {Boolean} result
   */
  function regexpEqual(leftHandOperand, rightHandOperand) {
    return leftHandOperand.toString() === rightHandOperand.toString();
  }
  /*!
   * Compare two Sets/Maps for equality. Faster than other equality functions.
   *
   * @param {Set} leftHandOperand
   * @param {Set} rightHandOperand
   * @param {Object} [options] (Optional)
   * @return {Boolean} result
   */
  function entriesEqual(leftHandOperand, rightHandOperand, options) {
    try {
      if (leftHandOperand.size !== rightHandOperand.size) {
        return false;
      }
      if (leftHandOperand.size === 0) {
        return true;
      }
    } catch (sizeError) {
      return false;
    }
    var leftHandItems = [];
    var rightHandItems = [];
    leftHandOperand.forEach(function gatherEntries(key, value) {
      leftHandItems.push([key, value]);
    });
    rightHandOperand.forEach(function gatherEntries(key, value) {
      rightHandItems.push([key, value]);
    });
    return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options);
  }
  /*!
   * Simple equality for flat iterable objects such as Arrays, TypedArrays or Node.js buffers.
   *
   * @param {Iterable} leftHandOperand
   * @param {Iterable} rightHandOperand
   * @param {Object} [options] (Optional)
   * @return {Boolean} result
   */
  function iterableEqual(leftHandOperand, rightHandOperand, options) {
    var length = leftHandOperand.length;
    if (length !== rightHandOperand.length) {
      return false;
    }
    if (length === 0) {
      return true;
    }
    var index = -1;
    while (++index < length) {
      if (deepEqual(leftHandOperand[index], rightHandOperand[index], options) === false) {
        return false;
      }
    }
    return true;
  }
  /*!
   * Simple equality for generator objects such as those returned by generator functions.
   *
   * @param {Iterable} leftHandOperand
   * @param {Iterable} rightHandOperand
   * @param {Object} [options] (Optional)
   * @return {Boolean} result
   */
  function generatorEqual(leftHandOperand, rightHandOperand, options) {
    return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), options);
  }
  /*!
   * Determine if the given object has an @@iterator function.
   *
   * @param {Object} target
   * @return {Boolean} `true` if the object has an @@iterator function.
   */
  function hasIteratorFunction(target) {
    return typeof Symbol !== "undefined" && typeof target === "object" && typeof Symbol.iterator !== "undefined" && typeof target[Symbol.iterator] === "function";
  }
  /*!
   * Gets all iterator entries from the given Object. If the Object has no @@iterator function, returns an empty array.
   * This will consume the iterator - which could have side effects depending on the @@iterator implementation.
   *
   * @param {Object} target
   * @returns {Array} an array of entries from the @@iterator function
   */
  function getIteratorEntries(target) {
    if (hasIteratorFunction(target)) {
      try {
        return getGeneratorEntries(target[Symbol.iterator]());
      } catch (iteratorError) {
        return [];
      }
    }
    return [];
  }
  /*!
   * Gets all entries from a Generator. This will consume the generator - which could have side effects.
   *
   * @param {Generator} target
   * @returns {Array} an array of entries from the Generator.
   */
  function getGeneratorEntries(generator) {
    var generatorResult = generator.next();
    var accumulator = [generatorResult.value];
    while (generatorResult.done === false) {
      generatorResult = generator.next();
      accumulator.push(generatorResult.value);
    }
    return accumulator;
  }
  /*!
   * Gets all own and inherited enumerable keys from a target.
   *
   * @param {Object} target
   * @returns {Array} an array of own and inherited enumerable keys from the target.
   */
  function getEnumerableKeys(target) {
    var keys = [];
    for (var key in target) {
      keys.push(key);
    }
    return keys;
  }
  function getEnumerableSymbols(target) {
    var keys = [];
    var allKeys = Object.getOwnPropertySymbols(target);
    for (var i = 0;i < allKeys.length; i += 1) {
      var key = allKeys[i];
      if (Object.getOwnPropertyDescriptor(target, key).enumerable) {
        keys.push(key);
      }
    }
    return keys;
  }
  /*!
   * Determines if two objects have matching values, given a set of keys. Defers to deepEqual for the equality check of
   * each key. If any value of the given key is not equal, the function will return false (early).
   *
   * @param {Mixed} leftHandOperand
   * @param {Mixed} rightHandOperand
   * @param {Array} keys An array of keys to compare the values of leftHandOperand and rightHandOperand against
   * @param {Object} [options] (Optional)
   * @return {Boolean} result
   */
  function keysEqual(leftHandOperand, rightHandOperand, keys, options) {
    var length = keys.length;
    if (length === 0) {
      return true;
    }
    for (var i = 0;i < length; i += 1) {
      if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]], options) === false) {
        return false;
      }
    }
    return true;
  }
  /*!
   * Recursively check the equality of two Objects. Once basic sameness has been established it will defer to `deepEqual`
   * for each enumerable key in the object.
   *
   * @param {Mixed} leftHandOperand
   * @param {Mixed} rightHandOperand
   * @param {Object} [options] (Optional)
   * @return {Boolean} result
   */
  function objectEqual(leftHandOperand, rightHandOperand, options) {
    var leftHandKeys = getEnumerableKeys(leftHandOperand);
    var rightHandKeys = getEnumerableKeys(rightHandOperand);
    var leftHandSymbols = getEnumerableSymbols(leftHandOperand);
    var rightHandSymbols = getEnumerableSymbols(rightHandOperand);
    leftHandKeys = leftHandKeys.concat(leftHandSymbols);
    rightHandKeys = rightHandKeys.concat(rightHandSymbols);
    if (leftHandKeys.length && leftHandKeys.length === rightHandKeys.length) {
      if (iterableEqual(mapSymbols(leftHandKeys).sort(), mapSymbols(rightHandKeys).sort()) === false) {
        return false;
      }
      return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys, options);
    }
    var leftHandEntries = getIteratorEntries(leftHandOperand);
    var rightHandEntries = getIteratorEntries(rightHandOperand);
    if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
      leftHandEntries.sort();
      rightHandEntries.sort();
      return iterableEqual(leftHandEntries, rightHandEntries, options);
    }
    if (leftHandKeys.length === 0 && leftHandEntries.length === 0 && rightHandKeys.length === 0 && rightHandEntries.length === 0) {
      return true;
    }
    return false;
  }
  /*!
   * Returns true if the argument is a primitive.
   *
   * This intentionally returns true for all objects that can be compared by reference,
   * including functions and symbols.
   *
   * @param {Mixed} value
   * @return {Boolean} result
   */
  function isPrimitive3(value) {
    return value === null || typeof value !== "object";
  }
  function mapSymbols(arr) {
    return arr.map(function mapSymbol(entry) {
      if (typeof entry === "symbol") {
        return entry.toString();
      }
      return entry;
    });
  }
});

// node_modules/chai/lib/chai/utils/isProxyEnabled.js
var require_isProxyEnabled = __commonJS((exports, module) => {
  var config = require_config();
  /*!
   * Chai - isProxyEnabled helper
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  module.exports = function isProxyEnabled() {
    return config.useProxy && typeof Proxy !== "undefined" && typeof Reflect !== "undefined";
  };
});

// node_modules/chai/lib/chai/utils/addProperty.js
var require_addProperty = __commonJS((exports, module) => {
  /*!
   * Chai - addProperty utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  var chai2 = require_chai();
  var flag = require_flag();
  var isProxyEnabled = require_isProxyEnabled();
  var transferFlags = require_transferFlags();
  module.exports = function addProperty(ctx, name, getter) {
    getter = getter === undefined ? function() {} : getter;
    Object.defineProperty(ctx, name, {
      get: function propertyGetter() {
        if (!isProxyEnabled() && !flag(this, "lockSsfi")) {
          flag(this, "ssfi", propertyGetter);
        }
        var result = getter.call(this);
        if (result !== undefined)
          return result;
        var newAssertion = new chai2.Assertion;
        transferFlags(this, newAssertion);
        return newAssertion;
      },
      configurable: true
    });
  };
});

// node_modules/chai/lib/chai/utils/addLengthGuard.js
var require_addLengthGuard = __commonJS((exports, module) => {
  var fnLengthDesc = Object.getOwnPropertyDescriptor(function() {}, "length");
  /*!
   * Chai - addLengthGuard utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  module.exports = function addLengthGuard(fn, assertionName, isChainable) {
    if (!fnLengthDesc.configurable)
      return fn;
    Object.defineProperty(fn, "length", {
      get: function() {
        if (isChainable) {
          throw Error("Invalid Chai property: " + assertionName + ".length. Due" + ' to a compatibility issue, "length" cannot directly follow "' + assertionName + '". Use "' + assertionName + '.lengthOf" instead.');
        }
        throw Error("Invalid Chai property: " + assertionName + ".length. See" + ' docs for proper usage of "' + assertionName + '".');
      }
    });
    return fn;
  };
});

// node_modules/chai/lib/chai/utils/getProperties.js
var require_getProperties = __commonJS((exports, module) => {
  /*!
   * Chai - getProperties utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  module.exports = function getProperties(object) {
    var result = Object.getOwnPropertyNames(object);
    function addProperty(property) {
      if (result.indexOf(property) === -1) {
        result.push(property);
      }
    }
    var proto = Object.getPrototypeOf(object);
    while (proto !== null) {
      Object.getOwnPropertyNames(proto).forEach(addProperty);
      proto = Object.getPrototypeOf(proto);
    }
    return result;
  };
});

// node_modules/chai/lib/chai/utils/proxify.js
var require_proxify = __commonJS((exports, module) => {
  var config = require_config();
  var flag = require_flag();
  var getProperties = require_getProperties();
  var isProxyEnabled = require_isProxyEnabled();
  /*!
   * Chai - proxify utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  var builtins = ["__flags", "__methods", "_obj", "assert"];
  module.exports = function proxify(obj, nonChainableMethodName) {
    if (!isProxyEnabled())
      return obj;
    return new Proxy(obj, {
      get: function proxyGetter(target, property) {
        if (typeof property === "string" && config.proxyExcludedKeys.indexOf(property) === -1 && !Reflect.has(target, property)) {
          if (nonChainableMethodName) {
            throw Error("Invalid Chai property: " + nonChainableMethodName + "." + property + '. See docs for proper usage of "' + nonChainableMethodName + '".');
          }
          var suggestion = null;
          var suggestionDistance = 4;
          getProperties(target).forEach(function(prop) {
            if (!Object.prototype.hasOwnProperty(prop) && builtins.indexOf(prop) === -1) {
              var dist = stringDistanceCapped(property, prop, suggestionDistance);
              if (dist < suggestionDistance) {
                suggestion = prop;
                suggestionDistance = dist;
              }
            }
          });
          if (suggestion !== null) {
            throw Error("Invalid Chai property: " + property + '. Did you mean "' + suggestion + '"?');
          } else {
            throw Error("Invalid Chai property: " + property);
          }
        }
        if (builtins.indexOf(property) === -1 && !flag(target, "lockSsfi")) {
          flag(target, "ssfi", proxyGetter);
        }
        return Reflect.get(target, property);
      }
    });
  };
  function stringDistanceCapped(strA, strB, cap) {
    if (Math.abs(strA.length - strB.length) >= cap) {
      return cap;
    }
    var memo = [];
    for (var i = 0;i <= strA.length; i++) {
      memo[i] = Array(strB.length + 1).fill(0);
      memo[i][0] = i;
    }
    for (var j = 0;j < strB.length; j++) {
      memo[0][j] = j;
    }
    for (var i = 1;i <= strA.length; i++) {
      var ch = strA.charCodeAt(i - 1);
      for (var j = 1;j <= strB.length; j++) {
        if (Math.abs(i - j) >= cap) {
          memo[i][j] = cap;
          continue;
        }
        memo[i][j] = Math.min(memo[i - 1][j] + 1, memo[i][j - 1] + 1, memo[i - 1][j - 1] + (ch === strB.charCodeAt(j - 1) ? 0 : 1));
      }
    }
    return memo[strA.length][strB.length];
  }
});

// node_modules/chai/lib/chai/utils/addMethod.js
var require_addMethod = __commonJS((exports, module) => {
  /*!
   * Chai - addMethod utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  var addLengthGuard = require_addLengthGuard();
  var chai2 = require_chai();
  var flag = require_flag();
  var proxify = require_proxify();
  var transferFlags = require_transferFlags();
  module.exports = function addMethod(ctx, name, method) {
    var methodWrapper = function() {
      if (!flag(this, "lockSsfi")) {
        flag(this, "ssfi", methodWrapper);
      }
      var result = method.apply(this, arguments);
      if (result !== undefined)
        return result;
      var newAssertion = new chai2.Assertion;
      transferFlags(this, newAssertion);
      return newAssertion;
    };
    addLengthGuard(methodWrapper, name, false);
    ctx[name] = proxify(methodWrapper, name);
  };
});

// node_modules/chai/lib/chai/utils/overwriteProperty.js
var require_overwriteProperty = __commonJS((exports, module) => {
  /*!
   * Chai - overwriteProperty utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  var chai2 = require_chai();
  var flag = require_flag();
  var isProxyEnabled = require_isProxyEnabled();
  var transferFlags = require_transferFlags();
  module.exports = function overwriteProperty(ctx, name, getter) {
    var _get = Object.getOwnPropertyDescriptor(ctx, name), _super = function() {};
    if (_get && typeof _get.get === "function")
      _super = _get.get;
    Object.defineProperty(ctx, name, {
      get: function overwritingPropertyGetter() {
        if (!isProxyEnabled() && !flag(this, "lockSsfi")) {
          flag(this, "ssfi", overwritingPropertyGetter);
        }
        var origLockSsfi = flag(this, "lockSsfi");
        flag(this, "lockSsfi", true);
        var result = getter(_super).call(this);
        flag(this, "lockSsfi", origLockSsfi);
        if (result !== undefined) {
          return result;
        }
        var newAssertion = new chai2.Assertion;
        transferFlags(this, newAssertion);
        return newAssertion;
      },
      configurable: true
    });
  };
});

// node_modules/chai/lib/chai/utils/overwriteMethod.js
var require_overwriteMethod = __commonJS((exports, module) => {
  /*!
   * Chai - overwriteMethod utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  var addLengthGuard = require_addLengthGuard();
  var chai2 = require_chai();
  var flag = require_flag();
  var proxify = require_proxify();
  var transferFlags = require_transferFlags();
  module.exports = function overwriteMethod(ctx, name, method) {
    var _method = ctx[name], _super = function() {
      throw new Error(name + " is not a function");
    };
    if (_method && typeof _method === "function")
      _super = _method;
    var overwritingMethodWrapper = function() {
      if (!flag(this, "lockSsfi")) {
        flag(this, "ssfi", overwritingMethodWrapper);
      }
      var origLockSsfi = flag(this, "lockSsfi");
      flag(this, "lockSsfi", true);
      var result = method(_super).apply(this, arguments);
      flag(this, "lockSsfi", origLockSsfi);
      if (result !== undefined) {
        return result;
      }
      var newAssertion = new chai2.Assertion;
      transferFlags(this, newAssertion);
      return newAssertion;
    };
    addLengthGuard(overwritingMethodWrapper, name, false);
    ctx[name] = proxify(overwritingMethodWrapper, name);
  };
});

// node_modules/chai/lib/chai/utils/addChainableMethod.js
var require_addChainableMethod = __commonJS((exports, module) => {
  /*!
   * Chai - addChainingMethod utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  /*!
   * Module dependencies
   */
  var addLengthGuard = require_addLengthGuard();
  var chai2 = require_chai();
  var flag = require_flag();
  var proxify = require_proxify();
  var transferFlags = require_transferFlags();
  /*!
   * Module variables
   */
  var canSetPrototype = typeof Object.setPrototypeOf === "function";
  var testFn = function() {};
  var excludeNames = Object.getOwnPropertyNames(testFn).filter(function(name) {
    var propDesc = Object.getOwnPropertyDescriptor(testFn, name);
    if (typeof propDesc !== "object")
      return true;
    return !propDesc.configurable;
  });
  var call = Function.prototype.call;
  var apply = Function.prototype.apply;
  module.exports = function addChainableMethod(ctx, name, method, chainingBehavior) {
    if (typeof chainingBehavior !== "function") {
      chainingBehavior = function() {};
    }
    var chainableBehavior = {
      method,
      chainingBehavior
    };
    if (!ctx.__methods) {
      ctx.__methods = {};
    }
    ctx.__methods[name] = chainableBehavior;
    Object.defineProperty(ctx, name, {
      get: function chainableMethodGetter() {
        chainableBehavior.chainingBehavior.call(this);
        var chainableMethodWrapper = function() {
          if (!flag(this, "lockSsfi")) {
            flag(this, "ssfi", chainableMethodWrapper);
          }
          var result = chainableBehavior.method.apply(this, arguments);
          if (result !== undefined) {
            return result;
          }
          var newAssertion = new chai2.Assertion;
          transferFlags(this, newAssertion);
          return newAssertion;
        };
        addLengthGuard(chainableMethodWrapper, name, true);
        if (canSetPrototype) {
          var prototype = Object.create(this);
          prototype.call = call;
          prototype.apply = apply;
          Object.setPrototypeOf(chainableMethodWrapper, prototype);
        } else {
          var asserterNames = Object.getOwnPropertyNames(ctx);
          asserterNames.forEach(function(asserterName) {
            if (excludeNames.indexOf(asserterName) !== -1) {
              return;
            }
            var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
            Object.defineProperty(chainableMethodWrapper, asserterName, pd);
          });
        }
        transferFlags(this, chainableMethodWrapper);
        return proxify(chainableMethodWrapper);
      },
      configurable: true
    });
  };
});

// node_modules/chai/lib/chai/utils/overwriteChainableMethod.js
var require_overwriteChainableMethod = __commonJS((exports, module) => {
  /*!
   * Chai - overwriteChainableMethod utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  var chai2 = require_chai();
  var transferFlags = require_transferFlags();
  module.exports = function overwriteChainableMethod(ctx, name, method, chainingBehavior) {
    var chainableBehavior = ctx.__methods[name];
    var _chainingBehavior = chainableBehavior.chainingBehavior;
    chainableBehavior.chainingBehavior = function overwritingChainableMethodGetter() {
      var result = chainingBehavior(_chainingBehavior).call(this);
      if (result !== undefined) {
        return result;
      }
      var newAssertion = new chai2.Assertion;
      transferFlags(this, newAssertion);
      return newAssertion;
    };
    var _method = chainableBehavior.method;
    chainableBehavior.method = function overwritingChainableMethodWrapper() {
      var result = method(_method).apply(this, arguments);
      if (result !== undefined) {
        return result;
      }
      var newAssertion = new chai2.Assertion;
      transferFlags(this, newAssertion);
      return newAssertion;
    };
  };
});

// node_modules/chai/lib/chai/utils/compareByInspect.js
var require_compareByInspect = __commonJS((exports, module) => {
  /*!
   * Chai - compareByInspect utility
   * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  /*!
   * Module dependencies
   */
  var inspect4 = require_inspect();
  module.exports = function compareByInspect(a, b) {
    return inspect4(a) < inspect4(b) ? -1 : 1;
  };
});

// node_modules/chai/lib/chai/utils/getOwnEnumerablePropertySymbols.js
var require_getOwnEnumerablePropertySymbols = __commonJS((exports, module) => {
  /*!
   * Chai - getOwnEnumerablePropertySymbols utility
   * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  module.exports = function getOwnEnumerablePropertySymbols(obj) {
    if (typeof Object.getOwnPropertySymbols !== "function")
      return [];
    return Object.getOwnPropertySymbols(obj).filter(function(sym) {
      return Object.getOwnPropertyDescriptor(obj, sym).enumerable;
    });
  };
});

// node_modules/chai/lib/chai/utils/getOwnEnumerableProperties.js
var require_getOwnEnumerableProperties = __commonJS((exports, module) => {
  /*!
   * Chai - getOwnEnumerableProperties utility
   * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  /*!
   * Module dependencies
   */
  var getOwnEnumerablePropertySymbols = require_getOwnEnumerablePropertySymbols();
  module.exports = function getOwnEnumerableProperties(obj) {
    return Object.keys(obj).concat(getOwnEnumerablePropertySymbols(obj));
  };
});

// node_modules/check-error/index.js
var require_check_error = __commonJS((exports, module) => {
  var getFunctionName = require_get_func_name();
  function compatibleInstance(thrown, errorLike) {
    return errorLike instanceof Error && thrown === errorLike;
  }
  function compatibleConstructor(thrown, errorLike) {
    if (errorLike instanceof Error) {
      return thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor;
    } else if (errorLike.prototype instanceof Error || errorLike === Error) {
      return thrown.constructor === errorLike || thrown instanceof errorLike;
    }
    return false;
  }
  function compatibleMessage(thrown, errMatcher) {
    var comparisonString = typeof thrown === "string" ? thrown : thrown.message;
    if (errMatcher instanceof RegExp) {
      return errMatcher.test(comparisonString);
    } else if (typeof errMatcher === "string") {
      return comparisonString.indexOf(errMatcher) !== -1;
    }
    return false;
  }
  function getConstructorName(errorLike) {
    var constructorName = errorLike;
    if (errorLike instanceof Error) {
      constructorName = getFunctionName(errorLike.constructor);
    } else if (typeof errorLike === "function") {
      constructorName = getFunctionName(errorLike);
      if (constructorName === "") {
        var newConstructorName = getFunctionName(new errorLike);
        constructorName = newConstructorName || constructorName;
      }
    }
    return constructorName;
  }
  function getMessage(errorLike) {
    var msg = "";
    if (errorLike && errorLike.message) {
      msg = errorLike.message;
    } else if (typeof errorLike === "string") {
      msg = errorLike;
    }
    return msg;
  }
  module.exports = {
    compatibleInstance,
    compatibleConstructor,
    compatibleMessage,
    getMessage,
    getConstructorName
  };
});

// node_modules/chai/lib/chai/utils/isNaN.js
var require_isNaN = __commonJS((exports, module) => {
  /*!
   * Chai - isNaN utility
   * Copyright(c) 2012-2015 Sakthipriyan Vairamani <thechargingvolcano@gmail.com>
   * MIT Licensed
   */
  function isNaN2(value) {
    return value !== value;
  }
  module.exports = Number.isNaN || isNaN2;
});

// node_modules/chai/lib/chai/utils/getOperator.js
var require_getOperator = __commonJS((exports, module) => {
  var type = require_type_detect();
  var flag = require_flag();
  function isObjectType(obj) {
    var objectType = type(obj);
    var objectTypes = ["Array", "Object", "function"];
    return objectTypes.indexOf(objectType) !== -1;
  }
  module.exports = function getOperator(obj, args) {
    var operator = flag(obj, "operator");
    var negate = flag(obj, "negate");
    var expected = args[3];
    var msg = negate ? args[2] : args[1];
    if (operator) {
      return operator;
    }
    if (typeof msg === "function")
      msg = msg();
    msg = msg || "";
    if (!msg) {
      return;
    }
    if (/\shave\s/.test(msg)) {
      return;
    }
    var isObject3 = isObjectType(expected);
    if (/\snot\s/.test(msg)) {
      return isObject3 ? "notDeepStrictEqual" : "notStrictEqual";
    }
    return isObject3 ? "deepStrictEqual" : "strictEqual";
  };
});

// node_modules/chai/lib/chai/utils/index.js
var require_utils = __commonJS((exports) => {
  /*!
   * chai
   * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  /*!
   * Dependencies that are used for multiple exports are required here only once
   */
  var pathval = require_pathval();
  /*!
   * test utility
   */
  exports.test = require_test();
  /*!
   * type utility
   */
  exports.type = require_type_detect();
  /*!
   * expectTypes utility
   */
  exports.expectTypes = require_expectTypes();
  /*!
   * message utility
   */
  exports.getMessage = require_getMessage();
  /*!
   * actual utility
   */
  exports.getActual = require_getActual();
  /*!
   * Inspect util
   */
  exports.inspect = require_inspect();
  /*!
   * Object Display util
   */
  exports.objDisplay = require_objDisplay();
  /*!
   * Flag utility
   */
  exports.flag = require_flag();
  /*!
   * Flag transferring utility
   */
  exports.transferFlags = require_transferFlags();
  /*!
   * Deep equal utility
   */
  exports.eql = require_deep_eql();
  /*!
   * Deep path info
   */
  exports.getPathInfo = pathval.getPathInfo;
  /*!
   * Check if a property exists
   */
  exports.hasProperty = pathval.hasProperty;
  /*!
   * Function name
   */
  exports.getName = require_get_func_name();
  /*!
   * add Property
   */
  exports.addProperty = require_addProperty();
  /*!
   * add Method
   */
  exports.addMethod = require_addMethod();
  /*!
   * overwrite Property
   */
  exports.overwriteProperty = require_overwriteProperty();
  /*!
   * overwrite Method
   */
  exports.overwriteMethod = require_overwriteMethod();
  /*!
   * Add a chainable method
   */
  exports.addChainableMethod = require_addChainableMethod();
  /*!
   * Overwrite chainable method
   */
  exports.overwriteChainableMethod = require_overwriteChainableMethod();
  /*!
   * Compare by inspect method
   */
  exports.compareByInspect = require_compareByInspect();
  /*!
   * Get own enumerable property symbols method
   */
  exports.getOwnEnumerablePropertySymbols = require_getOwnEnumerablePropertySymbols();
  /*!
   * Get own enumerable properties method
   */
  exports.getOwnEnumerableProperties = require_getOwnEnumerableProperties();
  /*!
   * Checks error against a given set of criteria
   */
  exports.checkError = require_check_error();
  /*!
   * Proxify util
   */
  exports.proxify = require_proxify();
  /*!
   * addLengthGuard util
   */
  exports.addLengthGuard = require_addLengthGuard();
  /*!
   * isProxyEnabled helper
   */
  exports.isProxyEnabled = require_isProxyEnabled();
  /*!
   * isNaN method
   */
  exports.isNaN = require_isNaN();
  /*!
   * getOperator method
   */
  exports.getOperator = require_getOperator();
});

// node_modules/chai/lib/chai/assertion.js
var require_assertion = __commonJS((exports, module) => {
  /*!
   * chai
   * http://chaijs.com
   * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  var config = require_config();
  module.exports = function(_chai, util) {
    /*!
       * Module dependencies.
       */
    var AssertionError = _chai.AssertionError, flag = util.flag;
    /*!
       * Module export.
       */
    _chai.Assertion = Assertion;
    /*!
       * Assertion Constructor
       *
       * Creates object for chaining.
       *
       * `Assertion` objects contain metadata in the form of flags. Three flags can
       * be assigned during instantiation by passing arguments to this constructor:
       *
       * - `object`: This flag contains the target of the assertion. For example, in
       *   the assertion `expect(numKittens).to.equal(7);`, the `object` flag will
       *   contain `numKittens` so that the `equal` assertion can reference it when
       *   needed.
       *
       * - `message`: This flag contains an optional custom error message to be
       *   prepended to the error message that's generated by the assertion when it
       *   fails.
       *
       * - `ssfi`: This flag stands for "start stack function indicator". It
       *   contains a function reference that serves as the starting point for
       *   removing frames from the stack trace of the error that's created by the
       *   assertion when it fails. The goal is to provide a cleaner stack trace to
       *   end users by removing Chai's internal functions. Note that it only works
       *   in environments that support `Error.captureStackTrace`, and only when
       *   `Chai.config.includeStack` hasn't been set to `false`.
       *
       * - `lockSsfi`: This flag controls whether or not the given `ssfi` flag
       *   should retain its current value, even as assertions are chained off of
       *   this object. This is usually set to `true` when creating a new assertion
       *   from within another assertion. It's also temporarily set to `true` before
       *   an overwritten assertion gets called by the overwriting assertion.
       *
       * - `eql`: This flag contains the deepEqual function to be used by the assertion.
       *
       * @param {Mixed} obj target of the assertion
       * @param {String} msg (optional) custom error message
       * @param {Function} ssfi (optional) starting point for removing stack frames
       * @param {Boolean} lockSsfi (optional) whether or not the ssfi flag is locked
       * @api private
       */
    function Assertion(obj, msg, ssfi, lockSsfi) {
      flag(this, "ssfi", ssfi || Assertion);
      flag(this, "lockSsfi", lockSsfi);
      flag(this, "object", obj);
      flag(this, "message", msg);
      flag(this, "eql", config.deepEqual || util.eql);
      return util.proxify(this);
    }
    Object.defineProperty(Assertion, "includeStack", {
      get: function() {
        console.warn("Assertion.includeStack is deprecated, use chai.config.includeStack instead.");
        return config.includeStack;
      },
      set: function(value) {
        console.warn("Assertion.includeStack is deprecated, use chai.config.includeStack instead.");
        config.includeStack = value;
      }
    });
    Object.defineProperty(Assertion, "showDiff", {
      get: function() {
        console.warn("Assertion.showDiff is deprecated, use chai.config.showDiff instead.");
        return config.showDiff;
      },
      set: function(value) {
        console.warn("Assertion.showDiff is deprecated, use chai.config.showDiff instead.");
        config.showDiff = value;
      }
    });
    Assertion.addProperty = function(name, fn) {
      util.addProperty(this.prototype, name, fn);
    };
    Assertion.addMethod = function(name, fn) {
      util.addMethod(this.prototype, name, fn);
    };
    Assertion.addChainableMethod = function(name, fn, chainingBehavior) {
      util.addChainableMethod(this.prototype, name, fn, chainingBehavior);
    };
    Assertion.overwriteProperty = function(name, fn) {
      util.overwriteProperty(this.prototype, name, fn);
    };
    Assertion.overwriteMethod = function(name, fn) {
      util.overwriteMethod(this.prototype, name, fn);
    };
    Assertion.overwriteChainableMethod = function(name, fn, chainingBehavior) {
      util.overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
    };
    Assertion.prototype.assert = function(expr, msg, negateMsg, expected, _actual, showDiff) {
      var ok = util.test(this, arguments);
      if (showDiff !== false)
        showDiff = true;
      if (expected === undefined && _actual === undefined)
        showDiff = false;
      if (config.showDiff !== true)
        showDiff = false;
      if (!ok) {
        msg = util.getMessage(this, arguments);
        var actual = util.getActual(this, arguments);
        var assertionErrorObjectProperties = {
          actual,
          expected,
          showDiff
        };
        var operator = util.getOperator(this, arguments);
        if (operator) {
          assertionErrorObjectProperties.operator = operator;
        }
        throw new AssertionError(msg, assertionErrorObjectProperties, config.includeStack ? this.assert : flag(this, "ssfi"));
      }
    };
    /*!
       * ### ._obj
       *
       * Quick reference to stored `actual` value for plugin developers.
       *
       * @api private
       */
    Object.defineProperty(Assertion.prototype, "_obj", {
      get: function() {
        return flag(this, "object");
      },
      set: function(val) {
        flag(this, "object", val);
      }
    });
  };
});

// node_modules/chai/lib/chai/core/assertions.js
var require_assertions = __commonJS((exports, module) => {
  /*!
   * chai
   * http://chaijs.com
   * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  module.exports = function(chai2, _) {
    var { Assertion, AssertionError } = chai2, flag = _.flag;
    [
      "to",
      "be",
      "been",
      "is",
      "and",
      "has",
      "have",
      "with",
      "that",
      "which",
      "at",
      "of",
      "same",
      "but",
      "does",
      "still",
      "also"
    ].forEach(function(chain) {
      Assertion.addProperty(chain);
    });
    Assertion.addProperty("not", function() {
      flag(this, "negate", true);
    });
    Assertion.addProperty("deep", function() {
      flag(this, "deep", true);
    });
    Assertion.addProperty("nested", function() {
      flag(this, "nested", true);
    });
    Assertion.addProperty("own", function() {
      flag(this, "own", true);
    });
    Assertion.addProperty("ordered", function() {
      flag(this, "ordered", true);
    });
    Assertion.addProperty("any", function() {
      flag(this, "any", true);
      flag(this, "all", false);
    });
    Assertion.addProperty("all", function() {
      flag(this, "all", true);
      flag(this, "any", false);
    });
    function an(type, msg) {
      if (msg)
        flag(this, "message", msg);
      type = type.toLowerCase();
      var obj = flag(this, "object"), article = ~["a", "e", "i", "o", "u"].indexOf(type.charAt(0)) ? "an " : "a ";
      this.assert(type === _.type(obj).toLowerCase(), "expected #{this} to be " + article + type, "expected #{this} not to be " + article + type);
    }
    Assertion.addChainableMethod("an", an);
    Assertion.addChainableMethod("a", an);
    function SameValueZero(a, b) {
      return _.isNaN(a) && _.isNaN(b) || a === b;
    }
    function includeChainingBehavior() {
      flag(this, "contains", true);
    }
    function include(val, msg) {
      if (msg)
        flag(this, "message", msg);
      var obj = flag(this, "object"), objType = _.type(obj).toLowerCase(), flagMsg = flag(this, "message"), negate = flag(this, "negate"), ssfi = flag(this, "ssfi"), isDeep = flag(this, "deep"), descriptor = isDeep ? "deep " : "", isEql = isDeep ? flag(this, "eql") : SameValueZero;
      flagMsg = flagMsg ? flagMsg + ": " : "";
      var included = false;
      switch (objType) {
        case "string":
          included = obj.indexOf(val) !== -1;
          break;
        case "weakset":
          if (isDeep) {
            throw new AssertionError(flagMsg + "unable to use .deep.include with WeakSet", undefined, ssfi);
          }
          included = obj.has(val);
          break;
        case "map":
          obj.forEach(function(item) {
            included = included || isEql(item, val);
          });
          break;
        case "set":
          if (isDeep) {
            obj.forEach(function(item) {
              included = included || isEql(item, val);
            });
          } else {
            included = obj.has(val);
          }
          break;
        case "array":
          if (isDeep) {
            included = obj.some(function(item) {
              return isEql(item, val);
            });
          } else {
            included = obj.indexOf(val) !== -1;
          }
          break;
        default:
          if (val !== Object(val)) {
            throw new AssertionError(flagMsg + "the given combination of arguments (" + objType + " and " + _.type(val).toLowerCase() + ")" + " is invalid for this assertion. " + "You can use an array, a map, an object, a set, a string, " + "or a weakset instead of a " + _.type(val).toLowerCase(), undefined, ssfi);
          }
          var props = Object.keys(val), firstErr = null, numErrs = 0;
          props.forEach(function(prop) {
            var propAssertion = new Assertion(obj);
            _.transferFlags(this, propAssertion, true);
            flag(propAssertion, "lockSsfi", true);
            if (!negate || props.length === 1) {
              propAssertion.property(prop, val[prop]);
              return;
            }
            try {
              propAssertion.property(prop, val[prop]);
            } catch (err) {
              if (!_.checkError.compatibleConstructor(err, AssertionError)) {
                throw err;
              }
              if (firstErr === null)
                firstErr = err;
              numErrs++;
            }
          }, this);
          if (negate && props.length > 1 && numErrs === props.length) {
            throw firstErr;
          }
          return;
      }
      this.assert(included, "expected #{this} to " + descriptor + "include " + _.inspect(val), "expected #{this} to not " + descriptor + "include " + _.inspect(val));
    }
    Assertion.addChainableMethod("include", include, includeChainingBehavior);
    Assertion.addChainableMethod("contain", include, includeChainingBehavior);
    Assertion.addChainableMethod("contains", include, includeChainingBehavior);
    Assertion.addChainableMethod("includes", include, includeChainingBehavior);
    Assertion.addProperty("ok", function() {
      this.assert(flag(this, "object"), "expected #{this} to be truthy", "expected #{this} to be falsy");
    });
    Assertion.addProperty("true", function() {
      this.assert(flag(this, "object") === true, "expected #{this} to be true", "expected #{this} to be false", flag(this, "negate") ? false : true);
    });
    Assertion.addProperty("false", function() {
      this.assert(flag(this, "object") === false, "expected #{this} to be false", "expected #{this} to be true", flag(this, "negate") ? true : false);
    });
    Assertion.addProperty("null", function() {
      this.assert(flag(this, "object") === null, "expected #{this} to be null", "expected #{this} not to be null");
    });
    Assertion.addProperty("undefined", function() {
      this.assert(flag(this, "object") === undefined, "expected #{this} to be undefined", "expected #{this} not to be undefined");
    });
    Assertion.addProperty("NaN", function() {
      this.assert(_.isNaN(flag(this, "object")), "expected #{this} to be NaN", "expected #{this} not to be NaN");
    });
    function assertExist() {
      var val = flag(this, "object");
      this.assert(val !== null && val !== undefined, "expected #{this} to exist", "expected #{this} to not exist");
    }
    Assertion.addProperty("exist", assertExist);
    Assertion.addProperty("exists", assertExist);
    Assertion.addProperty("empty", function() {
      var val = flag(this, "object"), ssfi = flag(this, "ssfi"), flagMsg = flag(this, "message"), itemsCount;
      flagMsg = flagMsg ? flagMsg + ": " : "";
      switch (_.type(val).toLowerCase()) {
        case "array":
        case "string":
          itemsCount = val.length;
          break;
        case "map":
        case "set":
          itemsCount = val.size;
          break;
        case "weakmap":
        case "weakset":
          throw new AssertionError(flagMsg + ".empty was passed a weak collection", undefined, ssfi);
        case "function":
          var msg = flagMsg + ".empty was passed a function " + _.getName(val);
          throw new AssertionError(msg.trim(), undefined, ssfi);
        default:
          if (val !== Object(val)) {
            throw new AssertionError(flagMsg + ".empty was passed non-string primitive " + _.inspect(val), undefined, ssfi);
          }
          itemsCount = Object.keys(val).length;
      }
      this.assert(itemsCount === 0, "expected #{this} to be empty", "expected #{this} not to be empty");
    });
    function checkArguments() {
      var obj = flag(this, "object"), type = _.type(obj);
      this.assert(type === "Arguments", "expected #{this} to be arguments but got " + type, "expected #{this} to not be arguments");
    }
    Assertion.addProperty("arguments", checkArguments);
    Assertion.addProperty("Arguments", checkArguments);
    function assertEqual(val, msg) {
      if (msg)
        flag(this, "message", msg);
      var obj = flag(this, "object");
      if (flag(this, "deep")) {
        var prevLockSsfi = flag(this, "lockSsfi");
        flag(this, "lockSsfi", true);
        this.eql(val);
        flag(this, "lockSsfi", prevLockSsfi);
      } else {
        this.assert(val === obj, "expected #{this} to equal #{exp}", "expected #{this} to not equal #{exp}", val, this._obj, true);
      }
    }
    Assertion.addMethod("equal", assertEqual);
    Assertion.addMethod("equals", assertEqual);
    Assertion.addMethod("eq", assertEqual);
    function assertEql(obj, msg) {
      if (msg)
        flag(this, "message", msg);
      var eql = flag(this, "eql");
      this.assert(eql(obj, flag(this, "object")), "expected #{this} to deeply equal #{exp}", "expected #{this} to not deeply equal #{exp}", obj, this._obj, true);
    }
    Assertion.addMethod("eql", assertEql);
    Assertion.addMethod("eqls", assertEql);
    function assertAbove(n, msg) {
      if (msg)
        flag(this, "message", msg);
      var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), errorMessage, shouldThrow = true;
      if (doLength && objType !== "map" && objType !== "set") {
        new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
      }
      if (!doLength && (objType === "date" && nType !== "date")) {
        errorMessage = msgPrefix + "the argument to above must be a date";
      } else if (nType !== "number" && (doLength || objType === "number")) {
        errorMessage = msgPrefix + "the argument to above must be a number";
      } else if (!doLength && (objType !== "date" && objType !== "number")) {
        var printObj = objType === "string" ? "'" + obj + "'" : obj;
        errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
      } else {
        shouldThrow = false;
      }
      if (shouldThrow) {
        throw new AssertionError(errorMessage, undefined, ssfi);
      }
      if (doLength) {
        var descriptor = "length", itemsCount;
        if (objType === "map" || objType === "set") {
          descriptor = "size";
          itemsCount = obj.size;
        } else {
          itemsCount = obj.length;
        }
        this.assert(itemsCount > n, "expected #{this} to have a " + descriptor + " above #{exp} but got #{act}", "expected #{this} to not have a " + descriptor + " above #{exp}", n, itemsCount);
      } else {
        this.assert(obj > n, "expected #{this} to be above #{exp}", "expected #{this} to be at most #{exp}", n);
      }
    }
    Assertion.addMethod("above", assertAbove);
    Assertion.addMethod("gt", assertAbove);
    Assertion.addMethod("greaterThan", assertAbove);
    function assertLeast(n, msg) {
      if (msg)
        flag(this, "message", msg);
      var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), errorMessage, shouldThrow = true;
      if (doLength && objType !== "map" && objType !== "set") {
        new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
      }
      if (!doLength && (objType === "date" && nType !== "date")) {
        errorMessage = msgPrefix + "the argument to least must be a date";
      } else if (nType !== "number" && (doLength || objType === "number")) {
        errorMessage = msgPrefix + "the argument to least must be a number";
      } else if (!doLength && (objType !== "date" && objType !== "number")) {
        var printObj = objType === "string" ? "'" + obj + "'" : obj;
        errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
      } else {
        shouldThrow = false;
      }
      if (shouldThrow) {
        throw new AssertionError(errorMessage, undefined, ssfi);
      }
      if (doLength) {
        var descriptor = "length", itemsCount;
        if (objType === "map" || objType === "set") {
          descriptor = "size";
          itemsCount = obj.size;
        } else {
          itemsCount = obj.length;
        }
        this.assert(itemsCount >= n, "expected #{this} to have a " + descriptor + " at least #{exp} but got #{act}", "expected #{this} to have a " + descriptor + " below #{exp}", n, itemsCount);
      } else {
        this.assert(obj >= n, "expected #{this} to be at least #{exp}", "expected #{this} to be below #{exp}", n);
      }
    }
    Assertion.addMethod("least", assertLeast);
    Assertion.addMethod("gte", assertLeast);
    Assertion.addMethod("greaterThanOrEqual", assertLeast);
    function assertBelow(n, msg) {
      if (msg)
        flag(this, "message", msg);
      var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), errorMessage, shouldThrow = true;
      if (doLength && objType !== "map" && objType !== "set") {
        new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
      }
      if (!doLength && (objType === "date" && nType !== "date")) {
        errorMessage = msgPrefix + "the argument to below must be a date";
      } else if (nType !== "number" && (doLength || objType === "number")) {
        errorMessage = msgPrefix + "the argument to below must be a number";
      } else if (!doLength && (objType !== "date" && objType !== "number")) {
        var printObj = objType === "string" ? "'" + obj + "'" : obj;
        errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
      } else {
        shouldThrow = false;
      }
      if (shouldThrow) {
        throw new AssertionError(errorMessage, undefined, ssfi);
      }
      if (doLength) {
        var descriptor = "length", itemsCount;
        if (objType === "map" || objType === "set") {
          descriptor = "size";
          itemsCount = obj.size;
        } else {
          itemsCount = obj.length;
        }
        this.assert(itemsCount < n, "expected #{this} to have a " + descriptor + " below #{exp} but got #{act}", "expected #{this} to not have a " + descriptor + " below #{exp}", n, itemsCount);
      } else {
        this.assert(obj < n, "expected #{this} to be below #{exp}", "expected #{this} to be at least #{exp}", n);
      }
    }
    Assertion.addMethod("below", assertBelow);
    Assertion.addMethod("lt", assertBelow);
    Assertion.addMethod("lessThan", assertBelow);
    function assertMost(n, msg) {
      if (msg)
        flag(this, "message", msg);
      var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), errorMessage, shouldThrow = true;
      if (doLength && objType !== "map" && objType !== "set") {
        new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
      }
      if (!doLength && (objType === "date" && nType !== "date")) {
        errorMessage = msgPrefix + "the argument to most must be a date";
      } else if (nType !== "number" && (doLength || objType === "number")) {
        errorMessage = msgPrefix + "the argument to most must be a number";
      } else if (!doLength && (objType !== "date" && objType !== "number")) {
        var printObj = objType === "string" ? "'" + obj + "'" : obj;
        errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
      } else {
        shouldThrow = false;
      }
      if (shouldThrow) {
        throw new AssertionError(errorMessage, undefined, ssfi);
      }
      if (doLength) {
        var descriptor = "length", itemsCount;
        if (objType === "map" || objType === "set") {
          descriptor = "size";
          itemsCount = obj.size;
        } else {
          itemsCount = obj.length;
        }
        this.assert(itemsCount <= n, "expected #{this} to have a " + descriptor + " at most #{exp} but got #{act}", "expected #{this} to have a " + descriptor + " above #{exp}", n, itemsCount);
      } else {
        this.assert(obj <= n, "expected #{this} to be at most #{exp}", "expected #{this} to be above #{exp}", n);
      }
    }
    Assertion.addMethod("most", assertMost);
    Assertion.addMethod("lte", assertMost);
    Assertion.addMethod("lessThanOrEqual", assertMost);
    Assertion.addMethod("within", function(start, finish, msg) {
      if (msg)
        flag(this, "message", msg);
      var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), startType = _.type(start).toLowerCase(), finishType = _.type(finish).toLowerCase(), errorMessage, shouldThrow = true, range = startType === "date" && finishType === "date" ? start.toISOString() + ".." + finish.toISOString() : start + ".." + finish;
      if (doLength && objType !== "map" && objType !== "set") {
        new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
      }
      if (!doLength && (objType === "date" && (startType !== "date" || finishType !== "date"))) {
        errorMessage = msgPrefix + "the arguments to within must be dates";
      } else if ((startType !== "number" || finishType !== "number") && (doLength || objType === "number")) {
        errorMessage = msgPrefix + "the arguments to within must be numbers";
      } else if (!doLength && (objType !== "date" && objType !== "number")) {
        var printObj = objType === "string" ? "'" + obj + "'" : obj;
        errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
      } else {
        shouldThrow = false;
      }
      if (shouldThrow) {
        throw new AssertionError(errorMessage, undefined, ssfi);
      }
      if (doLength) {
        var descriptor = "length", itemsCount;
        if (objType === "map" || objType === "set") {
          descriptor = "size";
          itemsCount = obj.size;
        } else {
          itemsCount = obj.length;
        }
        this.assert(itemsCount >= start && itemsCount <= finish, "expected #{this} to have a " + descriptor + " within " + range, "expected #{this} to not have a " + descriptor + " within " + range);
      } else {
        this.assert(obj >= start && obj <= finish, "expected #{this} to be within " + range, "expected #{this} to not be within " + range);
      }
    });
    function assertInstanceOf(constructor, msg) {
      if (msg)
        flag(this, "message", msg);
      var target = flag(this, "object");
      var ssfi = flag(this, "ssfi");
      var flagMsg = flag(this, "message");
      try {
        var isInstanceOf = target instanceof constructor;
      } catch (err) {
        if (err instanceof TypeError) {
          flagMsg = flagMsg ? flagMsg + ": " : "";
          throw new AssertionError(flagMsg + "The instanceof assertion needs a constructor but " + _.type(constructor) + " was given.", undefined, ssfi);
        }
        throw err;
      }
      var name = _.getName(constructor);
      if (name === null) {
        name = "an unnamed constructor";
      }
      this.assert(isInstanceOf, "expected #{this} to be an instance of " + name, "expected #{this} to not be an instance of " + name);
    }
    Assertion.addMethod("instanceof", assertInstanceOf);
    Assertion.addMethod("instanceOf", assertInstanceOf);
    function assertProperty(name, val, msg) {
      if (msg)
        flag(this, "message", msg);
      var isNested = flag(this, "nested"), isOwn = flag(this, "own"), flagMsg = flag(this, "message"), obj = flag(this, "object"), ssfi = flag(this, "ssfi"), nameType = typeof name;
      flagMsg = flagMsg ? flagMsg + ": " : "";
      if (isNested) {
        if (nameType !== "string") {
          throw new AssertionError(flagMsg + "the argument to property must be a string when using nested syntax", undefined, ssfi);
        }
      } else {
        if (nameType !== "string" && nameType !== "number" && nameType !== "symbol") {
          throw new AssertionError(flagMsg + "the argument to property must be a string, number, or symbol", undefined, ssfi);
        }
      }
      if (isNested && isOwn) {
        throw new AssertionError(flagMsg + 'The "nested" and "own" flags cannot be combined.', undefined, ssfi);
      }
      if (obj === null || obj === undefined) {
        throw new AssertionError(flagMsg + "Target cannot be null or undefined.", undefined, ssfi);
      }
      var isDeep = flag(this, "deep"), negate = flag(this, "negate"), pathInfo = isNested ? _.getPathInfo(obj, name) : null, value = isNested ? pathInfo.value : obj[name], isEql = isDeep ? flag(this, "eql") : (val1, val2) => val1 === val2;
      var descriptor = "";
      if (isDeep)
        descriptor += "deep ";
      if (isOwn)
        descriptor += "own ";
      if (isNested)
        descriptor += "nested ";
      descriptor += "property ";
      var hasProperty;
      if (isOwn)
        hasProperty = Object.prototype.hasOwnProperty.call(obj, name);
      else if (isNested)
        hasProperty = pathInfo.exists;
      else
        hasProperty = _.hasProperty(obj, name);
      if (!negate || arguments.length === 1) {
        this.assert(hasProperty, "expected #{this} to have " + descriptor + _.inspect(name), "expected #{this} to not have " + descriptor + _.inspect(name));
      }
      if (arguments.length > 1) {
        this.assert(hasProperty && isEql(val, value), "expected #{this} to have " + descriptor + _.inspect(name) + " of #{exp}, but got #{act}", "expected #{this} to not have " + descriptor + _.inspect(name) + " of #{act}", val, value);
      }
      flag(this, "object", value);
    }
    Assertion.addMethod("property", assertProperty);
    function assertOwnProperty(name, value, msg) {
      flag(this, "own", true);
      assertProperty.apply(this, arguments);
    }
    Assertion.addMethod("ownProperty", assertOwnProperty);
    Assertion.addMethod("haveOwnProperty", assertOwnProperty);
    function assertOwnPropertyDescriptor(name, descriptor, msg) {
      if (typeof descriptor === "string") {
        msg = descriptor;
        descriptor = null;
      }
      if (msg)
        flag(this, "message", msg);
      var obj = flag(this, "object");
      var actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
      var eql = flag(this, "eql");
      if (actualDescriptor && descriptor) {
        this.assert(eql(descriptor, actualDescriptor), "expected the own property descriptor for " + _.inspect(name) + " on #{this} to match " + _.inspect(descriptor) + ", got " + _.inspect(actualDescriptor), "expected the own property descriptor for " + _.inspect(name) + " on #{this} to not match " + _.inspect(descriptor), descriptor, actualDescriptor, true);
      } else {
        this.assert(actualDescriptor, "expected #{this} to have an own property descriptor for " + _.inspect(name), "expected #{this} to not have an own property descriptor for " + _.inspect(name));
      }
      flag(this, "object", actualDescriptor);
    }
    Assertion.addMethod("ownPropertyDescriptor", assertOwnPropertyDescriptor);
    Assertion.addMethod("haveOwnPropertyDescriptor", assertOwnPropertyDescriptor);
    function assertLengthChain() {
      flag(this, "doLength", true);
    }
    function assertLength(n, msg) {
      if (msg)
        flag(this, "message", msg);
      var obj = flag(this, "object"), objType = _.type(obj).toLowerCase(), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi"), descriptor = "length", itemsCount;
      switch (objType) {
        case "map":
        case "set":
          descriptor = "size";
          itemsCount = obj.size;
          break;
        default:
          new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
          itemsCount = obj.length;
      }
      this.assert(itemsCount == n, "expected #{this} to have a " + descriptor + " of #{exp} but got #{act}", "expected #{this} to not have a " + descriptor + " of #{act}", n, itemsCount);
    }
    Assertion.addChainableMethod("length", assertLength, assertLengthChain);
    Assertion.addChainableMethod("lengthOf", assertLength, assertLengthChain);
    function assertMatch(re, msg) {
      if (msg)
        flag(this, "message", msg);
      var obj = flag(this, "object");
      this.assert(re.exec(obj), "expected #{this} to match " + re, "expected #{this} not to match " + re);
    }
    Assertion.addMethod("match", assertMatch);
    Assertion.addMethod("matches", assertMatch);
    Assertion.addMethod("string", function(str, msg) {
      if (msg)
        flag(this, "message", msg);
      var obj = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
      new Assertion(obj, flagMsg, ssfi, true).is.a("string");
      this.assert(~obj.indexOf(str), "expected #{this} to contain " + _.inspect(str), "expected #{this} to not contain " + _.inspect(str));
    });
    function assertKeys(keys) {
      var obj = flag(this, "object"), objType = _.type(obj), keysType = _.type(keys), ssfi = flag(this, "ssfi"), isDeep = flag(this, "deep"), str, deepStr = "", actual, ok = true, flagMsg = flag(this, "message");
      flagMsg = flagMsg ? flagMsg + ": " : "";
      var mixedArgsMsg = flagMsg + "when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments";
      if (objType === "Map" || objType === "Set") {
        deepStr = isDeep ? "deeply " : "";
        actual = [];
        obj.forEach(function(val, key) {
          actual.push(key);
        });
        if (keysType !== "Array") {
          keys = Array.prototype.slice.call(arguments);
        }
      } else {
        actual = _.getOwnEnumerableProperties(obj);
        switch (keysType) {
          case "Array":
            if (arguments.length > 1) {
              throw new AssertionError(mixedArgsMsg, undefined, ssfi);
            }
            break;
          case "Object":
            if (arguments.length > 1) {
              throw new AssertionError(mixedArgsMsg, undefined, ssfi);
            }
            keys = Object.keys(keys);
            break;
          default:
            keys = Array.prototype.slice.call(arguments);
        }
        keys = keys.map(function(val) {
          return typeof val === "symbol" ? val : String(val);
        });
      }
      if (!keys.length) {
        throw new AssertionError(flagMsg + "keys required", undefined, ssfi);
      }
      var len = keys.length, any = flag(this, "any"), all = flag(this, "all"), expected = keys, isEql = isDeep ? flag(this, "eql") : (val1, val2) => val1 === val2;
      if (!any && !all) {
        all = true;
      }
      if (any) {
        ok = expected.some(function(expectedKey) {
          return actual.some(function(actualKey) {
            return isEql(expectedKey, actualKey);
          });
        });
      }
      if (all) {
        ok = expected.every(function(expectedKey) {
          return actual.some(function(actualKey) {
            return isEql(expectedKey, actualKey);
          });
        });
        if (!flag(this, "contains")) {
          ok = ok && keys.length == actual.length;
        }
      }
      if (len > 1) {
        keys = keys.map(function(key) {
          return _.inspect(key);
        });
        var last = keys.pop();
        if (all) {
          str = keys.join(", ") + ", and " + last;
        }
        if (any) {
          str = keys.join(", ") + ", or " + last;
        }
      } else {
        str = _.inspect(keys[0]);
      }
      str = (len > 1 ? "keys " : "key ") + str;
      str = (flag(this, "contains") ? "contain " : "have ") + str;
      this.assert(ok, "expected #{this} to " + deepStr + str, "expected #{this} to not " + deepStr + str, expected.slice(0).sort(_.compareByInspect), actual.sort(_.compareByInspect), true);
    }
    Assertion.addMethod("keys", assertKeys);
    Assertion.addMethod("key", assertKeys);
    function assertThrows(errorLike, errMsgMatcher, msg) {
      if (msg)
        flag(this, "message", msg);
      var obj = flag(this, "object"), ssfi = flag(this, "ssfi"), flagMsg = flag(this, "message"), negate = flag(this, "negate") || false;
      new Assertion(obj, flagMsg, ssfi, true).is.a("function");
      if (errorLike instanceof RegExp || typeof errorLike === "string") {
        errMsgMatcher = errorLike;
        errorLike = null;
      }
      var caughtErr;
      try {
        obj();
      } catch (err) {
        caughtErr = err;
      }
      var everyArgIsUndefined = errorLike === undefined && errMsgMatcher === undefined;
      var everyArgIsDefined = Boolean(errorLike && errMsgMatcher);
      var errorLikeFail = false;
      var errMsgMatcherFail = false;
      if (everyArgIsUndefined || !everyArgIsUndefined && !negate) {
        var errorLikeString = "an error";
        if (errorLike instanceof Error) {
          errorLikeString = "#{exp}";
        } else if (errorLike) {
          errorLikeString = _.checkError.getConstructorName(errorLike);
        }
        this.assert(caughtErr, "expected #{this} to throw " + errorLikeString, "expected #{this} to not throw an error but #{act} was thrown", errorLike && errorLike.toString(), caughtErr instanceof Error ? caughtErr.toString() : typeof caughtErr === "string" ? caughtErr : caughtErr && _.checkError.getConstructorName(caughtErr));
      }
      if (errorLike && caughtErr) {
        if (errorLike instanceof Error) {
          var isCompatibleInstance = _.checkError.compatibleInstance(caughtErr, errorLike);
          if (isCompatibleInstance === negate) {
            if (everyArgIsDefined && negate) {
              errorLikeFail = true;
            } else {
              this.assert(negate, "expected #{this} to throw #{exp} but #{act} was thrown", "expected #{this} to not throw #{exp}" + (caughtErr && !negate ? " but #{act} was thrown" : ""), errorLike.toString(), caughtErr.toString());
            }
          }
        }
        var isCompatibleConstructor = _.checkError.compatibleConstructor(caughtErr, errorLike);
        if (isCompatibleConstructor === negate) {
          if (everyArgIsDefined && negate) {
            errorLikeFail = true;
          } else {
            this.assert(negate, "expected #{this} to throw #{exp} but #{act} was thrown", "expected #{this} to not throw #{exp}" + (caughtErr ? " but #{act} was thrown" : ""), errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike), caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr));
          }
        }
      }
      if (caughtErr && errMsgMatcher !== undefined && errMsgMatcher !== null) {
        var placeholder = "including";
        if (errMsgMatcher instanceof RegExp) {
          placeholder = "matching";
        }
        var isCompatibleMessage = _.checkError.compatibleMessage(caughtErr, errMsgMatcher);
        if (isCompatibleMessage === negate) {
          if (everyArgIsDefined && negate) {
            errMsgMatcherFail = true;
          } else {
            this.assert(negate, "expected #{this} to throw error " + placeholder + " #{exp} but got #{act}", "expected #{this} to throw error not " + placeholder + " #{exp}", errMsgMatcher, _.checkError.getMessage(caughtErr));
          }
        }
      }
      if (errorLikeFail && errMsgMatcherFail) {
        this.assert(negate, "expected #{this} to throw #{exp} but #{act} was thrown", "expected #{this} to not throw #{exp}" + (caughtErr ? " but #{act} was thrown" : ""), errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike), caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr));
      }
      flag(this, "object", caughtErr);
    }
    Assertion.addMethod("throw", assertThrows);
    Assertion.addMethod("throws", assertThrows);
    Assertion.addMethod("Throw", assertThrows);
    function respondTo(method, msg) {
      if (msg)
        flag(this, "message", msg);
      var obj = flag(this, "object"), itself = flag(this, "itself"), context = typeof obj === "function" && !itself ? obj.prototype[method] : obj[method];
      this.assert(typeof context === "function", "expected #{this} to respond to " + _.inspect(method), "expected #{this} to not respond to " + _.inspect(method));
    }
    Assertion.addMethod("respondTo", respondTo);
    Assertion.addMethod("respondsTo", respondTo);
    Assertion.addProperty("itself", function() {
      flag(this, "itself", true);
    });
    function satisfy(matcher, msg) {
      if (msg)
        flag(this, "message", msg);
      var obj = flag(this, "object");
      var result = matcher(obj);
      this.assert(result, "expected #{this} to satisfy " + _.objDisplay(matcher), "expected #{this} to not satisfy" + _.objDisplay(matcher), flag(this, "negate") ? false : true, result);
    }
    Assertion.addMethod("satisfy", satisfy);
    Assertion.addMethod("satisfies", satisfy);
    function closeTo(expected, delta, msg) {
      if (msg)
        flag(this, "message", msg);
      var obj = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
      new Assertion(obj, flagMsg, ssfi, true).is.a("number");
      if (typeof expected !== "number" || typeof delta !== "number") {
        flagMsg = flagMsg ? flagMsg + ": " : "";
        var deltaMessage = delta === undefined ? ", and a delta is required" : "";
        throw new AssertionError(flagMsg + "the arguments to closeTo or approximately must be numbers" + deltaMessage, undefined, ssfi);
      }
      this.assert(Math.abs(obj - expected) <= delta, "expected #{this} to be close to " + expected + " +/- " + delta, "expected #{this} not to be close to " + expected + " +/- " + delta);
    }
    Assertion.addMethod("closeTo", closeTo);
    Assertion.addMethod("approximately", closeTo);
    function isSubsetOf(subset, superset, cmp, contains, ordered) {
      if (!contains) {
        if (subset.length !== superset.length)
          return false;
        superset = superset.slice();
      }
      return subset.every(function(elem, idx) {
        if (ordered)
          return cmp ? cmp(elem, superset[idx]) : elem === superset[idx];
        if (!cmp) {
          var matchIdx = superset.indexOf(elem);
          if (matchIdx === -1)
            return false;
          if (!contains)
            superset.splice(matchIdx, 1);
          return true;
        }
        return superset.some(function(elem2, matchIdx2) {
          if (!cmp(elem, elem2))
            return false;
          if (!contains)
            superset.splice(matchIdx2, 1);
          return true;
        });
      });
    }
    Assertion.addMethod("members", function(subset, msg) {
      if (msg)
        flag(this, "message", msg);
      var obj = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
      new Assertion(obj, flagMsg, ssfi, true).to.be.an("array");
      new Assertion(subset, flagMsg, ssfi, true).to.be.an("array");
      var contains = flag(this, "contains");
      var ordered = flag(this, "ordered");
      var subject, failMsg, failNegateMsg;
      if (contains) {
        subject = ordered ? "an ordered superset" : "a superset";
        failMsg = "expected #{this} to be " + subject + " of #{exp}";
        failNegateMsg = "expected #{this} to not be " + subject + " of #{exp}";
      } else {
        subject = ordered ? "ordered members" : "members";
        failMsg = "expected #{this} to have the same " + subject + " as #{exp}";
        failNegateMsg = "expected #{this} to not have the same " + subject + " as #{exp}";
      }
      var cmp = flag(this, "deep") ? flag(this, "eql") : undefined;
      this.assert(isSubsetOf(subset, obj, cmp, contains, ordered), failMsg, failNegateMsg, subset, obj, true);
    });
    function oneOf(list, msg) {
      if (msg)
        flag(this, "message", msg);
      var expected = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi"), contains = flag(this, "contains"), isDeep = flag(this, "deep"), eql = flag(this, "eql");
      new Assertion(list, flagMsg, ssfi, true).to.be.an("array");
      if (contains) {
        this.assert(list.some(function(possibility) {
          return expected.indexOf(possibility) > -1;
        }), "expected #{this} to contain one of #{exp}", "expected #{this} to not contain one of #{exp}", list, expected);
      } else {
        if (isDeep) {
          this.assert(list.some(function(possibility) {
            return eql(expected, possibility);
          }), "expected #{this} to deeply equal one of #{exp}", "expected #{this} to deeply equal one of #{exp}", list, expected);
        } else {
          this.assert(list.indexOf(expected) > -1, "expected #{this} to be one of #{exp}", "expected #{this} to not be one of #{exp}", list, expected);
        }
      }
    }
    Assertion.addMethod("oneOf", oneOf);
    function assertChanges(subject, prop, msg) {
      if (msg)
        flag(this, "message", msg);
      var fn = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
      new Assertion(fn, flagMsg, ssfi, true).is.a("function");
      var initial;
      if (!prop) {
        new Assertion(subject, flagMsg, ssfi, true).is.a("function");
        initial = subject();
      } else {
        new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
        initial = subject[prop];
      }
      fn();
      var final = prop === undefined || prop === null ? subject() : subject[prop];
      var msgObj = prop === undefined || prop === null ? initial : "." + prop;
      flag(this, "deltaMsgObj", msgObj);
      flag(this, "initialDeltaValue", initial);
      flag(this, "finalDeltaValue", final);
      flag(this, "deltaBehavior", "change");
      flag(this, "realDelta", final !== initial);
      this.assert(initial !== final, "expected " + msgObj + " to change", "expected " + msgObj + " to not change");
    }
    Assertion.addMethod("change", assertChanges);
    Assertion.addMethod("changes", assertChanges);
    function assertIncreases(subject, prop, msg) {
      if (msg)
        flag(this, "message", msg);
      var fn = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
      new Assertion(fn, flagMsg, ssfi, true).is.a("function");
      var initial;
      if (!prop) {
        new Assertion(subject, flagMsg, ssfi, true).is.a("function");
        initial = subject();
      } else {
        new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
        initial = subject[prop];
      }
      new Assertion(initial, flagMsg, ssfi, true).is.a("number");
      fn();
      var final = prop === undefined || prop === null ? subject() : subject[prop];
      var msgObj = prop === undefined || prop === null ? initial : "." + prop;
      flag(this, "deltaMsgObj", msgObj);
      flag(this, "initialDeltaValue", initial);
      flag(this, "finalDeltaValue", final);
      flag(this, "deltaBehavior", "increase");
      flag(this, "realDelta", final - initial);
      this.assert(final - initial > 0, "expected " + msgObj + " to increase", "expected " + msgObj + " to not increase");
    }
    Assertion.addMethod("increase", assertIncreases);
    Assertion.addMethod("increases", assertIncreases);
    function assertDecreases(subject, prop, msg) {
      if (msg)
        flag(this, "message", msg);
      var fn = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
      new Assertion(fn, flagMsg, ssfi, true).is.a("function");
      var initial;
      if (!prop) {
        new Assertion(subject, flagMsg, ssfi, true).is.a("function");
        initial = subject();
      } else {
        new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
        initial = subject[prop];
      }
      new Assertion(initial, flagMsg, ssfi, true).is.a("number");
      fn();
      var final = prop === undefined || prop === null ? subject() : subject[prop];
      var msgObj = prop === undefined || prop === null ? initial : "." + prop;
      flag(this, "deltaMsgObj", msgObj);
      flag(this, "initialDeltaValue", initial);
      flag(this, "finalDeltaValue", final);
      flag(this, "deltaBehavior", "decrease");
      flag(this, "realDelta", initial - final);
      this.assert(final - initial < 0, "expected " + msgObj + " to decrease", "expected " + msgObj + " to not decrease");
    }
    Assertion.addMethod("decrease", assertDecreases);
    Assertion.addMethod("decreases", assertDecreases);
    function assertDelta(delta, msg) {
      if (msg)
        flag(this, "message", msg);
      var msgObj = flag(this, "deltaMsgObj");
      var initial = flag(this, "initialDeltaValue");
      var final = flag(this, "finalDeltaValue");
      var behavior = flag(this, "deltaBehavior");
      var realDelta = flag(this, "realDelta");
      var expression;
      if (behavior === "change") {
        expression = Math.abs(final - initial) === Math.abs(delta);
      } else {
        expression = realDelta === Math.abs(delta);
      }
      this.assert(expression, "expected " + msgObj + " to " + behavior + " by " + delta, "expected " + msgObj + " to not " + behavior + " by " + delta);
    }
    Assertion.addMethod("by", assertDelta);
    Assertion.addProperty("extensible", function() {
      var obj = flag(this, "object");
      var isExtensible = obj === Object(obj) && Object.isExtensible(obj);
      this.assert(isExtensible, "expected #{this} to be extensible", "expected #{this} to not be extensible");
    });
    Assertion.addProperty("sealed", function() {
      var obj = flag(this, "object");
      var isSealed = obj === Object(obj) ? Object.isSealed(obj) : true;
      this.assert(isSealed, "expected #{this} to be sealed", "expected #{this} to not be sealed");
    });
    Assertion.addProperty("frozen", function() {
      var obj = flag(this, "object");
      var isFrozen = obj === Object(obj) ? Object.isFrozen(obj) : true;
      this.assert(isFrozen, "expected #{this} to be frozen", "expected #{this} to not be frozen");
    });
    Assertion.addProperty("finite", function(msg) {
      var obj = flag(this, "object");
      this.assert(typeof obj === "number" && isFinite(obj), "expected #{this} to be a finite number", "expected #{this} to not be a finite number");
    });
  };
});

// node_modules/chai/lib/chai/interface/expect.js
var require_expect = __commonJS((exports, module) => {
  /*!
   * chai
   * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  module.exports = function(chai2, util) {
    chai2.expect = function(val, message) {
      return new chai2.Assertion(val, message);
    };
    chai2.expect.fail = function(actual, expected, message, operator) {
      if (arguments.length < 2) {
        message = actual;
        actual = undefined;
      }
      message = message || "expect.fail()";
      throw new chai2.AssertionError(message, {
        actual,
        expected,
        operator
      }, chai2.expect.fail);
    };
  };
});

// node_modules/chai/lib/chai/interface/should.js
var require_should = __commonJS((exports, module) => {
  /*!
   * chai
   * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  module.exports = function(chai2, util) {
    var Assertion = chai2.Assertion;
    function loadShould() {
      function shouldGetter() {
        if (this instanceof String || this instanceof Number || this instanceof Boolean || typeof Symbol === "function" && this instanceof Symbol || typeof BigInt === "function" && this instanceof BigInt) {
          return new Assertion(this.valueOf(), null, shouldGetter);
        }
        return new Assertion(this, null, shouldGetter);
      }
      function shouldSetter(value) {
        Object.defineProperty(this, "should", {
          value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      }
      Object.defineProperty(Object.prototype, "should", {
        set: shouldSetter,
        get: shouldGetter,
        configurable: true
      });
      var should = {};
      should.fail = function(actual, expected, message, operator) {
        if (arguments.length < 2) {
          message = actual;
          actual = undefined;
        }
        message = message || "should.fail()";
        throw new chai2.AssertionError(message, {
          actual,
          expected,
          operator
        }, should.fail);
      };
      should.equal = function(val1, val2, msg) {
        new Assertion(val1, msg).to.equal(val2);
      };
      should.Throw = function(fn, errt, errs, msg) {
        new Assertion(fn, msg).to.Throw(errt, errs);
      };
      should.exist = function(val, msg) {
        new Assertion(val, msg).to.exist;
      };
      should.not = {};
      should.not.equal = function(val1, val2, msg) {
        new Assertion(val1, msg).to.not.equal(val2);
      };
      should.not.Throw = function(fn, errt, errs, msg) {
        new Assertion(fn, msg).to.not.Throw(errt, errs);
      };
      should.not.exist = function(val, msg) {
        new Assertion(val, msg).to.not.exist;
      };
      should["throw"] = should["Throw"];
      should.not["throw"] = should.not["Throw"];
      return should;
    }
    chai2.should = loadShould;
    chai2.Should = loadShould;
  };
});

// node_modules/chai/lib/chai/interface/assert.js
var require_assert = __commonJS((exports, module) => {
  /*!
   * chai
   * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  module.exports = function(chai2, util) {
    /*!
       * Chai dependencies.
       */
    var Assertion = chai2.Assertion, flag = util.flag;
    /*!
       * Module export.
       */
    var assert = chai2.assert = function(express, errmsg) {
      var test2 = new Assertion(null, null, chai2.assert, true);
      test2.assert(express, errmsg, "[ negation message unavailable ]");
    };
    assert.fail = function(actual, expected, message, operator) {
      if (arguments.length < 2) {
        message = actual;
        actual = undefined;
      }
      message = message || "assert.fail()";
      throw new chai2.AssertionError(message, {
        actual,
        expected,
        operator
      }, assert.fail);
    };
    assert.isOk = function(val, msg) {
      new Assertion(val, msg, assert.isOk, true).is.ok;
    };
    assert.isNotOk = function(val, msg) {
      new Assertion(val, msg, assert.isNotOk, true).is.not.ok;
    };
    assert.equal = function(act, exp, msg) {
      var test2 = new Assertion(act, msg, assert.equal, true);
      test2.assert(exp == flag(test2, "object"), "expected #{this} to equal #{exp}", "expected #{this} to not equal #{act}", exp, act, true);
    };
    assert.notEqual = function(act, exp, msg) {
      var test2 = new Assertion(act, msg, assert.notEqual, true);
      test2.assert(exp != flag(test2, "object"), "expected #{this} to not equal #{exp}", "expected #{this} to equal #{act}", exp, act, true);
    };
    assert.strictEqual = function(act, exp, msg) {
      new Assertion(act, msg, assert.strictEqual, true).to.equal(exp);
    };
    assert.notStrictEqual = function(act, exp, msg) {
      new Assertion(act, msg, assert.notStrictEqual, true).to.not.equal(exp);
    };
    assert.deepEqual = assert.deepStrictEqual = function(act, exp, msg) {
      new Assertion(act, msg, assert.deepEqual, true).to.eql(exp);
    };
    assert.notDeepEqual = function(act, exp, msg) {
      new Assertion(act, msg, assert.notDeepEqual, true).to.not.eql(exp);
    };
    assert.isAbove = function(val, abv, msg) {
      new Assertion(val, msg, assert.isAbove, true).to.be.above(abv);
    };
    assert.isAtLeast = function(val, atlst, msg) {
      new Assertion(val, msg, assert.isAtLeast, true).to.be.least(atlst);
    };
    assert.isBelow = function(val, blw, msg) {
      new Assertion(val, msg, assert.isBelow, true).to.be.below(blw);
    };
    assert.isAtMost = function(val, atmst, msg) {
      new Assertion(val, msg, assert.isAtMost, true).to.be.most(atmst);
    };
    assert.isTrue = function(val, msg) {
      new Assertion(val, msg, assert.isTrue, true).is["true"];
    };
    assert.isNotTrue = function(val, msg) {
      new Assertion(val, msg, assert.isNotTrue, true).to.not.equal(true);
    };
    assert.isFalse = function(val, msg) {
      new Assertion(val, msg, assert.isFalse, true).is["false"];
    };
    assert.isNotFalse = function(val, msg) {
      new Assertion(val, msg, assert.isNotFalse, true).to.not.equal(false);
    };
    assert.isNull = function(val, msg) {
      new Assertion(val, msg, assert.isNull, true).to.equal(null);
    };
    assert.isNotNull = function(val, msg) {
      new Assertion(val, msg, assert.isNotNull, true).to.not.equal(null);
    };
    assert.isNaN = function(val, msg) {
      new Assertion(val, msg, assert.isNaN, true).to.be.NaN;
    };
    assert.isNotNaN = function(val, msg) {
      new Assertion(val, msg, assert.isNotNaN, true).not.to.be.NaN;
    };
    assert.exists = function(val, msg) {
      new Assertion(val, msg, assert.exists, true).to.exist;
    };
    assert.notExists = function(val, msg) {
      new Assertion(val, msg, assert.notExists, true).to.not.exist;
    };
    assert.isUndefined = function(val, msg) {
      new Assertion(val, msg, assert.isUndefined, true).to.equal(undefined);
    };
    assert.isDefined = function(val, msg) {
      new Assertion(val, msg, assert.isDefined, true).to.not.equal(undefined);
    };
    assert.isFunction = function(val, msg) {
      new Assertion(val, msg, assert.isFunction, true).to.be.a("function");
    };
    assert.isNotFunction = function(val, msg) {
      new Assertion(val, msg, assert.isNotFunction, true).to.not.be.a("function");
    };
    assert.isObject = function(val, msg) {
      new Assertion(val, msg, assert.isObject, true).to.be.a("object");
    };
    assert.isNotObject = function(val, msg) {
      new Assertion(val, msg, assert.isNotObject, true).to.not.be.a("object");
    };
    assert.isArray = function(val, msg) {
      new Assertion(val, msg, assert.isArray, true).to.be.an("array");
    };
    assert.isNotArray = function(val, msg) {
      new Assertion(val, msg, assert.isNotArray, true).to.not.be.an("array");
    };
    assert.isString = function(val, msg) {
      new Assertion(val, msg, assert.isString, true).to.be.a("string");
    };
    assert.isNotString = function(val, msg) {
      new Assertion(val, msg, assert.isNotString, true).to.not.be.a("string");
    };
    assert.isNumber = function(val, msg) {
      new Assertion(val, msg, assert.isNumber, true).to.be.a("number");
    };
    assert.isNotNumber = function(val, msg) {
      new Assertion(val, msg, assert.isNotNumber, true).to.not.be.a("number");
    };
    assert.isFinite = function(val, msg) {
      new Assertion(val, msg, assert.isFinite, true).to.be.finite;
    };
    assert.isBoolean = function(val, msg) {
      new Assertion(val, msg, assert.isBoolean, true).to.be.a("boolean");
    };
    assert.isNotBoolean = function(val, msg) {
      new Assertion(val, msg, assert.isNotBoolean, true).to.not.be.a("boolean");
    };
    assert.typeOf = function(val, type, msg) {
      new Assertion(val, msg, assert.typeOf, true).to.be.a(type);
    };
    assert.notTypeOf = function(val, type, msg) {
      new Assertion(val, msg, assert.notTypeOf, true).to.not.be.a(type);
    };
    assert.instanceOf = function(val, type, msg) {
      new Assertion(val, msg, assert.instanceOf, true).to.be.instanceOf(type);
    };
    assert.notInstanceOf = function(val, type, msg) {
      new Assertion(val, msg, assert.notInstanceOf, true).to.not.be.instanceOf(type);
    };
    assert.include = function(exp, inc, msg) {
      new Assertion(exp, msg, assert.include, true).include(inc);
    };
    assert.notInclude = function(exp, inc, msg) {
      new Assertion(exp, msg, assert.notInclude, true).not.include(inc);
    };
    assert.deepInclude = function(exp, inc, msg) {
      new Assertion(exp, msg, assert.deepInclude, true).deep.include(inc);
    };
    assert.notDeepInclude = function(exp, inc, msg) {
      new Assertion(exp, msg, assert.notDeepInclude, true).not.deep.include(inc);
    };
    assert.nestedInclude = function(exp, inc, msg) {
      new Assertion(exp, msg, assert.nestedInclude, true).nested.include(inc);
    };
    assert.notNestedInclude = function(exp, inc, msg) {
      new Assertion(exp, msg, assert.notNestedInclude, true).not.nested.include(inc);
    };
    assert.deepNestedInclude = function(exp, inc, msg) {
      new Assertion(exp, msg, assert.deepNestedInclude, true).deep.nested.include(inc);
    };
    assert.notDeepNestedInclude = function(exp, inc, msg) {
      new Assertion(exp, msg, assert.notDeepNestedInclude, true).not.deep.nested.include(inc);
    };
    assert.ownInclude = function(exp, inc, msg) {
      new Assertion(exp, msg, assert.ownInclude, true).own.include(inc);
    };
    assert.notOwnInclude = function(exp, inc, msg) {
      new Assertion(exp, msg, assert.notOwnInclude, true).not.own.include(inc);
    };
    assert.deepOwnInclude = function(exp, inc, msg) {
      new Assertion(exp, msg, assert.deepOwnInclude, true).deep.own.include(inc);
    };
    assert.notDeepOwnInclude = function(exp, inc, msg) {
      new Assertion(exp, msg, assert.notDeepOwnInclude, true).not.deep.own.include(inc);
    };
    assert.match = function(exp, re, msg) {
      new Assertion(exp, msg, assert.match, true).to.match(re);
    };
    assert.notMatch = function(exp, re, msg) {
      new Assertion(exp, msg, assert.notMatch, true).to.not.match(re);
    };
    assert.property = function(obj, prop, msg) {
      new Assertion(obj, msg, assert.property, true).to.have.property(prop);
    };
    assert.notProperty = function(obj, prop, msg) {
      new Assertion(obj, msg, assert.notProperty, true).to.not.have.property(prop);
    };
    assert.propertyVal = function(obj, prop, val, msg) {
      new Assertion(obj, msg, assert.propertyVal, true).to.have.property(prop, val);
    };
    assert.notPropertyVal = function(obj, prop, val, msg) {
      new Assertion(obj, msg, assert.notPropertyVal, true).to.not.have.property(prop, val);
    };
    assert.deepPropertyVal = function(obj, prop, val, msg) {
      new Assertion(obj, msg, assert.deepPropertyVal, true).to.have.deep.property(prop, val);
    };
    assert.notDeepPropertyVal = function(obj, prop, val, msg) {
      new Assertion(obj, msg, assert.notDeepPropertyVal, true).to.not.have.deep.property(prop, val);
    };
    assert.ownProperty = function(obj, prop, msg) {
      new Assertion(obj, msg, assert.ownProperty, true).to.have.own.property(prop);
    };
    assert.notOwnProperty = function(obj, prop, msg) {
      new Assertion(obj, msg, assert.notOwnProperty, true).to.not.have.own.property(prop);
    };
    assert.ownPropertyVal = function(obj, prop, value, msg) {
      new Assertion(obj, msg, assert.ownPropertyVal, true).to.have.own.property(prop, value);
    };
    assert.notOwnPropertyVal = function(obj, prop, value, msg) {
      new Assertion(obj, msg, assert.notOwnPropertyVal, true).to.not.have.own.property(prop, value);
    };
    assert.deepOwnPropertyVal = function(obj, prop, value, msg) {
      new Assertion(obj, msg, assert.deepOwnPropertyVal, true).to.have.deep.own.property(prop, value);
    };
    assert.notDeepOwnPropertyVal = function(obj, prop, value, msg) {
      new Assertion(obj, msg, assert.notDeepOwnPropertyVal, true).to.not.have.deep.own.property(prop, value);
    };
    assert.nestedProperty = function(obj, prop, msg) {
      new Assertion(obj, msg, assert.nestedProperty, true).to.have.nested.property(prop);
    };
    assert.notNestedProperty = function(obj, prop, msg) {
      new Assertion(obj, msg, assert.notNestedProperty, true).to.not.have.nested.property(prop);
    };
    assert.nestedPropertyVal = function(obj, prop, val, msg) {
      new Assertion(obj, msg, assert.nestedPropertyVal, true).to.have.nested.property(prop, val);
    };
    assert.notNestedPropertyVal = function(obj, prop, val, msg) {
      new Assertion(obj, msg, assert.notNestedPropertyVal, true).to.not.have.nested.property(prop, val);
    };
    assert.deepNestedPropertyVal = function(obj, prop, val, msg) {
      new Assertion(obj, msg, assert.deepNestedPropertyVal, true).to.have.deep.nested.property(prop, val);
    };
    assert.notDeepNestedPropertyVal = function(obj, prop, val, msg) {
      new Assertion(obj, msg, assert.notDeepNestedPropertyVal, true).to.not.have.deep.nested.property(prop, val);
    };
    assert.lengthOf = function(exp, len, msg) {
      new Assertion(exp, msg, assert.lengthOf, true).to.have.lengthOf(len);
    };
    assert.hasAnyKeys = function(obj, keys, msg) {
      new Assertion(obj, msg, assert.hasAnyKeys, true).to.have.any.keys(keys);
    };
    assert.hasAllKeys = function(obj, keys, msg) {
      new Assertion(obj, msg, assert.hasAllKeys, true).to.have.all.keys(keys);
    };
    assert.containsAllKeys = function(obj, keys, msg) {
      new Assertion(obj, msg, assert.containsAllKeys, true).to.contain.all.keys(keys);
    };
    assert.doesNotHaveAnyKeys = function(obj, keys, msg) {
      new Assertion(obj, msg, assert.doesNotHaveAnyKeys, true).to.not.have.any.keys(keys);
    };
    assert.doesNotHaveAllKeys = function(obj, keys, msg) {
      new Assertion(obj, msg, assert.doesNotHaveAllKeys, true).to.not.have.all.keys(keys);
    };
    assert.hasAnyDeepKeys = function(obj, keys, msg) {
      new Assertion(obj, msg, assert.hasAnyDeepKeys, true).to.have.any.deep.keys(keys);
    };
    assert.hasAllDeepKeys = function(obj, keys, msg) {
      new Assertion(obj, msg, assert.hasAllDeepKeys, true).to.have.all.deep.keys(keys);
    };
    assert.containsAllDeepKeys = function(obj, keys, msg) {
      new Assertion(obj, msg, assert.containsAllDeepKeys, true).to.contain.all.deep.keys(keys);
    };
    assert.doesNotHaveAnyDeepKeys = function(obj, keys, msg) {
      new Assertion(obj, msg, assert.doesNotHaveAnyDeepKeys, true).to.not.have.any.deep.keys(keys);
    };
    assert.doesNotHaveAllDeepKeys = function(obj, keys, msg) {
      new Assertion(obj, msg, assert.doesNotHaveAllDeepKeys, true).to.not.have.all.deep.keys(keys);
    };
    assert.throws = function(fn, errorLike, errMsgMatcher, msg) {
      if (typeof errorLike === "string" || errorLike instanceof RegExp) {
        errMsgMatcher = errorLike;
        errorLike = null;
      }
      var assertErr = new Assertion(fn, msg, assert.throws, true).to.throw(errorLike, errMsgMatcher);
      return flag(assertErr, "object");
    };
    assert.doesNotThrow = function(fn, errorLike, errMsgMatcher, msg) {
      if (typeof errorLike === "string" || errorLike instanceof RegExp) {
        errMsgMatcher = errorLike;
        errorLike = null;
      }
      new Assertion(fn, msg, assert.doesNotThrow, true).to.not.throw(errorLike, errMsgMatcher);
    };
    assert.operator = function(val, operator, val2, msg) {
      var ok;
      switch (operator) {
        case "==":
          ok = val == val2;
          break;
        case "===":
          ok = val === val2;
          break;
        case ">":
          ok = val > val2;
          break;
        case ">=":
          ok = val >= val2;
          break;
        case "<":
          ok = val < val2;
          break;
        case "<=":
          ok = val <= val2;
          break;
        case "!=":
          ok = val != val2;
          break;
        case "!==":
          ok = val !== val2;
          break;
        default:
          msg = msg ? msg + ": " : msg;
          throw new chai2.AssertionError(msg + 'Invalid operator "' + operator + '"', undefined, assert.operator);
      }
      var test2 = new Assertion(ok, msg, assert.operator, true);
      test2.assert(flag(test2, "object") === true, "expected " + util.inspect(val) + " to be " + operator + " " + util.inspect(val2), "expected " + util.inspect(val) + " to not be " + operator + " " + util.inspect(val2));
    };
    assert.closeTo = function(act, exp, delta, msg) {
      new Assertion(act, msg, assert.closeTo, true).to.be.closeTo(exp, delta);
    };
    assert.approximately = function(act, exp, delta, msg) {
      new Assertion(act, msg, assert.approximately, true).to.be.approximately(exp, delta);
    };
    assert.sameMembers = function(set1, set2, msg) {
      new Assertion(set1, msg, assert.sameMembers, true).to.have.same.members(set2);
    };
    assert.notSameMembers = function(set1, set2, msg) {
      new Assertion(set1, msg, assert.notSameMembers, true).to.not.have.same.members(set2);
    };
    assert.sameDeepMembers = function(set1, set2, msg) {
      new Assertion(set1, msg, assert.sameDeepMembers, true).to.have.same.deep.members(set2);
    };
    assert.notSameDeepMembers = function(set1, set2, msg) {
      new Assertion(set1, msg, assert.notSameDeepMembers, true).to.not.have.same.deep.members(set2);
    };
    assert.sameOrderedMembers = function(set1, set2, msg) {
      new Assertion(set1, msg, assert.sameOrderedMembers, true).to.have.same.ordered.members(set2);
    };
    assert.notSameOrderedMembers = function(set1, set2, msg) {
      new Assertion(set1, msg, assert.notSameOrderedMembers, true).to.not.have.same.ordered.members(set2);
    };
    assert.sameDeepOrderedMembers = function(set1, set2, msg) {
      new Assertion(set1, msg, assert.sameDeepOrderedMembers, true).to.have.same.deep.ordered.members(set2);
    };
    assert.notSameDeepOrderedMembers = function(set1, set2, msg) {
      new Assertion(set1, msg, assert.notSameDeepOrderedMembers, true).to.not.have.same.deep.ordered.members(set2);
    };
    assert.includeMembers = function(superset, subset, msg) {
      new Assertion(superset, msg, assert.includeMembers, true).to.include.members(subset);
    };
    assert.notIncludeMembers = function(superset, subset, msg) {
      new Assertion(superset, msg, assert.notIncludeMembers, true).to.not.include.members(subset);
    };
    assert.includeDeepMembers = function(superset, subset, msg) {
      new Assertion(superset, msg, assert.includeDeepMembers, true).to.include.deep.members(subset);
    };
    assert.notIncludeDeepMembers = function(superset, subset, msg) {
      new Assertion(superset, msg, assert.notIncludeDeepMembers, true).to.not.include.deep.members(subset);
    };
    assert.includeOrderedMembers = function(superset, subset, msg) {
      new Assertion(superset, msg, assert.includeOrderedMembers, true).to.include.ordered.members(subset);
    };
    assert.notIncludeOrderedMembers = function(superset, subset, msg) {
      new Assertion(superset, msg, assert.notIncludeOrderedMembers, true).to.not.include.ordered.members(subset);
    };
    assert.includeDeepOrderedMembers = function(superset, subset, msg) {
      new Assertion(superset, msg, assert.includeDeepOrderedMembers, true).to.include.deep.ordered.members(subset);
    };
    assert.notIncludeDeepOrderedMembers = function(superset, subset, msg) {
      new Assertion(superset, msg, assert.notIncludeDeepOrderedMembers, true).to.not.include.deep.ordered.members(subset);
    };
    assert.oneOf = function(inList, list, msg) {
      new Assertion(inList, msg, assert.oneOf, true).to.be.oneOf(list);
    };
    assert.changes = function(fn, obj, prop, msg) {
      if (arguments.length === 3 && typeof obj === "function") {
        msg = prop;
        prop = null;
      }
      new Assertion(fn, msg, assert.changes, true).to.change(obj, prop);
    };
    assert.changesBy = function(fn, obj, prop, delta, msg) {
      if (arguments.length === 4 && typeof obj === "function") {
        var tmpMsg = delta;
        delta = prop;
        msg = tmpMsg;
      } else if (arguments.length === 3) {
        delta = prop;
        prop = null;
      }
      new Assertion(fn, msg, assert.changesBy, true).to.change(obj, prop).by(delta);
    };
    assert.doesNotChange = function(fn, obj, prop, msg) {
      if (arguments.length === 3 && typeof obj === "function") {
        msg = prop;
        prop = null;
      }
      return new Assertion(fn, msg, assert.doesNotChange, true).to.not.change(obj, prop);
    };
    assert.changesButNotBy = function(fn, obj, prop, delta, msg) {
      if (arguments.length === 4 && typeof obj === "function") {
        var tmpMsg = delta;
        delta = prop;
        msg = tmpMsg;
      } else if (arguments.length === 3) {
        delta = prop;
        prop = null;
      }
      new Assertion(fn, msg, assert.changesButNotBy, true).to.change(obj, prop).but.not.by(delta);
    };
    assert.increases = function(fn, obj, prop, msg) {
      if (arguments.length === 3 && typeof obj === "function") {
        msg = prop;
        prop = null;
      }
      return new Assertion(fn, msg, assert.increases, true).to.increase(obj, prop);
    };
    assert.increasesBy = function(fn, obj, prop, delta, msg) {
      if (arguments.length === 4 && typeof obj === "function") {
        var tmpMsg = delta;
        delta = prop;
        msg = tmpMsg;
      } else if (arguments.length === 3) {
        delta = prop;
        prop = null;
      }
      new Assertion(fn, msg, assert.increasesBy, true).to.increase(obj, prop).by(delta);
    };
    assert.doesNotIncrease = function(fn, obj, prop, msg) {
      if (arguments.length === 3 && typeof obj === "function") {
        msg = prop;
        prop = null;
      }
      return new Assertion(fn, msg, assert.doesNotIncrease, true).to.not.increase(obj, prop);
    };
    assert.increasesButNotBy = function(fn, obj, prop, delta, msg) {
      if (arguments.length === 4 && typeof obj === "function") {
        var tmpMsg = delta;
        delta = prop;
        msg = tmpMsg;
      } else if (arguments.length === 3) {
        delta = prop;
        prop = null;
      }
      new Assertion(fn, msg, assert.increasesButNotBy, true).to.increase(obj, prop).but.not.by(delta);
    };
    assert.decreases = function(fn, obj, prop, msg) {
      if (arguments.length === 3 && typeof obj === "function") {
        msg = prop;
        prop = null;
      }
      return new Assertion(fn, msg, assert.decreases, true).to.decrease(obj, prop);
    };
    assert.decreasesBy = function(fn, obj, prop, delta, msg) {
      if (arguments.length === 4 && typeof obj === "function") {
        var tmpMsg = delta;
        delta = prop;
        msg = tmpMsg;
      } else if (arguments.length === 3) {
        delta = prop;
        prop = null;
      }
      new Assertion(fn, msg, assert.decreasesBy, true).to.decrease(obj, prop).by(delta);
    };
    assert.doesNotDecrease = function(fn, obj, prop, msg) {
      if (arguments.length === 3 && typeof obj === "function") {
        msg = prop;
        prop = null;
      }
      return new Assertion(fn, msg, assert.doesNotDecrease, true).to.not.decrease(obj, prop);
    };
    assert.doesNotDecreaseBy = function(fn, obj, prop, delta, msg) {
      if (arguments.length === 4 && typeof obj === "function") {
        var tmpMsg = delta;
        delta = prop;
        msg = tmpMsg;
      } else if (arguments.length === 3) {
        delta = prop;
        prop = null;
      }
      return new Assertion(fn, msg, assert.doesNotDecreaseBy, true).to.not.decrease(obj, prop).by(delta);
    };
    assert.decreasesButNotBy = function(fn, obj, prop, delta, msg) {
      if (arguments.length === 4 && typeof obj === "function") {
        var tmpMsg = delta;
        delta = prop;
        msg = tmpMsg;
      } else if (arguments.length === 3) {
        delta = prop;
        prop = null;
      }
      new Assertion(fn, msg, assert.decreasesButNotBy, true).to.decrease(obj, prop).but.not.by(delta);
    };
    /*!
       * ### .ifError(object)
       *
       * Asserts if value is not a false value, and throws if it is a true value.
       * This is added to allow for chai to be a drop-in replacement for Node's
       * assert class.
       *
       *     var err = new Error('I am a custom error');
       *     assert.ifError(err); // Rethrows err!
       *
       * @name ifError
       * @param {Object} object
       * @namespace Assert
       * @api public
       */
    assert.ifError = function(val) {
      if (val) {
        throw val;
      }
    };
    assert.isExtensible = function(obj, msg) {
      new Assertion(obj, msg, assert.isExtensible, true).to.be.extensible;
    };
    assert.isNotExtensible = function(obj, msg) {
      new Assertion(obj, msg, assert.isNotExtensible, true).to.not.be.extensible;
    };
    assert.isSealed = function(obj, msg) {
      new Assertion(obj, msg, assert.isSealed, true).to.be.sealed;
    };
    assert.isNotSealed = function(obj, msg) {
      new Assertion(obj, msg, assert.isNotSealed, true).to.not.be.sealed;
    };
    assert.isFrozen = function(obj, msg) {
      new Assertion(obj, msg, assert.isFrozen, true).to.be.frozen;
    };
    assert.isNotFrozen = function(obj, msg) {
      new Assertion(obj, msg, assert.isNotFrozen, true).to.not.be.frozen;
    };
    assert.isEmpty = function(val, msg) {
      new Assertion(val, msg, assert.isEmpty, true).to.be.empty;
    };
    assert.isNotEmpty = function(val, msg) {
      new Assertion(val, msg, assert.isNotEmpty, true).to.not.be.empty;
    };
    /*!
       * Aliases.
       */
    (function alias(name, as) {
      assert[as] = assert[name];
      return alias;
    })("isOk", "ok")("isNotOk", "notOk")("throws", "throw")("throws", "Throw")("isExtensible", "extensible")("isNotExtensible", "notExtensible")("isSealed", "sealed")("isNotSealed", "notSealed")("isFrozen", "frozen")("isNotFrozen", "notFrozen")("isEmpty", "empty")("isNotEmpty", "notEmpty");
  };
});

// node_modules/chai/lib/chai.js
var require_chai = __commonJS((exports) => {
  /*!
   * chai
   * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   */
  var used = [];
  /*!
   * Chai version
   */
  exports.version = "4.3.8";
  /*!
   * Assertion Error
   */
  exports.AssertionError = require_assertion_error();
  /*!
   * Utils for plugins (not exported)
   */
  var util = require_utils();
  exports.use = function(fn) {
    if (!~used.indexOf(fn)) {
      fn(exports, util);
      used.push(fn);
    }
    return exports;
  };
  /*!
   * Utility Functions
   */
  exports.util = util;
  /*!
   * Configuration
   */
  var config = require_config();
  exports.config = config;
  /*!
   * Primary `Assertion` prototype
   */
  var assertion = require_assertion();
  exports.use(assertion);
  /*!
   * Core Assertions
   */
  var core = require_assertions();
  exports.use(core);
  /*!
   * Expect interface
   */
  var expect = require_expect();
  exports.use(expect);
  /*!
   * Should interface
   */
  var should = require_should();
  exports.use(should);
  /*!
   * Assert interface
   */
  var assert = require_assert();
  exports.use(assert);
});

// node_modules/@vitest/snapshot/node_modules/pretty-format/node_modules/ansi-styles/index.js
var require_ansi_styles2 = __commonJS((exports, module) => {
  var ANSI_BACKGROUND_OFFSET = 10;
  var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
  var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
  function assembleStyles() {
    const codes = new Map;
    const styles = {
      modifier: {
        reset: [0, 0],
        bold: [1, 22],
        dim: [2, 22],
        italic: [3, 23],
        underline: [4, 24],
        overline: [53, 55],
        inverse: [7, 27],
        hidden: [8, 28],
        strikethrough: [9, 29]
      },
      color: {
        black: [30, 39],
        red: [31, 39],
        green: [32, 39],
        yellow: [33, 39],
        blue: [34, 39],
        magenta: [35, 39],
        cyan: [36, 39],
        white: [37, 39],
        blackBright: [90, 39],
        redBright: [91, 39],
        greenBright: [92, 39],
        yellowBright: [93, 39],
        blueBright: [94, 39],
        magentaBright: [95, 39],
        cyanBright: [96, 39],
        whiteBright: [97, 39]
      },
      bgColor: {
        bgBlack: [40, 49],
        bgRed: [41, 49],
        bgGreen: [42, 49],
        bgYellow: [43, 49],
        bgBlue: [44, 49],
        bgMagenta: [45, 49],
        bgCyan: [46, 49],
        bgWhite: [47, 49],
        bgBlackBright: [100, 49],
        bgRedBright: [101, 49],
        bgGreenBright: [102, 49],
        bgYellowBright: [103, 49],
        bgBlueBright: [104, 49],
        bgMagentaBright: [105, 49],
        bgCyanBright: [106, 49],
        bgWhiteBright: [107, 49]
      }
    };
    styles.color.gray = styles.color.blackBright;
    styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
    styles.color.grey = styles.color.blackBright;
    styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;
    for (const [groupName, group] of Object.entries(styles)) {
      for (const [styleName, style] of Object.entries(group)) {
        styles[styleName] = {
          open: `\x1B[${style[0]}m`,
          close: `\x1B[${style[1]}m`
        };
        group[styleName] = styles[styleName];
        codes.set(style[0], style[1]);
      }
      Object.defineProperty(styles, groupName, {
        value: group,
        enumerable: false
      });
    }
    Object.defineProperty(styles, "codes", {
      value: codes,
      enumerable: false
    });
    styles.color.close = "\x1B[39m";
    styles.bgColor.close = "\x1B[49m";
    styles.color.ansi256 = wrapAnsi256();
    styles.color.ansi16m = wrapAnsi16m();
    styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
    styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
    Object.defineProperties(styles, {
      rgbToAnsi256: {
        value: (red, green, blue) => {
          if (red === green && green === blue) {
            if (red < 8) {
              return 16;
            }
            if (red > 248) {
              return 231;
            }
            return Math.round((red - 8) / 247 * 24) + 232;
          }
          return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
        },
        enumerable: false
      },
      hexToRgb: {
        value: (hex) => {
          const matches = /(?<colorString>[a-f\d]{6}|[a-f\d]{3})/i.exec(hex.toString(16));
          if (!matches) {
            return [0, 0, 0];
          }
          let { colorString } = matches.groups;
          if (colorString.length === 3) {
            colorString = colorString.split("").map((character) => character + character).join("");
          }
          const integer = Number.parseInt(colorString, 16);
          return [
            integer >> 16 & 255,
            integer >> 8 & 255,
            integer & 255
          ];
        },
        enumerable: false
      },
      hexToAnsi256: {
        value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
        enumerable: false
      }
    });
    return styles;
  }
  Object.defineProperty(module, "exports", {
    enumerable: true,
    get: assembleStyles
  });
});

// node_modules/@vitest/snapshot/node_modules/pretty-format/build/collections.js
var require_collections2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.printIteratorEntries = printIteratorEntries;
  exports.printIteratorValues = printIteratorValues;
  exports.printListItems = printListItems;
  exports.printObjectProperties = printObjectProperties;
  var getKeysOfEnumerableProperties = (object, compareKeys) => {
    const rawKeys = Object.keys(object);
    const keys2 = compareKeys !== null ? rawKeys.sort(compareKeys) : rawKeys;
    if (Object.getOwnPropertySymbols) {
      Object.getOwnPropertySymbols(object).forEach((symbol) => {
        if (Object.getOwnPropertyDescriptor(object, symbol).enumerable) {
          keys2.push(symbol);
        }
      });
    }
    return keys2;
  };
  function printIteratorEntries(iterator, config2, indentation, depth, refs, printer, separator = ": ") {
    let result = "";
    let width = 0;
    let current = iterator.next();
    if (!current.done) {
      result += config2.spacingOuter;
      const indentationNext = indentation + config2.indent;
      while (!current.done) {
        result += indentationNext;
        if (width++ === config2.maxWidth) {
          result += "…";
          break;
        }
        const name = printer(current.value[0], config2, indentationNext, depth, refs);
        const value = printer(current.value[1], config2, indentationNext, depth, refs);
        result += name + separator + value;
        current = iterator.next();
        if (!current.done) {
          result += `,${config2.spacingInner}`;
        } else if (!config2.min) {
          result += ",";
        }
      }
      result += config2.spacingOuter + indentation;
    }
    return result;
  }
  function printIteratorValues(iterator, config2, indentation, depth, refs, printer) {
    let result = "";
    let width = 0;
    let current = iterator.next();
    if (!current.done) {
      result += config2.spacingOuter;
      const indentationNext = indentation + config2.indent;
      while (!current.done) {
        result += indentationNext;
        if (width++ === config2.maxWidth) {
          result += "…";
          break;
        }
        result += printer(current.value, config2, indentationNext, depth, refs);
        current = iterator.next();
        if (!current.done) {
          result += `,${config2.spacingInner}`;
        } else if (!config2.min) {
          result += ",";
        }
      }
      result += config2.spacingOuter + indentation;
    }
    return result;
  }
  function printListItems(list, config2, indentation, depth, refs, printer) {
    let result = "";
    if (list.length) {
      result += config2.spacingOuter;
      const indentationNext = indentation + config2.indent;
      for (let i2 = 0;i2 < list.length; i2++) {
        result += indentationNext;
        if (i2 === config2.maxWidth) {
          result += "…";
          break;
        }
        if (i2 in list) {
          result += printer(list[i2], config2, indentationNext, depth, refs);
        }
        if (i2 < list.length - 1) {
          result += `,${config2.spacingInner}`;
        } else if (!config2.min) {
          result += ",";
        }
      }
      result += config2.spacingOuter + indentation;
    }
    return result;
  }
  function printObjectProperties(val, config2, indentation, depth, refs, printer) {
    let result = "";
    const keys2 = getKeysOfEnumerableProperties(val, config2.compareKeys);
    if (keys2.length) {
      result += config2.spacingOuter;
      const indentationNext = indentation + config2.indent;
      for (let i2 = 0;i2 < keys2.length; i2++) {
        const key = keys2[i2];
        const name = printer(key, config2, indentationNext, depth, refs);
        const value = printer(val[key], config2, indentationNext, depth, refs);
        result += `${indentationNext + name}: ${value}`;
        if (i2 < keys2.length - 1) {
          result += `,${config2.spacingInner}`;
        } else if (!config2.min) {
          result += ",";
        }
      }
      result += config2.spacingOuter + indentation;
    }
    return result;
  }
});

// node_modules/@vitest/snapshot/node_modules/pretty-format/build/plugins/AsymmetricMatcher.js
var require_AsymmetricMatcher2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.test = exports.serialize = exports.default = undefined;
  var _collections = require_collections2();
  var Symbol2 = globalThis["jest-symbol-do-not-touch"] || globalThis.Symbol;
  var asymmetricMatcher = typeof Symbol2 === "function" && Symbol2.for ? Symbol2.for("jest.asymmetricMatcher") : 1267621;
  var SPACE = " ";
  var serialize = (val, config2, indentation, depth, refs, printer) => {
    const stringedValue = val.toString();
    if (stringedValue === "ArrayContaining" || stringedValue === "ArrayNotContaining") {
      if (++depth > config2.maxDepth) {
        return `[${stringedValue}]`;
      }
      return `${stringedValue + SPACE}[${(0, _collections.printListItems)(val.sample, config2, indentation, depth, refs, printer)}]`;
    }
    if (stringedValue === "ObjectContaining" || stringedValue === "ObjectNotContaining") {
      if (++depth > config2.maxDepth) {
        return `[${stringedValue}]`;
      }
      return `${stringedValue + SPACE}{${(0, _collections.printObjectProperties)(val.sample, config2, indentation, depth, refs, printer)}}`;
    }
    if (stringedValue === "StringMatching" || stringedValue === "StringNotMatching") {
      return stringedValue + SPACE + printer(val.sample, config2, indentation, depth, refs);
    }
    if (stringedValue === "StringContaining" || stringedValue === "StringNotContaining") {
      return stringedValue + SPACE + printer(val.sample, config2, indentation, depth, refs);
    }
    if (typeof val.toAsymmetricMatcher !== "function") {
      throw new Error(`Asymmetric matcher ${val.constructor.name} does not implement toAsymmetricMatcher()`);
    }
    return val.toAsymmetricMatcher();
  };
  exports.serialize = serialize;
  var test2 = (val) => val && val.$$typeof === asymmetricMatcher;
  exports.test = test2;
  var plugin = {
    serialize,
    test: test2
  };
  var _default = plugin;
  exports.default = _default;
});

// node_modules/@vitest/snapshot/node_modules/pretty-format/build/plugins/DOMCollection.js
var require_DOMCollection2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.test = exports.serialize = exports.default = undefined;
  var _collections = require_collections2();
  var SPACE = " ";
  var OBJECT_NAMES = ["DOMStringMap", "NamedNodeMap"];
  var ARRAY_REGEXP = /^(HTML\w*Collection|NodeList)$/;
  var testName = (name) => OBJECT_NAMES.indexOf(name) !== -1 || ARRAY_REGEXP.test(name);
  var test2 = (val) => val && val.constructor && !!val.constructor.name && testName(val.constructor.name);
  exports.test = test2;
  var isNamedNodeMap = (collection) => collection.constructor.name === "NamedNodeMap";
  var serialize = (collection, config2, indentation, depth, refs, printer) => {
    const name = collection.constructor.name;
    if (++depth > config2.maxDepth) {
      return `[${name}]`;
    }
    return (config2.min ? "" : name + SPACE) + (OBJECT_NAMES.indexOf(name) !== -1 ? `{${(0, _collections.printObjectProperties)(isNamedNodeMap(collection) ? Array.from(collection).reduce((props, attribute) => {
      props[attribute.name] = attribute.value;
      return props;
    }, {}) : {
      ...collection
    }, config2, indentation, depth, refs, printer)}}` : `[${(0, _collections.printListItems)(Array.from(collection), config2, indentation, depth, refs, printer)}]`);
  };
  exports.serialize = serialize;
  var plugin = {
    serialize,
    test: test2
  };
  var _default = plugin;
  exports.default = _default;
});

// node_modules/@vitest/snapshot/node_modules/pretty-format/build/plugins/lib/escapeHTML.js
var require_escapeHTML2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = escapeHTML;
  function escapeHTML(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
});

// node_modules/@vitest/snapshot/node_modules/pretty-format/build/plugins/lib/markup.js
var require_markup2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.printText = exports.printProps = exports.printElementAsLeaf = exports.printElement = exports.printComment = exports.printChildren = undefined;
  var _escapeHTML = _interopRequireDefault(require_escapeHTML2());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var printProps = (keys2, props, config2, indentation, depth, refs, printer) => {
    const indentationNext = indentation + config2.indent;
    const colors = config2.colors;
    return keys2.map((key) => {
      const value = props[key];
      let printed = printer(value, config2, indentationNext, depth, refs);
      if (typeof value !== "string") {
        if (printed.indexOf(`
`) !== -1) {
          printed = config2.spacingOuter + indentationNext + printed + config2.spacingOuter + indentation;
        }
        printed = `{${printed}}`;
      }
      return `${config2.spacingInner + indentation + colors.prop.open + key + colors.prop.close}=${colors.value.open}${printed}${colors.value.close}`;
    }).join("");
  };
  exports.printProps = printProps;
  var printChildren = (children, config2, indentation, depth, refs, printer) => children.map((child) => config2.spacingOuter + indentation + (typeof child === "string" ? printText(child, config2) : printer(child, config2, indentation, depth, refs))).join("");
  exports.printChildren = printChildren;
  var printText = (text, config2) => {
    const contentColor = config2.colors.content;
    return contentColor.open + (0, _escapeHTML.default)(text) + contentColor.close;
  };
  exports.printText = printText;
  var printComment = (comment, config2) => {
    const commentColor = config2.colors.comment;
    return `${commentColor.open}<!--${(0, _escapeHTML.default)(comment)}-->${commentColor.close}`;
  };
  exports.printComment = printComment;
  var printElement = (type, printedProps, printedChildren, config2, indentation) => {
    const tagColor = config2.colors.tag;
    return `${tagColor.open}<${type}${printedProps && tagColor.close + printedProps + config2.spacingOuter + indentation + tagColor.open}${printedChildren ? `>${tagColor.close}${printedChildren}${config2.spacingOuter}${indentation}${tagColor.open}</${type}` : `${printedProps && !config2.min ? "" : " "}/`}>${tagColor.close}`;
  };
  exports.printElement = printElement;
  var printElementAsLeaf = (type, config2) => {
    const tagColor = config2.colors.tag;
    return `${tagColor.open}<${type}${tagColor.close} …${tagColor.open} />${tagColor.close}`;
  };
  exports.printElementAsLeaf = printElementAsLeaf;
});

// node_modules/@vitest/snapshot/node_modules/pretty-format/build/plugins/DOMElement.js
var require_DOMElement2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.test = exports.serialize = exports.default = undefined;
  var _markup = require_markup2();
  var ELEMENT_NODE = 1;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  var FRAGMENT_NODE = 11;
  var ELEMENT_REGEXP = /^((HTML|SVG)\w*)?Element$/;
  var testHasAttribute = (val) => {
    try {
      return typeof val.hasAttribute === "function" && val.hasAttribute("is");
    } catch {
      return false;
    }
  };
  var testNode = (val) => {
    const constructorName = val.constructor.name;
    const { nodeType, tagName } = val;
    const isCustomElement = typeof tagName === "string" && tagName.includes("-") || testHasAttribute(val);
    return nodeType === ELEMENT_NODE && (ELEMENT_REGEXP.test(constructorName) || isCustomElement) || nodeType === TEXT_NODE && constructorName === "Text" || nodeType === COMMENT_NODE && constructorName === "Comment" || nodeType === FRAGMENT_NODE && constructorName === "DocumentFragment";
  };
  var test2 = (val) => val?.constructor?.name && testNode(val);
  exports.test = test2;
  function nodeIsText(node) {
    return node.nodeType === TEXT_NODE;
  }
  function nodeIsComment(node) {
    return node.nodeType === COMMENT_NODE;
  }
  function nodeIsFragment(node) {
    return node.nodeType === FRAGMENT_NODE;
  }
  var serialize = (node, config2, indentation, depth, refs, printer) => {
    if (nodeIsText(node)) {
      return (0, _markup.printText)(node.data, config2);
    }
    if (nodeIsComment(node)) {
      return (0, _markup.printComment)(node.data, config2);
    }
    const type = nodeIsFragment(node) ? "DocumentFragment" : node.tagName.toLowerCase();
    if (++depth > config2.maxDepth) {
      return (0, _markup.printElementAsLeaf)(type, config2);
    }
    return (0, _markup.printElement)(type, (0, _markup.printProps)(nodeIsFragment(node) ? [] : Array.from(node.attributes, (attr) => attr.name).sort(), nodeIsFragment(node) ? {} : Array.from(node.attributes).reduce((props, attribute) => {
      props[attribute.name] = attribute.value;
      return props;
    }, {}), config2, indentation + config2.indent, depth, refs, printer), (0, _markup.printChildren)(Array.prototype.slice.call(node.childNodes || node.children), config2, indentation + config2.indent, depth, refs, printer), config2, indentation);
  };
  exports.serialize = serialize;
  var plugin = {
    serialize,
    test: test2
  };
  var _default = plugin;
  exports.default = _default;
});

// node_modules/@vitest/snapshot/node_modules/pretty-format/build/plugins/Immutable.js
var require_Immutable2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.test = exports.serialize = exports.default = undefined;
  var _collections = require_collections2();
  var IS_ITERABLE_SENTINEL = "@@__IMMUTABLE_ITERABLE__@@";
  var IS_LIST_SENTINEL = "@@__IMMUTABLE_LIST__@@";
  var IS_KEYED_SENTINEL2 = "@@__IMMUTABLE_KEYED__@@";
  var IS_MAP_SENTINEL = "@@__IMMUTABLE_MAP__@@";
  var IS_ORDERED_SENTINEL2 = "@@__IMMUTABLE_ORDERED__@@";
  var IS_RECORD_SENTINEL = "@@__IMMUTABLE_RECORD__@@";
  var IS_SEQ_SENTINEL = "@@__IMMUTABLE_SEQ__@@";
  var IS_SET_SENTINEL2 = "@@__IMMUTABLE_SET__@@";
  var IS_STACK_SENTINEL = "@@__IMMUTABLE_STACK__@@";
  var getImmutableName = (name) => `Immutable.${name}`;
  var printAsLeaf = (name) => `[${name}]`;
  var SPACE = " ";
  var LAZY = "…";
  var printImmutableEntries = (val, config2, indentation, depth, refs, printer, type) => ++depth > config2.maxDepth ? printAsLeaf(getImmutableName(type)) : `${getImmutableName(type) + SPACE}{${(0, _collections.printIteratorEntries)(val.entries(), config2, indentation, depth, refs, printer)}}`;
  function getRecordEntries(val) {
    let i2 = 0;
    return {
      next() {
        if (i2 < val._keys.length) {
          const key = val._keys[i2++];
          return {
            done: false,
            value: [key, val.get(key)]
          };
        }
        return {
          done: true,
          value: undefined
        };
      }
    };
  }
  var printImmutableRecord = (val, config2, indentation, depth, refs, printer) => {
    const name = getImmutableName(val._name || "Record");
    return ++depth > config2.maxDepth ? printAsLeaf(name) : `${name + SPACE}{${(0, _collections.printIteratorEntries)(getRecordEntries(val), config2, indentation, depth, refs, printer)}}`;
  };
  var printImmutableSeq = (val, config2, indentation, depth, refs, printer) => {
    const name = getImmutableName("Seq");
    if (++depth > config2.maxDepth) {
      return printAsLeaf(name);
    }
    if (val[IS_KEYED_SENTINEL2]) {
      return `${name + SPACE}{${val._iter || val._object ? (0, _collections.printIteratorEntries)(val.entries(), config2, indentation, depth, refs, printer) : LAZY}}`;
    }
    return `${name + SPACE}[${val._iter || val._array || val._collection || val._iterable ? (0, _collections.printIteratorValues)(val.values(), config2, indentation, depth, refs, printer) : LAZY}]`;
  };
  var printImmutableValues = (val, config2, indentation, depth, refs, printer, type) => ++depth > config2.maxDepth ? printAsLeaf(getImmutableName(type)) : `${getImmutableName(type) + SPACE}[${(0, _collections.printIteratorValues)(val.values(), config2, indentation, depth, refs, printer)}]`;
  var serialize = (val, config2, indentation, depth, refs, printer) => {
    if (val[IS_MAP_SENTINEL]) {
      return printImmutableEntries(val, config2, indentation, depth, refs, printer, val[IS_ORDERED_SENTINEL2] ? "OrderedMap" : "Map");
    }
    if (val[IS_LIST_SENTINEL]) {
      return printImmutableValues(val, config2, indentation, depth, refs, printer, "List");
    }
    if (val[IS_SET_SENTINEL2]) {
      return printImmutableValues(val, config2, indentation, depth, refs, printer, val[IS_ORDERED_SENTINEL2] ? "OrderedSet" : "Set");
    }
    if (val[IS_STACK_SENTINEL]) {
      return printImmutableValues(val, config2, indentation, depth, refs, printer, "Stack");
    }
    if (val[IS_SEQ_SENTINEL]) {
      return printImmutableSeq(val, config2, indentation, depth, refs, printer);
    }
    return printImmutableRecord(val, config2, indentation, depth, refs, printer);
  };
  exports.serialize = serialize;
  var test2 = (val) => val && (val[IS_ITERABLE_SENTINEL] === true || val[IS_RECORD_SENTINEL] === true);
  exports.test = test2;
  var plugin = {
    serialize,
    test: test2
  };
  var _default = plugin;
  exports.default = _default;
});

// node_modules/@vitest/snapshot/node_modules/pretty-format/node_modules/react-is/cjs/react-is.development.js
var require_react_is_development2 = __commonJS((exports) => {
  if (true) {
    (function() {
      var REACT_ELEMENT_TYPE = Symbol.for("react.element");
      var REACT_PORTAL_TYPE = Symbol.for("react.portal");
      var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
      var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
      var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
      var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
      var REACT_CONTEXT_TYPE = Symbol.for("react.context");
      var REACT_SERVER_CONTEXT_TYPE = Symbol.for("react.server_context");
      var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
      var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
      var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
      var REACT_MEMO_TYPE = Symbol.for("react.memo");
      var REACT_LAZY_TYPE = Symbol.for("react.lazy");
      var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
      var enableScopeAPI = false;
      var enableCacheElement = false;
      var enableTransitionTracing = false;
      var enableLegacyHidden = false;
      var enableDebugTracing = false;
      var REACT_MODULE_REFERENCE;
      {
        REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
      }
      function isValidElementType(type) {
        if (typeof type === "string" || typeof type === "function") {
          return true;
        }
        if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
          return true;
        }
        if (typeof type === "object" && type !== null) {
          if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== undefined) {
            return true;
          }
        }
        return false;
      }
      function typeOf(object) {
        if (typeof object === "object" && object !== null) {
          var $$typeof = object.$$typeof;
          switch ($$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = object.type;
              switch (type) {
                case REACT_FRAGMENT_TYPE:
                case REACT_PROFILER_TYPE:
                case REACT_STRICT_MODE_TYPE:
                case REACT_SUSPENSE_TYPE:
                case REACT_SUSPENSE_LIST_TYPE:
                  return type;
                default:
                  var $$typeofType = type && type.$$typeof;
                  switch ($$typeofType) {
                    case REACT_SERVER_CONTEXT_TYPE:
                    case REACT_CONTEXT_TYPE:
                    case REACT_FORWARD_REF_TYPE:
                    case REACT_LAZY_TYPE:
                    case REACT_MEMO_TYPE:
                    case REACT_PROVIDER_TYPE:
                      return $$typeofType;
                    default:
                      return $$typeof;
                  }
              }
            case REACT_PORTAL_TYPE:
              return $$typeof;
          }
        }
        return;
      }
      var ContextConsumer = REACT_CONTEXT_TYPE;
      var ContextProvider = REACT_PROVIDER_TYPE;
      var Element2 = REACT_ELEMENT_TYPE;
      var ForwardRef = REACT_FORWARD_REF_TYPE;
      var Fragment = REACT_FRAGMENT_TYPE;
      var Lazy = REACT_LAZY_TYPE;
      var Memo = REACT_MEMO_TYPE;
      var Portal = REACT_PORTAL_TYPE;
      var Profiler = REACT_PROFILER_TYPE;
      var StrictMode = REACT_STRICT_MODE_TYPE;
      var Suspense = REACT_SUSPENSE_TYPE;
      var SuspenseList = REACT_SUSPENSE_LIST_TYPE;
      var hasWarnedAboutDeprecatedIsAsyncMode = false;
      var hasWarnedAboutDeprecatedIsConcurrentMode = false;
      function isAsyncMode(object) {
        {
          if (!hasWarnedAboutDeprecatedIsAsyncMode) {
            hasWarnedAboutDeprecatedIsAsyncMode = true;
            console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, " + "and will be removed in React 18+.");
          }
        }
        return false;
      }
      function isConcurrentMode(object) {
        {
          if (!hasWarnedAboutDeprecatedIsConcurrentMode) {
            hasWarnedAboutDeprecatedIsConcurrentMode = true;
            console["warn"]("The ReactIs.isConcurrentMode() alias has been deprecated, " + "and will be removed in React 18+.");
          }
        }
        return false;
      }
      function isContextConsumer(object) {
        return typeOf(object) === REACT_CONTEXT_TYPE;
      }
      function isContextProvider(object) {
        return typeOf(object) === REACT_PROVIDER_TYPE;
      }
      function isElement(object) {
        return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function isForwardRef(object) {
        return typeOf(object) === REACT_FORWARD_REF_TYPE;
      }
      function isFragment(object) {
        return typeOf(object) === REACT_FRAGMENT_TYPE;
      }
      function isLazy(object) {
        return typeOf(object) === REACT_LAZY_TYPE;
      }
      function isMemo(object) {
        return typeOf(object) === REACT_MEMO_TYPE;
      }
      function isPortal(object) {
        return typeOf(object) === REACT_PORTAL_TYPE;
      }
      function isProfiler(object) {
        return typeOf(object) === REACT_PROFILER_TYPE;
      }
      function isStrictMode(object) {
        return typeOf(object) === REACT_STRICT_MODE_TYPE;
      }
      function isSuspense(object) {
        return typeOf(object) === REACT_SUSPENSE_TYPE;
      }
      function isSuspenseList(object) {
        return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;
      }
      exports.ContextConsumer = ContextConsumer;
      exports.ContextProvider = ContextProvider;
      exports.Element = Element2;
      exports.ForwardRef = ForwardRef;
      exports.Fragment = Fragment;
      exports.Lazy = Lazy;
      exports.Memo = Memo;
      exports.Portal = Portal;
      exports.Profiler = Profiler;
      exports.StrictMode = StrictMode;
      exports.Suspense = Suspense;
      exports.SuspenseList = SuspenseList;
      exports.isAsyncMode = isAsyncMode;
      exports.isConcurrentMode = isConcurrentMode;
      exports.isContextConsumer = isContextConsumer;
      exports.isContextProvider = isContextProvider;
      exports.isElement = isElement;
      exports.isForwardRef = isForwardRef;
      exports.isFragment = isFragment;
      exports.isLazy = isLazy;
      exports.isMemo = isMemo;
      exports.isPortal = isPortal;
      exports.isProfiler = isProfiler;
      exports.isStrictMode = isStrictMode;
      exports.isSuspense = isSuspense;
      exports.isSuspenseList = isSuspenseList;
      exports.isValidElementType = isValidElementType;
      exports.typeOf = typeOf;
    })();
  }
});

// node_modules/@vitest/snapshot/node_modules/pretty-format/node_modules/react-is/index.js
var require_react_is2 = __commonJS((exports, module) => {
  if (false) {} else {
    module.exports = require_react_is_development2();
  }
});

// node_modules/@vitest/snapshot/node_modules/pretty-format/build/plugins/ReactElement.js
var require_ReactElement2 = __commonJS((exports) => {
  var react_is = __toESM(require_react_is2(), 1);
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.test = exports.serialize = exports.default = undefined;
  var ReactIs = _interopRequireWildcard(react_is);
  var _markup = require_markup2();
  function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function")
      return null;
    var cacheBabelInterop = new WeakMap;
    var cacheNodeInterop = new WeakMap;
    return (_getRequireWildcardCache = function(nodeInterop2) {
      return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
  }
  function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
      return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
      return { default: obj };
    }
    var cache2 = _getRequireWildcardCache(nodeInterop);
    if (cache2 && cache2.has(obj)) {
      return cache2.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj) {
      if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    newObj.default = obj;
    if (cache2) {
      cache2.set(obj, newObj);
    }
    return newObj;
  }
  var getChildren = (arg, children = []) => {
    if (Array.isArray(arg)) {
      arg.forEach((item) => {
        getChildren(item, children);
      });
    } else if (arg != null && arg !== false) {
      children.push(arg);
    }
    return children;
  };
  var getType3 = (element) => {
    const type = element.type;
    if (typeof type === "string") {
      return type;
    }
    if (typeof type === "function") {
      return type.displayName || type.name || "Unknown";
    }
    if (ReactIs.isFragment(element)) {
      return "React.Fragment";
    }
    if (ReactIs.isSuspense(element)) {
      return "React.Suspense";
    }
    if (typeof type === "object" && type !== null) {
      if (ReactIs.isContextProvider(element)) {
        return "Context.Provider";
      }
      if (ReactIs.isContextConsumer(element)) {
        return "Context.Consumer";
      }
      if (ReactIs.isForwardRef(element)) {
        if (type.displayName) {
          return type.displayName;
        }
        const functionName = type.render.displayName || type.render.name || "";
        return functionName !== "" ? `ForwardRef(${functionName})` : "ForwardRef";
      }
      if (ReactIs.isMemo(element)) {
        const functionName = type.displayName || type.type.displayName || type.type.name || "";
        return functionName !== "" ? `Memo(${functionName})` : "Memo";
      }
    }
    return "UNDEFINED";
  };
  var getPropKeys = (element) => {
    const { props } = element;
    return Object.keys(props).filter((key) => key !== "children" && props[key] !== undefined).sort();
  };
  var serialize = (element, config2, indentation, depth, refs, printer) => ++depth > config2.maxDepth ? (0, _markup.printElementAsLeaf)(getType3(element), config2) : (0, _markup.printElement)(getType3(element), (0, _markup.printProps)(getPropKeys(element), element.props, config2, indentation + config2.indent, depth, refs, printer), (0, _markup.printChildren)(getChildren(element.props.children), config2, indentation + config2.indent, depth, refs, printer), config2, indentation);
  exports.serialize = serialize;
  var test2 = (val) => val != null && ReactIs.isElement(val);
  exports.test = test2;
  var plugin = {
    serialize,
    test: test2
  };
  var _default = plugin;
  exports.default = _default;
});

// node_modules/@vitest/snapshot/node_modules/pretty-format/build/plugins/ReactTestComponent.js
var require_ReactTestComponent2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.test = exports.serialize = exports.default = undefined;
  var _markup = require_markup2();
  var Symbol2 = globalThis["jest-symbol-do-not-touch"] || globalThis.Symbol;
  var testSymbol = typeof Symbol2 === "function" && Symbol2.for ? Symbol2.for("react.test.json") : 245830487;
  var getPropKeys = (object) => {
    const { props } = object;
    return props ? Object.keys(props).filter((key) => props[key] !== undefined).sort() : [];
  };
  var serialize = (object, config2, indentation, depth, refs, printer) => ++depth > config2.maxDepth ? (0, _markup.printElementAsLeaf)(object.type, config2) : (0, _markup.printElement)(object.type, object.props ? (0, _markup.printProps)(getPropKeys(object), object.props, config2, indentation + config2.indent, depth, refs, printer) : "", object.children ? (0, _markup.printChildren)(object.children, config2, indentation + config2.indent, depth, refs, printer) : "", config2, indentation);
  exports.serialize = serialize;
  var test2 = (val) => val && val.$$typeof === testSymbol;
  exports.test = test2;
  var plugin = {
    serialize,
    test: test2
  };
  var _default = plugin;
  exports.default = _default;
});

// node_modules/@vitest/snapshot/node_modules/pretty-format/build/index.js
var require_build3 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = exports.DEFAULT_OPTIONS = undefined;
  exports.format = format5;
  exports.plugins = undefined;
  var _ansiStyles = _interopRequireDefault(require_ansi_styles2());
  var _collections = require_collections2();
  var _AsymmetricMatcher = _interopRequireDefault(require_AsymmetricMatcher2());
  var _DOMCollection = _interopRequireDefault(require_DOMCollection2());
  var _DOMElement = _interopRequireDefault(require_DOMElement2());
  var _Immutable = _interopRequireDefault(require_Immutable2());
  var _ReactElement = _interopRequireDefault(require_ReactElement2());
  var _ReactTestComponent = _interopRequireDefault(require_ReactTestComponent2());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var toString = Object.prototype.toString;
  var toISOString = Date.prototype.toISOString;
  var errorToString = Error.prototype.toString;
  var regExpToString = RegExp.prototype.toString;
  var getConstructorName = (val) => typeof val.constructor === "function" && val.constructor.name || "Object";
  var isWindow = (val) => typeof window !== "undefined" && val === window;
  var SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
  var NEWLINE_REGEXP = /\n/gi;

  class PrettyFormatPluginError extends Error {
    constructor(message, stack) {
      super(message);
      this.stack = stack;
      this.name = this.constructor.name;
    }
  }
  function isToStringedArrayType(toStringed) {
    return toStringed === "[object Array]" || toStringed === "[object ArrayBuffer]" || toStringed === "[object DataView]" || toStringed === "[object Float32Array]" || toStringed === "[object Float64Array]" || toStringed === "[object Int8Array]" || toStringed === "[object Int16Array]" || toStringed === "[object Int32Array]" || toStringed === "[object Uint8Array]" || toStringed === "[object Uint8ClampedArray]" || toStringed === "[object Uint16Array]" || toStringed === "[object Uint32Array]";
  }
  function printNumber(val) {
    return Object.is(val, -0) ? "-0" : String(val);
  }
  function printBigInt(val) {
    return String(`${val}n`);
  }
  function printFunction(val, printFunctionName) {
    if (!printFunctionName) {
      return "[Function]";
    }
    return `[Function ${val.name || "anonymous"}]`;
  }
  function printSymbol(val) {
    return String(val).replace(SYMBOL_REGEXP, "Symbol($1)");
  }
  function printError(val) {
    return `[${errorToString.call(val)}]`;
  }
  function printBasicValue(val, printFunctionName, escapeRegex, escapeString) {
    if (val === true || val === false) {
      return `${val}`;
    }
    if (val === undefined) {
      return "undefined";
    }
    if (val === null) {
      return "null";
    }
    const typeOf = typeof val;
    if (typeOf === "number") {
      return printNumber(val);
    }
    if (typeOf === "bigint") {
      return printBigInt(val);
    }
    if (typeOf === "string") {
      if (escapeString) {
        return `"${val.replace(/"|\\/g, "\\$&")}"`;
      }
      return `"${val}"`;
    }
    if (typeOf === "function") {
      return printFunction(val, printFunctionName);
    }
    if (typeOf === "symbol") {
      return printSymbol(val);
    }
    const toStringed = toString.call(val);
    if (toStringed === "[object WeakMap]") {
      return "WeakMap {}";
    }
    if (toStringed === "[object WeakSet]") {
      return "WeakSet {}";
    }
    if (toStringed === "[object Function]" || toStringed === "[object GeneratorFunction]") {
      return printFunction(val, printFunctionName);
    }
    if (toStringed === "[object Symbol]") {
      return printSymbol(val);
    }
    if (toStringed === "[object Date]") {
      return isNaN(+val) ? "Date { NaN }" : toISOString.call(val);
    }
    if (toStringed === "[object Error]") {
      return printError(val);
    }
    if (toStringed === "[object RegExp]") {
      if (escapeRegex) {
        return regExpToString.call(val).replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
      }
      return regExpToString.call(val);
    }
    if (val instanceof Error) {
      return printError(val);
    }
    return null;
  }
  function printComplexValue(val, config2, indentation, depth, refs, hasCalledToJSON) {
    if (refs.indexOf(val) !== -1) {
      return "[Circular]";
    }
    refs = refs.slice();
    refs.push(val);
    const hitMaxDepth = ++depth > config2.maxDepth;
    const min = config2.min;
    if (config2.callToJSON && !hitMaxDepth && val.toJSON && typeof val.toJSON === "function" && !hasCalledToJSON) {
      return printer(val.toJSON(), config2, indentation, depth, refs, true);
    }
    const toStringed = toString.call(val);
    if (toStringed === "[object Arguments]") {
      return hitMaxDepth ? "[Arguments]" : `${min ? "" : "Arguments "}[${(0, _collections.printListItems)(val, config2, indentation, depth, refs, printer)}]`;
    }
    if (isToStringedArrayType(toStringed)) {
      return hitMaxDepth ? `[${val.constructor.name}]` : `${min ? "" : !config2.printBasicPrototype && val.constructor.name === "Array" ? "" : `${val.constructor.name} `}[${(0, _collections.printListItems)(val, config2, indentation, depth, refs, printer)}]`;
    }
    if (toStringed === "[object Map]") {
      return hitMaxDepth ? "[Map]" : `Map {${(0, _collections.printIteratorEntries)(val.entries(), config2, indentation, depth, refs, printer, " => ")}}`;
    }
    if (toStringed === "[object Set]") {
      return hitMaxDepth ? "[Set]" : `Set {${(0, _collections.printIteratorValues)(val.values(), config2, indentation, depth, refs, printer)}}`;
    }
    return hitMaxDepth || isWindow(val) ? `[${getConstructorName(val)}]` : `${min ? "" : !config2.printBasicPrototype && getConstructorName(val) === "Object" ? "" : `${getConstructorName(val)} `}{${(0, _collections.printObjectProperties)(val, config2, indentation, depth, refs, printer)}}`;
  }
  function isNewPlugin(plugin) {
    return plugin.serialize != null;
  }
  function printPlugin(plugin, val, config2, indentation, depth, refs) {
    let printed;
    try {
      printed = isNewPlugin(plugin) ? plugin.serialize(val, config2, indentation, depth, refs, printer) : plugin.print(val, (valChild) => printer(valChild, config2, indentation, depth, refs), (str) => {
        const indentationNext = indentation + config2.indent;
        return indentationNext + str.replace(NEWLINE_REGEXP, `
${indentationNext}`);
      }, {
        edgeSpacing: config2.spacingOuter,
        min: config2.min,
        spacing: config2.spacingInner
      }, config2.colors);
    } catch (error) {
      throw new PrettyFormatPluginError(error.message, error.stack);
    }
    if (typeof printed !== "string") {
      throw new Error(`pretty-format: Plugin must return type "string" but instead returned "${typeof printed}".`);
    }
    return printed;
  }
  function findPlugin(plugins4, val) {
    for (let p = 0;p < plugins4.length; p++) {
      try {
        if (plugins4[p].test(val)) {
          return plugins4[p];
        }
      } catch (error) {
        throw new PrettyFormatPluginError(error.message, error.stack);
      }
    }
    return null;
  }
  function printer(val, config2, indentation, depth, refs, hasCalledToJSON) {
    const plugin = findPlugin(config2.plugins, val);
    if (plugin !== null) {
      return printPlugin(plugin, val, config2, indentation, depth, refs);
    }
    const basicResult = printBasicValue(val, config2.printFunctionName, config2.escapeRegex, config2.escapeString);
    if (basicResult !== null) {
      return basicResult;
    }
    return printComplexValue(val, config2, indentation, depth, refs, hasCalledToJSON);
  }
  var DEFAULT_THEME = {
    comment: "gray",
    content: "reset",
    prop: "yellow",
    tag: "cyan",
    value: "green"
  };
  var DEFAULT_THEME_KEYS = Object.keys(DEFAULT_THEME);
  var toOptionsSubtype = (options) => options;
  var DEFAULT_OPTIONS = toOptionsSubtype({
    callToJSON: true,
    compareKeys: undefined,
    escapeRegex: false,
    escapeString: true,
    highlight: false,
    indent: 2,
    maxDepth: Infinity,
    maxWidth: Infinity,
    min: false,
    plugins: [],
    printBasicPrototype: true,
    printFunctionName: true,
    theme: DEFAULT_THEME
  });
  exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
  function validateOptions(options) {
    Object.keys(options).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(DEFAULT_OPTIONS, key)) {
        throw new Error(`pretty-format: Unknown option "${key}".`);
      }
    });
    if (options.min && options.indent !== undefined && options.indent !== 0) {
      throw new Error('pretty-format: Options "min" and "indent" cannot be used together.');
    }
    if (options.theme !== undefined) {
      if (options.theme === null) {
        throw new Error('pretty-format: Option "theme" must not be null.');
      }
      if (typeof options.theme !== "object") {
        throw new Error(`pretty-format: Option "theme" must be of type "object" but instead received "${typeof options.theme}".`);
      }
    }
  }
  var getColorsHighlight = (options) => DEFAULT_THEME_KEYS.reduce((colors, key) => {
    const value = options.theme && options.theme[key] !== undefined ? options.theme[key] : DEFAULT_THEME[key];
    const color = value && _ansiStyles.default[value];
    if (color && typeof color.close === "string" && typeof color.open === "string") {
      colors[key] = color;
    } else {
      throw new Error(`pretty-format: Option "theme" has a key "${key}" whose value "${value}" is undefined in ansi-styles.`);
    }
    return colors;
  }, Object.create(null));
  var getColorsEmpty = () => DEFAULT_THEME_KEYS.reduce((colors, key) => {
    colors[key] = {
      close: "",
      open: ""
    };
    return colors;
  }, Object.create(null));
  var getPrintFunctionName = (options) => options?.printFunctionName ?? DEFAULT_OPTIONS.printFunctionName;
  var getEscapeRegex = (options) => options?.escapeRegex ?? DEFAULT_OPTIONS.escapeRegex;
  var getEscapeString = (options) => options?.escapeString ?? DEFAULT_OPTIONS.escapeString;
  var getConfig = (options) => ({
    callToJSON: options?.callToJSON ?? DEFAULT_OPTIONS.callToJSON,
    colors: options?.highlight ? getColorsHighlight(options) : getColorsEmpty(),
    compareKeys: typeof options?.compareKeys === "function" || options?.compareKeys === null ? options.compareKeys : DEFAULT_OPTIONS.compareKeys,
    escapeRegex: getEscapeRegex(options),
    escapeString: getEscapeString(options),
    indent: options?.min ? "" : createIndent(options?.indent ?? DEFAULT_OPTIONS.indent),
    maxDepth: options?.maxDepth ?? DEFAULT_OPTIONS.maxDepth,
    maxWidth: options?.maxWidth ?? DEFAULT_OPTIONS.maxWidth,
    min: options?.min ?? DEFAULT_OPTIONS.min,
    plugins: options?.plugins ?? DEFAULT_OPTIONS.plugins,
    printBasicPrototype: options?.printBasicPrototype ?? true,
    printFunctionName: getPrintFunctionName(options),
    spacingInner: options?.min ? " " : `
`,
    spacingOuter: options?.min ? "" : `
`
  });
  function createIndent(indent) {
    return new Array(indent + 1).join(" ");
  }
  function format5(val, options) {
    if (options) {
      validateOptions(options);
      if (options.plugins) {
        const plugin = findPlugin(options.plugins, val);
        if (plugin !== null) {
          return printPlugin(plugin, val, getConfig(options), "", 0, []);
        }
      }
    }
    const basicResult = printBasicValue(val, getPrintFunctionName(options), getEscapeRegex(options), getEscapeString(options));
    if (basicResult !== null) {
      return basicResult;
    }
    return printComplexValue(val, getConfig(options), "", 0, []);
  }
  var plugins3 = {
    AsymmetricMatcher: _AsymmetricMatcher.default,
    DOMCollection: _DOMCollection.default,
    DOMElement: _DOMElement.default,
    Immutable: _Immutable.default,
    ReactElement: _ReactElement.default,
    ReactTestComponent: _ReactTestComponent.default
  };
  exports.plugins = plugins3;
  var _default = format5;
  exports.default = _default;
});

// node_modules/@jridgewell/sourcemap-codec/dist/sourcemap-codec.mjs
function encodeInteger(builder, num, relative2) {
  let delta = num - relative2;
  delta = delta < 0 ? -delta << 1 | 1 : delta << 1;
  do {
    let clamped = delta & 31;
    delta >>>= 5;
    if (delta > 0)
      clamped |= 32;
    builder.write(intToChar2[clamped]);
  } while (delta > 0);
  return num;
}
function encode(decoded) {
  const writer = new StringWriter;
  let sourcesIndex = 0;
  let sourceLine = 0;
  let sourceColumn = 0;
  let namesIndex = 0;
  for (let i2 = 0;i2 < decoded.length; i2++) {
    const line = decoded[i2];
    if (i2 > 0)
      writer.write(semicolon);
    if (line.length === 0)
      continue;
    let genColumn = 0;
    for (let j = 0;j < line.length; j++) {
      const segment = line[j];
      if (j > 0)
        writer.write(comma2);
      genColumn = encodeInteger(writer, segment[0], genColumn);
      if (segment.length === 1)
        continue;
      sourcesIndex = encodeInteger(writer, segment[1], sourcesIndex);
      sourceLine = encodeInteger(writer, segment[2], sourceLine);
      sourceColumn = encodeInteger(writer, segment[3], sourceColumn);
      if (segment.length === 4)
        continue;
      namesIndex = encodeInteger(writer, segment[4], namesIndex);
    }
  }
  return writer.flush();
}
var comma2 = 44, semicolon = 59, chars2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", intToChar2, charToInt2, bufLength, td, StringWriter = class {
  constructor() {
    this.pos = 0;
    this.out = "";
    this.buffer = new Uint8Array(bufLength);
  }
  write(v) {
    const { buffer } = this;
    buffer[this.pos++] = v;
    if (this.pos === bufLength) {
      this.out += td.decode(buffer);
      this.pos = 0;
    }
  }
  flush() {
    const { buffer, out, pos } = this;
    return pos > 0 ? out + td.decode(buffer.subarray(0, pos)) : out;
  }
};
var init_sourcemap_codec = __esm(() => {
  intToChar2 = new Uint8Array(64);
  charToInt2 = new Uint8Array(128);
  for (let i2 = 0;i2 < chars2.length; i2++) {
    const c2 = chars2.charCodeAt(i2);
    intToChar2[i2] = c2;
    charToInt2[c2] = i2;
  }
  bufLength = 1024 * 16;
  td = typeof TextDecoder !== "undefined" ? /* @__PURE__ */ new TextDecoder : typeof Buffer !== "undefined" ? {
    decode(buf) {
      const out = Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
      return out.toString();
    }
  } : {
    decode(buf) {
      let out = "";
      for (let i2 = 0;i2 < buf.length; i2++) {
        out += String.fromCharCode(buf[i2]);
      }
      return out;
    }
  };
});

// node_modules/magic-string/dist/magic-string.es.mjs
var exports_magic_string_es = {};
__export(exports_magic_string_es, {
  default: () => MagicString,
  SourceMap: () => SourceMap,
  Bundle: () => Bundle
});

class BitSet {
  constructor(arg) {
    this.bits = arg instanceof BitSet ? arg.bits.slice() : [];
  }
  add(n) {
    this.bits[n >> 5] |= 1 << (n & 31);
  }
  has(n) {
    return !!(this.bits[n >> 5] & 1 << (n & 31));
  }
}

class Chunk {
  constructor(start, end, content) {
    this.start = start;
    this.end = end;
    this.original = content;
    this.intro = "";
    this.outro = "";
    this.content = content;
    this.storeName = false;
    this.edited = false;
    {
      this.previous = null;
      this.next = null;
    }
  }
  appendLeft(content) {
    this.outro += content;
  }
  appendRight(content) {
    this.intro = this.intro + content;
  }
  clone() {
    const chunk = new Chunk(this.start, this.end, this.original);
    chunk.intro = this.intro;
    chunk.outro = this.outro;
    chunk.content = this.content;
    chunk.storeName = this.storeName;
    chunk.edited = this.edited;
    return chunk;
  }
  contains(index) {
    return this.start < index && index < this.end;
  }
  eachNext(fn2) {
    let chunk = this;
    while (chunk) {
      fn2(chunk);
      chunk = chunk.next;
    }
  }
  eachPrevious(fn2) {
    let chunk = this;
    while (chunk) {
      fn2(chunk);
      chunk = chunk.previous;
    }
  }
  edit(content, storeName, contentOnly) {
    this.content = content;
    if (!contentOnly) {
      this.intro = "";
      this.outro = "";
    }
    this.storeName = storeName;
    this.edited = true;
    return this;
  }
  prependLeft(content) {
    this.outro = content + this.outro;
  }
  prependRight(content) {
    this.intro = content + this.intro;
  }
  reset() {
    this.intro = "";
    this.outro = "";
    if (this.edited) {
      this.content = this.original;
      this.storeName = false;
      this.edited = false;
    }
  }
  split(index) {
    const sliceIndex = index - this.start;
    const originalBefore = this.original.slice(0, sliceIndex);
    const originalAfter = this.original.slice(sliceIndex);
    this.original = originalBefore;
    const newChunk = new Chunk(index, this.end, originalAfter);
    newChunk.outro = this.outro;
    this.outro = "";
    this.end = index;
    if (this.edited) {
      newChunk.edit("", false);
      this.content = "";
    } else {
      this.content = originalBefore;
    }
    newChunk.next = this.next;
    if (newChunk.next)
      newChunk.next.previous = newChunk;
    newChunk.previous = this;
    this.next = newChunk;
    return newChunk;
  }
  toString() {
    return this.intro + this.content + this.outro;
  }
  trimEnd(rx) {
    this.outro = this.outro.replace(rx, "");
    if (this.outro.length)
      return true;
    const trimmed = this.content.replace(rx, "");
    if (trimmed.length) {
      if (trimmed !== this.content) {
        this.split(this.start + trimmed.length).edit("", undefined, true);
        if (this.edited) {
          this.edit(trimmed, this.storeName, true);
        }
      }
      return true;
    } else {
      this.edit("", undefined, true);
      this.intro = this.intro.replace(rx, "");
      if (this.intro.length)
        return true;
    }
  }
  trimStart(rx) {
    this.intro = this.intro.replace(rx, "");
    if (this.intro.length)
      return true;
    const trimmed = this.content.replace(rx, "");
    if (trimmed.length) {
      if (trimmed !== this.content) {
        const newChunk = this.split(this.end - trimmed.length);
        if (this.edited) {
          newChunk.edit(trimmed, this.storeName, true);
        }
        this.edit("", undefined, true);
      }
      return true;
    } else {
      this.edit("", undefined, true);
      this.outro = this.outro.replace(rx, "");
      if (this.outro.length)
        return true;
    }
  }
}
function getBtoa() {
  if (typeof globalThis !== "undefined" && typeof globalThis.btoa === "function") {
    return (str) => globalThis.btoa(unescape(encodeURIComponent(str)));
  } else if (typeof Buffer === "function") {
    return (str) => Buffer.from(str, "utf-8").toString("base64");
  } else {
    return () => {
      throw new Error("Unsupported environment: `window.btoa` or `Buffer` should be supported.");
    };
  }
}

class SourceMap {
  constructor(properties) {
    this.version = 3;
    this.file = properties.file;
    this.sources = properties.sources;
    this.sourcesContent = properties.sourcesContent;
    this.names = properties.names;
    this.mappings = encode(properties.mappings);
    if (typeof properties.x_google_ignoreList !== "undefined") {
      this.x_google_ignoreList = properties.x_google_ignoreList;
    }
    if (typeof properties.debugId !== "undefined") {
      this.debugId = properties.debugId;
    }
  }
  toString() {
    return JSON.stringify(this);
  }
  toUrl() {
    return "data:application/json;charset=utf-8;base64," + btoa(this.toString());
  }
}
function guessIndent(code) {
  const lines = code.split(`
`);
  const tabbed = lines.filter((line) => /^\t+/.test(line));
  const spaced = lines.filter((line) => /^ {2,}/.test(line));
  if (tabbed.length === 0 && spaced.length === 0) {
    return null;
  }
  if (tabbed.length >= spaced.length) {
    return "\t";
  }
  const min = spaced.reduce((previous, current) => {
    const numSpaces = /^ +/.exec(current)[0].length;
    return Math.min(numSpaces, previous);
  }, Infinity);
  return new Array(min + 1).join(" ");
}
function getRelativePath(from, to) {
  const fromParts = from.split(/[/\\]/);
  const toParts = to.split(/[/\\]/);
  fromParts.pop();
  while (fromParts[0] === toParts[0]) {
    fromParts.shift();
    toParts.shift();
  }
  if (fromParts.length) {
    let i2 = fromParts.length;
    while (i2--)
      fromParts[i2] = "..";
  }
  return fromParts.concat(toParts).join("/");
}
function isObject3(thing) {
  return toString.call(thing) === "[object Object]";
}
function getLocator(source) {
  const originalLines = source.split(`
`);
  const lineOffsets = [];
  for (let i2 = 0, pos = 0;i2 < originalLines.length; i2++) {
    lineOffsets.push(pos);
    pos += originalLines[i2].length + 1;
  }
  return function locate(index) {
    let i2 = 0;
    let j = lineOffsets.length;
    while (i2 < j) {
      const m = i2 + j >> 1;
      if (index < lineOffsets[m]) {
        j = m;
      } else {
        i2 = m + 1;
      }
    }
    const line = i2 - 1;
    const column = index - lineOffsets[line];
    return { line, column };
  };
}

class Mappings {
  constructor(hires) {
    this.hires = hires;
    this.generatedCodeLine = 0;
    this.generatedCodeColumn = 0;
    this.raw = [];
    this.rawSegments = this.raw[this.generatedCodeLine] = [];
    this.pending = null;
  }
  addEdit(sourceIndex, content, loc, nameIndex) {
    if (content.length) {
      const contentLengthMinusOne = content.length - 1;
      let contentLineEnd = content.indexOf(`
`, 0);
      let previousContentLineEnd = -1;
      while (contentLineEnd >= 0 && contentLengthMinusOne > contentLineEnd) {
        const segment2 = [this.generatedCodeColumn, sourceIndex, loc.line, loc.column];
        if (nameIndex >= 0) {
          segment2.push(nameIndex);
        }
        this.rawSegments.push(segment2);
        this.generatedCodeLine += 1;
        this.raw[this.generatedCodeLine] = this.rawSegments = [];
        this.generatedCodeColumn = 0;
        previousContentLineEnd = contentLineEnd;
        contentLineEnd = content.indexOf(`
`, contentLineEnd + 1);
      }
      const segment = [this.generatedCodeColumn, sourceIndex, loc.line, loc.column];
      if (nameIndex >= 0) {
        segment.push(nameIndex);
      }
      this.rawSegments.push(segment);
      this.advance(content.slice(previousContentLineEnd + 1));
    } else if (this.pending) {
      this.rawSegments.push(this.pending);
      this.advance(content);
    }
    this.pending = null;
  }
  addUneditedChunk(sourceIndex, chunk, original, loc, sourcemapLocations) {
    let originalCharIndex = chunk.start;
    let first = true;
    let charInHiresBoundary = false;
    while (originalCharIndex < chunk.end) {
      if (original[originalCharIndex] === `
`) {
        loc.line += 1;
        loc.column = 0;
        this.generatedCodeLine += 1;
        this.raw[this.generatedCodeLine] = this.rawSegments = [];
        this.generatedCodeColumn = 0;
        first = true;
        charInHiresBoundary = false;
      } else {
        if (this.hires || first || sourcemapLocations.has(originalCharIndex)) {
          const segment = [this.generatedCodeColumn, sourceIndex, loc.line, loc.column];
          if (this.hires === "boundary") {
            if (wordRegex.test(original[originalCharIndex])) {
              if (!charInHiresBoundary) {
                this.rawSegments.push(segment);
                charInHiresBoundary = true;
              }
            } else {
              this.rawSegments.push(segment);
              charInHiresBoundary = false;
            }
          } else {
            this.rawSegments.push(segment);
          }
        }
        loc.column += 1;
        this.generatedCodeColumn += 1;
        first = false;
      }
      originalCharIndex += 1;
    }
    this.pending = null;
  }
  advance(str) {
    if (!str)
      return;
    const lines = str.split(`
`);
    if (lines.length > 1) {
      for (let i2 = 0;i2 < lines.length - 1; i2++) {
        this.generatedCodeLine++;
        this.raw[this.generatedCodeLine] = this.rawSegments = [];
      }
      this.generatedCodeColumn = 0;
    }
    this.generatedCodeColumn += lines[lines.length - 1].length;
  }
}

class MagicString {
  constructor(string2, options = {}) {
    const chunk = new Chunk(0, string2.length, string2);
    Object.defineProperties(this, {
      original: { writable: true, value: string2 },
      outro: { writable: true, value: "" },
      intro: { writable: true, value: "" },
      firstChunk: { writable: true, value: chunk },
      lastChunk: { writable: true, value: chunk },
      lastSearchedChunk: { writable: true, value: chunk },
      byStart: { writable: true, value: {} },
      byEnd: { writable: true, value: {} },
      filename: { writable: true, value: options.filename },
      indentExclusionRanges: { writable: true, value: options.indentExclusionRanges },
      sourcemapLocations: { writable: true, value: new BitSet },
      storedNames: { writable: true, value: {} },
      indentStr: { writable: true, value: undefined },
      ignoreList: { writable: true, value: options.ignoreList },
      offset: { writable: true, value: options.offset || 0 }
    });
    this.byStart[0] = chunk;
    this.byEnd[string2.length] = chunk;
  }
  addSourcemapLocation(char) {
    this.sourcemapLocations.add(char);
  }
  append(content) {
    if (typeof content !== "string")
      throw new TypeError("outro content must be a string");
    this.outro += content;
    return this;
  }
  appendLeft(index, content) {
    index = index + this.offset;
    if (typeof content !== "string")
      throw new TypeError("inserted content must be a string");
    this._split(index);
    const chunk = this.byEnd[index];
    if (chunk) {
      chunk.appendLeft(content);
    } else {
      this.intro += content;
    }
    return this;
  }
  appendRight(index, content) {
    index = index + this.offset;
    if (typeof content !== "string")
      throw new TypeError("inserted content must be a string");
    this._split(index);
    const chunk = this.byStart[index];
    if (chunk) {
      chunk.appendRight(content);
    } else {
      this.outro += content;
    }
    return this;
  }
  clone() {
    const cloned = new MagicString(this.original, { filename: this.filename, offset: this.offset });
    let originalChunk = this.firstChunk;
    let clonedChunk = cloned.firstChunk = cloned.lastSearchedChunk = originalChunk.clone();
    while (originalChunk) {
      cloned.byStart[clonedChunk.start] = clonedChunk;
      cloned.byEnd[clonedChunk.end] = clonedChunk;
      const nextOriginalChunk = originalChunk.next;
      const nextClonedChunk = nextOriginalChunk && nextOriginalChunk.clone();
      if (nextClonedChunk) {
        clonedChunk.next = nextClonedChunk;
        nextClonedChunk.previous = clonedChunk;
        clonedChunk = nextClonedChunk;
      }
      originalChunk = nextOriginalChunk;
    }
    cloned.lastChunk = clonedChunk;
    if (this.indentExclusionRanges) {
      cloned.indentExclusionRanges = this.indentExclusionRanges.slice();
    }
    cloned.sourcemapLocations = new BitSet(this.sourcemapLocations);
    cloned.intro = this.intro;
    cloned.outro = this.outro;
    return cloned;
  }
  generateDecodedMap(options) {
    options = options || {};
    const sourceIndex = 0;
    const names = Object.keys(this.storedNames);
    const mappings = new Mappings(options.hires);
    const locate = getLocator(this.original);
    if (this.intro) {
      mappings.advance(this.intro);
    }
    this.firstChunk.eachNext((chunk) => {
      const loc = locate(chunk.start);
      if (chunk.intro.length)
        mappings.advance(chunk.intro);
      if (chunk.edited) {
        mappings.addEdit(sourceIndex, chunk.content, loc, chunk.storeName ? names.indexOf(chunk.original) : -1);
      } else {
        mappings.addUneditedChunk(sourceIndex, chunk, this.original, loc, this.sourcemapLocations);
      }
      if (chunk.outro.length)
        mappings.advance(chunk.outro);
    });
    if (this.outro) {
      mappings.advance(this.outro);
    }
    return {
      file: options.file ? options.file.split(/[/\\]/).pop() : undefined,
      sources: [
        options.source ? getRelativePath(options.file || "", options.source) : options.file || ""
      ],
      sourcesContent: options.includeContent ? [this.original] : undefined,
      names,
      mappings: mappings.raw,
      x_google_ignoreList: this.ignoreList ? [sourceIndex] : undefined
    };
  }
  generateMap(options) {
    return new SourceMap(this.generateDecodedMap(options));
  }
  _ensureindentStr() {
    if (this.indentStr === undefined) {
      this.indentStr = guessIndent(this.original);
    }
  }
  _getRawIndentString() {
    this._ensureindentStr();
    return this.indentStr;
  }
  getIndentString() {
    this._ensureindentStr();
    return this.indentStr === null ? "\t" : this.indentStr;
  }
  indent(indentStr, options) {
    const pattern = /^[^\r\n]/gm;
    if (isObject3(indentStr)) {
      options = indentStr;
      indentStr = undefined;
    }
    if (indentStr === undefined) {
      this._ensureindentStr();
      indentStr = this.indentStr || "\t";
    }
    if (indentStr === "")
      return this;
    options = options || {};
    const isExcluded = {};
    if (options.exclude) {
      const exclusions = typeof options.exclude[0] === "number" ? [options.exclude] : options.exclude;
      exclusions.forEach((exclusion) => {
        for (let i2 = exclusion[0];i2 < exclusion[1]; i2 += 1) {
          isExcluded[i2] = true;
        }
      });
    }
    let shouldIndentNextCharacter = options.indentStart !== false;
    const replacer = (match) => {
      if (shouldIndentNextCharacter)
        return `${indentStr}${match}`;
      shouldIndentNextCharacter = true;
      return match;
    };
    this.intro = this.intro.replace(pattern, replacer);
    let charIndex = 0;
    let chunk = this.firstChunk;
    while (chunk) {
      const end = chunk.end;
      if (chunk.edited) {
        if (!isExcluded[charIndex]) {
          chunk.content = chunk.content.replace(pattern, replacer);
          if (chunk.content.length) {
            shouldIndentNextCharacter = chunk.content[chunk.content.length - 1] === `
`;
          }
        }
      } else {
        charIndex = chunk.start;
        while (charIndex < end) {
          if (!isExcluded[charIndex]) {
            const char = this.original[charIndex];
            if (char === `
`) {
              shouldIndentNextCharacter = true;
            } else if (char !== "\r" && shouldIndentNextCharacter) {
              shouldIndentNextCharacter = false;
              if (charIndex === chunk.start) {
                chunk.prependRight(indentStr);
              } else {
                this._splitChunk(chunk, charIndex);
                chunk = chunk.next;
                chunk.prependRight(indentStr);
              }
            }
          }
          charIndex += 1;
        }
      }
      charIndex = chunk.end;
      chunk = chunk.next;
    }
    this.outro = this.outro.replace(pattern, replacer);
    return this;
  }
  insert() {
    throw new Error("magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)");
  }
  insertLeft(index, content) {
    if (!warned.insertLeft) {
      console.warn("magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead");
      warned.insertLeft = true;
    }
    return this.appendLeft(index, content);
  }
  insertRight(index, content) {
    if (!warned.insertRight) {
      console.warn("magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead");
      warned.insertRight = true;
    }
    return this.prependRight(index, content);
  }
  move(start, end, index) {
    start = start + this.offset;
    end = end + this.offset;
    index = index + this.offset;
    if (index >= start && index <= end)
      throw new Error("Cannot move a selection inside itself");
    this._split(start);
    this._split(end);
    this._split(index);
    const first = this.byStart[start];
    const last = this.byEnd[end];
    const oldLeft = first.previous;
    const oldRight = last.next;
    const newRight = this.byStart[index];
    if (!newRight && last === this.lastChunk)
      return this;
    const newLeft = newRight ? newRight.previous : this.lastChunk;
    if (oldLeft)
      oldLeft.next = oldRight;
    if (oldRight)
      oldRight.previous = oldLeft;
    if (newLeft)
      newLeft.next = first;
    if (newRight)
      newRight.previous = last;
    if (!first.previous)
      this.firstChunk = last.next;
    if (!last.next) {
      this.lastChunk = first.previous;
      this.lastChunk.next = null;
    }
    first.previous = newLeft;
    last.next = newRight || null;
    if (!newLeft)
      this.firstChunk = first;
    if (!newRight)
      this.lastChunk = last;
    return this;
  }
  overwrite(start, end, content, options) {
    options = options || {};
    return this.update(start, end, content, { ...options, overwrite: !options.contentOnly });
  }
  update(start, end, content, options) {
    start = start + this.offset;
    end = end + this.offset;
    if (typeof content !== "string")
      throw new TypeError("replacement content must be a string");
    if (this.original.length !== 0) {
      while (start < 0)
        start += this.original.length;
      while (end < 0)
        end += this.original.length;
    }
    if (end > this.original.length)
      throw new Error("end is out of bounds");
    if (start === end)
      throw new Error("Cannot overwrite a zero-length range – use appendLeft or prependRight instead");
    this._split(start);
    this._split(end);
    if (options === true) {
      if (!warned.storeName) {
        console.warn("The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string");
        warned.storeName = true;
      }
      options = { storeName: true };
    }
    const storeName = options !== undefined ? options.storeName : false;
    const overwrite = options !== undefined ? options.overwrite : false;
    if (storeName) {
      const original = this.original.slice(start, end);
      Object.defineProperty(this.storedNames, original, {
        writable: true,
        value: true,
        enumerable: true
      });
    }
    const first = this.byStart[start];
    const last = this.byEnd[end];
    if (first) {
      let chunk = first;
      while (chunk !== last) {
        if (chunk.next !== this.byStart[chunk.end]) {
          throw new Error("Cannot overwrite across a split point");
        }
        chunk = chunk.next;
        chunk.edit("", false);
      }
      first.edit(content, storeName, !overwrite);
    } else {
      const newChunk = new Chunk(start, end, "").edit(content, storeName);
      last.next = newChunk;
      newChunk.previous = last;
    }
    return this;
  }
  prepend(content) {
    if (typeof content !== "string")
      throw new TypeError("outro content must be a string");
    this.intro = content + this.intro;
    return this;
  }
  prependLeft(index, content) {
    index = index + this.offset;
    if (typeof content !== "string")
      throw new TypeError("inserted content must be a string");
    this._split(index);
    const chunk = this.byEnd[index];
    if (chunk) {
      chunk.prependLeft(content);
    } else {
      this.intro = content + this.intro;
    }
    return this;
  }
  prependRight(index, content) {
    index = index + this.offset;
    if (typeof content !== "string")
      throw new TypeError("inserted content must be a string");
    this._split(index);
    const chunk = this.byStart[index];
    if (chunk) {
      chunk.prependRight(content);
    } else {
      this.outro = content + this.outro;
    }
    return this;
  }
  remove(start, end) {
    start = start + this.offset;
    end = end + this.offset;
    if (this.original.length !== 0) {
      while (start < 0)
        start += this.original.length;
      while (end < 0)
        end += this.original.length;
    }
    if (start === end)
      return this;
    if (start < 0 || end > this.original.length)
      throw new Error("Character is out of bounds");
    if (start > end)
      throw new Error("end must be greater than start");
    this._split(start);
    this._split(end);
    let chunk = this.byStart[start];
    while (chunk) {
      chunk.intro = "";
      chunk.outro = "";
      chunk.edit("");
      chunk = end > chunk.end ? this.byStart[chunk.end] : null;
    }
    return this;
  }
  reset(start, end) {
    start = start + this.offset;
    end = end + this.offset;
    if (this.original.length !== 0) {
      while (start < 0)
        start += this.original.length;
      while (end < 0)
        end += this.original.length;
    }
    if (start === end)
      return this;
    if (start < 0 || end > this.original.length)
      throw new Error("Character is out of bounds");
    if (start > end)
      throw new Error("end must be greater than start");
    this._split(start);
    this._split(end);
    let chunk = this.byStart[start];
    while (chunk) {
      chunk.reset();
      chunk = end > chunk.end ? this.byStart[chunk.end] : null;
    }
    return this;
  }
  lastChar() {
    if (this.outro.length)
      return this.outro[this.outro.length - 1];
    let chunk = this.lastChunk;
    do {
      if (chunk.outro.length)
        return chunk.outro[chunk.outro.length - 1];
      if (chunk.content.length)
        return chunk.content[chunk.content.length - 1];
      if (chunk.intro.length)
        return chunk.intro[chunk.intro.length - 1];
    } while (chunk = chunk.previous);
    if (this.intro.length)
      return this.intro[this.intro.length - 1];
    return "";
  }
  lastLine() {
    let lineIndex = this.outro.lastIndexOf(n);
    if (lineIndex !== -1)
      return this.outro.substr(lineIndex + 1);
    let lineStr = this.outro;
    let chunk = this.lastChunk;
    do {
      if (chunk.outro.length > 0) {
        lineIndex = chunk.outro.lastIndexOf(n);
        if (lineIndex !== -1)
          return chunk.outro.substr(lineIndex + 1) + lineStr;
        lineStr = chunk.outro + lineStr;
      }
      if (chunk.content.length > 0) {
        lineIndex = chunk.content.lastIndexOf(n);
        if (lineIndex !== -1)
          return chunk.content.substr(lineIndex + 1) + lineStr;
        lineStr = chunk.content + lineStr;
      }
      if (chunk.intro.length > 0) {
        lineIndex = chunk.intro.lastIndexOf(n);
        if (lineIndex !== -1)
          return chunk.intro.substr(lineIndex + 1) + lineStr;
        lineStr = chunk.intro + lineStr;
      }
    } while (chunk = chunk.previous);
    lineIndex = this.intro.lastIndexOf(n);
    if (lineIndex !== -1)
      return this.intro.substr(lineIndex + 1) + lineStr;
    return this.intro + lineStr;
  }
  slice(start = 0, end = this.original.length - this.offset) {
    start = start + this.offset;
    end = end + this.offset;
    if (this.original.length !== 0) {
      while (start < 0)
        start += this.original.length;
      while (end < 0)
        end += this.original.length;
    }
    let result = "";
    let chunk = this.firstChunk;
    while (chunk && (chunk.start > start || chunk.end <= start)) {
      if (chunk.start < end && chunk.end >= end) {
        return result;
      }
      chunk = chunk.next;
    }
    if (chunk && chunk.edited && chunk.start !== start)
      throw new Error(`Cannot use replaced character ${start} as slice start anchor.`);
    const startChunk = chunk;
    while (chunk) {
      if (chunk.intro && (startChunk !== chunk || chunk.start === start)) {
        result += chunk.intro;
      }
      const containsEnd = chunk.start < end && chunk.end >= end;
      if (containsEnd && chunk.edited && chunk.end !== end)
        throw new Error(`Cannot use replaced character ${end} as slice end anchor.`);
      const sliceStart = startChunk === chunk ? start - chunk.start : 0;
      const sliceEnd = containsEnd ? chunk.content.length + end - chunk.end : chunk.content.length;
      result += chunk.content.slice(sliceStart, sliceEnd);
      if (chunk.outro && (!containsEnd || chunk.end === end)) {
        result += chunk.outro;
      }
      if (containsEnd) {
        break;
      }
      chunk = chunk.next;
    }
    return result;
  }
  snip(start, end) {
    const clone2 = this.clone();
    clone2.remove(0, start);
    clone2.remove(end, clone2.original.length);
    return clone2;
  }
  _split(index) {
    if (this.byStart[index] || this.byEnd[index])
      return;
    let chunk = this.lastSearchedChunk;
    let previousChunk = chunk;
    const searchForward = index > chunk.end;
    while (chunk) {
      if (chunk.contains(index))
        return this._splitChunk(chunk, index);
      chunk = searchForward ? this.byStart[chunk.end] : this.byEnd[chunk.start];
      if (chunk === previousChunk)
        return;
      previousChunk = chunk;
    }
  }
  _splitChunk(chunk, index) {
    if (chunk.edited && chunk.content.length) {
      const loc = getLocator(this.original)(index);
      throw new Error(`Cannot split a chunk that has already been edited (${loc.line}:${loc.column} – "${chunk.original}")`);
    }
    const newChunk = chunk.split(index);
    this.byEnd[index] = chunk;
    this.byStart[index] = newChunk;
    this.byEnd[newChunk.end] = newChunk;
    if (chunk === this.lastChunk)
      this.lastChunk = newChunk;
    this.lastSearchedChunk = chunk;
    return true;
  }
  toString() {
    let str = this.intro;
    let chunk = this.firstChunk;
    while (chunk) {
      str += chunk.toString();
      chunk = chunk.next;
    }
    return str + this.outro;
  }
  isEmpty() {
    let chunk = this.firstChunk;
    do {
      if (chunk.intro.length && chunk.intro.trim() || chunk.content.length && chunk.content.trim() || chunk.outro.length && chunk.outro.trim())
        return false;
    } while (chunk = chunk.next);
    return true;
  }
  length() {
    let chunk = this.firstChunk;
    let length = 0;
    do {
      length += chunk.intro.length + chunk.content.length + chunk.outro.length;
    } while (chunk = chunk.next);
    return length;
  }
  trimLines() {
    return this.trim("[\\r\\n]");
  }
  trim(charType) {
    return this.trimStart(charType).trimEnd(charType);
  }
  trimEndAborted(charType) {
    const rx = new RegExp((charType || "\\s") + "+$");
    this.outro = this.outro.replace(rx, "");
    if (this.outro.length)
      return true;
    let chunk = this.lastChunk;
    do {
      const end = chunk.end;
      const aborted = chunk.trimEnd(rx);
      if (chunk.end !== end) {
        if (this.lastChunk === chunk) {
          this.lastChunk = chunk.next;
        }
        this.byEnd[chunk.end] = chunk;
        this.byStart[chunk.next.start] = chunk.next;
        this.byEnd[chunk.next.end] = chunk.next;
      }
      if (aborted)
        return true;
      chunk = chunk.previous;
    } while (chunk);
    return false;
  }
  trimEnd(charType) {
    this.trimEndAborted(charType);
    return this;
  }
  trimStartAborted(charType) {
    const rx = new RegExp("^" + (charType || "\\s") + "+");
    this.intro = this.intro.replace(rx, "");
    if (this.intro.length)
      return true;
    let chunk = this.firstChunk;
    do {
      const end = chunk.end;
      const aborted = chunk.trimStart(rx);
      if (chunk.end !== end) {
        if (chunk === this.lastChunk)
          this.lastChunk = chunk.next;
        this.byEnd[chunk.end] = chunk;
        this.byStart[chunk.next.start] = chunk.next;
        this.byEnd[chunk.next.end] = chunk.next;
      }
      if (aborted)
        return true;
      chunk = chunk.next;
    } while (chunk);
    return false;
  }
  trimStart(charType) {
    this.trimStartAborted(charType);
    return this;
  }
  hasChanged() {
    return this.original !== this.toString();
  }
  _replaceRegexp(searchValue, replacement) {
    function getReplacement(match, str) {
      if (typeof replacement === "string") {
        return replacement.replace(/\$(\$|&|\d+)/g, (_, i2) => {
          if (i2 === "$")
            return "$";
          if (i2 === "&")
            return match[0];
          const num = +i2;
          if (num < match.length)
            return match[+i2];
          return `$${i2}`;
        });
      } else {
        return replacement(...match, match.index, str, match.groups);
      }
    }
    function matchAll(re, str) {
      let match;
      const matches = [];
      while (match = re.exec(str)) {
        matches.push(match);
      }
      return matches;
    }
    if (searchValue.global) {
      const matches = matchAll(searchValue, this.original);
      matches.forEach((match) => {
        if (match.index != null) {
          const replacement2 = getReplacement(match, this.original);
          if (replacement2 !== match[0]) {
            this.overwrite(match.index, match.index + match[0].length, replacement2);
          }
        }
      });
    } else {
      const match = this.original.match(searchValue);
      if (match && match.index != null) {
        const replacement2 = getReplacement(match, this.original);
        if (replacement2 !== match[0]) {
          this.overwrite(match.index, match.index + match[0].length, replacement2);
        }
      }
    }
    return this;
  }
  _replaceString(string2, replacement) {
    const { original } = this;
    const index = original.indexOf(string2);
    if (index !== -1) {
      if (typeof replacement === "function") {
        replacement = replacement(string2, index, original);
      }
      if (string2 !== replacement) {
        this.overwrite(index, index + string2.length, replacement);
      }
    }
    return this;
  }
  replace(searchValue, replacement) {
    if (typeof searchValue === "string") {
      return this._replaceString(searchValue, replacement);
    }
    return this._replaceRegexp(searchValue, replacement);
  }
  _replaceAllString(string2, replacement) {
    const { original } = this;
    const stringLength = string2.length;
    for (let index = original.indexOf(string2);index !== -1; index = original.indexOf(string2, index + stringLength)) {
      const previous = original.slice(index, index + stringLength);
      let _replacement = replacement;
      if (typeof replacement === "function") {
        _replacement = replacement(previous, index, original);
      }
      if (previous !== _replacement)
        this.overwrite(index, index + stringLength, _replacement);
    }
    return this;
  }
  replaceAll(searchValue, replacement) {
    if (typeof searchValue === "string") {
      return this._replaceAllString(searchValue, replacement);
    }
    if (!searchValue.global) {
      throw new TypeError("MagicString.prototype.replaceAll called with a non-global RegExp argument");
    }
    return this._replaceRegexp(searchValue, replacement);
  }
}

class Bundle {
  constructor(options = {}) {
    this.intro = options.intro || "";
    this.separator = options.separator !== undefined ? options.separator : `
`;
    this.sources = [];
    this.uniqueSources = [];
    this.uniqueSourceIndexByFilename = {};
  }
  addSource(source) {
    if (source instanceof MagicString) {
      return this.addSource({
        content: source,
        filename: source.filename,
        separator: this.separator
      });
    }
    if (!isObject3(source) || !source.content) {
      throw new Error("bundle.addSource() takes an object with a `content` property, which should be an instance of MagicString, and an optional `filename`");
    }
    ["filename", "ignoreList", "indentExclusionRanges", "separator"].forEach((option) => {
      if (!hasOwnProp.call(source, option))
        source[option] = source.content[option];
    });
    if (source.separator === undefined) {
      source.separator = this.separator;
    }
    if (source.filename) {
      if (!hasOwnProp.call(this.uniqueSourceIndexByFilename, source.filename)) {
        this.uniqueSourceIndexByFilename[source.filename] = this.uniqueSources.length;
        this.uniqueSources.push({ filename: source.filename, content: source.content.original });
      } else {
        const uniqueSource = this.uniqueSources[this.uniqueSourceIndexByFilename[source.filename]];
        if (source.content.original !== uniqueSource.content) {
          throw new Error(`Illegal source: same filename (${source.filename}), different contents`);
        }
      }
    }
    this.sources.push(source);
    return this;
  }
  append(str, options) {
    this.addSource({
      content: new MagicString(str),
      separator: options && options.separator || ""
    });
    return this;
  }
  clone() {
    const bundle = new Bundle({
      intro: this.intro,
      separator: this.separator
    });
    this.sources.forEach((source) => {
      bundle.addSource({
        filename: source.filename,
        content: source.content.clone(),
        separator: source.separator
      });
    });
    return bundle;
  }
  generateDecodedMap(options = {}) {
    const names = [];
    let x_google_ignoreList = undefined;
    this.sources.forEach((source) => {
      Object.keys(source.content.storedNames).forEach((name) => {
        if (!~names.indexOf(name))
          names.push(name);
      });
    });
    const mappings = new Mappings(options.hires);
    if (this.intro) {
      mappings.advance(this.intro);
    }
    this.sources.forEach((source, i2) => {
      if (i2 > 0) {
        mappings.advance(this.separator);
      }
      const sourceIndex = source.filename ? this.uniqueSourceIndexByFilename[source.filename] : -1;
      const magicString = source.content;
      const locate = getLocator(magicString.original);
      if (magicString.intro) {
        mappings.advance(magicString.intro);
      }
      magicString.firstChunk.eachNext((chunk) => {
        const loc = locate(chunk.start);
        if (chunk.intro.length)
          mappings.advance(chunk.intro);
        if (source.filename) {
          if (chunk.edited) {
            mappings.addEdit(sourceIndex, chunk.content, loc, chunk.storeName ? names.indexOf(chunk.original) : -1);
          } else {
            mappings.addUneditedChunk(sourceIndex, chunk, magicString.original, loc, magicString.sourcemapLocations);
          }
        } else {
          mappings.advance(chunk.content);
        }
        if (chunk.outro.length)
          mappings.advance(chunk.outro);
      });
      if (magicString.outro) {
        mappings.advance(magicString.outro);
      }
      if (source.ignoreList && sourceIndex !== -1) {
        if (x_google_ignoreList === undefined) {
          x_google_ignoreList = [];
        }
        x_google_ignoreList.push(sourceIndex);
      }
    });
    return {
      file: options.file ? options.file.split(/[/\\]/).pop() : undefined,
      sources: this.uniqueSources.map((source) => {
        return options.file ? getRelativePath(options.file, source.filename) : source.filename;
      }),
      sourcesContent: this.uniqueSources.map((source) => {
        return options.includeContent ? source.content : null;
      }),
      names,
      mappings: mappings.raw,
      x_google_ignoreList
    };
  }
  generateMap(options) {
    return new SourceMap(this.generateDecodedMap(options));
  }
  getIndentString() {
    const indentStringCounts = {};
    this.sources.forEach((source) => {
      const indentStr = source.content._getRawIndentString();
      if (indentStr === null)
        return;
      if (!indentStringCounts[indentStr])
        indentStringCounts[indentStr] = 0;
      indentStringCounts[indentStr] += 1;
    });
    return Object.keys(indentStringCounts).sort((a, b2) => {
      return indentStringCounts[a] - indentStringCounts[b2];
    })[0] || "\t";
  }
  indent(indentStr) {
    if (!arguments.length) {
      indentStr = this.getIndentString();
    }
    if (indentStr === "")
      return this;
    let trailingNewline = !this.intro || this.intro.slice(-1) === `
`;
    this.sources.forEach((source, i2) => {
      const separator = source.separator !== undefined ? source.separator : this.separator;
      const indentStart = trailingNewline || i2 > 0 && /\r?\n$/.test(separator);
      source.content.indent(indentStr, {
        exclude: source.indentExclusionRanges,
        indentStart
      });
      trailingNewline = source.content.lastChar() === `
`;
    });
    if (this.intro) {
      this.intro = indentStr + this.intro.replace(/^[^\n]/gm, (match, index) => {
        return index > 0 ? indentStr + match : match;
      });
    }
    return this;
  }
  prepend(str) {
    this.intro = str + this.intro;
    return this;
  }
  toString() {
    const body = this.sources.map((source, i2) => {
      const separator = source.separator !== undefined ? source.separator : this.separator;
      const str = (i2 > 0 ? separator : "") + source.content.toString();
      return str;
    }).join("");
    return this.intro + body;
  }
  isEmpty() {
    if (this.intro.length && this.intro.trim())
      return false;
    if (this.sources.some((source) => !source.content.isEmpty()))
      return false;
    return true;
  }
  length() {
    return this.sources.reduce((length, source) => length + source.content.length(), this.intro.length);
  }
  trimLines() {
    return this.trim("[\\r\\n]");
  }
  trim(charType) {
    return this.trimStart(charType).trimEnd(charType);
  }
  trimStart(charType) {
    const rx = new RegExp("^" + (charType || "\\s") + "+");
    this.intro = this.intro.replace(rx, "");
    if (!this.intro) {
      let source;
      let i2 = 0;
      do {
        source = this.sources[i2++];
        if (!source) {
          break;
        }
      } while (!source.content.trimStartAborted(charType));
    }
    return this;
  }
  trimEnd(charType) {
    const rx = new RegExp((charType || "\\s") + "+$");
    let source;
    let i2 = this.sources.length - 1;
    do {
      source = this.sources[i2--];
      if (!source) {
        this.intro = this.intro.replace(rx, "");
        break;
      }
    } while (!source.content.trimEndAborted(charType));
    return this;
  }
}
var btoa, toString, wordRegex, n = `
`, warned, hasOwnProp;
var init_magic_string_es = __esm(() => {
  init_sourcemap_codec();
  btoa = /* @__PURE__ */ getBtoa();
  toString = Object.prototype.toString;
  wordRegex = /\w/;
  warned = {
    insertLeft: false,
    insertRight: false,
    storeName: false
  };
  hasOwnProp = Object.prototype.hasOwnProperty;
});

// node_modules/@vitest/utils/dist/helpers.js
function assertTypes(value, name, types) {
  const receivedType = typeof value;
  const pass = types.includes(receivedType);
  if (!pass)
    throw new TypeError(`${name} value must be ${types.join(" or ")}, received "${receivedType}"`);
}
function isObject(item) {
  return item != null && typeof item === "object" && !Array.isArray(item);
}
function isFinalObj(obj) {
  return obj === Object.prototype || obj === Function.prototype || obj === RegExp.prototype;
}
function getType(value) {
  return Object.prototype.toString.apply(value).slice(8, -1);
}
function collectOwnProperties(obj, collector) {
  const collect = typeof collector === "function" ? collector : (key) => collector.add(key);
  Object.getOwnPropertyNames(obj).forEach(collect);
  Object.getOwnPropertySymbols(obj).forEach(collect);
}
function getOwnProperties(obj) {
  const ownProps = /* @__PURE__ */ new Set;
  if (isFinalObj(obj))
    return [];
  collectOwnProperties(obj, ownProps);
  return Array.from(ownProps);
}
var defaultCloneOptions = { forceWritable: false };
function deepClone(val, options = defaultCloneOptions) {
  const seen = /* @__PURE__ */ new WeakMap;
  return clone(val, seen, options);
}
function clone(val, seen, options = defaultCloneOptions) {
  let k, out;
  if (seen.has(val))
    return seen.get(val);
  if (Array.isArray(val)) {
    out = Array(k = val.length);
    seen.set(val, out);
    while (k--)
      out[k] = clone(val[k], seen, options);
    return out;
  }
  if (Object.prototype.toString.call(val) === "[object Object]") {
    out = Object.create(Object.getPrototypeOf(val));
    seen.set(val, out);
    const props = getOwnProperties(val);
    for (const k2 of props) {
      const descriptor = Object.getOwnPropertyDescriptor(val, k2);
      if (!descriptor)
        continue;
      const cloned = clone(val[k2], seen, options);
      if (options.forceWritable) {
        Object.defineProperty(out, k2, {
          enumerable: descriptor.enumerable,
          configurable: true,
          writable: true,
          value: cloned
        });
      } else if ("get" in descriptor) {
        Object.defineProperty(out, k2, {
          ...descriptor,
          get() {
            return cloned;
          }
        });
      } else {
        Object.defineProperty(out, k2, {
          ...descriptor,
          value: cloned
        });
      }
    }
    return out;
  }
  return val;
}
function noop() {}
function objectAttr(source, path, defaultValue = undefined) {
  const paths = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  let result = source;
  for (const p of paths) {
    result = Object(result)[p];
    if (result === undefined)
      return defaultValue;
  }
  return result;
}
function createDefer() {
  let resolve = null;
  let reject = null;
  const p = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  p.resolve = resolve;
  p.reject = reject;
  return p;
}
// node_modules/@vitest/utils/dist/chunk-display.js
var import_pretty_format = __toESM(require_build(), 1);
var loupe = __toESM(require_loupe(), 1);
var {
  AsymmetricMatcher,
  DOMCollection,
  DOMElement,
  Immutable,
  ReactElement,
  ReactTestComponent
} = import_pretty_format.plugins;
var PLUGINS = [
  ReactTestComponent,
  ReactElement,
  DOMElement,
  DOMCollection,
  Immutable,
  AsymmetricMatcher
];
function stringify(object, maxDepth = 10, { maxLength, ...options } = {}) {
  const MAX_LENGTH = maxLength ?? 1e4;
  let result;
  try {
    result = import_pretty_format.format(object, {
      maxDepth,
      escapeString: false,
      plugins: PLUGINS,
      ...options
    });
  } catch {
    result = import_pretty_format.format(object, {
      callToJSON: false,
      maxDepth,
      escapeString: false,
      plugins: PLUGINS,
      ...options
    });
  }
  return result.length >= MAX_LENGTH && maxDepth > 1 ? stringify(object, Math.floor(maxDepth / 2)) : result;
}
var formatRegExp2 = /%[sdjifoOcj%]/g;
function format2(...args) {
  if (typeof args[0] !== "string") {
    const objects = [];
    for (let i2 = 0;i2 < args.length; i2++)
      objects.push(inspect5(args[i2], { depth: 0, colors: false, compact: 3 }));
    return objects.join(" ");
  }
  const len = args.length;
  let i = 1;
  const template = args[0];
  let str = String(template).replace(formatRegExp2, (x) => {
    if (x === "%%")
      return "%";
    if (i >= len)
      return x;
    switch (x) {
      case "%s": {
        const value = args[i++];
        if (typeof value === "bigint")
          return `${value.toString()}n`;
        if (typeof value === "number" && value === 0 && 1 / value < 0)
          return "-0";
        if (typeof value === "object" && value !== null)
          return inspect5(value, { depth: 0, colors: false, compact: 3 });
        return String(value);
      }
      case "%d": {
        const value = args[i++];
        if (typeof value === "bigint")
          return `${value.toString()}n`;
        return Number(value).toString();
      }
      case "%i": {
        const value = args[i++];
        if (typeof value === "bigint")
          return `${value.toString()}n`;
        return Number.parseInt(String(value)).toString();
      }
      case "%f":
        return Number.parseFloat(String(args[i++])).toString();
      case "%o":
        return inspect5(args[i++], { showHidden: true, showProxy: true });
      case "%O":
        return inspect5(args[i++]);
      case "%c": {
        i++;
        return "";
      }
      case "%j":
        try {
          return JSON.stringify(args[i++]);
        } catch (err) {
          const m = err.message;
          if (m.includes("circular structure") || m.includes("cyclic structures") || m.includes("cyclic object"))
            return "[Circular]";
          throw err;
        }
      default:
        return x;
    }
  });
  for (let x = args[i];i < len; x = args[++i]) {
    if (x === null || typeof x !== "object")
      str += ` ${x}`;
    else
      str += ` ${inspect5(x)}`;
  }
  return str;
}
function inspect5(obj, options = {}) {
  if (options.truncate === 0)
    options.truncate = Number.POSITIVE_INFINITY;
  return loupe.inspect(obj, options);
}
function objDisplay(obj, options = {}) {
  if (typeof options.truncate === "undefined")
    options.truncate = 40;
  const str = inspect5(obj, options);
  const type = Object.prototype.toString.call(obj);
  if (options.truncate && str.length >= options.truncate) {
    if (type === "[object Function]") {
      const fn = obj;
      return !fn.name ? "[Function]" : `[Function: ${fn.name}]`;
    } else if (type === "[object Array]") {
      return `[ Array(${obj.length}) ]`;
    } else if (type === "[object Object]") {
      const keys = Object.keys(obj);
      const kstr = keys.length > 2 ? `${keys.splice(0, 2).join(", ")}, ...` : keys.join(", ");
      return `{ Object (${kstr}) }`;
    } else {
      return str;
    }
  }
  return str;
}
// node_modules/@vitest/utils/dist/chunk-colors.js
var SAFE_TIMERS_SYMBOL = Symbol("vitest:SAFE_TIMERS");
var SAFE_COLORS_SYMBOL = Symbol("vitest:SAFE_COLORS");
var colorsMap = {
  bold: ["\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"],
  dim: ["\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"],
  italic: ["\x1B[3m", "\x1B[23m"],
  underline: ["\x1B[4m", "\x1B[24m"],
  inverse: ["\x1B[7m", "\x1B[27m"],
  hidden: ["\x1B[8m", "\x1B[28m"],
  strikethrough: ["\x1B[9m", "\x1B[29m"],
  black: ["\x1B[30m", "\x1B[39m"],
  red: ["\x1B[31m", "\x1B[39m"],
  green: ["\x1B[32m", "\x1B[39m"],
  yellow: ["\x1B[33m", "\x1B[39m"],
  blue: ["\x1B[34m", "\x1B[39m"],
  magenta: ["\x1B[35m", "\x1B[39m"],
  cyan: ["\x1B[36m", "\x1B[39m"],
  white: ["\x1B[37m", "\x1B[39m"],
  gray: ["\x1B[90m", "\x1B[39m"],
  bgBlack: ["\x1B[40m", "\x1B[49m"],
  bgRed: ["\x1B[41m", "\x1B[49m"],
  bgGreen: ["\x1B[42m", "\x1B[49m"],
  bgYellow: ["\x1B[43m", "\x1B[49m"],
  bgBlue: ["\x1B[44m", "\x1B[49m"],
  bgMagenta: ["\x1B[45m", "\x1B[49m"],
  bgCyan: ["\x1B[46m", "\x1B[49m"],
  bgWhite: ["\x1B[47m", "\x1B[49m"]
};
var colorsEntries = Object.entries(colorsMap);
function string(str) {
  return String(str);
}
string.open = "";
string.close = "";
var defaultColors = /* @__PURE__ */ colorsEntries.reduce((acc, [key]) => {
  acc[key] = string;
  return acc;
}, { isColorSupported: false });
function getColors() {
  return globalThis[SAFE_COLORS_SYMBOL] || defaultColors;
}

// node_modules/@vitest/utils/dist/index.js
var import_pretty_format2 = __toESM(require_build(), 1);
var import_loupe = __toESM(require_loupe(), 1);
function getSafeTimers() {
  const {
    setTimeout: safeSetTimeout,
    setInterval: safeSetInterval,
    clearInterval: safeClearInterval,
    clearTimeout: safeClearTimeout,
    setImmediate: safeSetImmediate,
    clearImmediate: safeClearImmediate
  } = globalThis[SAFE_TIMERS_SYMBOL] || globalThis;
  const {
    nextTick: safeNextTick
  } = globalThis[SAFE_TIMERS_SYMBOL] || globalThis.process || { nextTick: (cb) => cb() };
  return {
    nextTick: safeNextTick,
    setTimeout: safeSetTimeout,
    setInterval: safeSetInterval,
    clearInterval: safeClearInterval,
    clearTimeout: safeClearTimeout,
    setImmediate: safeSetImmediate,
    clearImmediate: safeClearImmediate
  };
}
function createSimpleStackTrace(options) {
  const { message = "error", stackTraceLimit = 1 } = options || {};
  const limit = Error.stackTraceLimit;
  const prepareStackTrace = Error.prepareStackTrace;
  Error.stackTraceLimit = stackTraceLimit;
  Error.prepareStackTrace = (e) => e.stack;
  const err = new Error(message);
  const stackTrace = err.stack || "";
  Error.prepareStackTrace = prepareStackTrace;
  Error.stackTraceLimit = limit;
  return stackTrace;
}
var Identifier;
var JSXIdentifier;
var JSXPunctuator;
var JSXString;
var JSXText;
var KeywordsWithExpressionAfter;
var KeywordsWithNoLineTerminatorAfter;
var LineTerminatorSequence;
var MultiLineComment;
var Newline;
var NumericLiteral;
var Punctuator;
var RegularExpressionLiteral;
var SingleLineComment;
var StringLiteral;
var Template;
var TokensNotPrecedingObjectLiteral;
var TokensPrecedingExpression;
var WhiteSpace;
RegularExpressionLiteral = /\/(?![*\/])(?:\[(?:(?![\]\\]).|\\.)*\]|(?![\/\\]).|\\.)*(\/[$_\u200C\u200D\p{ID_Continue}]*|\\)?/yu;
Punctuator = /--|\+\+|=>|\.{3}|\??\.(?!\d)|(?:&&|\|\||\?\?|[+\-%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2}|\/(?![\/*]))=?|[?~,:;[\](){}]/y;
Identifier = /(\x23?)(?=[$_\p{ID_Start}\\])(?:[$_\u200C\u200D\p{ID_Continue}]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+/yu;
StringLiteral = /(['"])(?:(?!\1)[^\\\n\r]|\\(?:\r\n|[^]))*(\1)?/y;
NumericLiteral = /(?:0[xX][\da-fA-F](?:_?[\da-fA-F])*|0[oO][0-7](?:_?[0-7])*|0[bB][01](?:_?[01])*)n?|0n|[1-9](?:_?\d)*n|(?:(?:0(?!\d)|0\d*[89]\d*|[1-9](?:_?\d)*)(?:\.(?:\d(?:_?\d)*)?)?|\.\d(?:_?\d)*)(?:[eE][+-]?\d(?:_?\d)*)?|0[0-7]+/y;
Template = /[`}](?:[^`\\$]|\\[^]|\$(?!\{))*(`|\$\{)?/y;
WhiteSpace = /[\t\v\f\ufeff\p{Zs}]+/yu;
LineTerminatorSequence = /\r?\n|[\r\u2028\u2029]/y;
MultiLineComment = /\/\*(?:[^*]|\*(?!\/))*(\*\/)?/y;
SingleLineComment = /\/\/.*/y;
JSXPunctuator = /[<>.:={}]|\/(?![\/*])/y;
JSXIdentifier = /[$_\p{ID_Start}][$_\u200C\u200D\p{ID_Continue}-]*/yu;
JSXString = /(['"])(?:(?!\1)[^])*(\1)?/y;
JSXText = /[^<>{}]+/y;
TokensPrecedingExpression = /^(?:[\/+-]|\.{3}|\?(?:InterpolationIn(?:JSX|Template)|NoLineTerminatorHere|NonExpressionParenEnd|UnaryIncDec))?$|[{}([,;<>=*%&|^!~?:]$/;
TokensNotPrecedingObjectLiteral = /^(?:=>|[;\]){}]|else|\?(?:NoLineTerminatorHere|NonExpressionParenEnd))?$/;
KeywordsWithExpressionAfter = /^(?:await|case|default|delete|do|else|instanceof|new|return|throw|typeof|void|yield)$/;
KeywordsWithNoLineTerminatorAfter = /^(?:return|throw|yield)$/;
Newline = RegExp(LineTerminatorSequence.source);
var reservedWords = {
  keyword: [
    "break",
    "case",
    "catch",
    "continue",
    "debugger",
    "default",
    "do",
    "else",
    "finally",
    "for",
    "function",
    "if",
    "return",
    "switch",
    "throw",
    "try",
    "var",
    "const",
    "while",
    "with",
    "new",
    "this",
    "super",
    "class",
    "extends",
    "export",
    "import",
    "null",
    "true",
    "false",
    "in",
    "instanceof",
    "typeof",
    "void",
    "delete"
  ],
  strict: [
    "implements",
    "interface",
    "let",
    "package",
    "private",
    "protected",
    "public",
    "static",
    "yield"
  ]
};
var keywords = new Set(reservedWords.keyword);
var reservedWordsStrictSet = new Set(reservedWords.strict);

// node_modules/@vitest/utils/dist/diff.js
var import_pretty_format3 = __toESM(require_build(), 1);
var diff$1 = __toESM(require_build2(), 1);
function getType2(value) {
  if (value === undefined) {
    return "undefined";
  } else if (value === null) {
    return "null";
  } else if (Array.isArray(value)) {
    return "array";
  } else if (typeof value === "boolean") {
    return "boolean";
  } else if (typeof value === "function") {
    return "function";
  } else if (typeof value === "number") {
    return "number";
  } else if (typeof value === "string") {
    return "string";
  } else if (typeof value === "bigint") {
    return "bigint";
  } else if (typeof value === "object") {
    if (value != null) {
      if (value.constructor === RegExp)
        return "regexp";
      else if (value.constructor === Map)
        return "map";
      else if (value.constructor === Set)
        return "set";
      else if (value.constructor === Date)
        return "date";
    }
    return "object";
  } else if (typeof value === "symbol") {
    return "symbol";
  }
  throw new Error(`value of unknown type: ${value}`);
}
var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;

class Diff {
  0;
  1;
  constructor(op, text) {
    this[0] = op;
    this[1] = text;
  }
}
var NO_DIFF_MESSAGE = "Compared values have no visual difference.";
var SIMILAR_MESSAGE = "Compared values serialize to the same structure.\nPrinting internal object structure without calling `toJSON` instead.";
function formatTrailingSpaces(line, trailingSpaceFormatter) {
  return line.replace(/\s+$/, (match) => trailingSpaceFormatter(match));
}
function printDiffLine(line, isFirstOrLast, color, indicator, trailingSpaceFormatter, emptyFirstOrLastLinePlaceholder) {
  return line.length !== 0 ? color(`${indicator} ${formatTrailingSpaces(line, trailingSpaceFormatter)}`) : indicator !== " " ? color(indicator) : isFirstOrLast && emptyFirstOrLastLinePlaceholder.length !== 0 ? color(`${indicator} ${emptyFirstOrLastLinePlaceholder}`) : "";
}
function printDeleteLine(line, isFirstOrLast, {
  aColor,
  aIndicator,
  changeLineTrailingSpaceColor,
  emptyFirstOrLastLinePlaceholder
}) {
  return printDiffLine(line, isFirstOrLast, aColor, aIndicator, changeLineTrailingSpaceColor, emptyFirstOrLastLinePlaceholder);
}
function printInsertLine(line, isFirstOrLast, {
  bColor,
  bIndicator,
  changeLineTrailingSpaceColor,
  emptyFirstOrLastLinePlaceholder
}) {
  return printDiffLine(line, isFirstOrLast, bColor, bIndicator, changeLineTrailingSpaceColor, emptyFirstOrLastLinePlaceholder);
}
function printCommonLine(line, isFirstOrLast, {
  commonColor,
  commonIndicator,
  commonLineTrailingSpaceColor,
  emptyFirstOrLastLinePlaceholder
}) {
  return printDiffLine(line, isFirstOrLast, commonColor, commonIndicator, commonLineTrailingSpaceColor, emptyFirstOrLastLinePlaceholder);
}
function createPatchMark(aStart, aEnd, bStart, bEnd, { patchColor }) {
  return patchColor(`@@ -${aStart + 1},${aEnd - aStart} +${bStart + 1},${bEnd - bStart} @@`);
}
function joinAlignedDiffsNoExpand(diffs, options) {
  const iLength = diffs.length;
  const nContextLines = options.contextLines;
  const nContextLines2 = nContextLines + nContextLines;
  let jLength = iLength;
  let hasExcessAtStartOrEnd = false;
  let nExcessesBetweenChanges = 0;
  let i = 0;
  while (i !== iLength) {
    const iStart = i;
    while (i !== iLength && diffs[i][0] === DIFF_EQUAL)
      i += 1;
    if (iStart !== i) {
      if (iStart === 0) {
        if (i > nContextLines) {
          jLength -= i - nContextLines;
          hasExcessAtStartOrEnd = true;
        }
      } else if (i === iLength) {
        const n = i - iStart;
        if (n > nContextLines) {
          jLength -= n - nContextLines;
          hasExcessAtStartOrEnd = true;
        }
      } else {
        const n = i - iStart;
        if (n > nContextLines2) {
          jLength -= n - nContextLines2;
          nExcessesBetweenChanges += 1;
        }
      }
    }
    while (i !== iLength && diffs[i][0] !== DIFF_EQUAL)
      i += 1;
  }
  const hasPatch = nExcessesBetweenChanges !== 0 || hasExcessAtStartOrEnd;
  if (nExcessesBetweenChanges !== 0)
    jLength += nExcessesBetweenChanges + 1;
  else if (hasExcessAtStartOrEnd)
    jLength += 1;
  const jLast = jLength - 1;
  const lines = [];
  let jPatchMark = 0;
  if (hasPatch)
    lines.push("");
  let aStart = 0;
  let bStart = 0;
  let aEnd = 0;
  let bEnd = 0;
  const pushCommonLine = (line) => {
    const j = lines.length;
    lines.push(printCommonLine(line, j === 0 || j === jLast, options));
    aEnd += 1;
    bEnd += 1;
  };
  const pushDeleteLine = (line) => {
    const j = lines.length;
    lines.push(printDeleteLine(line, j === 0 || j === jLast, options));
    aEnd += 1;
  };
  const pushInsertLine = (line) => {
    const j = lines.length;
    lines.push(printInsertLine(line, j === 0 || j === jLast, options));
    bEnd += 1;
  };
  i = 0;
  while (i !== iLength) {
    let iStart = i;
    while (i !== iLength && diffs[i][0] === DIFF_EQUAL)
      i += 1;
    if (iStart !== i) {
      if (iStart === 0) {
        if (i > nContextLines) {
          iStart = i - nContextLines;
          aStart = iStart;
          bStart = iStart;
          aEnd = aStart;
          bEnd = bStart;
        }
        for (let iCommon = iStart;iCommon !== i; iCommon += 1)
          pushCommonLine(diffs[iCommon][1]);
      } else if (i === iLength) {
        const iEnd = i - iStart > nContextLines ? iStart + nContextLines : i;
        for (let iCommon = iStart;iCommon !== iEnd; iCommon += 1)
          pushCommonLine(diffs[iCommon][1]);
      } else {
        const nCommon = i - iStart;
        if (nCommon > nContextLines2) {
          const iEnd = iStart + nContextLines;
          for (let iCommon = iStart;iCommon !== iEnd; iCommon += 1)
            pushCommonLine(diffs[iCommon][1]);
          lines[jPatchMark] = createPatchMark(aStart, aEnd, bStart, bEnd, options);
          jPatchMark = lines.length;
          lines.push("");
          const nOmit = nCommon - nContextLines2;
          aStart = aEnd + nOmit;
          bStart = bEnd + nOmit;
          aEnd = aStart;
          bEnd = bStart;
          for (let iCommon = i - nContextLines;iCommon !== i; iCommon += 1)
            pushCommonLine(diffs[iCommon][1]);
        } else {
          for (let iCommon = iStart;iCommon !== i; iCommon += 1)
            pushCommonLine(diffs[iCommon][1]);
        }
      }
    }
    while (i !== iLength && diffs[i][0] === DIFF_DELETE) {
      pushDeleteLine(diffs[i][1]);
      i += 1;
    }
    while (i !== iLength && diffs[i][0] === DIFF_INSERT) {
      pushInsertLine(diffs[i][1]);
      i += 1;
    }
  }
  if (hasPatch)
    lines[jPatchMark] = createPatchMark(aStart, aEnd, bStart, bEnd, options);
  return lines.join(`
`);
}
function joinAlignedDiffsExpand(diffs, options) {
  return diffs.map((diff, i, diffs2) => {
    const line = diff[1];
    const isFirstOrLast = i === 0 || i === diffs2.length - 1;
    switch (diff[0]) {
      case DIFF_DELETE:
        return printDeleteLine(line, isFirstOrLast, options);
      case DIFF_INSERT:
        return printInsertLine(line, isFirstOrLast, options);
      default:
        return printCommonLine(line, isFirstOrLast, options);
    }
  }).join(`
`);
}
var noColor = (string2) => string2;
var DIFF_CONTEXT_DEFAULT = 5;
var DIFF_TRUNCATE_THRESHOLD_DEFAULT = 0;
function getDefaultOptions() {
  const c = getColors();
  return {
    aAnnotation: "Expected",
    aColor: c.green,
    aIndicator: "-",
    bAnnotation: "Received",
    bColor: c.red,
    bIndicator: "+",
    changeColor: c.inverse,
    changeLineTrailingSpaceColor: noColor,
    commonColor: c.dim,
    commonIndicator: " ",
    commonLineTrailingSpaceColor: noColor,
    compareKeys: undefined,
    contextLines: DIFF_CONTEXT_DEFAULT,
    emptyFirstOrLastLinePlaceholder: "",
    expand: true,
    includeChangeCounts: false,
    omitAnnotationLines: false,
    patchColor: c.yellow,
    truncateThreshold: DIFF_TRUNCATE_THRESHOLD_DEFAULT,
    truncateAnnotation: "... Diff result is truncated",
    truncateAnnotationColor: noColor
  };
}
function getCompareKeys(compareKeys) {
  return compareKeys && typeof compareKeys === "function" ? compareKeys : undefined;
}
function getContextLines(contextLines) {
  return typeof contextLines === "number" && Number.isSafeInteger(contextLines) && contextLines >= 0 ? contextLines : DIFF_CONTEXT_DEFAULT;
}
function normalizeDiffOptions(options = {}) {
  return {
    ...getDefaultOptions(),
    ...options,
    compareKeys: getCompareKeys(options.compareKeys),
    contextLines: getContextLines(options.contextLines)
  };
}
function isEmptyString(lines) {
  return lines.length === 1 && lines[0].length === 0;
}
function countChanges(diffs) {
  let a = 0;
  let b = 0;
  diffs.forEach((diff2) => {
    switch (diff2[0]) {
      case DIFF_DELETE:
        a += 1;
        break;
      case DIFF_INSERT:
        b += 1;
        break;
    }
  });
  return { a, b };
}
function printAnnotation({
  aAnnotation,
  aColor,
  aIndicator,
  bAnnotation,
  bColor,
  bIndicator,
  includeChangeCounts,
  omitAnnotationLines
}, changeCounts) {
  if (omitAnnotationLines)
    return "";
  let aRest = "";
  let bRest = "";
  if (includeChangeCounts) {
    const aCount = String(changeCounts.a);
    const bCount = String(changeCounts.b);
    const baAnnotationLengthDiff = bAnnotation.length - aAnnotation.length;
    const aAnnotationPadding = " ".repeat(Math.max(0, baAnnotationLengthDiff));
    const bAnnotationPadding = " ".repeat(Math.max(0, -baAnnotationLengthDiff));
    const baCountLengthDiff = bCount.length - aCount.length;
    const aCountPadding = " ".repeat(Math.max(0, baCountLengthDiff));
    const bCountPadding = " ".repeat(Math.max(0, -baCountLengthDiff));
    aRest = `${aAnnotationPadding}  ${aIndicator} ${aCountPadding}${aCount}`;
    bRest = `${bAnnotationPadding}  ${bIndicator} ${bCountPadding}${bCount}`;
  }
  const a = `${aIndicator} ${aAnnotation}${aRest}`;
  const b = `${bIndicator} ${bAnnotation}${bRest}`;
  return `${aColor(a)}
${bColor(b)}

`;
}
function printDiffLines(diffs, truncated, options) {
  return printAnnotation(options, countChanges(diffs)) + (options.expand ? joinAlignedDiffsExpand(diffs, options) : joinAlignedDiffsNoExpand(diffs, options)) + (truncated ? options.truncateAnnotationColor(`
${options.truncateAnnotation}`) : "");
}
function diffLinesUnified(aLines, bLines, options) {
  const normalizedOptions = normalizeDiffOptions(options);
  const [diffs, truncated] = diffLinesRaw(isEmptyString(aLines) ? [] : aLines, isEmptyString(bLines) ? [] : bLines, normalizedOptions);
  return printDiffLines(diffs, truncated, normalizedOptions);
}
function diffLinesUnified2(aLinesDisplay, bLinesDisplay, aLinesCompare, bLinesCompare, options) {
  if (isEmptyString(aLinesDisplay) && isEmptyString(aLinesCompare)) {
    aLinesDisplay = [];
    aLinesCompare = [];
  }
  if (isEmptyString(bLinesDisplay) && isEmptyString(bLinesCompare)) {
    bLinesDisplay = [];
    bLinesCompare = [];
  }
  if (aLinesDisplay.length !== aLinesCompare.length || bLinesDisplay.length !== bLinesCompare.length) {
    return diffLinesUnified(aLinesDisplay, bLinesDisplay, options);
  }
  const [diffs, truncated] = diffLinesRaw(aLinesCompare, bLinesCompare, options);
  let aIndex = 0;
  let bIndex = 0;
  diffs.forEach((diff2) => {
    switch (diff2[0]) {
      case DIFF_DELETE:
        diff2[1] = aLinesDisplay[aIndex];
        aIndex += 1;
        break;
      case DIFF_INSERT:
        diff2[1] = bLinesDisplay[bIndex];
        bIndex += 1;
        break;
      default:
        diff2[1] = bLinesDisplay[bIndex];
        aIndex += 1;
        bIndex += 1;
    }
  });
  return printDiffLines(diffs, truncated, normalizeDiffOptions(options));
}
function diffLinesRaw(aLines, bLines, options) {
  const truncate = (options == null ? undefined : options.truncateThreshold) ?? false;
  const truncateThreshold = Math.max(Math.floor((options == null ? undefined : options.truncateThreshold) ?? 0), 0);
  const aLength = truncate ? Math.min(aLines.length, truncateThreshold) : aLines.length;
  const bLength = truncate ? Math.min(bLines.length, truncateThreshold) : bLines.length;
  const truncated = aLength !== aLines.length || bLength !== bLines.length;
  const isCommon = (aIndex2, bIndex2) => aLines[aIndex2] === bLines[bIndex2];
  const diffs = [];
  let aIndex = 0;
  let bIndex = 0;
  const foundSubsequence = (nCommon, aCommon, bCommon) => {
    for (;aIndex !== aCommon; aIndex += 1)
      diffs.push(new Diff(DIFF_DELETE, aLines[aIndex]));
    for (;bIndex !== bCommon; bIndex += 1)
      diffs.push(new Diff(DIFF_INSERT, bLines[bIndex]));
    for (;nCommon !== 0; nCommon -= 1, aIndex += 1, bIndex += 1)
      diffs.push(new Diff(DIFF_EQUAL, bLines[bIndex]));
  };
  const diffSequences = diff$1.default.default || diff$1.default;
  diffSequences(aLength, bLength, isCommon, foundSubsequence);
  for (;aIndex !== aLength; aIndex += 1)
    diffs.push(new Diff(DIFF_DELETE, aLines[aIndex]));
  for (;bIndex !== bLength; bIndex += 1)
    diffs.push(new Diff(DIFF_INSERT, bLines[bIndex]));
  return [diffs, truncated];
}
function getCommonMessage(message, options) {
  const { commonColor } = normalizeDiffOptions(options);
  return commonColor(message);
}
var {
  AsymmetricMatcher: AsymmetricMatcher2,
  DOMCollection: DOMCollection2,
  DOMElement: DOMElement2,
  Immutable: Immutable2,
  ReactElement: ReactElement2,
  ReactTestComponent: ReactTestComponent2
} = import_pretty_format3.plugins;
var PLUGINS2 = [
  ReactTestComponent2,
  ReactElement2,
  DOMElement2,
  DOMCollection2,
  Immutable2,
  AsymmetricMatcher2
];
var FORMAT_OPTIONS = {
  plugins: PLUGINS2
};
var FALLBACK_FORMAT_OPTIONS = {
  callToJSON: false,
  maxDepth: 10,
  plugins: PLUGINS2
};
function diff(a, b, options) {
  if (Object.is(a, b))
    return "";
  const aType = getType2(a);
  let expectedType = aType;
  let omitDifference = false;
  if (aType === "object" && typeof a.asymmetricMatch === "function") {
    if (a.$$typeof !== Symbol.for("jest.asymmetricMatcher")) {
      return null;
    }
    if (typeof a.getExpectedType !== "function") {
      return null;
    }
    expectedType = a.getExpectedType();
    omitDifference = expectedType === "string";
  }
  if (expectedType !== getType2(b)) {
    const { aAnnotation, aColor, aIndicator, bAnnotation, bColor, bIndicator } = normalizeDiffOptions(options);
    const formatOptions = getFormatOptions(FALLBACK_FORMAT_OPTIONS, options);
    const aDisplay = import_pretty_format3.format(a, formatOptions);
    const bDisplay = import_pretty_format3.format(b, formatOptions);
    const aDiff = `${aColor(`${aIndicator} ${aAnnotation}:`)} 
${aDisplay}`;
    const bDiff = `${bColor(`${bIndicator} ${bAnnotation}:`)} 
${bDisplay}`;
    return `${aDiff}

${bDiff}`;
  }
  if (omitDifference)
    return null;
  switch (aType) {
    case "string":
      return diffLinesUnified(a.split(`
`), b.split(`
`), options);
    case "boolean":
    case "number":
      return comparePrimitive(a, b, options);
    case "map":
      return compareObjects(sortMap(a), sortMap(b), options);
    case "set":
      return compareObjects(sortSet(a), sortSet(b), options);
    default:
      return compareObjects(a, b, options);
  }
}
function comparePrimitive(a, b, options) {
  const aFormat = import_pretty_format3.format(a, FORMAT_OPTIONS);
  const bFormat = import_pretty_format3.format(b, FORMAT_OPTIONS);
  return aFormat === bFormat ? "" : diffLinesUnified(aFormat.split(`
`), bFormat.split(`
`), options);
}
function sortMap(map) {
  return new Map(Array.from(map.entries()).sort());
}
function sortSet(set) {
  return new Set(Array.from(set.values()).sort());
}
function compareObjects(a, b, options) {
  let difference;
  let hasThrown = false;
  try {
    const formatOptions = getFormatOptions(FORMAT_OPTIONS, options);
    difference = getObjectsDifference(a, b, formatOptions, options);
  } catch {
    hasThrown = true;
  }
  const noDiffMessage = getCommonMessage(NO_DIFF_MESSAGE, options);
  if (difference === undefined || difference === noDiffMessage) {
    const formatOptions = getFormatOptions(FALLBACK_FORMAT_OPTIONS, options);
    difference = getObjectsDifference(a, b, formatOptions, options);
    if (difference !== noDiffMessage && !hasThrown) {
      difference = `${getCommonMessage(SIMILAR_MESSAGE, options)}

${difference}`;
    }
  }
  return difference;
}
function getFormatOptions(formatOptions, options) {
  const { compareKeys } = normalizeDiffOptions(options);
  return {
    ...formatOptions,
    compareKeys
  };
}
function getObjectsDifference(a, b, formatOptions, options) {
  const formatOptionsZeroIndent = { ...formatOptions, indent: 0 };
  const aCompare = import_pretty_format3.format(a, formatOptionsZeroIndent);
  const bCompare = import_pretty_format3.format(b, formatOptionsZeroIndent);
  if (aCompare === bCompare) {
    return getCommonMessage(NO_DIFF_MESSAGE, options);
  } else {
    const aDisplay = import_pretty_format3.format(a, formatOptions);
    const bDisplay = import_pretty_format3.format(b, formatOptions);
    return diffLinesUnified2(aDisplay.split(`
`), bDisplay.split(`
`), aCompare.split(`
`), bCompare.split(`
`), options);
  }
}

// node_modules/@vitest/utils/dist/error.js
var import_pretty_format4 = __toESM(require_build(), 1);
var import_diff_sequences = __toESM(require_build2(), 1);
var import_loupe2 = __toESM(require_loupe(), 1);
var IS_RECORD_SYMBOL = "@@__IMMUTABLE_RECORD__@@";
var IS_COLLECTION_SYMBOL = "@@__IMMUTABLE_ITERABLE__@@";
function isImmutable(v) {
  return v && (v[IS_COLLECTION_SYMBOL] || v[IS_RECORD_SYMBOL]);
}
var OBJECT_PROTO = Object.getPrototypeOf({});
function getUnserializableMessage(err) {
  if (err instanceof Error)
    return `<unserializable>: ${err.message}`;
  if (typeof err === "string")
    return `<unserializable>: ${err}`;
  return "<unserializable>";
}
function serializeError(val, seen = /* @__PURE__ */ new WeakMap) {
  if (!val || typeof val === "string")
    return val;
  if (typeof val === "function")
    return `Function<${val.name || "anonymous"}>`;
  if (typeof val === "symbol")
    return val.toString();
  if (typeof val !== "object")
    return val;
  if (isImmutable(val))
    return serializeError(val.toJSON(), seen);
  if (val instanceof Promise || val.constructor && val.constructor.prototype === "AsyncFunction")
    return "Promise";
  if (typeof Element !== "undefined" && val instanceof Element)
    return val.tagName;
  if (typeof val.asymmetricMatch === "function")
    return `${val.toString()} ${format2(val.sample)}`;
  if (typeof val.toJSON === "function")
    return val.toJSON();
  if (seen.has(val))
    return seen.get(val);
  if (Array.isArray(val)) {
    const clone2 = new Array(val.length);
    seen.set(val, clone2);
    val.forEach((e, i) => {
      try {
        clone2[i] = serializeError(e, seen);
      } catch (err) {
        clone2[i] = getUnserializableMessage(err);
      }
    });
    return clone2;
  } else {
    const clone2 = /* @__PURE__ */ Object.create(null);
    seen.set(val, clone2);
    let obj = val;
    while (obj && obj !== OBJECT_PROTO) {
      Object.getOwnPropertyNames(obj).forEach((key) => {
        if (key in clone2)
          return;
        try {
          clone2[key] = serializeError(val[key], seen);
        } catch (err) {
          delete clone2[key];
          clone2[key] = getUnserializableMessage(err);
        }
      });
      obj = Object.getPrototypeOf(obj);
    }
    return clone2;
  }
}
function normalizeErrorMessage(message) {
  return message.replace(/__(vite_ssr_import|vi_import)_\d+__\./g, "");
}
function processError(err, diffOptions) {
  if (!err || typeof err !== "object")
    return { message: err };
  if (err.stack)
    err.stackStr = String(err.stack);
  if (err.name)
    err.nameStr = String(err.name);
  if (err.showDiff || err.showDiff === undefined && err.expected !== undefined && err.actual !== undefined) {
    const clonedActual = deepClone(err.actual, { forceWritable: true });
    const clonedExpected = deepClone(err.expected, { forceWritable: true });
    const { replacedActual, replacedExpected } = replaceAsymmetricMatcher(clonedActual, clonedExpected);
    err.diff = diff(replacedExpected, replacedActual, { ...diffOptions, ...err.diffOptions });
  }
  if (typeof err.expected !== "string")
    err.expected = stringify(err.expected, 10);
  if (typeof err.actual !== "string")
    err.actual = stringify(err.actual, 10);
  try {
    if (typeof err.message === "string")
      err.message = normalizeErrorMessage(err.message);
    if (typeof err.cause === "object" && typeof err.cause.message === "string")
      err.cause.message = normalizeErrorMessage(err.cause.message);
  } catch {}
  try {
    return serializeError(err);
  } catch (e) {
    return serializeError(new Error(`Failed to fully serialize error: ${e == null ? undefined : e.message}
Inner error message: ${err == null ? undefined : err.message}`));
  }
}
function isAsymmetricMatcher(data) {
  const type = getType(data);
  return type === "Object" && typeof data.asymmetricMatch === "function";
}
function isReplaceable(obj1, obj2) {
  const obj1Type = getType(obj1);
  const obj2Type = getType(obj2);
  return obj1Type === obj2Type && (obj1Type === "Object" || obj1Type === "Array");
}
function replaceAsymmetricMatcher(actual, expected, actualReplaced = /* @__PURE__ */ new WeakSet, expectedReplaced = /* @__PURE__ */ new WeakSet) {
  if (!isReplaceable(actual, expected))
    return { replacedActual: actual, replacedExpected: expected };
  if (actualReplaced.has(actual) || expectedReplaced.has(expected))
    return { replacedActual: actual, replacedExpected: expected };
  actualReplaced.add(actual);
  expectedReplaced.add(expected);
  getOwnProperties(expected).forEach((key) => {
    const expectedValue = expected[key];
    const actualValue = actual[key];
    if (isAsymmetricMatcher(expectedValue)) {
      if (expectedValue.asymmetricMatch(actualValue))
        actual[key] = expectedValue;
    } else if (isAsymmetricMatcher(actualValue)) {
      if (actualValue.asymmetricMatch(expectedValue))
        expected[key] = actualValue;
    } else if (isReplaceable(actualValue, expectedValue)) {
      const replaced = replaceAsymmetricMatcher(actualValue, expectedValue, actualReplaced, expectedReplaced);
      actual[key] = replaced.replacedActual;
      expected[key] = replaced.replacedExpected;
    }
  });
  return {
    replacedActual: actual,
    replacedExpected: expected
  };
}

// node_modules/@vitest/runner/dist/chunk-tasks.js
function createChainable(keys, fn) {
  function create(context) {
    const chain2 = function(...args) {
      return fn.apply(context, args);
    };
    Object.assign(chain2, fn);
    chain2.withContext = () => chain2.bind(context);
    chain2.setContext = (key, value) => {
      context[key] = value;
    };
    chain2.mergeContext = (ctx) => {
      Object.assign(context, ctx);
    };
    for (const key of keys) {
      Object.defineProperty(chain2, key, {
        get() {
          return create({ ...context, [key]: true });
        }
      });
    }
    return chain2;
  }
  const chain = create({});
  chain.fn = fn;
  return chain;
}
function getNames(task) {
  const names = [task.name];
  let current = task;
  while ((current == null ? undefined : current.suite) || (current == null ? undefined : current.file)) {
    current = current.suite || current.file;
    if (current == null ? undefined : current.name)
      names.unshift(current.name);
  }
  return names;
}

// node_modules/pathe/dist/shared/pathe.ff20891b.mjs
var _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
var _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
var resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1;index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0;index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1)
        ;
      else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
var isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
// node_modules/@vitest/utils/dist/source-map.js
function normalizeWindowsPath2(input = "") {
  if (!input || !input.includes("\\")) {
    return input;
  }
  return input.replace(/\\/g, "/");
}
var _IS_ABSOLUTE_RE2 = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
function cwd2() {
  if (typeof process !== "undefined") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
var resolve$2 = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath2(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1;index >= -1 && !resolvedAbsolute; index--) {
    const path2 = index >= 0 ? arguments_[index] : cwd2();
    if (!path2 || path2.length === 0) {
      continue;
    }
    resolvedPath = `${path2}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute2(path2);
  }
  resolvedPath = normalizeString2(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute2(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString2(path2, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0;index <= path2.length; ++index) {
    if (index < path2.length) {
      char = path2[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1)
        ;
      else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path2.slice(lastSlash + 1, index)}`;
        } else {
          res = path2.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
var isAbsolute2 = function(p) {
  return _IS_ABSOLUTE_RE2.test(p);
};
var comma = 44;
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var intToChar = new Uint8Array(64);
var charToInt = new Uint8Array(128);
for (let i = 0;i < chars.length; i++) {
  const c = chars.charCodeAt(i);
  intToChar[i] = c;
  charToInt[c] = i;
}
function decode(mappings) {
  const state = new Int32Array(5);
  const decoded = [];
  let index = 0;
  do {
    const semi = indexOf(mappings, index);
    const line = [];
    let sorted = true;
    let lastCol = 0;
    state[0] = 0;
    for (let i = index;i < semi; i++) {
      let seg;
      i = decodeInteger(mappings, i, state, 0);
      const col = state[0];
      if (col < lastCol)
        sorted = false;
      lastCol = col;
      if (hasMoreVlq(mappings, i, semi)) {
        i = decodeInteger(mappings, i, state, 1);
        i = decodeInteger(mappings, i, state, 2);
        i = decodeInteger(mappings, i, state, 3);
        if (hasMoreVlq(mappings, i, semi)) {
          i = decodeInteger(mappings, i, state, 4);
          seg = [col, state[1], state[2], state[3], state[4]];
        } else {
          seg = [col, state[1], state[2], state[3]];
        }
      } else {
        seg = [col];
      }
      line.push(seg);
    }
    if (!sorted)
      sort(line);
    decoded.push(line);
    index = semi + 1;
  } while (index <= mappings.length);
  return decoded;
}
function indexOf(mappings, index) {
  const idx = mappings.indexOf(";", index);
  return idx === -1 ? mappings.length : idx;
}
function decodeInteger(mappings, pos, state, j) {
  let value = 0;
  let shift = 0;
  let integer = 0;
  do {
    const c = mappings.charCodeAt(pos++);
    integer = charToInt[c];
    value |= (integer & 31) << shift;
    shift += 5;
  } while (integer & 32);
  const shouldNegate = value & 1;
  value >>>= 1;
  if (shouldNegate) {
    value = -2147483648 | -value;
  }
  state[j] += value;
  return pos;
}
function hasMoreVlq(mappings, i, length) {
  if (i >= length)
    return false;
  return mappings.charCodeAt(i) !== comma;
}
function sort(line) {
  line.sort(sortComparator$1);
}
function sortComparator$1(a, b) {
  return a[0] - b[0];
}
var UrlType;
(function(UrlType2) {
  UrlType2[UrlType2["Empty"] = 1] = "Empty";
  UrlType2[UrlType2["Hash"] = 2] = "Hash";
  UrlType2[UrlType2["Query"] = 3] = "Query";
  UrlType2[UrlType2["RelativePath"] = 4] = "RelativePath";
  UrlType2[UrlType2["AbsolutePath"] = 5] = "AbsolutePath";
  UrlType2[UrlType2["SchemeRelative"] = 6] = "SchemeRelative";
  UrlType2[UrlType2["Absolute"] = 7] = "Absolute";
})(UrlType || (UrlType = {}));
var COLUMN = 0;
var SOURCES_INDEX = 1;
var SOURCE_LINE = 2;
var SOURCE_COLUMN = 3;
var NAMES_INDEX = 4;
var REV_GENERATED_LINE = 1;
var REV_GENERATED_COLUMN = 2;
var found = false;
function binarySearch(haystack, needle, low, high) {
  while (low <= high) {
    const mid = low + (high - low >> 1);
    const cmp = haystack[mid][COLUMN] - needle;
    if (cmp === 0) {
      found = true;
      return mid;
    }
    if (cmp < 0) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  found = false;
  return low - 1;
}
function upperBound(haystack, needle, index) {
  for (let i = index + 1;i < haystack.length; index = i++) {
    if (haystack[i][COLUMN] !== needle)
      break;
  }
  return index;
}
function lowerBound(haystack, needle, index) {
  for (let i = index - 1;i >= 0; index = i--) {
    if (haystack[i][COLUMN] !== needle)
      break;
  }
  return index;
}
function memoizedState() {
  return {
    lastKey: -1,
    lastNeedle: -1,
    lastIndex: -1
  };
}
function memoizedBinarySearch(haystack, needle, state, key) {
  const { lastKey, lastNeedle, lastIndex } = state;
  let low = 0;
  let high = haystack.length - 1;
  if (key === lastKey) {
    if (needle === lastNeedle) {
      found = lastIndex !== -1 && haystack[lastIndex][COLUMN] === needle;
      return lastIndex;
    }
    if (needle >= lastNeedle) {
      low = lastIndex === -1 ? 0 : lastIndex;
    } else {
      high = lastIndex;
    }
  }
  state.lastKey = key;
  state.lastNeedle = needle;
  return state.lastIndex = binarySearch(haystack, needle, low, high);
}
function buildBySources(decoded, memos) {
  const sources = memos.map(buildNullArray);
  for (let i = 0;i < decoded.length; i++) {
    const line = decoded[i];
    for (let j = 0;j < line.length; j++) {
      const seg = line[j];
      if (seg.length === 1)
        continue;
      const sourceIndex = seg[SOURCES_INDEX];
      const sourceLine = seg[SOURCE_LINE];
      const sourceColumn = seg[SOURCE_COLUMN];
      const originalSource = sources[sourceIndex];
      const originalLine = originalSource[sourceLine] || (originalSource[sourceLine] = []);
      const memo = memos[sourceIndex];
      const index = upperBound(originalLine, sourceColumn, memoizedBinarySearch(originalLine, sourceColumn, memo, sourceLine));
      insert(originalLine, memo.lastIndex = index + 1, [sourceColumn, i, seg[COLUMN]]);
    }
  }
  return sources;
}
function insert(array, index, value) {
  for (let i = array.length;i > index; i--) {
    array[i] = array[i - 1];
  }
  array[index] = value;
}
function buildNullArray() {
  return { __proto__: null };
}
var LINE_GTR_ZERO = "`line` must be greater than 0 (lines start at line 1)";
var COL_GTR_EQ_ZERO = "`column` must be greater than or equal to 0 (columns start at column 0)";
var LEAST_UPPER_BOUND = -1;
var GREATEST_LOWER_BOUND = 1;
var decodedMappings;
var originalPositionFor;
var generatedPositionFor;
(() => {
  decodedMappings = (map) => {
    return map._decoded || (map._decoded = decode(map._encoded));
  };
  originalPositionFor = (map, { line, column, bias }) => {
    line--;
    if (line < 0)
      throw new Error(LINE_GTR_ZERO);
    if (column < 0)
      throw new Error(COL_GTR_EQ_ZERO);
    const decoded = decodedMappings(map);
    if (line >= decoded.length)
      return OMapping(null, null, null, null);
    const segments = decoded[line];
    const index = traceSegmentInternal(segments, map._decodedMemo, line, column, bias || GREATEST_LOWER_BOUND);
    if (index === -1)
      return OMapping(null, null, null, null);
    const segment = segments[index];
    if (segment.length === 1)
      return OMapping(null, null, null, null);
    const { names, resolvedSources } = map;
    return OMapping(resolvedSources[segment[SOURCES_INDEX]], segment[SOURCE_LINE] + 1, segment[SOURCE_COLUMN], segment.length === 5 ? names[segment[NAMES_INDEX]] : null);
  };
  generatedPositionFor = (map, { source, line, column, bias }) => {
    return generatedPosition(map, source, line, column, bias || GREATEST_LOWER_BOUND, false);
  };
  function generatedPosition(map, source, line, column, bias, all) {
    line--;
    if (line < 0)
      throw new Error(LINE_GTR_ZERO);
    if (column < 0)
      throw new Error(COL_GTR_EQ_ZERO);
    const { sources, resolvedSources } = map;
    let sourceIndex = sources.indexOf(source);
    if (sourceIndex === -1)
      sourceIndex = resolvedSources.indexOf(source);
    if (sourceIndex === -1)
      return all ? [] : GMapping(null, null);
    const generated = map._bySources || (map._bySources = buildBySources(decodedMappings(map), map._bySourceMemos = sources.map(memoizedState)));
    const segments = generated[sourceIndex][line];
    if (segments == null)
      return all ? [] : GMapping(null, null);
    const memo = map._bySourceMemos[sourceIndex];
    if (all)
      return sliceGeneratedPositions(segments, memo, line, column, bias);
    const index = traceSegmentInternal(segments, memo, line, column, bias);
    if (index === -1)
      return GMapping(null, null);
    const segment = segments[index];
    return GMapping(segment[REV_GENERATED_LINE] + 1, segment[REV_GENERATED_COLUMN]);
  }
})();
function OMapping(source, line, column, name) {
  return { source, line, column, name };
}
function GMapping(line, column) {
  return { line, column };
}
function traceSegmentInternal(segments, memo, line, column, bias) {
  let index = memoizedBinarySearch(segments, column, memo, line);
  if (found) {
    index = (bias === LEAST_UPPER_BOUND ? upperBound : lowerBound)(segments, column, index);
  } else if (bias === LEAST_UPPER_BOUND)
    index++;
  if (index === -1 || index === segments.length)
    return -1;
  return index;
}
function sliceGeneratedPositions(segments, memo, line, column, bias) {
  let min = traceSegmentInternal(segments, memo, line, column, GREATEST_LOWER_BOUND);
  if (!found && bias === LEAST_UPPER_BOUND)
    min++;
  if (min === -1 || min === segments.length)
    return [];
  const matchedColumn = found ? column : segments[min][COLUMN];
  if (!found)
    min = lowerBound(segments, matchedColumn, min);
  const max = upperBound(segments, matchedColumn, min);
  const result = [];
  for (;min <= max; min++) {
    const segment = segments[min];
    result.push(GMapping(segment[REV_GENERATED_LINE] + 1, segment[REV_GENERATED_COLUMN]));
  }
  return result;
}
var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;
function extractLocation(urlLike) {
  if (!urlLike.includes(":"))
    return [urlLike];
  const regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
  const parts = regExp.exec(urlLike.replace(/^\(|\)$/g, ""));
  if (!parts)
    return [urlLike];
  let url = parts[1];
  if (url.startsWith("http:") || url.startsWith("https:")) {
    const urlObj = new URL(url);
    url = urlObj.pathname;
  }
  if (url.startsWith("/@fs/")) {
    url = url.slice(typeof process !== "undefined" && process.platform === "win32" ? 5 : 4);
  }
  return [url, parts[2] || undefined, parts[3] || undefined];
}
function parseSingleFFOrSafariStack(raw) {
  let line = raw.trim();
  if (SAFARI_NATIVE_CODE_REGEXP.test(line))
    return null;
  if (line.includes(" > eval"))
    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ":$1");
  if (!line.includes("@") && !line.includes(":"))
    return null;
  const functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
  const matches = line.match(functionNameRegex);
  const functionName = matches && matches[1] ? matches[1] : undefined;
  const [url, lineNumber, columnNumber] = extractLocation(line.replace(functionNameRegex, ""));
  if (!url || !lineNumber || !columnNumber)
    return null;
  return {
    file: url,
    method: functionName || "",
    line: Number.parseInt(lineNumber),
    column: Number.parseInt(columnNumber)
  };
}
function parseSingleStack(raw) {
  const line = raw.trim();
  if (!CHROME_IE_STACK_REGEXP.test(line))
    return parseSingleFFOrSafariStack(line);
  return parseSingleV8Stack(line);
}
function parseSingleV8Stack(raw) {
  let line = raw.trim();
  if (!CHROME_IE_STACK_REGEXP.test(line))
    return null;
  if (line.includes("(eval "))
    line = line.replace(/eval code/g, "eval").replace(/(\(eval at [^()]*)|(,.*$)/g, "");
  let sanitizedLine = line.replace(/^\s+/, "").replace(/\(eval code/g, "(").replace(/^.*?\s+/, "");
  const location = sanitizedLine.match(/ (\(.+\)$)/);
  sanitizedLine = location ? sanitizedLine.replace(location[0], "") : sanitizedLine;
  const [url, lineNumber, columnNumber] = extractLocation(location ? location[1] : sanitizedLine);
  let method = location && sanitizedLine || "";
  let file = url && ["eval", "<anonymous>"].includes(url) ? undefined : url;
  if (!file || !lineNumber || !columnNumber)
    return null;
  if (method.startsWith("async "))
    method = method.slice(6);
  if (file.startsWith("file://"))
    file = file.slice(7);
  file = resolve$2(file);
  if (method)
    method = method.replace(/__vite_ssr_import_\d+__\./g, "");
  return {
    method,
    file,
    line: Number.parseInt(lineNumber),
    column: Number.parseInt(columnNumber)
  };
}

// node_modules/@vitest/runner/dist/index.js
var fnMap = /* @__PURE__ */ new WeakMap;
var fixtureMap = /* @__PURE__ */ new WeakMap;
var hooksMap = /* @__PURE__ */ new WeakMap;
function setFn(key, fn) {
  fnMap.set(key, fn);
}
function setFixture(key, fixture) {
  fixtureMap.set(key, fixture);
}
function getFixture(key) {
  return fixtureMap.get(key);
}
function setHooks(key, hooks) {
  hooksMap.set(key, hooks);
}
function getHooks(key) {
  return hooksMap.get(key);
}

class PendingError extends Error {
  constructor(message, task) {
    super(message);
    this.message = message;
    this.taskId = task.id;
  }
  code = "VITEST_PENDING";
  taskId;
}
var collectorContext = {
  tasks: [],
  currentSuite: null
};
function collectTask(task) {
  var _a;
  (_a = collectorContext.currentSuite) == null || _a.tasks.push(task);
}
async function runWithSuite(suite, fn) {
  const prev = collectorContext.currentSuite;
  collectorContext.currentSuite = suite;
  await fn();
  collectorContext.currentSuite = prev;
}
function withTimeout(fn, timeout, isHook = false) {
  if (timeout <= 0 || timeout === Number.POSITIVE_INFINITY)
    return fn;
  const { setTimeout, clearTimeout } = getSafeTimers();
  return (...args) => {
    return Promise.race([fn(...args), new Promise((resolve2, reject) => {
      var _a;
      const timer = setTimeout(() => {
        clearTimeout(timer);
        reject(new Error(makeTimeoutMsg(isHook, timeout)));
      }, timeout);
      (_a = timer.unref) == null || _a.call(timer);
    })]);
  };
}
function createTestContext(test, runner) {
  var _a;
  const context = function() {
    throw new Error("done() callback is deprecated, use promise instead");
  };
  context.task = test;
  context.skip = () => {
    test.pending = true;
    throw new PendingError("test is skipped; abort execution", test);
  };
  context.onTestFailed = (fn) => {
    test.onFailed || (test.onFailed = []);
    test.onFailed.push(fn);
  };
  context.onTestFinished = (fn) => {
    test.onFinished || (test.onFinished = []);
    test.onFinished.push(fn);
  };
  return ((_a = runner.extendTaskContext) == null ? undefined : _a.call(runner, context)) || context;
}
function makeTimeoutMsg(isHook, timeout) {
  return `${isHook ? "Hook" : "Test"} timed out in ${timeout}ms.
If this is a long-running ${isHook ? "hook" : "test"}, pass a timeout value as the last argument or configure it globally with "${isHook ? "hookTimeout" : "testTimeout"}".`;
}
function mergeContextFixtures(fixtures, context = {}) {
  const fixtureOptionKeys = ["auto"];
  const fixtureArray = Object.entries(fixtures).map(([prop, value]) => {
    const fixtureItem = { value };
    if (Array.isArray(value) && value.length >= 2 && isObject(value[1]) && Object.keys(value[1]).some((key) => fixtureOptionKeys.includes(key))) {
      Object.assign(fixtureItem, value[1]);
      fixtureItem.value = value[0];
    }
    fixtureItem.prop = prop;
    fixtureItem.isFn = typeof fixtureItem.value === "function";
    return fixtureItem;
  });
  if (Array.isArray(context.fixtures))
    context.fixtures = context.fixtures.concat(fixtureArray);
  else
    context.fixtures = fixtureArray;
  fixtureArray.forEach((fixture) => {
    if (fixture.isFn) {
      const usedProps = getUsedProps(fixture.value);
      if (usedProps.length)
        fixture.deps = context.fixtures.filter(({ prop }) => prop !== fixture.prop && usedProps.includes(prop));
    }
  });
  return context;
}
var fixtureValueMaps = /* @__PURE__ */ new Map;
var cleanupFnArrayMap = /* @__PURE__ */ new Map;
function withFixtures(fn, testContext) {
  return (hookContext) => {
    const context = hookContext || testContext;
    if (!context)
      return fn({});
    const fixtures = getFixture(context);
    if (!(fixtures == null ? undefined : fixtures.length))
      return fn(context);
    const usedProps = getUsedProps(fn);
    const hasAutoFixture = fixtures.some(({ auto }) => auto);
    if (!usedProps.length && !hasAutoFixture)
      return fn(context);
    if (!fixtureValueMaps.get(context))
      fixtureValueMaps.set(context, /* @__PURE__ */ new Map);
    const fixtureValueMap = fixtureValueMaps.get(context);
    if (!cleanupFnArrayMap.has(context))
      cleanupFnArrayMap.set(context, []);
    const cleanupFnArray = cleanupFnArrayMap.get(context);
    const usedFixtures = fixtures.filter(({ prop, auto }) => auto || usedProps.includes(prop));
    const pendingFixtures = resolveDeps(usedFixtures);
    if (!pendingFixtures.length)
      return fn(context);
    async function resolveFixtures() {
      for (const fixture of pendingFixtures) {
        if (fixtureValueMap.has(fixture))
          continue;
        const resolvedValue = fixture.isFn ? await resolveFixtureFunction(fixture.value, context, cleanupFnArray) : fixture.value;
        context[fixture.prop] = resolvedValue;
        fixtureValueMap.set(fixture, resolvedValue);
        cleanupFnArray.unshift(() => {
          fixtureValueMap.delete(fixture);
        });
      }
    }
    return resolveFixtures().then(() => fn(context));
  };
}
async function resolveFixtureFunction(fixtureFn, context, cleanupFnArray) {
  const useFnArgPromise = createDefer();
  let isUseFnArgResolved = false;
  const fixtureReturn = fixtureFn(context, async (useFnArg) => {
    isUseFnArgResolved = true;
    useFnArgPromise.resolve(useFnArg);
    const useReturnPromise = createDefer();
    cleanupFnArray.push(async () => {
      useReturnPromise.resolve();
      await fixtureReturn;
    });
    await useReturnPromise;
  }).catch((e) => {
    if (!isUseFnArgResolved) {
      useFnArgPromise.reject(e);
      return;
    }
    throw e;
  });
  return useFnArgPromise;
}
function resolveDeps(fixtures, depSet = /* @__PURE__ */ new Set, pendingFixtures = []) {
  fixtures.forEach((fixture) => {
    if (pendingFixtures.includes(fixture))
      return;
    if (!fixture.isFn || !fixture.deps) {
      pendingFixtures.push(fixture);
      return;
    }
    if (depSet.has(fixture))
      throw new Error(`Circular fixture dependency detected: ${fixture.prop} <- ${[...depSet].reverse().map((d) => d.prop).join(" <- ")}`);
    depSet.add(fixture);
    resolveDeps(fixture.deps, depSet, pendingFixtures);
    pendingFixtures.push(fixture);
    depSet.clear();
  });
  return pendingFixtures;
}
function getUsedProps(fn) {
  const match = fn.toString().match(/[^(]*\(([^)]*)/);
  if (!match)
    return [];
  const args = splitByComma(match[1]);
  if (!args.length)
    return [];
  const first = args[0];
  if (!(first.startsWith("{") && first.endsWith("}")))
    throw new Error(`The first argument inside a fixture must use object destructuring pattern, e.g. ({ test } => {}). Instead, received "${first}".`);
  const _first = first.slice(1, -1).replace(/\s/g, "");
  const props = splitByComma(_first).map((prop) => {
    return prop.replace(/\:.*|\=.*/g, "");
  });
  const last = props.at(-1);
  if (last && last.startsWith("..."))
    throw new Error(`Rest parameters are not supported in fixtures, received "${last}".`);
  return props;
}
function splitByComma(s) {
  const result = [];
  const stack = [];
  let start = 0;
  for (let i = 0;i < s.length; i++) {
    if (s[i] === "{" || s[i] === "[") {
      stack.push(s[i] === "{" ? "}" : "]");
    } else if (s[i] === stack[stack.length - 1]) {
      stack.pop();
    } else if (!stack.length && s[i] === ",") {
      const token = s.substring(start, i).trim();
      if (token)
        result.push(token);
      start = i + 1;
    }
  }
  const lastToken = s.substring(start).trim();
  if (lastToken)
    result.push(lastToken);
  return result;
}
var _test;
function getCurrentTest() {
  return _test;
}
var suite = createSuite();
var test = createTest(function(name, optionsOrFn, optionsOrTest) {
  if (getCurrentTest())
    throw new Error('Calling the test function inside another test function is not allowed. Please put it inside "describe" or "suite" so it can be properly collected.');
  getCurrentSuite().test.fn.call(this, formatName(name), optionsOrFn, optionsOrTest);
});
var describe = suite;
var it = test;
var runner;
var defaultSuite;
var currentTestFilepath;
function getTestFilepath() {
  return currentTestFilepath;
}
function getRunner() {
  return runner;
}
function getCurrentSuite() {
  return collectorContext.currentSuite || defaultSuite;
}
function createSuiteHooks() {
  return {
    beforeAll: [],
    afterAll: [],
    beforeEach: [],
    afterEach: []
  };
}
function parseArguments(optionsOrFn, optionsOrTest) {
  let options = {};
  let fn = () => {};
  if (typeof optionsOrTest === "object") {
    if (typeof optionsOrFn === "object")
      throw new TypeError("Cannot use two objects as arguments. Please provide options and a function callback in that order.");
    options = optionsOrTest;
  } else if (typeof optionsOrTest === "number") {
    options = { timeout: optionsOrTest };
  } else if (typeof optionsOrFn === "object") {
    options = optionsOrFn;
  }
  if (typeof optionsOrFn === "function") {
    if (typeof optionsOrTest === "function")
      throw new TypeError("Cannot use two functions as arguments. Please use the second argument for options.");
    fn = optionsOrFn;
  } else if (typeof optionsOrTest === "function") {
    fn = optionsOrTest;
  }
  return {
    options,
    handler: fn
  };
}
function createSuiteCollector(name, factory = () => {}, mode, shuffle2, each, suiteOptions) {
  const tasks = [];
  const factoryQueue = [];
  let suite2;
  initSuite(true);
  const task = function(name2 = "", options = {}) {
    const task2 = {
      id: "",
      name: name2,
      suite: undefined,
      each: options.each,
      fails: options.fails,
      context: undefined,
      type: "custom",
      retry: options.retry ?? runner.config.retry,
      repeats: options.repeats,
      mode: options.only ? "only" : options.skip ? "skip" : options.todo ? "todo" : "run",
      meta: options.meta ?? /* @__PURE__ */ Object.create(null)
    };
    const handler = options.handler;
    if (options.concurrent || !options.sequential && runner.config.sequence.concurrent)
      task2.concurrent = true;
    if (shuffle2)
      task2.shuffle = true;
    const context = createTestContext(task2, runner);
    Object.defineProperty(task2, "context", {
      value: context,
      enumerable: false
    });
    setFixture(context, options.fixtures);
    if (handler) {
      setFn(task2, withTimeout(withFixtures(handler, context), (options == null ? undefined : options.timeout) ?? runner.config.testTimeout));
    }
    if (runner.config.includeTaskLocation) {
      const limit = Error.stackTraceLimit;
      Error.stackTraceLimit = 15;
      const error = new Error("stacktrace").stack;
      Error.stackTraceLimit = limit;
      const stack = findTestFileStackTrace(error, task2.each ?? false);
      if (stack)
        task2.location = stack;
    }
    tasks.push(task2);
    return task2;
  };
  const test2 = createTest(function(name2, optionsOrFn, optionsOrTest) {
    let { options, handler } = parseArguments(optionsOrFn, optionsOrTest);
    if (typeof suiteOptions === "object")
      options = Object.assign({}, suiteOptions, options);
    options.concurrent = this.concurrent || !this.sequential && (options == null ? undefined : options.concurrent);
    options.sequential = this.sequential || !this.concurrent && (options == null ? undefined : options.sequential);
    const test3 = task(formatName(name2), { ...this, ...options, handler });
    test3.type = "test";
  });
  const collector = {
    type: "collector",
    name,
    mode,
    options: suiteOptions,
    test: test2,
    tasks,
    collect,
    task,
    clear,
    on: addHook
  };
  function addHook(name2, ...fn) {
    getHooks(suite2)[name2].push(...fn);
  }
  function initSuite(includeLocation) {
    if (typeof suiteOptions === "number")
      suiteOptions = { timeout: suiteOptions };
    suite2 = {
      id: "",
      type: "suite",
      name,
      mode,
      each,
      shuffle: shuffle2,
      tasks: [],
      meta: /* @__PURE__ */ Object.create(null),
      projectName: ""
    };
    if (runner && includeLocation && runner.config.includeTaskLocation) {
      const limit = Error.stackTraceLimit;
      Error.stackTraceLimit = 15;
      const error = new Error("stacktrace").stack;
      Error.stackTraceLimit = limit;
      const stack = findTestFileStackTrace(error, suite2.each ?? false);
      if (stack)
        suite2.location = stack;
    }
    setHooks(suite2, createSuiteHooks());
  }
  function clear() {
    tasks.length = 0;
    factoryQueue.length = 0;
    initSuite(false);
  }
  async function collect(file) {
    factoryQueue.length = 0;
    if (factory)
      await runWithSuite(collector, () => factory(test2));
    const allChildren = [];
    for (const i of [...factoryQueue, ...tasks])
      allChildren.push(i.type === "collector" ? await i.collect(file) : i);
    suite2.file = file;
    suite2.tasks = allChildren;
    allChildren.forEach((task2) => {
      task2.suite = suite2;
      if (file)
        task2.file = file;
    });
    return suite2;
  }
  collectTask(collector);
  return collector;
}
function createSuite() {
  function suiteFn(name, factoryOrOptions, optionsOrFactory = {}) {
    const mode = this.only ? "only" : this.skip ? "skip" : this.todo ? "todo" : "run";
    const currentSuite = getCurrentSuite();
    let { options, handler: factory } = parseArguments(factoryOrOptions, optionsOrFactory);
    if (currentSuite == null ? undefined : currentSuite.options)
      options = { ...currentSuite.options, ...options };
    options.concurrent = this.concurrent || !this.sequential && (options == null ? undefined : options.concurrent);
    options.sequential = this.sequential || !this.concurrent && (options == null ? undefined : options.sequential);
    return createSuiteCollector(formatName(name), factory, mode, this.shuffle, this.each, options);
  }
  suiteFn.each = function(cases, ...args) {
    const suite2 = this.withContext();
    this.setContext("each", true);
    if (Array.isArray(cases) && args.length)
      cases = formatTemplateString(cases, args);
    return (name, optionsOrFn, fnOrOptions) => {
      const _name = formatName(name);
      const arrayOnlyCases = cases.every(Array.isArray);
      const { options, handler } = parseArguments(optionsOrFn, fnOrOptions);
      const fnFirst = typeof optionsOrFn === "function";
      cases.forEach((i, idx) => {
        const items = Array.isArray(i) ? i : [i];
        if (fnFirst) {
          arrayOnlyCases ? suite2(formatTitle(_name, items, idx), () => handler(...items), options) : suite2(formatTitle(_name, items, idx), () => handler(i), options);
        } else {
          arrayOnlyCases ? suite2(formatTitle(_name, items, idx), options, () => handler(...items)) : suite2(formatTitle(_name, items, idx), options, () => handler(i));
        }
      });
      this.setContext("each", undefined);
    };
  };
  suiteFn.skipIf = (condition) => condition ? suite.skip : suite;
  suiteFn.runIf = (condition) => condition ? suite : suite.skip;
  return createChainable(["concurrent", "sequential", "shuffle", "skip", "only", "todo"], suiteFn);
}
function createTaskCollector(fn, context) {
  const taskFn = fn;
  taskFn.each = function(cases, ...args) {
    const test2 = this.withContext();
    this.setContext("each", true);
    if (Array.isArray(cases) && args.length)
      cases = formatTemplateString(cases, args);
    return (name, optionsOrFn, fnOrOptions) => {
      const _name = formatName(name);
      const arrayOnlyCases = cases.every(Array.isArray);
      const { options, handler } = parseArguments(optionsOrFn, fnOrOptions);
      const fnFirst = typeof optionsOrFn === "function";
      cases.forEach((i, idx) => {
        const items = Array.isArray(i) ? i : [i];
        if (fnFirst) {
          arrayOnlyCases ? test2(formatTitle(_name, items, idx), () => handler(...items), options) : test2(formatTitle(_name, items, idx), () => handler(i), options);
        } else {
          arrayOnlyCases ? test2(formatTitle(_name, items, idx), options, () => handler(...items)) : test2(formatTitle(_name, items, idx), options, () => handler(i));
        }
      });
      this.setContext("each", undefined);
    };
  };
  taskFn.skipIf = function(condition) {
    return condition ? this.skip : this;
  };
  taskFn.runIf = function(condition) {
    return condition ? this : this.skip;
  };
  taskFn.extend = function(fixtures) {
    const _context = mergeContextFixtures(fixtures, context);
    return createTest(function fn2(name, optionsOrFn, optionsOrTest) {
      getCurrentSuite().test.fn.call(this, formatName(name), optionsOrFn, optionsOrTest);
    }, _context);
  };
  const _test2 = createChainable(["concurrent", "sequential", "skip", "only", "todo", "fails"], taskFn);
  if (context)
    _test2.mergeContext(context);
  return _test2;
}
function createTest(fn, context) {
  return createTaskCollector(fn, context);
}
function formatName(name) {
  return typeof name === "string" ? name : name instanceof Function ? name.name || "<anonymous>" : String(name);
}
function formatTitle(template, items, idx) {
  if (template.includes("%#")) {
    template = template.replace(/%%/g, "__vitest_escaped_%__").replace(/%#/g, `${idx}`).replace(/__vitest_escaped_%__/g, "%%");
  }
  const count = template.split("%").length - 1;
  let formatted = format2(template, ...items.slice(0, count));
  if (isObject(items[0])) {
    formatted = formatted.replace(/\$([$\w_.]+)/g, (_, key) => {
      var _a, _b;
      return objDisplay(objectAttr(items[0], key), { truncate: (_b = (_a = runner == null ? undefined : runner.config) == null ? undefined : _a.chaiConfig) == null ? undefined : _b.truncateThreshold });
    });
  }
  return formatted;
}
function formatTemplateString(cases, args) {
  const header = cases.join("").trim().replace(/ /g, "").split(`
`).map((i) => i.split("|"))[0];
  const res = [];
  for (let i = 0;i < Math.floor(args.length / header.length); i++) {
    const oneCase = {};
    for (let j = 0;j < header.length; j++)
      oneCase[header[j]] = args[i * header.length + j];
    res.push(oneCase);
  }
  return res;
}
function findTestFileStackTrace(error, each) {
  const lines = error.split(`
`).slice(1);
  for (const line of lines) {
    const stack = parseSingleStack(line);
    if (stack && stack.file === getTestFilepath()) {
      return {
        line: stack.line,
        column: each ? stack.column + 1 : stack.column
      };
    }
  }
}
var now$1 = Date.now;
var now = Date.now;
function getDefaultHookTimeout() {
  return getRunner().config.hookTimeout;
}
function beforeAll(fn, timeout) {
  return getCurrentSuite().on("beforeAll", withTimeout(fn, timeout ?? getDefaultHookTimeout(), true));
}
function afterAll(fn, timeout) {
  return getCurrentSuite().on("afterAll", withTimeout(fn, timeout ?? getDefaultHookTimeout(), true));
}
function beforeEach(fn, timeout) {
  return getCurrentSuite().on("beforeEach", withTimeout(withFixtures(fn), timeout ?? getDefaultHookTimeout(), true));
}
function afterEach(fn, timeout) {
  return getCurrentSuite().on("afterEach", withTimeout(withFixtures(fn), timeout ?? getDefaultHookTimeout(), true));
}
var onTestFailed = createTestHook("onTestFailed", (test2, handler) => {
  test2.onFailed || (test2.onFailed = []);
  test2.onFailed.push(handler);
});
var onTestFinished = createTestHook("onTestFinished", (test2, handler) => {
  test2.onFinished || (test2.onFinished = []);
  test2.onFinished.push(handler);
});
function createTestHook(name, handler) {
  return (fn) => {
    const current = getCurrentTest();
    if (!current)
      throw new Error(`Hook ${name}() can only be called inside a test`);
    return handler(current, fn);
  };
}
// node_modules/vitest/dist/vendor/global.CkGT_TMy.js
function getWorkerState() {
  const workerState = globalThis.__vitest_worker__;
  if (!workerState) {
    const errorMsg = `Vitest failed to access its internal state.

One of the following is possible:
- "vitest" is imported directly without running "vitest" command
- "vitest" is imported inside "globalSetup" (to fix this, use "setupFiles" instead, because "globalSetup" runs in a different context)
- Otherwise, it might be a Vitest bug. Please report it to https://github.com/vitest-dev/vitest/issues
`;
    throw new Error(errorMsg);
  }
  return workerState;
}
function getCurrentEnvironment() {
  const state = getWorkerState();
  return state == null ? undefined : state.environment.name;
}

// node_modules/vitest/dist/vendor/index.SMVOaj7F.js
function getRunMode() {
  return getWorkerState().config.mode;
}
function isRunningInBenchmark() {
  return getRunMode() === "benchmark";
}

// node_modules/vitest/dist/vendor/benchmark.yGkUTKnC.js
var benchFns = /* @__PURE__ */ new WeakMap;
var benchOptsMap = /* @__PURE__ */ new WeakMap;
var bench = createBenchmark(function(name, fn = noop, options = {}) {
  if (!isRunningInBenchmark())
    throw new Error("`bench()` is only available in benchmark mode.");
  const task = getCurrentSuite().task(formatName2(name), {
    ...this,
    meta: {
      benchmark: true
    }
  });
  benchFns.set(task, fn);
  benchOptsMap.set(task, options);
});
function createBenchmark(fn) {
  const benchmark = createChainable(["skip", "only", "todo"], fn);
  benchmark.skipIf = (condition) => condition ? benchmark.skip : benchmark;
  benchmark.runIf = (condition) => condition ? benchmark : benchmark.skip;
  return benchmark;
}
function formatName2(name) {
  return typeof name === "string" ? name : name instanceof Function ? name.name || "<anonymous>" : String(name);
}

// node_modules/vitest/dist/vendor/run-once.Olz_Zkd8.js
var filesCount = /* @__PURE__ */ new Map;
var cache = /* @__PURE__ */ new Map;
function runOnce(fn, key) {
  const filepath = getWorkerState().filepath || "__unknown_files__";
  if (!key) {
    filesCount.set(filepath, (filesCount.get(filepath) || 0) + 1);
    key = String(filesCount.get(filepath));
  }
  const id = `${filepath}:${key}`;
  if (!cache.has(id))
    cache.set(id, fn());
  return cache.get(id);
}
function isFirstRun() {
  let firstRun = false;
  runOnce(() => {
    firstRun = true;
  }, "__vitest_first_run__");
  return firstRun;
}

// node_modules/chai/index.mjs
var exports_chai = {};
__export(exports_chai, {
  version: () => version,
  util: () => util,
  use: () => use,
  should: () => should,
  expect: () => expect,
  default: () => chai_default,
  core: () => core,
  config: () => config,
  assert: () => assert,
  AssertionError: () => AssertionError,
  Assertion: () => Assertion
});
var import__ = __toESM(require_chai(), 1);
var expect = import__.default.expect;
var version = import__.default.version;
var Assertion = import__.default.Assertion;
var AssertionError = import__.default.AssertionError;
var util = import__.default.util;
var config = import__.default.config;
var use = import__.default.use;
var should = import__.default.should;
var assert = import__.default.assert;
var core = import__.default.core;
var chai_default = import__.default;

// node_modules/vitest/dist/vendor/_commonjsHelpers.jjO7Zipk.js
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}

// node_modules/tinyspy/dist/index.js
function R(e, t) {
  if (!e)
    throw new Error(t);
}
function u(e, t) {
  return typeof t === e;
}
function b(e) {
  return e instanceof Promise;
}
function f(e, t, n) {
  Object.defineProperty(e, t, n);
}
function i(e, t, n) {
  Object.defineProperty(e, t, { value: n });
}
var c = Symbol.for("tinyspy:spy");
var g = /* @__PURE__ */ new Set;
var C = (e) => {
  e.called = false, e.callCount = 0, e.calls = [], e.results = [], e.next = [];
};
var M = (e) => (f(e, c, { value: { reset: () => C(e[c]) } }), e[c]);
var A = (e) => e[c] || M(e);
function I(e) {
  R(u("function", e) || u("undefined", e), "cannot spy on a non-function value");
  let t = function(...s) {
    let r = A(t);
    r.called = true, r.callCount++, r.calls.push(s);
    let m = r.next.shift();
    if (m) {
      r.results.push(m);
      let [l, o] = m;
      if (l === "ok")
        return o;
      throw o;
    }
    let p, d = "ok";
    if (r.impl)
      try {
        new.target ? p = Reflect.construct(r.impl, s, new.target) : p = r.impl.apply(this, s), d = "ok";
      } catch (l) {
        throw p = l, d = "error", r.results.push([d, l]), l;
      }
    let a = [d, p];
    if (b(p)) {
      let l = p.then((o) => a[1] = o).catch((o) => {
        throw a[0] = "error", a[1] = o, o;
      });
      Object.assign(l, p), p = l;
    }
    return r.results.push(a), p;
  };
  i(t, "_isMockFunction", true), i(t, "length", e ? e.length : 0), i(t, "name", e && e.name || "spy");
  let n = A(t);
  return n.reset(), n.impl = e, t;
}
var k = (e, t) => Object.getOwnPropertyDescriptor(e, t);
var P = (e, t) => {
  t != null && typeof t == "function" && t.prototype != null && Object.setPrototypeOf(e.prototype, t.prototype);
};
function E(e, t, n) {
  R(!u("undefined", e), "spyOn could not find an object to spy upon"), R(u("object", e) || u("function", e), "cannot spyOn on a primitive value");
  let [s, r] = (() => {
    if (!u("object", t))
      return [t, "value"];
    if ("getter" in t && "setter" in t)
      throw new Error("cannot spy on both getter and setter");
    if ("getter" in t)
      return [t.getter, "get"];
    if ("setter" in t)
      return [t.setter, "set"];
    throw new Error("specify getter or setter to spy on");
  })(), m = k(e, s), p = Object.getPrototypeOf(e), d = p && k(p, s), a = m || d;
  R(a || s in e, `${String(s)} does not exist`);
  let l = false;
  r === "value" && a && !a.value && a.get && (r = "get", l = true, n = a.get());
  let o;
  a ? o = a[r] : r !== "value" ? o = () => e[s] : o = e[s], n || (n = o);
  let y = I(n);
  r === "value" && P(y, o);
  let O = (h) => {
    let { value: G, ...w } = a || {
      configurable: true,
      writable: true
    };
    r !== "value" && delete w.writable, w[r] = h, f(e, s, w);
  }, K = () => a ? f(e, s, a) : O(o), T = y[c];
  return i(T, "restore", K), i(T, "getOriginal", () => l ? o() : o), i(T, "willCall", (h) => (T.impl = h, y)), O(l ? () => (P(y, n), y) : y), g.add(y), y;
}

// node_modules/@vitest/spy/dist/index.js
var mocks = /* @__PURE__ */ new Set;
function isMockFunction(fn2) {
  return typeof fn2 === "function" && "_isMockFunction" in fn2 && fn2._isMockFunction;
}
function spyOn(obj, method, accessType) {
  const dictionary = {
    get: "getter",
    set: "setter"
  };
  const objMethod = accessType ? { [dictionary[accessType]]: method } : method;
  const stub = E(obj, objMethod);
  return enhanceSpy(stub);
}
var callOrder = 0;
function enhanceSpy(spy) {
  const stub = spy;
  let implementation;
  let instances = [];
  let invocations = [];
  const state = A(spy);
  const mockContext = {
    get calls() {
      return state.calls;
    },
    get instances() {
      return instances;
    },
    get invocationCallOrder() {
      return invocations;
    },
    get results() {
      return state.results.map(([callType, value]) => {
        const type = callType === "error" ? "throw" : "return";
        return { type, value };
      });
    },
    get lastCall() {
      return state.calls[state.calls.length - 1];
    }
  };
  let onceImplementations = [];
  let implementationChangedTemporarily = false;
  function mockCall(...args) {
    instances.push(this);
    invocations.push(++callOrder);
    const impl = implementationChangedTemporarily ? implementation : onceImplementations.shift() || implementation || state.getOriginal() || (() => {});
    return impl.apply(this, args);
  }
  let name = stub.name;
  stub.getMockName = () => name || "vi.fn()";
  stub.mockName = (n) => {
    name = n;
    return stub;
  };
  stub.mockClear = () => {
    state.reset();
    instances = [];
    invocations = [];
    return stub;
  };
  stub.mockReset = () => {
    stub.mockClear();
    implementation = () => {
      return;
    };
    onceImplementations = [];
    return stub;
  };
  stub.mockRestore = () => {
    stub.mockReset();
    state.restore();
    implementation = undefined;
    return stub;
  };
  stub.getMockImplementation = () => implementation;
  stub.mockImplementation = (fn2) => {
    implementation = fn2;
    state.willCall(mockCall);
    return stub;
  };
  stub.mockImplementationOnce = (fn2) => {
    onceImplementations.push(fn2);
    return stub;
  };
  function withImplementation(fn2, cb) {
    const originalImplementation = implementation;
    implementation = fn2;
    state.willCall(mockCall);
    implementationChangedTemporarily = true;
    const reset = () => {
      implementation = originalImplementation;
      implementationChangedTemporarily = false;
    };
    const result = cb();
    if (result instanceof Promise) {
      return result.then(() => {
        reset();
        return stub;
      });
    }
    reset();
    return stub;
  }
  stub.withImplementation = withImplementation;
  stub.mockReturnThis = () => stub.mockImplementation(function() {
    return this;
  });
  stub.mockReturnValue = (val) => stub.mockImplementation(() => val);
  stub.mockReturnValueOnce = (val) => stub.mockImplementationOnce(() => val);
  stub.mockResolvedValue = (val) => stub.mockImplementation(() => Promise.resolve(val));
  stub.mockResolvedValueOnce = (val) => stub.mockImplementationOnce(() => Promise.resolve(val));
  stub.mockRejectedValue = (val) => stub.mockImplementation(() => Promise.reject(val));
  stub.mockRejectedValueOnce = (val) => stub.mockImplementationOnce(() => Promise.reject(val));
  Object.defineProperty(stub, "mock", {
    get: () => mockContext
  });
  state.willCall(mockCall);
  mocks.add(stub);
  return stub;
}
function fn(implementation) {
  const enhancedSpy = enhanceSpy(E({ spy: implementation || (() => {}) }, "spy"));
  if (implementation)
    enhancedSpy.mockImplementation(implementation);
  return enhancedSpy;
}

// node_modules/@vitest/expect/dist/index.js
var MATCHERS_OBJECT = Symbol.for("matchers-object");
var JEST_MATCHERS_OBJECT = Symbol.for("$$jest-matchers-object");
var GLOBAL_EXPECT = Symbol.for("expect-global");
var ASYMMETRIC_MATCHERS_OBJECT = Symbol.for("asymmetric-matchers-object");
if (!Object.prototype.hasOwnProperty.call(globalThis, MATCHERS_OBJECT)) {
  const globalState = /* @__PURE__ */ new WeakMap;
  const matchers = /* @__PURE__ */ Object.create(null);
  const customEqualityTesters = [];
  const assymetricMatchers = /* @__PURE__ */ Object.create(null);
  Object.defineProperty(globalThis, MATCHERS_OBJECT, {
    get: () => globalState
  });
  Object.defineProperty(globalThis, JEST_MATCHERS_OBJECT, {
    configurable: true,
    get: () => ({
      state: globalState.get(globalThis[GLOBAL_EXPECT]),
      matchers,
      customEqualityTesters
    })
  });
  Object.defineProperty(globalThis, ASYMMETRIC_MATCHERS_OBJECT, {
    get: () => assymetricMatchers
  });
}
function getState(expect2) {
  return globalThis[MATCHERS_OBJECT].get(expect2);
}
function setState(state, expect2) {
  const map = globalThis[MATCHERS_OBJECT];
  const current = map.get(expect2) || {};
  Object.assign(current, state);
  map.set(expect2, current);
}
function getMatcherUtils() {
  const c2 = () => getColors();
  const EXPECTED_COLOR = c2().green;
  const RECEIVED_COLOR = c2().red;
  const INVERTED_COLOR = c2().inverse;
  const BOLD_WEIGHT = c2().bold;
  const DIM_COLOR = c2().dim;
  function matcherHint(matcherName, received = "received", expected = "expected", options = {}) {
    const {
      comment = "",
      isDirectExpectCall = false,
      isNot = false,
      promise = "",
      secondArgument = "",
      expectedColor = EXPECTED_COLOR,
      receivedColor = RECEIVED_COLOR,
      secondArgumentColor = EXPECTED_COLOR
    } = options;
    let hint = "";
    let dimString = "expect";
    if (!isDirectExpectCall && received !== "") {
      hint += DIM_COLOR(`${dimString}(`) + receivedColor(received);
      dimString = ")";
    }
    if (promise !== "") {
      hint += DIM_COLOR(`${dimString}.`) + promise;
      dimString = "";
    }
    if (isNot) {
      hint += `${DIM_COLOR(`${dimString}.`)}not`;
      dimString = "";
    }
    if (matcherName.includes(".")) {
      dimString += matcherName;
    } else {
      hint += DIM_COLOR(`${dimString}.`) + matcherName;
      dimString = "";
    }
    if (expected === "") {
      dimString += "()";
    } else {
      hint += DIM_COLOR(`${dimString}(`) + expectedColor(expected);
      if (secondArgument)
        hint += DIM_COLOR(", ") + secondArgumentColor(secondArgument);
      dimString = ")";
    }
    if (comment !== "")
      dimString += ` // ${comment}`;
    if (dimString !== "")
      hint += DIM_COLOR(dimString);
    return hint;
  }
  const SPACE_SYMBOL = "·";
  const replaceTrailingSpaces = (text) => text.replace(/\s+$/gm, (spaces) => SPACE_SYMBOL.repeat(spaces.length));
  const printReceived = (object) => RECEIVED_COLOR(replaceTrailingSpaces(stringify(object)));
  const printExpected = (value) => EXPECTED_COLOR(replaceTrailingSpaces(stringify(value)));
  return {
    EXPECTED_COLOR,
    RECEIVED_COLOR,
    INVERTED_COLOR,
    BOLD_WEIGHT,
    DIM_COLOR,
    matcherHint,
    printReceived,
    printExpected
  };
}
function addCustomEqualityTesters(newTesters) {
  if (!Array.isArray(newTesters)) {
    throw new TypeError(`expect.customEqualityTesters: Must be set to an array of Testers. Was given "${getType(newTesters)}"`);
  }
  globalThis[JEST_MATCHERS_OBJECT].customEqualityTesters.push(...newTesters);
}
function getCustomEqualityTesters() {
  return globalThis[JEST_MATCHERS_OBJECT].customEqualityTesters;
}
function equals(a, b2, customTesters, strictCheck) {
  customTesters = customTesters || [];
  return eq(a, b2, [], [], customTesters, strictCheck ? hasKey : hasDefinedKey);
}
var functionToString = Function.prototype.toString;
function isAsymmetric(obj) {
  return !!obj && typeof obj === "object" && "asymmetricMatch" in obj && isA("Function", obj.asymmetricMatch);
}
function asymmetricMatch(a, b2) {
  const asymmetricA = isAsymmetric(a);
  const asymmetricB = isAsymmetric(b2);
  if (asymmetricA && asymmetricB)
    return;
  if (asymmetricA)
    return a.asymmetricMatch(b2);
  if (asymmetricB)
    return b2.asymmetricMatch(a);
}
function eq(a, b2, aStack, bStack, customTesters, hasKey2) {
  let result = true;
  const asymmetricResult = asymmetricMatch(a, b2);
  if (asymmetricResult !== undefined)
    return asymmetricResult;
  const testerContext = { equals };
  for (let i2 = 0;i2 < customTesters.length; i2++) {
    const customTesterResult = customTesters[i2].call(testerContext, a, b2, customTesters);
    if (customTesterResult !== undefined)
      return customTesterResult;
  }
  if (a instanceof Error && b2 instanceof Error)
    return a.message === b2.message;
  if (typeof URL === "function" && a instanceof URL && b2 instanceof URL)
    return a.href === b2.href;
  if (Object.is(a, b2))
    return true;
  if (a === null || b2 === null)
    return a === b2;
  const className = Object.prototype.toString.call(a);
  if (className !== Object.prototype.toString.call(b2))
    return false;
  switch (className) {
    case "[object Boolean]":
    case "[object String]":
    case "[object Number]":
      if (typeof a !== typeof b2) {
        return false;
      } else if (typeof a !== "object" && typeof b2 !== "object") {
        return Object.is(a, b2);
      } else {
        return Object.is(a.valueOf(), b2.valueOf());
      }
    case "[object Date]": {
      const numA = +a;
      const numB = +b2;
      return numA === numB || Number.isNaN(numA) && Number.isNaN(numB);
    }
    case "[object RegExp]":
      return a.source === b2.source && a.flags === b2.flags;
  }
  if (typeof a !== "object" || typeof b2 !== "object")
    return false;
  if (isDomNode(a) && isDomNode(b2))
    return a.isEqualNode(b2);
  let length = aStack.length;
  while (length--) {
    if (aStack[length] === a)
      return bStack[length] === b2;
    else if (bStack[length] === b2)
      return false;
  }
  aStack.push(a);
  bStack.push(b2);
  if (className === "[object Array]" && a.length !== b2.length)
    return false;
  const aKeys = keys(a, hasKey2);
  let key;
  let size = aKeys.length;
  if (keys(b2, hasKey2).length !== size)
    return false;
  while (size--) {
    key = aKeys[size];
    result = hasKey2(b2, key) && eq(a[key], b2[key], aStack, bStack, customTesters, hasKey2);
    if (!result)
      return false;
  }
  aStack.pop();
  bStack.pop();
  return result;
}
function keys(obj, hasKey2) {
  const keys2 = [];
  for (const key in obj) {
    if (hasKey2(obj, key))
      keys2.push(key);
  }
  return keys2.concat(Object.getOwnPropertySymbols(obj).filter((symbol) => Object.getOwnPropertyDescriptor(obj, symbol).enumerable));
}
function hasDefinedKey(obj, key) {
  return hasKey(obj, key) && obj[key] !== undefined;
}
function hasKey(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
function isA(typeName, value) {
  return Object.prototype.toString.apply(value) === `[object ${typeName}]`;
}
function isDomNode(obj) {
  return obj !== null && typeof obj === "object" && "nodeType" in obj && typeof obj.nodeType === "number" && "nodeName" in obj && typeof obj.nodeName === "string" && "isEqualNode" in obj && typeof obj.isEqualNode === "function";
}
var IS_KEYED_SENTINEL = "@@__IMMUTABLE_KEYED__@@";
var IS_SET_SENTINEL = "@@__IMMUTABLE_SET__@@";
var IS_ORDERED_SENTINEL = "@@__IMMUTABLE_ORDERED__@@";
function isImmutableUnorderedKeyed(maybeKeyed) {
  return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL] && !maybeKeyed[IS_ORDERED_SENTINEL]);
}
function isImmutableUnorderedSet(maybeSet) {
  return !!(maybeSet && maybeSet[IS_SET_SENTINEL] && !maybeSet[IS_ORDERED_SENTINEL]);
}
var IteratorSymbol = Symbol.iterator;
function hasIterator(object) {
  return !!(object != null && object[IteratorSymbol]);
}
function iterableEquality(a, b2, customTesters = [], aStack = [], bStack = []) {
  if (typeof a !== "object" || typeof b2 !== "object" || Array.isArray(a) || Array.isArray(b2) || !hasIterator(a) || !hasIterator(b2))
    return;
  if (a.constructor !== b2.constructor)
    return false;
  let length = aStack.length;
  while (length--) {
    if (aStack[length] === a)
      return bStack[length] === b2;
  }
  aStack.push(a);
  bStack.push(b2);
  const filteredCustomTesters = [
    ...customTesters.filter((t) => t !== iterableEquality),
    iterableEqualityWithStack
  ];
  function iterableEqualityWithStack(a2, b22) {
    return iterableEquality(a2, b22, [...customTesters], [...aStack], [...bStack]);
  }
  if (a.size !== undefined) {
    if (a.size !== b2.size) {
      return false;
    } else if (isA("Set", a) || isImmutableUnorderedSet(a)) {
      let allFound = true;
      for (const aValue of a) {
        if (!b2.has(aValue)) {
          let has = false;
          for (const bValue of b2) {
            const isEqual = equals(aValue, bValue, filteredCustomTesters);
            if (isEqual === true)
              has = true;
          }
          if (has === false) {
            allFound = false;
            break;
          }
        }
      }
      aStack.pop();
      bStack.pop();
      return allFound;
    } else if (isA("Map", a) || isImmutableUnorderedKeyed(a)) {
      let allFound = true;
      for (const aEntry of a) {
        if (!b2.has(aEntry[0]) || !equals(aEntry[1], b2.get(aEntry[0]), filteredCustomTesters)) {
          let has = false;
          for (const bEntry of b2) {
            const matchedKey = equals(aEntry[0], bEntry[0], filteredCustomTesters);
            let matchedValue = false;
            if (matchedKey === true)
              matchedValue = equals(aEntry[1], bEntry[1], filteredCustomTesters);
            if (matchedValue === true)
              has = true;
          }
          if (has === false) {
            allFound = false;
            break;
          }
        }
      }
      aStack.pop();
      bStack.pop();
      return allFound;
    }
  }
  const bIterator = b2[IteratorSymbol]();
  for (const aValue of a) {
    const nextB = bIterator.next();
    if (nextB.done || !equals(aValue, nextB.value, filteredCustomTesters))
      return false;
  }
  if (!bIterator.next().done)
    return false;
  const aEntries = Object.entries(a);
  const bEntries = Object.entries(b2);
  if (!equals(aEntries, bEntries))
    return false;
  aStack.pop();
  bStack.pop();
  return true;
}
function hasPropertyInObject(object, key) {
  const shouldTerminate = !object || typeof object !== "object" || object === Object.prototype;
  if (shouldTerminate)
    return false;
  return Object.prototype.hasOwnProperty.call(object, key) || hasPropertyInObject(Object.getPrototypeOf(object), key);
}
function isObjectWithKeys(a) {
  return isObject(a) && !(a instanceof Error) && !Array.isArray(a) && !(a instanceof Date);
}
function subsetEquality(object, subset, customTesters = []) {
  const filteredCustomTesters = customTesters.filter((t) => t !== subsetEquality);
  const subsetEqualityWithContext = (seenReferences = /* @__PURE__ */ new WeakMap) => (object2, subset2) => {
    if (!isObjectWithKeys(subset2))
      return;
    return Object.keys(subset2).every((key) => {
      if (subset2[key] != null && typeof subset2[key] === "object") {
        if (seenReferences.has(subset2[key]))
          return equals(object2[key], subset2[key], filteredCustomTesters);
        seenReferences.set(subset2[key], true);
      }
      const result = object2 != null && hasPropertyInObject(object2, key) && equals(object2[key], subset2[key], [
        ...filteredCustomTesters,
        subsetEqualityWithContext(seenReferences)
      ]);
      seenReferences.delete(subset2[key]);
      return result;
    });
  };
  return subsetEqualityWithContext()(object, subset);
}
function typeEquality(a, b2) {
  if (a == null || b2 == null || a.constructor === b2.constructor)
    return;
  return false;
}
function arrayBufferEquality(a, b2) {
  let dataViewA = a;
  let dataViewB = b2;
  if (!(a instanceof DataView && b2 instanceof DataView)) {
    if (!(a instanceof ArrayBuffer) || !(b2 instanceof ArrayBuffer))
      return;
    try {
      dataViewA = new DataView(a);
      dataViewB = new DataView(b2);
    } catch {
      return;
    }
  }
  if (dataViewA.byteLength !== dataViewB.byteLength)
    return false;
  for (let i2 = 0;i2 < dataViewA.byteLength; i2++) {
    if (dataViewA.getUint8(i2) !== dataViewB.getUint8(i2))
      return false;
  }
  return true;
}
function sparseArrayEquality(a, b2, customTesters = []) {
  if (!Array.isArray(a) || !Array.isArray(b2))
    return;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b2);
  const filteredCustomTesters = customTesters.filter((t) => t !== sparseArrayEquality);
  return equals(a, b2, filteredCustomTesters, true) && equals(aKeys, bKeys);
}
function generateToBeMessage(deepEqualityName, expected = "#{this}", actual = "#{exp}") {
  const toBeMessage = `expected ${expected} to be ${actual} // Object.is equality`;
  if (["toStrictEqual", "toEqual"].includes(deepEqualityName))
    return `${toBeMessage}

If it should pass with deep equality, replace "toBe" with "${deepEqualityName}"

Expected: ${expected}
Received: serializes to the same string
`;
  return toBeMessage;
}
function pluralize(word, count) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}
function getObjectKeys(object) {
  return [
    ...Object.keys(object),
    ...Object.getOwnPropertySymbols(object).filter((s) => {
      var _a;
      return (_a = Object.getOwnPropertyDescriptor(object, s)) == null ? undefined : _a.enumerable;
    })
  ];
}
function getObjectSubset(object, subset, customTesters = []) {
  let stripped = 0;
  const getObjectSubsetWithContext = (seenReferences = /* @__PURE__ */ new WeakMap) => (object2, subset2) => {
    if (Array.isArray(object2)) {
      if (Array.isArray(subset2) && subset2.length === object2.length) {
        return subset2.map((sub, i2) => getObjectSubsetWithContext(seenReferences)(object2[i2], sub));
      }
    } else if (object2 instanceof Date) {
      return object2;
    } else if (isObject(object2) && isObject(subset2)) {
      if (equals(object2, subset2, [
        ...customTesters,
        iterableEquality,
        subsetEquality
      ])) {
        return subset2;
      }
      const trimmed = {};
      seenReferences.set(object2, trimmed);
      for (const key of getObjectKeys(object2)) {
        if (hasPropertyInObject(subset2, key)) {
          trimmed[key] = seenReferences.has(object2[key]) ? seenReferences.get(object2[key]) : getObjectSubsetWithContext(seenReferences)(object2[key], subset2[key]);
        } else {
          if (!seenReferences.has(object2[key])) {
            stripped += 1;
            if (isObject(object2[key]))
              stripped += getObjectKeys(object2[key]).length;
            getObjectSubsetWithContext(seenReferences)(object2[key], subset2[key]);
          }
        }
      }
      if (getObjectKeys(trimmed).length > 0)
        return trimmed;
    }
    return object2;
  };
  return { subset: getObjectSubsetWithContext()(object, subset), stripped };
}

class AsymmetricMatcher3 {
  constructor(sample, inverse = false) {
    this.sample = sample;
    this.inverse = inverse;
  }
  $$typeof = Symbol.for("jest.asymmetricMatcher");
  getMatcherContext(expect2) {
    return {
      ...getState(expect2 || globalThis[GLOBAL_EXPECT]),
      equals,
      isNot: this.inverse,
      customTesters: getCustomEqualityTesters(),
      utils: {
        ...getMatcherUtils(),
        diff,
        stringify,
        iterableEquality,
        subsetEquality
      }
    };
  }
  [Symbol.for("chai/inspect")](options) {
    const result = stringify(this, options.depth, { min: true });
    if (result.length <= options.truncate)
      return result;
    return `${this.toString()}{…}`;
  }
}

class StringContaining extends AsymmetricMatcher3 {
  constructor(sample, inverse = false) {
    if (!isA("String", sample))
      throw new Error("Expected is not a string");
    super(sample, inverse);
  }
  asymmetricMatch(other) {
    const result = isA("String", other) && other.includes(this.sample);
    return this.inverse ? !result : result;
  }
  toString() {
    return `String${this.inverse ? "Not" : ""}Containing`;
  }
  getExpectedType() {
    return "string";
  }
}

class Anything extends AsymmetricMatcher3 {
  asymmetricMatch(other) {
    return other != null;
  }
  toString() {
    return "Anything";
  }
  toAsymmetricMatcher() {
    return "Anything";
  }
}

class ObjectContaining extends AsymmetricMatcher3 {
  constructor(sample, inverse = false) {
    super(sample, inverse);
  }
  getPrototype(obj) {
    if (Object.getPrototypeOf)
      return Object.getPrototypeOf(obj);
    if (obj.constructor.prototype === obj)
      return null;
    return obj.constructor.prototype;
  }
  hasProperty(obj, property) {
    if (!obj)
      return false;
    if (Object.prototype.hasOwnProperty.call(obj, property))
      return true;
    return this.hasProperty(this.getPrototype(obj), property);
  }
  asymmetricMatch(other) {
    if (typeof this.sample !== "object") {
      throw new TypeError(`You must provide an object to ${this.toString()}, not '${typeof this.sample}'.`);
    }
    let result = true;
    const matcherContext = this.getMatcherContext();
    for (const property in this.sample) {
      if (!this.hasProperty(other, property) || !equals(this.sample[property], other[property], matcherContext.customTesters)) {
        result = false;
        break;
      }
    }
    return this.inverse ? !result : result;
  }
  toString() {
    return `Object${this.inverse ? "Not" : ""}Containing`;
  }
  getExpectedType() {
    return "object";
  }
}

class ArrayContaining extends AsymmetricMatcher3 {
  constructor(sample, inverse = false) {
    super(sample, inverse);
  }
  asymmetricMatch(other) {
    if (!Array.isArray(this.sample)) {
      throw new TypeError(`You must provide an array to ${this.toString()}, not '${typeof this.sample}'.`);
    }
    const matcherContext = this.getMatcherContext();
    const result = this.sample.length === 0 || Array.isArray(other) && this.sample.every((item) => other.some((another) => equals(item, another, matcherContext.customTesters)));
    return this.inverse ? !result : result;
  }
  toString() {
    return `Array${this.inverse ? "Not" : ""}Containing`;
  }
  getExpectedType() {
    return "array";
  }
}

class Any extends AsymmetricMatcher3 {
  constructor(sample) {
    if (typeof sample === "undefined") {
      throw new TypeError("any() expects to be passed a constructor function. Please pass one or use anything() to match any object.");
    }
    super(sample);
  }
  fnNameFor(func) {
    if (func.name)
      return func.name;
    const functionToString2 = Function.prototype.toString;
    const matches = functionToString2.call(func).match(/^(?:async)?\s*function\s*\*?\s*([\w$]+)\s*\(/);
    return matches ? matches[1] : "<anonymous>";
  }
  asymmetricMatch(other) {
    if (this.sample === String)
      return typeof other == "string" || other instanceof String;
    if (this.sample === Number)
      return typeof other == "number" || other instanceof Number;
    if (this.sample === Function)
      return typeof other == "function" || other instanceof Function;
    if (this.sample === Boolean)
      return typeof other == "boolean" || other instanceof Boolean;
    if (this.sample === BigInt)
      return typeof other == "bigint" || other instanceof BigInt;
    if (this.sample === Symbol)
      return typeof other == "symbol" || other instanceof Symbol;
    if (this.sample === Object)
      return typeof other == "object";
    return other instanceof this.sample;
  }
  toString() {
    return "Any";
  }
  getExpectedType() {
    if (this.sample === String)
      return "string";
    if (this.sample === Number)
      return "number";
    if (this.sample === Function)
      return "function";
    if (this.sample === Object)
      return "object";
    if (this.sample === Boolean)
      return "boolean";
    return this.fnNameFor(this.sample);
  }
  toAsymmetricMatcher() {
    return `Any<${this.fnNameFor(this.sample)}>`;
  }
}

class StringMatching extends AsymmetricMatcher3 {
  constructor(sample, inverse = false) {
    if (!isA("String", sample) && !isA("RegExp", sample))
      throw new Error("Expected is not a String or a RegExp");
    super(new RegExp(sample), inverse);
  }
  asymmetricMatch(other) {
    const result = isA("String", other) && this.sample.test(other);
    return this.inverse ? !result : result;
  }
  toString() {
    return `String${this.inverse ? "Not" : ""}Matching`;
  }
  getExpectedType() {
    return "string";
  }
}

class CloseTo extends AsymmetricMatcher3 {
  precision;
  constructor(sample, precision = 2, inverse = false) {
    if (!isA("Number", sample))
      throw new Error("Expected is not a Number");
    if (!isA("Number", precision))
      throw new Error("Precision is not a Number");
    super(sample);
    this.inverse = inverse;
    this.precision = precision;
  }
  asymmetricMatch(other) {
    if (!isA("Number", other))
      return false;
    let result = false;
    if (other === Number.POSITIVE_INFINITY && this.sample === Number.POSITIVE_INFINITY) {
      result = true;
    } else if (other === Number.NEGATIVE_INFINITY && this.sample === Number.NEGATIVE_INFINITY) {
      result = true;
    } else {
      result = Math.abs(this.sample - other) < 10 ** -this.precision / 2;
    }
    return this.inverse ? !result : result;
  }
  toString() {
    return `Number${this.inverse ? "Not" : ""}CloseTo`;
  }
  getExpectedType() {
    return "number";
  }
  toAsymmetricMatcher() {
    return [
      this.toString(),
      this.sample,
      `(${pluralize("digit", this.precision)})`
    ].join(" ");
  }
}
var JestAsymmetricMatchers = (chai3, utils) => {
  utils.addMethod(chai3.expect, "anything", () => new Anything);
  utils.addMethod(chai3.expect, "any", (expected) => new Any(expected));
  utils.addMethod(chai3.expect, "stringContaining", (expected) => new StringContaining(expected));
  utils.addMethod(chai3.expect, "objectContaining", (expected) => new ObjectContaining(expected));
  utils.addMethod(chai3.expect, "arrayContaining", (expected) => new ArrayContaining(expected));
  utils.addMethod(chai3.expect, "stringMatching", (expected) => new StringMatching(expected));
  utils.addMethod(chai3.expect, "closeTo", (expected, precision) => new CloseTo(expected, precision));
  chai3.expect.not = {
    stringContaining: (expected) => new StringContaining(expected, true),
    objectContaining: (expected) => new ObjectContaining(expected, true),
    arrayContaining: (expected) => new ArrayContaining(expected, true),
    stringMatching: (expected) => new StringMatching(expected, true),
    closeTo: (expected, precision) => new CloseTo(expected, precision, true)
  };
};
function recordAsyncExpect(test2, promise) {
  if (test2 && promise instanceof Promise) {
    promise = promise.finally(() => {
      const index = test2.promises.indexOf(promise);
      if (index !== -1)
        test2.promises.splice(index, 1);
    });
    if (!test2.promises)
      test2.promises = [];
    test2.promises.push(promise);
  }
  return promise;
}
function wrapSoft(utils, fn2) {
  return function(...args) {
    var _a;
    const test2 = utils.flag(this, "vitest-test");
    const state = (test2 == null ? undefined : test2.context._local) ? test2.context.expect.getState() : getState(globalThis[GLOBAL_EXPECT]);
    if (!state.soft)
      return fn2.apply(this, args);
    if (!test2)
      throw new Error("expect.soft() can only be used inside a test");
    try {
      return fn2.apply(this, args);
    } catch (err) {
      test2.result || (test2.result = { state: "fail" });
      test2.result.state = "fail";
      (_a = test2.result).errors || (_a.errors = []);
      test2.result.errors.push(processError(err));
    }
  };
}
var JestChaiExpect = (chai3, utils) => {
  const { AssertionError: AssertionError2 } = chai3;
  const c2 = () => getColors();
  const customTesters = getCustomEqualityTesters();
  function def(name, fn2) {
    const addMethod = (n) => {
      const softWrapper = wrapSoft(utils, fn2);
      utils.addMethod(chai3.Assertion.prototype, n, softWrapper);
      utils.addMethod(globalThis[JEST_MATCHERS_OBJECT].matchers, n, softWrapper);
    };
    if (Array.isArray(name))
      name.forEach((n) => addMethod(n));
    else
      addMethod(name);
  }
  ["throw", "throws", "Throw"].forEach((m) => {
    utils.overwriteMethod(chai3.Assertion.prototype, m, (_super) => {
      return function(...args) {
        const promise = utils.flag(this, "promise");
        const object = utils.flag(this, "object");
        const isNot = utils.flag(this, "negate");
        if (promise === "rejects") {
          utils.flag(this, "object", () => {
            throw object;
          });
        } else if (promise === "resolves" && typeof object !== "function") {
          if (!isNot) {
            const message = utils.flag(this, "message") || "expected promise to throw an error, but it didn't";
            const error = {
              showDiff: false
            };
            throw new AssertionError2(message, error, utils.flag(this, "ssfi"));
          } else {
            return;
          }
        }
        _super.apply(this, args);
      };
    });
  });
  def("withTest", function(test2) {
    utils.flag(this, "vitest-test", test2);
    return this;
  });
  def("toEqual", function(expected) {
    const actual = utils.flag(this, "object");
    const equal = equals(actual, expected, [...customTesters, iterableEquality]);
    return this.assert(equal, "expected #{this} to deeply equal #{exp}", "expected #{this} to not deeply equal #{exp}", expected, actual);
  });
  def("toStrictEqual", function(expected) {
    const obj = utils.flag(this, "object");
    const equal = equals(obj, expected, [
      ...customTesters,
      iterableEquality,
      typeEquality,
      sparseArrayEquality,
      arrayBufferEquality
    ], true);
    return this.assert(equal, "expected #{this} to strictly equal #{exp}", "expected #{this} to not strictly equal #{exp}", expected, obj);
  });
  def("toBe", function(expected) {
    const actual = this._obj;
    const pass = Object.is(actual, expected);
    let deepEqualityName = "";
    if (!pass) {
      const toStrictEqualPass = equals(actual, expected, [
        ...customTesters,
        iterableEquality,
        typeEquality,
        sparseArrayEquality,
        arrayBufferEquality
      ], true);
      if (toStrictEqualPass) {
        deepEqualityName = "toStrictEqual";
      } else {
        const toEqualPass = equals(actual, expected, [...customTesters, iterableEquality]);
        if (toEqualPass)
          deepEqualityName = "toEqual";
      }
    }
    return this.assert(pass, generateToBeMessage(deepEqualityName), "expected #{this} not to be #{exp} // Object.is equality", expected, actual);
  });
  def("toMatchObject", function(expected) {
    const actual = this._obj;
    const pass = equals(actual, expected, [...customTesters, iterableEquality, subsetEquality]);
    const isNot = utils.flag(this, "negate");
    const { subset: actualSubset, stripped } = getObjectSubset(actual, expected);
    if (pass && isNot || !pass && !isNot) {
      const msg = utils.getMessage(this, [
        pass,
        "expected #{this} to match object #{exp}",
        "expected #{this} to not match object #{exp}",
        expected,
        actualSubset,
        false
      ]);
      const message = stripped === 0 ? msg : `${msg}
(${stripped} matching ${stripped === 1 ? "property" : "properties"} omitted from actual)`;
      throw new AssertionError2(message, { showDiff: true, expected, actual: actualSubset });
    }
  });
  def("toMatch", function(expected) {
    const actual = this._obj;
    if (typeof actual !== "string")
      throw new TypeError(`.toMatch() expects to receive a string, but got ${typeof actual}`);
    return this.assert(typeof expected === "string" ? actual.includes(expected) : actual.match(expected), `expected #{this} to match #{exp}`, `expected #{this} not to match #{exp}`, expected, actual);
  });
  def("toContain", function(item) {
    const actual = this._obj;
    if (typeof Node !== "undefined" && actual instanceof Node) {
      if (!(item instanceof Node))
        throw new TypeError(`toContain() expected a DOM node as the argument, but got ${typeof item}`);
      return this.assert(actual.contains(item), "expected #{this} to contain element #{exp}", "expected #{this} not to contain element #{exp}", item, actual);
    }
    if (typeof DOMTokenList !== "undefined" && actual instanceof DOMTokenList) {
      assertTypes(item, "class name", ["string"]);
      const isNot = utils.flag(this, "negate");
      const expectedClassList = isNot ? actual.value.replace(item, "").trim() : `${actual.value} ${item}`;
      return this.assert(actual.contains(item), `expected "${actual.value}" to contain "${item}"`, `expected "${actual.value}" not to contain "${item}"`, expectedClassList, actual.value);
    }
    if (typeof actual === "string" && typeof item === "string") {
      return this.assert(actual.includes(item), `expected #{this} to contain #{exp}`, `expected #{this} not to contain #{exp}`, item, actual);
    }
    if (actual != null && typeof actual !== "string")
      utils.flag(this, "object", Array.from(actual));
    return this.contain(item);
  });
  def("toContainEqual", function(expected) {
    const obj = utils.flag(this, "object");
    const index = Array.from(obj).findIndex((item) => {
      return equals(item, expected, customTesters);
    });
    this.assert(index !== -1, "expected #{this} to deep equally contain #{exp}", "expected #{this} to not deep equally contain #{exp}", expected);
  });
  def("toBeTruthy", function() {
    const obj = utils.flag(this, "object");
    this.assert(Boolean(obj), "expected #{this} to be truthy", "expected #{this} to not be truthy", obj, false);
  });
  def("toBeFalsy", function() {
    const obj = utils.flag(this, "object");
    this.assert(!obj, "expected #{this} to be falsy", "expected #{this} to not be falsy", obj, false);
  });
  def("toBeGreaterThan", function(expected) {
    const actual = this._obj;
    assertTypes(actual, "actual", ["number", "bigint"]);
    assertTypes(expected, "expected", ["number", "bigint"]);
    return this.assert(actual > expected, `expected ${actual} to be greater than ${expected}`, `expected ${actual} to be not greater than ${expected}`, actual, expected, false);
  });
  def("toBeGreaterThanOrEqual", function(expected) {
    const actual = this._obj;
    assertTypes(actual, "actual", ["number", "bigint"]);
    assertTypes(expected, "expected", ["number", "bigint"]);
    return this.assert(actual >= expected, `expected ${actual} to be greater than or equal to ${expected}`, `expected ${actual} to be not greater than or equal to ${expected}`, actual, expected, false);
  });
  def("toBeLessThan", function(expected) {
    const actual = this._obj;
    assertTypes(actual, "actual", ["number", "bigint"]);
    assertTypes(expected, "expected", ["number", "bigint"]);
    return this.assert(actual < expected, `expected ${actual} to be less than ${expected}`, `expected ${actual} to be not less than ${expected}`, actual, expected, false);
  });
  def("toBeLessThanOrEqual", function(expected) {
    const actual = this._obj;
    assertTypes(actual, "actual", ["number", "bigint"]);
    assertTypes(expected, "expected", ["number", "bigint"]);
    return this.assert(actual <= expected, `expected ${actual} to be less than or equal to ${expected}`, `expected ${actual} to be not less than or equal to ${expected}`, actual, expected, false);
  });
  def("toBeNaN", function() {
    return this.be.NaN;
  });
  def("toBeUndefined", function() {
    return this.be.undefined;
  });
  def("toBeNull", function() {
    return this.be.null;
  });
  def("toBeDefined", function() {
    const negate = utils.flag(this, "negate");
    utils.flag(this, "negate", false);
    if (negate)
      return this.be.undefined;
    return this.not.be.undefined;
  });
  def("toBeTypeOf", function(expected) {
    const actual = typeof this._obj;
    const equal = expected === actual;
    return this.assert(equal, "expected #{this} to be type of #{exp}", "expected #{this} not to be type of #{exp}", expected, actual);
  });
  def("toBeInstanceOf", function(obj) {
    return this.instanceOf(obj);
  });
  def("toHaveLength", function(length) {
    return this.have.length(length);
  });
  def("toHaveProperty", function(...args) {
    if (Array.isArray(args[0]))
      args[0] = args[0].map((key) => String(key).replace(/([.[\]])/g, "\\$1")).join(".");
    const actual = this._obj;
    const [propertyName, expected] = args;
    const getValue = () => {
      const hasOwn = Object.prototype.hasOwnProperty.call(actual, propertyName);
      if (hasOwn)
        return { value: actual[propertyName], exists: true };
      return utils.getPathInfo(actual, propertyName);
    };
    const { value, exists } = getValue();
    const pass = exists && (args.length === 1 || equals(expected, value, customTesters));
    const valueString = args.length === 1 ? "" : ` with value ${utils.objDisplay(expected)}`;
    return this.assert(pass, `expected #{this} to have property "${propertyName}"${valueString}`, `expected #{this} to not have property "${propertyName}"${valueString}`, expected, exists ? value : undefined);
  });
  def("toBeCloseTo", function(received, precision = 2) {
    const expected = this._obj;
    let pass = false;
    let expectedDiff = 0;
    let receivedDiff = 0;
    if (received === Number.POSITIVE_INFINITY && expected === Number.POSITIVE_INFINITY) {
      pass = true;
    } else if (received === Number.NEGATIVE_INFINITY && expected === Number.NEGATIVE_INFINITY) {
      pass = true;
    } else {
      expectedDiff = 10 ** -precision / 2;
      receivedDiff = Math.abs(expected - received);
      pass = receivedDiff < expectedDiff;
    }
    return this.assert(pass, `expected #{this} to be close to #{exp}, received difference is ${receivedDiff}, but expected ${expectedDiff}`, `expected #{this} to not be close to #{exp}, received difference is ${receivedDiff}, but expected ${expectedDiff}`, received, expected, false);
  });
  const assertIsMock = (assertion) => {
    if (!isMockFunction(assertion._obj))
      throw new TypeError(`${utils.inspect(assertion._obj)} is not a spy or a call to a spy!`);
  };
  const getSpy = (assertion) => {
    assertIsMock(assertion);
    return assertion._obj;
  };
  const ordinalOf = (i2) => {
    const j = i2 % 10;
    const k2 = i2 % 100;
    if (j === 1 && k2 !== 11)
      return `${i2}st`;
    if (j === 2 && k2 !== 12)
      return `${i2}nd`;
    if (j === 3 && k2 !== 13)
      return `${i2}rd`;
    return `${i2}th`;
  };
  const formatCalls = (spy, msg, actualCall) => {
    if (spy.mock.calls) {
      msg += c2().gray(`

Received: 

${spy.mock.calls.map((callArg, i2) => {
        let methodCall = c2().bold(`  ${ordinalOf(i2 + 1)} ${spy.getMockName()} call:

`);
        if (actualCall)
          methodCall += diff(actualCall, callArg, { omitAnnotationLines: true });
        else
          methodCall += stringify(callArg).split(`
`).map((line) => `    ${line}`).join(`
`);
        methodCall += `
`;
        return methodCall;
      }).join(`
`)}`);
    }
    msg += c2().gray(`

Number of calls: ${c2().bold(spy.mock.calls.length)}
`);
    return msg;
  };
  const formatReturns = (spy, msg, actualReturn) => {
    msg += c2().gray(`

Received: 

${spy.mock.results.map((callReturn, i2) => {
      let methodCall = c2().bold(`  ${ordinalOf(i2 + 1)} ${spy.getMockName()} call return:

`);
      if (actualReturn)
        methodCall += diff(actualReturn, callReturn.value, { omitAnnotationLines: true });
      else
        methodCall += stringify(callReturn).split(`
`).map((line) => `    ${line}`).join(`
`);
      methodCall += `
`;
      return methodCall;
    }).join(`
`)}`);
    msg += c2().gray(`

Number of calls: ${c2().bold(spy.mock.calls.length)}
`);
    return msg;
  };
  def(["toHaveBeenCalledTimes", "toBeCalledTimes"], function(number) {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const callCount = spy.mock.calls.length;
    return this.assert(callCount === number, `expected "${spyName}" to be called #{exp} times, but got ${callCount} times`, `expected "${spyName}" to not be called #{exp} times`, number, callCount, false);
  });
  def("toHaveBeenCalledOnce", function() {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const callCount = spy.mock.calls.length;
    return this.assert(callCount === 1, `expected "${spyName}" to be called once, but got ${callCount} times`, `expected "${spyName}" to not be called once`, 1, callCount, false);
  });
  def(["toHaveBeenCalled", "toBeCalled"], function() {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const callCount = spy.mock.calls.length;
    const called = callCount > 0;
    const isNot = utils.flag(this, "negate");
    let msg = utils.getMessage(this, [
      called,
      `expected "${spyName}" to be called at least once`,
      `expected "${spyName}" to not be called at all, but actually been called ${callCount} times`,
      true,
      called
    ]);
    if (called && isNot)
      msg = formatCalls(spy, msg);
    if (called && isNot || !called && !isNot)
      throw new AssertionError2(msg);
  });
  def(["toHaveBeenCalledWith", "toBeCalledWith"], function(...args) {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const pass = spy.mock.calls.some((callArg) => equals(callArg, args, [...customTesters, iterableEquality]));
    const isNot = utils.flag(this, "negate");
    const msg = utils.getMessage(this, [
      pass,
      `expected "${spyName}" to be called with arguments: #{exp}`,
      `expected "${spyName}" to not be called with arguments: #{exp}`,
      args
    ]);
    if (pass && isNot || !pass && !isNot)
      throw new AssertionError2(formatCalls(spy, msg, args));
  });
  def(["toHaveBeenNthCalledWith", "nthCalledWith"], function(times, ...args) {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const nthCall = spy.mock.calls[times - 1];
    const callCount = spy.mock.calls.length;
    const isCalled = times <= callCount;
    this.assert(equals(nthCall, args, [...customTesters, iterableEquality]), `expected ${ordinalOf(times)} "${spyName}" call to have been called with #{exp}${isCalled ? `` : `, but called only ${callCount} times`}`, `expected ${ordinalOf(times)} "${spyName}" call to not have been called with #{exp}`, args, nthCall, isCalled);
  });
  def(["toHaveBeenLastCalledWith", "lastCalledWith"], function(...args) {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const lastCall = spy.mock.calls[spy.mock.calls.length - 1];
    this.assert(equals(lastCall, args, [...customTesters, iterableEquality]), `expected last "${spyName}" call to have been called with #{exp}`, `expected last "${spyName}" call to not have been called with #{exp}`, args, lastCall);
  });
  def(["toThrow", "toThrowError"], function(expected) {
    if (typeof expected === "string" || typeof expected === "undefined" || expected instanceof RegExp)
      return this.throws(expected);
    const obj = this._obj;
    const promise = utils.flag(this, "promise");
    const isNot = utils.flag(this, "negate");
    let thrown = null;
    if (promise === "rejects") {
      thrown = obj;
    } else if (promise === "resolves" && typeof obj !== "function") {
      if (!isNot) {
        const message = utils.flag(this, "message") || "expected promise to throw an error, but it didn't";
        const error = {
          showDiff: false
        };
        throw new AssertionError2(message, error, utils.flag(this, "ssfi"));
      } else {
        return;
      }
    } else {
      let isThrow = false;
      try {
        obj();
      } catch (err) {
        isThrow = true;
        thrown = err;
      }
      if (!isThrow && !isNot) {
        const message = utils.flag(this, "message") || "expected function to throw an error, but it didn't";
        const error = {
          showDiff: false
        };
        throw new AssertionError2(message, error, utils.flag(this, "ssfi"));
      }
    }
    if (typeof expected === "function") {
      const name = expected.name || expected.prototype.constructor.name;
      return this.assert(thrown && thrown instanceof expected, `expected error to be instance of ${name}`, `expected error not to be instance of ${name}`, expected, thrown);
    }
    if (expected instanceof Error) {
      return this.assert(thrown && expected.message === thrown.message, `expected error to have message: ${expected.message}`, `expected error not to have message: ${expected.message}`, expected.message, thrown && thrown.message);
    }
    if (typeof expected === "object" && "asymmetricMatch" in expected && typeof expected.asymmetricMatch === "function") {
      const matcher = expected;
      return this.assert(thrown && matcher.asymmetricMatch(thrown), "expected error to match asymmetric matcher", "expected error not to match asymmetric matcher", matcher, thrown);
    }
    throw new Error(`"toThrow" expects string, RegExp, function, Error instance or asymmetric matcher, got "${typeof expected}"`);
  });
  def(["toHaveReturned", "toReturn"], function() {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const calledAndNotThrew = spy.mock.calls.length > 0 && spy.mock.results.some(({ type }) => type !== "throw");
    this.assert(calledAndNotThrew, `expected "${spyName}" to be successfully called at least once`, `expected "${spyName}" to not be successfully called`, calledAndNotThrew, !calledAndNotThrew, false);
  });
  def(["toHaveReturnedTimes", "toReturnTimes"], function(times) {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const successfulReturns = spy.mock.results.reduce((success, { type }) => type === "throw" ? success : ++success, 0);
    this.assert(successfulReturns === times, `expected "${spyName}" to be successfully called ${times} times`, `expected "${spyName}" to not be successfully called ${times} times`, `expected number of returns: ${times}`, `received number of returns: ${successfulReturns}`, false);
  });
  def(["toHaveReturnedWith", "toReturnWith"], function(value) {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const pass = spy.mock.results.some(({ type, value: result }) => type === "return" && equals(value, result));
    const isNot = utils.flag(this, "negate");
    const msg = utils.getMessage(this, [
      pass,
      `expected "${spyName}" to return with: #{exp} at least once`,
      `expected "${spyName}" to not return with: #{exp}`,
      value
    ]);
    if (pass && isNot || !pass && !isNot)
      throw new AssertionError2(formatReturns(spy, msg, value));
  });
  def(["toHaveLastReturnedWith", "lastReturnedWith"], function(value) {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const { value: lastResult } = spy.mock.results[spy.mock.results.length - 1];
    const pass = equals(lastResult, value);
    this.assert(pass, `expected last "${spyName}" call to return #{exp}`, `expected last "${spyName}" call to not return #{exp}`, value, lastResult);
  });
  def(["toHaveNthReturnedWith", "nthReturnedWith"], function(nthCall, value) {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const isNot = utils.flag(this, "negate");
    const { type: callType, value: callResult } = spy.mock.results[nthCall - 1];
    const ordinalCall = `${ordinalOf(nthCall)} call`;
    if (!isNot && callType === "throw")
      chai3.assert.fail(`expected ${ordinalCall} to return #{exp}, but instead it threw an error`);
    const nthCallReturn = equals(callResult, value);
    this.assert(nthCallReturn, `expected ${ordinalCall} "${spyName}" call to return #{exp}`, `expected ${ordinalCall} "${spyName}" call to not return #{exp}`, value, callResult);
  });
  def("toSatisfy", function(matcher, message) {
    return this.be.satisfy(matcher, message);
  });
  utils.addProperty(chai3.Assertion.prototype, "resolves", function __VITEST_RESOLVES__() {
    const error = new Error("resolves");
    utils.flag(this, "promise", "resolves");
    utils.flag(this, "error", error);
    const test2 = utils.flag(this, "vitest-test");
    const obj = utils.flag(this, "object");
    if (typeof (obj == null ? undefined : obj.then) !== "function")
      throw new TypeError(`You must provide a Promise to expect() when using .resolves, not '${typeof obj}'.`);
    const proxy = new Proxy(this, {
      get: (target, key, receiver) => {
        const result = Reflect.get(target, key, receiver);
        if (typeof result !== "function")
          return result instanceof chai3.Assertion ? proxy : result;
        return async (...args) => {
          const promise = obj.then((value) => {
            utils.flag(this, "object", value);
            return result.call(this, ...args);
          }, (err) => {
            const _error = new AssertionError2(`promise rejected "${utils.inspect(err)}" instead of resolving`, { showDiff: false });
            _error.cause = err;
            _error.stack = error.stack.replace(error.message, _error.message);
            throw _error;
          });
          return recordAsyncExpect(test2, promise);
        };
      }
    });
    return proxy;
  });
  utils.addProperty(chai3.Assertion.prototype, "rejects", function __VITEST_REJECTS__() {
    const error = new Error("rejects");
    utils.flag(this, "promise", "rejects");
    utils.flag(this, "error", error);
    const test2 = utils.flag(this, "vitest-test");
    const obj = utils.flag(this, "object");
    const wrapper = typeof obj === "function" ? obj() : obj;
    if (typeof (wrapper == null ? undefined : wrapper.then) !== "function")
      throw new TypeError(`You must provide a Promise to expect() when using .rejects, not '${typeof wrapper}'.`);
    const proxy = new Proxy(this, {
      get: (target, key, receiver) => {
        const result = Reflect.get(target, key, receiver);
        if (typeof result !== "function")
          return result instanceof chai3.Assertion ? proxy : result;
        return async (...args) => {
          const promise = wrapper.then((value) => {
            const _error = new AssertionError2(`promise resolved "${utils.inspect(value)}" instead of rejecting`, { showDiff: true, expected: new Error("rejected promise"), actual: value });
            _error.stack = error.stack.replace(error.message, _error.message);
            throw _error;
          }, (err) => {
            utils.flag(this, "object", err);
            return result.call(this, ...args);
          });
          return recordAsyncExpect(test2, promise);
        };
      }
    });
    return proxy;
  });
};
function getMatcherState(assertion, expect2) {
  const obj = assertion._obj;
  const isNot = util.flag(assertion, "negate");
  const promise = util.flag(assertion, "promise") || "";
  const jestUtils = {
    ...getMatcherUtils(),
    diff,
    stringify,
    iterableEquality,
    subsetEquality
  };
  const matcherState = {
    ...getState(expect2),
    customTesters: getCustomEqualityTesters(),
    isNot,
    utils: jestUtils,
    promise,
    equals,
    suppressedErrors: []
  };
  return {
    state: matcherState,
    isNot,
    obj
  };
}

class JestExtendError extends Error {
  constructor(message, actual, expected) {
    super(message);
    this.actual = actual;
    this.expected = expected;
  }
}
function JestExtendPlugin(expect2, matchers) {
  return (c2, utils) => {
    Object.entries(matchers).forEach(([expectAssertionName, expectAssertion]) => {
      function expectWrapper(...args) {
        const { state, isNot, obj } = getMatcherState(this, expect2);
        const result = expectAssertion.call(state, obj, ...args);
        if (result && typeof result === "object" && result instanceof Promise) {
          return result.then(({ pass: pass2, message: message2, actual: actual2, expected: expected2 }) => {
            if (pass2 && isNot || !pass2 && !isNot)
              throw new JestExtendError(message2(), actual2, expected2);
          });
        }
        const { pass, message, actual, expected } = result;
        if (pass && isNot || !pass && !isNot)
          throw new JestExtendError(message(), actual, expected);
      }
      const softWrapper = wrapSoft(utils, expectWrapper);
      utils.addMethod(globalThis[JEST_MATCHERS_OBJECT].matchers, expectAssertionName, softWrapper);
      utils.addMethod(c2.Assertion.prototype, expectAssertionName, softWrapper);

      class CustomMatcher extends AsymmetricMatcher3 {
        constructor(inverse = false, ...sample) {
          super(sample, inverse);
        }
        asymmetricMatch(other) {
          const { pass } = expectAssertion.call(this.getMatcherContext(expect2), other, ...this.sample);
          return this.inverse ? !pass : pass;
        }
        toString() {
          return `${this.inverse ? "not." : ""}${expectAssertionName}`;
        }
        getExpectedType() {
          return "any";
        }
        toAsymmetricMatcher() {
          return `${this.toString()}<${this.sample.map(String).join(", ")}>`;
        }
      }
      const customMatcher = (...sample) => new CustomMatcher(false, ...sample);
      Object.defineProperty(expect2, expectAssertionName, {
        configurable: true,
        enumerable: true,
        value: customMatcher,
        writable: true
      });
      Object.defineProperty(expect2.not, expectAssertionName, {
        configurable: true,
        enumerable: true,
        value: (...sample) => new CustomMatcher(true, ...sample),
        writable: true
      });
      Object.defineProperty(globalThis[ASYMMETRIC_MATCHERS_OBJECT], expectAssertionName, {
        configurable: true,
        enumerable: true,
        value: customMatcher,
        writable: true
      });
    });
  };
}
var JestExtend = (chai3, utils) => {
  utils.addMethod(chai3.expect, "extend", (expect2, expects) => {
    chai3.use(JestExtendPlugin(expect2, expects));
  });
};

// node_modules/@vitest/snapshot/dist/index.js
var import_pretty_format5 = __toESM(require_build3(), 1);
function getDefaultExportFromCjs2(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var naturalCompare$2 = { exports: {} };
var naturalCompare = function(a, b2) {
  var i2, codeA, codeB = 1, posA = 0, posB = 0, alphabet = String.alphabet;
  function getCode(str, pos, code) {
    if (code) {
      for (i2 = pos;code = getCode(str, i2), code < 76 && code > 65; )
        ++i2;
      return +str.slice(pos - 1, i2);
    }
    code = alphabet && alphabet.indexOf(str.charAt(pos));
    return code > -1 ? code + 76 : (code = str.charCodeAt(pos) || 0, code < 45 || code > 127) ? code : code < 46 ? 65 : code < 48 ? code - 1 : code < 58 ? code + 18 : code < 65 ? code - 11 : code < 91 ? code + 11 : code < 97 ? code - 37 : code < 123 ? code + 5 : code - 63;
  }
  if ((a += "") != (b2 += ""))
    for (;codeB; ) {
      codeA = getCode(a, posA++);
      codeB = getCode(b2, posB++);
      if (codeA < 76 && codeB < 76 && codeA > 66 && codeB > 66) {
        codeA = getCode(a, posA, posA);
        codeB = getCode(b2, posB, posA = i2);
        posB = i2;
      }
      if (codeA != codeB)
        return codeA < codeB ? -1 : 1;
    }
  return 0;
};
try {
  naturalCompare$2.exports = naturalCompare;
} catch (e) {
  String.naturalCompare = naturalCompare;
}
var naturalCompareExports = naturalCompare$2.exports;
var naturalCompare$1 = /* @__PURE__ */ getDefaultExportFromCjs2(naturalCompareExports);
function notNullish2(v) {
  return v != null;
}
function isPrimitive3(value) {
  return value === null || typeof value !== "function" && typeof value !== "object";
}
function isObject4(item) {
  return item != null && typeof item === "object" && !Array.isArray(item);
}
function getCallLastIndex2(code) {
  let charIndex = -1;
  let inString = null;
  let startedBracers = 0;
  let endedBracers = 0;
  let beforeChar = null;
  while (charIndex <= code.length) {
    beforeChar = code[charIndex];
    charIndex++;
    const char = code[charIndex];
    const isCharString = char === '"' || char === "'" || char === "`";
    if (isCharString && beforeChar !== "\\") {
      if (inString === char)
        inString = null;
      else if (!inString)
        inString = char;
    }
    if (!inString) {
      if (char === "(")
        startedBracers++;
      if (char === ")")
        endedBracers++;
    }
    if (startedBracers && endedBracers && startedBracers === endedBracers)
      return charIndex;
  }
  return null;
}
var getPromiseValue = () => "Promise{…}";
try {
  const { getPromiseDetails, kPending, kRejected } = process.binding("util");
  if (Array.isArray(getPromiseDetails(Promise.resolve()))) {
    getPromiseValue = (value, options) => {
      const [state, innerValue] = getPromiseDetails(value);
      if (state === kPending) {
        return "Promise{<pending>}";
      }
      return `Promise${state === kRejected ? "!" : ""}{${options.inspect(innerValue, options)}}`;
    };
  }
} catch (notNode) {}
var nodeInspect = false;
try {
  const nodeUtil = (init_util(), __toCommonJS(exports_util));
  nodeInspect = nodeUtil.inspect ? nodeUtil.inspect.custom : false;
} catch (noNodeInspect) {
  nodeInspect = false;
}
var lineSplitRE = /\r?\n/;
function positionToOffset(source, lineNumber, columnNumber) {
  const lines = source.split(lineSplitRE);
  const nl = /\r\n/.test(source) ? 2 : 1;
  let start = 0;
  if (lineNumber > lines.length)
    return source.length;
  for (let i2 = 0;i2 < lineNumber - 1; i2++)
    start += lines[i2].length + nl;
  return start + columnNumber;
}
function offsetToLineNumber(source, offset) {
  if (offset > source.length) {
    throw new Error(`offset is longer than source length! offset ${offset} > length ${source.length}`);
  }
  const lines = source.split(lineSplitRE);
  const nl = /\r\n/.test(source) ? 2 : 1;
  let counted = 0;
  let line = 0;
  for (;line < lines.length; line++) {
    const lineLength = lines[line].length + nl;
    if (counted + lineLength >= offset)
      break;
    counted += lineLength;
  }
  return line + 1;
}
var LineTerminatorSequence2;
LineTerminatorSequence2 = /\r?\n|[\r\u2028\u2029]/y;
RegExp(LineTerminatorSequence2.source);
var reservedWords2 = {
  keyword: [
    "break",
    "case",
    "catch",
    "continue",
    "debugger",
    "default",
    "do",
    "else",
    "finally",
    "for",
    "function",
    "if",
    "return",
    "switch",
    "throw",
    "try",
    "var",
    "const",
    "while",
    "with",
    "new",
    "this",
    "super",
    "class",
    "extends",
    "export",
    "import",
    "null",
    "true",
    "false",
    "in",
    "instanceof",
    "typeof",
    "void",
    "delete"
  ],
  strict: [
    "implements",
    "interface",
    "let",
    "package",
    "private",
    "protected",
    "public",
    "static",
    "yield"
  ]
};
new Set(reservedWords2.keyword);
new Set(reservedWords2.strict);
var serialize$1 = (val, config2, indentation, depth, refs, printer) => {
  const name = val.getMockName();
  const nameString = name === "vi.fn()" ? "" : ` ${name}`;
  let callsString = "";
  if (val.mock.calls.length !== 0) {
    const indentationNext = indentation + config2.indent;
    callsString = ` {${config2.spacingOuter}${indentationNext}"calls": ${printer(val.mock.calls, config2, indentationNext, depth, refs)}${config2.min ? ", " : ","}${config2.spacingOuter}${indentationNext}"results": ${printer(val.mock.results, config2, indentationNext, depth, refs)}${config2.min ? "" : ","}${config2.spacingOuter}${indentation}}`;
  }
  return `[MockFunction${nameString}]${callsString}`;
};
var test2 = (val) => val && !!val._isMockFunction;
var plugin = { serialize: serialize$1, test: test2 };
var {
  DOMCollection: DOMCollection3,
  DOMElement: DOMElement3,
  Immutable: Immutable3,
  ReactElement: ReactElement3,
  ReactTestComponent: ReactTestComponent3,
  AsymmetricMatcher: AsymmetricMatcher4
} = import_pretty_format5.plugins;
var PLUGINS3 = [
  ReactTestComponent3,
  ReactElement3,
  DOMElement3,
  DOMCollection3,
  Immutable3,
  AsymmetricMatcher4,
  plugin
];
function addSerializer(plugin2) {
  PLUGINS3 = [plugin2].concat(PLUGINS3);
}
function getSerializers() {
  return PLUGINS3;
}
function testNameToKey(testName, count) {
  return `${testName} ${count}`;
}
function keyToTestName(key) {
  if (!/ \d+$/.test(key))
    throw new Error("Snapshot keys must end with a number.");
  return key.replace(/ \d+$/, "");
}
function getSnapshotData(content, options) {
  const update = options.updateSnapshot;
  const data = /* @__PURE__ */ Object.create(null);
  let snapshotContents = "";
  let dirty = false;
  if (content != null) {
    try {
      snapshotContents = content;
      const populate = new Function("exports", snapshotContents);
      populate(data);
    } catch {}
  }
  const isInvalid = snapshotContents;
  if ((update === "all" || update === "new") && isInvalid)
    dirty = true;
  return { data, dirty };
}
function addExtraLineBreaks(string2) {
  return string2.includes(`
`) ? `
${string2}
` : string2;
}
function removeExtraLineBreaks(string2) {
  return string2.length > 2 && string2.startsWith(`
`) && string2.endsWith(`
`) ? string2.slice(1, -1) : string2;
}
var escapeRegex = true;
var printFunctionName = false;
function serialize(val, indent = 2, formatOverrides = {}) {
  return normalizeNewlines(import_pretty_format5.format(val, {
    escapeRegex,
    indent,
    plugins: getSerializers(),
    printFunctionName,
    ...formatOverrides
  }));
}
function escapeBacktickString(str) {
  return str.replace(/`|\\|\${/g, "\\$&");
}
function printBacktickString(str) {
  return `\`${escapeBacktickString(str)}\``;
}
function normalizeNewlines(string2) {
  return string2.replace(/\r\n|\r/g, `
`);
}
async function saveSnapshotFile(environment, snapshotData, snapshotPath) {
  const snapshots = Object.keys(snapshotData).sort(naturalCompare$1).map((key) => `exports[${printBacktickString(key)}] = ${printBacktickString(normalizeNewlines(snapshotData[key]))};`);
  const content = `${environment.getHeader()}

${snapshots.join(`

`)}
`;
  const oldContent = await environment.readSnapshotFile(snapshotPath);
  const skipWriting = oldContent != null && oldContent === content;
  if (skipWriting)
    return;
  await environment.saveSnapshotFile(snapshotPath, content);
}
function prepareExpected(expected) {
  function findStartIndent() {
    var _a, _b;
    const matchObject = /^( +)}\s+$/m.exec(expected || "");
    const objectIndent = (_a = matchObject == null ? undefined : matchObject[1]) == null ? undefined : _a.length;
    if (objectIndent)
      return objectIndent;
    const matchText = /^\n( +)"/.exec(expected || "");
    return ((_b = matchText == null ? undefined : matchText[1]) == null ? undefined : _b.length) || 0;
  }
  const startIndent = findStartIndent();
  let expectedTrimmed = expected == null ? undefined : expected.trim();
  if (startIndent) {
    expectedTrimmed = expectedTrimmed == null ? undefined : expectedTrimmed.replace(new RegExp(`^${" ".repeat(startIndent)}`, "gm"), "").replace(/ +}$/, "}");
  }
  return expectedTrimmed;
}
function deepMergeArray(target = [], source = []) {
  const mergedOutput = Array.from(target);
  source.forEach((sourceElement, index) => {
    const targetElement = mergedOutput[index];
    if (Array.isArray(target[index])) {
      mergedOutput[index] = deepMergeArray(target[index], sourceElement);
    } else if (isObject4(targetElement)) {
      mergedOutput[index] = deepMergeSnapshot(target[index], sourceElement);
    } else {
      mergedOutput[index] = sourceElement;
    }
  });
  return mergedOutput;
}
function deepMergeSnapshot(target, source) {
  if (isObject4(target) && isObject4(source)) {
    const mergedOutput = { ...target };
    Object.keys(source).forEach((key) => {
      if (isObject4(source[key]) && !source[key].$$typeof) {
        if (!(key in target))
          Object.assign(mergedOutput, { [key]: source[key] });
        else
          mergedOutput[key] = deepMergeSnapshot(target[key], source[key]);
      } else if (Array.isArray(source[key])) {
        mergedOutput[key] = deepMergeArray(target[key], source[key]);
      } else {
        Object.assign(mergedOutput, { [key]: source[key] });
      }
    });
    return mergedOutput;
  } else if (Array.isArray(target) && Array.isArray(source)) {
    return deepMergeArray(target, source);
  }
  return target;
}
var comma3 = 44;
var chars3 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var intToChar3 = new Uint8Array(64);
var charToInt3 = new Uint8Array(128);
for (let i2 = 0;i2 < chars3.length; i2++) {
  const c2 = chars3.charCodeAt(i2);
  intToChar3[i2] = c2;
  charToInt3[c2] = i2;
}
function decode2(mappings) {
  const state = new Int32Array(5);
  const decoded = [];
  let index = 0;
  do {
    const semi = indexOf2(mappings, index);
    const line = [];
    let sorted = true;
    let lastCol = 0;
    state[0] = 0;
    for (let i2 = index;i2 < semi; i2++) {
      let seg;
      i2 = decodeInteger2(mappings, i2, state, 0);
      const col = state[0];
      if (col < lastCol)
        sorted = false;
      lastCol = col;
      if (hasMoreVlq2(mappings, i2, semi)) {
        i2 = decodeInteger2(mappings, i2, state, 1);
        i2 = decodeInteger2(mappings, i2, state, 2);
        i2 = decodeInteger2(mappings, i2, state, 3);
        if (hasMoreVlq2(mappings, i2, semi)) {
          i2 = decodeInteger2(mappings, i2, state, 4);
          seg = [col, state[1], state[2], state[3], state[4]];
        } else {
          seg = [col, state[1], state[2], state[3]];
        }
      } else {
        seg = [col];
      }
      line.push(seg);
    }
    if (!sorted)
      sort2(line);
    decoded.push(line);
    index = semi + 1;
  } while (index <= mappings.length);
  return decoded;
}
function indexOf2(mappings, index) {
  const idx = mappings.indexOf(";", index);
  return idx === -1 ? mappings.length : idx;
}
function decodeInteger2(mappings, pos, state, j) {
  let value = 0;
  let shift = 0;
  let integer = 0;
  do {
    const c2 = mappings.charCodeAt(pos++);
    integer = charToInt3[c2];
    value |= (integer & 31) << shift;
    shift += 5;
  } while (integer & 32);
  const shouldNegate = value & 1;
  value >>>= 1;
  if (shouldNegate) {
    value = -2147483648 | -value;
  }
  state[j] += value;
  return pos;
}
function hasMoreVlq2(mappings, i2, length) {
  if (i2 >= length)
    return false;
  return mappings.charCodeAt(i2) !== comma3;
}
function sort2(line) {
  line.sort(sortComparator$12);
}
function sortComparator$12(a, b2) {
  return a[0] - b2[0];
}
var schemeRegex = /^[\w+.-]+:\/\//;
var urlRegex = /^([\w+.-]+:)\/\/([^@/#?]*@)?([^:/#?]*)(:\d+)?(\/[^#?]*)?(\?[^#]*)?(#.*)?/;
var fileRegex = /^file:(?:\/\/((?![a-z]:)[^/#?]*)?)?(\/?[^#?]*)(\?[^#]*)?(#.*)?/i;
var UrlType2;
(function(UrlType3) {
  UrlType3[UrlType3["Empty"] = 1] = "Empty";
  UrlType3[UrlType3["Hash"] = 2] = "Hash";
  UrlType3[UrlType3["Query"] = 3] = "Query";
  UrlType3[UrlType3["RelativePath"] = 4] = "RelativePath";
  UrlType3[UrlType3["AbsolutePath"] = 5] = "AbsolutePath";
  UrlType3[UrlType3["SchemeRelative"] = 6] = "SchemeRelative";
  UrlType3[UrlType3["Absolute"] = 7] = "Absolute";
})(UrlType2 || (UrlType2 = {}));
function isAbsoluteUrl(input) {
  return schemeRegex.test(input);
}
function isSchemeRelativeUrl(input) {
  return input.startsWith("//");
}
function isAbsolutePath(input) {
  return input.startsWith("/");
}
function isFileUrl(input) {
  return input.startsWith("file:");
}
function isRelative(input) {
  return /^[.?#]/.test(input);
}
function parseAbsoluteUrl(input) {
  const match = urlRegex.exec(input);
  return makeUrl(match[1], match[2] || "", match[3], match[4] || "", match[5] || "/", match[6] || "", match[7] || "");
}
function parseFileUrl(input) {
  const match = fileRegex.exec(input);
  const path2 = match[2];
  return makeUrl("file:", "", match[1] || "", "", isAbsolutePath(path2) ? path2 : "/" + path2, match[3] || "", match[4] || "");
}
function makeUrl(scheme, user, host, port, path2, query, hash) {
  return {
    scheme,
    user,
    host,
    port,
    path: path2,
    query,
    hash,
    type: UrlType2.Absolute
  };
}
function parseUrl(input) {
  if (isSchemeRelativeUrl(input)) {
    const url2 = parseAbsoluteUrl("http:" + input);
    url2.scheme = "";
    url2.type = UrlType2.SchemeRelative;
    return url2;
  }
  if (isAbsolutePath(input)) {
    const url2 = parseAbsoluteUrl("http://foo.com" + input);
    url2.scheme = "";
    url2.host = "";
    url2.type = UrlType2.AbsolutePath;
    return url2;
  }
  if (isFileUrl(input))
    return parseFileUrl(input);
  if (isAbsoluteUrl(input))
    return parseAbsoluteUrl(input);
  const url = parseAbsoluteUrl("http://foo.com/" + input);
  url.scheme = "";
  url.host = "";
  url.type = input ? input.startsWith("?") ? UrlType2.Query : input.startsWith("#") ? UrlType2.Hash : UrlType2.RelativePath : UrlType2.Empty;
  return url;
}
function stripPathFilename(path2) {
  if (path2.endsWith("/.."))
    return path2;
  const index = path2.lastIndexOf("/");
  return path2.slice(0, index + 1);
}
function mergePaths(url, base) {
  normalizePath(base, base.type);
  if (url.path === "/") {
    url.path = base.path;
  } else {
    url.path = stripPathFilename(base.path) + url.path;
  }
}
function normalizePath(url, type) {
  const rel = type <= UrlType2.RelativePath;
  const pieces = url.path.split("/");
  let pointer = 1;
  let positive = 0;
  let addTrailingSlash = false;
  for (let i2 = 1;i2 < pieces.length; i2++) {
    const piece = pieces[i2];
    if (!piece) {
      addTrailingSlash = true;
      continue;
    }
    addTrailingSlash = false;
    if (piece === ".")
      continue;
    if (piece === "..") {
      if (positive) {
        addTrailingSlash = true;
        positive--;
        pointer--;
      } else if (rel) {
        pieces[pointer++] = piece;
      }
      continue;
    }
    pieces[pointer++] = piece;
    positive++;
  }
  let path2 = "";
  for (let i2 = 1;i2 < pointer; i2++) {
    path2 += "/" + pieces[i2];
  }
  if (!path2 || addTrailingSlash && !path2.endsWith("/..")) {
    path2 += "/";
  }
  url.path = path2;
}
function resolve$1(input, base) {
  if (!input && !base)
    return "";
  const url = parseUrl(input);
  let inputType = url.type;
  if (base && inputType !== UrlType2.Absolute) {
    const baseUrl = parseUrl(base);
    const baseType = baseUrl.type;
    switch (inputType) {
      case UrlType2.Empty:
        url.hash = baseUrl.hash;
      case UrlType2.Hash:
        url.query = baseUrl.query;
      case UrlType2.Query:
      case UrlType2.RelativePath:
        mergePaths(url, baseUrl);
      case UrlType2.AbsolutePath:
        url.user = baseUrl.user;
        url.host = baseUrl.host;
        url.port = baseUrl.port;
      case UrlType2.SchemeRelative:
        url.scheme = baseUrl.scheme;
    }
    if (baseType > inputType)
      inputType = baseType;
  }
  normalizePath(url, inputType);
  const queryHash = url.query + url.hash;
  switch (inputType) {
    case UrlType2.Hash:
    case UrlType2.Query:
      return queryHash;
    case UrlType2.RelativePath: {
      const path2 = url.path.slice(1);
      if (!path2)
        return queryHash || ".";
      if (isRelative(base || input) && !isRelative(path2)) {
        return "./" + path2 + queryHash;
      }
      return path2 + queryHash;
    }
    case UrlType2.AbsolutePath:
      return url.path + queryHash;
    default:
      return url.scheme + "//" + url.user + url.host + url.port + url.path + queryHash;
  }
}
function resolve2(input, base) {
  if (base && !base.endsWith("/"))
    base += "/";
  return resolve$1(input, base);
}
function stripFilename(path2) {
  if (!path2)
    return "";
  const index = path2.lastIndexOf("/");
  return path2.slice(0, index + 1);
}
var COLUMN2 = 0;
var SOURCES_INDEX2 = 1;
var SOURCE_LINE2 = 2;
var SOURCE_COLUMN2 = 3;
var NAMES_INDEX2 = 4;
function maybeSort(mappings, owned) {
  const unsortedIndex = nextUnsortedSegmentLine(mappings, 0);
  if (unsortedIndex === mappings.length)
    return mappings;
  if (!owned)
    mappings = mappings.slice();
  for (let i2 = unsortedIndex;i2 < mappings.length; i2 = nextUnsortedSegmentLine(mappings, i2 + 1)) {
    mappings[i2] = sortSegments(mappings[i2], owned);
  }
  return mappings;
}
function nextUnsortedSegmentLine(mappings, start) {
  for (let i2 = start;i2 < mappings.length; i2++) {
    if (!isSorted(mappings[i2]))
      return i2;
  }
  return mappings.length;
}
function isSorted(line) {
  for (let j = 1;j < line.length; j++) {
    if (line[j][COLUMN2] < line[j - 1][COLUMN2]) {
      return false;
    }
  }
  return true;
}
function sortSegments(line, owned) {
  if (!owned)
    line = line.slice();
  return line.sort(sortComparator);
}
function sortComparator(a, b2) {
  return a[COLUMN2] - b2[COLUMN2];
}
var found2 = false;
function binarySearch2(haystack, needle, low, high) {
  while (low <= high) {
    const mid = low + (high - low >> 1);
    const cmp = haystack[mid][COLUMN2] - needle;
    if (cmp === 0) {
      found2 = true;
      return mid;
    }
    if (cmp < 0) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  found2 = false;
  return low - 1;
}
function upperBound2(haystack, needle, index) {
  for (let i2 = index + 1;i2 < haystack.length; index = i2++) {
    if (haystack[i2][COLUMN2] !== needle)
      break;
  }
  return index;
}
function lowerBound2(haystack, needle, index) {
  for (let i2 = index - 1;i2 >= 0; index = i2--) {
    if (haystack[i2][COLUMN2] !== needle)
      break;
  }
  return index;
}
function memoizedState2() {
  return {
    lastKey: -1,
    lastNeedle: -1,
    lastIndex: -1
  };
}
function memoizedBinarySearch2(haystack, needle, state, key) {
  const { lastKey, lastNeedle, lastIndex } = state;
  let low = 0;
  let high = haystack.length - 1;
  if (key === lastKey) {
    if (needle === lastNeedle) {
      found2 = lastIndex !== -1 && haystack[lastIndex][COLUMN2] === needle;
      return lastIndex;
    }
    if (needle >= lastNeedle) {
      low = lastIndex === -1 ? 0 : lastIndex;
    } else {
      high = lastIndex;
    }
  }
  state.lastKey = key;
  state.lastNeedle = needle;
  return state.lastIndex = binarySearch2(haystack, needle, low, high);
}
var LINE_GTR_ZERO2 = "`line` must be greater than 0 (lines start at line 1)";
var COL_GTR_EQ_ZERO2 = "`column` must be greater than or equal to 0 (columns start at column 0)";
var LEAST_UPPER_BOUND2 = -1;
var GREATEST_LOWER_BOUND2 = 1;
var decodedMappings2;
var originalPositionFor2;

class TraceMap {
  constructor(map, mapUrl) {
    const isString2 = typeof map === "string";
    if (!isString2 && map._decodedMemo)
      return map;
    const parsed = isString2 ? JSON.parse(map) : map;
    const { version: version2, file, names, sourceRoot, sources, sourcesContent } = parsed;
    this.version = version2;
    this.file = file;
    this.names = names || [];
    this.sourceRoot = sourceRoot;
    this.sources = sources;
    this.sourcesContent = sourcesContent;
    const from = resolve2(sourceRoot || "", stripFilename(mapUrl));
    this.resolvedSources = sources.map((s) => resolve2(s || "", from));
    const { mappings } = parsed;
    if (typeof mappings === "string") {
      this._encoded = mappings;
      this._decoded = undefined;
    } else {
      this._encoded = undefined;
      this._decoded = maybeSort(mappings, isString2);
    }
    this._decodedMemo = memoizedState2();
    this._bySources = undefined;
    this._bySourceMemos = undefined;
  }
}
(() => {
  decodedMappings2 = (map) => {
    return map._decoded || (map._decoded = decode2(map._encoded));
  };
  originalPositionFor2 = (map, { line, column, bias }) => {
    line--;
    if (line < 0)
      throw new Error(LINE_GTR_ZERO2);
    if (column < 0)
      throw new Error(COL_GTR_EQ_ZERO2);
    const decoded = decodedMappings2(map);
    if (line >= decoded.length)
      return OMapping2(null, null, null, null);
    const segments = decoded[line];
    const index = traceSegmentInternal2(segments, map._decodedMemo, line, column, bias || GREATEST_LOWER_BOUND2);
    if (index === -1)
      return OMapping2(null, null, null, null);
    const segment = segments[index];
    if (segment.length === 1)
      return OMapping2(null, null, null, null);
    const { names, resolvedSources } = map;
    return OMapping2(resolvedSources[segment[SOURCES_INDEX2]], segment[SOURCE_LINE2] + 1, segment[SOURCE_COLUMN2], segment.length === 5 ? names[segment[NAMES_INDEX2]] : null);
  };
})();
function OMapping2(source, line, column, name) {
  return { source, line, column, name };
}
function traceSegmentInternal2(segments, memo, line, column, bias) {
  let index = memoizedBinarySearch2(segments, column, memo, line);
  if (found2) {
    index = (bias === LEAST_UPPER_BOUND2 ? upperBound2 : lowerBound2)(segments, column, index);
  } else if (bias === LEAST_UPPER_BOUND2)
    index++;
  if (index === -1 || index === segments.length)
    return -1;
  return index;
}
var CHROME_IE_STACK_REGEXP2 = /^\s*at .*(\S+:\d+|\(native\))/m;
var SAFARI_NATIVE_CODE_REGEXP2 = /^(eval@)?(\[native code])?$/;
var stackIgnorePatterns = [
  "node:internal",
  /\/packages\/\w+\/dist\//,
  /\/@vitest\/\w+\/dist\//,
  "/vitest/dist/",
  "/vitest/src/",
  "/vite-node/dist/",
  "/vite-node/src/",
  "/node_modules/chai/",
  "/node_modules/tinypool/",
  "/node_modules/tinyspy/",
  "/deps/chai.js",
  /__vitest_browser__/
];
function extractLocation2(urlLike) {
  if (!urlLike.includes(":"))
    return [urlLike];
  const regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
  const parts = regExp.exec(urlLike.replace(/^\(|\)$/g, ""));
  if (!parts)
    return [urlLike];
  let url = parts[1];
  if (url.startsWith("http:") || url.startsWith("https:")) {
    const urlObj = new URL(url);
    url = urlObj.pathname;
  }
  if (url.startsWith("/@fs/")) {
    url = url.slice(typeof process !== "undefined" && process.platform === "win32" ? 5 : 4);
  }
  return [url, parts[2] || undefined, parts[3] || undefined];
}
function parseSingleFFOrSafariStack2(raw) {
  let line = raw.trim();
  if (SAFARI_NATIVE_CODE_REGEXP2.test(line))
    return null;
  if (line.includes(" > eval"))
    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ":$1");
  if (!line.includes("@") && !line.includes(":"))
    return null;
  const functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
  const matches = line.match(functionNameRegex);
  const functionName = matches && matches[1] ? matches[1] : undefined;
  const [url, lineNumber, columnNumber] = extractLocation2(line.replace(functionNameRegex, ""));
  if (!url || !lineNumber || !columnNumber)
    return null;
  return {
    file: url,
    method: functionName || "",
    line: Number.parseInt(lineNumber),
    column: Number.parseInt(columnNumber)
  };
}
function parseSingleV8Stack2(raw) {
  let line = raw.trim();
  if (!CHROME_IE_STACK_REGEXP2.test(line))
    return null;
  if (line.includes("(eval "))
    line = line.replace(/eval code/g, "eval").replace(/(\(eval at [^()]*)|(,.*$)/g, "");
  let sanitizedLine = line.replace(/^\s+/, "").replace(/\(eval code/g, "(").replace(/^.*?\s+/, "");
  const location = sanitizedLine.match(/ (\(.+\)$)/);
  sanitizedLine = location ? sanitizedLine.replace(location[0], "") : sanitizedLine;
  const [url, lineNumber, columnNumber] = extractLocation2(location ? location[1] : sanitizedLine);
  let method = location && sanitizedLine || "";
  let file = url && ["eval", "<anonymous>"].includes(url) ? undefined : url;
  if (!file || !lineNumber || !columnNumber)
    return null;
  if (method.startsWith("async "))
    method = method.slice(6);
  if (file.startsWith("file://"))
    file = file.slice(7);
  file = resolve(file);
  if (method)
    method = method.replace(/__vite_ssr_import_\d+__\./g, "");
  return {
    method,
    file,
    line: Number.parseInt(lineNumber),
    column: Number.parseInt(columnNumber)
  };
}
function parseStacktrace(stack, options = {}) {
  const { ignoreStackEntries = stackIgnorePatterns } = options;
  let stacks = !CHROME_IE_STACK_REGEXP2.test(stack) ? parseFFOrSafariStackTrace(stack) : parseV8Stacktrace(stack);
  if (ignoreStackEntries.length)
    stacks = stacks.filter((stack2) => !ignoreStackEntries.some((p) => stack2.file.match(p)));
  return stacks.map((stack2) => {
    var _a;
    const map = (_a = options.getSourceMap) == null ? undefined : _a.call(options, stack2.file);
    if (!map || typeof map !== "object" || !map.version)
      return stack2;
    const traceMap = new TraceMap(map);
    const { line, column } = originalPositionFor2(traceMap, stack2);
    if (line != null && column != null)
      return { ...stack2, line, column };
    return stack2;
  });
}
function parseFFOrSafariStackTrace(stack) {
  return stack.split(`
`).map((line) => parseSingleFFOrSafariStack2(line)).filter(notNullish2);
}
function parseV8Stacktrace(stack) {
  return stack.split(`
`).map((line) => parseSingleV8Stack2(line)).filter(notNullish2);
}
function parseErrorStacktrace(e, options = {}) {
  if (!e || isPrimitive3(e))
    return [];
  if (e.stacks)
    return e.stacks;
  const stackStr = e.stack || e.stackStr || "";
  let stackFrames = parseStacktrace(stackStr, options);
  if (options.frameFilter)
    stackFrames = stackFrames.filter((f2) => options.frameFilter(e, f2) !== false);
  e.stacks = stackFrames;
  return stackFrames;
}
async function saveInlineSnapshots(environment, snapshots) {
  const MagicString2 = (await Promise.resolve().then(() => (init_magic_string_es(), exports_magic_string_es))).default;
  const files = new Set(snapshots.map((i2) => i2.file));
  await Promise.all(Array.from(files).map(async (file) => {
    const snaps = snapshots.filter((i2) => i2.file === file);
    const code = await environment.readSnapshotFile(file);
    const s = new MagicString2(code);
    for (const snap of snaps) {
      const index = positionToOffset(code, snap.line, snap.column);
      replaceInlineSnap(code, s, index, snap.snapshot);
    }
    const transformed = s.toString();
    if (transformed !== code)
      await environment.saveSnapshotFile(file, transformed);
  }));
}
var startObjectRegex = /(?:toMatchInlineSnapshot|toThrowErrorMatchingInlineSnapshot)\s*\(\s*(?:\/\*[\S\s]*\*\/\s*|\/\/.*\s+)*\s*({)/m;
function replaceObjectSnap(code, s, index, newSnap) {
  let _code = code.slice(index);
  const startMatch = startObjectRegex.exec(_code);
  if (!startMatch)
    return false;
  _code = _code.slice(startMatch.index);
  let callEnd = getCallLastIndex2(_code);
  if (callEnd === null)
    return false;
  callEnd += index + startMatch.index;
  const shapeStart = index + startMatch.index + startMatch[0].length;
  const shapeEnd = getObjectShapeEndIndex(code, shapeStart);
  const snap = `, ${prepareSnapString(newSnap, code, index)}`;
  if (shapeEnd === callEnd) {
    s.appendLeft(callEnd, snap);
  } else {
    s.overwrite(shapeEnd, callEnd, snap);
  }
  return true;
}
function getObjectShapeEndIndex(code, index) {
  let startBraces = 1;
  let endBraces = 0;
  while (startBraces !== endBraces && index < code.length) {
    const s = code[index++];
    if (s === "{")
      startBraces++;
    else if (s === "}")
      endBraces++;
  }
  return index;
}
function prepareSnapString(snap, source, index) {
  const lineNumber = offsetToLineNumber(source, index);
  const line = source.split(lineSplitRE)[lineNumber - 1];
  const indent = line.match(/^\s*/)[0] || "";
  const indentNext = indent.includes("\t") ? `${indent}	` : `${indent}  `;
  const lines = snap.trim().replace(/\\/g, "\\\\").split(/\n/g);
  const isOneline = lines.length <= 1;
  const quote = "`";
  if (isOneline)
    return `${quote}${lines.join(`
`).replace(/`/g, "\\`").replace(/\${/g, "\\${")}${quote}`;
  return `${quote}
${lines.map((i2) => i2 ? indentNext + i2 : "").join(`
`).replace(/`/g, "\\`").replace(/\${/g, "\\${")}
${indent}${quote}`;
}
var startRegex = /(?:toMatchInlineSnapshot|toThrowErrorMatchingInlineSnapshot)\s*\(\s*(?:\/\*[\S\s]*\*\/\s*|\/\/.*\s+)*\s*[\w_$]*(['"`\)])/m;
function replaceInlineSnap(code, s, index, newSnap) {
  const codeStartingAtIndex = code.slice(index);
  const startMatch = startRegex.exec(codeStartingAtIndex);
  const firstKeywordMatch = /toMatchInlineSnapshot|toThrowErrorMatchingInlineSnapshot/.exec(codeStartingAtIndex);
  if (!startMatch || startMatch.index !== (firstKeywordMatch == null ? undefined : firstKeywordMatch.index))
    return replaceObjectSnap(code, s, index, newSnap);
  const quote = startMatch[1];
  const startIndex = index + startMatch.index + startMatch[0].length;
  const snapString = prepareSnapString(newSnap, code, index);
  if (quote === ")") {
    s.appendRight(startIndex - 1, snapString);
    return true;
  }
  const quoteEndRE = new RegExp(`(?:^|[^\\\\])${quote}`);
  const endMatch = quoteEndRE.exec(code.slice(startIndex));
  if (!endMatch)
    return false;
  const endIndex = startIndex + endMatch.index + endMatch[0].length;
  s.overwrite(startIndex - 1, endIndex, snapString);
  return true;
}
var INDENTATION_REGEX = /^([^\S\n]*)\S/m;
function stripSnapshotIndentation(inlineSnapshot) {
  const match = inlineSnapshot.match(INDENTATION_REGEX);
  if (!match || !match[1]) {
    return inlineSnapshot;
  }
  const indentation = match[1];
  const lines = inlineSnapshot.split(/\n/g);
  if (lines.length <= 2) {
    return inlineSnapshot;
  }
  if (lines[0].trim() !== "" || lines[lines.length - 1].trim() !== "") {
    return inlineSnapshot;
  }
  for (let i2 = 1;i2 < lines.length - 1; i2++) {
    if (lines[i2] !== "") {
      if (lines[i2].indexOf(indentation) !== 0) {
        return inlineSnapshot;
      }
      lines[i2] = lines[i2].substring(indentation.length);
    }
  }
  lines[lines.length - 1] = "";
  inlineSnapshot = lines.join(`
`);
  return inlineSnapshot;
}
async function saveRawSnapshots(environment, snapshots) {
  await Promise.all(snapshots.map(async (snap) => {
    if (!snap.readonly)
      await environment.saveSnapshotFile(snap.file, snap.snapshot);
  }));
}

class SnapshotState {
  constructor(testFilePath, snapshotPath, snapshotContent, options) {
    this.testFilePath = testFilePath;
    this.snapshotPath = snapshotPath;
    const { data, dirty } = getSnapshotData(snapshotContent, options);
    this._fileExists = snapshotContent != null;
    this._initialData = data;
    this._snapshotData = data;
    this._dirty = dirty;
    this._inlineSnapshots = [];
    this._rawSnapshots = [];
    this._uncheckedKeys = new Set(Object.keys(this._snapshotData));
    this._counters = /* @__PURE__ */ new Map;
    this.expand = options.expand || false;
    this.added = 0;
    this.matched = 0;
    this.unmatched = 0;
    this._updateSnapshot = options.updateSnapshot;
    this.updated = 0;
    this._snapshotFormat = {
      printBasicPrototype: false,
      escapeString: false,
      ...options.snapshotFormat
    };
    this._environment = options.snapshotEnvironment;
  }
  _counters;
  _dirty;
  _updateSnapshot;
  _snapshotData;
  _initialData;
  _inlineSnapshots;
  _rawSnapshots;
  _uncheckedKeys;
  _snapshotFormat;
  _environment;
  _fileExists;
  added;
  expand;
  matched;
  unmatched;
  updated;
  static async create(testFilePath, options) {
    const snapshotPath = await options.snapshotEnvironment.resolvePath(testFilePath);
    const content = await options.snapshotEnvironment.readSnapshotFile(snapshotPath);
    return new SnapshotState(testFilePath, snapshotPath, content, options);
  }
  get environment() {
    return this._environment;
  }
  markSnapshotsAsCheckedForTest(testName) {
    this._uncheckedKeys.forEach((uncheckedKey) => {
      if (keyToTestName(uncheckedKey) === testName)
        this._uncheckedKeys.delete(uncheckedKey);
    });
  }
  _inferInlineSnapshotStack(stacks) {
    const promiseIndex = stacks.findIndex((i2) => i2.method.match(/__VITEST_(RESOLVES|REJECTS)__/));
    if (promiseIndex !== -1)
      return stacks[promiseIndex + 3];
    const stackIndex = stacks.findIndex((i2) => i2.method.includes("__INLINE_SNAPSHOT__"));
    return stackIndex !== -1 ? stacks[stackIndex + 2] : null;
  }
  _addSnapshot(key, receivedSerialized, options) {
    this._dirty = true;
    if (options.isInline) {
      const stacks = parseErrorStacktrace(options.error || new Error("snapshot"), { ignoreStackEntries: [] });
      const stack = this._inferInlineSnapshotStack(stacks);
      if (!stack) {
        throw new Error(`@vitest/snapshot: Couldn't infer stack frame for inline snapshot.
${JSON.stringify(stacks)}`);
      }
      stack.column--;
      this._inlineSnapshots.push({
        snapshot: receivedSerialized,
        ...stack
      });
    } else if (options.rawSnapshot) {
      this._rawSnapshots.push({
        ...options.rawSnapshot,
        snapshot: receivedSerialized
      });
    } else {
      this._snapshotData[key] = receivedSerialized;
    }
  }
  clear() {
    this._snapshotData = this._initialData;
    this._counters = /* @__PURE__ */ new Map;
    this.added = 0;
    this.matched = 0;
    this.unmatched = 0;
    this.updated = 0;
    this._dirty = false;
  }
  async save() {
    const hasExternalSnapshots = Object.keys(this._snapshotData).length;
    const hasInlineSnapshots = this._inlineSnapshots.length;
    const hasRawSnapshots = this._rawSnapshots.length;
    const isEmpty = !hasExternalSnapshots && !hasInlineSnapshots && !hasRawSnapshots;
    const status = {
      deleted: false,
      saved: false
    };
    if ((this._dirty || this._uncheckedKeys.size) && !isEmpty) {
      if (hasExternalSnapshots) {
        await saveSnapshotFile(this._environment, this._snapshotData, this.snapshotPath);
        this._fileExists = true;
      }
      if (hasInlineSnapshots)
        await saveInlineSnapshots(this._environment, this._inlineSnapshots);
      if (hasRawSnapshots)
        await saveRawSnapshots(this._environment, this._rawSnapshots);
      status.saved = true;
    } else if (!hasExternalSnapshots && this._fileExists) {
      if (this._updateSnapshot === "all") {
        await this._environment.removeSnapshotFile(this.snapshotPath);
        this._fileExists = false;
      }
      status.deleted = true;
    }
    return status;
  }
  getUncheckedCount() {
    return this._uncheckedKeys.size || 0;
  }
  getUncheckedKeys() {
    return Array.from(this._uncheckedKeys);
  }
  removeUncheckedKeys() {
    if (this._updateSnapshot === "all" && this._uncheckedKeys.size) {
      this._dirty = true;
      this._uncheckedKeys.forEach((key) => delete this._snapshotData[key]);
      this._uncheckedKeys.clear();
    }
  }
  match({
    testName,
    received,
    key,
    inlineSnapshot,
    isInline,
    error,
    rawSnapshot
  }) {
    this._counters.set(testName, (this._counters.get(testName) || 0) + 1);
    const count = Number(this._counters.get(testName));
    if (!key)
      key = testNameToKey(testName, count);
    if (!(isInline && this._snapshotData[key] !== undefined))
      this._uncheckedKeys.delete(key);
    let receivedSerialized = rawSnapshot && typeof received === "string" ? received : serialize(received, undefined, this._snapshotFormat);
    if (!rawSnapshot)
      receivedSerialized = addExtraLineBreaks(receivedSerialized);
    if (rawSnapshot) {
      if (rawSnapshot.content && rawSnapshot.content.match(/\r\n/) && !receivedSerialized.match(/\r\n/))
        rawSnapshot.content = normalizeNewlines(rawSnapshot.content);
    }
    const expected = isInline ? inlineSnapshot : rawSnapshot ? rawSnapshot.content : this._snapshotData[key];
    const expectedTrimmed = prepareExpected(expected);
    const pass = expectedTrimmed === prepareExpected(receivedSerialized);
    const hasSnapshot = expected !== undefined;
    const snapshotIsPersisted = isInline || this._fileExists || rawSnapshot && rawSnapshot.content != null;
    if (pass && !isInline && !rawSnapshot) {
      this._snapshotData[key] = receivedSerialized;
    }
    if (hasSnapshot && this._updateSnapshot === "all" || (!hasSnapshot || !snapshotIsPersisted) && (this._updateSnapshot === "new" || this._updateSnapshot === "all")) {
      if (this._updateSnapshot === "all") {
        if (!pass) {
          if (hasSnapshot)
            this.updated++;
          else
            this.added++;
          this._addSnapshot(key, receivedSerialized, { error, isInline, rawSnapshot });
        } else {
          this.matched++;
        }
      } else {
        this._addSnapshot(key, receivedSerialized, { error, isInline, rawSnapshot });
        this.added++;
      }
      return {
        actual: "",
        count,
        expected: "",
        key,
        pass: true
      };
    } else {
      if (!pass) {
        this.unmatched++;
        return {
          actual: removeExtraLineBreaks(receivedSerialized),
          count,
          expected: expectedTrimmed !== undefined ? removeExtraLineBreaks(expectedTrimmed) : undefined,
          key,
          pass: false
        };
      } else {
        this.matched++;
        return {
          actual: "",
          count,
          expected: "",
          key,
          pass: true
        };
      }
    }
  }
  async pack() {
    const snapshot = {
      filepath: this.testFilePath,
      added: 0,
      fileDeleted: false,
      matched: 0,
      unchecked: 0,
      uncheckedKeys: [],
      unmatched: 0,
      updated: 0
    };
    const uncheckedCount = this.getUncheckedCount();
    const uncheckedKeys = this.getUncheckedKeys();
    if (uncheckedCount)
      this.removeUncheckedKeys();
    const status = await this.save();
    snapshot.fileDeleted = status.deleted;
    snapshot.added = this.added;
    snapshot.matched = this.matched;
    snapshot.unmatched = this.unmatched;
    snapshot.updated = this.updated;
    snapshot.unchecked = !status.deleted ? uncheckedCount : 0;
    snapshot.uncheckedKeys = Array.from(uncheckedKeys);
    return snapshot;
  }
}
function createMismatchError(message, expand, actual, expected) {
  const error = new Error(message);
  Object.defineProperty(error, "actual", {
    value: actual,
    enumerable: true,
    configurable: true,
    writable: true
  });
  Object.defineProperty(error, "expected", {
    value: expected,
    enumerable: true,
    configurable: true,
    writable: true
  });
  Object.defineProperty(error, "diffOptions", { value: { expand } });
  return error;
}

class SnapshotClient {
  constructor(options = {}) {
    this.options = options;
  }
  filepath;
  name;
  snapshotState;
  snapshotStateMap = /* @__PURE__ */ new Map;
  async startCurrentRun(filepath, name, options) {
    var _a;
    this.filepath = filepath;
    this.name = name;
    if (((_a = this.snapshotState) == null ? undefined : _a.testFilePath) !== filepath) {
      await this.finishCurrentRun();
      if (!this.getSnapshotState(filepath)) {
        this.snapshotStateMap.set(filepath, await SnapshotState.create(filepath, options));
      }
      this.snapshotState = this.getSnapshotState(filepath);
    }
  }
  getSnapshotState(filepath) {
    return this.snapshotStateMap.get(filepath);
  }
  clearTest() {
    this.filepath = undefined;
    this.name = undefined;
  }
  skipTestSnapshots(name) {
    var _a;
    (_a = this.snapshotState) == null || _a.markSnapshotsAsCheckedForTest(name);
  }
  assert(options) {
    var _a, _b, _c, _d;
    const {
      filepath = this.filepath,
      name = this.name,
      message,
      isInline = false,
      properties,
      inlineSnapshot,
      error,
      errorMessage,
      rawSnapshot
    } = options;
    let { received } = options;
    if (!filepath)
      throw new Error("Snapshot cannot be used outside of test");
    if (typeof properties === "object") {
      if (typeof received !== "object" || !received)
        throw new Error("Received value must be an object when the matcher has properties");
      try {
        const pass2 = ((_b = (_a = this.options).isEqual) == null ? undefined : _b.call(_a, received, properties)) ?? false;
        if (!pass2)
          throw createMismatchError("Snapshot properties mismatched", (_c = this.snapshotState) == null ? undefined : _c.expand, received, properties);
        else
          received = deepMergeSnapshot(received, properties);
      } catch (err) {
        err.message = errorMessage || "Snapshot mismatched";
        throw err;
      }
    }
    const testName = [
      name,
      ...message ? [message] : []
    ].join(" > ");
    const snapshotState = this.getSnapshotState(filepath);
    const { actual, expected, key, pass } = snapshotState.match({
      testName,
      received,
      isInline,
      error,
      inlineSnapshot,
      rawSnapshot
    });
    if (!pass)
      throw createMismatchError(`Snapshot \`${key || "unknown"}\` mismatched`, (_d = this.snapshotState) == null ? undefined : _d.expand, actual == null ? undefined : actual.trim(), expected == null ? undefined : expected.trim());
  }
  async assertRaw(options) {
    if (!options.rawSnapshot)
      throw new Error("Raw snapshot is required");
    const {
      filepath = this.filepath,
      rawSnapshot
    } = options;
    if (rawSnapshot.content == null) {
      if (!filepath)
        throw new Error("Snapshot cannot be used outside of test");
      const snapshotState = this.getSnapshotState(filepath);
      options.filepath || (options.filepath = filepath);
      rawSnapshot.file = await snapshotState.environment.resolveRawPath(filepath, rawSnapshot.file);
      rawSnapshot.content = await snapshotState.environment.readSnapshotFile(rawSnapshot.file) || undefined;
    }
    return this.assert(options);
  }
  async finishCurrentRun() {
    if (!this.snapshotState)
      return null;
    const result = await this.snapshotState.pack();
    this.snapshotState = undefined;
    return result;
  }
  clear() {
    this.snapshotStateMap.clear();
  }
}

// node_modules/vitest/dist/vendor/tasks.IknbGB2n.js
function getFullName(task, separator = " > ") {
  return getNames(task).join(separator);
}

// node_modules/vitest/dist/vendor/base.5NT-gWu5.js
function isChildProcess() {
  return typeof process !== "undefined" && !!process.send;
}

// node_modules/vitest/dist/vendor/date.Ns1pGd_X.js
var RealDate = Date;
var now2 = null;

class MockDate extends RealDate {
  constructor(y, m, d, h, M2, s, ms) {
    super();
    let date;
    switch (arguments.length) {
      case 0:
        if (now2 !== null)
          date = new RealDate(now2.valueOf());
        else
          date = new RealDate;
        break;
      case 1:
        date = new RealDate(y);
        break;
      default:
        d = typeof d === "undefined" ? 1 : d;
        h = h || 0;
        M2 = M2 || 0;
        s = s || 0;
        ms = ms || 0;
        date = new RealDate(y, m, d, h, M2, s, ms);
        break;
    }
    Object.setPrototypeOf(date, MockDate.prototype);
    return date;
  }
}
MockDate.UTC = RealDate.UTC;
MockDate.now = function() {
  return new MockDate().valueOf();
};
MockDate.parse = function(dateString) {
  return RealDate.parse(dateString);
};
MockDate.toString = function() {
  return RealDate.toString();
};
function mockDate(date) {
  const dateObj = new RealDate(date.valueOf());
  if (Number.isNaN(dateObj.getTime()))
    throw new TypeError(`mockdate: The time set is an invalid date: ${date}`);
  globalThis.Date = MockDate;
  now2 = dateObj.valueOf();
}
function resetDate() {
  globalThis.Date = RealDate;
}

// node_modules/vitest/dist/vendor/vi.YFlodzP_.js
function resetModules(modules, resetMocks = false) {
  const skipPaths = [
    /\/vitest\/dist\//,
    /\/vite-node\/dist\//,
    /vitest-virtual-\w+\/dist/,
    /@vitest\/dist/,
    ...!resetMocks ? [/^mock:/] : []
  ];
  modules.forEach((mod, path2) => {
    if (skipPaths.some((re) => re.test(path2)))
      return;
    modules.invalidateModule(mod);
  });
}
function waitNextTick() {
  const { setTimeout } = getSafeTimers();
  return new Promise((resolve3) => setTimeout(resolve3, 0));
}
async function waitForImportsToResolve() {
  await waitNextTick();
  const state = getWorkerState();
  const promises = [];
  let resolvingCount = 0;
  for (const mod of state.moduleCache.values()) {
    if (mod.promise && !mod.evaluated)
      promises.push(mod.promise);
    if (mod.resolving)
      resolvingCount++;
  }
  if (!promises.length && !resolvingCount)
    return;
  await Promise.allSettled(promises);
  await waitForImportsToResolve();
}
function commonjsRequire(path2) {
  throw new Error('Could not dynamically require "' + path2 + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var chaiSubset = { exports: {} };
(function(module, exports) {
  (function() {
    (function(chaiSubset2) {
      if (typeof commonjsRequire === "function" && true && true) {
        return module.exports = chaiSubset2;
      } else {
        return chai.use(chaiSubset2);
      }
    })(function(chai3, utils) {
      var Assertion2 = chai3.Assertion;
      var assertionPrototype = Assertion2.prototype;
      Assertion2.addMethod("containSubset", function(expected) {
        var actual = utils.flag(this, "object");
        var showDiff = chai3.config.showDiff;
        assertionPrototype.assert.call(this, compare(expected, actual), "expected #{act} to contain subset #{exp}", "expected #{act} to not contain subset #{exp}", expected, actual, showDiff);
      });
      chai3.assert.containSubset = function(val, exp, msg) {
        new chai3.Assertion(val, msg).to.be.containSubset(exp);
      };
      function compare(expected, actual) {
        if (expected === actual) {
          return true;
        }
        if (typeof actual !== typeof expected) {
          return false;
        }
        if (typeof expected !== "object" || expected === null) {
          return expected === actual;
        }
        if (!!expected && !actual) {
          return false;
        }
        if (Array.isArray(expected)) {
          if (typeof actual.length !== "number") {
            return false;
          }
          var aa = Array.prototype.slice.call(actual);
          return expected.every(function(exp) {
            return aa.some(function(act) {
              return compare(exp, act);
            });
          });
        }
        if (expected instanceof Date) {
          if (actual instanceof Date) {
            return expected.getTime() === actual.getTime();
          } else {
            return false;
          }
        }
        return Object.keys(expected).every(function(key) {
          var eo = expected[key];
          var ao = actual[key];
          if (typeof eo === "object" && eo !== null && ao !== null) {
            return compare(eo, ao);
          }
          if (typeof eo === "function") {
            return eo(ao);
          }
          return ao === eo;
        });
      }
    });
  }).call(commonjsGlobal);
})(chaiSubset);
var chaiSubsetExports = chaiSubset.exports;
var Subset = /* @__PURE__ */ getDefaultExportFromCjs(chaiSubsetExports);
var MATCHERS_OBJECT2 = Symbol.for("matchers-object");
var JEST_MATCHERS_OBJECT2 = Symbol.for("$$jest-matchers-object");
var GLOBAL_EXPECT2 = Symbol.for("expect-global");
var ASYMMETRIC_MATCHERS_OBJECT2 = Symbol.for("asymmetric-matchers-object");
if (!Object.prototype.hasOwnProperty.call(globalThis, MATCHERS_OBJECT2)) {
  const globalState = /* @__PURE__ */ new WeakMap;
  const matchers = /* @__PURE__ */ Object.create(null);
  const customEqualityTesters = [];
  const assymetricMatchers = /* @__PURE__ */ Object.create(null);
  Object.defineProperty(globalThis, MATCHERS_OBJECT2, {
    get: () => globalState
  });
  Object.defineProperty(globalThis, JEST_MATCHERS_OBJECT2, {
    configurable: true,
    get: () => ({
      state: globalState.get(globalThis[GLOBAL_EXPECT2]),
      matchers,
      customEqualityTesters
    })
  });
  Object.defineProperty(globalThis, ASYMMETRIC_MATCHERS_OBJECT2, {
    get: () => assymetricMatchers
  });
}
function recordAsyncExpect2(test3, promise) {
  if (test3 && promise instanceof Promise) {
    promise = promise.finally(() => {
      const index = test3.promises.indexOf(promise);
      if (index !== -1)
        test3.promises.splice(index, 1);
    });
    if (!test3.promises)
      test3.promises = [];
    test3.promises.push(promise);
  }
  return promise;
}
var _client;
function getSnapshotClient() {
  if (!_client) {
    _client = new SnapshotClient({
      isEqual: (received, expected) => {
        return equals(received, expected, [iterableEquality, subsetEquality]);
      }
    });
  }
  return _client;
}
function getError(expected, promise) {
  if (typeof expected !== "function") {
    if (!promise)
      throw new Error(`expected must be a function, received ${typeof expected}`);
    return expected;
  }
  try {
    expected();
  } catch (e) {
    return e;
  }
  throw new Error("snapshot function didn't throw");
}
var SnapshotPlugin = (chai3, utils) => {
  const getTestNames = (test3) => {
    var _a;
    if (!test3)
      return {};
    return {
      filepath: (_a = test3.file) == null ? undefined : _a.filepath,
      name: getNames(test3).slice(1).join(" > ")
    };
  };
  for (const key of ["matchSnapshot", "toMatchSnapshot"]) {
    utils.addMethod(chai3.Assertion.prototype, key, function(properties, message) {
      const isNot = utils.flag(this, "negate");
      if (isNot)
        throw new Error(`${key} cannot be used with "not"`);
      const expected = utils.flag(this, "object");
      const test3 = utils.flag(this, "vitest-test");
      if (typeof properties === "string" && typeof message === "undefined") {
        message = properties;
        properties = undefined;
      }
      const errorMessage = utils.flag(this, "message");
      getSnapshotClient().assert({
        received: expected,
        message,
        isInline: false,
        properties,
        errorMessage,
        ...getTestNames(test3)
      });
    });
  }
  utils.addMethod(chai3.Assertion.prototype, "toMatchFileSnapshot", function(file, message) {
    const isNot = utils.flag(this, "negate");
    if (isNot)
      throw new Error('toMatchFileSnapshot cannot be used with "not"');
    const expected = utils.flag(this, "object");
    const test3 = utils.flag(this, "vitest-test");
    const errorMessage = utils.flag(this, "message");
    const promise = getSnapshotClient().assertRaw({
      received: expected,
      message,
      isInline: false,
      rawSnapshot: {
        file
      },
      errorMessage,
      ...getTestNames(test3)
    });
    return recordAsyncExpect2(test3, promise);
  });
  utils.addMethod(chai3.Assertion.prototype, "toMatchInlineSnapshot", function __INLINE_SNAPSHOT__(properties, inlineSnapshot, message) {
    var _a;
    const isNot = utils.flag(this, "negate");
    if (isNot)
      throw new Error('toMatchInlineSnapshot cannot be used with "not"');
    const test3 = utils.flag(this, "vitest-test");
    const isInsideEach = test3 && (test3.each || ((_a = test3.suite) == null ? undefined : _a.each));
    if (isInsideEach)
      throw new Error("InlineSnapshot cannot be used inside of test.each or describe.each");
    const expected = utils.flag(this, "object");
    const error = utils.flag(this, "error");
    if (typeof properties === "string") {
      message = inlineSnapshot;
      inlineSnapshot = properties;
      properties = undefined;
    }
    if (inlineSnapshot)
      inlineSnapshot = stripSnapshotIndentation(inlineSnapshot);
    const errorMessage = utils.flag(this, "message");
    getSnapshotClient().assert({
      received: expected,
      message,
      isInline: true,
      properties,
      inlineSnapshot,
      error,
      errorMessage,
      ...getTestNames(test3)
    });
  });
  utils.addMethod(chai3.Assertion.prototype, "toThrowErrorMatchingSnapshot", function(message) {
    const isNot = utils.flag(this, "negate");
    if (isNot)
      throw new Error('toThrowErrorMatchingSnapshot cannot be used with "not"');
    const expected = utils.flag(this, "object");
    const test3 = utils.flag(this, "vitest-test");
    const promise = utils.flag(this, "promise");
    const errorMessage = utils.flag(this, "message");
    getSnapshotClient().assert({
      received: getError(expected, promise),
      message,
      errorMessage,
      ...getTestNames(test3)
    });
  });
  utils.addMethod(chai3.Assertion.prototype, "toThrowErrorMatchingInlineSnapshot", function __INLINE_SNAPSHOT__(inlineSnapshot, message) {
    var _a;
    const isNot = utils.flag(this, "negate");
    if (isNot)
      throw new Error('toThrowErrorMatchingInlineSnapshot cannot be used with "not"');
    const test3 = utils.flag(this, "vitest-test");
    const isInsideEach = test3 && (test3.each || ((_a = test3.suite) == null ? undefined : _a.each));
    if (isInsideEach)
      throw new Error("InlineSnapshot cannot be used inside of test.each or describe.each");
    const expected = utils.flag(this, "object");
    const error = utils.flag(this, "error");
    const promise = utils.flag(this, "promise");
    const errorMessage = utils.flag(this, "message");
    if (inlineSnapshot)
      inlineSnapshot = stripSnapshotIndentation(inlineSnapshot);
    getSnapshotClient().assert({
      received: getError(expected, promise),
      message,
      inlineSnapshot,
      isInline: true,
      error,
      errorMessage,
      ...getTestNames(test3)
    });
  });
  utils.addMethod(chai3.expect, "addSnapshotSerializer", addSerializer);
};
use(JestExtend);
use(JestChaiExpect);
use(Subset);
use(SnapshotPlugin);
use(JestAsymmetricMatchers);
function createExpect(test3) {
  var _a;
  const expect2 = (value, message) => {
    const { assertionCalls } = getState(expect2);
    setState({ assertionCalls: assertionCalls + 1, soft: false }, expect2);
    const assert2 = expect(value, message);
    const _test2 = test3 || getCurrentTest();
    if (_test2)
      return assert2.withTest(_test2);
    else
      return assert2;
  };
  Object.assign(expect2, expect);
  Object.assign(expect2, globalThis[ASYMMETRIC_MATCHERS_OBJECT]);
  expect2.getState = () => getState(expect2);
  expect2.setState = (state) => setState(state, expect2);
  const globalState = getState(globalThis[GLOBAL_EXPECT]) || {};
  setState({
    ...globalState,
    assertionCalls: 0,
    isExpectingAssertions: false,
    isExpectingAssertionsError: null,
    expectedAssertionsNumber: null,
    expectedAssertionsNumberErrorGen: null,
    environment: getCurrentEnvironment(),
    testPath: test3 ? (_a = test3.suite.file) == null ? undefined : _a.filepath : globalState.testPath,
    currentTestName: test3 ? getFullName(test3) : globalState.currentTestName
  }, expect2);
  expect2.extend = (matchers) => expect.extend(expect2, matchers);
  expect2.addEqualityTesters = (customTesters) => addCustomEqualityTesters(customTesters);
  expect2.soft = (...args) => {
    const assert2 = expect2(...args);
    expect2.setState({
      soft: true
    });
    return assert2;
  };
  expect2.unreachable = (message) => {
    assert.fail(`expected${message ? ` "${message}" ` : " "}not to be reached`);
  };
  function assertions(expected) {
    const errorGen = () => new Error(`expected number of assertions to be ${expected}, but got ${expect2.getState().assertionCalls}`);
    if (Error.captureStackTrace)
      Error.captureStackTrace(errorGen(), assertions);
    expect2.setState({
      expectedAssertionsNumber: expected,
      expectedAssertionsNumberErrorGen: errorGen
    });
  }
  function hasAssertions() {
    const error = new Error("expected any number of assertion, but got none");
    if (Error.captureStackTrace)
      Error.captureStackTrace(error, hasAssertions);
    expect2.setState({
      isExpectingAssertions: true,
      isExpectingAssertionsError: error
    });
  }
  util.addMethod(expect2, "assertions", assertions);
  util.addMethod(expect2, "hasAssertions", hasAssertions);
  return expect2;
}
var globalExpect = createExpect();
Object.defineProperty(globalThis, GLOBAL_EXPECT, {
  value: globalExpect,
  writable: true,
  configurable: true
});
var globalObject$1;
if (typeof commonjsGlobal !== "undefined") {
  globalObject$1 = commonjsGlobal;
} else if (typeof window !== "undefined") {
  globalObject$1 = window;
} else {
  globalObject$1 = self;
}
var global2 = globalObject$1;
var throwsOnProto$1;
try {
  const object = {};
  object.__proto__;
  throwsOnProto$1 = false;
} catch (_) {
  throwsOnProto$1 = true;
}
var throwsOnProto_1 = throwsOnProto$1;
var call = Function.call;
var throwsOnProto = throwsOnProto_1;
var disallowedProperties = [
  "size",
  "caller",
  "callee",
  "arguments"
];
if (throwsOnProto) {
  disallowedProperties.push("__proto__");
}
var copyPrototypeMethods = function copyPrototypeMethods2(prototype) {
  return Object.getOwnPropertyNames(prototype).reduce(function(result, name) {
    if (disallowedProperties.includes(name)) {
      return result;
    }
    if (typeof prototype[name] !== "function") {
      return result;
    }
    result[name] = call.bind(prototype[name]);
    return result;
  }, Object.create(null));
};
var copyPrototype$5 = copyPrototypeMethods;
var array = copyPrototype$5(Array.prototype);
var every$1 = array.every;
function hasCallsLeft(callMap, spy) {
  if (callMap[spy.id] === undefined) {
    callMap[spy.id] = 0;
  }
  return callMap[spy.id] < spy.callCount;
}
function checkAdjacentCalls(callMap, spy, index, spies) {
  var calledBeforeNext = true;
  if (index !== spies.length - 1) {
    calledBeforeNext = spy.calledBefore(spies[index + 1]);
  }
  if (hasCallsLeft(callMap, spy) && calledBeforeNext) {
    callMap[spy.id] += 1;
    return true;
  }
  return false;
}
function calledInOrder(spies) {
  var callMap = {};
  var _spies = arguments.length > 1 ? arguments : spies;
  return every$1(_spies, checkAdjacentCalls.bind(null, callMap));
}
var calledInOrder_1 = calledInOrder;
var functionName$1 = function functionName(func) {
  if (!func) {
    return "";
  }
  try {
    return func.displayName || func.name || (String(func).match(/function ([^\s(]+)/) || [])[1];
  } catch (e) {
    return "";
  }
};
var functionName2 = functionName$1;
function className(value) {
  return value.constructor && value.constructor.name || typeof value.constructor === "function" && functionName2(value.constructor) || null;
}
var className_1 = className;
var deprecated = {};
(function(exports) {
  exports.wrap = function(func, msg) {
    var wrapped = function() {
      exports.printWarning(msg);
      return func.apply(this, arguments);
    };
    if (func.prototype) {
      wrapped.prototype = func.prototype;
    }
    return wrapped;
  };
  exports.defaultMsg = function(packageName, funcName) {
    return `${packageName}.${funcName} is deprecated and will be removed from the public API in a future version of ${packageName}.`;
  };
  exports.printWarning = function(msg) {
    if (typeof process === "object" && process.emitWarning) {
      process.emitWarning(msg);
    } else if (console.info) {
      console.info(msg);
    } else {
      console.log(msg);
    }
  };
})(deprecated);
var every = function every2(obj, fn2) {
  var pass = true;
  try {
    obj.forEach(function() {
      if (!fn2.apply(this, arguments)) {
        throw new Error;
      }
    });
  } catch (e) {
    pass = false;
  }
  return pass;
};
var sort3 = array.sort;
var slice = array.slice;
function comparator(a, b2) {
  var aCall = a.getCall(0);
  var bCall = b2.getCall(0);
  var aId = aCall && aCall.callId || -1;
  var bId = bCall && bCall.callId || -1;
  return aId < bId ? -1 : 1;
}
function orderByFirstCall(spies) {
  return sort3(slice(spies), comparator);
}
var orderByFirstCall_1 = orderByFirstCall;
var copyPrototype$4 = copyPrototypeMethods;
var _function = copyPrototype$4(Function.prototype);
var copyPrototype$3 = copyPrototypeMethods;
var map = copyPrototype$3(Map.prototype);
var copyPrototype$2 = copyPrototypeMethods;
var object = copyPrototype$2(Object.prototype);
var copyPrototype$1 = copyPrototypeMethods;
var set = copyPrototype$1(Set.prototype);
var copyPrototype = copyPrototypeMethods;
var string2 = copyPrototype(String.prototype);
var prototypes = {
  array,
  function: _function,
  map,
  object,
  set,
  string: string2
};
var typeDetect = { exports: {} };
(function(module, exports) {
  (function(global3, factory) {
    module.exports = factory();
  })(commonjsGlobal, function() {
    var promiseExists = typeof Promise === "function";
    var globalObject = typeof self === "object" ? self : commonjsGlobal;
    var symbolExists = typeof Symbol !== "undefined";
    var mapExists = typeof Map !== "undefined";
    var setExists = typeof Set !== "undefined";
    var weakMapExists = typeof WeakMap !== "undefined";
    var weakSetExists = typeof WeakSet !== "undefined";
    var dataViewExists = typeof DataView !== "undefined";
    var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== "undefined";
    var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== "undefined";
    var setEntriesExists = setExists && typeof Set.prototype.entries === "function";
    var mapEntriesExists = mapExists && typeof Map.prototype.entries === "function";
    var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());
    var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());
    var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === "function";
    var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
    var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === "function";
    var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(""[Symbol.iterator]());
    var toStringLeftSliceLength = 8;
    var toStringRightSliceLength = -1;
    function typeDetect2(obj) {
      var typeofObj = typeof obj;
      if (typeofObj !== "object") {
        return typeofObj;
      }
      if (obj === null) {
        return "null";
      }
      if (obj === globalObject) {
        return "global";
      }
      if (Array.isArray(obj) && (symbolToStringTagExists === false || !(Symbol.toStringTag in obj))) {
        return "Array";
      }
      if (typeof window === "object" && window !== null) {
        if (typeof window.location === "object" && obj === window.location) {
          return "Location";
        }
        if (typeof window.document === "object" && obj === window.document) {
          return "Document";
        }
        if (typeof window.navigator === "object") {
          if (typeof window.navigator.mimeTypes === "object" && obj === window.navigator.mimeTypes) {
            return "MimeTypeArray";
          }
          if (typeof window.navigator.plugins === "object" && obj === window.navigator.plugins) {
            return "PluginArray";
          }
        }
        if ((typeof window.HTMLElement === "function" || typeof window.HTMLElement === "object") && obj instanceof window.HTMLElement) {
          if (obj.tagName === "BLOCKQUOTE") {
            return "HTMLQuoteElement";
          }
          if (obj.tagName === "TD") {
            return "HTMLTableDataCellElement";
          }
          if (obj.tagName === "TH") {
            return "HTMLTableHeaderCellElement";
          }
        }
      }
      var stringTag = symbolToStringTagExists && obj[Symbol.toStringTag];
      if (typeof stringTag === "string") {
        return stringTag;
      }
      var objPrototype = Object.getPrototypeOf(obj);
      if (objPrototype === RegExp.prototype) {
        return "RegExp";
      }
      if (objPrototype === Date.prototype) {
        return "Date";
      }
      if (promiseExists && objPrototype === Promise.prototype) {
        return "Promise";
      }
      if (setExists && objPrototype === Set.prototype) {
        return "Set";
      }
      if (mapExists && objPrototype === Map.prototype) {
        return "Map";
      }
      if (weakSetExists && objPrototype === WeakSet.prototype) {
        return "WeakSet";
      }
      if (weakMapExists && objPrototype === WeakMap.prototype) {
        return "WeakMap";
      }
      if (dataViewExists && objPrototype === DataView.prototype) {
        return "DataView";
      }
      if (mapExists && objPrototype === mapIteratorPrototype) {
        return "Map Iterator";
      }
      if (setExists && objPrototype === setIteratorPrototype) {
        return "Set Iterator";
      }
      if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
        return "Array Iterator";
      }
      if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
        return "String Iterator";
      }
      if (objPrototype === null) {
        return "Object";
      }
      return Object.prototype.toString.call(obj).slice(toStringLeftSliceLength, toStringRightSliceLength);
    }
    return typeDetect2;
  });
})(typeDetect);
var typeDetectExports = typeDetect.exports;
var type = typeDetectExports;
var typeOf = function typeOf2(value) {
  return type(value).toLowerCase();
};
function valueToString(value) {
  if (value && value.toString) {
    return value.toString();
  }
  return String(value);
}
var valueToString_1 = valueToString;
var lib = {
  global: global2,
  calledInOrder: calledInOrder_1,
  className: className_1,
  deprecated,
  every,
  functionName: functionName$1,
  orderByFirstCall: orderByFirstCall_1,
  prototypes,
  typeOf,
  valueToString: valueToString_1
};
var globalObject = lib.global;
var timersModule;
if (typeof __vitest_required__ !== "undefined") {
  try {
    timersModule = __vitest_required__.timers;
  } catch (e) {}
}
function withGlobal(_global) {
  const maxTimeout = Math.pow(2, 31) - 1;
  const idCounterStart = 1000000000000;
  const NOOP = function() {
    return;
  };
  const NOOP_ARRAY = function() {
    return [];
  };
  const timeoutResult = _global.setTimeout(NOOP, 0);
  const addTimerReturnsObject = typeof timeoutResult === "object";
  const hrtimePresent = _global.process && typeof _global.process.hrtime === "function";
  const hrtimeBigintPresent = hrtimePresent && typeof _global.process.hrtime.bigint === "function";
  const nextTickPresent = _global.process && typeof _global.process.nextTick === "function";
  const utilPromisify = _global.process && _global.__vitest_required__ && _global.__vitest_required__.util.promisify;
  const performancePresent = _global.performance && typeof _global.performance.now === "function";
  const hasPerformancePrototype = _global.Performance && (typeof _global.Performance).match(/^(function|object)$/);
  const hasPerformanceConstructorPrototype = _global.performance && _global.performance.constructor && _global.performance.constructor.prototype;
  const queueMicrotaskPresent = _global.hasOwnProperty("queueMicrotask");
  const requestAnimationFramePresent = _global.requestAnimationFrame && typeof _global.requestAnimationFrame === "function";
  const cancelAnimationFramePresent = _global.cancelAnimationFrame && typeof _global.cancelAnimationFrame === "function";
  const requestIdleCallbackPresent = _global.requestIdleCallback && typeof _global.requestIdleCallback === "function";
  const cancelIdleCallbackPresent = _global.cancelIdleCallback && typeof _global.cancelIdleCallback === "function";
  const setImmediatePresent = _global.setImmediate && typeof _global.setImmediate === "function";
  const intlPresent = _global.Intl && typeof _global.Intl === "object";
  _global.clearTimeout(timeoutResult);
  const NativeDate = _global.Date;
  const NativeIntl = _global.Intl;
  let uniqueTimerId = idCounterStart;
  function isNumberFinite(num) {
    if (Number.isFinite) {
      return Number.isFinite(num);
    }
    return isFinite(num);
  }
  let isNearInfiniteLimit = false;
  function checkIsNearInfiniteLimit(clock, i2) {
    if (clock.loopLimit && i2 === clock.loopLimit - 1) {
      isNearInfiniteLimit = true;
    }
  }
  function resetIsNearInfiniteLimit() {
    isNearInfiniteLimit = false;
  }
  function parseTime(str) {
    if (!str) {
      return 0;
    }
    const strings = str.split(":");
    const l = strings.length;
    let i2 = l;
    let ms = 0;
    let parsed;
    if (l > 3 || !/^(\d\d:){0,2}\d\d?$/.test(str)) {
      throw new Error("tick only understands numbers, 'm:s' and 'h:m:s'. Each part must be two digits");
    }
    while (i2--) {
      parsed = parseInt(strings[i2], 10);
      if (parsed >= 60) {
        throw new Error(`Invalid time ${str}`);
      }
      ms += parsed * Math.pow(60, l - i2 - 1);
    }
    return ms * 1000;
  }
  function nanoRemainder(msFloat) {
    const modulo = 1e6;
    const remainder = msFloat * 1e6 % modulo;
    const positiveRemainder = remainder < 0 ? remainder + modulo : remainder;
    return Math.floor(positiveRemainder);
  }
  function getEpoch(epoch) {
    if (!epoch) {
      return 0;
    }
    if (typeof epoch.getTime === "function") {
      return epoch.getTime();
    }
    if (typeof epoch === "number") {
      return epoch;
    }
    throw new TypeError("now should be milliseconds since UNIX epoch");
  }
  function inRange(from, to, timer) {
    return timer && timer.callAt >= from && timer.callAt <= to;
  }
  function getInfiniteLoopError(clock, job) {
    const infiniteLoopError = new Error(`Aborting after running ${clock.loopLimit} timers, assuming an infinite loop!`);
    if (!job.error) {
      return infiniteLoopError;
    }
    const computedTargetPattern = /target\.*[<|(|[].*?[>|\]|)]\s*/;
    let clockMethodPattern = new RegExp(String(Object.keys(clock).join("|")));
    if (addTimerReturnsObject) {
      clockMethodPattern = new RegExp(`\\s+at (Object\\.)?(?:${Object.keys(clock).join("|")})\\s+`);
    }
    let matchedLineIndex = -1;
    job.error.stack.split(`
`).some(function(line, i2) {
      const matchedComputedTarget = line.match(computedTargetPattern);
      if (matchedComputedTarget) {
        matchedLineIndex = i2;
        return true;
      }
      const matchedClockMethod = line.match(clockMethodPattern);
      if (matchedClockMethod) {
        matchedLineIndex = i2;
        return false;
      }
      return matchedLineIndex >= 0;
    });
    const stack = `${infiniteLoopError}
${job.type || "Microtask"} - ${job.func.name || "anonymous"}
${job.error.stack.split(`
`).slice(matchedLineIndex + 1).join(`
`)}`;
    try {
      Object.defineProperty(infiniteLoopError, "stack", {
        value: stack
      });
    } catch (e) {}
    return infiniteLoopError;
  }
  function mirrorDateProperties(target, source) {
    let prop;
    for (prop in source) {
      if (source.hasOwnProperty(prop)) {
        target[prop] = source[prop];
      }
    }
    if (source.now) {
      target.now = function now() {
        return target.clock.now;
      };
    } else {
      delete target.now;
    }
    if (source.toSource) {
      target.toSource = function toSource() {
        return source.toSource();
      };
    } else {
      delete target.toSource;
    }
    target.toString = function toString() {
      return source.toString();
    };
    target.prototype = source.prototype;
    target.parse = source.parse;
    target.UTC = source.UTC;
    target.prototype.toUTCString = source.prototype.toUTCString;
    target.isFake = true;
    return target;
  }
  function createDate() {
    function ClockDate(year, month, date, hour, minute, second, ms) {
      if (!(this instanceof ClockDate)) {
        return new NativeDate(ClockDate.clock.now).toString();
      }
      switch (arguments.length) {
        case 0:
          return new NativeDate(ClockDate.clock.now);
        case 1:
          return new NativeDate(year);
        case 2:
          return new NativeDate(year, month);
        case 3:
          return new NativeDate(year, month, date);
        case 4:
          return new NativeDate(year, month, date, hour);
        case 5:
          return new NativeDate(year, month, date, hour, minute);
        case 6:
          return new NativeDate(year, month, date, hour, minute, second);
        default:
          return new NativeDate(year, month, date, hour, minute, second, ms);
      }
    }
    return mirrorDateProperties(ClockDate, NativeDate);
  }
  function createIntl() {
    const ClockIntl = { ...NativeIntl };
    ClockIntl.DateTimeFormat = function(...args) {
      const realFormatter = new NativeIntl.DateTimeFormat(...args);
      const formatter = {};
      ["formatRange", "formatRangeToParts", "resolvedOptions"].forEach((method) => {
        formatter[method] = realFormatter[method].bind(realFormatter);
      });
      ["format", "formatToParts"].forEach((method) => {
        formatter[method] = function(date) {
          return realFormatter[method](date || ClockIntl.clock.now);
        };
      });
      return formatter;
    };
    ClockIntl.DateTimeFormat.prototype = Object.create(NativeIntl.DateTimeFormat.prototype);
    ClockIntl.DateTimeFormat.supportedLocalesOf = NativeIntl.DateTimeFormat.supportedLocalesOf;
    return ClockIntl;
  }
  function enqueueJob(clock, job) {
    if (!clock.jobs) {
      clock.jobs = [];
    }
    clock.jobs.push(job);
  }
  function runJobs(clock) {
    if (!clock.jobs) {
      return;
    }
    for (let i2 = 0;i2 < clock.jobs.length; i2++) {
      const job = clock.jobs[i2];
      job.func.apply(null, job.args);
      checkIsNearInfiniteLimit(clock, i2);
      if (clock.loopLimit && i2 > clock.loopLimit) {
        throw getInfiniteLoopError(clock, job);
      }
    }
    resetIsNearInfiniteLimit();
    clock.jobs = [];
  }
  function addTimer(clock, timer) {
    if (timer.func === undefined) {
      throw new Error("Callback must be provided to timer calls");
    }
    if (addTimerReturnsObject) {
      if (typeof timer.func !== "function") {
        throw new TypeError(`[ERR_INVALID_CALLBACK]: Callback must be a function. Received ${timer.func} of type ${typeof timer.func}`);
      }
    }
    if (isNearInfiniteLimit) {
      timer.error = new Error;
    }
    timer.type = timer.immediate ? "Immediate" : "Timeout";
    if (timer.hasOwnProperty("delay")) {
      if (typeof timer.delay !== "number") {
        timer.delay = parseInt(timer.delay, 10);
      }
      if (!isNumberFinite(timer.delay)) {
        timer.delay = 0;
      }
      timer.delay = timer.delay > maxTimeout ? 1 : timer.delay;
      timer.delay = Math.max(0, timer.delay);
    }
    if (timer.hasOwnProperty("interval")) {
      timer.type = "Interval";
      timer.interval = timer.interval > maxTimeout ? 1 : timer.interval;
    }
    if (timer.hasOwnProperty("animation")) {
      timer.type = "AnimationFrame";
      timer.animation = true;
    }
    if (timer.hasOwnProperty("idleCallback")) {
      timer.type = "IdleCallback";
      timer.idleCallback = true;
    }
    if (!clock.timers) {
      clock.timers = {};
    }
    timer.id = uniqueTimerId++;
    timer.createdAt = clock.now;
    timer.callAt = clock.now + (parseInt(timer.delay) || (clock.duringTick ? 1 : 0));
    clock.timers[timer.id] = timer;
    if (addTimerReturnsObject) {
      const res = {
        refed: true,
        ref: function() {
          this.refed = true;
          return res;
        },
        unref: function() {
          this.refed = false;
          return res;
        },
        hasRef: function() {
          return this.refed;
        },
        refresh: function() {
          timer.callAt = clock.now + (parseInt(timer.delay) || (clock.duringTick ? 1 : 0));
          clock.timers[timer.id] = timer;
          return res;
        },
        [Symbol.toPrimitive]: function() {
          return timer.id;
        }
      };
      return res;
    }
    return timer.id;
  }
  function compareTimers(a, b2) {
    if (a.callAt < b2.callAt) {
      return -1;
    }
    if (a.callAt > b2.callAt) {
      return 1;
    }
    if (a.immediate && !b2.immediate) {
      return -1;
    }
    if (!a.immediate && b2.immediate) {
      return 1;
    }
    if (a.createdAt < b2.createdAt) {
      return -1;
    }
    if (a.createdAt > b2.createdAt) {
      return 1;
    }
    if (a.id < b2.id) {
      return -1;
    }
    if (a.id > b2.id) {
      return 1;
    }
  }
  function firstTimerInRange(clock, from, to) {
    const timers2 = clock.timers;
    let timer = null;
    let id, isInRange;
    for (id in timers2) {
      if (timers2.hasOwnProperty(id)) {
        isInRange = inRange(from, to, timers2[id]);
        if (isInRange && (!timer || compareTimers(timer, timers2[id]) === 1)) {
          timer = timers2[id];
        }
      }
    }
    return timer;
  }
  function firstTimer(clock) {
    const timers2 = clock.timers;
    let timer = null;
    let id;
    for (id in timers2) {
      if (timers2.hasOwnProperty(id)) {
        if (!timer || compareTimers(timer, timers2[id]) === 1) {
          timer = timers2[id];
        }
      }
    }
    return timer;
  }
  function lastTimer(clock) {
    const timers2 = clock.timers;
    let timer = null;
    let id;
    for (id in timers2) {
      if (timers2.hasOwnProperty(id)) {
        if (!timer || compareTimers(timer, timers2[id]) === -1) {
          timer = timers2[id];
        }
      }
    }
    return timer;
  }
  function callTimer(clock, timer) {
    if (typeof timer.interval === "number") {
      clock.timers[timer.id].callAt += timer.interval;
    } else {
      delete clock.timers[timer.id];
    }
    if (typeof timer.func === "function") {
      timer.func.apply(null, timer.args);
    } else {
      const eval2 = eval;
      (function() {
        eval2(timer.func);
      })();
    }
  }
  function getClearHandler(ttype) {
    if (ttype === "IdleCallback" || ttype === "AnimationFrame") {
      return `cancel${ttype}`;
    }
    return `clear${ttype}`;
  }
  function getScheduleHandler(ttype) {
    if (ttype === "IdleCallback" || ttype === "AnimationFrame") {
      return `request${ttype}`;
    }
    return `set${ttype}`;
  }
  function createWarnOnce() {
    let calls = 0;
    return function(msg) {
      !calls++ && console.warn(msg);
    };
  }
  const warnOnce = createWarnOnce();
  function clearTimer(clock, timerId, ttype) {
    if (!timerId) {
      return;
    }
    if (!clock.timers) {
      clock.timers = {};
    }
    const id = Number(timerId);
    if (Number.isNaN(id) || id < idCounterStart) {
      const handlerName = getClearHandler(ttype);
      if (clock.shouldClearNativeTimers === true) {
        const nativeHandler = clock[`_${handlerName}`];
        return typeof nativeHandler === "function" ? nativeHandler(timerId) : undefined;
      }
      warnOnce(`FakeTimers: ${handlerName} was invoked to clear a native timer instead of one created by this library.` + "\nTo automatically clean-up native timers, use `shouldClearNativeTimers`.");
    }
    if (clock.timers.hasOwnProperty(id)) {
      const timer = clock.timers[id];
      if (timer.type === ttype || timer.type === "Timeout" && ttype === "Interval" || timer.type === "Interval" && ttype === "Timeout") {
        delete clock.timers[id];
      } else {
        const clear = getClearHandler(ttype);
        const schedule = getScheduleHandler(timer.type);
        throw new Error(`Cannot clear timer: timer created with ${schedule}() but cleared with ${clear}()`);
      }
    }
  }
  function uninstall(clock, config2) {
    let method, i2, l;
    const installedHrTime = "_hrtime";
    const installedNextTick = "_nextTick";
    for (i2 = 0, l = clock.methods.length;i2 < l; i2++) {
      method = clock.methods[i2];
      if (method === "hrtime" && _global.process) {
        _global.process.hrtime = clock[installedHrTime];
      } else if (method === "nextTick" && _global.process) {
        _global.process.nextTick = clock[installedNextTick];
      } else if (method === "performance") {
        const originalPerfDescriptor = Object.getOwnPropertyDescriptor(clock, `_${method}`);
        if (originalPerfDescriptor && originalPerfDescriptor.get && !originalPerfDescriptor.set) {
          Object.defineProperty(_global, method, originalPerfDescriptor);
        } else if (originalPerfDescriptor.configurable) {
          _global[method] = clock[`_${method}`];
        }
      } else {
        if (_global[method] && _global[method].hadOwnProperty) {
          _global[method] = clock[`_${method}`];
        } else {
          try {
            delete _global[method];
          } catch (ignore) {}
        }
      }
      if (clock.timersModuleMethods !== undefined) {
        for (let j = 0;j < clock.timersModuleMethods.length; j++) {
          const entry = clock.timersModuleMethods[j];
          timersModule[entry.methodName] = entry.original;
        }
      }
    }
    if (config2.shouldAdvanceTime === true) {
      _global.clearInterval(clock.attachedInterval);
    }
    clock.methods = [];
    if (!clock.timers) {
      return [];
    }
    return Object.keys(clock.timers).map(function mapper(key) {
      return clock.timers[key];
    });
  }
  function hijackMethod(target, method, clock) {
    clock[method].hadOwnProperty = Object.prototype.hasOwnProperty.call(target, method);
    clock[`_${method}`] = target[method];
    if (method === "Date") {
      const date = mirrorDateProperties(clock[method], target[method]);
      target[method] = date;
    } else if (method === "Intl") {
      target[method] = clock[method];
    } else if (method === "performance") {
      const originalPerfDescriptor = Object.getOwnPropertyDescriptor(target, method);
      if (originalPerfDescriptor && originalPerfDescriptor.get && !originalPerfDescriptor.set) {
        Object.defineProperty(clock, `_${method}`, originalPerfDescriptor);
        const perfDescriptor = Object.getOwnPropertyDescriptor(clock, method);
        Object.defineProperty(target, method, perfDescriptor);
      } else {
        target[method] = clock[method];
      }
    } else {
      target[method] = function() {
        return clock[method].apply(clock, arguments);
      };
      Object.defineProperties(target[method], Object.getOwnPropertyDescriptors(clock[method]));
    }
    target[method].clock = clock;
  }
  function doIntervalTick(clock, advanceTimeDelta) {
    clock.tick(advanceTimeDelta);
  }
  const timers = {
    setTimeout: _global.setTimeout,
    clearTimeout: _global.clearTimeout,
    setInterval: _global.setInterval,
    clearInterval: _global.clearInterval,
    Date: _global.Date
  };
  if (setImmediatePresent) {
    timers.setImmediate = _global.setImmediate;
    timers.clearImmediate = _global.clearImmediate;
  }
  if (hrtimePresent) {
    timers.hrtime = _global.process.hrtime;
  }
  if (nextTickPresent) {
    timers.nextTick = _global.process.nextTick;
  }
  if (performancePresent) {
    timers.performance = _global.performance;
  }
  if (requestAnimationFramePresent) {
    timers.requestAnimationFrame = _global.requestAnimationFrame;
  }
  if (queueMicrotaskPresent) {
    timers.queueMicrotask = true;
  }
  if (cancelAnimationFramePresent) {
    timers.cancelAnimationFrame = _global.cancelAnimationFrame;
  }
  if (requestIdleCallbackPresent) {
    timers.requestIdleCallback = _global.requestIdleCallback;
  }
  if (cancelIdleCallbackPresent) {
    timers.cancelIdleCallback = _global.cancelIdleCallback;
  }
  if (intlPresent) {
    timers.Intl = _global.Intl;
  }
  const originalSetTimeout = _global.setImmediate || _global.setTimeout;
  function createClock(start, loopLimit) {
    start = Math.floor(getEpoch(start));
    loopLimit = loopLimit || 1000;
    let nanos = 0;
    const adjustedSystemTime = [0, 0];
    if (NativeDate === undefined) {
      throw new Error("The global scope doesn't have a `Date` object" + " (see https://github.com/sinonjs/sinon/issues/1852#issuecomment-419622780)");
    }
    const clock = {
      now: start,
      Date: createDate(),
      loopLimit
    };
    clock.Date.clock = clock;
    function getTimeToNextFrame() {
      return 16 - (clock.now - start) % 16;
    }
    function hrtime(prev) {
      const millisSinceStart = clock.now - adjustedSystemTime[0] - start;
      const secsSinceStart = Math.floor(millisSinceStart / 1000);
      const remainderInNanos = (millisSinceStart - secsSinceStart * 1000) * 1e6 + nanos - adjustedSystemTime[1];
      if (Array.isArray(prev)) {
        if (prev[1] > 1e9) {
          throw new TypeError("Number of nanoseconds can't exceed a billion");
        }
        const oldSecs = prev[0];
        let nanoDiff = remainderInNanos - prev[1];
        let secDiff = secsSinceStart - oldSecs;
        if (nanoDiff < 0) {
          nanoDiff += 1e9;
          secDiff -= 1;
        }
        return [secDiff, nanoDiff];
      }
      return [secsSinceStart, remainderInNanos];
    }
    function fakePerformanceNow() {
      const hrt = hrtime();
      const millis = hrt[0] * 1000 + hrt[1] / 1e6;
      return millis;
    }
    if (hrtimeBigintPresent) {
      hrtime.bigint = function() {
        const parts = hrtime();
        return BigInt(parts[0]) * BigInt(1e9) + BigInt(parts[1]);
      };
    }
    if (intlPresent) {
      clock.Intl = createIntl();
      clock.Intl.clock = clock;
    }
    clock.requestIdleCallback = function requestIdleCallback(func, timeout) {
      let timeToNextIdlePeriod = 0;
      if (clock.countTimers() > 0) {
        timeToNextIdlePeriod = 50;
      }
      const result = addTimer(clock, {
        func,
        args: Array.prototype.slice.call(arguments, 2),
        delay: typeof timeout === "undefined" ? timeToNextIdlePeriod : Math.min(timeout, timeToNextIdlePeriod),
        idleCallback: true
      });
      return Number(result);
    };
    clock.cancelIdleCallback = function cancelIdleCallback(timerId) {
      return clearTimer(clock, timerId, "IdleCallback");
    };
    clock.setTimeout = function setTimeout(func, timeout) {
      return addTimer(clock, {
        func,
        args: Array.prototype.slice.call(arguments, 2),
        delay: timeout
      });
    };
    if (typeof _global.Promise !== "undefined" && utilPromisify) {
      clock.setTimeout[utilPromisify.custom] = function promisifiedSetTimeout(timeout, arg) {
        return new _global.Promise(function setTimeoutExecutor(resolve3) {
          addTimer(clock, {
            func: resolve3,
            args: [arg],
            delay: timeout
          });
        });
      };
    }
    clock.clearTimeout = function clearTimeout(timerId) {
      return clearTimer(clock, timerId, "Timeout");
    };
    clock.nextTick = function nextTick(func) {
      return enqueueJob(clock, {
        func,
        args: Array.prototype.slice.call(arguments, 1),
        error: isNearInfiniteLimit ? new Error : null
      });
    };
    clock.queueMicrotask = function queueMicrotask(func) {
      return clock.nextTick(func);
    };
    clock.setInterval = function setInterval(func, timeout) {
      timeout = parseInt(timeout, 10);
      return addTimer(clock, {
        func,
        args: Array.prototype.slice.call(arguments, 2),
        delay: timeout,
        interval: timeout
      });
    };
    clock.clearInterval = function clearInterval(timerId) {
      return clearTimer(clock, timerId, "Interval");
    };
    if (setImmediatePresent) {
      clock.setImmediate = function setImmediate(func) {
        return addTimer(clock, {
          func,
          args: Array.prototype.slice.call(arguments, 1),
          immediate: true
        });
      };
      if (typeof _global.Promise !== "undefined" && utilPromisify) {
        clock.setImmediate[utilPromisify.custom] = function promisifiedSetImmediate(arg) {
          return new _global.Promise(function setImmediateExecutor(resolve3) {
            addTimer(clock, {
              func: resolve3,
              args: [arg],
              immediate: true
            });
          });
        };
      }
      clock.clearImmediate = function clearImmediate(timerId) {
        return clearTimer(clock, timerId, "Immediate");
      };
    }
    clock.countTimers = function countTimers() {
      return Object.keys(clock.timers || {}).length + (clock.jobs || []).length;
    };
    clock.requestAnimationFrame = function requestAnimationFrame(func) {
      const result = addTimer(clock, {
        func,
        delay: getTimeToNextFrame(),
        get args() {
          return [fakePerformanceNow()];
        },
        animation: true
      });
      return Number(result);
    };
    clock.cancelAnimationFrame = function cancelAnimationFrame(timerId) {
      return clearTimer(clock, timerId, "AnimationFrame");
    };
    clock.runMicrotasks = function runMicrotasks() {
      runJobs(clock);
    };
    function doTick(tickValue, isAsync, resolve3, reject) {
      const msFloat = typeof tickValue === "number" ? tickValue : parseTime(tickValue);
      const ms = Math.floor(msFloat);
      const remainder = nanoRemainder(msFloat);
      let nanosTotal = nanos + remainder;
      let tickTo = clock.now + ms;
      if (msFloat < 0) {
        throw new TypeError("Negative ticks are not supported");
      }
      if (nanosTotal >= 1e6) {
        tickTo += 1;
        nanosTotal -= 1e6;
      }
      nanos = nanosTotal;
      let tickFrom = clock.now;
      let previous = clock.now;
      let timer, firstException, oldNow, nextPromiseTick, compensationCheck, postTimerCall;
      clock.duringTick = true;
      oldNow = clock.now;
      runJobs(clock);
      if (oldNow !== clock.now) {
        tickFrom += clock.now - oldNow;
        tickTo += clock.now - oldNow;
      }
      function doTickInner() {
        timer = firstTimerInRange(clock, tickFrom, tickTo);
        while (timer && tickFrom <= tickTo) {
          if (clock.timers[timer.id]) {
            tickFrom = timer.callAt;
            clock.now = timer.callAt;
            oldNow = clock.now;
            try {
              runJobs(clock);
              callTimer(clock, timer);
            } catch (e) {
              firstException = firstException || e;
            }
            if (isAsync) {
              originalSetTimeout(nextPromiseTick);
              return;
            }
            compensationCheck();
          }
          postTimerCall();
        }
        oldNow = clock.now;
        runJobs(clock);
        if (oldNow !== clock.now) {
          tickFrom += clock.now - oldNow;
          tickTo += clock.now - oldNow;
        }
        clock.duringTick = false;
        timer = firstTimerInRange(clock, tickFrom, tickTo);
        if (timer) {
          try {
            clock.tick(tickTo - clock.now);
          } catch (e) {
            firstException = firstException || e;
          }
        } else {
          clock.now = tickTo;
          nanos = nanosTotal;
        }
        if (firstException) {
          throw firstException;
        }
        if (isAsync) {
          resolve3(clock.now);
        } else {
          return clock.now;
        }
      }
      nextPromiseTick = isAsync && function() {
        try {
          compensationCheck();
          postTimerCall();
          doTickInner();
        } catch (e) {
          reject(e);
        }
      };
      compensationCheck = function() {
        if (oldNow !== clock.now) {
          tickFrom += clock.now - oldNow;
          tickTo += clock.now - oldNow;
          previous += clock.now - oldNow;
        }
      };
      postTimerCall = function() {
        timer = firstTimerInRange(clock, previous, tickTo);
        previous = tickFrom;
      };
      return doTickInner();
    }
    clock.tick = function tick(tickValue) {
      return doTick(tickValue, false);
    };
    if (typeof _global.Promise !== "undefined") {
      clock.tickAsync = function tickAsync(tickValue) {
        return new _global.Promise(function(resolve3, reject) {
          originalSetTimeout(function() {
            try {
              doTick(tickValue, true, resolve3, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      };
    }
    clock.next = function next() {
      runJobs(clock);
      const timer = firstTimer(clock);
      if (!timer) {
        return clock.now;
      }
      clock.duringTick = true;
      try {
        clock.now = timer.callAt;
        callTimer(clock, timer);
        runJobs(clock);
        return clock.now;
      } finally {
        clock.duringTick = false;
      }
    };
    if (typeof _global.Promise !== "undefined") {
      clock.nextAsync = function nextAsync() {
        return new _global.Promise(function(resolve3, reject) {
          originalSetTimeout(function() {
            try {
              const timer = firstTimer(clock);
              if (!timer) {
                resolve3(clock.now);
                return;
              }
              let err;
              clock.duringTick = true;
              clock.now = timer.callAt;
              try {
                callTimer(clock, timer);
              } catch (e) {
                err = e;
              }
              clock.duringTick = false;
              originalSetTimeout(function() {
                if (err) {
                  reject(err);
                } else {
                  resolve3(clock.now);
                }
              });
            } catch (e) {
              reject(e);
            }
          });
        });
      };
    }
    clock.runAll = function runAll() {
      let numTimers, i2;
      runJobs(clock);
      for (i2 = 0;i2 < clock.loopLimit; i2++) {
        if (!clock.timers) {
          resetIsNearInfiniteLimit();
          return clock.now;
        }
        numTimers = Object.keys(clock.timers).length;
        if (numTimers === 0) {
          resetIsNearInfiniteLimit();
          return clock.now;
        }
        clock.next();
        checkIsNearInfiniteLimit(clock, i2);
      }
      const excessJob = firstTimer(clock);
      throw getInfiniteLoopError(clock, excessJob);
    };
    clock.runToFrame = function runToFrame() {
      return clock.tick(getTimeToNextFrame());
    };
    if (typeof _global.Promise !== "undefined") {
      clock.runAllAsync = function runAllAsync() {
        return new _global.Promise(function(resolve3, reject) {
          let i2 = 0;
          function doRun() {
            originalSetTimeout(function() {
              try {
                let numTimers;
                if (i2 < clock.loopLimit) {
                  if (!clock.timers) {
                    resetIsNearInfiniteLimit();
                    resolve3(clock.now);
                    return;
                  }
                  numTimers = Object.keys(clock.timers).length;
                  if (numTimers === 0) {
                    resetIsNearInfiniteLimit();
                    resolve3(clock.now);
                    return;
                  }
                  clock.next();
                  i2++;
                  doRun();
                  checkIsNearInfiniteLimit(clock, i2);
                  return;
                }
                const excessJob = firstTimer(clock);
                reject(getInfiniteLoopError(clock, excessJob));
              } catch (e) {
                reject(e);
              }
            });
          }
          doRun();
        });
      };
    }
    clock.runToLast = function runToLast() {
      const timer = lastTimer(clock);
      if (!timer) {
        runJobs(clock);
        return clock.now;
      }
      return clock.tick(timer.callAt - clock.now);
    };
    if (typeof _global.Promise !== "undefined") {
      clock.runToLastAsync = function runToLastAsync() {
        return new _global.Promise(function(resolve3, reject) {
          originalSetTimeout(function() {
            try {
              const timer = lastTimer(clock);
              if (!timer) {
                resolve3(clock.now);
              }
              resolve3(clock.tickAsync(timer.callAt - clock.now));
            } catch (e) {
              reject(e);
            }
          });
        });
      };
    }
    clock.reset = function reset() {
      nanos = 0;
      clock.timers = {};
      clock.jobs = [];
      clock.now = start;
    };
    clock.setSystemTime = function setSystemTime(systemTime) {
      const newNow = getEpoch(systemTime);
      const difference = newNow - clock.now;
      let id, timer;
      adjustedSystemTime[0] = adjustedSystemTime[0] + difference;
      adjustedSystemTime[1] = adjustedSystemTime[1] + nanos;
      clock.now = newNow;
      nanos = 0;
      for (id in clock.timers) {
        if (clock.timers.hasOwnProperty(id)) {
          timer = clock.timers[id];
          timer.createdAt += difference;
          timer.callAt += difference;
        }
      }
    };
    clock.jump = function jump(tickValue) {
      const msFloat = typeof tickValue === "number" ? tickValue : parseTime(tickValue);
      const ms = Math.floor(msFloat);
      for (const timer of Object.values(clock.timers)) {
        if (clock.now + ms > timer.callAt) {
          timer.callAt = clock.now + ms;
        }
      }
      clock.tick(ms);
    };
    if (performancePresent) {
      clock.performance = Object.create(null);
      clock.performance.now = fakePerformanceNow;
    }
    if (hrtimePresent) {
      clock.hrtime = hrtime;
    }
    return clock;
  }
  function install(config2) {
    if (arguments.length > 1 || config2 instanceof Date || Array.isArray(config2) || typeof config2 === "number") {
      throw new TypeError(`FakeTimers.install called with ${String(config2)} install requires an object parameter`);
    }
    if (_global.Date.isFake === true) {
      throw new TypeError("Can't install fake timers twice on the same global object.");
    }
    config2 = typeof config2 !== "undefined" ? config2 : {};
    config2.shouldAdvanceTime = config2.shouldAdvanceTime || false;
    config2.advanceTimeDelta = config2.advanceTimeDelta || 20;
    config2.shouldClearNativeTimers = config2.shouldClearNativeTimers || false;
    if (config2.target) {
      throw new TypeError("config.target is no longer supported. Use `withGlobal(target)` instead.");
    }
    let i2, l;
    const clock = createClock(config2.now, config2.loopLimit);
    clock.shouldClearNativeTimers = config2.shouldClearNativeTimers;
    clock.uninstall = function() {
      return uninstall(clock, config2);
    };
    clock.methods = config2.toFake || [];
    if (clock.methods.length === 0) {
      clock.methods = Object.keys(timers).filter(function(key) {
        return key !== "nextTick" && key !== "queueMicrotask";
      });
    }
    if (config2.shouldAdvanceTime === true) {
      const intervalTick = doIntervalTick.bind(null, clock, config2.advanceTimeDelta);
      const intervalId = _global.setInterval(intervalTick, config2.advanceTimeDelta);
      clock.attachedInterval = intervalId;
    }
    if (clock.methods.includes("performance")) {
      const proto = (() => {
        if (hasPerformanceConstructorPrototype) {
          return _global.performance.constructor.prototype;
        }
        if (hasPerformancePrototype) {
          return _global.Performance.prototype;
        }
      })();
      if (proto) {
        Object.getOwnPropertyNames(proto).forEach(function(name) {
          if (name !== "now") {
            clock.performance[name] = name.indexOf("getEntries") === 0 ? NOOP_ARRAY : NOOP;
          }
        });
      } else if ((config2.toFake || []).includes("performance")) {
        throw new ReferenceError("non-existent performance object cannot be faked");
      }
    }
    if (_global === globalObject && timersModule) {
      clock.timersModuleMethods = [];
    }
    for (i2 = 0, l = clock.methods.length;i2 < l; i2++) {
      const nameOfMethodToReplace = clock.methods[i2];
      if (nameOfMethodToReplace === "hrtime") {
        if (_global.process && typeof _global.process.hrtime === "function") {
          hijackMethod(_global.process, nameOfMethodToReplace, clock);
        }
      } else if (nameOfMethodToReplace === "nextTick") {
        if (_global.process && typeof _global.process.nextTick === "function") {
          hijackMethod(_global.process, nameOfMethodToReplace, clock);
        }
      } else {
        hijackMethod(_global, nameOfMethodToReplace, clock);
      }
      if (clock.timersModuleMethods !== undefined && timersModule[nameOfMethodToReplace]) {
        const original = timersModule[nameOfMethodToReplace];
        clock.timersModuleMethods.push({
          methodName: nameOfMethodToReplace,
          original
        });
        timersModule[nameOfMethodToReplace] = _global[nameOfMethodToReplace];
      }
    }
    return clock;
  }
  return {
    timers,
    createClock,
    install,
    withGlobal
  };
}
var defaultImplementation = withGlobal(globalObject);
defaultImplementation.timers;
defaultImplementation.createClock;
defaultImplementation.install;
var withGlobal_1 = withGlobal;

class FakeTimers {
  _global;
  _clock;
  _fakingTime;
  _fakingDate;
  _fakeTimers;
  _userConfig;
  _now = RealDate.now;
  constructor({
    global: global3,
    config: config2
  }) {
    this._userConfig = config2;
    this._fakingDate = false;
    this._fakingTime = false;
    this._fakeTimers = withGlobal_1(global3);
    this._global = global3;
  }
  clearAllTimers() {
    if (this._fakingTime)
      this._clock.reset();
  }
  dispose() {
    this.useRealTimers();
  }
  runAllTimers() {
    if (this._checkFakeTimers())
      this._clock.runAll();
  }
  async runAllTimersAsync() {
    if (this._checkFakeTimers())
      await this._clock.runAllAsync();
  }
  runOnlyPendingTimers() {
    if (this._checkFakeTimers())
      this._clock.runToLast();
  }
  async runOnlyPendingTimersAsync() {
    if (this._checkFakeTimers())
      await this._clock.runToLastAsync();
  }
  advanceTimersToNextTimer(steps = 1) {
    if (this._checkFakeTimers()) {
      for (let i2 = steps;i2 > 0; i2--) {
        this._clock.next();
        this._clock.tick(0);
        if (this._clock.countTimers() === 0)
          break;
      }
    }
  }
  async advanceTimersToNextTimerAsync(steps = 1) {
    if (this._checkFakeTimers()) {
      for (let i2 = steps;i2 > 0; i2--) {
        await this._clock.nextAsync();
        this._clock.tick(0);
        if (this._clock.countTimers() === 0)
          break;
      }
    }
  }
  advanceTimersByTime(msToRun) {
    if (this._checkFakeTimers())
      this._clock.tick(msToRun);
  }
  async advanceTimersByTimeAsync(msToRun) {
    if (this._checkFakeTimers())
      await this._clock.tickAsync(msToRun);
  }
  runAllTicks() {
    if (this._checkFakeTimers()) {
      this._clock.runMicrotasks();
    }
  }
  useRealTimers() {
    if (this._fakingDate) {
      resetDate();
      this._fakingDate = false;
    }
    if (this._fakingTime) {
      this._clock.uninstall();
      this._fakingTime = false;
    }
  }
  useFakeTimers() {
    var _a, _b, _c;
    if (this._fakingDate) {
      throw new Error('"setSystemTime" was called already and date was mocked. Reset timers using `vi.useRealTimers()` if you want to use fake timers again.');
    }
    if (!this._fakingTime) {
      const toFake = Object.keys(this._fakeTimers.timers).filter((timer) => timer !== "nextTick");
      if (((_b = (_a = this._userConfig) == null ? undefined : _a.toFake) == null ? undefined : _b.includes("nextTick")) && isChildProcess())
        throw new Error("process.nextTick cannot be mocked inside child_process");
      const existingFakedMethods = (((_c = this._userConfig) == null ? undefined : _c.toFake) || toFake).filter((method) => {
        switch (method) {
          case "setImmediate":
          case "clearImmediate":
            return method in this._global && this._global[method];
          default:
            return true;
        }
      });
      this._clock = this._fakeTimers.install({
        now: Date.now(),
        ...this._userConfig,
        toFake: existingFakedMethods
      });
      this._fakingTime = true;
    }
  }
  reset() {
    if (this._checkFakeTimers()) {
      const { now: now3 } = this._clock;
      this._clock.reset();
      this._clock.setSystemTime(now3);
    }
  }
  setSystemTime(now3) {
    if (this._fakingTime) {
      this._clock.setSystemTime(now3);
    } else {
      mockDate(now3 ?? this.getRealSystemTime());
      this._fakingDate = true;
    }
  }
  getRealSystemTime() {
    return this._now();
  }
  getTimerCount() {
    if (this._checkFakeTimers())
      return this._clock.countTimers();
    return 0;
  }
  configure(config2) {
    this._userConfig = config2;
  }
  isFakeTimers() {
    return this._fakingTime;
  }
  _checkFakeTimers() {
    if (!this._fakingTime) {
      throw new Error('Timers are not mocked. Try calling "vi.useFakeTimers()" first.');
    }
    return this._fakingTime;
  }
}
function copyStackTrace(target, source) {
  if (source.stack !== undefined)
    target.stack = source.stack.replace(source.message, target.message);
  return target;
}
function waitFor(callback, options = {}) {
  const { setTimeout, setInterval, clearTimeout, clearInterval } = getSafeTimers();
  const { interval = 50, timeout = 1000 } = typeof options === "number" ? { timeout: options } : options;
  const STACK_TRACE_ERROR = new Error("STACK_TRACE_ERROR");
  return new Promise((resolve3, reject) => {
    let lastError;
    let promiseStatus = "idle";
    let timeoutId;
    let intervalId;
    const onResolve = (result) => {
      if (timeoutId)
        clearTimeout(timeoutId);
      if (intervalId)
        clearInterval(intervalId);
      resolve3(result);
    };
    const handleTimeout = () => {
      let error = lastError;
      if (!error)
        error = copyStackTrace(new Error("Timed out in waitFor!"), STACK_TRACE_ERROR);
      reject(error);
    };
    const checkCallback = () => {
      if (vi.isFakeTimers())
        vi.advanceTimersByTime(interval);
      if (promiseStatus === "pending")
        return;
      try {
        const result = callback();
        if (result !== null && typeof result === "object" && typeof result.then === "function") {
          const thenable = result;
          promiseStatus = "pending";
          thenable.then((resolvedValue) => {
            promiseStatus = "resolved";
            onResolve(resolvedValue);
          }, (rejectedValue) => {
            promiseStatus = "rejected";
            lastError = rejectedValue;
          });
        } else {
          onResolve(result);
          return true;
        }
      } catch (error) {
        lastError = error;
      }
    };
    if (checkCallback() === true)
      return;
    timeoutId = setTimeout(handleTimeout, timeout);
    intervalId = setInterval(checkCallback, interval);
  });
}
function waitUntil(callback, options = {}) {
  const { setTimeout, setInterval, clearTimeout, clearInterval } = getSafeTimers();
  const { interval = 50, timeout = 1000 } = typeof options === "number" ? { timeout: options } : options;
  const STACK_TRACE_ERROR = new Error("STACK_TRACE_ERROR");
  return new Promise((resolve3, reject) => {
    let promiseStatus = "idle";
    let timeoutId;
    let intervalId;
    const onReject = (error) => {
      if (!error)
        error = copyStackTrace(new Error("Timed out in waitUntil!"), STACK_TRACE_ERROR);
      reject(error);
    };
    const onResolve = (result) => {
      if (!result)
        return;
      if (timeoutId)
        clearTimeout(timeoutId);
      if (intervalId)
        clearInterval(intervalId);
      resolve3(result);
      return true;
    };
    const checkCallback = () => {
      if (vi.isFakeTimers())
        vi.advanceTimersByTime(interval);
      if (promiseStatus === "pending")
        return;
      try {
        const result = callback();
        if (result !== null && typeof result === "object" && typeof result.then === "function") {
          const thenable = result;
          promiseStatus = "pending";
          thenable.then((resolvedValue) => {
            promiseStatus = "resolved";
            onResolve(resolvedValue);
          }, (rejectedValue) => {
            promiseStatus = "rejected";
            onReject(rejectedValue);
          });
        } else {
          return onResolve(result);
        }
      } catch (error) {
        onReject(error);
      }
    };
    if (checkCallback() === true)
      return;
    timeoutId = setTimeout(onReject, timeout);
    intervalId = setInterval(checkCallback, interval);
  });
}
function createVitest() {
  const _mocker = typeof __vitest_mocker__ !== "undefined" ? __vitest_mocker__ : new Proxy({}, {
    get(_, name) {
      throw new Error(`Vitest mocker was not initialized in this environment. vi.${String(name)}() is forbidden.`);
    }
  });
  let _mockedDate = null;
  let _config = null;
  const workerState = getWorkerState();
  let _timers;
  const timers = () => _timers || (_timers = new FakeTimers({
    global: globalThis,
    config: workerState.config.fakeTimers
  }));
  const _stubsGlobal = /* @__PURE__ */ new Map;
  const _stubsEnv = /* @__PURE__ */ new Map;
  const _envBooleans = ["PROD", "DEV", "SSR"];
  const getImporter = () => {
    const stackTrace = createSimpleStackTrace({ stackTraceLimit: 4 });
    const importerStack = stackTrace.split(`
`)[4];
    const stack = parseSingleStack(importerStack);
    return (stack == null ? undefined : stack.file) || "";
  };
  const utils = {
    useFakeTimers(config2) {
      var _a, _b, _c, _d;
      if (isChildProcess()) {
        if (((_a = config2 == null ? undefined : config2.toFake) == null ? undefined : _a.includes("nextTick")) || ((_d = (_c = (_b = workerState.config) == null ? undefined : _b.fakeTimers) == null ? undefined : _c.toFake) == null ? undefined : _d.includes("nextTick"))) {
          throw new Error('vi.useFakeTimers({ toFake: ["nextTick"] }) is not supported in node:child_process. Use --pool=threads if mocking nextTick is required.');
        }
      }
      if (config2)
        timers().configure({ ...workerState.config.fakeTimers, ...config2 });
      else
        timers().configure(workerState.config.fakeTimers);
      timers().useFakeTimers();
      return utils;
    },
    isFakeTimers() {
      return timers().isFakeTimers();
    },
    useRealTimers() {
      timers().useRealTimers();
      _mockedDate = null;
      return utils;
    },
    runOnlyPendingTimers() {
      timers().runOnlyPendingTimers();
      return utils;
    },
    async runOnlyPendingTimersAsync() {
      await timers().runOnlyPendingTimersAsync();
      return utils;
    },
    runAllTimers() {
      timers().runAllTimers();
      return utils;
    },
    async runAllTimersAsync() {
      await timers().runAllTimersAsync();
      return utils;
    },
    runAllTicks() {
      timers().runAllTicks();
      return utils;
    },
    advanceTimersByTime(ms) {
      timers().advanceTimersByTime(ms);
      return utils;
    },
    async advanceTimersByTimeAsync(ms) {
      await timers().advanceTimersByTimeAsync(ms);
      return utils;
    },
    advanceTimersToNextTimer() {
      timers().advanceTimersToNextTimer();
      return utils;
    },
    async advanceTimersToNextTimerAsync() {
      await timers().advanceTimersToNextTimerAsync();
      return utils;
    },
    getTimerCount() {
      return timers().getTimerCount();
    },
    setSystemTime(time) {
      const date = time instanceof Date ? time : new Date(time);
      _mockedDate = date;
      timers().setSystemTime(date);
      return utils;
    },
    getMockedSystemTime() {
      return _mockedDate;
    },
    getRealSystemTime() {
      return timers().getRealSystemTime();
    },
    clearAllTimers() {
      timers().clearAllTimers();
      return utils;
    },
    spyOn,
    fn,
    waitFor,
    waitUntil,
    hoisted(factory) {
      assertTypes(factory, '"vi.hoisted" factory', ["function"]);
      return factory();
    },
    mock(path2, factory) {
      const importer = getImporter();
      _mocker.queueMock(path2, importer, factory ? () => factory(() => _mocker.importActual(path2, importer, _mocker.getMockContext().callstack)) : undefined, true);
    },
    unmock(path2) {
      _mocker.queueUnmock(path2, getImporter());
    },
    doMock(path2, factory) {
      const importer = getImporter();
      _mocker.queueMock(path2, importer, factory ? () => factory(() => _mocker.importActual(path2, importer, _mocker.getMockContext().callstack)) : undefined, false);
    },
    doUnmock(path2) {
      _mocker.queueUnmock(path2, getImporter());
    },
    async importActual(path2) {
      return _mocker.importActual(path2, getImporter(), _mocker.getMockContext().callstack);
    },
    async importMock(path2) {
      return _mocker.importMock(path2, getImporter());
    },
    mocked(item, _options = {}) {
      return item;
    },
    isMockFunction(fn2) {
      return isMockFunction(fn2);
    },
    clearAllMocks() {
      mocks.forEach((spy) => spy.mockClear());
      return utils;
    },
    resetAllMocks() {
      mocks.forEach((spy) => spy.mockReset());
      return utils;
    },
    restoreAllMocks() {
      mocks.forEach((spy) => spy.mockRestore());
      return utils;
    },
    stubGlobal(name, value) {
      if (!_stubsGlobal.has(name))
        _stubsGlobal.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
      Object.defineProperty(globalThis, name, {
        value,
        writable: true,
        configurable: true,
        enumerable: true
      });
      return utils;
    },
    stubEnv(name, value) {
      if (!_stubsEnv.has(name))
        _stubsEnv.set(name, process.env[name]);
      if (_envBooleans.includes(name))
        process.env[name] = value ? "1" : "";
      else
        process.env[name] = String(value);
      return utils;
    },
    unstubAllGlobals() {
      _stubsGlobal.forEach((original, name) => {
        if (!original)
          Reflect.deleteProperty(globalThis, name);
        else
          Object.defineProperty(globalThis, name, original);
      });
      _stubsGlobal.clear();
      return utils;
    },
    unstubAllEnvs() {
      _stubsEnv.forEach((original, name) => {
        if (original === undefined)
          delete process.env[name];
        else
          process.env[name] = original;
      });
      _stubsEnv.clear();
      return utils;
    },
    resetModules() {
      resetModules(workerState.moduleCache);
      return utils;
    },
    async dynamicImportSettled() {
      return waitForImportsToResolve();
    },
    setConfig(config2) {
      if (!_config)
        _config = { ...workerState.config };
      Object.assign(workerState.config, config2);
    },
    resetConfig() {
      if (_config)
        Object.assign(workerState.config, _config);
    }
  };
  return utils;
}
var vitest = createVitest();
var vi = vitest;
// node_modules/vitest/dist/vendor/index.dI9lHwVn.js
function getRunningMode() {
  return process.env.VITEST_MODE === "WATCH" ? "watch" : "run";
}
function isWatchMode() {
  return getRunningMode() === "watch";
}
function inject(key) {
  const workerState = getWorkerState();
  return workerState.providedContext[key];
}
var dist = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.expectTypeOf = undefined;
  const fn2 = () => true;
  const expectTypeOf = (_actual) => {
    const nonFunctionProperties = [
      "parameters",
      "returns",
      "resolves",
      "not",
      "items",
      "constructorParameters",
      "thisParameter",
      "instance",
      "guards",
      "asserts",
      "branded"
    ];
    const obj = {
      toBeAny: fn2,
      toBeUnknown: fn2,
      toBeNever: fn2,
      toBeFunction: fn2,
      toBeObject: fn2,
      toBeArray: fn2,
      toBeString: fn2,
      toBeNumber: fn2,
      toBeBoolean: fn2,
      toBeVoid: fn2,
      toBeSymbol: fn2,
      toBeNull: fn2,
      toBeUndefined: fn2,
      toBeNullable: fn2,
      toMatchTypeOf: fn2,
      toEqualTypeOf: fn2,
      toBeCallableWith: fn2,
      toBeConstructibleWith: fn2,
      extract: exports.expectTypeOf,
      exclude: exports.expectTypeOf,
      toHaveProperty: exports.expectTypeOf,
      parameter: exports.expectTypeOf
    };
    const getterProperties = nonFunctionProperties;
    getterProperties.forEach((prop) => Object.defineProperty(obj, prop, { get: () => (0, exports.expectTypeOf)({}) }));
    return obj;
  };
  exports.expectTypeOf = expectTypeOf;
})(dist);
function noop2() {}
var assertType = noop2;
var VitestIndex = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  afterAll,
  afterEach,
  assert,
  assertType,
  beforeAll,
  beforeEach,
  bench,
  chai: exports_chai,
  createExpect,
  describe,
  expect: globalExpect,
  expectTypeOf: dist.expectTypeOf,
  getRunningMode,
  inject,
  isFirstRun,
  isWatchMode,
  it,
  onTestFailed,
  onTestFinished,
  runOnce,
  should,
  suite,
  test,
  vi,
  vitest
});
// node_modules/vitest/dist/index.js
var expectTypeOf = dist.expectTypeOf;

// src/debug.test.ts
describe("debug test", () => {
  it("should pass", () => {
    globalExpect(1 + 1).toBe(2);
  });
});
