<h2>Overview</h2>
<a href="https://city-bikes.herokuapp.com/">https://city-bikes.herokuapp.com/</a>
<br></br>
<a href="https://www.youtube.com/watch?v=KkoNzc4Cf90">Click to see a demo video</a>
<br></br>

The goal of this project was to make a React application that allows uploading open source city bike data provided by <a href="https://www.hsl.fi/en/hsl/open-data">HSL</a> to a clean, sortable, and filterable format. One of the challenges of this project was learning Material UI from scratch, but luckily their extensive online documentation proved to be a valuable source for help. With the help of Material UI, I focused on making the website work smoothly on desktop and mobile using the same code. It's also worth mentioning that all of the code is written in TypeScript using very strict settings for maximal learning experience.

<H2>Technologies</H2>

* **TypeScript**
* **React**
* **ExpressJS**
* **PostgreSQL**
* **Sequelize**
* **MUI**
* **React Query**
* **Cypress**
<h2>Structure</h2>

```mermaid
%%{init: {'theme': 'forest', "flowchart" : { "curve" : "basis" } } }%%
graph TB
subgraph Frontend
A[App.tsx]
A --> C{Navigation}
C --> D[Views]
E[Components] --> D
Q[React Query] --> D
S[Services] --> Q
API[API] --> S
end
subgraph Backend
I[Index.ts]
J[Controllers] --> I
P(PostgreSQL) --> SE[Sequelize]
SE --> I
M[Middleware] --> J
Helpers --> J
MO[Models] --> J
SE --> MO
end
Frontend --- Backend
```