function ajaxGet (url, callback) {
    var xhr = new XMLHttpRequest()
    
    xhr.open('GET', url, 1)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    
    xhr.onreadystatechange = function () {
        xhr.readyState > 3 && callback(xhr.responseText, xhr)
    }

    xhr.send()
}

var isMobile = (function () {
    var check = false
    ;(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera)
    return check
})()

var DATA

var tooltipController = (function () {
    var $tooltip = document.getElementById('tooltip')
    var visible = false
    var initialized = false
    var enabled = true

    function init () {
        initialized = true

        if (!isMobile) {
            document.body.addEventListener('mousemove', function (e) {
                $tooltip.style.left = 15 + e.pageX + 'px'
                $tooltip.style.top = 5 + e.pageY + 'px'
            })
        }
    }

    function show () {
        if (!enabled) {
            return
        }

        visible = true
        $tooltip.style.display = 'block'
    }

    function hide () {
        if (!enabled) {
            return
        }

        visible = false
        $tooltip.style.display = 'none'
    }

    function data (village, player, tribe) {
        var html = ''

        html += village.name + ' (' + village.x + '|' + village.y + ') | ' + village.points + ' pts'
        
        if (player) {
            html += '<br>'
            html += player[0] + ' | ' + player[1] + ' pts'
        }

        if (tribe) {
            html += '<br>'
            html += tribe[1] + ' | ' + tribe[2] + ' pts'
        }

        $tooltip.innerHTML = html
    }

    function isInitialized () {
        return !!initialized
    }

    function disable () {
        enabled = false
    }

    function enable () {
        enabled = true
    }

    return {
        init: init,
        show: show,
        hide: hide,
        data: data,
        isInitialized: isInitialized,
        enable: enable,
        disable: disable
    }
})()

var customController = (function () {
    var $input = document.querySelector('#custom input') 
    var $list = document.querySelector('#custom ul')
    var $color = document.querySelector('#color')
    var $add = document.querySelector('#add')
    var $elems = {}

    function init () {
        $input.addEventListener('keydown', function (event) {
            if (event.keyCode === 13) {
                if (!pass()) {
                    return
                }

                add($input.value)
                mapController.renderCache()
            }
        })

        $add.addEventListener('click', function () {
            if (!pass()) {
                return
            }

            add($input.value)
            mapController.renderCache()
        })
    }

    function pass() {
        if ($input.value.length < 3) {
            alert('É preciso pelo menos 3 caracteres!')
            return false
        }

        return true
    }

    function detectCategory (id) {
        return id.length === 3 ? 'tribes' : 'players'
    }

    function add (id, color) {
        color = color || '#' + $color.value

        var category = detectCategory(id)
        var idLower = id.toLowerCase()

        if (idLower in $elems) {
            remove(category, idLower)
        }

        var $item = document.createElement('li')
        $item.innerHTML = '<div class="color" style="background:' + color + '"></div> <span class="id">' + id + '</span>'
        $list.appendChild($item)

        $item.addEventListener('click', function () {
            remove(category, id)
            mapController.renderCache()
        })

        $elems[idLower] = $item
        mapController.addCustom(category, id, color)

        $input.value = ''
    }

    function remove (category, id) {
        $elems[id.toLowerCase()].remove()
        mapController.removeCustom(category, id)
    }

    return {
        init: init,
        add: add,
        remove: remove
    }
})()

var mapController = (function () {
    var baseCanvas = document.getElementById('map')
    var baseCtx = baseCanvas.getContext('2d')
    var baseCacheCanvas = document.createElement('canvas')
    var baseCacheCtx = baseCacheCanvas.getContext('2d')
    var overlayCanvas = document.getElementById('overlay')
    var overlayCtx = overlayCanvas.getContext('2d')
    var coordsElem = document.getElementById('coords')

    var initialized = false
    var villageSize
    var villageMargin
    var villageBlock
    var mouseCoordX
    var mouseCoordY
    var centerCoordX = 500
    var centerCoordY = 500
    var hoverVillage
    var freezeState = false
    var frameSize = {}
    var currentPosition = {}
    var reInitTimeout

    var customColors = {
        players: {},
        tribes: {}
    }

    function init (_villageSize, _villageMargin, startX, startY) {
        if (!initialized) {
            window.addEventListener('resize', function () {
                clearTimeout(reInitTimeout)

                reInitTimeout = setTimeout(function () {
                    var x = Math.floor(currentPosition.x / villageBlock)
                    var y = Math.floor(currentPosition.y / villageBlock)

                    init(villageSize, villageMargin, x, y)
                }, 100)
            })

            window.addEventListener('mousewheel', function (e) {
                if (e.wheelDeltaY > 0) {
                    if (villageSize >= 10) {
                        return
                    }

                    villageSize++
                } else {
                    if (villageSize <= 1) {
                        return
                    }

                    villageSize--
                }

                console.log(villageSize)

                villageBlock = villageSize + villageMargin
                currentPosition.x = centerCoordX * villageBlock
                currentPosition.y = centerCoordY * villageBlock

                renderCache()
            })
        }

        initialized = true
        frameSize = { x: window.innerWidth, y: window.innerHeight }
        villageSize = _villageSize || (isMobile ? 6 : 4)
        villageMargin = _villageMargin || 1
        villageBlock = villageSize + villageMargin

        currentPosition.x = (startX || 500) * villageBlock
        currentPosition.y = (startY || 500) * villageBlock

        baseCanvas.width = frameSize.x
        baseCanvas.height = frameSize.y
        baseCtx.imageSmoothingEnabled = false

        overlayCanvas.width = frameSize.x
        overlayCanvas.height = frameSize.y
        overlayCtx.imageSmoothingEnabled = false

        baseCacheCanvas.width = 1000 * villageBlock
        baseCacheCanvas.height = 1000 * villageBlock
        baseCacheCtx.imageSmoothingEnabled = false

        mouseToCoordsWatcher()
        renderCache()
        dragMapWatcher()

        overlayCanvas.addEventListener('mouseleave', function () {
            tooltipController.hide()
        })

        function renderLoop () {
            mapController.renderBase()
            mapController.renderOverlay()
            window.requestAnimationFrame(renderLoop);
        }

        window.requestAnimationFrame(renderLoop)
    }

    function freeze () {
        freezeState = true
    }

    function unfreeze () {
        freezeState = false
    }

    function dragMapWatcher () {
        var draggable = false
        var dragStart = {}

        function start (e) {
            tooltipController.disable()
            tooltipController.hide()
            freeze()

            if (!hoverVillage) {
                document.body.style.cursor = 'move'
            }

            var pageX = isMobile ? e.touches[0].pageX : e.pageX
            var pageY = isMobile ? e.touches[0].pageY : e.pageY

            draggable = true
            dragStart = {
                x: currentPosition.x + pageX,
                y: currentPosition.y + pageY
            }
        }

        function end (e) {
            tooltipController.enable()

            if (hoverVillage) {
                tooltipController.show()
            }

            unfreeze()
            document.body.style.cursor = ''
            draggable = false
            dragStart = {}
        }

        function move (e) {
            if (!draggable) return
            document.body.style.cursor = 'move'
            currentPosition.x = (dragStart.x - e.pageX)
            currentPosition.y = (dragStart.y - e.pageY)
            updateCoordsCenter()
        }

        function mobileMove (e) {
            if (!draggable) return
            currentPosition.x = (dragStart.x - e.touches[0].pageX)
            currentPosition.y = (dragStart.y - e.touches[0].pageY)
            updateCoordsCenter()
        }

        if (isMobile) {
            overlayCanvas.addEventListener('touchstart', start, {passive: true})
            overlayCanvas.addEventListener('touchend', end)
            overlayCanvas.addEventListener('touchmove', mobileMove, {passive: true})
        } else {
            overlayCanvas.addEventListener('mousedown', start)
            overlayCanvas.addEventListener('mouseup', end)
            overlayCanvas.addEventListener('mousemove', move)
        }
    }

    function updateCoordsCenter () {
        var positionCorrection = getPositionCorrection()
        centerCoordX = Math.floor((positionCorrection.x + (frameSize.x / 2)) / villageBlock)
        centerCoordY = Math.floor((positionCorrection.y + (frameSize.y / 2)) / villageBlock)
        
        coordsElem.innerHTML = centerCoordX + '|' + centerCoordY
    }

    function mouseToCoordsWatcher () {
        function triggerCoordEvents () {
            var inX = DATA.villages[mouseCoordX]

            if (inX) {
                var inY = DATA.villages[mouseCoordX][mouseCoordY]

                if (inY) {
                    return onHoverVillage(inY, mouseCoordX, mouseCoordY)
                }
            }

            return onBlurVillage()
        }

        function move (e) {
            var x = isMobile ? e.touches[0].pageX : e.pageX
            var y = isMobile ? e.touches[0].pageY : e.pageY

            var positionCorrection = getPositionCorrection()

            mouseCoordX = Math.floor((positionCorrection.x + x) / villageBlock)
            mouseCoordY = Math.floor((positionCorrection.y + y) / villageBlock)

            triggerCoordEvents()
        }

        if (isMobile) {
            overlayCanvas.addEventListener('touchmove', move, {passive: true})
            overlayCanvas.addEventListener('touchstart', move, {passive: true})
        } else {
            overlayCanvas.addEventListener('mousemove', move)
        }
    }

    function setPointerCursor () {
        document.body.style.cursor = 'pointer'
    }

    function unsetPointerCursor () {
        document.body.style.cursor = ''
    }

    function onHoverVillage (village, villageX, villageY) {
        if (freezeState) {
            return false
        }

        if (hoverVillage && hoverVillage.x === villageX && hoverVillage.y === villageY) {
            return false
        }

        hoverVillage = {
            name: village[1],
            points: village[2],
            pid: village[3],
            x: villageX,
            y: villageY
        }

        var player = DATA.players[village[3]]
        var tribe = player ? DATA.tribes[player[2]] : false

        if (tooltipController.isInitialized()) {
            tooltipController.data(hoverVillage, player, tribe)
            tooltipController.show()
        }

        clearOverlay()
        renderOverlay()
        setPointerCursor()
    }

    function onBlurVillage () {
        if (freezeState) {
            return false
        }

        if (!hoverVillage) {
            return false
        }

        hoverVillage = false

        if (tooltipController.isInitialized()) {
            tooltipController.hide()
        }

        clearOverlay()
        unsetPointerCursor()
    }

    function getPositionCorrection () {
        var x = currentPosition.x - (frameSize.x / 2)
        var y = currentPosition.y - (frameSize.y / 2)

        return {
            x: x,
            y: y
        }
    }

    function renderCache () {
        clearCache()
        renderGrid()

        for (var x in DATA.villages) {
            var xVillages = DATA.villages[x]

            for (var y in xVillages) {
                var village = xVillages[y]
                var player = DATA.players[village[3]]

                if (player) {
                    var playerLowerCase = player[0].toLowerCase()
                    var tribe = player[2] ? DATA.tribes[player[2]] : false
                    var tribeLowerCase = tribe ? tribe[1].toLowerCase() : false
                }

                if (!player) {
                    baseCacheCtx.fillStyle = '#4c6f15'
                } else if (playerLowerCase in customColors.players) {
                    baseCacheCtx.fillStyle = customColors.players[playerLowerCase].color
                } else if (tribe && tribeLowerCase in customColors.tribes) {
                    baseCacheCtx.fillStyle = customColors.tribes[tribeLowerCase].color
                } else {
                    baseCacheCtx.fillStyle = '#823c0a'
                }

                baseCacheCtx.fillRect(
                    x * villageBlock,
                    y * villageBlock,
                    villageSize,
                    villageSize )
            }
        }
    }

    function renderGrid () {
        var lineSize = 1000 * villageBlock

        baseCacheCtx.fillStyle = 'rgba(0,0,0,0.3)'

        for (var i = 0; i < 11; i++) {
            if (i !== 0) {
                baseCacheCtx.fillRect(i * 100 * villageBlock - 1, 0, 1, lineSize)
                baseCacheCtx.fillRect(0, i * 100 * villageBlock - 1, lineSize, 1)
            } else {
                baseCacheCtx.fillRect(0, 0, 1, lineSize)
                baseCacheCtx.fillRect(0, 0, lineSize, 1)
            }
        }

        baseCacheCtx.fillStyle = 'rgba(0,0,0,0.1)'

        for (var i = 1; i < 100; i++) {
            baseCacheCtx.fillRect(i * 10 * villageBlock - 1, 0, 1, lineSize)
            baseCacheCtx.fillRect(0, i * 10 * villageBlock - 1, lineSize, 1)
        }
    }

    function renderBase () {
        clearBase()
        var positionCorrection = getPositionCorrection()
        baseCtx.drawImage(baseCacheCanvas, -(positionCorrection.x), -(positionCorrection.y))
    }

    function renderOverlay () {
        clearOverlay()

        if (!hoverVillage) {
            return false
        }

        renderVillageBorder()

        if (!hoverVillage.pid) {
            return false
        }

        var villages = DATA.playerVillages[hoverVillage.pid]
        var positionCorrection = getPositionCorrection()

        overlayCtx.fillStyle = 'white'

        villages.forEach(function (village) {
            overlayCtx.fillRect(
                village[0] * villageBlock - positionCorrection.x,
                village[1] * villageBlock - positionCorrection.y,
                villageSize,
                villageSize )
        })
    }

    function renderVillageBorder () {
        var positionCorrection = getPositionCorrection()

        var hoverVillageX = mouseCoordX * villageBlock - positionCorrection.x - 1
        var hoverVillageY = mouseCoordY * villageBlock - positionCorrection.y - 1
        var hoverVillageSize = villageSize + 2
        
        overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        overlayCtx.fillRect(hoverVillageX, hoverVillageY - 1, hoverVillageSize, 1)
        overlayCtx.fillRect(hoverVillageX + hoverVillageSize, hoverVillageY, 1, hoverVillageSize)
        overlayCtx.fillRect(hoverVillageX, hoverVillageY + hoverVillageSize, hoverVillageSize, 1)
        overlayCtx.fillRect(hoverVillageX - 1, hoverVillageY, 1, hoverVillageSize)
    }

    function clearBase () {
        baseCtx.clearRect(0, 0, baseCanvas.width, baseCanvas.height)
    }

    function clearOverlay () {
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
    }

    function clearCache () {
        baseCacheCtx.clearRect(0, 0, baseCacheCanvas.width, baseCacheCanvas.height)
    }

    function addCustom (category, id, color) {
        customColors[category][id.toLowerCase()] = {
            caseId: id,
            color: color
        }
    }

    function removeCustom (category, id) {
        delete customColors[category][id.toLowerCase()]
    }

    return {
        init: init,
        renderBase: renderBase,
        renderOverlay: renderOverlay,
        renderCache: renderCache,
        addCustom: addCustom,
        removeCustom: removeCustom
    }
})()

ajaxGet('br20.json', function (data) {
    DATA = JSON.parse(data)

    document.querySelector('#loading').style.display = 'none'

    mapController.init()
    tooltipController.init()
    customController.init()

    customController.add('S.F', 'blue')
    customController.add('ACD', '#00a0f4')
    customController.add('ACA', '#00a0f4')
    customController.add('U.M', 'red')
    // mapController.renderCache()


})
