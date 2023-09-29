// dummy data to use for testing
const nodes = [
    {
        desc: "Mathematical-logic system based on functions",
        id: "https://en.wikipedia.org/wiki/Lambda_calculus#Lambda_terms1",
        label: "Lambda calculus 1",
        time: 1687875662642 // today
    },
    {
        desc: "Mathematical-logic system based on functions",
        id: "https://en.wikipedia.org/wiki/Lambda_calculus#Lambda_terms2",
        label: "Lambda calculus 2",
        time: 1687875662642 // today
    },
    {
        desc: "Study of computation",
        id: "https://en.wikipedia.org/wiki/Computer_science1",
        label: "Computer science 1",
        time: 1687781992000 // 1 day and 2 hours ago
    },
    {
        desc: "Study of computation",
        id: "https://en.wikipedia.org/wiki/Computer_science2",
        label: "Computer science 2",
        time: 1687781992000 // 1 day and 2 hours ago
    },
    {
        desc: "Any type of calculation",
        id: "https://en.wikipedia.org/wiki/Computation",
        label: "Computation",
        time: 1687357192000 // 4 days ago x hours
    }
];
const links = [
    {
        source: "https://en.wikipedia.org/wiki/Lambda_calculus#Lambda_terms1",
        target: "https://en.wikipedia.org/wiki/Lambda_calculus#Lambda_terms2",
        time: 1687875662642,
    },
    {
        source: "https://en.wikipedia.org/wiki/Computer_science1",
        target: "https://en.wikipedia.org/wiki/Computer_science2",
        time: 1687781992000
    },
]
console.log(nodes);
console.log(links);