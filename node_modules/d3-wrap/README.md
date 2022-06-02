# d3-wrap

In the D3 way of functions as objects, composition of functions needs to also
inherit the properties of the functions being composed. This is what this small
utility aims to acheive, think of it as the combination of two Underscore's
functionalities: [wrap][1] and [extend][2].

This allows the extention of common D3 modules such as axis, for example:

```js
var height = ...;

var xAxis = d3.axisBottom();

xAxis = d3.wrap(xAxis, function(selection, xAxis) {
        return xAxis(
            selection.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0 " + height + ")"));
    });

var svg = d3.select("body").append("svg");

svg.call(xAxis.domain([...]));
```

If the selection is under transition, the transition will be correctly preserved
through the call.

For other ways of composing functions with D3 see [d3-compose][3].


[1]: http://underscorejs.org/#wrap
[2]: http://underscorejs.org/#extend
[3]: https://www.npmjs.com/package/d3-compose
