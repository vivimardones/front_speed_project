# Speed Project – Frontend

Este repositorio contiene el frontend del proyecto **Speed Project**, desarrollado como parte del Proyecto de Título de la carrera Analista Programador.

La aplicación web permite la gestión y visualización de información relacionada con clubes deportivos, deportistas, campeonatos, entrenamientos, inscripciones, pagos y comunicaciones internas, consumiendo una API REST desarrollada en Node.js.

---

## Tecnologías utilizadas

- React
- JavaScript
- HTML5
- CSS
- Axios
- Node.js (entorno de desarrollo)

---

## Instalación del proyecto

1. Clonar el repositorio:

```bash
git clone https://github.com/vivimardones/front_speed_project.git
```
2. Ingresar a la carpeta del proyecto:
```bash
cd front_speed_project
```

3. Instalar dependencias:
```bash
npm install
```

## Ejecución del proyecto
Para ejecutar la aplicación en entorno de desarrollo:
```bash
npm start
```

La aplicación se ejecutará por defecto en:
http://localhost:3000
---

## Funcionamiento general

El frontend se comunica con una API REST desarrollada en Node.js, la cual gestiona la lógica de negocio y el acceso a la base de datos Firebase Firestore.

La aplicación permite:

- Gestión de usuarios y perfiles (deportista, apoderado, administrador, entrenador)
- Visualización y administración de clubes deportivos
- Gestión de ramas deportivas, series y categorías
- Inscripción de deportistas a campeonatos
- Registro de entrenamientos y control de asistencia
- Gestión de pagos y estados financieros
- Publicación de noticias y comunicaciones internas
- Comunicación con el Backend
- La comunicación con el backend se realiza mediante peticiones HTTP utilizando Axios, intercambiando información en formato JSON.

---

## Repositorio del backend:

https://github.com/vivimardones/api_speed-project
---

## Estructura del proyecto

El proyecto se organiza en componentes y vistas, permitiendo separar la lógica de presentación de la lógica de consumo de datos desde la API.

Se utilizan componentes reutilizables para formularios, listados y vistas principales del sistema.
--- 
## Estado del proyecto

El proyecto se encuentra en desarrollo y corresponde a una implementación funcional para fines académicos, orientada a demostrar el uso de una arquitectura frontend-backend con base de datos NoSQL.
---
## Autora

Proyecto desarrollado por Viviana Mardones
Proyecto de Título – Analista Programador