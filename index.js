const choresEl = document.querySelector(".chores")
const choreInput = document.getElementById("chore-input")
const addChoreButton = document.getElementById("add-chore")
const removeChoresButton = document.getElementById("remove-chores")

function showEmptyImage() {
    const emptyImage = document.getElementById("empty-image")
    emptyImage.style.display = "block";
}

function hideEmptyImage() {
    const emptyImage = document.getElementById("empty-image")
    emptyImage.style.display = "none";
}

function addChoreToList(choreText) {

    const choreAlreadyExists = Array.from(choresEl.children).some(chore => {
        const choreTextElement = chore.querySelector("#chore-text")
        return choreTextElement && choreTextElement.innerText === choreText
    })

    if (choreAlreadyExists) {
        alert("Chore is already in the list!")
        choreInput.value = ""
        return;
    }

    const newChore = document.createElement('div')
    newChore.className = 'chore'
    newChore.innerHTML = `<p id="chore-text">${choreText}</p>`

    choresEl.appendChild(newChore)
    saveChores(choreText)

    choreInput.value = ""

    newChore.addEventListener("click", function () {
        choresEl.removeChild(newChore)

        removeChoreFromLocalStorage(choreText)

        if (choresEl.childElementCount === 0) {
            showEmptyImage()
        }
    })

}

addChoreButton.addEventListener("click", function () {
    addChoreToList(choreInput.value)
})

function saveChores() {
    if (addChoreButton.disabled) {
        return;
    }

    const choreText = choreInput.value


    const storedChores = JSON.parse(localStorage.getItem('chores')) || []
    storedChores.push(choreText);

    localStorage.setItem('chores', JSON.stringify(storedChores))

    choreInput.value = ""
    addChoreButton.disabled = true

}

function removeChoreFromLocalStorage(choreText) {
    const storedChores = getStoredChores()
    const updatedChores = storedChores.filter(chore => chore !== choreText)
    localStorage.setItem("chores", JSON.stringify(updatedChores))
}

function getStoredChores() {
    const storedData = localStorage.getItem("chores")

    if (storedData) {
        try {
            return JSON.parse(storedData)
        } catch (error) {
            console.error("Error parsing JSON from localStorage:", error)
            return []
        }
    }
    return []
}

function loadChores() {
    const storedChores = getStoredChores()
    storedChores.forEach(choreText => {
        addChoreToList(choreText)
    })
}


function validateInput() {
    if (choreInput.value === "") {
        addChoreButton.disabled = true
    } else {
        addChoreButton.disabled = false
    }
}

choreInput.addEventListener("input", validateInput)

window.addEventListener("beforeunload", function () {
    saveChores();
})

window.addEventListener("load", function () {
    validateInput()
    loadChores()
})


removeChoresButton.addEventListener("click", function () {
    while (choresEl.firstChild) {
        choresEl.removeChild(choresEl.firstChild)

    }
    localStorage.removeItem("chores")

    showEmptyImage()
})
