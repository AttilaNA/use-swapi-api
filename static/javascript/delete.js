
function deleteFirstChildElement({parentElement: parent}) {
    parent.firstChild.remove();
}

function deleteChildElements({parentElement: parent}){
    for(let i = parent.childNodes.length - 1; i > -1; i--){
        parent.childNodes[i].remove();
    }
}

export { deleteFirstChildElement, deleteChildElements };