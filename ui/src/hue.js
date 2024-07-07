function compareNames(a, b) {
    if (!b.metadata?.name) {
        return a.metadata?.name ? -1 : 0
    }
    if (!a.metadata?.name) {
        return 1
    }
    return a.metadata.name.localeCompare(b.metadata.name)
}

function findGroupedLight(resources, group) {
    if (!resources) {
        return []
    }
    if (!group?.id) {
        return []
    }
    const groupedLights = resources.grouped_light
    if (!groupedLights) {
        return []
    }
    for (let groupedLightId of Object.getOwnPropertyNames(groupedLights)) {
        const groupedLight = groupedLights[groupedLightId]
        if (groupedLight.owner?.rid == group.id) {
            return [groupedLight]
        }
    }
    return []
}

function findLights(resources, group) {
    const result = []
    if (!group.id) {
        return result
    }
    const lights = resources.light
    if (!lights) {
        return result
    }
    for (let lightId of Object.getOwnPropertyNames(lights)) {
        const light = lights[lightId]
        const deviceId = light.owner.rid
        for (let child of group.children) {
            if (child.rid == deviceId) {
                result.push(light)
            }
        }
    }
    result.sort(compareNames)
    return result
}

function findScenes(resources, group) {
    const result = []
    if (!group.id) {
        return result
    }
    const scenes = resources.scene
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

export { compareNames, findGroupedLight, findLights, findScenes }
