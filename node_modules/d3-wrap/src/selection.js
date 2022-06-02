import wrap from './wrap';

export default function selection(f, wrapper) {
  return wrap(f, function(context, f) {
    for (var i = 2, ii = arguments.length, args = Array(ii - 1); i < ii; i++) {
      args[i - 1] = arguments[i];
    }
    args[0] = context;
    args[0] = wrapper.apply(this, args);
    return f.apply(this, args);
  });
}
