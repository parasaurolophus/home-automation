var hueBridgeStatus = {}
var models = {}
var ws = null
var wsReadyStateTimer = null
var wsReconnectTimer = null

function wsURL(location) {

    const parts = /([^:]+):\/\/([^/]+)(.*)/.exec(location)

    if (Array.isArray(parts) && (parts.length == 4)) {

        const scheme = parts[1] == 'https' ? 'wss' : 'ws'
        const host = parts[2]

        return scheme + '://' + host + '/broker'

    }

    return 'ws://127.0.0.1:1880/broker'

}

function createHueKey(event) {

    const msg = {
        payload: event.target.value,
        topic: 'put/hue/create-key'
    }

    ws.send(JSON.stringify(msg))

}

function hueBridges(bridges) {

    let content = '<table>'

    content += '<tr>'
    content += '<th>id</th>'
    content += '<th>name</th>'
    content += '<th>model</th>'
    content += '<th>host</th>'
    content += '<th>address</th>'
    content += '<th>port</th>'
    content += '<th>status</th>'
    content += '<th>&nbsp;</th>'
    content += '</tr>'

    for (let bridge of bridges) {

        content += '<tr>'
        content += '<td>' + bridge.id + '</td>'
        content += '<td>' + bridge.name + '</td>'
        content += '<td>' + bridge.model + '</td>'
        content += '<td>' + bridge.host + '</td>'
        content += '<td>' + bridge.address + '</td>'
        content += '<td>' + bridge.port + '</td>'
        content += '<td class="centered">' + hueStatus(bridge.status) + '</td>'
        content +=
            '<td><button onclick="createHueKey(event)" value="' +
            bridge.address +
            '">create key</button></td>'
        content += '</tr>'

    }

    content += '</table>'
    document.querySelector('#hue-bridges').innerHTML = content

}

function hueGroupChanged(event) {

    const msg = {
        payload: { on: { on: event.target.checked } },
        topic: event.target.value,
        method: 'PUT'
    }

    ws.send(JSON.stringify(msg))

}

function hueSceneClicked(event) {

    const msg = {
        payload: { recall: { action: 'dynamic_palette' } },
        topic: event.target.value,
        method: 'PUT'
    }

    ws.send(JSON.stringify(msg))

}

function activateWindowShadesScene(event) {

    const msg = { payload: event.target.value, topic: 'put/powerview/scene' }

    ws.send(JSON.stringify(msg))

}

function refreshControlsClicked(_event) {

    const msg = {
        payload: new Date().getTime(),
        topic: 'controls/refresh'
    }

    models = {}
    ws.send(JSON.stringify(msg))
}

function powerviewSceneButton(scene) {

    return '<button onclick="activateWindowShadesScene(event)" value="' +
        scene.id +
        '">' +
        scene.name +
        '</button>'

}

function powerviewRoom(room) {

    let controls = '<fieldset>'

    controls += '<legend>' + room.name + '</legend>'
    controls += '<div class="wrapped">'

    for (let scene of room.scenes) {

        controls += powerviewSceneButton(scene)

    }

    controls += '</div></fieldset>'
    return controls

}

function powerviewControls(msg) {

    let controls = '<section class="padded"><h3>Window Shades</h3>'

    if (msg.info) {

        controls +=
            '<div class="info">' +
            msg.info +
            '</div>'

    }

    for (let room of msg.payload) {

        controls += powerviewRoom(room)

    }

    controls += '</section>'
    return controls

}

function hueGroupCheckbox(group) {

    let controls = '<input type="checkbox" id="' +
        group.grouped_light.id +
        '" value="' +
        group.value +
        '" ' +
        (group.grouped_light.on.on ? 'checked' : '') +
        ' onchange="hueGroupChanged(event)" />'

    controls += '<label for="' + group.grouped_light.id + '">On</label>'

    return controls

}

function hueSceneButton(scene) {

    return '<button onclick="hueSceneClicked(event)" id="' +
        scene.id +
        '" value="' +
        scene.value +
        '">' +
        scene.metadata.name +
        '</button>'

}

function hueGroup(group) {

    let controls = '<fieldset>'

    controls += '<legend>' + group.name + '</legend>'
    controls += hueGroupCheckbox(group)
    controls += '<div class="wrapped">'


    for (let scene of group.scenes) {

        controls += hueSceneButton(scene)

    }

    controls += '</div></fieldset>'
    return controls

}

function hueControls(msg) {

    const model = msg.payload

    let controls =
        '<section class="padded"><h3>' +
        model.title +
        '</h3>'

    if (msg.info) {

        controls +=
            '<div class="info">' +
            msg.info +
            '</div>'

    }

    for (let group of model.groups) {

        controls += hueGroup(group)

    }

    controls += '</section>'
    return controls

}

function settingsCheckboxChanged(event) {

    const msg = {
        payload: event.target.checked,
        topic: event.target.id.replace('-', '/'),
        retain: true
    }

    ws.send(JSON.stringify(msg))

}

function bedtimeChanged(event) {

    const msg = {
        payload: event.target.value,
        topic: 'settings/bedtime',
        retain: true
    }

    ws.send(JSON.stringify(msg))

}

function wsReadyState() {

    let readyState = ws.readyState

    let text =
        readyState == 0 ? 'connecting' :
            readyState == 1 ? 'connected' :
                readyState == 2 ? 'disconnecting' :
                    readyState == 3 ? 'disconnected' :
                        readyState

    let content =
        '<span class="padded ws-' +
        text +
        '">' +
        text +
        '</span>'

    document.querySelector("#ws-status").innerHTML = content

}

function hueStatus(status) {

    let text =
        status == -1 ? 'uninitialized' :
            status == 0 ? 'connecting' :
                status == 1 ? 'connected' :
                    status == 2 ? 'disconnected' :
                        status

    return '<div class="padded hue-' +
        text +
        '">' +
        text +
        '</div>'


}

function escapeHTML(unescaped) {

    let escaped = unescaped.replace('&', '&amp;')

    escaped = escaped.replace('<', '&lt;')
    escaped = escaped.replace('>', '&gt;')
    escaped = escaped.replace('"', '&quot;')
    return escaped

}

function disconnectWS(_event) {

    if (wsReconnectTimer !== null) {

        clearInterval(wsReconnectTimer)
        wsReconnectTimer = null

    }

    ws.close()

}

function connectWS(_event) {

    if (ws !== null) {

        if ((ws.readyState === 0) || (ws.readyState === 1)) {

            return

        }
    }

    if (wsReadyStateTimer !== null) {

        clearInterval(wsReadyStateTimer)
        wsReadyStateTimer = null

    }

    ws = new WebSocket(document.querySelector('#ws-url').value)
    wsReadyState()
    wsReconnectTimer = setInterval(connectWS, 5000)

    ws.onopen = (_event) => {

        document.querySelector('#settings').disabled = false
        document.querySelector('#hue-bridges-fields').disabled = false
        wsReadyState()
        wsReadyStateTimer = setInterval(wsReadyState, 1000)
        models = {}

    }

    ws.onclose = (_event) => {

        wsReadyState()
        document.querySelector('#settings').disabled = true
        document.querySelector('#hue-bridges-fields').disabled = true
        document.querySelector('#controls-container').innerHTML = '<p>none</p>'

    }

    ws.onerror = (event) => {

        wsReadyState()
        console.log(event)

    }

    ws.onmessage = (event) => {

        // node-red's msg object is received via websocket's event.data
        const msg = JSON.parse(event.data)

        if (msg.topic == 'automation/trigger') {

            msg.payload.timestamp = new Date(msg.payload.timestamp).toLocaleString()
            document.querySelector('#automation-trigger').innerHTML =
                '<div><div>Automation trigger:</div><pre>' +
                escapeHTML(JSON.stringify(msg.payload, undefined, 1)) +
                '</pre></div>'
            return

        }

        if (msg.topic == 'hue/bridges') {

            hueBridges(msg.payload)
            return

        }

        if (msg.topic == 'settings/bedtime') {

            document.querySelector('#settings-bedtime').options[msg.payload - 21].selected = true
            return

        }

        if (msg.topic == 'settings/shades') {

            document.querySelector('#settings-shades').checked = msg.payload
            return

        }

        if (msg.topic == 'settings/lighting') {

            document.querySelector('#settings-lighting').checked = msg.payload
            return

        }

        let matches = /^daily\/(sunrise|sunset|bedtime)$/.exec(msg.topic)

        if (Array.isArray(matches) && (matches.length == 2)) {

            document.querySelector('#daily-' + matches[1]).textContent = new Date(msg.payload).toLocaleString()
            return

        }

        matches = /^(daily\/theme|timer\/time)$/.exec(msg.topic)

        if (Array.isArray(matches) && (matches.length == 2)) {

            document.querySelector('#' + matches[1].replace('/', '-')).textContent = msg.payload
            return

        }

        matches = /^hue\/([^/]+)\/key$/.exec(msg.topic)

        if (Array.isArray(matches) && (matches.length == 2)) {

            console.log(msg)
            document.querySelector('#hue-key').innerHTML =
                '<p>Key for Hue Bridge at ' +
                msg.bridgeAddress +
                ':</p><pre>' +
                JSON.stringify(msg.payload, undefined, 1) +
                '</pre>'
            return

        }

        if (/^.+\/error$/.exec(msg.topic)) {

            console.log(msg)
            window.alert(JSON.stringify(msg, undefined, 1))
            return

        }

        // handle .../model messages from here to the end of this function

        if (msg.topic == 'powerview/model') {

            models['powerview'] = powerviewControls(msg)
            // do not return here

        }

        matches = /^hue\/([^/]+)\/model$/.exec(msg.topic)

        if (Array.isArray(matches) && (matches.length == 2)) {

            models[matches[1]] = hueControls(msg)
            // do not return here

        }

        let content = ''

        for (let label in models) {

            content += models[label]

        }

        document.querySelector('#controls-container').innerHTML = content

    }
}