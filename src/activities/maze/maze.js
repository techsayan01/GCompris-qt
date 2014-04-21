/* GCompris - maze.js
*
* Copyright (C) 2014 Stephane Mankowski <stephane@mankowski.fr>
*
* Authors:
*   Bastiaan Verhoef <b.f.verhoef@student.utwente.nl> (GTK+ version)
*   Stephane Mankowski <stephane@mankowski.fr> (Qt Quick port)
*
*   This program is free software; you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation; either version 3 of the License, or
*   (at your option) any later version.
*
*   This program is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
*   You should have received a copy of the GNU General Public License
*   along with this program; if not, see <http://www.gnu.org/licenses/>.
*/
var url = "qrc:/gcompris/src/activities/maze/resource/"
var currentLevel = 0
var numberOfLevel = 20
var items
var relativeMode
var invisibleMode

var NORTH = 1
var WEST = 2
var SOUTH = 4
var EAST = 8
var SET = 16

var mazeColumns = 0
var mazeRows = 0
var maze = 0

function start(items_, relativeMode_, invisibleMode_) {
    items = items_
    relativeMode = relativeMode_
    invisibleMode = invisibleMode_
    currentLevel = 0
    initLevel()
}

function stop() {}

function initLevel() {
    items.wallVisible = !invisibleMode
    items.bar.level = currentLevel + 1

    /* Set main variables */
    if (currentLevel + 1 == 1) {
        mazeColumns = 4
        mazeRows = 4
    } else if (currentLevel + 1 == 2) {
        mazeColumns = 5
        mazeRows = 4
    } else if (currentLevel + 1 == 3) {
        mazeColumns = 5
        mazeRows = 5
    } else if (currentLevel + 1 == 4) {
        mazeColumns = 6
        mazeRows = 5
    } else if (currentLevel + 1 == 5) {
        mazeColumns = 6
        mazeRows = 6
    } else if (currentLevel + 1 == 6) {
        mazeColumns = 6
        mazeRows = 7
    } else if (currentLevel + 1 == 7) {
        mazeColumns = 7
        mazeRows = 7
    } else if (currentLevel + 1 == 8) {
        mazeColumns = 8
        mazeRows = 7
    } else if (currentLevel + 1 == 9) {
        mazeColumns = 8
        mazeRows = 8
    } else if (currentLevel + 1 == 10) {
        mazeColumns = 9
        mazeRows = 8
    } else if (currentLevel + 1 == 11) {
        mazeColumns = 9
        mazeRows = 9
    } else if (currentLevel + 1 == 12) {
        mazeColumns = 10
        mazeRows = 9
    } else if (currentLevel + 1 == 13) {
        mazeColumns = 10
        mazeRows = 10
    } else if (currentLevel + 1 == 14) {
        mazeColumns = 8
        mazeRows = 16
    } else if (currentLevel + 1 == 15) {
        mazeColumns = 14
        mazeRows = 14
    } else if (currentLevel + 1 == 16) {
        mazeColumns = 16
        mazeRows = 15
    } else if (currentLevel + 1 == 17) {
        mazeColumns = 17
        mazeRows = 16
    } else if (currentLevel + 1 == 18) {
        mazeColumns = 18
    } else if (currentLevel + 1 == 19) {
        mazeColumns = 19
        mazeRows = 18
    } else if (currentLevel + 1 == 20) {
        mazeColumns = 19
        mazeRows = 19
    }

    items.fastMode = (currentLevel + 1 >= 14)

    items.mazeRows = mazeRows
    items.mazeColumns = mazeColumns

    /* Build maze */
    maze = []
    for (var id = 0; id < mazeColumns * mazeRows; ++id) {
        maze[id] = 15
    }

    /* Generate maze */
    generateMaze(Math.floor(Math.random() * mazeColumns),
                 Math.floor(Math.random() * mazeRows))

    /* Remove set */
    for (id = 0; id < mazeColumns * mazeRows; ++id) {
        maze[id] = maze[id] ^ SET
    }

    /* Set maze */
    items.mazeRepeater = maze

    /* Set initial position of player */
    items.playerx = 0
    items.playery = Math.floor(Math.random() * mazeRows)

    /* Set position of door */
    items.doory = Math.floor(Math.random() * mazeRows)
}

function getId(x, y) {
    return x + y * mazeColumns
}

function check(x, y) {
    if (maze[getId(x, y)] & SET)
        return 1
    return 0
}

function isPossible(x, y) {
    var wall = maze[getId(x, y)]
    var pos = []
    wall = wall ^ SET
    pos[0] = 0
    if (x === 0) {
        wall = wall ^ WEST
    }
    if (y === 0) {
        wall = wall ^ NORTH
    }
    if (x === mazeColumns - 1) {
        wall = wall ^ EAST
    }
    if (y === mazeRows - 1) {
        wall = wall ^ SOUTH
    }
    if (wall & EAST) {
        if (check(x + 1, y) === 0) {
            pos[0] = pos[0] + 1
            pos[pos[0]] = EAST
        }
    }
    if (wall & SOUTH) {
        if (check(x, y + 1) === 0) {
            pos[0] = pos[0] + 1
            pos[pos[0]] = SOUTH
        }
    }
    if (wall & WEST) {
        if (check(x - 1, y) === 0) {
            pos[0] = pos[0] + 1
            pos[pos[0]] = WEST
        }
    }
    if (wall & NORTH) {
        if (check(x, y - 1) === 0) {
            pos[0] = pos[0] + 1
            pos[pos[0]] = NORTH
        }
    }
    return pos
}

function generateMaze(x, y) {
    maze[getId(x, y)] = maze[getId(x, y)] + SET
    var po = isPossible(x, y)
    while (po[0] > 0) {
        var ran = po[Math.floor(Math.random() * po[0]) + 1]
        switch (ran) {
        case EAST:
            maze[getId(x, y)] = maze[getId(x, y)] ^ EAST
            maze[getId(x + 1, y)] = maze[getId(x + 1, y)] ^ WEST
            generateMaze(x + 1, y)
            break
        case SOUTH:
            maze[getId(x, y)] = maze[getId(x, y)] ^ SOUTH
            maze[getId(x, y + 1)] = maze[getId(x, y + 1)] ^ NORTH
            generateMaze(x, y + 1)
            break
        case WEST:
            maze[getId(x, y)] = maze[getId(x, y)] ^ WEST
            maze[getId(x - 1, y)] = maze[getId(x - 1, y)] ^ EAST
            generateMaze(x - 1, y)
            break
        case NORTH:
            maze[getId(x, y)] = maze[getId(x, y)] ^ NORTH
            maze[getId(x, y - 1)] = maze[getId(x, y - 1)] ^ SOUTH
            generateMaze(x, y - 1)
            break
        }
        po = isPossible(x, y)
    }
}

function nextLevel() {
    if (numberOfLevel <= ++currentLevel) {
        currentLevel = 0
    }
    initLevel()
}

function previousLevel() {
    if (--currentLevel < 0) {
        currentLevel = numberOfLevel - 1
    }
    initLevel()
}

function getMaze() {
    return maze
}

function autoMove(direction) {
    var number = 0
    var result = 0
    if (direction !== WEST && !(maze[getId(items.playerx,
                                           items.playery)] & EAST)) {
        number++
        result |= EAST
    }
    if (direction !== EAST && !(maze[getId(items.playerx,
                                           items.playery)] & WEST)) {
        number++
        result |= WEST
    }
    if (direction !== NORTH && !(maze[getId(items.playerx,
                                            items.playery)] & SOUTH)) {
        number++
        result |= SOUTH
    }
    if (direction !== SOUTH && !(maze[getId(items.playerx,
                                            items.playery)] & NORTH)) {
        number++
        result |= NORTH
    }
    if (number == 1) {
        if (items.playery !== items.doory
                || items.playerx !== mazeColumns - 1) {
            switch (result) {
            case EAST:
                ++items.playerx
                autoMove(EAST)
                break
            case WEST:
                --items.playerx
                autoMove(WEST)
                break
            case NORTH:
                --items.playery
                autoMove(NORTH)
                break
            case SOUTH:
                ++items.playery
                autoMove(SOUTH)
                break
            }
        }
    }
}

function processPressedKey(event) {
    /* Mode invisible */
    if (invisibleMode && event.key === Qt.Key_Space) {
        items.wallVisible = !items.wallVisible
        items.message.text = qsTr("Look at your position, then switch back to invisible mode to continue your moves")
        items.message.visible = items.wallVisible
    }

    /* Move the player */
    if ((!invisibleMode || !items.wallVisible)
            && (items.playery !== items.doory
                || items.playerx !== mazeColumns - 1)) {
        if (relativeMode) {
            /* Relative mode */
            switch (event.key) {
            case Qt.Key_Right:
                if (items.playerState === "DIREAST")
                    items.playerState = "DIRSOUTH"
                else if (items.playerState === "DIRSOUTH")
                    items.playerState = "DIRWEST"
                else if (items.playerState === "DIRWEST")
                    items.playerState = "DIRNORTH"
                else
                    items.playerState = "DIREAST"
                event.accepted = true
                break
            case Qt.Key_Left:
                if (items.playerState === "DIREAST")
                    items.playerState = "DIRNORTH"
                else if (items.playerState === "DIRNORTH")
                    items.playerState = "DIRWEST"
                else if (items.playerState === "DIRWEST")
                    items.playerState = "DIRSOUTH"
                else
                    items.playerState = "DIREAST"
                event.accepted = true
                break
            case Qt.Key_Up:
                if (items.playerState === "DIREAST") {
                    if (!(maze[getId(items.playerx, items.playery)] & EAST)) {
                        ++items.playerx
                        if (items.fastMode) {
                            autoMove(EAST)
                        }
                    } else {
                        items.playBrick.play()
                    }
                } else if (items.playerState === "DIRNORTH") {
                    if (!(maze[getId(items.playerx, items.playery)] & NORTH)) {
                        --items.playery
                        if (items.fastMode) {
                            autoMove(NORTH)
                        }
                    } else {
                        items.playBrick.play()
                    }
                } else if (items.playerState === "DIRWEST") {
                    if (!(maze[getId(items.playerx, items.playery)] & WEST)) {
                        --items.playerx
                        if (items.fastMode) {
                            autoMove(WEST)
                        }
                    } else {
                        items.playBrick.play()
                    }
                } else {
                    if (!(maze[getId(items.playerx, items.playery)] & SOUTH)) {
                        ++items.playery
                        if (items.fastMode) {
                            autoMove(SOUTH)
                        }
                    } else {
                        items.playBrick.play()
                    }
                }

                event.accepted = true
                break
            case Qt.Key_Down:
                if (items.playerState === "DIREAST")
                    items.playerState = "DIRWEST"
                else if (items.playerState === "DIRNORTH")
                    items.playerState = "DIRSOUTH"
                else if (items.playerState === "DIRWEST")
                    items.playerState = "DIREAST"
                else
                    items.playerState = "DIRNORTH"
                event.accepted = true
            }
        } else {
            /* Absolute mode */
            switch (event.key) {
            case Qt.Key_Right:
                items.playerState = "DIREAST"
                if (!(maze[getId(items.playerx, items.playery)] & EAST)) {
                    ++items.playerx
                    if (items.fastMode) {
                        autoMove(EAST)
                    }
                } else {
                    items.playBrick.play()
                }
                event.accepted = true
                break
            case Qt.Key_Left:
                items.playerState = "DIRWEST"
                if (!(maze[getId(items.playerx, items.playery)] & WEST)) {
                    --items.playerx
                    if (items.fastMode) {
                        autoMove(WEST)
                    }
                } else {
                    items.playBrick.play()
                }
                event.accepted = true
                break
            case Qt.Key_Up:
                items.playerState = "DIRNORTH"
                if (!(maze[getId(items.playerx, items.playery)] & NORTH)) {
                    --items.playery
                    if (items.fastMode) {
                        autoMove(NORTH)
                    }
                } else {
                    items.playBrick.play()
                }
                event.accepted = true
                break
            case Qt.Key_Down:
                items.playerState = "DIRSOUTH"
                if (!(maze[getId(items.playerx, items.playery)] & SOUTH)) {
                    ++items.playery
                    if (items.fastMode) {
                        autoMove(SOUTH)
                    }
                } else {
                    items.playBrick.play()
                }
                event.accepted = true
            }
        }
    }

    /* Check if success */
    if (items.playery === items.doory && items.playerx === mazeColumns - 1) {
        items.bonus.good("lion")
    }
}