"use strict";
var _plugin = /*#__PURE__*/ _interop_require_default(require("tailwindcss/plugin"));
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
module.exports = (0, _plugin.default)(function containerQueries(param) {
    var matchUtilities = param.matchUtilities, matchVariant = param.matchVariant, theme = param.theme;
    var _theme;
    var values = (_theme = theme('containers')) !== null && _theme !== void 0 ? _theme : {};
    // Process the container values to support both string and object formats
    var processedValues = {};
    var queryTypes = {};
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        // Transform the theme values into a format we can use
        for(var _iterator = Object.entries(values)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var _step_value = _sliced_to_array(_step.value, 2), key = _step_value[0], value = _step_value[1];
            if (typeof value === 'string') {
                // String value - use as min-width (original behavior)
                processedValues[key] = value;
                queryTypes[key] = 'min-width';
            } else if ((typeof value === "undefined" ? "undefined" : _type_of(value)) === 'object' && value !== null) {
                // Object with min/max properties
                if (value.min) {
                    processedValues[key] = value.min;
                    queryTypes[key] = 'min-width';
                } else if (value.max) {
                    processedValues[key] = value.max;
                    queryTypes[key] = 'max-width';
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    function parseValue(value) {
        var _value_match;
        var _value_match_;
        var numericValue = (_value_match_ = (_value_match = value.match(/^(\d+\.\d+|\d+|\.\d+)\D+/)) === null || _value_match === void 0 ? void 0 : _value_match[1]) !== null && _value_match_ !== void 0 ? _value_match_ : null;
        if (numericValue === null) return null;
        return parseFloat(value);
    }
    matchUtilities({
        '@container': function(value, param) {
            var modifier = param.modifier;
            return {
                'container-type': value,
                'container-name': modifier
            };
        }
    }, {
        values: {
            DEFAULT: 'inline-size',
            normal: 'normal'
        },
        modifiers: 'any'
    });
    matchVariant('@', function() {
        var value = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '', modifier = (arguments.length > 1 ? arguments[1] : void 0).modifier;
        var parsed = parseValue(value);
        // Find the key for this value to determine query type
        var key = Object.keys(processedValues).find(function(k) {
            return processedValues[k] === value;
        });
        var queryType = key ? queryTypes[key] : 'min-width';
        return parsed !== null ? "@container ".concat(modifier !== null && modifier !== void 0 ? modifier : '', " (").concat(queryType, ": ").concat(value, ")") : [];
    }, {
        values: processedValues,
        sort: function sort(aVariant, zVariant) {
            var a = parseFloat(aVariant.value);
            var z = parseFloat(zVariant.value);
            if (a === null || z === null) return 0;
            // Find keys to determine query types
            var aKey = Object.keys(processedValues).find(function(k) {
                return processedValues[k] === aVariant.value;
            });
            var zKey = Object.keys(processedValues).find(function(k) {
                return processedValues[k] === zVariant.value;
            });
            var aType = aKey ? queryTypes[aKey] : 'min-width';
            var zType = zKey ? queryTypes[zKey] : 'min-width';
            // If they have different types, sort max-width first
            if (aType !== zType) {
                return aType === 'max-width' ? -1 : 1;
            }
            // For max-width queries, we want descending order
            if (aType === 'max-width') {
                if (a - z !== 0) return z - a;
            } else {
                // Original sort logic for min-width
                if (a - z !== 0) return a - z;
            }
            var _aVariant_modifier;
            var aLabel = (_aVariant_modifier = aVariant.modifier) !== null && _aVariant_modifier !== void 0 ? _aVariant_modifier : '';
            var _zVariant_modifier;
            var zLabel = (_zVariant_modifier = zVariant.modifier) !== null && _zVariant_modifier !== void 0 ? _zVariant_modifier : '';
            // Explicitly move empty labels to the end
            if (aLabel === '' && zLabel !== '') {
                return 1;
            } else if (aLabel !== '' && zLabel === '') {
                return -1;
            }
            // Sort labels alphabetically in the English locale
            // We are intentionally overriding the locale because we do not want the sort to
            // be affected by the machine's locale (be it a developer or CI environment)
            return aLabel.localeCompare(zLabel, 'en', {
                numeric: true
            });
        }
    });
}, {
    theme: {
        containers: {
            xs: '20rem',
            sm: '24rem',
            md: '28rem',
            lg: '32rem',
            xl: '36rem',
            '2xl': '42rem',
            '3xl': '48rem',
            '4xl': '56rem',
            '5xl': '64rem',
            '6xl': '72rem',
            '7xl': '80rem'
        }
    }
});
