const choresList = document.querySelector(".chores-list")
const choreInput = document.getElementById("chore-input")
const addChoreButton = document.getElementById("add-chore")
const clearChoresButton = document.getElementById("clear-chores")
const choresFinished = document.getElementById("chores-finished")

function showChoresFinished() {
    const randomImage = getRandomImage()
    const imageURL = `/images/${randomImage}.webp`
    choresFinished.src = imageURL
    choresFinished.style.display = "block"
}

function hideChoresFinished() {
    choresFinished.style.display = "none";
}

function getRandomImage() {
    const imagesInFolder = 4
    return Math.floor(Math.random() * imagesInFolder) + 1
}

function addChoreToList(choreText) {

    const choreAlreadyExists = Array.from(choresList.children).some(chore => {
        const choreTextElement = chore.querySelector("#chore-text")
        return choreTextElement && choreTextElement.innerText === choreText
    })

    if (choreAlreadyExists) {
        alert("Chore is already in the list!")
        choreInput.value = ""
        return
    }

    hideChoresFinished()

    const newChore = document.createElement('div')
    newChore.className = 'chore'
    newChore.innerHTML = `<p id="chore-text">${choreText}</p>`

    choresList.appendChild(newChore)
    saveChoresToLocalStorage(choreText)
    clearChoresButton.disabled = false

    choreInput.value = ""

    newChore.addEventListener("click", function () {
        choresList.removeChild(newChore)

        removeChoreFromLocalStorage(choreText)

        if (choresList.childElementCount === 0) {
            showChoresFinished()
            clearChoresButton.disabled = true
        }
    })

}

addChoreButton.addEventListener("click", function () {
    addChoreToList(choreInput.value)
})

function saveChoresToLocalStorage() {
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
    const storedChores = getChoresFromLocalStorage()
    const updatedChores = storedChores.filter(chore => chore !== choreText)
    localStorage.setItem("chores", JSON.stringify(updatedChores))
}

function getChoresFromLocalStorage() {
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

function loadStoredChores() {
    const storedChores = getChoresFromLocalStorage()
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
    saveChoresToLocalStorage();
})

window.addEventListener("load", function () {
    validateInput()
    loadStoredChores()
    clearChoresButton.disabled = true
})

clearChoresButton.addEventListener("click", function () {
    while (choresList.firstChild) {
        choresList.removeChild(choresList.firstChild)

    }
    localStorage.removeItem("chores")
    showChoresFinished()
    clearChoresButton.disabled = true
})
