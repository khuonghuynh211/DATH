# Boolean Formula to BDD Generator

This project is a React + Vite web application that converts Boolean formulas into a reduced Binary Decision Diagram (BDD / ROBDD).

## Web functionality

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
