// cached payloads from 'hue/{address}/key` messages
var hueKeys = {}

// cached payloads from '.../model' messages
var models = {}

// websocket connection to the back end
var ws = null

// timer used to periodically update
// the websocket status display
var wsReadyStateTimer = null

// timer used to maintain the websocket
// connection to the back end
var wsReconnectTimer = null

// initialize widgets and connect to the back end
// when the page finishes loading
document.addEventListener('DOMContentLoaded', function () {

    document.querySelector('#ws-url').value = wsURL(window.location)
    document.querySelector('#editor-link').setAttribute('href', editorURL(window.location))
    connectWS()

})

// infer the back end websocket URL from window.location
function wsURL(location) {

    const parts = /([^:]+):\/\/([^/]+)(.*)/.exec(location)

    if (Array.isArray(parts) && (parts.length == 4)) {

        const scheme = parts[1] == 'https' ? 'wss' : 'ws'
        const host = parts[2]

        return scheme + '://' + host + '/broker'

    }

    return 'ws://127.0.0.1:1880/broker'

}

// infer the Node-RED editor URL from window.location
function editorURL(location) {

    const parts = /([^:]+):\/\/([^/]+)(.*)/.exec(location)

    if (Array.isArray(parts) && (parts.length == 4)) {

        return parts[1] + '://' + parts[2] + '/'

    }

    return 'ws://127.0.0.1:1880/'

}

// remove all but the first child
// element from #controls-container
function clearDynamicControls() {

    const container = document.querySelector('#controls-container')

    while (container.childElementCount > 1) {

        container.removeChild(container.lastChild)

    }
}

// remove all children from the given element
function removeAllChildren(element) {

    while (element.firstChild) {

        element.removeChild(element.firstChild)

    }
}

// replace all current children of the given
// element with the given child
function replaceChildren(element, child) {

    removeAllChildren(element)
    element.appendChild(child)

}

// send a 'put/hue/create-key' message
// to the back end
function createHueKey(event) {

    ws.send(JSON.stringify({
        payload: event.target.value,
        topic: 'put/hue/create-key'
    }))
}

// (re-)populate #hue-bridges using
// the model received in the payload
// of a 'hue/bridges' message from
// the back end
function hueBridges(bridges) {

    const container = document.querySelector('#hue-bridges')

    removeAllChildren(container)

    for (let bridge of bridges) {

        const dl = document.createElement('dl')
        const id = 'hue-key-' + bridge.address.replace(/\./g, '-')

        for (let key in bridge) {

            const value = bridge[key]
            const dt = document.createElement('dt')
            const dd = document.createElement('dd')

            dt.textContent = key

            if (key == 'status') {

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
        keyDefinition.setAttribute('id', id)

        if (cachedKey) {

            keyDefinition.appendChild(document.createTextNode(cachedKey))

        } else {

            const button = hueKeyButton(bridge.address)
            keyDefinition.appendChild(button)

        }

        dl.appendChild(keyTerm)
        dl.appendChild(keyDefinition)
        container.appendChild(dl)

    }
}

// create a button control which sends
// a 'put/hue/create-key' message to the
// back end when clicked
function hueKeyButton(address) {

    const id = address.replace(/\./g, '-')
    const button = document.createElement('button')

    button.setAttribute('id', 'hue-create-key-' + id)
    button.setAttribute('value', address)
    button.setAttribute('onclick', 'createHueKey(event)')
    button.appendChild(document.createTextNode('Create'))
    return button

}

// send a 'put/hue/{address}/resource/grouped_light/{id}'
// message to the back end
function hueGroupChanged(event) {

    ws.send(JSON.stringify({
        payload: { on: { on: event.target.checked } },
        topic: event.target.value,
        method: 'PUT'
    }))
}

// send a 'put/hue/{address}/resource/scene/{id}'
// message to the back end
function hueSceneClicked(event) {

    const msg = {
        payload: { recall: { action: 'dynamic_palette' } },
        topic: event.target.value,
        method: 'PUT'
    }

    ws.send(JSON.stringify(msg))

}

// send a 'put/powerview/scene' message
// to the back end
function activateWindowShadesScene(event) {

    ws.send(JSON.stringify({
        payload: event.target.value,
        topic: 'put/powerview/scene'
    }))
}

// send a 'controls/refresh' message
// to the back end
function refreshControlsClicked(_event) {

    clearDynamicControls()
    models = {}
    ws.send(JSON.stringify({
        payload: new Date().getTime(),
        topic: 'controls/refresh'
    }))
}

// create a button that sends a
// 'put/powerview/scene' message
// to the back end when clicked
function powerviewSceneButton(scene) {

    const button = document.createElement('button')

    button.classList.add('control')
    button.setAttribute('onclick', 'activateWindowShadesScene(event)')
    button.setAttribute('value', scene.id)
    button.textContent = scene.name

    return button

}

// create a panel containing the dynamically
// generated controls for the window shade
// scenes in a given room based on data
// received in a 'powerview/model' message
// from the back end
function powerviewRoom(room) {

    const fieldset = document.createElement('fieldset')
    const legend = document.createElement('legend')
    const div = document.createElement('div')

    legend.textContent = room.name
    div.classList.add('horizontal-panel')
    fieldset.appendChild(legend)
    fieldset.appendChild(div)

    for (let scene of room.scenes) {

        fieldset.appendChild(powerviewSceneButton(scene))

    }

    return fieldset

}

// create all the dynamically generated controls
// specified by a 'powerview/model' message from
// the back end
function powerviewControls(msg) {

    const section = document.createElement('section')
    const heading = document.createElement('h2')

    heading.textContent = 'Window Shades'
    section.appendChild(heading)

    for (let room of msg.payload) {

        section.appendChild(powerviewRoom(room))

    }

    return section

}

// create checkbox control which will send
// a 'put/hue/{address}/resource/grouped_light/{id}`
// message to the back end when its value is changed
function hueGroupCheckbox(group) {

    const label = document.createElement('label')
    const input = document.createElement('input')
    const text = document.createTextNode('On')

    input.id = group.grouped_light.id
    input.classList.add('control')
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

// create button control which will send
// a 'put/hue/{address}/resource/scene/{id}`
// message to the back end when clicked
function hueSceneButton(scene) {

    const button = document.createElement('button')

    button.id = scene.id
    button.classList.add('control')
    button.setAttribute('value', scene.value)
    button.setAttribute('onclick', 'hueSceneClicked(event)')
    button.textContent = scene.metadata.name
    return button

}

// create all the dynamically generated controls
// for a given hue room or zone specified by data
// received in a 'hue/{address}/model' message from
// the back end
function hueGroup(group) {

    const fieldset = document.createElement('fieldset')
    const legend = document.createElement('legend')
    const div = document.createElement('div')

    div.classList.add('horizontal-panel')
    legend.textContent = group.name
    fieldset.appendChild(legend)
    fieldset.appendChild(hueGroupCheckbox(group))

    for (let scene of group.scenes) {

        div.appendChild(hueSceneButton(scene))

    }

    fieldset.appendChild(div)
    return fieldset

}

// create all the dynamically generated controls
// specified by a 'hue/{address}/model' message from
// the back end
function hueControls(msg) {

    const model = msg.payload

    const section = document.createElement('section')
    const heading = document.createElement('h2')

    heading.textContent = model.title
    section.appendChild(heading)

    for (let group of model.groups) {

        section.appendChild(hueGroup(group))

    }

    return section

}

// send a 'settings/...' message
// with a boolean payload to
// the back end 
function settingsCheckboxChanged(event) {

    ws.send(JSON.stringify({
        payload: event.target.checked,
        topic: event.target.id.replace('-', '/'),
        retain: true
    }))

}

// send a 'settings/bedtime' message
// to the back end
function bedtimeChanged(event) {

    ws.send(JSON.stringify({
        payload: event.target.value,
        topic: 'settings/bedtime',
        retain: true
    }))

}

// display the current state of
// the websocket connection to the
// back end on the dashboard
function wsReadyState() {

    const readyState = ws.readyState

    const text =
        readyState == 0 ? 'connecting' :
            readyState == 1 ? 'connected' :
                readyState == 2 ? 'disconnecting' :
                    readyState == 3 ? 'disconnected' :
                        readyState

    const span = document.createElement('span')

    span.classList.add('ws-' + text)
    span.appendChild(document.createTextNode(text))
    replaceChildren(document.querySelector("#ws-status"), span)

}

// display the given state of
// the eventsource connection to a
// hue bridge on the dashboard
function hueStatus(status) {

    const text =
        status == -1 ? 'uninitialized' :
            status == 0 ? 'connecting' :
                status == 1 ? 'connected' :
                    status == 2 ? 'disconnected' :
                        status

    const div = document.createElement('div')

    div.classList.add('hue-' + text)
    div.appendChild(document.createTextNode(text))
    return div

}

// close the websocket connection to the
// back end and stop the reconnect timer
function disconnectWS(_event) {

    if (wsReconnectTimer !== null) {

        clearInterval(wsReconnectTimer)
        wsReconnectTimer = null

    }

    ws.close()

}

// open the websocket connection to the
// back end and start the reconnect timer
function connectWS(_event) {

    // do nothing if already connecting or connected
    if (ws !== null) {

        if ((ws.readyState === 0) || (ws.readyState === 1)) {

            return

        }
    }

    // stop the current readystate timer
    if (wsReadyStateTimer !== null) {

        clearInterval(wsReadyStateTimer)
        wsReadyStateTimer = null

    }

    // stop the current reconnect timer
    if (wsReconnectTimer !== null) {

        clearInterval(wsReconnectTimer)
        wsReconnectTimer = null

    }

    // open a new websocket connection
    ws = new WebSocket(document.querySelector('#ws-url').value)

    //display the initial status
    wsReadyState()

    // start the reconnect timer
    wsReconnectTimer = setInterval(connectWS, 5000)

    // enable dashboard and dynamically generated controls
    // and start the readystate timer when the connection
    // opens
    ws.onopen = (_event) => {

        document.querySelector('#settings').disabled = false
        document.querySelector('#hue-bridges-fieldset').disabled = false
        wsReadyState()
        wsReadyStateTimer = setInterval(wsReadyState, 1000)
        models = {}

    }

    // disable dashboard and dynamically generated controls
    // and stop the readystate timer when the connection
    // closes
    ws.onclose = (_event) => {

        if (wsReadyStateTimer !== null) {

            clearInterval(wsReadyStateTimer)
            wsReadyStateTimer = null

        }

        wsReadyState()
        document.querySelector('#settings').disabled = true
        document.querySelector('#hue-bridges-fieldset').disabled = true

        // TODO: disable rather then clear as an aid in debugging
        clearDynamicControls()

        ws = null

    }

    // log websocket connection errors
    ws.onerror = (event) => {

        wsReadyState()
        console.log(event)

    }

    // handle messages received from the back end
    ws.onmessage = (event) => {

        // node-red's msg object is received via websocket's event.data
        const msg = JSON.parse(event.data)

        // display the most recent automation trigger event as an aid in debugging
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

        // display metadata and, if necessary, a button to
        // create a client application key for hue bridges
        // discovered on the network
        if (msg.topic == 'hue/bridges') {

            hueBridges(msg.payload)
            return

        }

        // update the selected bedtime
        if (msg.topic == 'settings/bedtime') {

            document.querySelector('#settings-bedtime').options[msg.payload - 21].selected = true
            return

        }

        // update shades automation value
        if (msg.topic == 'settings/shades') {

            document.querySelector('#settings-shades').checked = msg.payload
            return

        }

        // update lighting automation value
        if (msg.topic == 'settings/lighting') {

            document.querySelector('#settings-lighting').checked = msg.payload
            return

        }

        // display error messages to the user
        if (/^.+\/error$/.exec(msg.topic)) {

            console.log(msg)
            window.alert(
                msg.topic +
                ':\n' +
                JSON.stringify(msg.payload, undefined, 1))
            return

        }

        let matches = /^hue\/(.+)\/key$/.exec(msg.topic)

        // add a discovered bridge to the dashboard
        if (Array.isArray(matches) && (matches.length == 2)) {

            const address = matches[1]
            const id = '#hue-key-' + address.replace(/\./g, '-')
            const key = msg.payload
            const keyElement = document.querySelector(id)

            if (key === '') {

                delete hueKeys[address]

            } else {

                hueKeys[address] = key

            }

            if (keyElement) {

                if (key === '') {

                    keyElement.replaceChild(keyElement.firstChild, hueKeyButton(address))

                } else {

                    keyElement.textContent = key

                }
            }

            return

        }

        matches = /^daily\/(sunrise|sunset|bedtime)$/.exec(msg.topic)

        // display the latest suncalc events as an aid in debugging
        if (Array.isArray(matches) && (matches.length == 2)) {

            document.querySelector('#daily-' + matches[1]).textContent =
                new Date(msg.payload).toLocaleString()
            return

        }

        matches = /^(daily\/theme|timer\/time)$/.exec(msg.topic)

        // display the latest timer events as an aid in debugging
        if (Array.isArray(matches) && (matches.length == 2)) {

            document.querySelector('#' + matches[1].replace('/', '-')).textContent = msg.payload
            return

        }

        // handle .../model messages from here to the end of this function

        // update the generated powerview controls
        if (msg.topic == 'powerview/model') {

            models['powerview'] = powerviewControls(msg)
            // do not return here

        }

        matches = /^hue\/([^/]+)\/model$/.exec(msg.topic)

        // update the generated hue controls for the bridge with
        // the given address
        if (Array.isArray(matches) && (matches.length == 2)) {

            models[matches[1]] = hueControls(msg)
            // do not return here

        }

        // sort the sections alphabetically by their titles

        const sorted = []

        for (let label in models) {

            sorted.push(models[label])

        }

        sorted.sort((a, b) => {

            // the first child of each section is a heading whose text content
            // is the title
            return a.firstChild.textContent.localeCompare(b.firstChild.textContent)

        })

        // replace the current controls with the updated ones

        const container = document.querySelector('#controls-container')

        clearDynamicControls()

        for (let section of sorted) {

            container.appendChild(section)

        }
    }
}