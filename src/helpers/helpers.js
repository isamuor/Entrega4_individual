const hbs = require('hbs');


hbs.registerHelper('mostrar', (listaCursos) => {
    let texto = "<table class='table table-striped'>\
    <thead class='thead-dark'>\
        <th> Id del curso </th>\
        <th> Nombre del Curso </th>\
        <th> Descripción de Curso </th>\
        <th> Valor del curso </th>\
        <th> Estado </th>\
    </thead>\
    <tbody>";

    listaCursos.forEach(curso => {
        texto = `${texto} 
        <tr> 
        <td> ${curso.id} </td>
        <td> ${curso.nombre} </td>
        <td> ${curso.descripcion} </td>
        <td> ${curso.valor} </td>
        <td> ${curso.estado} </td>
        </tr>`

    });
    texto = texto + '</tbody> </table>';
    return texto;

});

hbs.registerHelper('mostrarDisponibles', (listaCursos) => {
    let size = Object.keys(listaCursos).length;
    let cursosDisponibles = listaCursos.filter(cur => cur.estado == 'disponible')
    if (cursosDisponibles.length == 0) {
        texto2 = `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> No hay cursos disponibles </h4><hr></div>`
    } else {
        let texto2 = `<div class='accordion' id='accordionExample'>`
        i = 0;
        listaCursos.forEach(curso => {
            if (curso.estado == 'disponible') {
                if (i % 2 == 0) {
                    texto2 = `${texto2}
            <div class="row">`
                }
                texto2 = `${texto2}
                <div class="col-sm-6"> 
                    <div class="card">
                        <div class="card-header" id="heading${i}">
                            <h2 class="mb-0">
                                <button class="btn btn-link text-left " type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                                    Nombre: ${curso.nombre} <br>
                                    Descripción: ${curso.descripcion}<br>
                                    Valor: ${curso.valor}
                                </button>
                            </h2>
                        </div>

                        <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                            <div class="card-body text-left">
                                Descripción: ${curso.descripcion}<br>
                                Modalidad: ${curso.modalidad}<br>
                                Intensidad horaria: ${curso.intensidad}
                            </div>
                        </div>
                    </div>
                </div>`

                if (((i % 2) == 1) || ((size % 2) == 1 && i == size - 1)) {
                    texto2 = texto2 + '<br> </div>'
                }
                i = i + 1;
            }
        });
        texto2 = texto2 + '</div>'
        return texto2
    };

});

hbs.registerHelper('mostrarNombres', (listaCursos) => {
    let texto = [];
    listaCursos.forEach(curso => {
        if (curso.estado == 'disponible') {
            texto = `${texto}
        <option>${curso.nombre}</option>`
        }

    });
    return texto
})


hbs.registerHelper('mostrarInscrito', (est) => {
    let texto = `<table class='table table-striped'>\
        <thead class='thead-dark'>
            <th> Identificacion </th>
            <th> Nombre </th>
            <th> Curso </th>
        </thead>
        <tbody>"
            <tr> 
            <td> ${est.documento} </td>
            <td> ${est.nombre} </td>
            <td> ${est.nombreCurso} </td>
            </tr> 
        </tbody> 
        </table>`
    return texto

})

hbs.registerHelper('mostrarInscritos', (listaCursos, listaInscritos) => {
    let nombresCursos = [];
    cursosDisponibles = listaCursos.filter(cur => cur.estado == 'disponible')
    if (cursosDisponibles.length == 0) {
        texto = `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> No hay cursos disponibles </h4><hr></div>`
        return texto
    } else {
        let size = Object.keys(cursosDisponibles).length;;
        let texto = `<div class='accordion' id='accordionExample'>`
        i = 0;
        listaCursos.forEach(curso => {
            if (curso.estado == 'disponible') {
                inscritospcurso = listaInscritos.filter(ins => (ins.nombreCurso == curso.nombre));
                let texto_tabla = `<table class='table table-striped'>
        <thead class='thead-dark'>
            <th> Identificación </th>
            <th> Nombre </th>
            <th> Email </th>
            <th> Telefono </th>
        </thead>
        <tbody>`
                inscritospcurso.forEach(ins => {
                    texto_tabla = `${texto_tabla} 
        <tr> 
        <td> ${ins.documento} </td>
        <td> ${ins.nombre} </td>
        <td> ${ins.email} </td>
        <td> ${ins.telefono} </td>
        </tr>`
                })
                texto_tabla = `${texto_tabla} </tbody> </table>`

                if (i % 2 == 0) {
                    texto = `${texto}
        <div class="row">`
                }
                texto = `${texto}
    <div class="col-sm-6"> 
        <div class="card">
            <div class="card-header" id="heading${i}">
                <h2 class="mb-0">
                    <button class="btn btn-link text-left " type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">

                        Curso: ${curso.nombre}<br>
                        

                    </button>
                </h2>
                    <form action="/verInscritos" method="post" class = "float-right form-inline">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="${curso.nombre}">
                            <label class="form-check-label" for="gridRadios1"> Cerrar curso <br> </label>
                        </div>
                        <button class="btn btn-outline-dark btn-sm" type="submit">Enviar</button> 
                            
                    </form>
            </div>
            <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                    <div class="card-body text-left">
                        ${texto_tabla}
                    </div>
             </div>
        </div>
    </div>`

                if (((i % 2) == 1) || ((size % 2) == 1 && i == size - 1)) {
                    texto = texto + '<br> </div>'
                }
                i = i + 1;

            }
        });

        return [texto]
    }
})


hbs.registerHelper('permanecenInscritos', (InscritosCursoInteres) => {

    let texto_tabla = `<table class='table table-striped'>
            <thead class='thead-dark'>
                <th> Identificación </th>
                <th> Nombre </th>
                <th> Email </th>
                <th> Telefono </th>
                <th> Curso </th>
            </thead>
            <tbody>`
    InscritosCursoInteres.forEach(ins => {
        texto_tabla = `${texto_tabla} 
            <tr> 
            <td> ${ins.documento} </td>
            <td> ${ins.nombre} </td>
            <td> ${ins.email} </td>
            <td> ${ins.telefono} </td>
            <td> ${ins.nombreCurso} </td>
            </tr>`
    })
    texto_tabla = `${texto_tabla} </tbody> </table>`
    return texto_tabla

})