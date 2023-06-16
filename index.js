var rectanglesCount = 1;
var statuses = ["Haciendo magia!", "Preparando los alimentos..", "Mmm esto se ve delicioso..", "Oh no! Tu comida se escapó!"];


function fadeOutHello() {
    var hello = document.getElementById("hello");
    var message = document.getElementById("message");
    var container = document.getElementById("container");

    hello.style.opacity = 0;
    setTimeout(function () {
        hello.style.display = "none";
        message.style.display = "block";
        setTimeout(function () {
            message.style.opacity = 1;
            setTimeout(function () {
                message.style.opacity = 0;
                setTimeout(function () {
                    message.style.display = "none";
                    hello.style.display = "block";
                    hello.style.opacity = 1;
                }, 500);
            }, 500);
        }, 100);
    }, 500);

    llamarFuncion();

}
function llamarFuncion() {
    var recetas = ["hamburguesa de carne", "hamburguesa de pollo", "papas con carne", "arroz con pollo", "arroz con carne", "ensalada"];
    var recetaAleatoria = recetas[Math.floor(Math.random() * recetas.length)];
    var url = "http://147.182.198.7/api/preparar";
    var timeout = 10000; // 10000 milisegundos = 10 segundos

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "receta": recetaAleatoria })
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error en la solicitud: " + response.status);
            }
        })
        .then(data => {
            // Procesar la respuesta recibida
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });

    setTimeout(() => {
        console.log('Tiempo de espera excedido');
    }, timeout);



    var rectangleData = {
        recipe: recetaAleatoria,
        status: "Estado: Preparando...",
        time: "Tiempo: 1:00"
    };

    // Guardar el rectángulo en localStorage
    localStorage.setItem('rectanglesCount', JSON.stringify(rectanglesCount));
    localStorage.setItem('rectangle_' + rectanglesCount, JSON.stringify(rectangleData));

    createRectangle(rectangleData);
}

function createRectangle(rectangleData) {
    var container = document.getElementById("container");
    var rectangle = document.createElement("div");
    rectangle.classList.add("rectangle");
    rectangle.setAttribute('data-id', rectanglesCount);

    var recipeName = document.createElement("span");
    recipeName.classList.add("rectangle-name");

    //fetchRecipeName(recipeName);
    recipeName.innerText = rectangleData.recipe;

    var recipeStatus = document.createElement("span");
    recipeStatus.classList.add("rectangle-status");
    recipeStatus.innerText = "Estado: Preparando...";

    var recipeTime = document.createElement("span");
    recipeTime.classList.add("rectangle-time");
    //recipeTime.innerText = "Tiempo: 1:00";

    rectangle.appendChild(recipeName);
    rectangle.appendChild(recipeStatus);
    rectangle.appendChild(recipeTime);

    //rectangleData.id = rectanglesCount;

    // Obtener los datos del rectángulo almacenados en localStorage
    var storedRectangleData = localStorage.getItem('rectangle_' + rectanglesCount);
    if (storedRectangleData) {
        // Si hay datos almacenados, sobrescribir los valores
        rectangleData = JSON.parse(storedRectangleData);
        recipeName.innerText = rectangleData.recipe;
        recipeStatus.innerText = rectangleData.status;
        recipeTime.innerText = rectangleData.time;
    }

    container.appendChild(rectangle);

    rectanglesCount++;
    startCountdown(recipeTime, rectangle);
}


function fetchRecipeStatus(recipeStatusElement) {
    var recipeStatus = recipeStatusElement.innerText;

    if (recipeStatus !== "Estado: Tu comida está lista!") {
        setTimeout(function () {

            var randomIndex = Math.floor(Math.random() * statuses.length);
            var nextStatus = statuses[randomIndex];
            recipeStatusElement.innerText = "Estado: " + nextStatus;
        }, 300)
    }

}


function startCountdown(recipeTimeElement, rectangle) {
    var timeReceived = recipeTimeElement.innerText; 
    var time;
    if ( timeReceived !== "Tiempo: 1:00") {
        var timeArray = timeReceived.split(":");
        time = timeArray[2];
    } else {
        time = 60;
    }

    var countdown = setInterval(function () {
        var minutes = Math.floor(time / 60);
        var seconds = time % 60;
        var formattedTime = minutes + ":" + padZero(seconds);
        recipeTimeElement.innerText = "Tiempo: " + formattedTime;

        if (time <= 0) {
            clearInterval(countdown);
            recipeTimeElement.innerText = "Tiempo: 0:00";
            var recipeStatus = rectangle.getElementsByClassName("rectangle-status")[0];
            recipeStatus.innerText = "Estado: Tu comida está lista!";
            createRemoveButton(rectangle);
        }

        time--;
    }, 1000);
}

function createRemoveButton(rectangle) {
    var removeButton = document.createElement("button");
    removeButton.classList.add("rectangle-button");
    removeButton.innerText = "Retirar";
    removeButton.addEventListener("click", function () {
        rectangle.style.display = "none";

        var rectangleId = rectangle.getAttribute('data-id');
        localStorage.removeItem('rectangle_' + rectangleId);
        rectanglesCount--;
        localStorage.setItem('rectanglesCount', JSON.stringify(rectanglesCount));
    });

    rectangle.appendChild(removeButton);
}

function padZero(number) {
    return number.toString().padStart(2, "0");
}

// Actualizar el estado de los rectángulos en localStorage cada 3 segundos
setInterval(function () {
    var rectangles = document.getElementsByClassName("rectangle");

    for (var i = 0; i < rectangles.length; i++) {
        var rectangle = rectangles[i];
        if (rectangle.style.display === "none") {
            continue;
        }
        var recipeStatus = rectangle.getElementsByClassName("rectangle-status")[0];
        fetchRecipeStatus(recipeStatus);
        
        // Actualizar el estado del rectángulo en localStorage
        var rectangleId = rectangle.getAttribute('data-id');
        var rectangleData = {
            recipe: rectangle.getElementsByClassName("rectangle-name")[0].innerText,
            status: recipeStatus.innerText,
            time: rectangle.getElementsByClassName("rectangle-time")[0].innerText
        };
        localStorage.setItem('rectangle_' + rectangleId, JSON.stringify(rectangleData));
    }
}, 3000);

window.onload = function () {
    var storedRectanglesCount = parseInt(localStorage.getItem('rectanglesCount')) || rectanglesCount;
    if (NaN !== storedRectanglesCount) {
        for (var i = 1; i < storedRectanglesCount + 1; i++) {
            var storedRectangleData = localStorage.getItem('rectangle_' + i);
            if (storedRectangleData) {
                var rectangleData = JSON.parse(storedRectangleData);
                createRectangle(rectangleData);
            }
        }
    }

};


