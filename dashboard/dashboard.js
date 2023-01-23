var hueKeys = {}
var models = {}
var ws = null
var wsReadyStateTimer = null
var wsReconnectTimer = null

document.addEventListener('DOMContentLoaded', function () {

    document.querySelector('#ws-url').value = wsURL(window.location)
    connectWS()

})

function removeAllChildren(element) {

    while (element.firstChild) {

        element.removeChild(element.firstChild)

    }
}

function replaceChildren(element, child) {

    removeAllChildren(element)
    element.appendChild(child)

}

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

    ws.send(JSON.stringify({
        payload: event.target.value,
        topic: 'put/hue/create-key'
    }))
}

function hueBridges(bridges) {

    const div = document.createElement('div')

    for (let bridge of bridges) {

        const dl = document.createElement('dl')

        for (let key in bridge) {

            const value = bridge[key]
            const dt = document.createElement('dt')
            const dd = document.createElement('dd')

            dt.textContent = key

            if (key == 'status') {

                dd.className = 'hue-status'
                dd.appendChild(hueStatus(value))

            } else {

                dd.textContent = value

            }

            dl.appendChild(dt)
            dl.appendChild(dd)

        }

        const dt = document.createElement('dt')
        const dd = document.createElement('dd')
        const button = document.createElement('button')

        button.setAttribute('value', bridge.address)
        button.setAttribute('onclick', 'createHueKey(event)')
        button.appendChild(document.createTextNode('Create Key'))
        dt.textContent = 'send command'
        dd.appendChild(button)
        dl.appendChild(dt)
        dl.appendChild(dd)
        div.appendChild(dl)

    }

    const container = document.querySelector('#hue-bridges')

    replaceChildren(container, div)
    return container

}

function hueGroupChanged(event) {

    ws.send(JSON.stringify({
        payload: { on: { on: event.target.checked } },
        topic: event.target.value,
        method: 'PUT'
    }))
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

    ws.send(JSON.stringify({
        payload: event.target.value,
        topic: 'put/powerview/scene'
    }))
}

function refreshControlsClicked(_event) {

    removeAllChildren(document.querySelector('#controls-container'))
    models = {}
    ws.send(JSON.stringify({
        payload: new Date().getTime(),
        topic: 'controls/refresh'
    }))
}

function powerviewSceneButton(scene) {

    const button = document.createElement('button')

    button.setAttribute('onclick', 'activateWindowShadesScene(event)')
    button.setAttribute('value', scene.id)
    button.textContent = scene.name

    return button

}

function powerviewRoom(room) {

    const fieldset = document.createElement('fieldset')
    const legend = document.createElement('legend')
    const div = document.createElement('div')

    legend.textContent = room.name
    div.className = 'wrapped'
    fieldset.appendChild(legend)
    fieldset.appendChild(div)

    for (let scene of room.scenes) {

        fieldset.appendChild(powerviewSceneButton(scene))

    }

    return fieldset

}

function powerviewControls(msg) {

    const section = document.createElement('section')
    const heading = document.createElement('h3')

    heading.textContent = 'Window Shades'
    section.appendChild(heading)
    section.className = 'padded'
    appendInfo(section, msg)

    for (let room of msg.payload) {

        section.appendChild(powerviewRoom(room))

    }

    return section

}

function hueGroupCheckbox(group) {

    const label = document.createElement('label')
    const input = document.createElement('input')
    const text = document.createTextNode('On')

    input.id = group.grouped_light.id
    input.setAttribute('type', 'checkbox')
    input.setAttribute('value', group.value)
    input.setAttribute('onchange', 'hueGroupChanged(event)')

    if (group.grouped_light.on.on) {

        input.setAttribute('checked', true)

    }

    label.className = 'padded'
    label.appendChild(input)
    label.appendChild(text)
    return label

}

function hueSceneButton(scene) {

    const button = document.createElement('button')

    button.id = scene.id
    button.setAttribute('value', scene.value)
    button.setAttribute('onclick', 'hueSceneClicked(event)')
    button.textContent = scene.metadata.name
    return button

}

function hueGroup(group) {

    const fieldset = document.createElement('fieldset')
    const legend = document.createElement('legend')
    const div = document.createElement('div')

    div.className = 'wrapped'
    legend.textContent = group.name
    fieldset.appendChild(legend)
    fieldset.appendChild(hueGroupCheckbox(group))

    for (let scene of group.scenes) {

        div.appendChild(hueSceneButton(scene))

    }

    fieldset.appendChild(div)
    return fieldset

}

function hueControls(msg) {

    const model = msg.payload

    const section = document.createElement('section')
    const heading = document.createElement('h3')

    section.className = 'padded'
    heading.textContent = model.title
    section.appendChild(heading)
    appendInfo(section, msg)

    for (let group of model.groups) {

        section.appendChild(hueGroup(group))

    }

    return section

}

function appendInfo(section, msg) {

    if (msg.info) {

        const info = document.createElement('div')

        info.className = 'info'
        info.textContent = msg.info
        section.appendChild(info)

    }
}

function settingsCheckboxChanged(event) {

    ws.send(JSON.stringify({
        payload: event.target.checked,
        topic: event.target.id.replace('-', '/'),
        retain: true
    }))

}

function bedtimeChanged(event) {

    ws.send(JSON.stringify({
        payload: event.target.value,
        topic: 'settings/bedtime',
        retain: true
    }))

}

function wsReadyState() {

    const readyState = ws.readyState

    const text =
        readyState == 0 ? 'connecting' :
            readyState == 1 ? 'connected' :
                readyState == 2 ? 'disconnecting' :
                    readyState == 3 ? 'disconnected' :
                        readyState

    const span = document.createElement('span')

    span.className = 'padded ws-' + text
    span.appendChild(document.createTextNode(text))
    replaceChildren(document.querySelector("#ws-status"), span)

}

function hueStatus(status) {

    const text =
        status == -1 ? 'uninitialized' :
            status == 0 ? 'connecting' :
                status == 1 ? 'connected' :
                    status == 2 ? 'disconnected' :
                        status

    const div = document.createElement('div')

    div.className = 'padded hue-' + text
    div.appendChild(document.createTextNode(text))
    return div

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

            const container = document.querySelector('#automation-trigger')
            const div1 = document.createElement('div')
            const div2 = document.createElement('div')
            const pre = document.createElement('pre')

            pre.textContent = JSON.stringify(msg.payload, undefined, 1)
            div2.appendChild(pre)
            div1.appendChild(document.createTextNode('Automation trigger:'))
            div1.appendChild(div2)

            replaceChildren(container, div1)
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

            hueKeys[msg.bridgeAddress] = msg.payload

            const dl = document.createElement('dl')

            for (let address in hueKeys) {

                const dt = document.createElement('dt')
                const dd = document.createElement('dd')

                dt.appendChild(document.createTextNode(address))
                dd.appendChild(document.createTextNode(hueKeys[address]))
                dl.appendChild(dt)
                dl.appendChild(dd)

            }

            replaceChildren(document.querySelector('#hue-key'), dl)
            return

        }

        if (/^.+\/error$/.exec(msg.topic)) {

            console.log(msg)
            window.alert(
                msg.topic +
                ':\n' +
                JSON.stringify(msg.payload, undefined, 1))
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

        const container = document.querySelector('#controls-container')

        removeAllChildren(container)

        for (let label in models) {

            container.appendChild(models[label])

        }
    }
}