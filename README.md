# Boolean Formula to BDD Generator

This project is a React + Vite web application that converts Boolean formulas into a reduced Binary Decision Diagram (BDD / ROBDD).

## Added reference-based UI improvements

The web interface was improved to look and behave more like an interactive BDD visualization tool:

- Formula input panel
- Variable ordering input
- BDD operation builder
  - AND / Intersection
  - OR / Union
  - XOR
  - Equivalent
  - NOT / Complement
- Full-screen BDD graph area
- Zoom in, zoom out, and reset view
- PNG export
- Step-by-step construction panel
- Hover-based node details panel
- Explanation section describing the meaning of the BDD

## Supported Boolean syntax

```text
~       NOT
&       AND
|       OR
^       XOR
<->     Equivalent
(...)   Parentheses
x1,x2   Variables
0,1     Boolean constants
```

Example formulas:

```text
x1 & x2
x1 | x2
~x1
(x1 & x2) | x3
(~x2 & (x1 | x4)) <-> x3
```

## How to run

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

## How to test quickly

1. Enter formula: `x1 & x2`
2. Enter variable order: `x1,x2`
3. The correct BDD should show:
   - `x1 = 0` goes to terminal `0`
   - `x1 = 1` goes to `x2`
   - `x2 = 0` goes to terminal `0`
   - `x2 = 1` goes to terminal `1`

This means the formula is true only when both `x1` and `x2` are true.

## Latest UI changes

- Reset now clears the Boolean Formula input instead of restoring `x1 & x2`.
- BDD animation speed was slowed down so each construction step is easier to follow.
- Removed the BDD Explanation card and Reference-based Features card from the right panel.
- Step-by-step Construction now keeps previous steps visible and highlights the latest/current step.


Update: The Step-by-step Construction panel was removed. The right panel now only shows Node Details.
