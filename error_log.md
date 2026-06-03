$ docker-compose up --build
#1 [internal] load local bake definitions
#1 reading from stdin 1.04kB done
#1 DONE 0.0s

#2 [backend internal] load build definition from Dockerfile
#2 transferring dockerfile: 883B 0.0s done
#2 DONE 0.1s

#3 [frontend internal] load build definition from Dockerfile
#3 transferring dockerfile: 1.03kB 0.0s done
#3 DONE 0.1s

#4 [frontend internal] load metadata for docker.io/library/nginx:1.25-alpine
#4 ...

#5 [auth] library/node:pull token for registry-1.docker.io
#5 DONE 0.0s

#6 [auth] library/nginx:pull token for registry-1.docker.io
#6 DONE 0.0s

#7 [frontend internal] load metadata for docker.io/library/node:18-alpine
#7 ...

#4 [frontend internal] load metadata for docker.io/library/nginx:1.25-alpine
#4 DONE 1.9s

#7 [frontend internal] load metadata for docker.io/library/node:18-alpine
#7 DONE 2.3s

#8 [backend internal] load .dockerignore
#8 transferring context: 126B 0.0s done
#8 DONE 0.1s

#9 [backend internal] load build context
#9 DONE 0.0s

#10 [frontend internal] load .dockerignore
#10 transferring context: 443B 0.0s done
#10 DONE 0.1s

#11 [frontend builder 1/5] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#11 resolve docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#11 resolve docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e 0.1s done
#11 DONE 0.1s

#12 [frontend stage-1 1/2] FROM docker.io/library/nginx:1.25-alpine@sha256:516475cc129da42866742567714ddc681e5eed7b9ee0b9e9c015e464b4221a00
#12 resolve docker.io/library/nginx:1.25-alpine@sha256:516475cc129da42866742567714ddc681e5eed7b9ee0b9e9c015e464b4221a00 0.1s done
#12 DONE 0.1s

#13 [frontend internal] load build context
#13 transferring context: 167.78kB 0.1s done
#13 DONE 0.2s

#9 [backend internal] load build context
#9 transferring context: 63.30kB 0.1s done
#9 DONE 0.2s

#14 [backend builder 2/5] WORKDIR /app
#14 CACHED

#15 [frontend build 3/6] COPY package*.json ./
#15 DONE 0.1s

#16 [backend builder 3/5] COPY package*.json ./
#16 DONE 0.1s

#17 [backend stage-1 4/5] RUN npm install --omit=dev
#17 2.522 
#17 2.522 added 97 packages, and audited 98 packages in 2s
#17 2.522
#17 2.522 16 packages are looking for funding
#17 2.522   run `npm fund` for details
#17 2.523
#17 2.523 found 0 vulnerabilities
#17 2.524 npm notice
#17 2.524 npm notice New major version of npm available! 10.8.2 -> 11.16.0
#17 2.524 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.16.0
#17 2.524 npm notice To update run: npm install -g npm@11.16.0
#17 2.524 npm notice
#17 DONE 2.6s

#18 [frontend build 4/6] RUN npm install
#18 1.396 npm warn EBADENGINE Unsupported engine {
#18 1.396 npm warn EBADENGINE   package: '@tailwindcss/oxide@4.3.0',
#18 1.396 npm warn EBADENGINE   required: { node: '>= 20' },
#18 1.396 npm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }
#18 1.396 npm warn EBADENGINE }
#18 1.396 npm warn EBADENGINE Unsupported engine {
#18 1.396 npm warn EBADENGINE   package: '@vitejs/plugin-react@5.2.0',
#18 1.396 npm warn EBADENGINE   required: { node: '^20.19.0 || >=22.12.0' },
#18 1.396 npm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }
#18 1.396 npm warn EBADENGINE }
#18 1.398 npm warn EBADENGINE Unsupported engine {
#18 1.398 npm warn EBADENGINE   package: 'vite@7.3.5',
#18 1.398 npm warn EBADENGINE   required: { node: '^20.19.0 || >=22.12.0' },
#18 1.398 npm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }
#18 1.398 npm warn EBADENGINE }
#18 ...

#19 [backend builder 4/5] RUN npm install
#19 2.716
#19 2.716 added 126 packages, and audited 127 packages in 2s
#19 2.716
#19 2.716 20 packages are looking for funding
#19 2.716   run `npm fund` for details
#19 2.717
#19 2.717 found 0 vulnerabilities
#19 2.718 npm notice
#19 2.718 npm notice New major version of npm available! 10.8.2 -> 11.16.0
#19 2.718 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.16.0
#19 2.718 npm notice To update run: npm install -g npm@11.16.0
#19 2.718 npm notice
#19 DONE 2.8s

#20 [backend builder 5/5] COPY . .
#20 DONE 0.1s

#18 [frontend build 4/6] RUN npm install
#18 ...

#21 [backend stage-1 5/5] COPY --from=builder /app .
#21 DONE 0.2s

#22 [backend] exporting to image
#22 exporting layers
#22 exporting layers 0.5s done
#22 exporting manifest sha256:97c98bd82932f9bdc65675b13e443301d2ce32fc91f832e5eae1557ca873e377 0.0s done
#22 exporting config sha256:9f3bed086bd54574f656c35aec19d61b08db78c18f3267d5255f3cf7fc1ddcea 0.0s done
#22 exporting attestation manifest sha256:c7e05ff4abaa6047d59e2877903bb784581e03e624b838ff9336acb771f18737 0.1s done
#22 exporting manifest list sha256:ef16903d04d6c95c581f83a8f8c63375b2ac7775e7430fa5eace8d8722985f22
#22 exporting manifest list sha256:ef16903d04d6c95c581f83a8f8c63375b2ac7775e7430fa5eace8d8722985f22 0.0s done
#22 naming to docker.io/library/finaldemo-backend:latest done
#22 unpacking to docker.io/library/finaldemo-backend:latest
#22 unpacking to docker.io/library/finaldemo-backend:latest 0.4s done
#22 DONE 1.1s

#18 [frontend build 4/6] RUN npm install
#18 ...

#23 [backend] resolving provenance for metadata file
#23 DONE 0.0s

#18 [frontend build 4/6] RUN npm install
#18 42.00 
#18 42.00 added 193 packages, and audited 194 packages in 41s
#18 42.00
#18 42.00 44 packages are looking for funding
#18 42.00   run `npm fund` for details
#18 42.00 
#18 42.00 found 0 vulnerabilities
#18 DONE 42.2s

#24 [frontend build 5/6] COPY . .
#24 DONE 0.1s

#25 [frontend build 6/6] RUN npm run build
#25 0.327 
#25 0.327 > healthcare-frontend@0.0.0 build
#25 0.327 > vite build
#25 0.327
#25 0.375 You are using Node.js 18.20.8. Vite requires Node.js version 20.19+ or 22.12+. Please upgrade your Node.js version.
#25 0.583 failed to load config from /app/vite.config.js
#25 0.585 error during build:
#25 0.585 Error: Cannot find native binding. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.
#25 0.585     at Object.<anonymous> (/app/node_modules/@tailwindcss/oxide/index.js:563:11)
#25 0.585     at Module._compile (node:internal/modules/cjs/loader:1364:14)
#25 0.585     at Module._extensions..js (node:internal/modules/cjs/loader:1422:10)
#25 0.585     at Module.load (node:internal/modules/cjs/loader:1203:32)
#25 0.585     at Module._load (node:internal/modules/cjs/loader:1019:12)
#25 0.585     at ModuleWrap.<anonymous> (node:internal/modules/esm/translators:203:29)
#25 0.585     at ModuleJob.run (node:internal/modules/esm/module_job:195:25)
#25 0.585     at async ModuleLoader.import (node:internal/modules/esm/loader:337:24)
#25 0.585     at async loadConfigFromBundledFile (file:///app/node_modules/vite/dist/node/chunks/config.js:35996:12)
#25 0.585     at async bundleAndLoadConfigFile (file:///app/node_modules/vite/dist/node/chunks/config.js:35884:17)
#25 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
------
 > [frontend build 6/6] RUN npm run build:
0.585     at Object.<anonymous> (/app/node_modules/@tailwindcss/oxide/index.js:563:11)
0.585     at Module._compile (node:internal/modules/cjs/loader:1364:14)
0.585     at Module._extensions..js (node:internal/modules/cjs/loader:1422:10)
0.585     at Module.load (node:internal/modules/cjs/loader:1203:32)
0.585     at Module._load (node:internal/modules/cjs/loader:1019:12)
0.585     at ModuleWrap.<anonymous> (node:internal/modules/esm/translators:203:29)
0.585     at ModuleJob.run (node:internal/modules/esm/module_job:195:25)
0.585     at async ModuleLoader.import (node:internal/modules/esm/loader:337:24)
0.585     at async loadConfigFromBundledFile (file:///app/node_modules/vite/dist/node/chunks/config.js:35996:12)
0.585     at async bundleAndLoadConfigFile (file:///app/node_modules/vite/dist/node/chunks/config.js:35884:17)
------
[+] up 0/2
 - Image finaldemo-frontend Building                                                                                      46.6s
 - Image finaldemo-backend  Building                                                                                      46.6s
Dockerfile:18

--------------------

  16 |

  17 |     # Build the application for production

  18 | >>> RUN npm run build

  19 |

  20 |

--------------------

target frontend: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1



View build details: docker-desktop://dashboard/build/default/default/zajyn69xbadxtr9khxztej8wl
