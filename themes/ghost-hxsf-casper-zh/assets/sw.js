const HOST_NAME = location.host;
const VERSION_NAME = 'CACHE-v3';
const CACHE_NAME = HOST_NAME + '-' + VERSION_NAME;
const CACHE_HOST = ['cdn.bootcss.com', 'static.hxsf.me'];

const isNeedCache = function(url) {
    var res =  CACHE_HOST.some(function(host) {
        return url.indexOf(host) !== -1;
    });
	if (url.indexOf('/ghost/api') !== -1 || url.indexOf('/ghost') == 0) {
		return false
	}
 //   console.log(url, res)
    return res;
};

const isCORSRequest = function(url, host) {
    return url.indexOf(host) === -1;
};

const isValidResponse = function(response) {
    return response && response.status < 400;
};

const handleFetchRequest = function(event) {
    var req = event.request
    if (isNeedCache(req.url) && req.method == 'GET') {
        const request = isCORSRequest(req.url, HOST_NAME) ? new Request(req.url, {mode: 'cors'}) : req;
        return caches.match(request)
            .then(function(response) {
                // Cache hit - return response directly
                if (response) {
                    // Update Cache for next time enter
                    fetch(request)
                        .then(function(response) {

                            // Check a valid response
                            if(isValidResponse(response)) {
                                caches
                                    .open(CACHE_NAME)
                                    .then(function (cache) {
                                        cache.put(request, response);
                                    });
                            } else {
                                console.error('1 Update cache ' + request.url + ' fail: ' + response.message);
                                sentMessage('Update cache ' + request.url + ' fail: ' + response.message);
                            }
                        })
                        .catch(function(err) {
                            console.error('2 Update cache ' + request.url + ' fail: ' + err.message);
                            sentMessage('Update cache ' + request.url + ' fail: ' + err.message);
                        });
                    return response;
                }

                // Return fetch response
                return fetch(request)
                    .then(function(response) {
                        // Check if we received an unvalid response
                        if(!isValidResponse(response)) {
                            return response;
                        }

                        const clonedResponse = response.clone();

                        caches
                            .open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(request, clonedResponse);
                            });

                        return response;
                    });
            });
    } else {
        return fetch(req);
    }
};


self.addEventListener('fetch', function(event) {
    try {
        event.respondWith(handleFetchRequest(event))
    } catch (e) {
        console.log(e)
        debugger
    }
})

// service-worker.js
const onActive = function(event) {
    event.waitUntil(
        caches
            .keys()
            .then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        // Remove expired cache response
                        if (CACHE_NAME.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
    );
};

//self.addEventListener('activate', onActive);

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function() { self.skipWaiting() })
            .then(function() { console.log('Install success') })
    )
})

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches
            .keys()
            .then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        // Remove expired cache response
                        if (CACHE_NAME.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName)
                        }
                    })
                )
            })
            .then(function() {
                self.clients.claim()
            })
    )
})

