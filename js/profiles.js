const btnSearch =  document.querySelector(".search-section a");
const inputUser =  document.querySelector(".search-section input");
const mainContainer =  document.querySelector(".main-wraper");
const containerSection =  document.querySelector(".container-section");

const url = "https://api.github.com/users/";

btnSearch.addEventListener("click", buscarUser);

function buscarUser(e){
    e.preventDefault(); //es para evitar que el "href" su redireccion

    if (inputUser.value === "") {   //validamos para que no se pueda enviar campos vacios
        mostrarError("El campo no puede estar vacío, escriba un usuario de GitHub");
        return;
    }
    callApiUser(inputUser.value);   //llamamos a la funcion para llamar al API de github
}

async function callApiUser(user){   //funcion para llamar a los usuarios y lo convertimos en async
    const userUrl = url + user;
    const repoUrl = `${url}${user}/repos`;
    try {
        const data = await Promise.all([fetch(userUrl), fetch(repoUrl)]);
        if (data[0].status === 404) {   //validamos que los usuarios sean correctos y si no son validos, se detiene el codigo
            mostrarError("No existe el usuario...");
            return;
        }
        const dataUser = await data[0].json();
        const dataRepo = await data[1].json();
        mostrarData(dataUser);
        mostrarRepos(dataRepo);
    } catch (error) {
        console.log(error);
    }

}

function mostrarData(dataUser){
    clearHTML();
    const {avatar_url, bio, followers, following, name, public_repos} = dataUser; //generamos una variable y hacemos referencias a los datos de cada usuario que se busca
    const container = document.createElement("div");    //creamos un elemento de html para luego mostrar el contenido del usuario con los datos obtenidos en la variable de arriba
    container.innerHTML = `
        <div class="row-left">
            <img src="${avatar_url}" alt="user image">
        </div>
        <div class="row-right">
            <h3>${name}</h3>
            <p>${bio}</p>
            <div class="stats-user">
                <p>${followers} <span>Followers</span></p>
                <p>${following} <span>Following</span></p>
                <p>${public_repos} <span>Repos</span></p>
            </div>
            <h3>Repositorios:</h3>
            <div class="link-repos"></div>
        </div>
    `;
    containerSection.appendChild(container);
}

function mostrarRepos(repos){
    const reposContainer = document.querySelector(".link-repos");   //creamos un arreglo de objetos
    repos
    
    //Lo que hacemos aqui es ordenar los primeros 10 repositorios con mas valoraciones de todos los repositorios
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10)
        .forEach(element => {   //aqui concatenamos los repositorios para que esten ordenados en la clase "link-repos" y lo añadimos en el "reposContainer"
            const link = document.createElement("a");
            link.innerText = element.name;
            link.href = element.html_url;
            link.target = "_blank";
            reposContainer.appendChild(link);
        });
}

function mostrarError(mensaje){ //generamos la funcion para generar el mensaje de error
    const mensajeNuevo = "Advertencia: " + mensaje;
    const error = document.createElement("h5");
    error.innerText = mensajeNuevo;
    error.style.color = "red";
    mainContainer.appendChild(error);
    setTimeout(() => error.remove(), 5000); //indicamos que remueva la advertencia despues de los 5 segundos
}

function clearHTML(){   //generamos esta funcion para que limpie el "containerSection"
    containerSection.innerHTML = "";
}