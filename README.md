# home-automation

Node-RED based home automation system

> **Note:** these flows use features introduced in Node-RED version 3.0,
> including wire junctions and dynamic links. They will not load
> correctly into earlier versions of Node-RED.

## About

These flows implement more sophisticated time-based automation than is
supported directly by popular home automation platforms or the native
apps supplied by Philips and Hunter-Douglas. For example, they activate
different seasonal lighting themes automatically based on the
date. They also drive window shade automation based on the sun's
position over the course of a day based on the geographic location
of the home and the day of the year.

## Dependencies

The following node packages must be installed before loading these
flows into your environment:

- [node-red-node-discovery](https://flows.nodered.org/node/node-red-node-discovery)
- [@parasaurolophus/node-red-eventsource](https://flows.nodered.org/node/@parasaurolophus/node-red-eventsource)

In addition, some `function` nodes in these flows load the
[suncalc](https://www.npmjs.com/package/suncalc) package dynamically,
which must be enabled in _settings.js_ (true by default).

## Configuration

These flow assume a certain amount of configuration, both in
_settings.js_ and via environment variables (e.g.
_~/.node-red/environment_ or globally in the host operating
system's shell).

### Settings

Some non-default options must be configured by editing Node-RED's
_settings.js_

#### File System Context Store Named "file"

```
contextStorage: {
      default: "memoryOnly",
      memoryOnly: { module: 'memory' },
      file: { module: 'localfilesystem' }
  },
```

#### Static HTTP Content

For example, if you use Node-RED's _projects_ feature to clone these
flows from GitHub:

```
httpStatic: [
//    {path: '/home/nol/pics/',    root: "/img/"}, 
    {path: '/home/<user>/.node-red/projects/automation/dashboard/', root: "/dashboard/"}, 
],
```

where `<user>` is the name of user as whom the Node-RED service is
running.

### Environment

These flows rely on some sensitive configuration data provided via
environment variables, e.g. by adding them to
`~/.node-red/environment`:

| Environment Variable       | Description                                                                      |
|----------------------------|----------------------------------------------------------------------------------|
| `LATITUDE`                 | Coordinate for use with [suncalc](https://www.npmjs.com/package/suncalc)         |
| `LONGITUDE`                | Coordinate for use with [suncalc](https://www.npmjs.com/package/suncalc)         |
| `GROUND_FLOOR_HUE_ADDRESS` | IP address of the Hue Bridge controlling devices on the ground floor             |
| `GROUND_FLOOR_HUE_KEY`     | API access token for the ground floor Hue Bridge                                 |
| `BASEMENT_HUE_ADDRESS`     | IP address of the Hue Bridge controlling devices in the basement                 |
| `BASEMENT_HUE_KEY`         | API access token for the basement Hue Bridge                                     |
| `POWERVIEW_ADDRESS`        | IP address of the PowerView hub                                                  |

There are two configuraton properties per Hue bridge: its address and
access token for use by Node-RED. These flows include a browser-based
user interface for creating such access tokens.

## Features

- Local control of Philips Hue lighting and Hunter-Douglas (PowerView)
  window coverings using the API's published by their respective
  hubs

- Dynamically created dashboard controls for individual device groups
  and scenes created by querying the Hue and PowerView hubs

- Home automation driven by date, time and the position of the sun
  over the course of each day of the year

- Support multiple Hue hubs concurrently

The implementation of these  features provides practical demonstrations
of a number of basic software-engineering concepts such as event-driven
programming and data-driven user interfaces. It also serves as a
repository of examples of a number of techniques specific to Node-RED as
a home automation platform and how it interoperates with underlying
technologies such as WebSockets, JavaScript embedded in HTML and so on.

## Requirements

The goals for these flows include:

1. More sophisticated automation rules than supported directly by
   the native apps and off-the-shelf "smart home" platforms supplied
   by companies like Philips, Hunter-Douglas, Apple, Google, Amazon,
   Samsung etc.

2. Support a consolidated user interface easily accessible by anyone
   in the home, including guests, without having to own a specific
   make of mobile device, install specific apps, be granted explicit
   network access or create accounts with any so-called "cloud services"

3. Eliminate the use of third-party "clouds" to the greatest degree
   possible due to performance, reliability, security and privacy
   concerns

The home in question has a number of "smart" devices from multiple
manufacturers, none of which come with any ability to interoperate
directly with one another. Home automation platforms from companies like
Apple, Google and Amazon are woefully inadequate in many respects, and
each requires anyone attempting to do things as simple as turning on and
off lights to have a specific app, with a properly configured account,
with that account given pretty much _carte blanche_ authority to do
anything it likes to every aspect of the "smart" home, mediated by
"cloud services" owned and operated by third-parties with their own
agendas that trump any consideration of their customers' seucirty or
privacy.

Using Node-RED allows for a fairly intuitive user interface that can be
accessed with no more specialized an app than a web browser. Further,
Node-RED can be programmed to do anything that can be accomplished in a
general-purpose programming language, JavaScript, rather than being
constrained by the features made available at the whim of companies
more interested in extending their surveillance and control over their
"walled gardens" than in providing useful products and services.

## User interface

These flows do not directly implement any user interface within
Node-RED. Instead, they asynchronously send event messages and receive
command messages using WebSocket nodes configured to "listen to" the
URI `/broker`. In addition to and separate from _flows.json_, the GitHub
repository for these flows includes a file, _dashboard/index.html_,
which implements a "single page web application" that connects to
the `/broker` WebSocket listener in Node-RED using embedded JavaScript.
This allows for a complete separation between the _view_ implemented in
_index.html_, the _model_ transmitted as WebSocket message payloads and
Node-RED as the _controller_ in the so-called MVC (Model, View,
Controller) architectural pattern. The result is that these flows
display a consolidated user interface for controlling diverse devices
from multiple vendors without having to be edited whenever those
devices' configuration is changed in their respective native apps. They
do this using features directly supported by modern web browsers without
requiring the intermingling of front-end and back-end logic directly
within the Node-RED flows. This is why these flows have no dependency)
on _node-red-dashboard_ nor any of the community supported packages
intended to replace it. All of the functionality that would be supplied
any such package is entirely encapsulated within the
_dashboard/index.html_ file that is downloaded from GitHub when cloning
these flows. With the appropriate configuration of _settings.js_ as
described above, you can access _dashboard/index.html_ using Node-RED's
built-in web server and the web page will automatically deduce the
correct URL with which to connect to the `/broker` WebSocket server.