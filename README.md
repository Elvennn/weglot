Voici le rendu du test techinque Weglot.

## Technical skills (~1h)

J'ai mis 1h30 à faire cette partie du test.

J'ai fait le choix de ne pas utiliser de bibliothèque pour la gestion des periodes de temps (moment.js, etc.) n'étant pas sur que cela soit l'objectif.

J'ai choisi de garder les heures/minutes en string tout au long de mon traitement ce qui s'est avéré assez lourd. Après coup, je pense qu'il y a un surement moyen de faire plus simple avec des objets Date. j'aurais dû passer plus de temps au début sur la question.

## Code review (~20m)

J'ai fait la review directement dans ce README. Avec le code que je propose à chaque fois.

1.

L'utilisation de reduce est un peu lourde ici. Autant utiliser `map` qui simplifie la lecture, qui est un raccourcis à reduce fait pour ce cas précis.

```js
const data = [
  { value: "1", label: "One" },
  { value: "2", label: "Two" },
  { value: "3", label: "Three" },
];

const values = data.map((obj) => obj.value);
```

2.

C'est un peu dommage d'utiliser async/await mais de ne pas utiliser la syntaxe try/catch qui va avec. Elle rend la gestion des erreurs plus lisible. J'ai aussi rajouté le message de l'erreur catch pour avoir plus de détails sur les raisons de l'erreur (code dertoure http, etc.)

```js
async function getIndexes() {
  return await fetch("https://api.coingecko.com/api/v3/indexes").then((res) =>
    res.json()
  );
}

async function analyzeIndexes() {
  try {
    return await getIndexes();
  } catch (error) {
    throw Error(`Unable to fetch indexes.\n${error.message}`);
  }
  return indexes;
}
```

3.

Plus concis comme ça. Le test de l'existence du User n'est vraiment utile que pour recupérer le projet ou non.

```js
const user = getUser();
const state = {
  user: user || null,
  project: user ? getProject(user.id) : null,
};
ctx.body = state;
```

4.

Il est inutile de tester si le provider existe si dans tous les cas on retourne null s'il n'est pas là.

```js
function getQueryProvider() {
  const url = window.location.href;
  const [_, provider] = url.match(/provider=([^&]*)/);
  return provider;
}
```

5.

Le forEach était ici inutile.

```js
function getParagraphTexts() {
  return document.querySelectorAll("p");
}
```

6.

Je ne vois pas de problème majeur.

```js
function Employee({ id }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState({});

  useEffect(() => {
    getEmployee(id)
      .then((employee) => {
        setEmployee(employee);
        setLoading(false);
      })
      .catch((_) => {
        setError("Unable to fetch employee");
        setLoading(false);
      });
  }, [id]);

  if (error) {
    return <Error />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Table>
      <Row>
        <Cell>{employee.firstName}</Cell>
        <Cell>{employee.lastName}</Cell>
        <Cell>{employee.position}</Cell>
        <Cell>{employee.project}</Cell>
        <Cell>{employee.salary}</Cell>
        <Cell>{employee.yearHired}</Cell>
        <Cell>{employee.wololo}</Cell>
      </Row>
    </Table>
  );
}
```

7.

La bloucle for revient à faire un filter sur les indexes. De plus await chacun des appels asynchrone à la suite ralentit la méthode puisqu'un seul est effectuer à la fois. L'utilisation de `Promise.all` permet d'éviter ça.

```js
async function getFilledIndexes() {
  try {
    const [indexes, status, usersid] = await Promise.all([
      getIndexes(),
      getStatus(),
      getUsersUd(),
    ]);
    return indexes.filter(
      (index) =>
        index.status === status.filled && usersId.includes(index.userId)
    );
  } catch (_) {
    throw new Error("Unable to get indexes");
  }
}
```

8.

L'utilisation de if embriqués est lourde pour des tests basiques d'existence. Une meilleure idée serait d'utiliser l'opérateur `&&` qui rend l'opération beaucoup plus lisible bien qu'équivalente.

```js
function getUserSettings(user) {
  const project = user && getProject(user.id);
  const settings = project && getSettings(project.id);
  return settings || {};
}
```
