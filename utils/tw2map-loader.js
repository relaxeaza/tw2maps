/*
    data.villages {
        x: {
            y: [ id, name, points, player_id ],
            ...
        },
        ...
    }

    data.playerVillages {
        player_id: [ [ x, y ], ... ],
        ...
    }

    data.players {
        player_id: [ name, points, tribe_id? ]
    }

    data.tribes {
        tribe_id: [ name, tag, points ]
    }
*/

var getWorldData = (function () {
    var socketService = injector.get('socketService')
    var eventTypeProvider = injector.get('eventTypeProvider')
    var routeProvider = injector.get('routeProvider')
    var $rootScope = angular.element(document).scope()

    // settings
    var allowBarbarians
    var includeVillagePerPlayer
    var finishCallback = function () {}

    var data = {
        villages: {},
        playerVillages: {},
        players: {},
        tribes: {}
    }

    var BLOCK_SIZE = 50
    var MAP_SIZE = 1000
    var LAST_BLOCK = MAP_SIZE - BLOCK_SIZE

    var x = 0
    var y = 0

    function loadMapBlock (x, y, blockSize, callback) {
        socketService.emit(routeProvider.MAP_GETVILLAGES, {
            x: x,
            y: y,
            width: blockSize,
            height: blockSize
        }, callback)
    }

    function hasPlayer (pid) {
        return !!data.players.hasOwnProperty(pid)
    }

    function hasTribe (tid) {
        return tid && !!data.tribes.hasOwnProperty(tid)
    }

    function setTribe (v) {
        data.tribes[v.tribe_id] = [
            v.tribe_name,
            v.tribe_tag,
            v.tribe_points
        ]
    }


    function setPlayer (v, pid, tid) {
        data.players[pid] = [
            v.character_name,
            v.character_points
        ]

        if (tid) {
            data.players[pid].push(tid)
        }
    }

    function setVillage (v) {
        data.villages[v.x] = data.villages[v.x] || {}

        data.villages[v.x][v.y] = [
            v.id,
            v.name,
            v.points,
            v.character_id || 0
        ]
    }

    function processData (raw) {
        raw.villages.forEach(function (v) {
            if (!allowBarbarians && !v.character_id) {
                return false
            }

            var pid = v.character_id
            var tid = v.tribe_id

            setVillage(v)

            if (pid) {
                if (!hasPlayer(pid)) {
                    setPlayer(v, pid, tid)
                }

                if (!hasTribe(tid)) {
                    setTribe(v, tid)
                }
            }
        })
    }

    function finalProcess () {
        for (var pid in data.players) {
            data.playerVillages[pid] = []
        }

        for (var x in data.villages) {
            for (var y in data.villages[x]) {
                var v = data.villages[x][y]

                if (!v[3]) {
                    continue
                }

                data.playerVillages[v[3]].push([
                    parseInt(x, 10),
                    parseInt(y, 10)
                ])
            }
        }
    }

    function handleLoop () {
        loadMapBlock(x, y, BLOCK_SIZE, function (raw) {
            console.log(raw.x, raw.y)

            if (raw.x === LAST_BLOCK) {
                x = 0
                y += BLOCK_SIZE
            } else {
                x += BLOCK_SIZE
            }

            if (raw.villages.length) {
                processData(raw)
            }

            // last block finished
            if (raw.x === LAST_BLOCK && raw.y === LAST_BLOCK) {
                if (includeVillagePerPlayer) {
                    finalProcess()
                }

                return finishCallback(data)
            }

            handleLoop()
        })
    }

    function getData () {
        return data
    }

    function start (settings, onFinish) {
        settings = settings || {}
        allowBarbarians = settings.allowBarbarians || false
        includeVillagePerPlayer = settings.includeVillagePerPlayer || true
        finishCallback = onFinish || function () {}

        handleLoop()
    }

    return {
        getData: getData,
        start: start
    }
})()

getWorldData.start({
    allowBarbarians: true,
    includeVillagePerPlayer: true
}, function onFinish (data) {
    console.log('finished')

    var ta = document.createElement('textarea')
    ta.style.position = 'absolute'
    ta.style.left = '10px'
    ta.style.right = '10px'
    ta.style.zIndex = '999999999'
    ta.style.width = '100px'
    ta.style.height = '100px'
    document.body.appendChild(ta)

    ta.value = JSON.stringify(data)
})