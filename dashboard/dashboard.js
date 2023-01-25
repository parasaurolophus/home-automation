var hueKeys = {}
var models = {}
var ws = null
var wsReadyStateTimer = null
var wsReconnectTimer = null

document.addEventListener('DOMContentLoaded', function () {

    document.querySelector('#ws-url').value = wsURL(window.location)
    document.querySelector('#editor-link').setAttribute('href', editorURL(window.location))
    connectWS()

})

function editorURL(location) {

    const parts = /([^:]+):\/\/([^/]+)(.*)/.exec(location)

    if (Array.isArray(parts) && (parts.length == 4)) {

        return parts[1] + '://' + parts[2] + '/'

    }

    return 'ws://127.0.0.1:1880/'

}

function clearDynamicControls() {

    const container = document.querySelector('#controls-container')

    while (container.childElementCount > 1) {

        container.removeChild(container.lastChild)

    }
}

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

    const container = document.querySelector('#hue-bridges')

    removeAllChildren(container)

    for (let bridge of bridges) {

        const dl = document.createElement('dl')

        dl.classList.add('padded', 'equal')

        for (let key in bridge) {

            const value = bridge[key]
            const dt = document.createElement('dt')
            const dd = document.createElement('dd')

            dt.textContent = key

            if (key == 'status') {

                dd.classList.add('hue-status')
                dd.appendChild(hueStatus(value))

            } else {

                dd.textContent = value

            }

            dl.appendChild(dt)
            dl.appendChild(dd)

        }

        const keyTerm = document.createElement('dt')
        const keyDefinition = document.createElement('dd')
        const cachedKey = hueKeys[bridge.address]

        keyTerm.appendChild(document.createTextNode('key'))
        keyDefinition.setAttribute('id', 'hue-key-' + bridge.address.replace(/\./g, '-'))
        keyDefinition.textContent = cachedKey ? cachedKey : '\u00A0'

        dl.appendChild(keyTerm)
        dl.appendChild(keyDefinition)

        const createKeyTerm = document.createElement('dt')
        const createKeyDefinition = document.createElement('dd')
        const button = document.createElement('button')

        button.setAttribute('value', bridge.address)
        button.setAttribute('onclick', 'createHueKey(event)')
        button.appendChild(document.createTextNode('Create Key'))
        createKeyTerm.textContent = 'send command'
        createKeyDefinition.appendChild(button)
        dl.appendChild(createKeyTerm)
        dl.appendChild(createKeyDefinition)
        container.appendChild(dl)

    }
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

    clearDynamicControls()
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
    div.classList.add('wrapped')
    fieldset.appendChild(legend)
    fieldset.appendChild(div)

    for (let scene of room.scenes) {

        fieldset.appendChild(powerviewSceneButton(scene))

    }

    return fieldset

}

function powerviewControls(msg) {

    const section = document.createElement('section')
    const heading = document.createElement('h2')

    section.classList.add('equal')
    heading.textContent = 'Window Shades'
    section.appendChild(heading)

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

    div.classList.add('wrapped')
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
    const heading = document.createElement('h2')

    section.classList.add('equal')
    heading.textContent = model.title
    section.appendChild(heading)

    for (let group of model.groups) {

        section.appendChild(hueGroup(group))

    }

    return section

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

    span.classList.add('padded', 'ws-' + text)
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

    div.classList.add('padded', 'hue-' + text)
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
        document.querySelector('#hue-bridges-fieldset').disabled = false
        wsReadyState()
        wsReadyStateTimer = setInterval(wsReadyState, 1000)
        models = {}

    }

    ws.onclose = (_event) => {

        wsReadyState()
        document.querySelector('#settings').disabled = true
        document.querySelector('#hue-bridges-fieldset').disabled = true
        clearDynamicControls()

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

        if (/^.+\/error$/.exec(msg.topic)) {

            console.log(msg)
            window.alert(
                msg.topic +
                ':\n' +
                JSON.stringify(msg.payload, undefined, 1))
            return

        }

        let matches = /^hue\/(.+)\/key$/.exec(msg.topic)

        if (Array.isArray(matches) && (matches.length == 2)) {

            const address = matches[1]
            const key = msg.payload
            const element = document.querySelector('#hue-key-' + address.replace(/\./g, '-'))

            hueKeys[address] = key

            if (element) {

                element.textContent = key

            }

            return

        }

        matches = /^daily\/(sunrise|sunset|bedtime)$/.exec(msg.topic)

        if (Array.isArray(matches) && (matches.length == 2)) {

            document.querySelector('#daily-' + matches[1]).textContent = new Date(msg.payload).toLocaleString()
            return

        }

        matches = /^(daily\/theme|timer\/time)$/.exec(msg.topic)

        if (Array.isArray(matches) && (matches.length == 2)) {

            document.querySelector('#' + matches[1].replace('/', '-')).textContent = msg.payload
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

        const sorted = []

        for (let label in models) {

            sorted.push(models[label])

        }

        sorted.sort((a, b) => {

            return a.firstChild.textContent.localeCompare(b.firstChild.textContent)

        })

        const container = document.querySelector('#controls-container')

        clearDynamicControls()

        for (let section of sorted) {

            container.appendChild(section)

        }
    }
}