'use strict'

function adapt(item) {
    return {
        id: +item.id,
        firstname: item.firstname,
        lastname: item.lastname,
        department: item.department,
        salary: +item.salary
    }
}

module.exports = { adapt }