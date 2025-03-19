# Cram

Cram is a super-simple Javascript bundler built for fun! I named it Cram because if you think about it, a bundler kinda crams all of the javascript togetherinto 1 file.

The plan here is to not use existing tools as much as possible and build all of it from scratch. This is just an exercise of learning and joy.

## Notes

These are just notes I will be jotting down for my own understanding as I figure out how to build this.

Okay, so what is a bundler? In essense, a bundler is a tool that takes your javascript source code, and _crams_ it into a single file.
Okay, so how does it do it? It takes an entry point file (like `index.js`) and traverses through all of the dependencies that are required by the file and traverses through the dependencies of all the dependencies and so on, until all of the required code has been gathered and makes a single bundle out of it.

Okay, so what are all the puzzle pieces we need to solve in order to make a bundler?

1. Traversing the source code
2. Cramming it into one file that executes the code in the correct order


Next steps:

1. Create a dependency graph and solve dependency resolution and module injection in a more structured way
2. Compatibility with Node.js module resolution algorithm
3. Handle comments
4. Support for ES Modules and import syntax
5. Support for `node_modules`
6. Handling same dependency for many files
7. Produce a js map
8. Minification


Other things to think about:

1. Solving for assets like SVG


## Bibliography

- [Minipack](https://github.com/ronami/minipack) - This is a nice and simple bundler someone built. It's just a single file and explains through comments the idea of a very basic bundler.
- [Building a Javascript Testing Framework](https://cpojer.net/posts/building-a-javascript-testing-framework) - This is a great series of posts about javascript infrastructure and how to build some things. There is another post in the same series on how to build a bundler itself, but I haven't read it yet since the ideas covered in building a testing framework also apply to a bundler. Highly recommend checking out this series!
