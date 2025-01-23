# Heroes backend

**Heroes backend** is a complement of [heroesApp](https://git.com/fernandojosemoran/heroes-app) repository.
Heroes app to allow to do requests using by following methods: `PUT, DELETE, POST, GET`.

## technologies

- ![express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)![clean architecture](https://img.shields.io/badge/clean%20architecture-2b58bf?style=for-the-badge)![solid principles](https://img.shields.io/badge/solid%20principles-2ba7bf?style=for-the-badge)
- ![angular framework](https://img.shields.io/badge/Angular%20Framework-DD0031?style=for-the-badge&logo=angular&logoColor=white)
- ![jest.js](https://img.shields.io/badge/Jest%20(testing)-323330?style=for-the-badge&logo=Jest&logoColor=white)
- ![typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
- ![cloudflare](https://img.shields.io/badge/claudflare-orange?style=for-the-badge&logo=cloudflare&logoColor=white)

## which is goal of this project

The mainly goal is show my knowledge and domain using express library for make backend app.

## EndPoints

```bash #GET -> /api/heroes-list

curl -X GET http://localhost:3000/api/heroes-list | jq

{
  "response": [
    {
      "id": "dc-batman",
      "superhero": "Batman",
      "publisher": "DC Comics",
      "alter_ego": "Bruce Wayne",
      "first_appearance": "Detective Comics #27",
      "characters": "Bruce Wayne"
    },
    {
      "id": "dc-superman",
      "superhero": "Superman",
      "publisher": "DC Comics",
      "alter_ego": "Kal-El",
      "first_appearance": "Action Comics #1",
      "characters": "Kal-El"
    },
    {
      "id": "dc-flash",
      "superhero": "Flash",
      "publisher": "DC Comics",
      "alter_ego": "Jay Garrick",
      "first_appearance": "Flash Comics #1",
      "characters": "Jay Garrick, Barry Allen, Wally West, Bart Allen"
    },
    {
      "id": "dc-green",
      "superhero": "Green Lantern",
      "publisher": "DC Comics",
      "alter_ego": "Alan Scott",
      "first_appearance": "All-American Comics #16",
      "characters": "Alan Scott, Hal Jordan, Guy Gardner, John Stewart, Kyle Raynor, Jade, Sinestro, Simon Baz"
    },
  ]
}

```

```bash #GET -> /api/hero/:id

curl -X GET http://localhost:3000/api/hero/dc-batman | jq

{
  "response": {
    "id": "dc-batman",
    "superhero": "Batman",
    "publisher": "DC Comics",
    "alter_ego": "Bruce Wayne",
    "first_appearance": "Detective Comics #27",
    "characters": "Bruce Wayne"
  }
}

```

```bash #POST -> /api/hero/create

curl -X POST http://localhost:3000/api/hero/create -d '{ "superhero": "Ant-Man", "publisher": "DC Comics", "alter_ego": "scott edward", "first_appearance": "Tales to astonish #27", "characters": "Atn-Man, Howard Stark, M.O.D.O.K, Stature, Captain America", "alt_image": "image url" }' -H "Content-Type: application/json" | jq

{
  "response": {
    "id": "dc-ant-man",
    "alter_ego": "scott edward",
    "first_appearance": "Tales to astonish #27",
    "characters": "Atn-Man, Howard Stark, M.O.D.O.K, Stature, Captain America",
    "publisher": "DC Comics",
    "superhero": "Ant-Man",
    "alt_image": "image url"
  }
}

```

```bash #PUT -> /api/hero/update/:id

curl -X PUT http://localhost:3000/api/hero/update/dc-ant-man -d '{ "superhero": "type your name", "publisher": "DC Comics", "alter_ego": "scott edward", "first_appearance": "Tales to astonish #27", "characters": "Atn-Man, Howard Stark, M.O.D.O.K, Stature, Captain America", "alt_image": "image url" }' -H "Content-Type: application/json" | jq

{
  "response": {
    "superhero": "type your name",
    "alter_ego": "scott edward",
    "characters": "Atn-Man, Howard Stark, M.O.D.O.K, Stature, Captain America",
    "first_appearance": "Tales to astonish #27",
    "publisher": "DC Comics",
    "alt_image": "image url"
  }
}

```

```bash #DELETE -> /api/hero/delete/:id

curl -X DELETE http://localhost:3000/api/hero/delete/dc-ant-man

{
    "response":"Hero dc-ant-man were deleted."
}

```

```bash #GET -> /api/hero/search/:superhero

curl -X GET http://localhost:3000/api/hero/search/batman

```
