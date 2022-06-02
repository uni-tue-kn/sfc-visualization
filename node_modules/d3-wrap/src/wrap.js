const nonEnumerableProps = /^(valueOf|isPrototypeOf|to(Locale)?String|propertyIsEnumerable|hasOwnProperty)$/;

function extend() {
  for (var i = 0, ii = arguments.length - 1, fns = Array(ii); i < ii; i++) {
    fns[i] = arguments[i];
  }
  var wrapped = arguments[i];
  for (var i = 0; i < ii; i++) {
    var f = fns[i];
    for (var k in f) {
      if (!nonEnumerableProps.test(k)) {
        wrapped[k] = f[k];
      }
    }
  }
  return wrapped;
}

export default function wrap(f, wrapper) {
  return extend(f, wrapper, function(context) {
    for (var i = 0, ii = arguments.length, args = Array(ii + 1); i < ii; i++) {
      args[i + 1] = arguments[i];
    }
    args[0] = context;
    args[1] = extend(f, function(wrappedContext) {
      for (var i = 0, ii = arguments.length, pass = Array(ii); i < ii; i++) {
        pass[i] = arguments[i];
      }
      if (context.selection && wrappedContext !== context && !wrappedContext.selection && wrappedContext.transition) {
        pass[0] = wrappedContext.transition(context);
      }
      return f.apply(this, pass);
    });
    return wrapper.apply(this, args);
  });
}
