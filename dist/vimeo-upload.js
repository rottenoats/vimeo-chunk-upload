var VimeoUpload =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var request_1 = __webpack_require__(9);
var header_1 = __webpack_require__(10);
var response_1 = __webpack_require__(11);
var utils_1 = __webpack_require__(2);
var status_enum_1 = __webpack_require__(1);
/**
 * Created by kfaulhaber on 31/03/2017.
 */
var HttpService = (function () {
    function HttpService(maxAcceptedUploadDuration) {
        this.maxAcceptedUploadDuration = maxAcceptedUploadDuration;
    }
    HttpService.DefaultResolver = function (xhr) {
        var data = null;
        try {
            data = JSON.parse(xhr.response);
        }
        catch (e) {
            data = xhr.response;
        }
        var response = new response_1.Response(xhr.status, xhr.statusText, data);
        response.responseHeaders = xhr.getAllResponseHeaders().split("\r\n").filter(function (rawHeader) {
            return rawHeader.length > 0;
        }).map(function (rawHeader) {
            var index = rawHeader.indexOf(":");
            return new header_1.Header(rawHeader.slice(0, index).trim(), rawHeader.slice(index + 1).trim());
        });
        console.log(response.responseHeaders);
        if (xhr.status > 308) {
            response.statusCode = status_enum_1.Status.Rejected;
        }
        else {
            response.statusCode = status_enum_1.Status.Resolved;
        }
        return response;
    };
    HttpService.prototype.send = function (request, statData) {
        if (statData === void 0) { statData = null; }
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(request.method, request.url, true);
            request.headers.forEach(function (header) { return xhr.setRequestHeader(header.title, header.value); });
            xhr.onload = function () {
                if (statData !== null) {
                    statData.end = new Date();
                    statData.done = true;
                }
                var response = HttpService.DefaultResolver(xhr);
                switch (true) {
                    case response.statusCode === status_enum_1.Status.Resolved:
                        resolve(response);
                        break;
                    default:
                        reject(response);
                }
            };
            xhr.onabort = function () {
                reject(new response_1.Response(xhr.status, xhr.statusText, xhr.response));
            };
            xhr.onerror = function () {
                reject(new response_1.Response(xhr.status, xhr.statusText, xhr.response));
            };
            if (statData != null) {
                xhr.upload.addEventListener("progress", function (data) {
                    if (data.lengthComputable) {
                        statData.loaded = data.loaded;
                        statData.total = data.total;
                        statData.end = new Date();
                        //TODO: Symplify this.
                        if (utils_1.TimeUtil.TimeToSeconds(statData.end.getTime() - statData.start.getTime()) > statData.prefferedDuration * 2) {
                            statData.loaded = 0;
                            statData.total = 0;
                            statData.done = true;
                            xhr.abort();
                        }
                    }
                });
            }
            try {
                xhr.send(request.data);
            }
            catch (e) {
                console.error("An error occured while sending.", e);
            }
        });
    };
    HttpService.CreateRequest = function (method, url, data, headers) {
        if (data === void 0) { data = null; }
        if (headers === void 0) { headers = null; }
        var headerList = [];
        for (var prop in headers) {
            if (headers.hasOwnProperty(prop)) {
                headerList.push(new header_1.Header(prop, headers[prop]));
            }
        }
        return new request_1.Request(method, url, data, headerList);
    };
    return HttpService;
}());
exports.HttpService = HttpService;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Created by kfaulhaber on 26/07/2017.
 */
exports.__esModule = true;
var Status;
(function (Status) {
    Status[Status["Neutral"] = 0] = "Neutral";
    Status[Status["Rejected"] = 1] = "Rejected";
    Status[Status["Resolved"] = 2] = "Resolved";
})(Status = exports.Status || (exports.Status = {}));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Created by kfaulhaber on 17/07/2017.
 */
exports.__esModule = true;
var TimeUtil = (function () {
    function TimeUtil() {
    }
    TimeUtil.TimeToSeconds = function (time) {
        return time / 1000;
    };
    TimeUtil.TimeToString = function (time) {
        var date = new Date(null);
        date.setTime(time);
        return date.toISOString().substr(11, 8);
    };
    TimeUtil.MilisecondsToString = function (miliseconds) {
        var seconds = TimeUtil.TimeToSeconds(miliseconds);
        var date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(11, 8);
    };
    return TimeUtil;
}());
exports.TimeUtil = TimeUtil;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Created by Grimbode on 30/06/2017.
 */
exports.__esModule = true;
exports.VIMEO_ROUTES = {
    DEFAULT: function (uri) {
        if (uri === void 0) { uri = ""; }
        return "https://api.vimeo.com" + uri;
    },
    TICKET: function () { return exports.VIMEO_ROUTES.DEFAULT() + "/me/videos"; },
    VIDEOS: function (videoId) { return "" + exports.VIMEO_ROUTES.DEFAULT("/videos/" + videoId); }
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Created by kfaulhaber on 13/07/2017.
 */
exports.__esModule = true;
exports.DEFAULT_VALUES = {
    preferredUploadDuration: 20,
    chunkSize: 1024 * 1024,
    token: "TOKEN_STRING_HERE",
    supportedFiles: ["mov", "mpeg4", "mp4", "avi", "wmv", "mpegps", "flv", "3gpp", "webm"],
    name: "",
    description: "",
    file: null,
    upgrade_to_1080: false,
    timeInterval: 150,
    maxAcceptedFails: 20,
    maxAcceptedUploadDuration: 60,
    useDefaultFileName: false,
    privacy: false,
    retryTimeout: 5000
};
exports.DEFAULT_EVENTS = {
    chunkprogresschanged: function (event) { return console.log("Default: Chunk Progress Update: " + event.detail + "/100"); },
    totalprogresschanged: function (event) { return console.log("Default: Total Progress Update: " + event.detail + "/100"); },
    estimatedtimechanged: function (event) { return console.log("Default: Estimated Time Update: " + event.detail); },
    estimatedchunktimechanged: function (event) { return console.log("Default: Estimated Chunk Time Update: " + event.detail); },
    error: function () { },
    complete: function () { }
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var config_1 = __webpack_require__(4);
/**
 * Created by kfaulhaber on 17/07/2017.
 */
var EventService = (function () {
    function EventService() {
    }
    EventService.Add = function (eventName, callback) {
        window.addEventListener(eventName, callback, false);
    };
    EventService.Remove = function (eventName, callback) {
        window.removeEventListener(eventName, callback, false);
    };
    EventService.Dispatch = function (eventName, data) {
        if (data === void 0) { data = null; }
        var customEvent = new CustomEvent(eventName, { detail: data });
        window.dispatchEvent(customEvent);
    };
    EventService.Exists = function (eventName) {
        return config_1.DEFAULT_EVENTS.hasOwnProperty(eventName);
    };
    EventService.GetDefault = function (eventName) {
        return config_1.DEFAULT_EVENTS[eventName];
    };
    return EventService;
}());
exports.EventService = EventService;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var app_1 = __webpack_require__(7);
var module;
/**
 * Created by kfaulhaber on 30/06/2017.
 */
module.exports = app_1.App;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var ticket_service_1 = __webpack_require__(8);
var chunk_service_1 = __webpack_require__(13);
var upload_service_1 = __webpack_require__(15);
var config_1 = __webpack_require__(4);
var event_service_1 = __webpack_require__(5);
var validator_service_1 = __webpack_require__(16);
var media_service_1 = __webpack_require__(17);
var http_service_1 = __webpack_require__(0);
var stat_service_1 = __webpack_require__(19);
/**
 * Created by Grimbode on 12/07/2017.
 */
var App = (function () {
    function App() {
        //TODO: find a cleaner way for this
        this.failCount = 0;
    }
    //TODO: See if this should go in an init function.
    App.prototype.init = function (options) {
        if (options === void 0) { options = {}; }
        var values = {};
        for (var prop in config_1.DEFAULT_VALUES) {
            if (config_1.DEFAULT_VALUES.hasOwnProperty(prop)) {
                values[prop] = (options.hasOwnProperty(prop)) ? options[prop] : config_1.DEFAULT_VALUES[prop];
            }
        }
        this.maxAcceptedFails = values.maxAcceptedFails;
        this.httpService = new http_service_1.HttpService(values.maxAcceptedUploadDuration);
        this.mediaService = new media_service_1.MediaService(this.httpService, values.file, values.name, values.description, values.upgrade_to_1080, values.useDefaultFileName, values.private);
        this.chunkService = new chunk_service_1.ChunkService(this.mediaService, values.preferredUploadDuration, values.chunkSize);
        this.statService = new stat_service_1.StatService(values.timeInterval, this.chunkService);
        this.ticketService = new ticket_service_1.TicketService(values.token, this.httpService, values.upgrade_to_1080);
        this.uploadService = new upload_service_1.UploadService(this.mediaService, this.ticketService, this.httpService, this.statService);
        this.validatorService = new validator_service_1.ValidatorService(values.supportedFiles);
    };
    App.prototype.start = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.init(options);
        //TODO: Add error if not supported.
        if (!this.validatorService.isSupported(this.mediaService.media.file))
            return;
        this.ticketService.open()
            .then(function (response) {
            console.log(response);
            _this.ticketService.save(response);
            _this.statService.start();
            _this.process();
        })["catch"](function (error) {
            if (_this.failCount <= _this.maxAcceptedFails) {
                _this.failCount++;
                event_service_1.EventService.Dispatch("error", { message: "Error creating ticket.", error: error });
                setTimeout(function () {
                    _this.start(options);
                }, _this.retryTimeout);
            }
        });
    };
    App.prototype.process = function () {
        var _this = this;
        var chunk = this.chunkService.create();
        this.uploadService.send(chunk).then(function (response) {
            _this.chunkService.updateSize(_this.statService.getChunkUploadDuration());
            _this.check();
        })["catch"](function (error) {
            if (_this.failCount <= _this.maxAcceptedFails) {
                _this.failCount++;
                event_service_1.EventService.Dispatch("error", { message: "Error sending chunk.", error: error });
                _this.chunkService.updateSize(_this.statService.getChunkUploadDuration());
                setTimeout(function () {
                    _this.check();
                }, _this.retryTimeout);
            }
        });
    };
    App.prototype.check = function () {
        var _this = this;
        this.uploadService.getRange().then(function (response) {
            switch (response.status) {
                case 308:
                    //noinspection TypeScriptValidateTypes
                    var range = response.responseHeaders.find(function (header) {
                        if (header === null && header === undefined)
                            return false;
                        return header.title === "Range";
                    });
                    console.log(range);
                    _this.chunkService.updateOffset(range.value);
                    if (_this.chunkService.isDone()) {
                        _this.done();
                        return;
                    }
                    _this.process();
                    break;
                case 200 || 201:
                    _this.done();
                    break;
                default:
                    console.warn("Unrecognized status code (" + response.status + ") for chunk range.");
            }
        })["catch"](function (error) {
            event_service_1.EventService.Dispatch("error", { message: "Unable to get range.", error: error });
            if (_this.failCount <= _this.maxAcceptedFails) {
                _this.failCount++;
                setTimeout(function () {
                    _this.check();
                }, _this.retryTimeout);
            }
        });
    };
    App.prototype.done = function () {
        var _this = this;
        this.statService.totalStatData.done = true;
        this.ticketService.close().then(function (response) {
            _this.statService.stop();
            try {
                //noinspection TypeScriptValidateTypes
                var vimeoId = parseInt(response.responseHeaders.find(function (header) {
                    //noinspection TypeScriptValidateTypes
                    if (header === null && header === undefined)
                        return false;
                    return header.title === "Location";
                }).value.replace("/videos/", ""));
                _this.updateVideo(vimeoId);
            }
            catch (error) {
                console.log("Error retrieving Vimeo Id.");
            }
            console.log("Delete success:", response);
        })["catch"](function (error) {
            _this.statService.stop();
            event_service_1.EventService.Dispatch("error", { message: "Unable to close upload ticket.", error: error });
        });
    };
    App.prototype.updateVideo = function (vimeoId) {
        this.mediaService.updateVideoData(this.ticketService.token, vimeoId).then(function (response) {
            var meta = media_service_1.MediaService.GetMeta(vimeoId, response.data);
            event_service_1.EventService.Dispatch("complete", meta);
        })["catch"](function (error) {
            event_service_1.EventService.Dispatch("error", { message: "Unable to update video " + vimeoId + " with name and description.", error: error });
        });
    };
    App.prototype.on = function (eventName, callback) {
        if (callback === void 0) { callback = null; }
        if (!event_service_1.EventService.Exists(eventName))
            return;
        if (callback === null) {
            callback = event_service_1.EventService.GetDefault(eventName);
        }
        event_service_1.EventService.Add(eventName, callback);
    };
    App.prototype.off = function (eventName, callback) {
        if (callback === void 0) { callback = null; }
        if (!event_service_1.EventService.Exists(eventName))
            return;
        if (callback === null) {
            callback = event_service_1.EventService.GetDefault(eventName);
        }
        event_service_1.EventService.Remove(eventName, callback);
    };
    return App;
}());
exports.App = App;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var http_service_1 = __webpack_require__(0);
var ticket_1 = __webpack_require__(12);
var routes_1 = __webpack_require__(3);
/**
 * Created by kfaulhaber on 30/06/2017.
 */
var TicketService = (function () {
    function TicketService(token, httpService, upgrade_to_1080) {
        this.token = token;
        this.httpService = httpService;
        this.upgrade_to_1080 = upgrade_to_1080;
    }
    TicketService.prototype.open = function () {
        var data = { type: 'streaming' };
        if (this.upgrade_to_1080) {
            data["upgrade_to_1080"] = this.upgrade_to_1080;
        }
        var request = http_service_1.HttpService.CreateRequest("POST", routes_1.VIMEO_ROUTES.TICKET(), JSON.stringify(data), {
            Authorization: "Bearer " + this.token,
            'Content-Type': 'application/json'
        });
        return this.httpService.send(request);
    };
    TicketService.prototype.save = function (response) {
        this.ticket = new ticket_1.Ticket(response.data.upload_link_secure, response.data.ticket_id, response.data.upload_link, response.data.complete_uri, response.data.user);
    };
    TicketService.prototype.close = function () {
        var request = http_service_1.HttpService.CreateRequest("DELETE", routes_1.VIMEO_ROUTES.DEFAULT(this.ticket.completeUri), null, {
            Authorization: "Bearer " + this.token
        });
        return this.httpService.send(request);
    };
    return TicketService;
}());
exports.TicketService = TicketService;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
/**
 * Created by kfaulhaber on 17/07/2017.
 */
var Request = (function () {
    function Request(method, url, data, headers) {
        if (data === void 0) { data = null; }
        if (headers === void 0) { headers = []; }
        this.method = method;
        this.url = url;
        this.data = data;
        this.headers = headers;
    }
    return Request;
}());
exports.Request = Request;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Created by kfaulhaber on 24/07/2017.
 */
exports.__esModule = true;
var Header = (function () {
    function Header(title, value) {
        this.title = title;
        this.value = value;
    }
    return Header;
}());
exports.Header = Header;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var status_enum_1 = __webpack_require__(1);
/**
 * Created by kfaulhaber on 20/07/2017.
 */
var Response = (function () {
    function Response(status, statusText, data) {
        if (data === void 0) { data = null; }
        this.status = status;
        this.statusText = statusText;
        this.data = data;
        this.statusCode = status_enum_1.Status.Neutral;
    }
    return Response;
}());
exports.Response = Response;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Created by kfaulhaber on 13/07/2017.
 */
exports.__esModule = true;
var Ticket = (function () {
    function Ticket(uploadLinkSecure, ticketId, uploadLink, completeUri, user) {
        this.uploadLinkSecure = uploadLinkSecure;
        this.ticketId = ticketId;
        this.uploadLink = uploadLink;
        this.completeUri = completeUri;
        this.user = user;
    }
    return Ticket;
}());
exports.Ticket = Ticket;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var chunk_1 = __webpack_require__(14);
/**
 * Created by kfaulhaber on 30/06/2017.
 */
var ChunkService = (function () {
    function ChunkService(mediaService, preferredUploadDuration, size, offset) {
        if (offset === void 0) { offset = 0; }
        this.mediaService = mediaService;
        this.preferredUploadDuration = preferredUploadDuration;
        this.size = size;
        this.offset = offset;
    }
    ChunkService.prototype.updateSize = function (uploadDuration) {
        this.size = Math.floor((this.size * this.preferredUploadDuration) / uploadDuration * ChunkService.Adjuster);
    };
    ChunkService.prototype.create = function () {
        var end = Math.min(this.offset + this.size, this.mediaService.media.file.size);
        //TODO: Simplify
        if (end - this.offset !== this.size) {
            this.updateSize(end - this.offset);
        }
        var content = this.mediaService.media.file.slice(this.offset, end);
        return new chunk_1.Chunk(content, "bytes " + this.offset + "-" + end + "/" + this.mediaService.media.file.size);
    };
    ChunkService.prototype.updateOffset = function (range) {
        this.offset = parseInt(range.match(/\d+/g).pop(), 10) + 1;
    };
    ChunkService.prototype.isDone = function () {
        return this.offset >= this.mediaService.media.file.size;
    };
    ChunkService.Adjuster = 0.7;
    return ChunkService;
}());
exports.ChunkService = ChunkService;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Created by kfaulhaber on 13/07/2017.
 */
exports.__esModule = true;
var Chunk = (function () {
    function Chunk(content, contentRange) {
        this.content = content;
        this.contentRange = contentRange;
    }
    return Chunk;
}());
exports.Chunk = Chunk;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var http_service_1 = __webpack_require__(0);
/**
 * Created by kfaulhaber on 30/06/2017.
 */
var UploadService = (function () {
    function UploadService(mediaService, ticketService, httpService, statService) {
        this.mediaService = mediaService;
        this.ticketService = ticketService;
        this.httpService = httpService;
        this.statService = statService;
    }
    UploadService.prototype.send = function (chunk) {
        var statData = this.statService.create();
        this.statService.save(statData);
        var request = http_service_1.HttpService.CreateRequest("PUT", this.ticketService.ticket.uploadLinkSecure, chunk.content, {
            'Content-Type': this.mediaService.media.file.type,
            'Content-Range': chunk.contentRange
        });
        return this.httpService.send(request, statData);
    };
    UploadService.prototype.getRange = function () {
        var request = http_service_1.HttpService.CreateRequest("PUT", this.ticketService.ticket.uploadLinkSecure, null, {
            'Content-Type': this.mediaService.media.file.type,
            'Content-Range': 'bytes */* '
        });
        return this.httpService.send(request);
    };
    return UploadService;
}());
exports.UploadService = UploadService;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Created by kfaulhaber on 30/06/2017.
 */
exports.__esModule = true;
var ValidatorService = (function () {
    function ValidatorService(supportedFiles) {
        this.supportedFiles = supportedFiles;
    }
    ValidatorService.prototype.isSupported = function (file) {
        var type = file.type;
        if (type.indexOf('/') === -1) {
            console.warn("Wrong type found (" + type + ").");
            return false;
        }
        var split = type.split('/');
        if (split[0] !== "video") {
            console.warn("Only videos are supported, " + type + " given.");
            return false;
        }
        return this.supportedFiles.includes(split[1]);
    };
    return ValidatorService;
}());
exports.ValidatorService = ValidatorService;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var media_1 = __webpack_require__(18);
var http_service_1 = __webpack_require__(0);
var routes_1 = __webpack_require__(3);
/**
 * Created by kfaulhaber on 21/07/2017.
 */
var MediaService = (function () {
    function MediaService(httpService, file, name, description, upgrade_to_1080, useDefaultFileName, privacy) {
        this.httpService = httpService;
        var mediaName = (useDefaultFileName) ? file.name : name;
        this.media = new media_1.Media(mediaName, description, file, upgrade_to_1080, privacy);
        if (useDefaultFileName) {
            this.media.name = this.media.file.name;
        }
    }
    MediaService.prototype.updateVideoData = function (token, vimeoId) {
        var params = this.media.toJSON();
        var query = Object.keys(this.media.toJSON()).map(function (key) { return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]); });
        console.log("data", params, query);
        var request = http_service_1.HttpService.CreateRequest("PATCH", routes_1.VIMEO_ROUTES.VIDEOS(vimeoId), query, {
            Authorization: "Bearer " + token
        });
        return this.httpService.send(request);
    };
    MediaService.GetMeta = function (vimeoId, data) {
        return {
            id: vimeoId,
            link: data.link,
            name: data.name,
            uri: data.uri,
            createdTime: data.created_time
        };
    };
    return MediaService;
}());
exports.MediaService = MediaService;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Created by kfaulhaber on 20/07/2017.
 */
exports.__esModule = true;
var Media = (function () {
    function Media(name, description, file, upgrade_to_1080, privacy) {
        this.name = name;
        this.description = description;
        this.file = file;
        this.upgrade_to_1080 = upgrade_to_1080;
        this.privacy = privacy;
    }
    Media.prototype.toJSON = function () {
        return {
            name: this.name,
            description: this.description,
            'privacy.view': (this.privacy) ? 'nobody' : 'anybody'
        };
    };
    return Media;
}());
exports.Media = Media;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var event_service_1 = __webpack_require__(5);
var utils_1 = __webpack_require__(2);
var stat_data_1 = __webpack_require__(20);
/**
 * Created by Grimbode on 14/07/2017.
 */
var StatService = (function () {
    function StatService(timeInterval, chunkService) {
        this.timeInterval = timeInterval;
        this.chunkService = chunkService;
        this.si = -1;
        this.previousTotalPercent = 0;
    }
    StatService.prototype.start = function () {
        this.totalStatData = this.create(true);
        this.startInterval();
    };
    StatService.prototype.create = function (isTotal) {
        if (isTotal === void 0) { isTotal = false; }
        var date = new Date();
        var size = (isTotal) ? this.chunkService.mediaService.media.file.size : this.chunkService.size;
        var statData = new stat_data_1.StatData(date, date, this.chunkService.preferredUploadDuration, 0, size);
        return statData;
    };
    StatService.prototype.save = function (timeData) {
        this.chunkStatData = timeData;
    };
    StatService.prototype.calculateRatio = function (loaded, total) {
        return loaded / total;
    };
    StatService.prototype.calculatePercent = function (loaded, total) {
        return Math.floor(this.calculateRatio(loaded, total) * 100);
    };
    StatService.prototype.updateTotal = function () {
        this.totalStatData.loaded += this.chunkStatData.total;
    };
    StatService.prototype.startInterval = function () {
        var _this = this;
        if (this.si > -1) {
            this.stop();
        }
        this.si = setInterval(function () {
            var chunkPercent = _this.calculatePercent(_this.chunkStatData.loaded, _this.chunkStatData.total);
            if (_this.chunkStatData.done) {
                _this.updateTotal();
                _this.chunkStatData.total = _this.chunkStatData.loaded = 0;
                chunkPercent = 100;
            }
            _this.totalStatData.loaded = Math.max(_this.chunkService.offset, _this.totalStatData.loaded);
            _this.totalStatData.end = _this.chunkStatData.end;
            _this.previousTotalPercent = Math.max(_this.totalStatData.loaded + _this.chunkStatData.loaded, _this.previousTotalPercent);
            var totalPercent = _this.calculatePercent(_this.previousTotalPercent, _this.totalStatData.total);
            event_service_1.EventService.Dispatch("chunkprogresschanged", chunkPercent);
            if (_this.totalStatData.done) {
                totalPercent = 100;
            }
            event_service_1.EventService.Dispatch("totalprogresschanged", totalPercent);
        }, this.timeInterval);
    };
    StatService.prototype.stop = function () {
        clearInterval(this.si);
    };
    StatService.prototype.getChunkUploadDuration = function () {
        return utils_1.TimeUtil.TimeToSeconds(this.chunkStatData.end.getTime() - this.chunkStatData.start.getTime());
    };
    StatService.prototype.chunkIsOverPrefferedUploadTime = function () {
        return this.getChunkUploadDuration() >= this.chunkService.preferredUploadDuration * 1.5;
    };
    return StatService;
}());
exports.StatService = StatService;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Created by kfaulhaber on 24/07/2017.
 */
exports.__esModule = true;
var StatData = (function () {
    function StatData(start, end, prefferedDuration, loaded, total, done) {
        if (loaded === void 0) { loaded = 0; }
        if (total === void 0) { total = 0; }
        if (done === void 0) { done = false; }
        this.start = start;
        this.end = end;
        this.prefferedDuration = prefferedDuration;
        this.loaded = loaded;
        this.total = total;
        this.done = done;
    }
    return StatData;
}());
exports.StatData = StatData;


/***/ })
/******/ ]);
//# sourceMappingURL=vimeo-upload.js.map