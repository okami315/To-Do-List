/**
 * @author Iván Cobos Marchal (Okami315)
 * @description To do List
 *
 */

/**
 * Función que retorna la fecha actual en String
 * @return {String}
 */
const getDateString = (date = new Date()) => {
  let day = date.getDate(); // Devuelve el número pero si es menor que 10 debemos poner un 0 delante
  let month = date.getMonth() + 1; // Devuelv el mes pero debemos ponerle un 0 delante si es menor que 10
  let year = date.getFullYear();

  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }
  return day + "/" + month + "/" + year;
};

// No funciona el required del html asique tengo que controlarlo manualmente

// Comprobar que la fecha no se pase del limite si esto devuelve true en el getAll cambiar el estado de complete a true
const checkDate = (date) => {
  let now = new Date();
  if (date == now || now > date) {
    return true;
  } else {
    return false;
  }
};

// Tenemos que tener una funcion asincrona para poder hacer el await asique la he ejecutado así (No se si esto es legal)
let change = async (datos, id) => {
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  };

  const url = "http://localhost:4000/tasks/" + id;

  try {
    const res = await fetch(url, options);
    const json = await res.json();
    if (!res.ok) {
      throw {
        status: res.status,
        statusText: res.statusText,
      };
    }
  } catch (error) {
    console.log(error.message);
  }
};

/**
 * Clase Tarea
 */
class Task {
  constructor(name, dateEnd, dateStart, complete) {
    // Propiedades
    this.name = name;
    this.dateEnd = getDateString(dateEnd);
    if (dateStart == "") {
      this.dateStart = getDateString();
    } else {
      this.dateStart = getDateString(dateStart);
    }
    if (complete) {
      // y la fecha de comienzo es anteriror a la fecha de fin y la fecha actual no sea superior a la fecha de fin // esto se comprueba en cada getAll
      this.complete = complete;
    } else {
      this.complete = false;
    }
  }
}

// console.log(new Task("Programar", new Date("2023-11-23"), new Date("2022-11-10")));
// Declaraciones de variables

const $tbody = document.querySelector(".tbody");
const $table = document.querySelector(".crud-table");
const $form = document.querySelector(".crud-form");
const $name = document.querySelector("#name");
const $dateEnd = document.querySelector("#dateEnd");
const $dateStart = document.querySelector("#dateStart");
const $complete = document.querySelector(".completed");
const ctx = document.getElementById("graph");
const $nocomplete = document.querySelector(".nocompleted");
const $delete = document.querySelector(".deleted");
const $input = document.querySelector("#Buscador");
const $template = document.querySelector(".crud-template").content;
const $fragment = document.createDocumentFragment();

/**
 * Función que se ejecuta al cargar la página y trae las tareas que tengamos guardadas
 */
const getAll = async () => {
  let completed = 0;
  let noCompleted = 0;
  try {
    const res = await fetch("http://localhost:4000/tasks"),
      json = await res.json();
    // if (!response.ok) throw { status: res.status, statusText: res.statusText };
    json.forEach((element) => {
      $template.querySelector(".name").textContent = element.name;
      $template.querySelector(".dateStart").textContent = element.dateStart;
      $template.querySelector(".dateEnd").textContent = element.dateEnd;

      let strday = element.dateEnd.replaceAll("/", "-").split("-")[0];
      let strmonth = element.dateEnd.replaceAll("/", "-").split("-")[1];
      let stryear = element.dateEnd.replaceAll("/", "-").split("-")[2];

      let strdayS = element.dateStart.replaceAll("/", "-").split("-")[0];
      let strmonthS = element.dateStart.replaceAll("/", "-").split("-")[1];
      let stryearS = element.dateStart.replaceAll("/", "-").split("-")[2];

      if (
        checkDate(new Date(stryear + "-" + strmonth + "-" + strday)) &&
        element.complete == false
      ) {
        // console.log(
        //   new Date(stryear + "-" + strmonth + "-" + strday) +
        //     "Esta fecha retorna true por lo tanto es mayor la fecha actual que la fecha de finalización"
        // );
        let datos = new Task(
          element.name,
          new Date(stryear + "-" + strmonth + "-" + strday),
          new Date(stryearS + "-" + strmonthS + "-" + strdayS),
          true
        );
        change(datos, element.id);
      }
      // Si está completada le ponemos el estilo tachado y cambiamos el color a azul
      if (element.complete) {
        // Aumentamos en 1 el contador de tareas acabadas
        completed += 1;
        // console.log("completada");
        $template.querySelector(".name").classList.remove("text-success");
        // Quitamos los estilos de la tarea sin finalizar

        // Ponemos los estilos de tarea terminada
        $template.querySelector(".name").classList.add("text-primary");
        $template.querySelector(".name").classList.add("tachado");
        $template.querySelector(".complete").classList.add("d-none");
        $template.querySelector(".edit").classList.add("d-none");
      } else {
        // Aumentamos en 1 el contador de no Completadas
        noCompleted += 1;
        // Si no está completada la ponemos de color verde
        // console.log("sin completar");

        // Quitamos los estilos de la tarea completada
        $template.querySelector(".name").classList.remove("text-primary");
        $template.querySelector(".name").classList.remove("tachado");
        $template.querySelector(".complete").classList.remove("d-none");
        $template.querySelector(".edit").classList.remove("d-none");

        //Ponemos
        $template.querySelector(".name").classList.add("text-success");
      }
      //Añadimos data-attribute con los elementos id,name,dateEnd (la de inicio no se edita)
      $template.querySelector(".edit").dataset.id = element.id;
      $template.querySelector(".edit").dataset.name = element.name;
      $template.querySelector(".edit").dataset.dateEnd = element.dateEnd;
      $template.querySelector(".edit").dataset.dateStart = element.dateStart;
      //Complete necesitamos todo
      $template.querySelector(".complete").dataset.id = element.id;
      $template.querySelector(".complete").dataset.name = element.name;
      $template.querySelector(".complete").dataset.dateEnd = element.dateEnd;
      $template.querySelector(".complete").dataset.dateStart =
        element.dateStart;
      $template.querySelector(".complete").dataset.complete = element.complete;
      //y para borrar añadimos un data attribute con los elementos id
      // porque para borrar en una API solo necesito el ID.
      $template.querySelector(".delete").dataset.id = element.id;
      $template.querySelector(".delete").dataset.name = element.name;
      $template.querySelector(".delete").dataset.dateEnd = element.dateEnd;
      $template.querySelector(".delete").dataset.dateStart = element.dateStart;
      $template.querySelector(".delete").dataset.complete = element.complete;
      // ahora clonamos e importamos el nodo:
      let $clonado = document.importNode($template, true);
      $fragment.appendChild($clonado);
    });
    $table.querySelector("tbody").appendChild($fragment);

    // DELETE (La función se desempeña aquí)

    const $deleteButtons = document.querySelectorAll(".delete");
    $deleteButtons.forEach((deleteButton) => {
      deleteButton.addEventListener("click", async (e) => {
        const options = {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        };

        const url = "http://localhost:4000/tasks/" + deleteButton.dataset.id;

        let strday = deleteButton.dataset.dateEnd
          .replaceAll("/", "-")
          .split("-")[0];
        let strmonth = deleteButton.dataset.dateEnd
          .replaceAll("/", "-")
          .split("-")[1];
        let stryear = deleteButton.dataset.dateEnd
          .replaceAll("/", "-")
          .split("-")[2];

        let strdayS = deleteButton.dataset.dateStart
          .replaceAll("/", "-")
          .split("-")[0];
        let strmonthS = deleteButton.dataset.dateStart
          .replaceAll("/", "-")
          .split("-")[1];
        let stryearS = deleteButton.dataset.dateStart
          .replaceAll("/", "-")
          .split("-")[2];

        localStorage.setItem(
          deleteButton.dataset.id,
          JSON.stringify(
            new Task(
              deleteButton.dataset.name,
              new Date(stryear + "-" + strmonth + "-" + strday),
              new Date(stryearS + "-" + strmonthS + "-" + strdayS),
              deleteButton.dataset.complete
            )
          )
        );
        try {
          const res = await fetch(url, options);
          const json = await res.json();

          if (!res.ok) {
            throw {
              status: res.status,
              statusText: res.statusText,
            };
          }
        } catch (err) {
          console.log(err.message);
        }
      });
    });

    // COMPLETE

    const $completeButtons = document.querySelectorAll(".complete");
    $completeButtons.forEach((completeButton) => {
      completeButton.addEventListener("click", async (e) => {
        console.log(completeButton.dataset);
        let strday = completeButton.dataset.dateEnd
          .replaceAll("/", "-")
          .split("-")[0];
        let strmonth = completeButton.dataset.dateEnd
          .replaceAll("/", "-")
          .split("-")[1];
        let stryear = completeButton.dataset.dateEnd
          .replaceAll("/", "-")
          .split("-")[2];

        let strdayS = completeButton.dataset.dateStart
          .replaceAll("/", "-")
          .split("-")[0];
        let strmonthS = completeButton.dataset.dateStart
          .replaceAll("/", "-")
          .split("-")[1];
        let stryearS = completeButton.dataset.dateStart
          .replaceAll("/", "-")
          .split("-")[2];

        let datos = new Task(
          completeButton.dataset.name,
          new Date(stryear + "-" + strmonth + "-" + strday),
          new Date(stryearS + "-" + strmonthS + "-" + strdayS),
          true
        );
        const options = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        };

        const url = "http://localhost:4000/tasks/" + completeButton.dataset.id;

        try {
          const res = await fetch(url, options);
          const json = await res.json();

          if (!res.ok) {
            throw {
              status: res.status,
              statusText: res.statusText,
            };
          }
        } catch (error) {
          console.log(error.message);
        }
      });
    });

    // EDIT (La función se desempeña después, aquí solo ajustamos valores y cambiamos la interfaz)

    const $editButtons = document.querySelectorAll(".edit");
    $editButtons.forEach((editButton) => {
      editButton.addEventListener("click", (e) => {
        const $id = document.querySelector("#id");
        // console.log(editButton.dataset);
        $name.value = editButton.dataset.name;
        // $dateStart.value = editButton.dataset.dateStart;

        let strday = editButton.dataset.dateEnd
          .replaceAll("/", "-")
          .split("-")[0];
        let strmonth = editButton.dataset.dateEnd
          .replaceAll("/", "-")
          .split("-")[1];
        let stryear = editButton.dataset.dateEnd
          .replaceAll("/", "-")
          .split("-")[2];

        let strdayS = editButton.dataset.dateStart
          .replaceAll("/", "-")
          .split("-")[0];
        let strmonthS = editButton.dataset.dateStart
          .replaceAll("/", "-")
          .split("-")[1];
        let stryearS = editButton.dataset.dateStart
          .replaceAll("/", "-")
          .split("-")[2];

        $dateEnd.value = stryear + "-" + strmonth + "-" + strday;
        // Le ponemos al div que guarde el valor del id
        $id.innerText = editButton.dataset.id;
        $dateStart.value = stryearS + "-" + strmonthS + "-" + strdayS;
      });
    });

    // Ejecutamos los contadores
    $complete.innerText = "Tareas Acabadas : " + completed;
    $delete.innerText = "Tareas Eliminadas : " + localStorage.length;
    $nocomplete.innerText = "Tareas Por Completar : " + noCompleted;

    // Gráfico
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Completadas", "No Completadas", "Eliminadas"],
        datasets: [
          {
            label: "",
            data: [completed, noCompleted, localStorage.length],
            borderWidth: 1,
            backgroundColor: ["blue", "green", "red"],
          },
        ],
      },
    });
  } catch (error) {
    const customStatusText = error.statusText || "Error al cargar los datos";
    const customStatus = error.status || "Status incorrecto";
    console.log(customStatus);
    console.log(customStatusText);
  }
};

/**
 * Función que mete una tarea con los valores que hemos establecido
 * @param {Event} e
 */
async function insert(e) {
  // e.preventDefault();
  if ($name.value == "" || $dateEnd.value == "") {
    alert("Mi man no puedes mandar nada vacio");
  } else {
    let datos = new Task($name.value, new Date($dateEnd.value), "", false);
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    };

    try {
      const res = await fetch("http://localhost:4000/tasks/", options);
      const json = await res.json();

      if (!res.ok) {
        throw { status: res.status, statusText: res.statusText };
      }
      console.log("holiwi", json);
      // location.reload();
    } catch (error) {
      console.log(error.message);
    }
  }
}
// Le damos el evento al elemento que es el submit del formulario
const $insert = document.querySelector("#insert");
$insert.addEventListener("click", insert); // Imnportante no ejecutar ()

// El div invisible ->
const $id = document.querySelector("#id");
// Cuando el evento se active, se cambie el valor metiendole uno nuevo cambiamos el insertar por editar
$id.addEventListener("DOMNodeInserted", () => {
  $insert.innerText = "Editar";
  $insert.dataset.edit = "editItem";
  // Le quitamos la función del insert y ponemos el editar
  $insert.removeEventListener("click", insert);
  if (($insert.dataset.edit = "editItem")) {
    $insert.addEventListener("click", async (e) => {
      e.preventDefault();
      // let datos = { name: $name.value, dateEnd: $dateEnd.value };
      let datos = new Task(
        $name.value,
        new Date($dateEnd.value),
        new Date($dateStart.value)
      );
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      };

      const url = "http://localhost:4000/tasks/" + $id.textContent;

      try {
        const res = await fetch(url, options);
        const json = await res.json();

        if (!res.ok) {
          throw {
            status: res.status,
            statusText: res.statusText,
          };
        }
      } catch (error) {
        console.log(error.message);
      }
    });
  }
});

// Ya estarán todas mostradas asique las que no cumplan la condicion le ponemos un display:none;
const buscarTarea = async () => {
  const $tasks = document.querySelectorAll(".name");

  if ($input.value == "") {
    // Si lo pasamos vacio osea borramos la búsqueda pone todo en display, none y carga de nuevo
    $tasks.forEach((task) => {
      task.parentNode.classList.add("d-none");
    });
    getAll();
  }
  $tasks.forEach((task) => {
    if (!task.innerText.includes($input.value)) {
      task.parentNode.classList.add("d-none");
    }
  });
};

$input.addEventListener("keyup", (e) => {
  buscarTarea();
});

document.addEventListener("DOMContentLoaded", getAll);
