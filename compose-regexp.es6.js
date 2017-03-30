var empty = new RegExp('')

function normalize (source) {
    if (source instanceof RegExp) return source.source
    else return (source+'').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")
}

export function either() {
    if (!arguments.length) return empty;
    return new RegExp('(?:' + [].map.call(arguments, normalize).join('|') + ')')
}

export function group() {
    if (!arguments.length) return empty;
    return new RegExp('(?:' + [].map.call(arguments, normalize).join('') + ')')
}

export function sequence() {
    if (!arguments.length) return empty;
    return new RegExp([].map.call(arguments, normalize).join(''))
}

var validSuffix = sequence(
    /^/,
    either(
        '+', '*', '?',
        /\{\s*\d+\s*,?\s*\d*\s*\}/
    ),
    /$/
)

var call = group.call
var push = [].push
function operator(suffix) {
    if (arguments.length === 1) return empty
    return new RegExp(new RegExp(call.apply(group, arguments).source + suffix))
}

export function greedy(suffix) {
    if (!validSuffix.test(suffix)) throw new Error("Invalid suffix '" + suffix+ "'.")
    return (arguments.length === 1)
        ? operator.bind(null, suffix)
        : operator.apply(null, arguments)
}

export function frugal(suffix) {
    if (!validSuffix.test(suffix)) throw new Error("Invalid suffix '" + suffix+ "'.")
    return (arguments.length === 1)
        ? operator.bind(null, suffix+'?')
        : (arguments[0] = suffix + '?', operator.apply(null, arguments))
}

export function ref(n) {
    return new RegExp('\\' + n)
}

export function lookAhead() {
    if (!arguments.length) return empty;
    return new RegExp('(?=' + [].map.call(arguments, normalize).join('') + ')')
}

export function avoid() {
    if (!arguments.length) return empty;
    return new RegExp('(?!' + [].map.call(arguments, normalize).join('') + ')')
}

export function flags(opts) {
    var args = [].slice.call(arguments, 1)
    var expr
    if (!args.length) expr = '';
    else expr = args.map(normalize).join('')
    return new RegExp(expr, opts)
}

export function capture () {
    if (!arguments.length) return new RegExp('()');
    return new RegExp('(' + [].map.call(arguments, normalize).join('') + ')')
}