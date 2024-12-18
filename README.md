# webpack-bug-demo


- `Git clone`
- `npm install`
- `node build-config.js`
- `npm run pack`
- `cd webpack-output`
- `node webpack-output`

Should get the error
```
Error: Cannot find module './mime-node'
```

# The issue comes from the nodemailer package which is used inside the mailparser libary.
