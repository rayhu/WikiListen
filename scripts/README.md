# About this folder

This folder contains node.js scripts for developers during dev/testing. Testing with native modules can be slow and inconvenient, so many logic can be tested on node.js.

To run typescript script, use ts-node.

```
ts-node .\scripts\testOpenAi.ts
```

If there is a need to test native modules, try to use mocking, also be careful of the platform differences.

jest is also using the same approach
