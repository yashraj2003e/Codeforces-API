const express = require("express");

const app = express();
app.use(express.json());
const port = 3000;

const requestOptions = {
  method: "GET",
  redirect: "follow",
};

async function fetchData(div) {
  try {
    const divName = {
      1: "Div. 1",
      2: "Div. 2",
      3: "Div. 3",
      4: "Div. 4",
    };

    const id1 = divName[div];

    const response = await fetch(
      "https://codeforces.com/api/contest.list?gym=false",
      requestOptions
    );
    const result = await response.json();

    const div2Contests = [];
    for (let i of result.result) {
      if (id1 === 2) {
        if (i.name.includes(id1) || i.name.includes("Educational")) {
          div2Contests.push(i.id);
        }
      } else {
        if (i.name.includes(id1)) {
          div2Contests.push(i.id);
        }
      }
    }

    return div2Contests;
  } catch (error) {
    console.error(error);
    return [];
  }
}

app.post("/api/topics", async (req, res) => {
  try {
    const { indexOfProblem, countOfProblems, div } = req.body;
    const contests = await fetchData(div);
    const problems = [];
    const response = await fetch(
      "https://codeforces.com/api/problemset.problems",
      requestOptions
    );
    const result = await response.json();

    let count = 0;
    for (let i of result.result.problems) {
      if (count == countOfProblems) break;
      if (contests.includes(i.contestId) && i.index == indexOfProblem) {
        problems.push({ name: i.name, rating: i.rating, tags: i.tags });
        count++;
      }
    }

    let topics = {};

    for (let k of problems) {
      for (let i of k.tags) {
        if (i in topics) {
          topics[i] += 1;
        } else {
          topics[i] = 1;
        }
      }
    }
    let entries = Object.entries(topics);
    entries.sort((a, b) => b[1] - a[1]);
    let sortedObj = Object.fromEntries(entries);
    res.json(sortedObj);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/ratingCounts", async (req, res) => {
  try {
    const { indexOfProblem, countOfProblems, div } = req.body;
    const contests = await fetchData(div);
    const problems = [];
    const response = await fetch(
      "https://codeforces.com/api/problemset.problems",
      requestOptions
    );
    const result = await response.json();

    let count = 0;
    for (let i of result.result.problems) {
      if (count == countOfProblems) break;
      if (contests.includes(i.contestId) && i.index == indexOfProblem) {
        // console.log(i.contestId);
        problems.push({ name: i.name, rating: i.rating, tags: i.tags });
        count++;
      }
    }

    let ratingCounts = {};

    for (let i of problems) {
      //   console.log(i.rating);
      if (i.rating in ratingCounts) {
        ratingCounts[i.rating] += 1;
      } else {
        ratingCounts[i.rating] = 1;
      }
    }
    let entries = Object.entries(ratingCounts);
    entries.sort((a, b) => b[1] - a[1]);
    let sortedObj = Object.fromEntries(entries);
    res.json(sortedObj);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/problems", async (req, res) => {
  try {
    const { indexOfProblem, countOfProblems, div } = req.body;
    const div2Contests = await fetchData(div);

    const problems = [];
    const response = await fetch(
      "https://codeforces.com/api/problemset.problems",
      requestOptions
    );
    const result = await response.json();

    let count = 0;
    for (let i of result.result.problems) {
      if (count == countOfProblems) break;
      if (div2Contests.includes(i.contestId) && i.index == indexOfProblem) {
        problems.push({ name: i.name, rating: i.rating, tags: i.tags });
        count++;
      }
    }

    res.json(problems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
