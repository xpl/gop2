/*  DISCLAIMER: 90% of this shitcode was auto-generated by packager.py script [from em-dosbox distribution]
                and then edited by hand (adding resizing and configuration thingies). Sorry for the mess.
                Have fun.
 */

$(document).ready (function () {

    var statusElement = document.getElementById('status');
    var progressElement = document.getElementById('progress');

    window.Module = $singleton ({
        preRun: [],
        postRun: [],
        print: (function() {
            var element = document.getElementById('output');
            if (element) element.value = ''; // clear browser cache
            return function(text) {
                if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
                // These replacements are necessary if you render to raw HTML
                //text = text.replace(/&/g, "&amp;");
                //text = text.replace(/</g, "&lt;");
                //text = text.replace(/>/g, "&gt;");
                //text = text.replace('\n', '<br>', 'g');
                console.log(text);
                if (element) {
                    element.value += text + "\n";
                    element.scrollTop = element.scrollHeight; // focus on bottom
                }
            };
        })(),
        printErr: function(text) {
            if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
            if (0) { // XXX disabled for safety typeof dump == 'function') {
                dump(text + '\n'); // fast, straight to the real console
            }
            else {
                console.error(text);
            }
        },
        canvas: $memoized ($property (function() {

            var canvas = document.getElementById('canvas');

            $(window).resize (function () { var vpSize  = $(document.body).extent ().add (-20)
                                            var canvasSize = new Vec2 ($(canvas).integerAttr ('width')  || 640,
                                                                       $(canvas).integerAttr ('height') || 400)

                                            $(canvas).css ('transform', 'scale(' +
                                                ((vpSize.aspect > canvasSize.aspect)
                                                    ? (vpSize.y / canvasSize.y)
                                                    : (vpSize.x / canvasSize.x)) + ')') }).resize ()

            // As a default initial behavior, pop up an alert when webgl context is lost. To make your
            // application robust, you may want to override this behavior before shipping!
            // See http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15.2
            canvas.addEventListener("webglcontextlost", function(e) {
                alert('WebGL context lost. You will need to reload the page.');
                e.preventDefault();
            }, false);

            return canvas;
        })),
        setStatus: function(text) {
            if (!Module.setStatus.last) Module.setStatus.last = {
                time: Date.now(),
                text: ''
            };
            if (text === Module.setStatus.text) return;
            var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
            var now = Date.now();
            if (m && now - Date.now() < 30) return; // if this is a progress update, skip it if too soon
            if (progressElement) {
                if (m) {
                    text = m[1];
                    progressElement.value = parseInt(m[2]) * 100;
                    progressElement.max = parseInt(m[4]) * 100;
                    progressElement.hidden = false;
                }
                else {
                    progressElement.value = null;
                    progressElement.max = null;
                    progressElement.hidden = true;
                }
            }
            statusElement.innerHTML = text;
        },
        totalDependencies: 0,
        monitorRunDependencies: function(left) {
            this.totalDependencies = Math.max(this.totalDependencies, left);
            Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies - left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
        }
    });
    Module.setStatus('Downloading...');
    window.onerror = function(event) {
        // TODO: do not warn on ok events like simulating an infinite loop or exitStatus
        Module.setStatus('Exception thrown, see JavaScript console');
        Module.setStatus = function(text) {
            if (text) Module.printErr('[post-exception status] ' + text);
        };
    };

    (function() {
        var memoryInitializer = 'dosbox.html.mem';
        if (typeof Module['locateFile'] === 'function') {
            memoryInitializer = Module['locateFile'](memoryInitializer);
        }
        else if (Module['memoryInitializerPrefixURL']) {
            memoryInitializer = Module['memoryInitializerPrefixURL'] + memoryInitializer;
        }
        var xhr = Module['memoryInitializerRequest'] = new XMLHttpRequest();
        xhr.open('GET', memoryInitializer, true);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
    })();

    /*var script = document.createElement('script');
    script.src = "dosbox.js";
    document.body.appendChild(script);*/

    //$('<script src="pre.js"></script>').appendTo (document.body)
    //$('<script src="a.out.js"></script>').appendTo (document.body)
    $('<script src="dosbox.js"></script>').appendTo (document.body)

    if (!Module.expectedDataFileDownloads) {
        Module.expectedDataFileDownloads = 0;
        Module.finishedDataFileDownloads = 0;
    }
    Module.expectedDataFileDownloads++;
    (function() {
        var loadPackage = function(metadata) {

            var PACKAGE_PATH;
            if (typeof window === 'object') {
                PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
            }
            else if (typeof location !== 'undefined') {
                // worker
                PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
            }
            else {
                throw 'using preloaded data can only be done on a web page or in a web worker';
            }
            var PACKAGE_NAME = '/Users/mac/gopnik/gop2.data';
            var REMOTE_PACKAGE_BASE = 'gop2.data';
            if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
                Module['locateFile'] = Module['locateFilePackage'];
                Module.printErr('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
            }
            var REMOTE_PACKAGE_NAME = typeof Module['locateFile'] === 'function' ?
                Module['locateFile'](REMOTE_PACKAGE_BASE) :
                ((Module['filePackagePrefixURL'] || '') + REMOTE_PACKAGE_BASE);

            var REMOTE_PACKAGE_SIZE = metadata.remote_package_size;
            var PACKAGE_UUID = metadata.package_uuid;

            function fetchRemotePackage(packageName, packageSize, callback, errback) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', packageName, true);
                xhr.responseType = 'arraybuffer';
                xhr.onprogress = function(event) {
                    var url = packageName;
                    var size = packageSize;
                    if (event.total) size = event.total;
                    if (event.loaded) {
                        if (!xhr.addedTotal) {
                            xhr.addedTotal = true;
                            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
                            Module.dataFileDownloads[url] = {
                                loaded: event.loaded,
                                total: size
                            };
                        }
                        else {
                            Module.dataFileDownloads[url].loaded = event.loaded;
                        }
                        var total = 0;
                        var loaded = 0;
                        var num = 0;
                        for (var download in Module.dataFileDownloads) {
                            var data = Module.dataFileDownloads[download];
                            total += data.total;
                            loaded += data.loaded;
                            num++;
                        }
                        total = Math.ceil(total * Module.expectedDataFileDownloads / num);
                        if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
                    }
                    else if (!Module.dataFileDownloads) {
                        if (Module['setStatus']) Module['setStatus']('Downloading data...');
                    }
                };
                xhr.onload = function(event) {
                    var packageData = xhr.response;
                    callback(packageData);
                };
                xhr.send(null);
            };

            function handleError(error) {
                console.error('package error:', error);
            };

            var fetched = null,
                fetchedCallback = null;
            fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
                if (fetchedCallback) {
                    fetchedCallback(data);
                    fetchedCallback = null;
                }
                else {
                    fetched = data;
                }
            }, handleError);

            function runWithFS() {

                function assert(check, msg) {
                    if (!check) throw msg + new Error().stack;
                }

                function DataRequest(start, end, crunched, audio) {
                    this.start = start;
                    this.end = end;
                    this.crunched = crunched;
                    this.audio = audio;
                }
                DataRequest.prototype = {
                    requests: {},
                    open: function(mode, name) {
                        this.name = name;
                        this.requests[name] = this;
                        Module['addRunDependency']('fp ' + this.name);
                    },
                    send: function() {},
                    onload: function() {
                        var byteArray = this.byteArray.subarray(this.start, this.end);

                        this.finish(byteArray);

                    },
                    finish: function(byteArray) {
                        var that = this;
                        Module['FS_createPreloadedFile'](this.name, null, byteArray, true, true, function() {
                            Module['removeRunDependency']('fp ' + that.name);
                        }, function() {
                            if (that.audio) {
                                Module['removeRunDependency']('fp ' + that.name); // workaround for chromium bug 124926 (still no audio with this, but at least we don't hang)
                            }
                            else {
                                Module.printErr('Preloading file ' + that.name + ' failed');
                            }
                        }, false, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
                        this.requests[this.name] = null;
                    },
                };

                var files = metadata.files;
                for (i = 0; i < files.length; ++i) {
                    new DataRequest(files[i].start, files[i].end, files[i].crunched, files[i].audio).open('GET', files[i].filename);
                }


                function processPackageData(arrayBuffer) {
                    Module.finishedDataFileDownloads++;
                    assert(arrayBuffer, 'Loading data file failed.');
                    assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
                    var byteArray = new Uint8Array(arrayBuffer);
                    var curr;

                    // Reuse the bytearray from the XHR as the source for file reads.
                    DataRequest.prototype.byteArray = byteArray;

                    _.each (metadata.files, function (file) { var request = DataRequest.prototype.requests[file.filename]
                        if (file.overrideContents) {
                            request.finish (file.overrideContents.bytes)
                        } else {
                            request.onload() } })

                    Module['removeRunDependency']('datafile_/Users/mac/gopnik/gop2.data');

                };
                Module['addRunDependency']('datafile_/Users/mac/gopnik/gop2.data');

                if (!Module.preloadResults) Module.preloadResults = {};

                Module.preloadResults[PACKAGE_NAME] = {
                    fromCache: false
                };
                if (fetched) {
                    processPackageData(fetched);
                    fetched = null;
                }
                else {
                    fetchedCallback = processPackageData;
                }

            }
            if (Module['calledRun']) {
                runWithFS();
            }
            else {
                if (!Module['preRun']) Module['preRun'] = [];
                Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
            }

        }


        ini = function (sections) {
            return _.map (sections, function (params, sectionName) {
                return sectionName.quote ('[]') + '\n' +
                        _.map (_.pairs (params), _.joinsWith ('=')).join ('\n') }).join ('\n\n') }

         loadPackage({
             "files": [{
                 "audio": "0",
                 "start": 0,
                 "crunched": "0",
                 "end": 6148,
                 "filename": "/.DS_Store"
             }, {
                 "audio": "0",
                 "start": 6148,
                 "crunched": "0",
                 "end": 6148,
                 "filename": "/dosbox.conf",
                 "overrideContents": ini ({
                    dos: {
                        keyboardlayout: 'RU' },
                    dosbox: {
                        machine: 'svga_s3' },
                    render: {
                        aspect: 'false',
                        scaler: 'none' } })
             }, {
                 "audio": "0",
                 "start": 6148,
                 "crunched": "0",
                 "end": 65933,
                 "filename": "/gop2.exe"
             }, {
                 "audio": "0",
                 "start": 65933,
                 "crunched": "0",
                 "end": 68851,
                 "filename": "/gop2.st"
             }, {
                 "audio": "0",
                 "start": 68851,
                 "crunched": "0",
                 "end": 72147,
                 "filename": "/readme.txt"
             }],
             "remote_package_size": 72147,
             "package_uuid": "e3b67d55-ecb6-40ed-99af-09635ad5c4ab"
         });

    })();

    Module['arguments'] = ['./gop2.exe'];
})