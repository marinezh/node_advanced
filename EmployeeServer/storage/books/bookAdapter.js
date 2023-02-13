'use strict'

function adapt(item) {
    return Object.assign(item, {
        number: +item.number
    });

}

module.exports = { adapt }