///////////////////////////////////////////////////////////////////////////////
// exported
///////////////////////////////////////////////////////////////////////////////

function findGroupedLight(bridge, group) {

    if (!bridge) {

        return
    }

    if (!group?.id) {

        return undefined
    }

    const groupedLights = bridge.grouped_light

    if (!groupedLights) {

        return undefined
    }

    for (let groupedLightId of Object.getOwnPropertyNames(groupedLights)) {

        const groupedLight = groupedLights[groupedLightId]

        if (groupedLight.owner?.rid == group.id) {

            return groupedLight
        }
    }

    return undefined
}

function findScenes(bridge, group) {

    const result = []

    if (!group.id) {

        return result
    }

    const scenes = bridge.scene

    if (!scenes) {

        return result
    }

    for (let sceneId of Object.getOwnPropertyNames(scenes)) {

        const scene = scenes[sceneId]

        if (scene.group?.rid == group.id) {

            result.push(scene)
        }
    }

    result.sort(compareNames)
    return result
}

///////////////////////////////////////////////////////////////////////////////
// private
///////////////////////////////////////////////////////////////////////////////

function compareNames(a, b) {

    if (!b.metadata?.name) {

        return a.metadata?.name ? -1 : 0
    }

    if (!a.metadata?.name) {

        return 1
    }

    return a.metadata.name.localeCompare(b.metadata.name)
}

export { findGroupedLight, findScenes }
